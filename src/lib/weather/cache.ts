import { THRESHOLDS } from '@/lib/config/thresholds';
import type { WeatherKvConfig, WeatherSnapshot } from './types';

type MemoryEntry = {
  expiresAt: number;
  snapshot: WeatherSnapshot;
};

const weatherMemoryCache = new Map<string, MemoryEntry>();

export function getWeatherCacheKey(adm4Code: string, serviceDate: string): string {
  return `stockast:weather:v1:${adm4Code}:${serviceDate}`;
}

export function readWeatherKvConfig(): WeatherKvConfig | null {
  const url = process.env.KV_REST_API_URL?.trim();
  const token = process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
}

export function readMemoryWeatherCache(key: string, nowMs = Date.now()): WeatherSnapshot | null {
  cleanupExpiredWeatherCache(nowMs);
  const entry = weatherMemoryCache.get(key);
  if (!entry || entry.expiresAt <= nowMs) return null;
  return {
    ...entry.snapshot,
    cacheHit: true,
    cacheLayer: 'memory',
  };
}

export function writeMemoryWeatherCache(
  key: string,
  snapshot: WeatherSnapshot,
  nowMs = Date.now(),
): void {
  weatherMemoryCache.set(key, {
    snapshot: {
      ...snapshot,
      cacheHit: false,
      cacheLayer: 'none',
    },
    expiresAt: nowMs + THRESHOLDS.WEATHER_CACHE_TTL_SEC * 1000,
  });
}

export async function readKvWeatherCache(args: {
  key: string;
  kv: WeatherKvConfig;
  fetchImpl: typeof fetch;
}): Promise<WeatherSnapshot | null> {
  const res = await args.fetchImpl(`${args.kv.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.kv.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([['GET', args.key]]),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`KV weather cache request failed: ${res.status}`);
  }

  const payload: unknown = await res.json();
  const raw = readFirstPipelineString(payload);
  if (!raw) return null;

  const parsed = JSON.parse(raw) as WeatherSnapshot;
  return {
    ...parsed,
    cacheHit: true,
    cacheLayer: 'kv',
  };
}

export async function writeKvWeatherCache(args: {
  key: string;
  kv: WeatherKvConfig;
  snapshot: WeatherSnapshot;
  fetchImpl: typeof fetch;
}): Promise<void> {
  const res = await args.fetchImpl(`${args.kv.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.kv.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['SET', args.key, JSON.stringify({ ...args.snapshot, cacheHit: false, cacheLayer: 'none' })],
      ['EXPIRE', args.key, THRESHOLDS.WEATHER_CACHE_TTL_SEC],
    ]),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`KV weather cache write failed: ${res.status}`);
  }
}

export function resetWeatherMemoryCacheForTests(): void {
  weatherMemoryCache.clear();
}

function cleanupExpiredWeatherCache(nowMs: number): void {
  for (const [key, entry] of weatherMemoryCache.entries()) {
    if (entry.expiresAt <= nowMs) {
      weatherMemoryCache.delete(key);
    }
  }
}

function readFirstPipelineString(payload: unknown): string | null {
  if (!Array.isArray(payload)) return null;
  const first = payload[0];
  if (!first || typeof first !== 'object' || !('result' in first)) return null;
  const result = (first as { result: unknown }).result;
  return typeof result === 'string' ? result : null;
}
