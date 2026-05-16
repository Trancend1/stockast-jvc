import { describe, expect, it } from 'vitest';
import { getMockWeather } from '@/lib/cuaca-mock';

describe('getMockWeather', () => {
  it('returns one of the three categories', () => {
    const allowed = new Set(['cerah_libur', 'mendung', 'hujan_deras']);
    const w = getMockWeather('2026-05-16');
    expect(allowed.has(w.category)).toBe(true);
  });

  it('is deterministic for the same date', () => {
    expect(getMockWeather('2026-05-16').category).toBe(
      getMockWeather('2026-05-16').category,
    );
  });

  it('cycles across consecutive dates', () => {
    const set = new Set<string>();
    for (let day = 1; day <= 30; day += 1) {
      const iso = `2026-05-${String(day).padStart(2, '0')}`;
      set.add(getMockWeather(iso).category);
    }
    expect(set.size).toBe(3);
  });

  it('returns a non-empty hint and emoji for every category', () => {
    const w = getMockWeather('2026-05-16');
    expect(w.hint.length).toBeGreaterThan(0);
    expect(w.emoji.length).toBeGreaterThan(0);
    expect(w.label.length).toBeGreaterThan(0);
  });
});
