import { createHash } from 'node:crypto';

export type RateLimitStore = 'memory' | 'vercel-kv' | 'memory-fallback';

export type RateLimitResult = {
  allowed: boolean;
  key: string;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
  store: RateLimitStore;
};

export type RateLimitInput = {
  scope: 'ai' | 'otp' | 'ip';
  identity: string;
  limit: number;
  windowSec: number;
  nowMs?: number;
  kv?: KvConfig | null;
  fetchImpl?: typeof fetch;
};

type KvConfig = {
  url: string;
  token: string;
};

type MemoryCounter = {
  count: number;
  expiresAt: number;
};

const memoryCounters = new Map<string, MemoryCounter>();

export async function checkRateLimit(input: RateLimitInput): Promise<RateLimitResult> {
  const nowMs = input.nowMs ?? Date.now();
  const resetAt = bucketResetAt(nowMs, input.windowSec);
  const key = buildRateLimitKey(input.scope, input.identity, input.windowSec, nowMs);
  const kv = input.kv === undefined ? readKvConfig() : input.kv;

  if (kv) {
    try {
      const count = await incrementKvCounter({
        key,
        windowSec: input.windowSec,
        kv,
        fetchImpl: input.fetchImpl ?? fetch,
      });
      return toResult({
        key,
        count,
        limit: input.limit,
        resetAt,
        store: 'vercel-kv',
        nowMs,
      });
    } catch {
      const count = incrementMemoryCounter(key, input.windowSec, nowMs);
      return toResult({
        key,
        count,
        limit: input.limit,
        resetAt,
        store: 'memory-fallback',
        nowMs,
      });
    }
  }

  const count = incrementMemoryCounter(key, input.windowSec, nowMs);
  return toResult({
    key,
    count,
    limit: input.limit,
    resetAt,
    store: 'memory',
    nowMs,
  });
}

export function hashRateLimitIdentity(identity: string): string {
  return createHash('sha256').update(identity.trim().toLowerCase()).digest('hex').slice(0, 32);
}

export function buildRateLimitKey(
  scope: RateLimitInput['scope'],
  identity: string,
  windowSec: number,
  nowMs = Date.now(),
): string {
  const bucket = Math.floor(nowMs / (windowSec * 1000));
  return `stockast:rl:v1:${scope}:${bucket}:${hashRateLimitIdentity(identity)}`;
}

export function resetRateLimitMemoryForTests(): void {
  memoryCounters.clear();
}

function readKvConfig(): KvConfig | null {
  const url = process.env.KV_REST_API_URL?.trim();
  const token = process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
}

async function incrementKvCounter(args: {
  key: string;
  windowSec: number;
  kv: KvConfig;
  fetchImpl: typeof fetch;
}): Promise<number> {
  const res = await args.fetchImpl(`${args.kv.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.kv.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', args.key],
      ['EXPIRE', args.key, args.windowSec],
    ]),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`KV rate-limit request failed: ${res.status}`);
  }

  const payload: unknown = await res.json();
  const count = readFirstPipelineResult(payload);
  if (count === null) {
    throw new Error('KV rate-limit response did not include INCR result');
  }
  return count;
}

function readFirstPipelineResult(payload: unknown): number | null {
  if (!Array.isArray(payload)) return null;
  const first = payload[0];
  if (!first || typeof first !== 'object' || !('result' in first)) return null;
  const result = (first as { result: unknown }).result;
  if (typeof result === 'number') return result;
  if (typeof result === 'string') {
    const parsed = Number(result);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function incrementMemoryCounter(key: string, windowSec: number, nowMs: number): number {
  cleanupExpired(nowMs);
  const current = memoryCounters.get(key);
  if (!current || current.expiresAt <= nowMs) {
    memoryCounters.set(key, { count: 1, expiresAt: nowMs + windowSec * 1000 });
    return 1;
  }
  current.count += 1;
  return current.count;
}

function cleanupExpired(nowMs: number): void {
  for (const [key, counter] of memoryCounters.entries()) {
    if (counter.expiresAt <= nowMs) {
      memoryCounters.delete(key);
    }
  }
}

function bucketResetAt(nowMs: number, windowSec: number): number {
  const windowMs = windowSec * 1000;
  return (Math.floor(nowMs / windowMs) + 1) * windowMs;
}

function toResult(args: {
  key: string;
  count: number;
  limit: number;
  resetAt: number;
  store: RateLimitStore;
  nowMs: number;
}): RateLimitResult {
  const remaining = Math.max(0, args.limit - args.count);
  return {
    allowed: args.count <= args.limit,
    key: args.key,
    limit: args.limit,
    remaining,
    resetAt: args.resetAt,
    retryAfterSec: Math.max(1, Math.ceil((args.resetAt - args.nowMs) / 1000)),
    store: args.store,
  };
}
