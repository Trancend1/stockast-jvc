import { THRESHOLDS, type WeatherCategory } from '@/lib/config/thresholds';
import type { ConfidenceLabel } from '@/types/domain';
import { clamp, rollingAverage, stddev, weekdayRatio, type HistoryPoint } from './stock';

/**
 * Rule-based recommendation engine. AI is forbidden from deciding numbers —
 * the AI layer only writes reasoning text *after* this function decides.
 *
 * Formula (locked, see .docs/SYSTEM_ARCHITECTURE.md §4):
 *   suggested = round( base * weatherFactor * weekdayFactor )
 *   constrained to [GUARDRAIL_MIN * base, GUARDRAIL_MAX * base]
 */

export type RecommendInput = {
  history: readonly HistoryPoint[];
  weekday: number;          // 0=Sunday … 6=Saturday (JS Date.getDay)
  weather: WeatherCategory;
};

export type RecommendResult = {
  base: number;
  weatherFactor: number;
  weekdayFactor: number;
  suggested: number;
  confidenceLabel: ConfidenceLabel;
};

export function recommend(input: RecommendInput): RecommendResult {
  const base = rollingAverage(input.history);
  const confidenceLabel = computeConfidenceLabel(input.history);

  // Cold start — under threshold of historical depth.
  if (input.history.length < THRESHOLDS.COLD_START_DAYS || base === 0) {
    return {
      base,
      weatherFactor: 1,
      weekdayFactor: 1,
      suggested: Math.round(base),
      confidenceLabel,
    };
  }

  const weatherFactor = THRESHOLDS.WEATHER_FACTOR[input.weather];
  const weekdayFactor = clamp(
    weekdayRatio(input.history, input.weekday),
    THRESHOLDS.WEEKDAY_FACTOR_MIN,
    THRESHOLDS.WEEKDAY_FACTOR_MAX,
  );

  const raw = base * weatherFactor * weekdayFactor;
  const bounded = clamp(raw, base * THRESHOLDS.GUARDRAIL_MIN, base * THRESHOLDS.GUARDRAIL_MAX);

  return {
    base,
    weatherFactor,
    weekdayFactor,
    suggested: Math.round(bounded),
    confidenceLabel,
  };
}

export function computeConfidenceLabel(history: readonly HistoryPoint[]): ConfidenceLabel {
  if (history.length < 1) return 'Tidak yakin';
  if (history.length < THRESHOLDS.COLD_START_DAYS) return 'Data baru, hati-hati';

  const values = history.map((p) => p.sold);
  const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
  if (mean === 0) return 'Data baru, hati-hati';

  const ratio = stddev(values) / mean;
  if (history.length >= THRESHOLDS.HISTORY_WINDOW_DAYS && ratio < THRESHOLDS.PATTERN_CLEAR_STDDEV_RATIO) {
    return 'Pola jelas';
  }
  return 'Data baru, hati-hati';
}
