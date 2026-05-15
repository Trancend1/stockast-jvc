import 'server-only';
import { createHash } from 'node:crypto';
import { explainRecommendation } from '@/lib/ai/generate';
import { insertAIAuditLog } from '@/lib/db/queries/ai-audit';
import { listMenuItems } from '@/lib/db/queries/menu-items';
import {
  findRecommendation,
  upsertRecommendation,
} from '@/lib/db/queries/recommendations';
import { listRecentStockLogs } from '@/lib/db/queries/stock-logs';
import type { Json, MenuItemRow, StockLogItemRow } from '@/lib/db/types';
import type { Recommendation, RecommendationItem } from '@/types/domain';
import type { WeatherCategory } from '@/lib/config/thresholds';
import { THRESHOLDS } from '@/lib/config/thresholds';
import {
  computeRecommendations,
  indonesianWeekdayLabel,
  type StockLogShape,
} from './recommendation-mapping';

/**
 * Orchestrate Belanja Card build:
 *   stock_logs (7d) → rules.recommend per menu → AI explain → persist + return
 *
 * Source: .docs/SYSTEM_ARCHITECTURE.md §6 (RecommendationService).
 */

export type GetTomorrowRecommendationInput = {
  outletId: string;
  serviceDate: string; // YYYY-MM-DD — the date the Belanja Card is FOR
  weather?: WeatherCategory; // Phase 1 mock: defaults to 'unknown'
  forceRefresh?: boolean;
};

export type BelanjaCardItem = {
  menuItemId: string;
  menuName: string;
  unit: string;
  base: number;
  suggested: number;
  leftoverYesterday: number | null;
  confidenceLabel: RecommendationItem['confidenceLabel'];
  reasoning: string;
};

export type BelanjaCardResult =
  | {
      ok: true;
      data: {
        outletId: string;
        serviceDate: string;
        items: BelanjaCardItem[];
        summary: string;
        confidenceLabel: Recommendation['confidenceLabel'];
        cached: boolean;
      };
    }
  | { ok: false; reason: 'NO_MENU' | 'NO_HISTORY' | 'INTERNAL'; message: string };

export async function getTomorrowRecommendation(
  input: GetTomorrowRecommendationInput,
): Promise<BelanjaCardResult> {
  if (!input.forceRefresh) {
    try {
      const existing = await findRecommendation(input.outletId, input.serviceDate);
      if (existing) {
        return toCachedResult(existing, await safeListMenuItems(input.outletId));
      }
    } catch {
      // Best-effort cache hit. Fall through to recompute.
    }
  }

  let menuItems: MenuItemRow[];
  try {
    menuItems = await listMenuItems(input.outletId);
  } catch (err) {
    return { ok: false, reason: 'INTERNAL', message: errorMessage(err) };
  }
  if (menuItems.length === 0) {
    return { ok: false, reason: 'NO_MENU', message: 'Belum ada menu di warung ini.' };
  }

  let logs: StockLogShape[];
  try {
    logs = await fetchHistory(input.outletId);
  } catch (err) {
    return { ok: false, reason: 'INTERNAL', message: errorMessage(err) };
  }
  if (logs.length === 0) {
    return { ok: false, reason: 'NO_HISTORY', message: 'Catat stok dulu beberapa hari, baru rekomendasi muncul.' };
  }

  const weekday = new Date(input.serviceDate + 'T00:00:00').getDay();
  const weather: WeatherCategory = input.weather ?? 'unknown';

  const computed = computeRecommendations({
    menuItems,
    logs,
    weekday,
    weather,
  });

  const reasoningByName = await runExplain({
    weather,
    weekdayLabel: indonesianWeekdayLabel(weekday),
    items: computed.items.map((it) => {
      const menu = menuItems.find((m) => m.id === it.menuItemId);
      return {
        itemName: menu?.name ?? 'item',
        base: it.base,
        suggested: it.suggested,
        weatherFactor: it.weatherFactor,
        weekdayFactor: it.weekdayFactor,
        leftoverYesterday: computed.leftoverYesterday.get(it.menuItemId) ?? null,
      };
    }),
    outletId: input.outletId,
  });

  const cards: BelanjaCardItem[] = computed.items.map((it) => {
    const menu = menuItems.find((m) => m.id === it.menuItemId);
    const name = menu?.name ?? 'item';
    return {
      menuItemId: it.menuItemId,
      menuName: name,
      unit: menu?.unit ?? 'porsi',
      base: it.base,
      suggested: it.suggested,
      leftoverYesterday: computed.leftoverYesterday.get(it.menuItemId) ?? null,
      confidenceLabel: it.confidenceLabel,
      reasoning: reasoningByName.byItem.get(name) ?? defaultReasoning(it.suggested, it.base),
    };
  });

  const summary = reasoningByName.summary ?? defaultSummary(cards.length);

  const audit = {
    weather,
    weekday,
    promptVersion: reasoningByName.promptVersion,
    explainSucceeded: reasoningByName.succeeded,
  } as const;

  try {
    await upsertRecommendation({
      outletId: input.outletId,
      serviceDate: input.serviceDate,
      items: cards as unknown as Json,
      reasoning: summary,
      confidenceLabel: computed.confidenceLabel,
      audit: audit as unknown as Json,
    });
  } catch (err) {
    return { ok: false, reason: 'INTERNAL', message: errorMessage(err) };
  }

  return {
    ok: true,
    data: {
      outletId: input.outletId,
      serviceDate: input.serviceDate,
      items: cards,
      summary,
      confidenceLabel: computed.confidenceLabel,
      cached: false,
    },
  };
}

async function fetchHistory(outletId: string): Promise<StockLogShape[]> {
  const rows = await listRecentStockLogs(outletId, THRESHOLDS.HISTORY_WINDOW_DAYS);
  return rows.map((r) => ({
    service_date: r.service_date,
    items: r.items as unknown as Array<{
      menu_item_id: string;
      sold: number;
      leftover: number;
      unit: string;
    }>,
  }));
}

type ExplainOutcome = {
  byItem: Map<string, string>;
  summary: string | null;
  promptVersion: string | null;
  succeeded: boolean;
};

async function runExplain(args: {
  weather: WeatherCategory;
  weekdayLabel: string;
  outletId: string;
  items: Array<{
    itemName: string;
    base: number;
    suggested: number;
    weatherFactor: number;
    weekdayFactor: number;
    leftoverYesterday: number | null;
  }>;
}): Promise<ExplainOutcome> {
  const result = await explainRecommendation({
    weather: args.weather,
    weekdayLabel: args.weekdayLabel,
    items: args.items,
  });

  void writeAudit({
    outletId: args.outletId,
    rawSource: JSON.stringify(args.items),
    meta: result.meta,
    rawResponse: result.ok ? (result.data as unknown as Json) : null,
  });

  if (!result.ok) {
    return {
      byItem: new Map(),
      summary: null,
      promptVersion: result.meta.promptVersion,
      succeeded: false,
    };
  }

  const map = new Map<string, string>();
  for (const item of result.data.items) {
    map.set(item.itemName, item.reasoning);
  }
  return {
    byItem: map,
    summary: result.data.summary,
    promptVersion: result.meta.promptVersion,
    succeeded: true,
  };
}

function toCachedResult(
  existing: { items: Json; reasoning: string; confidence_label: Recommendation['confidenceLabel']; outlet_id: string; service_date: string },
  menuItems: MenuItemRow[],
): BelanjaCardResult {
  const items = existing.items as unknown as BelanjaCardItem[];
  const enriched: BelanjaCardItem[] = items.map((it) => {
    const menu = menuItems.find((m) => m.id === it.menuItemId);
    return {
      ...it,
      menuName: menu?.name ?? it.menuName,
      unit: menu?.unit ?? it.unit,
    };
  });
  return {
    ok: true,
    data: {
      outletId: existing.outlet_id,
      serviceDate: existing.service_date,
      items: enriched,
      summary: existing.reasoning,
      confidenceLabel: existing.confidence_label,
      cached: true,
    },
  };
}

function defaultReasoning(suggested: number, base: number): string {
  if (suggested > base) return 'Naik tipis sesuai pola minggu ini.';
  if (suggested < base) return 'Sedikit lebih hemat dari rata-rata.';
  return 'Sesuai pola minggu ini.';
}

function defaultSummary(count: number): string {
  if (count === 0) return 'Belum ada rekomendasi.';
  return 'Belanja besok sesuai pola minggu ini, aman aja.';
}

async function safeListMenuItems(outletId: string): Promise<MenuItemRow[]> {
  try {
    return await listMenuItems(outletId);
  } catch {
    return [];
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Terjadi kesalahan.';
}

function writeAudit(args: {
  outletId: string;
  rawSource: string;
  meta: { promptVersion: string; model: string; latencyMs: number };
  rawResponse: Json | null;
}): void {
  const hash = createHash('sha256').update(args.rawSource).digest('hex');
  insertAIAuditLog({
    outlet_id: args.outletId,
    entity_type: 'recommendation',
    entity_id: null,
    prompt_version: args.meta.promptVersion,
    model: args.meta.model,
    raw_input_hash: hash,
    raw_response: args.rawResponse,
    latency_ms: args.meta.latencyMs,
    cost_usd: null,
  }).catch(() => {
    /* best-effort */
  });
}

// Re-export shape for UI components.
export type { StockLogItemRow };
