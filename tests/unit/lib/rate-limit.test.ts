import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  buildRateLimitKey,
  checkRateLimit,
  hashRateLimitIdentity,
  resetRateLimitMemoryForTests,
} from '@/lib/kv';

describe('rate limit contract', () => {
  beforeEach(() => {
    resetRateLimitMemoryForTests();
  });

  it('uses hashed identities in keys', () => {
    const key = buildRateLimitKey('otp', '+6281234567890', 900, 0);

    expect(key).toMatch(/^stockast:rl:v1:otp:0:[a-f0-9]{32}$/);
    expect(key).not.toContain('+6281234567890');
    expect(hashRateLimitIdentity('+6281234567890')).toHaveLength(32);
  });

  it('blocks requests after the configured in-memory limit', async () => {
    const input = {
      scope: 'ai' as const,
      identity: 'user-1',
      limit: 2,
      windowSec: 60,
      nowMs: 1_000,
      kv: null,
    };

    await expect(checkRateLimit(input)).resolves.toMatchObject({
      allowed: true,
      remaining: 1,
      store: 'memory',
    });
    await expect(checkRateLimit(input)).resolves.toMatchObject({
      allowed: true,
      remaining: 0,
    });
    await expect(checkRateLimit(input)).resolves.toMatchObject({
      allowed: false,
      remaining: 0,
      retryAfterSec: 59,
    });
  });

  it('starts a new bucket after the window resets', async () => {
    const base = {
      scope: 'otp' as const,
      identity: 'phone',
      limit: 1,
      windowSec: 60,
      kv: null,
    };

    await expect(checkRateLimit({ ...base, nowMs: 1_000 })).resolves.toMatchObject({
      allowed: true,
    });
    await expect(checkRateLimit({ ...base, nowMs: 61_000 })).resolves.toMatchObject({
      allowed: true,
      remaining: 0,
    });
  });

  it('uses Vercel KV REST when credentials are configured', async () => {
    const fetchImpl = vi.fn(async () => {
      return {
        ok: true,
        json: async () => [{ result: 1 }, { result: 1 }],
      } as Response;
    });

    const result = await checkRateLimit({
      scope: 'ai',
      identity: 'user-2',
      limit: 3,
      windowSec: 60,
      nowMs: 0,
      kv: { url: 'https://kv.example.com', token: 'secret' },
      fetchImpl,
    });

    expect(result).toMatchObject({ allowed: true, remaining: 2, store: 'vercel-kv' });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://kv.example.com/pipeline',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer secret' }),
      }),
    );
  });

  it('falls back to memory when KV is temporarily unavailable', async () => {
    const fetchImpl = vi.fn(async () => {
      return { ok: false, status: 503, json: async () => [] } as unknown as Response;
    });

    const result = await checkRateLimit({
      scope: 'ai',
      identity: 'user-3',
      limit: 1,
      windowSec: 60,
      nowMs: 0,
      kv: { url: 'https://kv.example.com', token: 'secret' },
      fetchImpl,
    });

    expect(result).toMatchObject({ allowed: true, remaining: 0, store: 'memory-fallback' });
  });
});
