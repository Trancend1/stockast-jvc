import { THRESHOLDS } from '@/lib/config/thresholds';

/**
 * Pure functions over historical stock data. No I/O, no DB, no AI.
 * Source: .docs/SYSTEM_ARCHITECTURE.md §4 (recommendation formula inputs).
 */

export type HistoryPoint = { date: string; sold: number };

/**
 * Rolling average of `sold` over the last N days (default 7), with outliers
 * outside ±2σ excluded. Returns 0 if no points survive.
 */
export function rollingAverage(
  history: readonly HistoryPoint[],
  windowDays: number = THRESHOLDS.HISTORY_WINDOW_DAYS,
): number {
  if (history.length === 0) return 0;

  const window = history.slice(-windowDays);
  const values = window.map((p) => p.sold);
  const filtered = excludeOutliers(values, THRESHOLDS.OUTLIER_SIGMA);
  if (filtered.length === 0) return 0;

  const sum = filtered.reduce((acc, v) => acc + v, 0);
  return sum / filtered.length;
}

/**
 * Same-weekday ratio: average of (sold / overall-base) on the requested weekday.
 * Used as a seasonal multiplier on the base recommendation.
 */
export function weekdayRatio(history: readonly HistoryPoint[], weekday: number): number {
  if (history.length === 0) return 1;

  const base = rollingAverage(history);
  if (base === 0) return 1;

  const matching = history.filter((p) => new Date(p.date + 'T00:00:00Z').getUTCDay() === weekday);
  if (matching.length === 0) return 1;

  const ratios = matching.map((p) => p.sold / base);
  const sum = ratios.reduce((acc, v) => acc + v, 0);
  return sum / ratios.length;
}

/**
 * Standard deviation of a value array. Returns 0 for empty/single-element arrays.
 */
export function stddev(values: readonly number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Excludes values outside `sigmas` standard deviations from the mean.
 */
export function excludeOutliers(values: readonly number[], sigmas: number): number[] {
  if (values.length < 3) return [...values];
  const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
  const sd = stddev(values);
  if (sd === 0) return [...values];
  return values.filter((v) => Math.abs(v - mean) <= sigmas * sd);
}

/**
 * Clamp a number into [min, max].
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}
