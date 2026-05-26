import { ai, AI_MAX_RETRIES, AI_TIMEOUT_MS } from './client';
import {
  ExplainRecommendationSchema,
  EXPLAIN_RECOMMENDATION_RESPONSE_SCHEMA,
  ParsedStockPayloadSchema,
  PARSED_STOCK_RESPONSE_SCHEMA,
  PromoDraftSchema,
  PROMO_DRAFT_RESPONSE_SCHEMA,
} from './schemas';
import type {
  ExplainRecommendationFromAI,
  ParsedStockPayloadFromAI,
  PromoDraftFromAI,
} from './schemas';
import {
  PARSE_STOCK_PROMPT_VERSION,
  PARSE_STOCK_SYSTEM_INSTRUCTION,
  buildParseStockUserMessage,
} from './prompts/parse-stock-v1';
import {
  EXPLAIN_RECOMMENDATION_PROMPT_VERSION,
  EXPLAIN_RECOMMENDATION_SYSTEM_INSTRUCTION,
  buildExplainUserMessage,
  type ExplainPromptContext,
} from './prompts/explain-recommendation-v1';
import {
  PROMO_DRAFT_PROMPT_VERSION,
  PROMO_DRAFT_SYSTEM_INSTRUCTION,
  buildPromoUserMessage,
  type PromoPromptContext,
} from './prompts/promo-draft-v1';
import { THRESHOLDS } from '@/lib/config/thresholds';
import { createRequestId, logEvent } from '@/lib/observability';

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
  requestId: string;
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
  const requestId = createRequestId();

  const startedAt = Date.now();
  let attempts = 0;
  let lastError: AIFailureReason = 'API_ERROR';

  logEvent('ai_parse_start', {
    requestId,
    model,
    promptVersion: PARSE_STOCK_PROMPT_VERSION,
  });

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
        if (attempts < AI_MAX_RETRIES + 1) {
          await delay(backoffMsForAttempt(attempts));
        }
        continue;
      }

      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        lastError = 'JSON_PARSE_FAILED';
        if (attempts < AI_MAX_RETRIES + 1) {
          await delay(backoffMsForAttempt(attempts));
        }
        continue;
      }

      const parsed = ParsedStockPayloadSchema.safeParse(json);
      if (!parsed.success) {
        lastError = 'SCHEMA_VALIDATION_FAILED';
        if (attempts < AI_MAX_RETRIES + 1) {
          await delay(backoffMsForAttempt(attempts));
        }
        continue;
      }

      logEvent('ai_parse_end', {
        requestId,
        model,
        promptVersion: PARSE_STOCK_PROMPT_VERSION,
        latencyMs: Date.now() - startedAt,
        attempts,
        result: 'success',
      });
      return {
        ok: true,
        data: parsed.data,
        meta: {
          promptVersion: PARSE_STOCK_PROMPT_VERSION,
          model,
          latencyMs: Date.now() - startedAt,
          attempts,
          requestId,
        },
      };
    } catch (err) {
      lastError = err instanceof TimeoutError ? 'TIMEOUT' : 'API_ERROR';
    }

    if (attempts < AI_MAX_RETRIES + 1) {
      await delay(backoffMsForAttempt(attempts));
    }
  }

  logEvent(
    'ai_parse_failed',
    {
      requestId,
      model,
      promptVersion: PARSE_STOCK_PROMPT_VERSION,
      latencyMs: Date.now() - startedAt,
      attempts,
      failureReason: lastError,
    },
    'warn',
  );
  return {
    ok: false,
    reason: lastError,
    meta: {
      promptVersion: PARSE_STOCK_PROMPT_VERSION,
      model,
      latencyMs: Date.now() - startedAt,
      attempts,
      requestId,
    },
  };
}

export async function explainRecommendation(
  ctx: ExplainPromptContext,
): Promise<AIResult<ExplainRecommendationFromAI>> {
  return runJsonGenerate({
    promptVersion: EXPLAIN_RECOMMENDATION_PROMPT_VERSION,
    model: THRESHOLDS.AI_MODEL.EXPLAIN,
    systemInstruction: EXPLAIN_RECOMMENDATION_SYSTEM_INSTRUCTION,
    userMessage: buildExplainUserMessage(ctx),
    responseSchema: EXPLAIN_RECOMMENDATION_RESPONSE_SCHEMA,
    zodSchema: ExplainRecommendationSchema,
    temperature: 0.5,
  });
}

export async function generatePromoDraft(
  ctx: PromoPromptContext,
): Promise<AIResult<PromoDraftFromAI>> {
  return runJsonGenerate({
    promptVersion: PROMO_DRAFT_PROMPT_VERSION,
    model: THRESHOLDS.AI_MODEL.EXPLAIN,
    systemInstruction: PROMO_DRAFT_SYSTEM_INSTRUCTION,
    userMessage: buildPromoUserMessage(ctx),
    responseSchema: PROMO_DRAFT_RESPONSE_SCHEMA,
    zodSchema: PromoDraftSchema,
    temperature: 0.6,
  });
}

type JsonGenerateArgs<T> = {
  promptVersion: string;
  model: string;
  systemInstruction: string;
  userMessage: string;
  responseSchema: Record<string, unknown>;
  zodSchema: { safeParse: (v: unknown) => { success: true; data: T } | { success: false } };
  temperature: number;
};

async function runJsonGenerate<T>(args: JsonGenerateArgs<T>): Promise<AIResult<T>> {
  const startedAt = Date.now();
  let attempts = 0;
  let lastError: AIFailureReason = 'API_ERROR';
  const requestId = createRequestId();

  while (attempts < AI_MAX_RETRIES + 1) {
    attempts += 1;
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: args.model,
          contents: args.userMessage,
          config: {
            systemInstruction: args.systemInstruction,
            temperature: args.temperature,
            responseMimeType: 'application/json',
            responseSchema: args.responseSchema as Record<string, unknown>,
          },
        }),
        AI_TIMEOUT_MS,
      );

      const text = response.text;
      if (!text || text.trim().length === 0) {
        lastError = 'EMPTY_RESPONSE';
        if (attempts < AI_MAX_RETRIES + 1) {
          await delay(backoffMsForAttempt(attempts));
        }
        continue;
      }
      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        lastError = 'JSON_PARSE_FAILED';
        if (attempts < AI_MAX_RETRIES + 1) {
          await delay(backoffMsForAttempt(attempts));
        }
        continue;
      }
      const parsed = args.zodSchema.safeParse(json);
      if (!parsed.success) {
        lastError = 'SCHEMA_VALIDATION_FAILED';
        if (attempts < AI_MAX_RETRIES + 1) {
          await delay(backoffMsForAttempt(attempts));
        }
        continue;
      }
      return {
        ok: true,
        data: parsed.data,
        meta: {
          promptVersion: args.promptVersion,
          model: args.model,
          latencyMs: Date.now() - startedAt,
          attempts,
          requestId,
        },
      };
    } catch (err) {
      lastError = err instanceof TimeoutError ? 'TIMEOUT' : 'API_ERROR';
    }

    if (attempts < AI_MAX_RETRIES + 1) {
      await delay(backoffMsForAttempt(attempts));
    }
  }

  return {
    ok: false,
    reason: lastError,
    meta: {
      promptVersion: args.promptVersion,
      model: args.model,
      latencyMs: Date.now() - startedAt,
      attempts,
      requestId,
    },
  };
}

export function backoffMsForAttempt(attempt: number): number {
  if (attempt <= 1) return 250;
  return 500;
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
