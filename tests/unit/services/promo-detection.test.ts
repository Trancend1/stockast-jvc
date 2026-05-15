import { describe, expect, it } from 'vitest';
import {
  detectOverstock,
  OVERSTOCK_LEFTOVER_RATIO,
  OVERSTOCK_MIN_UNITS,
} from '@/lib/services/promo-detection';
import { THRESHOLDS } from '@/lib/config/thresholds';

const MENU = [
  { id: 'm-lele', name: 'Pecel Lele', normalized_name: 'pecel lele', unit: 'porsi' },
  { id: 'm-ayam', name: 'Ayam Goreng', normalized_name: 'ayam goreng', unit: 'porsi' },
];

describe('detectOverstock', () => {
  it('returns empty when latestLog is null', () => {
    expect(detectOverstock(MENU, null)).toEqual([]);
  });

  it('flags item with leftover ratio above threshold', () => {
    const result = detectOverstock(MENU, {
      service_date: '2026-05-14',
      items: [
        { menu_item_id: 'm-lele', sold: 15, leftover: 15, unit: 'porsi' }, // 50%
        { menu_item_id: 'm-ayam', sold: 25, leftover: 0, unit: 'porsi' },
      ],
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.menuItemId).toBe('m-lele');
  });

  it('ignores leftover below MIN_UNITS', () => {
    const result = detectOverstock(MENU, {
      service_date: '2026-05-14',
      items: [{ menu_item_id: 'm-lele', sold: 10, leftover: OVERSTOCK_MIN_UNITS - 1, unit: 'porsi' }],
    });
    expect(result).toEqual([]);
  });

  it('ignores ratio under threshold even with high leftover count', () => {
    // 5 leftover out of 100 total → 5% ratio, below 20% threshold
    const result = detectOverstock(MENU, {
      service_date: '2026-05-14',
      items: [{ menu_item_id: 'm-lele', sold: 95, leftover: 5, unit: 'porsi' }],
    });
    expect(result).toEqual([]);
  });

  it('caps suggested discount at THRESHOLDS.PROMO_DISCOUNT_CAP_PERCENT', () => {
    const result = detectOverstock(MENU, {
      service_date: '2026-05-14',
      items: [{ menu_item_id: 'm-lele', sold: 0, leftover: 20, unit: 'porsi' }],
    });
    expect(result[0]?.suggestedDiscountPercent).toBeLessThanOrEqual(
      THRESHOLDS.PROMO_DISCOUNT_CAP_PERCENT,
    );
  });

  it('sorts candidates by ratio descending', () => {
    const result = detectOverstock(MENU, {
      service_date: '2026-05-14',
      items: [
        { menu_item_id: 'm-lele', sold: 30, leftover: 10, unit: 'porsi' }, // 25%
        { menu_item_id: 'm-ayam', sold: 10, leftover: 20, unit: 'porsi' }, // 66%
      ],
    });
    expect(result[0]?.menuItemId).toBe('m-ayam');
    expect(result[1]?.menuItemId).toBe('m-lele');
  });

  it('uses configured threshold constant', () => {
    expect(OVERSTOCK_LEFTOVER_RATIO).toBeGreaterThan(0);
    expect(OVERSTOCK_LEFTOVER_RATIO).toBeLessThan(1);
  });
});
