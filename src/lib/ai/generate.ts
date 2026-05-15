import { ai, AI_MAX_RETRIES, AI_TIMEOUT_MS } from './client';
import { ParsedStockPayloadSchema, PARSED_STOCK_RESPONSE_SCHEMA } from './schemas';
import type { ParsedStockPayloadFromAI } from './schemas';
import {
  PARSE_STOCK_PROMPT_VERSION,
  PARSE_STOCK_SYSTEM_INSTRUCTION,
  buildParseStockUserMessage,
} from './prompts/parse-stock-v1';
import { THRESHOLDS } from '@/lib/config/thresholds';

/**
 * AI wrappers. All Gemini I/O lives here. Services never instantiate the SDK
 * directly. Every call returns a discriminated result so the caller can branch
 * without try/catch.
 *
 * Source: .docs/FOUNDATION_BLUEPRINT.md §1.3 (boundary rules).
 */

export type AIResult<T> =
  | { ok: true; data: T; meta: AIResultMeta }
  | { ok: false; reason: AIFailureReason; meta: AIResultMeta };

export type AIFailureReason =
  | 'TIMEOUT'
  | 'API_ERROR'
  | 'EMPTY_RESPONSE'
  | 'JSON_PARSE_FAILED'
  | 'SCHEMA_VALIDATION_FAILED';

export type AIResultMeta = {
  promptVersion: string;
  model: string;
  latencyMs: number;
  attempts: number;
};

export type ParseStockInput = {
  rawInput: string;
  knownMenu: readonly string[];
};

export async function parseStockNote(
  input: ParseStockInput,
): Promise<AIResult<ParsedStockPayloadFromAI>> {
  const model = THRESHOLDS.AI_MODEL.PARSE;
  const userMessage = buildParseStockUserMessage(input.rawInput, input.knownMenu);

  const startedAt = Date.now();
  let attempts = 0;
  let lastError: AIFailureReason = 'API_ERROR';

  while (attempts < AI_MAX_RETRIES + 1) {
    attempts += 1;
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: userMessage,
          config: {
            systemInstruction: PARSE_STOCK_SYSTEM_INSTRUCTION,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: PARSED_STOCK_RESPONSE_SCHEMA as unknown as Record<string, unknown>,
          },
        }),
        AI_TIMEOUT_MS,
      );

      const text = response.text;
      if (!text || text.trim().length === 0) {
        lastError = 'EMPTY_RESPONSE';
        continue;
      }

      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        lastError = 'JSON_PARSE_FAILED';
        continue;
      }

      const parsed = ParsedStockPayloadSchema.safeParse(json);
      if (!parsed.success) {
        lastError = 'SCHEMA_VALIDATION_FAILED';
        continue;
      }

      return {
        ok: true,
        data: parsed.data,
        meta: {
          promptVersion: PARSE_STOCK_PROMPT_VERSION,
          model,
          latencyMs: Date.now() - startedAt,
          attempts,
        },
      };
    } catch (err) {
      lastError = err instanceof TimeoutError ? 'TIMEOUT' : 'API_ERROR';
    }
  }

  return {
    ok: false,
    reason: lastError,
    meta: {
      promptVersion: PARSE_STOCK_PROMPT_VERSION,
      model,
      latencyMs: Date.now() - startedAt,
      attempts,
    },
  };
}

class TimeoutError extends Error {
  constructor() {
    super('AI request timed out');
    this.name = 'TimeoutError';
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError()), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}
