import { flags } from '@/lib/config/env';

type RuntimeFlags = typeof flags;

export function resolveWeatherProviderMode(overrides?: Partial<RuntimeFlags>): 'mock' | 'bmkg' {
  return (overrides ?? flags).mockWeather ? 'mock' : 'bmkg';
}

export function isAiParseEnabled(overrides?: Partial<RuntimeFlags>): boolean {
  return (overrides ?? flags).aiParseEnabled ?? false;
}

export function isPromoGenerationEnabled(overrides?: Partial<RuntimeFlags>): boolean {
  return (overrides ?? flags).promoGeneration ?? false;
}
