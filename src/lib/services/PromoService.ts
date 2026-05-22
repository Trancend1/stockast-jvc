import 'server-only';
import { createHash } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { generatePromoDraft } from '@/lib/ai/generate';
import { insertAIAuditLog } from '@/lib/db/queries/ai-audit';
import { listMenuItems } from '@/lib/db/queries/menu-items';
import {
  countPromosToday,
  insertPromoDraft,
  markPromoCopied,
  type PromoDraftRow,
} from '@/lib/db/queries/promos';
import { listRecentStockLogs } from '@/lib/db/queries/stock-logs';
import { clampDiscount, validatePromo } from '@/lib/rules/promo';
import type { Json } from '@/lib/db/types';
import { detectOverstock, type OverstockCandidate } from './promo-detection';
import type { StockLogShape } from './recommendation-mapping';

export type PromoSuggestion = {
  promoId: string;
  menuItemId: string;
  menuName: string;
  leftover: number;
  unit: string;
  discountPercent: number;
  message: string;
};

export type PromoServiceResult =
  | { ok: true; promos: PromoSuggestion[] }
  | { ok: false; reason: 'NO_OVERSTOCK' | 'INTERNAL'; message: string };

export async function generatePromosForLatestStock(
  db: SupabaseClient,
  args: {
    outletId: string;
    warungName: string;
    serviceDate: string;
  },
): Promise<PromoServiceResult> {
  let menuItems;
  let logs;
  try {
    menuItems = await listMenuItems(db, args.outletId);
    logs = await listRecentStockLogs(db, args.outletId, 2);
  } catch (err) {
    return { ok: false, reason: 'INTERNAL', message: errMsg(err) };
  }

  const latest: StockLogShape | null = logs[0]
    ? {
        service_date: logs[0].service_date,
        items: logs[0].items as unknown as StockLogShape['items'],
      }
    : null;

  const candidates = detectOverstock(menuItems, latest);
  if (candidates.length === 0) {
    return { ok: false, reason: 'NO_OVERSTOCK', message: 'Hari ini stok pas. Belum perlu promo.' };
  }

  let todayCount: number;
  try {
    todayCount = await countPromosToday(db, args.outletId, args.serviceDate);
  } catch (err) {
    return { ok: false, reason: 'INTERNAL', message: errMsg(err) };
  }

  const out: PromoSuggestion[] = [];
  for (const candidate of candidates) {
    const validation = validatePromo({
      outletId: args.outletId,
      serviceDate: args.serviceDate,
      discountPercent: candidate.suggestedDiscountPercent,
      todayCount: todayCount + out.length,
    });
    if (!validation.ok) break;

    const draftResult = await buildOne(db, args, candidate);
    if (!draftResult) continue;
    out.push(draftResult);
  }

  if (out.length === 0) {
    return { ok: false, reason: 'NO_OVERSTOCK', message: 'Hari ini stok pas. Belum perlu promo.' };
  }
  return { ok: true, promos: out };
}

async function buildOne(
  db: SupabaseClient,
  args: { outletId: string; warungName: string; serviceDate: string },
  candidate: OverstockCandidate,
): Promise<PromoSuggestion | null> {
  const aiResult = await generatePromoDraft({
    warungName: args.warungName,
    itemName: candidate.menuName,
    leftover: candidate.leftover,
    unit: candidate.unit,
    suggestedDiscountPercent: candidate.suggestedDiscountPercent,
  });

  const finalDiscount = clampDiscount(
    aiResult.ok ? aiResult.data.discountPercent : candidate.suggestedDiscountPercent,
  );
  const finalMessage = aiResult.ok
    ? aiResult.data.message
    : buildFallbackMessage(candidate, finalDiscount);

  let row: PromoDraftRow;
  try {
    row = await insertPromoDraft(db, {
      outletId: args.outletId,
      serviceDate: args.serviceDate,
      message: finalMessage,
      discountPercent: finalDiscount,
    });
  } catch {
    return null;
  }

  void writePromoAudit({
    outletId: args.outletId,
    entityId: row.id,
    rawSource: JSON.stringify({
      itemName: candidate.menuName,
      leftover: candidate.leftover,
      unit: candidate.unit,
      suggestedDiscountPercent: candidate.suggestedDiscountPercent,
    }),
    meta: aiResult.meta,
    rawResponse: aiResult.ok ? (aiResult.data as unknown as Json) : null,
  });

  return {
    promoId: row.id,
    menuItemId: candidate.menuItemId,
    menuName: candidate.menuName,
    leftover: candidate.leftover,
    unit: candidate.unit,
    discountPercent: finalDiscount,
    message: finalMessage,
  };
}

function buildFallbackMessage(c: OverstockCandidate, discount: number): string {
  const discountLine = discount > 0 ? ` Diskon ${discount}% sore ini.` : '';
  return `Halo! ${c.menuName} masih segar, sisa ${c.leftover} ${c.unit}.${discountLine} Yuk mampir 🍗`;
}

function writePromoAudit(args: {
  outletId: string;
  entityId: string;
  rawSource: string;
  meta: { promptVersion: string; model: string; latencyMs: number };
  rawResponse: Json | null;
}): void {
  const hash = createHash('sha256').update(args.rawSource).digest('hex');
  insertAIAuditLog({
    outlet_id: args.outletId,
    entity_type: 'promo_generated',
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

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : 'Terjadi kesalahan.';
}

export async function recordPromoCopied(db: SupabaseClient, promoId: string): Promise<void> {
  await markPromoCopied(db, promoId);
}
