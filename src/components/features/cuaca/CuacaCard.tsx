'use client';

import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkPill } from '@/components/ui-kit/primitives/sk-pill';
import { WeatherScene, type WeatherKind } from '@/components/ui-kit/weather/scenes';
import type { WeatherSnapshot } from '@/lib/weather';
import * as React from 'react';

export function CuacaCard({ weather }: { weather: WeatherSnapshot }) {
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
            {weather.hint}
          </p>
        </div>
        <SkPill>{badge}</SkPill>
      </div>
    </SkCard>
  );
}

function weatherKindForCategory(category: WeatherSnapshot['category']): WeatherKind {
  if (category === 'hujan_deras') return 'hujan';
  if (category === 'mendung') return 'berawan';
  return 'cerah';
}
