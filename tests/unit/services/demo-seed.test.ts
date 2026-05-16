import { describe, expect, it } from 'vitest';
import { buildDemoSeedDays } from '@/lib/services/demo-seed';
import type { MenuItemRow } from '@/lib/db/types';

const MENU: MenuItemRow[] = [
  {
    id: 'm-lele',
    outlet_id: 'o-1',
    name: 'Pecel Lele',
    normalized_name: 'pecel lele',
    unit: 'porsi',
    deleted_at: null,
  },
  {
    id: 'm-ayam',
    outlet_id: 'o-1',
    name: 'Ayam Goreng',
    normalized_name: 'ayam goreng',
    unit: 'porsi',
    deleted_at: null,
  },
];

describe('buildDemoSeedDays', () => {
  it('returns empty when menu is empty', () => {
    expect(buildDemoSeedDays([], '2026-05-16')).toEqual([]);
  });

  it('returns daysBack entries with one row per menu item', () => {
    const rows = buildDemoSeedDays(MENU, '2026-05-16', 7);
    expect(rows).toHaveLength(7);
    for (const row of rows) {
      expect(row.items).toHaveLength(2);
      expect(row.items[0]?.menu_item_id).toBe('m-lele');
      expect(row.items[1]?.menu_item_id).toBe('m-ayam');
    }
  });

  it('produces dates strictly before the anchor', () => {
    const rows = buildDemoSeedDays(MENU, '2026-05-16', 7);
    for (const row of rows) {
      expect(row.service_date < '2026-05-16').toBe(true);
    }
  });

  it('produces dates spanning daysBack consecutive days', () => {
    const rows = buildDemoSeedDays(MENU, '2026-05-16', 7);
    const dates = rows.map((r) => r.service_date).sort();
    expect(dates).toEqual([
      '2026-05-09',
      '2026-05-10',
      '2026-05-11',
      '2026-05-12',
      '2026-05-13',
      '2026-05-14',
      '2026-05-15',
    ]);
  });

  it('is deterministic — same anchor produces same numbers', () => {
    const a = buildDemoSeedDays(MENU, '2026-05-16', 7);
    const b = buildDemoSeedDays(MENU, '2026-05-16', 7);
    expect(a).toEqual(b);
  });

  it('keeps sold and leftover non-negative integers', () => {
    const rows = buildDemoSeedDays(MENU, '2026-05-16', 7);
    for (const row of rows) {
      for (const item of row.items) {
        expect(Number.isInteger(item.sold)).toBe(true);
        expect(Number.isInteger(item.leftover)).toBe(true);
        expect(item.sold).toBeGreaterThanOrEqual(0);
        expect(item.leftover).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
