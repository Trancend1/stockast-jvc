import type { WeatherCategory } from '@/lib/config/thresholds';

/**
 * Cuaca mock — Phase 1.5 only, replaced by real BMKG in Phase 2.
 *
 * 3-state cycling keyed on the date so demo runs see different weather day to
 * day, but the same day always returns the same state (idempotent for
 * recommendation cache).
 */

export type MockWeather = {
  category: WeatherCategory;
  label: string;
  hint: string;
  emoji: string;
};

const CYCLE: MockWeather[] = [
  {
    category: 'cerah_libur',
    label: 'Cerah',
    hint: 'Pelanggan kemungkinan ramai, siapin stok agak banyak.',
    emoji: '☀️',
  },
  {
    category: 'mendung',
    label: 'Mendung',
    hint: 'Bisa hujan ringan, sediakan stok seperti biasa.',
    emoji: '⛅',
  },
  {
    category: 'hujan_deras',
    label: 'Hujan deras',
    hint: 'Biasanya sepi 15-20%, kurangi sedikit ya.',
    emoji: '🌧️',
  },
];

export function getMockWeather(serviceDate: string): MockWeather {
  const idx = hashCycleIndex(serviceDate, CYCLE.length);
  return CYCLE[idx] as MockWeather;
}

function hashCycleIndex(seed: string, mod: number): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0;
  }
  return h % mod;
}
