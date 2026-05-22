'use client';

import * as React from 'react';
import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkPill } from '@/components/ui-kit/primitives/sk-pill';
import {
  SkWeatherChip,
  type SkWeatherChipKind,
} from '@/components/ui-kit/primitives/sk-weather-chip';
import { WeatherScene, type WeatherKind } from '@/components/ui-kit/weather/scenes';
import { getMockWeather } from '@/lib/cuaca-mock';
import { cuaca } from '@/lib/copy/cuaca';
import { tomorrowIsoUtc } from '@/lib/utils';

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
      <WeatherScene kind={kind} width="100%" height={96} style={{ borderRadius: 0 }} />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <SkWeatherChip kind={chipKind} time="Besok" />
            <div className="flex flex-col">
              <span className="text-info text-xs font-semibold tracking-wider uppercase">
                {cuaca.heading}
              </span>
              <span className="text-lg font-bold text-neutral-900">{weather.label}</span>
            </div>
          </div>
          <SkPill tone="brand">{cuaca.mock_badge}</SkPill>
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
