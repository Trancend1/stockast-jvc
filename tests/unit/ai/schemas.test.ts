import { describe, expect, it } from 'vitest';
import { ParsedStockPayloadSchema } from '@/lib/ai/schemas';

describe('ParsedStockPayloadSchema', () => {
  it('accepts a minimal valid payload', () => {
    const result = ParsedStockPayloadSchema.safeParse({
      items: [
        {
          candidateName: 'lele',
          sold: 25,
          leftover: 5,
          unit: 'ekor',
          confidence: 'high',
        },
      ],
      weatherMention: null,
      notes: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts weather mention enum values', () => {
    const result = ParsedStockPayloadSchema.safeParse({
      items: [{ candidateName: 'tahu', sold: null, leftover: 6, unit: null, confidence: 'medium' }],
      weatherMention: 'hujan_deras',
      notes: 'hujan sore',
    });
    expect(result.success).toBe(true);
  });

  it('rejects sold below zero', () => {
    const result = ParsedStockPayloadSchema.safeParse({
      items: [{ candidateName: 'lele', sold: -1, leftover: 0, unit: 'ekor', confidence: 'high' }],
      weatherMention: null,
      notes: null,
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty items array', () => {
    const result = ParsedStockPayloadSchema.safeParse({
      items: [],
      weatherMention: null,
      notes: null,
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown confidence label', () => {
    const result = ParsedStockPayloadSchema.safeParse({
      items: [
        {
          candidateName: 'lele',
          sold: 1,
          leftover: 1,
          unit: 'ekor',
          confidence: 'sangat-yakin',
        },
      ],
      weatherMention: null,
      notes: null,
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown weather mention', () => {
    const result = ParsedStockPayloadSchema.safeParse({
      items: [{ candidateName: 'lele', sold: 1, leftover: 0, unit: 'ekor', confidence: 'high' }],
      weatherMention: 'badai-pasir',
      notes: null,
    });
    expect(result.success).toBe(false);
  });

  it('rejects candidate name longer than 60 chars', () => {
    const result = ParsedStockPayloadSchema.safeParse({
      items: [
        {
          candidateName: 'x'.repeat(61),
          sold: 1,
          leftover: 0,
          unit: 'ekor',
          confidence: 'high',
        },
      ],
      weatherMention: null,
      notes: null,
    });
    expect(result.success).toBe(false);
  });
});
