import { THRESHOLDS } from '@/lib/config/thresholds';

/**
 * Promo guardrails — pure functions, no I/O.
 * Source: .docs/PRD.md §6 + .docs/FEATURE_PRIORITY_MATRIX.md §2 (promo card).
 *
 * The product promise: pedagang stays in control. AI never writes a promo
 * with a discount above the cap or more often than the frequency cap.
 */

export type PromoCandidate = {
  outletId: string;
  serviceDate: string;
  discountPercent: number;
  todayCount: number;        // promos already issued for this (outletId, serviceDate)
};

export type PromoValidation =
  | { ok: true }
  | { ok: false; reason: 'DISCOUNT_OVER_CAP' | 'FREQUENCY_EXCEEDED' | 'INVALID_INPUT' };

export function validatePromo(input: PromoCandidate): PromoValidation {
  if (
    !Number.isFinite(input.discountPercent) ||
    input.discountPercent < 0 ||
    !Number.isFinite(input.todayCount) ||
    input.todayCount < 0
  ) {
    return { ok: false, reason: 'INVALID_INPUT' };
  }

  if (input.discountPercent > THRESHOLDS.PROMO_DISCOUNT_CAP_PERCENT) {
    return { ok: false, reason: 'DISCOUNT_OVER_CAP' };
  }

  if (input.todayCount >= THRESHOLDS.PROMO_FREQUENCY_PER_DAY) {
    return { ok: false, reason: 'FREQUENCY_EXCEEDED' };
  }

  return { ok: true };
}

/**
 * Clamp discount into [0, cap]. Used to defensively trim AI-suggested discounts
 * before persistence — Zod schema also enforces this.
 */
export function clampDiscount(percent: number): number {
  if (!Number.isFinite(percent) || percent < 0) return 0;
  return Math.min(percent, THRESHOLDS.PROMO_DISCOUNT_CAP_PERCENT);
}
