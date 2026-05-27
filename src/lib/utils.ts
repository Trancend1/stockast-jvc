/**
 * Minimal class concatenation. Filters out falsy values.
 * No clsx/tailwind-merge yet — add when conditional classes proliferate.
 */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ');
}

/** Indonesian weekday labels indexed by Date.getUTCDay() / getDay() — 0 = Minggu. */
export const WEEKDAY_LABELS_ID = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
] as const;

/**
 * Returns the YYYY-MM-DD for "tomorrow" anchored to the host clock but rendered
 * in UTC so the result is timezone-independent. Used by Server Actions that
 * key the Belanja Card on a service_date column.
 */
export function tomorrowIsoUtc(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** YYYY-MM-DD for "today" in UTC. */
export function todayIsoUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * YYYY-MM-DD for "today" in WIB (Asia/Jakarta, UTC+7).
 * Use for any date that represents a merchant's business day — merchants
 * operate in WIB, so at 23:00 WIB it's still "today" for them even though
 * UTC has already rolled over to tomorrow.
 */
export function todayIsoWib(): string {
  const now = new Date();
  now.setTime(now.getTime() + 7 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

/**
 * Parse a YYYY-MM-DD service date as UTC midnight. Use this instead of
 * `new Date(iso)` or `new Date(iso + 'T00:00:00')` whenever you call
 * `.getDay()` or `.getDate()` on the result — those local-time accessors
 * can return wrong values on hosts whose offset crosses the date boundary.
 */
export function parseServiceDateUtc(iso: string): Date {
  return new Date(iso + 'T00:00:00Z');
}

/** Asia/Jakarta-equivalent weekday for a service date string. */
export function weekdayFromServiceDate(iso: string): number {
  return parseServiceDateUtc(iso).getUTCDay();
}
