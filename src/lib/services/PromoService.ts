import 'server-only';
import { generatePromoDraft } from '@/lib/ai/generate';
import { listMenuItems } from '@/lib/db/queries/menu-items';
import {
  countPromosToday,
  insertPromoDraft,
  markPromoCopied,
  type PromoDraftRow,
} from '@/lib/db/queries/promos';
import { listRecentStockLogs } from '@/lib/db/queries/stock-logs';
import { clampDiscount, validatePromo } from '@/lib/rules/promo';
import { detectOverstock, type OverstockCandidate } from './promo-detection';
import type { StockLogShape } from './recommendation-mapping';

/**
 * Overstock → promo draft pipeline.
 *
 * 1. Latest stock_log → detectOverstock (pure rule).
 * 2. For each candidate (top first), generatePromoDraft via Gemini.
 * 3. clampDiscount + validatePromo (defense in depth).
 * 4. Persist as promo_drafts row.
 *
 * Source: .docs/PRD.md §6 + FEATURE_PRIORITY_MATRIX.md.
 */

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

export async function generatePromosForLatestStock(args: {
  outletId: string;
  warungName: string;
  serviceDate: string;
}): Promise<PromoServiceResult> {
  let menuItems;
  let logs;
  try {
    menuItems = await listMenuItems(args.outletId);
    logs = await listRecentStockLogs(args.outletId, 2);
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

  // Promo frequency cap: count existing promos for this service_date and stop
  // once we hit PROMO_FREQUENCY_PER_DAY (1 by default). validatePromo enforces.
  let todayCount: number;
  try {
    todayCount = await countPromosToday(args.outletId, args.serviceDate);
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

    const draftResult = await buildOne(args, candidate);
    if (!draftResult) continue;
    out.push(draftResult);
  }

  if (out.length === 0) {
    return { ok: false, reason: 'NO_OVERSTOCK', message: 'Hari ini stok pas. Belum perlu promo.' };
  }
  return { ok: true, promos: out };
}

async function buildOne(
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
    row = await insertPromoDraft({
      outletId: args.outletId,
      serviceDate: args.serviceDate,
      message: finalMessage,
      discountPercent: finalDiscount,
    });
  } catch {
    return null;
  }

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

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : 'Terjadi kesalahan.';
}

export async function recordPromoCopied(promoId: string): Promise<void> {
  await markPromoCopied(promoId);
}
