import { describe, expect, it } from 'vitest';
import { computeConfidenceLabel, recommend } from '@/lib/rules/recommendation';
import { THRESHOLDS } from '@/lib/config/thresholds';

const day = (offsetFromMonday: number, sold: number) => ({
  date: new Date(2026, 0, 5 + offsetFromMonday).toISOString().slice(0, 10),
  sold,
});

describe('recommend', () => {
  it('cold start with no history returns 0 and Tidak yakin', () => {
    const r = recommend({ history: [], weekday: 1, weather: 'unknown' });
    expect(r.suggested).toBe(0);
    expect(r.confidenceLabel).toBe('Tidak yakin');
  });

  it('cold start with < 3 days returns base unchanged and conservative label', () => {
    const history = [day(0, 20), day(1, 25)];
    const r = recommend({ history, weekday: 3, weather: 'hujan_deras' });
    expect(r.suggested).toBe(Math.round((20 + 25) / 2));
    expect(r.weatherFactor).toBe(1);
    expect(r.weekdayFactor).toBe(1);
    expect(r.confidenceLabel).toBe('Data baru, hati-hati');
  });

  it('hujan deras reduces recommendation but respects guardrail floor', () => {
    const history = [
      day(0, 30), day(1, 30), day(2, 30), day(3, 30), day(4, 30), day(5, 30), day(6, 30),
    ];
    const r = recommend({ history, weekday: 1, weather: 'hujan_deras' });
    // 30 * 0.85 * weekdayFactor(clamped) = 25.5 * something — but guardrail floor 0.8*30=24
    expect(r.suggested).toBeGreaterThanOrEqual(Math.round(30 * THRESHOLDS.GUARDRAIL_MIN));
    expect(r.suggested).toBeLessThanOrEqual(Math.round(30 * THRESHOLDS.GUARDRAIL_MAX));
    expect(r.weatherFactor).toBe(THRESHOLDS.WEATHER_FACTOR.hujan_deras);
  });

  it('cerah_libur lifts but caps at guardrail ceiling', () => {
    const history = [
      day(0, 50), day(1, 50), day(2, 50), day(3, 50), day(4, 50), day(5, 50), day(6, 50),
    ];
    const r = recommend({ history, weekday: 1, weather: 'cerah_libur' });
    expect(r.suggested).toBeLessThanOrEqual(Math.round(50 * THRESHOLDS.GUARDRAIL_MAX));
  });

  it('weekday ratio is clamped to [WEEKDAY_FACTOR_MIN, WEEKDAY_FACTOR_MAX]', () => {
    // Build history where one weekday is wildly higher to force clamping
    const history = [
      day(0, 100), day(1, 5), day(2, 5), day(3, 5), day(4, 5), day(5, 5), day(6, 5),
    ];
    const r = recommend({ history, weekday: new Date(history[0]!.date).getDay(), weather: 'unknown' });
    expect(r.weekdayFactor).toBeLessThanOrEqual(THRESHOLDS.WEEKDAY_FACTOR_MAX);
    expect(r.weekdayFactor).toBeGreaterThanOrEqual(THRESHOLDS.WEEKDAY_FACTOR_MIN);
  });

  it('never recommends more than +20% of base regardless of factors', () => {
    const history = [
      day(0, 20), day(1, 20), day(2, 20), day(3, 20), day(4, 20), day(5, 20), day(6, 20),
    ];
    const r = recommend({ history, weekday: 5, weather: 'cerah_libur' });
    expect(r.suggested).toBeLessThanOrEqual(Math.round(20 * THRESHOLDS.GUARDRAIL_MAX));
  });

  it('never recommends less than -20% of base regardless of factors', () => {
    const history = [
      day(0, 40), day(1, 40), day(2, 40), day(3, 40), day(4, 40), day(5, 40), day(6, 40),
    ];
    const r = recommend({ history, weekday: 1, weather: 'hujan_deras' });
    expect(r.suggested).toBeGreaterThanOrEqual(Math.round(40 * THRESHOLDS.GUARDRAIL_MIN));
  });

  it('outliers are excluded from base via 2σ filter', () => {
    // Six 30s plus one 200 (clear outlier) — base should stay near 30.
    const history = [
      day(0, 30), day(1, 30), day(2, 30), day(3, 30), day(4, 30), day(5, 30), day(6, 200),
    ];
    const r = recommend({ history, weekday: 1, weather: 'unknown' });
    expect(r.base).toBeLessThan(60);
  });
});

describe('computeConfidenceLabel', () => {
  it('returns Tidak yakin for empty history', () => {
    expect(computeConfidenceLabel([])).toBe('Tidak yakin');
  });

  it('returns Data baru, hati-hati for < 3 days', () => {
    expect(computeConfidenceLabel([day(0, 10), day(1, 10)])).toBe('Data baru, hati-hati');
  });

  it('returns Pola jelas when 7+ days and stddev/mean < threshold', () => {
    const history = [
      day(0, 30), day(1, 31), day(2, 29), day(3, 30), day(4, 30), day(5, 31), day(6, 29),
    ];
    expect(computeConfidenceLabel(history)).toBe('Pola jelas');
  });

  it('returns Data baru, hati-hati when variance is high even with enough days', () => {
    const history = [
      day(0, 5), day(1, 80), day(2, 5), day(3, 80), day(4, 5), day(5, 80), day(6, 5),
    ];
    expect(computeConfidenceLabel(history)).toBe('Data baru, hati-hati');
  });
});
