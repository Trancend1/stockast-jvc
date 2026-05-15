import { describe, expect, it } from 'vitest';
import { clampDiscount, validatePromo } from '@/lib/rules/promo';
import { THRESHOLDS } from '@/lib/config/thresholds';

describe('validatePromo', () => {
  const baseInput = {
    outletId: 'outlet-1',
    serviceDate: '2026-05-15',
  };

  it('accepts a valid promo within both caps', () => {
    const r = validatePromo({ ...baseInput, discountPercent: 10, todayCount: 0 });
    expect(r.ok).toBe(true);
  });

  it('rejects when discount above cap', () => {
    const r = validatePromo({
      ...baseInput,
      discountPercent: THRESHOLDS.PROMO_DISCOUNT_CAP_PERCENT + 1,
      todayCount: 0,
    });
    expect(r).toEqual({ ok: false, reason: 'DISCOUNT_OVER_CAP' });
  });

  it('rejects when frequency cap already reached', () => {
    const r = validatePromo({
      ...baseInput,
      discountPercent: 5,
      todayCount: THRESHOLDS.PROMO_FREQUENCY_PER_DAY,
    });
    expect(r).toEqual({ ok: false, reason: 'FREQUENCY_EXCEEDED' });
  });

  it('rejects negative discount', () => {
    const r = validatePromo({ ...baseInput, discountPercent: -1, todayCount: 0 });
    expect(r).toEqual({ ok: false, reason: 'INVALID_INPUT' });
  });

  it('rejects NaN discount', () => {
    const r = validatePromo({ ...baseInput, discountPercent: Number.NaN, todayCount: 0 });
    expect(r).toEqual({ ok: false, reason: 'INVALID_INPUT' });
  });
});

describe('clampDiscount', () => {
  it('clamps above cap to cap', () => {
    expect(clampDiscount(99)).toBe(THRESHOLDS.PROMO_DISCOUNT_CAP_PERCENT);
  });
  it('preserves value at exactly cap', () => {
    expect(clampDiscount(THRESHOLDS.PROMO_DISCOUNT_CAP_PERCENT)).toBe(
      THRESHOLDS.PROMO_DISCOUNT_CAP_PERCENT,
    );
  });
  it('clamps negative to 0', () => {
    expect(clampDiscount(-5)).toBe(0);
  });
  it('clamps NaN to 0', () => {
    expect(clampDiscount(Number.NaN)).toBe(0);
  });
});
