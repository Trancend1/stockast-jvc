import { env } from '@/lib/config/env';
import { THRESHOLDS } from '@/lib/config/thresholds';

/**
 * AI provider abstraction. Supports Groq (primary) and Gemini (fallback).
 *
 * Provider selection:
 *   - GROQ_API_KEY set   → use Groq (llama-3.3-70b, free tier 14,400 req/day)
 *   - GEMINI_API_KEY set → use Gemini (gemini-2.0-flash)
 *
 * Both providers expose an OpenAI-compatible chat completions endpoint,
 * so the generate layer uses a single fetch-based client for both.
 *
 * Source: .docs/FOUNDATION_BLUEPRINT.md §1.4 (boundary rules).
 */

export type AIProvider = 'groq' | 'gemini';

export type AIClientConfig = {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  /** Model name to use for structured JSON parse tasks */
  parseModel: string;
  /** Model name to use for text generation tasks (explain, promo) */
  generateModel: string;
};

function resolveConfig(): AIClientConfig {
  if (env.GROQ_API_KEY) {
    return {
      provider: 'groq',
      apiKey: env.GROQ_API_KEY,
      baseUrl: 'https://api.groq.com/openai/v1',
      parseModel: 'llama-3.3-70b-versatile',
      generateModel: 'llama-3.3-70b-versatile',
    };
  }
  if (env.GEMINI_API_KEY) {
    return {
      provider: 'gemini',
      apiKey: env.GEMINI_API_KEY,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
      parseModel: 'gemini-2.0-flash',
      generateModel: 'gemini-2.0-flash',
    };
  }
  throw new Error('No AI provider configured. Set GROQ_API_KEY or GEMINI_API_KEY in .env.local.');
}

export const aiConfig = resolveConfig();

export const AI_TIMEOUT_MS = THRESHOLDS.AI_TIMEOUT_MS;
export const AI_MAX_RETRIES = THRESHOLDS.AI_MAX_RETRIES;

/**
 * OpenAI-compatible chat completions call.
 * Works with Groq, Gemini OpenAI-compat endpoint, and any OpenAI-compatible API.
 */
export async function chatComplete(args: {
  model: string;
  systemInstruction: string;
  userMessage: string;
  temperature: number;
  jsonMode: boolean;
  signal?: AbortSignal;
}): Promise<string> {
  const body: Record<string, unknown> = {
    model: args.model,
    messages: [
      { role: 'system', content: args.systemInstruction },
      { role: 'user', content: args.userMessage },
    ],
    temperature: args.temperature,
  };

  if (args.jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${aiConfig.apiKey}`,
    },
    body: JSON.stringify(body),
    signal: args.signal,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`AI API ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('AI API returned empty content');
  return content;
}
