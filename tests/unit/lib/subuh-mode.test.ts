import { describe, expect, it } from 'vitest';
import { resolveSubuhMode } from '@/lib/subuh-mode';

function jakartaTime(hour: number, minute: number): Date {
  return new Date(Date.UTC(2026, 0, 1, hour - 7, minute, 0));
}

describe('resolveSubuhMode', () => {
  it('lets manual on override win outside subuh hours', () => {
    expect(resolveSubuhMode('on', jakartaTime(12, 0))).toBe(true);
  });

  it('lets manual off override win during subuh hours', () => {
    expect(resolveSubuhMode('off', jakartaTime(3, 0))).toBe(false);
  });

  it('falls back to the Jakarta time gate when no override exists', () => {
    expect(resolveSubuhMode(null, jakartaTime(3, 0))).toBe(true);
    expect(resolveSubuhMode(null, jakartaTime(6, 0))).toBe(false);
  });
});
