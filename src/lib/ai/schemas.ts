import { z } from 'zod';

/**
 * Zod schemas for AI responses. Every AI output must pass through these
 * before persistence (per CLAUDE.md §3 — AI output is untrusted).
 *
 * Source: .docs/SYSTEM_ARCHITECTURE.md §2.3 (parse schema discipline).
 *
 * Note: Gemini-specific `responseSchema` JSON-schema constants have been
 * removed. The app now uses Groq (OpenAI-compatible) with `json_object`
 * mode — structured output is enforced by the system prompt + Zod validation,
 * not by a provider-specific schema object.
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

// ──────────────────────────────────────────────────────────────────────────
// Explain recommendation

export const ExplainItemSchema = z.object({
  itemName: z.string().min(1).max(60),
  reasoning: z.string().min(1).max(120),
});

export const ExplainRecommendationSchema = z.object({
  items: z.array(ExplainItemSchema).min(1).max(20),
  summary: z.string().min(1).max(160),
});

export type ExplainRecommendationFromAI = z.infer<typeof ExplainRecommendationSchema>;

// ──────────────────────────────────────────────────────────────────────────
// Promo draft

export const PromoDraftSchema = z.object({
  message: z.string().min(1).max(300),
  discountPercent: z.number().int().min(0).max(15),
});

export type PromoDraftFromAI = z.infer<typeof PromoDraftSchema>;
