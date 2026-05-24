'use client';

import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkPill } from '@/components/ui-kit/primitives/sk-pill';
import { WeatherScene, type WeatherKind } from '@/components/ui-kit/weather/scenes';
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
  const badge = weather.label.toLowerCase();
  const kind = weatherKindForCategory(weather.category);

  return (
    <SkCard tone="ghost" style={{ padding: 0, overflow: 'hidden' }}>
      <WeatherScene kind={kind} width="100%" height={92} style={{ display: 'block' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px 12px' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3
            style={{
              margin: 0,
              color: 'var(--sk-text)',
              fontSize: 15,
              fontWeight: 750,
              lineHeight: 1.2,
            }}
          >
            {weather.label}
          </h3>
          <p
            style={{
              margin: '3px 0 0',
              color: 'var(--sk-text-2)',
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            {compactHint(weather)}
          </p>
        </div>
        <SkPill>{badge}</SkPill>
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

function compactHint(weather: ReturnType<typeof getMockWeather>): string {
  if (weather.category === 'cerah_libur') return 'Pagi cerah, ramai siap-siap';
  if (weather.category === 'mendung') return 'Pagi mendung, stok normal';
  return 'Pagi hujan, stok jangan berlebih';
}
