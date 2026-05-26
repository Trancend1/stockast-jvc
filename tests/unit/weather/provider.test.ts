import { beforeEach, describe, expect, it } from 'vitest';
import {
  getWeatherForOutlet,
  resetWeatherMemoryCacheForTests,
  type WeatherSnapshot,
} from '@/lib/weather';

function bmkgResponse(weatherDesc: string) {
  return {
    data: [
      {
        lokasi: { adm4: '33.73.01.1001' },
        cuaca: [
          [
            { local_datetime: '2026-05-26 10:00:00', weather_desc: 'Cerah berawan' },
            { local_datetime: '2026-05-26 14:00:00', weather_desc: weatherDesc },
          ],
        ],
      },
    ],
  };
}

function jsonResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('getWeatherForOutlet', () => {
  beforeEach(() => {
    resetWeatherMemoryCacheForTests();
  });

  it('returns mock weather immediately when provider mode is forced to mock', async () => {
    const result = await getWeatherForOutlet({
      adm4Code: '33.73.01.1001',
      serviceDate: '2026-05-26',
      providerMode: 'mock',
    });

    expect(result.source).toBe('mock');
    expect(result.category).toMatch(/unknown|hujan_deras|mendung|cerah_libur/);
  });

  it('maps BMKG payload into business weather snapshot', async () => {
    const result = await getWeatherForOutlet({
      adm4Code: '33.73.01.1001',
      serviceDate: '2026-05-26',
      providerMode: 'bmkg',
      fetchImpl: async () => jsonResponse(bmkgResponse('Hujan sedang')),
      kv: null,
    });

    expect(result.source).toBe('bmkg');
    expect(result.cacheLayer).toBe('none');
    expect(result.category).toBe('hujan_deras');
    expect(result.adm4Code).toBe('33.73.01.1001');
  });

  it('falls back to KV cache when BMKG fetch fails', async () => {
    const cached: WeatherSnapshot = {
      serviceDate: '2026-05-26',
      adm4Code: '33.73.01.1001',
      category: 'mendung',
      label: 'Mendung',
      hint: 'Pagi mendung, stok normal',
      source: 'bmkg',
      fetchedAt: '2026-05-25T00:00:00.000Z',
      cacheHit: true,
      cacheLayer: 'kv',
    };

    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input);
      if (url.includes('/pipeline') && init?.method === 'POST') {
        return jsonResponse([{ result: JSON.stringify(cached) }]);
      }
      return new Response('boom', { status: 500 });
    };

    const result = await getWeatherForOutlet({
      adm4Code: '33.73.01.1001',
      serviceDate: '2026-05-26',
      providerMode: 'bmkg',
      fetchImpl,
      kv: { url: 'https://kv.example.com', token: 'test-token' },
    });

    expect(result.source).toBe('bmkg');
    expect(result.cacheLayer).toBe('kv');
    expect(result.cacheHit).toBe(true);
    expect(result.category).toBe('mendung');
  });

  it('falls back to memory cache when BMKG fails and KV is unavailable', async () => {
    await getWeatherForOutlet({
      adm4Code: '33.73.01.1001',
      serviceDate: '2026-05-26',
      providerMode: 'bmkg',
      fetchImpl: async () => jsonResponse(bmkgResponse('Cerah')),
      kv: null,
    });

    const result = await getWeatherForOutlet({
      adm4Code: '33.73.01.1001',
      serviceDate: '2026-05-26',
      providerMode: 'bmkg',
      fetchImpl: async () => new Response('boom', { status: 500 }),
      kv: null,
    });

    expect(result.source).toBe('bmkg');
    expect(result.cacheHit).toBe(true);
    expect(result.cacheLayer).toBe('memory');
  });

  it('falls back to mock when BMKG and caches are unavailable', async () => {
    const result = await getWeatherForOutlet({
      adm4Code: '33.73.01.1001',
      serviceDate: '2026-05-26',
      providerMode: 'bmkg',
      fetchImpl: async () => new Response('boom', { status: 500 }),
      kv: null,
    });

    expect(result.source).toBe('mock');
    expect(result.cacheHit).toBe(false);
  });
});
