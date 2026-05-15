/**
 * Subuh Mode time gate. Pure function.
 *
 * Active window: 02:00 — 05:30 Asia/Jakarta (UTC+7).
 * Source: .docs/DESIGN_SYSTEM.md §4 (Subuh Mode dark variant).
 *
 * Why dark window: Bu Yati belanja subuh 03:00-06:00 — screen dim + warm
 * tones reduce eye fatigue + battery drain on low-end Android.
 */

export const SUBUH_START_MINUTES = 2 * 60; // 02:00
export const SUBUH_END_MINUTES = 5 * 60 + 30; // 05:30

export function isSubuhTime(date: Date): boolean {
  const minutes = jakartaMinutesOfDay(date);
  return minutes >= SUBUH_START_MINUTES && minutes < SUBUH_END_MINUTES;
}

/**
 * Minutes since 00:00 in Asia/Jakarta (UTC+7), ignoring DST (Indonesia has none).
 */
export function jakartaMinutesOfDay(date: Date): number {
  const jakartaOffsetMs = 7 * 60 * 60 * 1000;
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const jakarta = new Date(utc + jakartaOffsetMs);
  return jakarta.getHours() * 60 + jakarta.getMinutes();
}
