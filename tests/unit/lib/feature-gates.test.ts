import { describe, expect, it } from 'vitest';
import {
  isAiParseEnabled,
  isPromoGenerationEnabled,
  resolveWeatherProviderMode,
} from '@/lib/feature-gates';

describe('feature gates', () => {
  it('forces mock weather when FEATURE_MOCK_WEATHER is true', () => {
    expect(resolveWeatherProviderMode({ mockWeather: true })).toBe('mock');
    expect(resolveWeatherProviderMode({ mockWeather: false })).toBe('bmkg');
  });

  it('exposes AI parse and promo toggles as runtime booleans', () => {
    expect(isAiParseEnabled({ aiParseEnabled: true })).toBe(true);
    expect(isAiParseEnabled({ aiParseEnabled: false })).toBe(false);
    expect(isPromoGenerationEnabled({ promoGeneration: true })).toBe(true);
    expect(isPromoGenerationEnabled({ promoGeneration: false })).toBe(false);
  });
});
