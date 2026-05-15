import { describe, expect, it } from 'vitest';
import { isSubuhTime, jakartaMinutesOfDay } from '@/lib/subuh';

/**
 * Indonesia (WIB) is UTC+7 year-round (no DST).
 * Build a UTC timestamp that corresponds to a known Jakarta wall time so the
 * tests don't depend on the test runner's TZ.
 */
function jakartaTime(hour: number, minute: number): Date {
  // Want Asia/Jakarta = UTC + 7. So Date.UTC(hour - 7) gives matching wall clock.
  return new Date(Date.UTC(2026, 4, 16, hour - 7, minute));
}

describe('jakartaMinutesOfDay', () => {
  it('returns 0 at Jakarta midnight', () => {
    expect(jakartaMinutesOfDay(jakartaTime(0, 0))).toBe(0);
  });

  it('returns 120 at Jakarta 02:00', () => {
    expect(jakartaMinutesOfDay(jakartaTime(2, 0))).toBe(120);
  });

  it('returns 330 at Jakarta 05:30', () => {
    expect(jakartaMinutesOfDay(jakartaTime(5, 30))).toBe(330);
  });

  it('returns 720 at Jakarta noon', () => {
    expect(jakartaMinutesOfDay(jakartaTime(12, 0))).toBe(720);
  });
});

describe('isSubuhTime', () => {
  it('false at Jakarta 01:59', () => {
    expect(isSubuhTime(jakartaTime(1, 59))).toBe(false);
  });

  it('true at Jakarta 02:00 (boundary inclusive)', () => {
    expect(isSubuhTime(jakartaTime(2, 0))).toBe(true);
  });

  it('true at Jakarta 03:30', () => {
    expect(isSubuhTime(jakartaTime(3, 30))).toBe(true);
  });

  it('true at Jakarta 05:29', () => {
    expect(isSubuhTime(jakartaTime(5, 29))).toBe(true);
  });

  it('false at Jakarta 05:30 (boundary exclusive)', () => {
    expect(isSubuhTime(jakartaTime(5, 30))).toBe(false);
  });

  it('false at Jakarta 06:00', () => {
    expect(isSubuhTime(jakartaTime(6, 0))).toBe(false);
  });

  it('false at Jakarta noon', () => {
    expect(isSubuhTime(jakartaTime(12, 0))).toBe(false);
  });

  it('false at Jakarta 22:00 (late night, before window)', () => {
    expect(isSubuhTime(jakartaTime(22, 0))).toBe(false);
  });
});
