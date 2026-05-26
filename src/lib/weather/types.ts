import type { WeatherCategory } from '@/lib/config/thresholds';

export type WeatherProviderMode = 'mock' | 'bmkg';
export type WeatherSource = 'bmkg' | 'mock';
export type WeatherCacheLayer = 'none' | 'kv' | 'memory';
export type WeatherBusinessCategory = WeatherCategory;

export type WeatherSnapshot = {
  serviceDate: string;
  adm4Code: string | null;
  category: WeatherBusinessCategory;
  label: string;
  hint: string;
  source: WeatherSource;
  fetchedAt: string;
  cacheHit: boolean;
  cacheLayer: WeatherCacheLayer;
};

export type WeatherKvConfig = {
  url: string;
  token: string;
};
