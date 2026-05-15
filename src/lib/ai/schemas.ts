import { z } from 'zod';

/**
 * Zod schemas for AI responses. Every Gemini output must pass through these
 * before persistence (per CLAUDE.md §3 — AI output is untrusted).
 *
 * Source: .docs/SYSTEM_ARCHITECTURE.md §2.3 (parse schema discipline).
 */

export const ParsedStockItemSchema = z.object({
  candidateName: z.string().min(1).max(60),
  sold: z.number().int().min(0).max(10_000).nullable(),
  leftover: z.number().int().min(0).max(10_000).nullable(),
  unit: z.string().min(1).max(20).nullable(),
  confidence: z.enum(['high', 'medium', 'low']),
});

export const WeatherMentionSchema = z
  .enum(['unknown', 'hujan_deras', 'mendung', 'cerah_libur'])
  .nullable();

export const ParsedStockPayloadSchema = z.object({
  items: z.array(ParsedStockItemSchema).min(1).max(20),
  weatherMention: WeatherMentionSchema,
  notes: z.string().max(500).nullable(),
});

export type ParsedStockPayloadFromAI = z.infer<typeof ParsedStockPayloadSchema>;

/**
 * JSON-schema shape passed to Gemini `responseSchema`. Kept in sync with the
 * Zod schema above by hand. If you edit one, edit both.
 */
export const PARSED_STOCK_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          candidateName: { type: 'string' },
          sold: { type: 'integer', nullable: true },
          leftover: { type: 'integer', nullable: true },
          unit: { type: 'string', nullable: true },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['candidateName', 'confidence'],
      },
    },
    weatherMention: {
      type: 'string',
      enum: ['unknown', 'hujan_deras', 'mendung', 'cerah_libur'],
      nullable: true,
    },
    notes: { type: 'string', nullable: true },
  },
  required: ['items'],
} as const;
