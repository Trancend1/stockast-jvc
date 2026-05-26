import { getMockWeather } from '@/lib/cuaca-mock';
import type { WeatherSnapshot } from './types';

export function buildMockWeatherSnapshot(input: {
  serviceDate: string;
  adm4Code: string | null;
  cacheHit?: boolean;
  cacheLayer?: WeatherSnapshot['cacheLayer'];
}): WeatherSnapshot {
  const mock = getMockWeather(input.serviceDate);
  return {
    serviceDate: input.serviceDate,
    adm4Code: input.adm4Code,
    category: mock.category,
    label: mock.label,
    hint: compactHint(mock.category),
    source: 'mock',
    fetchedAt: new Date().toISOString(),
    cacheHit: input.cacheHit ?? false,
    cacheLayer: input.cacheLayer ?? 'none',
  };
}

export function compactHint(category: WeatherSnapshot['category']): string {
  if (category === 'cerah_libur') return 'Pagi cerah, ramai siap-siap';
  if (category === 'mendung') return 'Pagi mendung, stok normal';
  if (category === 'hujan_deras') return 'Pagi hujan, stok jangan berlebih';
  return 'Cuaca belum kebaca, pakai pola normal';
}
