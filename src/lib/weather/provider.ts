import { resolveWeatherProviderMode } from '@/lib/feature-gates';
import { logEvent } from '@/lib/observability';
import { fetchBmkgWeather } from './bmkg';
import {
  getWeatherCacheKey,
  readKvWeatherCache,
  readMemoryWeatherCache,
  readWeatherKvConfig,
  resetWeatherMemoryCacheForTests,
  writeKvWeatherCache,
  writeMemoryWeatherCache,
} from './cache';
import { buildMockWeatherSnapshot } from './mock';
import type { WeatherKvConfig, WeatherProviderMode, WeatherSnapshot } from './types';

export type GetWeatherForOutletInput = {
  serviceDate: string;
  adm4Code: string | null;
  providerMode?: WeatherProviderMode;
  kv?: WeatherKvConfig | null;
  fetchImpl?: typeof fetch;
  nowMs?: number;
};

export async function getWeatherForOutlet(
  input: GetWeatherForOutletInput,
): Promise<WeatherSnapshot> {
  const providerMode = input.providerMode ?? resolveWeatherProviderMode();
  const fetchImpl = input.fetchImpl ?? fetch;
  const kv = input.kv === undefined ? readWeatherKvConfig() : input.kv;
  const startedAt = Date.now();

  if (providerMode === 'mock' || !input.adm4Code) {
    const snapshot = buildMockWeatherSnapshot({
      serviceDate: input.serviceDate,
      adm4Code: input.adm4Code,
    });
    logEvent('weather_fallback_used', {
      provider: providerMode,
      result: 'mock',
      serviceDate: input.serviceDate,
      adm4Code: input.adm4Code,
      failureReason: input.adm4Code ? null : 'missing_adm4',
    });
    return snapshot;
  }

  const key = getWeatherCacheKey(input.adm4Code, input.serviceDate);

  try {
    const snapshot = await fetchBmkgWeather({
      adm4Code: input.adm4Code,
      serviceDate: input.serviceDate,
      fetchImpl,
    });
    writeMemoryWeatherCache(key, snapshot, input.nowMs);
    if (kv) {
      void writeKvWeatherCache({ key, kv, snapshot, fetchImpl }).catch(() => undefined);
    }
    logEvent('weather_fetch', {
      provider: 'bmkg',
      result: 'success',
      serviceDate: input.serviceDate,
      adm4Code: input.adm4Code,
      latencyMs: Date.now() - startedAt,
      cacheLayer: 'none',
    });
    return snapshot;
  } catch (error) {
    const failureReason = error instanceof Error ? error.message : 'unknown';

    if (kv) {
      try {
        const cached = await readKvWeatherCache({ key, kv, fetchImpl });
        if (cached) {
          writeMemoryWeatherCache(key, cached, input.nowMs);
          logEvent('weather_cache_hit', {
            provider: 'bmkg',
            cacheLayer: 'kv',
            serviceDate: input.serviceDate,
            adm4Code: input.adm4Code,
            latencyMs: Date.now() - startedAt,
          });
          return cached;
        }
        logEvent('weather_cache_miss', {
          provider: 'bmkg',
          cacheLayer: 'kv',
          serviceDate: input.serviceDate,
          adm4Code: input.adm4Code,
        });
      } catch {
        logEvent('weather_cache_miss', {
          provider: 'bmkg',
          cacheLayer: 'kv',
          serviceDate: input.serviceDate,
          adm4Code: input.adm4Code,
          failureReason: 'kv_unavailable',
        });
      }
    }

    const memoryCached = readMemoryWeatherCache(key, input.nowMs);
    if (memoryCached) {
      logEvent('weather_cache_hit', {
        provider: 'bmkg',
        cacheLayer: 'memory',
        serviceDate: input.serviceDate,
        adm4Code: input.adm4Code,
        latencyMs: Date.now() - startedAt,
      });
      return memoryCached;
    }

    logEvent('weather_cache_miss', {
      provider: 'bmkg',
      cacheLayer: 'memory',
      serviceDate: input.serviceDate,
      adm4Code: input.adm4Code,
    });

    const fallback = buildMockWeatherSnapshot({
      serviceDate: input.serviceDate,
      adm4Code: input.adm4Code,
    });
    logEvent(
      'weather_fallback_used',
      {
        provider: 'bmkg',
        result: 'mock',
        serviceDate: input.serviceDate,
        adm4Code: input.adm4Code,
        failureReason,
      },
      'warn',
    );
    return fallback;
  }
}

export { resetWeatherMemoryCacheForTests };
