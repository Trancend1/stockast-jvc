'use client';

import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkPill } from '@/components/ui-kit/primitives/sk-pill';
import {
  SkWeatherChip,
  type SkWeatherChipKind,
} from '@/components/ui-kit/primitives/sk-weather-chip';
import { WeatherScene, type WeatherKind } from '@/components/ui-kit/weather/scenes';
import { cuaca } from '@/lib/copy/cuaca';
import { getMockWeather } from '@/lib/cuaca-mock';
import { tomorrowIsoUtc } from '@/lib/utils';
import * as React from 'react';

/**
 * Mock cuaca card visible on /dashboard. Phase 1.5 only — Phase 2 swaps for
 * real BMKG service via the env flag FEATURE_MOCK_WEATHER.
 *
 * Renders today's category derived from a stable hash of the date so the same
 * date shows the same state across hot reloads.
 */
export function CuacaCard({ serviceDate }: { serviceDate?: string }) {
  const isoDate = React.useMemo(() => serviceDate ?? tomorrowIsoUtc(), [serviceDate]);
  const weather = React.useMemo(() => getMockWeather(isoDate), [isoDate]);

  const kind = weatherKindForCategory(weather.category);
  const chipKind = weatherChipForKind(kind);

  return (
    <SkCard tone="ghost" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="relative">
        <WeatherScene kind={kind} width="100%" height={120} style={{ borderRadius: 0 }} />
        <div className="absolute top-3 right-3">
          <SkPill tone="brand">{cuaca.mock_badge}</SkPill>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <SkWeatherChip kind={chipKind} time="Besok" />
          <h3 className="text-xl font-bold text-neutral-900">{weather.label}</h3>
        </div>
        <p className="text-sm leading-relaxed text-neutral-700">
          <span className="font-semibold text-neutral-800">{cuaca.hint_prefix}</span> {weather.hint}
        </p>
      </div>
    </SkCard>
  );
}

function weatherKindForCategory(
  category: ReturnType<typeof getMockWeather>['category'],
): WeatherKind {
  if (category === 'hujan_deras') return 'hujan';
  if (category === 'mendung') return 'berawan';
  return 'cerah';
}

function weatherChipForKind(kind: WeatherKind): SkWeatherChipKind {
  if (kind === 'hujan' || kind === 'petir') return 'rain';
  if (kind === 'berawan' || kind === 'berkabut') return 'cloud';
  return 'sun';
}
