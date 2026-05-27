import { createRequestId, logEvent } from '@/lib/observability';
import { AI_MAX_RETRIES, AI_TIMEOUT_MS, aiConfig, chatComplete } from './client';
import {
  EXPLAIN_RECOMMENDATION_PROMPT_VERSION,
  EXPLAIN_RECOMMENDATION_SYSTEM_INSTRUCTION,
  buildExplainUserMessage,
  type ExplainPromptContext,
} from './prompts/explain-recommendation-v1';
import {
  PARSE_STOCK_PROMPT_VERSION,
  PARSE_STOCK_SYSTEM_INSTRUCTION,
  buildParseStockUserMessage,
} from './prompts/parse-stock-v1';
import {
  PROMO_DRAFT_PROMPT_VERSION,
  PROMO_DRAFT_SYSTEM_INSTRUCTION,
  buildPromoUserMessage,
  type PromoPromptContext,
} from './prompts/promo-draft-v1';
import type {
  ExplainRecommendationFromAI,
  ParsedStockPayloadFromAI,
  PromoDraftFromAI,
} from './schemas';
import { ExplainRecommendationSchema, ParsedStockPayloadSchema, PromoDraftSchema } from './schemas';

/**
 * AI wrappers. All provider I/O lives here. Services never call the AI
 * client directly. Every call returns a discriminated result so the caller
 * can branch without try/catch.
 *
 * Provider is resolved once at boot in client.ts (Groq → Gemini fallback).
 *
 * Source: .docs/FOUNDATION_BLUEPRINT.md §1.3 (boundary rules).
 */

export type AIResult<T> =
  | { ok: true; data: T; meta: AIResultMeta }
  | { ok: false; reason: AIFailureReason; meta: AIResultMeta };

export type AIFailureReason =
  | 'TIMEOUT'
  | 'API_ERROR'
  | 'QUOTA_EXCEEDED'
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
  const model = aiConfig.parseModel;
  const userMessage = buildParseStockUserMessage(input.rawInput, input.knownMenu);
  const requestId = createRequestId();
  const startedAt = Date.now();
  let attempts = 0;
  let lastError: AIFailureReason = 'API_ERROR';

  logEvent('ai_parse_start', {
    requestId,
    model,
    provider: aiConfig.provider,
    promptVersion: PARSE_STOCK_PROMPT_VERSION,
  });

  while (attempts < AI_MAX_RETRIES + 1) {
    attempts += 1;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    try {
      const text = await chatComplete({
        model,
        systemInstruction: PARSE_STOCK_SYSTEM_INSTRUCTION,
        userMessage,
        temperature: 0.2,
        jsonMode: true,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!text || text.trim().length === 0) {
        lastError = 'EMPTY_RESPONSE';
        if (attempts < AI_MAX_RETRIES + 1) await delay(backoffMsForAttempt(attempts));
        continue;
      }

      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        lastError = 'JSON_PARSE_FAILED';
        if (attempts < AI_MAX_RETRIES + 1) await delay(backoffMsForAttempt(attempts));
        continue;
      }

      const parsed = ParsedStockPayloadSchema.safeParse(json);
      if (!parsed.success) {
        lastError = 'SCHEMA_VALIDATION_FAILED';
        if (attempts < AI_MAX_RETRIES + 1) await delay(backoffMsForAttempt(attempts));
        continue;
      }

      logEvent('ai_parse_end', {
        requestId,
        model,
        provider: aiConfig.provider,
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
      clearTimeout(timer);
      if (isAbortError(err)) {
        lastError = 'TIMEOUT';
      } else if (isQuotaError(err)) {
        lastError = 'QUOTA_EXCEEDED';
        break;
      } else {
        lastError = 'API_ERROR';
      }
    }

    if (attempts < AI_MAX_RETRIES + 1) await delay(backoffMsForAttempt(attempts));
  }

  logEvent(
    'ai_parse_failed',
    {
      requestId,
      model,
      provider: aiConfig.provider,
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
    model: aiConfig.generateModel,
    systemInstruction: EXPLAIN_RECOMMENDATION_SYSTEM_INSTRUCTION,
    userMessage: buildExplainUserMessage(ctx),
    zodSchema: ExplainRecommendationSchema,
    temperature: 0.5,
  });
}

export async function generatePromoDraft(
  ctx: PromoPromptContext,
): Promise<AIResult<PromoDraftFromAI>> {
  return runJsonGenerate({
    promptVersion: PROMO_DRAFT_PROMPT_VERSION,
    model: aiConfig.generateModel,
    systemInstruction: PROMO_DRAFT_SYSTEM_INSTRUCTION,
    userMessage: buildPromoUserMessage(ctx),
    zodSchema: PromoDraftSchema,
    temperature: 0.6,
  });
}

type JsonGenerateArgs<T> = {
  promptVersion: string;
  model: string;
  systemInstruction: string;
  userMessage: string;
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
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    try {
      const text = await chatComplete({
        model: args.model,
        systemInstruction: args.systemInstruction,
        userMessage: args.userMessage,
        temperature: args.temperature,
        jsonMode: true,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!text || text.trim().length === 0) {
        lastError = 'EMPTY_RESPONSE';
        if (attempts < AI_MAX_RETRIES + 1) await delay(backoffMsForAttempt(attempts));
        continue;
      }
      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        lastError = 'JSON_PARSE_FAILED';
        if (attempts < AI_MAX_RETRIES + 1) await delay(backoffMsForAttempt(attempts));
        continue;
      }
      const parsed = args.zodSchema.safeParse(json);
      if (!parsed.success) {
        lastError = 'SCHEMA_VALIDATION_FAILED';
        if (attempts < AI_MAX_RETRIES + 1) await delay(backoffMsForAttempt(attempts));
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
      clearTimeout(timer);
      if (isAbortError(err)) {
        lastError = 'TIMEOUT';
      } else if (isQuotaError(err)) {
        lastError = 'QUOTA_EXCEEDED';
        break;
      } else {
        lastError = 'API_ERROR';
      }
    }

    if (attempts < AI_MAX_RETRIES + 1) await delay(backoffMsForAttempt(attempts));
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

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('quota') ||
    msg.includes('rate_limit_exceeded') ||
    msg.includes('rate limit')
  );
}

function isAbortError(err: unknown): boolean {
  return err instanceof Error && (err.name === 'AbortError' || err.message.includes('aborted'));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
