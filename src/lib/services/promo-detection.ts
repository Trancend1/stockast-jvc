import { THRESHOLDS } from '@/lib/config/thresholds';
import type { MenuRef, StockLogShape } from './recommendation-mapping';

/**
 * Pure overstock detection. Decides which menu items deserve a promo draft.
 * No I/O, no AI — separated from PromoService so unit tests are trivial.
 *
 * Rule (locked):
 *   leftover ratio = leftover / (sold + leftover)
 *   eligible if leftover ratio > OVERSTOCK_THRESHOLD AND leftover >= MIN_UNITS
 *
 * Suggested discount scales with leftover ratio, clamped by clampDiscount
 * downstream in rules/promo.ts. Cap is enforced both here and at validation
 * time (defense in depth).
 */

export const OVERSTOCK_LEFTOVER_RATIO = 0.2; // 20%+ leftover triggers promo
export const OVERSTOCK_MIN_UNITS = 3;

export type OverstockCandidate = {
  menuItemId: string;
  menuName: string;
  unit: string;
  leftover: number;
  sold: number;
  ratio: number;
  suggestedDiscountPercent: number;
};

export function detectOverstock(
  menuItems: ReadonlyArray<MenuRef>,
  latestLog: StockLogShape | null,
): OverstockCandidate[] {
  if (!latestLog) return [];

  const out: OverstockCandidate[] = [];
  for (const item of latestLog.items) {
    if (item.leftover < OVERSTOCK_MIN_UNITS) continue;
    const total = item.sold + item.leftover;
    if (total === 0) continue;
    const ratio = item.leftover / total;
    if (ratio < OVERSTOCK_LEFTOVER_RATIO) continue;

    const menu = menuItems.find((m) => m.id === item.menu_item_id);
    if (!menu) continue;

    out.push({
      menuItemId: item.menu_item_id,
      menuName: menu.name,
      unit: menu.unit ?? item.unit ?? 'porsi',
      leftover: item.leftover,
      sold: item.sold,
      ratio,
      suggestedDiscountPercent: suggestDiscount(ratio),
    });
  }
  return out.sort((a, b) => b.ratio - a.ratio);
}

function suggestDiscount(ratio: number): number {
  // 20% leftover → 5% off
  // 30% leftover → 10% off
  // 40%+ leftover → 15% off (cap)
  const raw = Math.round((ratio - 0.15) * 80);
  return Math.max(0, Math.min(raw, THRESHOLDS.PROMO_DISCOUNT_CAP_PERCENT));
}
