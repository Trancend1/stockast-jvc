import { describe, expect, it } from 'vitest';
import { buildExplainUserMessage } from '@/lib/ai/prompts/explain-recommendation-v1';
import { buildPromoUserMessage } from '@/lib/ai/prompts/promo-draft-v1';
import { buildParseStockUserMessage } from '@/lib/ai/prompts/parse-stock-v1';

describe('buildParseStockUserMessage', () => {
  it('includes known menu names when provided', () => {
    const out = buildParseStockUserMessage('lele sisa 5', ['Pecel Lele', 'Ayam']);
    expect(out).toContain('Pecel Lele');
    expect(out).toContain('Ayam');
    expect(out).toContain('lele sisa 5');
  });

  it('uses fallback line when menu list empty', () => {
    const out = buildParseStockUserMessage('lele sisa 5', []);
    expect(out).toContain('belum diketahui');
  });
});

describe('buildExplainUserMessage', () => {
  it('writes one bullet per item with diff direction', () => {
    const out = buildExplainUserMessage({
      weather: 'mendung',
      weekdayLabel: 'Jumat',
      items: [
        {
          itemName: 'Pecel Lele',
          base: 30,
          suggested: 33,
          weatherFactor: 0.95,
          weekdayFactor: 1.1,
          leftoverYesterday: 2,
        },
        {
          itemName: 'Ayam Goreng',
          base: 25,
          suggested: 22,
          weatherFactor: 0.95,
          weekdayFactor: 1.05,
          leftoverYesterday: null,
        },
      ],
    });
    expect(out).toContain('Jumat');
    expect(out).toContain('mendung');
    expect(out).toContain('Pecel Lele');
    expect(out).toContain('+3');
    expect(out).toContain('−3');
    expect(out).toContain('sisa kemarin 2');
  });
});

describe('buildPromoUserMessage', () => {
  it('includes warung name, item, leftover, and discount', () => {
    const out = buildPromoUserMessage({
      warungName: 'Warung Bu Yati',
      itemName: 'Pecel Lele',
      leftover: 8,
      unit: 'porsi',
      suggestedDiscountPercent: 10,
    });
    expect(out).toContain('Warung Bu Yati');
    expect(out).toContain('Pecel Lele');
    expect(out).toContain('8 porsi');
    expect(out).toContain('10%');
  });
});
