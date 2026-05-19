import { describe, expect, it } from 'vitest';
import {
  normalizeMenuName,
  normalizeOnboardingProfile,
  parseMenuList,
} from '@/lib/services/onboarding-profile';
import { THRESHOLDS } from '@/lib/config/thresholds';

describe('parseMenuList', () => {
  it('splits on comma, semicolon, newline', () => {
    expect(parseMenuList('lele, ayam; tahu\ntempe')).toEqual([
      'Lele',
      'Ayam',
      'Tahu',
      'Tempe',
    ]);
  });

  it('drops duplicates after normalization', () => {
    expect(parseMenuList('Lele Goreng, lele goreng, LELE  GORENG')).toEqual([
      'Lele Goreng',
    ]);
  });

  it('drops empty tokens and trims whitespace', () => {
    expect(parseMenuList('  , lele , , ayam ')).toEqual(['Lele', 'Ayam']);
  });

  it('caps at THRESHOLDS.ONBOARDING.MENU_ITEMS_MAX', () => {
    const tokens = Array.from({ length: 30 }, (_, i) => `Menu ${i}`).join(',');
    const result = parseMenuList(tokens);
    expect(result.length).toBe(THRESHOLDS.ONBOARDING.MENU_ITEMS_MAX);
  });

  it('drops items longer than MENU_NAME_MAX_CHARS', () => {
    const tooLong = 'a'.repeat(THRESHOLDS.MENU_NAME_MAX_CHARS + 1);
    const result = parseMenuList(`${tooLong},ayam`);
    expect(result).toEqual(['Ayam']);
  });
});

describe('normalizeMenuName', () => {
  it('lowercases and collapses whitespace', () => {
    expect(normalizeMenuName('  Ayam   Goreng  ')).toBe('ayam goreng');
  });

  it('strips punctuation', () => {
    expect(normalizeMenuName('Ayam-Goreng!')).toBe('ayam goreng');
  });
});

describe('normalizeOnboardingProfile', () => {
  it('returns INVALID_NAME for empty warung name', () => {
    const result = normalizeOnboardingProfile({
      warungName: '   ',
      location: 'salatiga',
      menu: 'ayam',
    });
    expect(result).toEqual({ error: 'INVALID_NAME' });
  });

  it('returns INVALID_LOCATION for empty location', () => {
    const result = normalizeOnboardingProfile({
      warungName: 'Warung Pak Adi',
      location: '',
      menu: 'ayam',
    });
    expect(result).toEqual({ error: 'INVALID_LOCATION' });
  });

  it('returns NO_MENU when parser yields nothing', () => {
    const result = normalizeOnboardingProfile({
      warungName: 'Warung Pak Adi',
      location: 'salatiga',
      menu: '   , ,,',
    });
    expect(result).toEqual({ error: 'NO_MENU' });
  });

  it('returns normalized profile on valid input', () => {
    const result = normalizeOnboardingProfile({
      warungName: '  Warung Pak Adi  ',
      location: 'salatiga',
      menu: 'Ayam Bakar, sate ayam, ayam bakar',
    });
    expect(result).toEqual({
      warungName: 'Warung Pak Adi',
      locationValue: 'salatiga',
      menuItems: [
        { name: 'Ayam Bakar', normalizedName: 'ayam bakar' },
        { name: 'Sate Ayam', normalizedName: 'sate ayam' },
      ],
    });
  });
});
