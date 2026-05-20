'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  const isoDate = React.useMemo(
    () => serviceDate ?? tomorrowIsoUtc(),
    [serviceDate],
  );
  const weather = React.useMemo(() => getMockWeather(isoDate), [isoDate]);

  return (
    <Card className="border-info/30 bg-info/5">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none" aria-hidden>
              {weather.emoji}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-info">
                {cuaca.heading}
              </span>
              <span className="text-lg font-bold text-neutral-900">{weather.label}</span>
            </div>
          </div>
          <span className="rounded-full bg-info/10 px-2 py-0.5 text-xs font-semibold text-info">
            {cuaca.mock_badge}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-neutral-700">
          <span className="font-semibold text-neutral-800">{cuaca.hint_prefix}</span>{' '}
          {weather.hint}
        </p>
      </CardContent>
    </Card>
  );
}

