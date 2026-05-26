import { describe, expect, it } from 'vitest';
import {
  computeRecommendations,
  indonesianWeekdayLabel,
  type StockLogShape,
} from '@/lib/services/recommendation-mapping';

const MENU = [
  { id: 'm-lele', name: 'Pecel Lele', normalized_name: 'pecel lele', unit: 'porsi' },
  { id: 'm-ayam', name: 'Ayam Goreng', normalized_name: 'ayam goreng', unit: 'porsi' },
];

function makeLog(date: string, lele: number, ayam: number, leftoverLele = 0): StockLogShape {
  return {
    service_date: date,
    items: [
      { menu_item_id: 'm-lele', sold: lele, leftover: leftoverLele, unit: 'porsi' },
      { menu_item_id: 'm-ayam', sold: ayam, leftover: 0, unit: 'porsi' },
    ],
  };
}

describe('computeRecommendations', () => {
  it('returns one item per menu', () => {
    const logs = [
      makeLog('2026-05-08', 30, 25),
      makeLog('2026-05-09', 31, 24),
      makeLog('2026-05-10', 29, 26),
      makeLog('2026-05-11', 30, 25),
      makeLog('2026-05-12', 32, 24),
      makeLog('2026-05-13', 30, 25),
      makeLog('2026-05-14', 29, 26),
    ];
    const result = computeRecommendations({
      menuItems: MENU,
      logs,
      weekday: 5,
      weather: 'unknown',
    });
    expect(result.items).toHaveLength(2);
    expect(result.items[0]?.menuItemId).toBe('m-lele');
  });

  it('cold-start when history shorter than COLD_START_DAYS', () => {
    const logs = [makeLog('2026-05-14', 30, 25)];
    const result = computeRecommendations({
      menuItems: MENU,
      logs,
      weekday: 5,
      weather: 'unknown',
    });
    expect(result.confidenceLabel).not.toBe('Pola jelas');
    expect(result.items[0]?.weatherFactor).toBe(1);
    expect(result.items[0]?.weekdayFactor).toBe(1);
  });

  it('records leftoverYesterday from latest log', () => {
    const logs = [makeLog('2026-05-13', 30, 25, 0), makeLog('2026-05-14', 25, 24, 5)];
    const result = computeRecommendations({
      menuItems: MENU,
      logs,
      weekday: 5,
      weather: 'unknown',
    });
    expect(result.leftoverYesterday.get('m-lele')).toBe(5);
    expect(result.leftoverYesterday.get('m-ayam')).toBe(0);
  });

  it('weather hujan_deras reduces suggested below base', () => {
    const logs = Array.from({ length: 7 }, (_, i) =>
      makeLog(`2026-05-${String(8 + i).padStart(2, '0')}`, 30, 25),
    );
    const result = computeRecommendations({
      menuItems: MENU,
      logs,
      weekday: 5,
      weather: 'hujan_deras',
    });
    const lele = result.items.find((it) => it.menuItemId === 'm-lele');
    expect(lele).toBeDefined();
    expect(lele!.suggested).toBeLessThan(lele!.base);
  });

  it('weather overlay favors warm fried items over cold drinks during heavy rain', () => {
    const menu = [
      { id: 'm-goreng', name: 'Ayam Goreng', normalized_name: 'ayam goreng', unit: 'porsi' },
      { id: 'm-es', name: 'Es Teh', normalized_name: 'es teh', unit: 'gelas' },
    ];
    const logs = Array.from({ length: 7 }, (_, i) => ({
      service_date: `2026-05-${String(8 + i).padStart(2, '0')}`,
      items: [
        { menu_item_id: 'm-goreng', sold: 20, leftover: 0, unit: 'porsi' },
        { menu_item_id: 'm-es', sold: 20, leftover: 0, unit: 'gelas' },
      ],
    }));

    const result = computeRecommendations({
      menuItems: menu,
      logs,
      weekday: 5,
      weather: 'hujan_deras',
    });

    const goreng = result.items.find((it) => it.menuItemId === 'm-goreng');
    const es = result.items.find((it) => it.menuItemId === 'm-es');
    expect(goreng).toBeDefined();
    expect(es).toBeDefined();
    expect(goreng!.suggested).toBeGreaterThan(es!.suggested);
  });

  it('weather overlay favors cold drinks on cerah_libur days', () => {
    const menu = [
      { id: 'm-neutral', name: 'Nasi Uduk', normalized_name: 'nasi uduk', unit: 'porsi' },
      { id: 'm-es', name: 'Es Jeruk', normalized_name: 'es jeruk', unit: 'gelas' },
    ];
    const logs = Array.from({ length: 7 }, (_, i) => ({
      service_date: `2026-05-${String(8 + i).padStart(2, '0')}`,
      items: [
        { menu_item_id: 'm-neutral', sold: 20, leftover: 0, unit: 'porsi' },
        { menu_item_id: 'm-es', sold: 20, leftover: 0, unit: 'gelas' },
      ],
    }));

    const result = computeRecommendations({
      menuItems: menu,
      logs,
      weekday: 0,
      weather: 'cerah_libur',
    });

    const neutral = result.items.find((it) => it.menuItemId === 'm-neutral');
    const es = result.items.find((it) => it.menuItemId === 'm-es');
    expect(neutral).toBeDefined();
    expect(es).toBeDefined();
    expect(es!.suggested).toBeGreaterThan(neutral!.suggested);
  });

  it('downgrades to worst per-item confidence label', () => {
    const logs = [makeLog('2026-05-14', 30, 25)];
    const result = computeRecommendations({
      menuItems: [
        ...MENU,
        { id: 'm-new', name: 'Menu Baru', normalized_name: 'menu baru', unit: 'porsi' },
      ],
      logs,
      weekday: 5,
      weather: 'unknown',
    });
    // m-new has no history points → 'Tidak yakin'
    expect(result.confidenceLabel).toBe('Tidak yakin');
  });
});

describe('indonesianWeekdayLabel', () => {
  it('maps 0..6 to Indonesian names', () => {
    expect(indonesianWeekdayLabel(0)).toBe('Minggu');
    expect(indonesianWeekdayLabel(1)).toBe('Senin');
    expect(indonesianWeekdayLabel(5)).toBe('Jumat');
    expect(indonesianWeekdayLabel(6)).toBe('Sabtu');
  });
});
