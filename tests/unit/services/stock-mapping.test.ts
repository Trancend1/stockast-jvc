import { describe, expect, it } from 'vitest';
import { mapToDomainPayload, matchMenuItem } from '@/lib/services/stock-mapping';

const MENU = [
  { id: 'm-lele', name: 'Pecel Lele', normalized_name: 'pecel lele', unit: 'porsi' },
  { id: 'm-ayam', name: 'Ayam Goreng', normalized_name: 'ayam goreng', unit: 'porsi' },
  { id: 'm-tahu', name: 'Tahu Goreng', normalized_name: 'tahu goreng', unit: 'porsi' },
];

describe('matchMenuItem', () => {
  it('matches exact normalized name', () => {
    expect(matchMenuItem('pecel lele', MENU)?.id).toBe('m-lele');
  });

  it('matches case-insensitive', () => {
    expect(matchMenuItem('Pecel Lele', MENU)?.id).toBe('m-lele');
  });

  it('matches partial — candidate substring of menu', () => {
    expect(matchMenuItem('lele', MENU)?.id).toBe('m-lele');
  });

  it('matches partial — menu substring of candidate', () => {
    expect(matchMenuItem('ayam goreng krispi', MENU)?.id).toBe('m-ayam');
  });

  it('returns null when no match', () => {
    expect(matchMenuItem('bakso', MENU)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(matchMenuItem('   ', MENU)).toBeNull();
  });
});

describe('mapToDomainPayload', () => {
  it('maps AI items to menu IDs and preserves fields', () => {
    const result = mapToDomainPayload(
      {
        items: [
          { candidateName: 'lele', sold: 25, leftover: 5, unit: 'ekor', confidence: 'high' },
          { candidateName: 'soto', sold: 10, leftover: 0, unit: null, confidence: 'low' },
        ],
        weatherMention: 'mendung',
        notes: 'sore agak sepi',
      },
      MENU,
    );

    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toMatchObject({
      menuItemId: 'm-lele',
      candidateName: 'lele',
      sold: 25,
      leftover: 5,
      unit: 'ekor',
      confidence: 'high',
    });
    expect(result.items[1]).toMatchObject({
      menuItemId: null,
      candidateName: 'soto',
      unit: 'porsi',
    });
    expect(result.weatherMention).toBe('mendung');
    expect(result.notes).toBe('sore agak sepi');
  });

  it('falls back to menu unit when AI unit is null', () => {
    const result = mapToDomainPayload(
      {
        items: [
          { candidateName: 'tahu goreng', sold: 30, leftover: 6, unit: null, confidence: 'medium' },
        ],
        weatherMention: null,
        notes: null,
      },
      MENU,
    );
    expect(result.items[0]?.unit).toBe('porsi');
  });
});
