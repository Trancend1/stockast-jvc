import { describe, expect, it } from 'vitest';
import {
  computePolaMingguan,
  weekdayLabel,
  type PolaMingguanData,
} from '@/lib/services/pola-mingguan';
import type { MenuRef, StockLogShape } from '@/lib/services/recommendation-mapping';

const MENU: MenuRef[] = [
  { id: 'm-lele', name: 'Pecel Lele', normalized_name: 'pecel lele', unit: 'porsi' },
  { id: 'm-ayam', name: 'Ayam Goreng', normalized_name: 'ayam goreng', unit: 'porsi' },
];

function log(date: string, lele: number, ayam: number): StockLogShape {
  return {
    service_date: date,
    items: [
      { menu_item_id: 'm-lele', sold: lele, leftover: 0, unit: 'porsi' },
      { menu_item_id: 'm-ayam', sold: ayam, leftover: 0, unit: 'porsi' },
    ],
  };
}

describe('computePolaMingguan', () => {
  it('returns empty when no logs', () => {
    const result = computePolaMingguan(MENU, []);
    expect(result.items).toEqual([]);
    expect(result.insight).toBeNull();
  });

  it('returns one entry per menu, each with 7 bars', () => {
    const logs = [log('2026-05-08', 30, 25), log('2026-05-09', 31, 26)];
    const result = computePolaMingguan(MENU, logs);
    expect(result.items).toHaveLength(2);
    for (const item of result.items) {
      expect(item.bars).toHaveLength(7);
      expect(item.bars.map((b) => b.weekday)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    }
  });

  it('aggregates avg sold per weekday across multiple weeks', () => {
    // 2026-05-08 is a Friday (weekday=5). Use two Fridays to test averaging.
    const logs = [
      log('2026-05-08', 30, 25), // Fri
      log('2026-05-15', 40, 30), // Fri
      log('2026-05-09', 20, 22), // Sat
    ];
    const result = computePolaMingguan(MENU, logs);
    const lele = result.items.find((i) => i.menuItemId === 'm-lele');
    const friBar = lele?.bars.find((b) => b.weekday === 5);
    expect(friBar?.avgSold).toBe(35);
    expect(friBar?.samples).toBe(2);
  });

  it('bars for weekdays without data have 0 avgSold and 0 samples', () => {
    const logs = [log('2026-05-08', 30, 25)]; // Friday only
    const result = computePolaMingguan(MENU, logs);
    const lele = result.items.find((i) => i.menuItemId === 'm-lele');
    const monBar = lele?.bars.find((b) => b.weekday === 1);
    expect(monBar?.avgSold).toBe(0);
    expect(monBar?.samples).toBe(0);
  });

  it('surfaces a weekday insight when delta exceeds threshold', () => {
    // Lele: 28-30 most days, 60 on Fridays (well above 15% threshold).
    const logs = [
      log('2026-05-04', 28, 25), // Mon
      log('2026-05-05', 29, 24), // Tue
      log('2026-05-06', 30, 25), // Wed
      log('2026-05-07', 28, 26), // Thu
      log('2026-05-08', 60, 24), // Fri — outlier
      log('2026-05-09', 28, 25), // Sat
      log('2026-05-10', 29, 26), // Sun
    ];
    const result: PolaMingguanData = computePolaMingguan(MENU, logs);
    expect(result.insight).not.toBeNull();
    expect(result.insight?.menuName).toBe('Pecel Lele');
    expect(result.insight?.weekday).toBe(5);
    expect(result.insight?.direction).toBe('up');
  });

  it('returns no insight when sales are flat', () => {
    const logs = Array.from({ length: 7 }, (_, i) =>
      log(`2026-05-${String(8 + i).padStart(2, '0')}`, 30, 25),
    );
    const result = computePolaMingguan(MENU, logs);
    expect(result.insight).toBeNull();
  });
});

describe('weekdayLabel', () => {
  it('maps 0..6 to Indonesian weekday names', () => {
    expect(weekdayLabel(0)).toBe('Minggu');
    expect(weekdayLabel(5)).toBe('Jumat');
    expect(weekdayLabel(6)).toBe('Sabtu');
  });
});
