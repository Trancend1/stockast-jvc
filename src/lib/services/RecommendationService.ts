import 'server-only';
import { createHash } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { explainRecommendation } from '@/lib/ai/generate';
import { insertAIAuditLog } from '@/lib/db/queries/ai-audit';
import { listMenuItems } from '@/lib/db/queries/menu-items';
import { findRecommendation, upsertRecommendation } from '@/lib/db/queries/recommendations';
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

export type GetTomorrowRecommendationInput = {
  outletId: string;
  serviceDate: string;
  weather?: WeatherCategory;
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
  db: SupabaseClient,
  input: GetTomorrowRecommendationInput,
): Promise<BelanjaCardResult> {
  if (!input.forceRefresh) {
    try {
      const [existing, menuItemsForCache] = await Promise.all([
        findRecommendation(db, input.outletId, input.serviceDate),
        safeListMenuItems(db, input.outletId),
      ]);
      if (existing) {
        return toCachedResult(existing, menuItemsForCache);
      }
    } catch {
      // Best-effort cache hit. Fall through to recompute.
    }
  }

  let menuItems: MenuItemRow[];
  try {
    menuItems = await listMenuItems(db, input.outletId);
  } catch (err) {
    return { ok: false, reason: 'INTERNAL', message: errorMessage(err) };
  }
  if (menuItems.length === 0) {
    return { ok: false, reason: 'NO_MENU', message: 'Belum ada menu di warung ini.' };
  }

  let logs: StockLogShape[];
  try {
    logs = await fetchHistory(db, input.outletId);
  } catch (err) {
    return { ok: false, reason: 'INTERNAL', message: errorMessage(err) };
  }
  if (logs.length === 0) {
    return {
      ok: false,
      reason: 'NO_HISTORY',
      message: 'Catat stok dulu beberapa hari, baru rekomendasi muncul.',
    };
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

  let recommendationRow: { id: string };
  try {
    recommendationRow = await upsertRecommendation(db, {
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

  void writeAudit({
    outletId: input.outletId,
    entityId: recommendationRow.id,
    rawSource: reasoningByName.rawSource,
    meta: reasoningByName.auditMeta,
    rawResponse: reasoningByName.rawResponse,
  });

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

async function fetchHistory(db: SupabaseClient, outletId: string): Promise<StockLogShape[]> {
  const rows = await listRecentStockLogs(db, outletId, THRESHOLDS.HISTORY_WINDOW_DAYS);
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
  auditMeta: { promptVersion: string; model: string; latencyMs: number };
  rawResponse: Json | null;
  rawSource: string;
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

  const rawSource = JSON.stringify(args.items);

  if (!result.ok) {
    return {
      byItem: new Map(),
      summary: null,
      promptVersion: result.meta.promptVersion,
      succeeded: false,
      auditMeta: result.meta,
      rawResponse: null,
      rawSource,
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
    auditMeta: result.meta,
    rawResponse: result.data as unknown as Json,
    rawSource,
  };
}

function toCachedResult(
  existing: {
    items: Json;
    reasoning: string;
    confidence_label: Recommendation['confidenceLabel'];
    outlet_id: string;
    service_date: string;
  },
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

async function safeListMenuItems(db: SupabaseClient, outletId: string): Promise<MenuItemRow[]> {
  try {
    return await listMenuItems(db, outletId);
  } catch {
    return [];
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Terjadi kesalahan.';
}

function writeAudit(args: {
  outletId: string;
  entityId: string;
  rawSource: string;
  meta: { promptVersion: string; model: string; latencyMs: number };
  rawResponse: Json | null;
}): void {
  const hash = createHash('sha256').update(args.rawSource).digest('hex');
  insertAIAuditLog({
    outlet_id: args.outletId,
    entity_type: 'recommendation_generated',
    entity_id: args.entityId,
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

export type { StockLogItemRow };
