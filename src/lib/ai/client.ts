import { GoogleGenAI } from '@google/genai';
import { env } from '@/lib/config/env';
import { THRESHOLDS } from '@/lib/config/thresholds';

/**
 * Single Gemini client instance for the whole server runtime.
 * Source: .docs/SYSTEM_ARCHITECTURE.md §2 + FOUNDATION_BLUEPRINT.md §1.4
 *
 * Boundary rule: only `lib/ai/*` may import this. Services consume via
 * the wrapper functions in `lib/ai/generate.ts`, never this module directly.
 */
export const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const AI_TIMEOUT_MS = THRESHOLDS.AI_TIMEOUT_MS;
export const AI_MAX_RETRIES = THRESHOLDS.AI_MAX_RETRIES;
