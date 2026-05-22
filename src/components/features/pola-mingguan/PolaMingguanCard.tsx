'use client';

import * as React from 'react';
import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { BarSeries, type BarPoint } from '@/components/ui-kit/charts/sk-charts';
import { EmptyPanel, IllustNoHistory } from '@/components/ui-kit/illustrations/empty-states';
import { polaMingguan } from '@/lib/copy/pola-mingguan';
import type { PolaMingguanData, PolaMingguanItem } from '@/lib/services/pola-mingguan';

// getUTCDay(): 0 = Sunday
const WEEKDAY_LABELS = ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'] as const;

export function PolaMingguanCard({ data }: { data: PolaMingguanData }) {
  // Compute today's weekday after mount to avoid SSR/hydration mismatch.
  const [today, setToday] = React.useState<number | null>(null);
  React.useEffect(() => {
    setToday(new Date().getUTCDay());
  }, []);

  if (data.items.length === 0) {
    return (
      <EmptyPanel illust={IllustNoHistory} title={polaMingguan.heading} body={polaMingguan.empty} />
    );
  }

  const insightText = formatInsight(data);

  return (
    <SkCard>
      <div style={{ padding: '1rem' }}>
        <p className="text-sm font-semibold text-neutral-900">{polaMingguan.heading}</p>
        <p className="mt-0.5 text-xs text-neutral-500">{polaMingguan.subheading}</p>

        {insightText ? (
          <p className="rounded-button bg-brand-50 text-brand-800 mt-2 px-3 py-2 text-sm font-medium">
            💡 {insightText}
          </p>
        ) : null}

        <ul className="mt-3 flex flex-col gap-4">
          {data.items.map((item) => (
            <PolaItemRow key={item.menuItemId} item={item} today={today} />
          ))}
        </ul>
      </div>
    </SkCard>
  );
}

function PolaItemRow({ item, today }: { item: PolaMingguanItem; today: number | null }) {
  const barData: BarPoint[] = item.bars.map((bar) => ({
    d: WEEKDAY_LABELS[bar.weekday] ?? '?',
    v: Math.max(bar.avgSold, 0),
    active: today !== null && bar.weekday === today,
  }));

  const hasData = barData.some((b) => b.v > 0);
  const safeData = hasData ? barData : barData.map((b) => ({ ...b, v: 0.001 }));

  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="font-semibold text-neutral-900">{item.menuName}</span>
        <span className="text-xs text-neutral-500">{item.unit}</span>
      </div>
      <BarSeries data={safeData} width={280} height={72} showLabels />
    </li>
  );
}

function formatInsight(data: PolaMingguanData): string | null {
  if (!data.insight) return null;
  const i = data.insight;
  return i.direction === 'up'
    ? polaMingguan.insight_up(i.menuName, i.weekdayLabel, Math.abs(i.deltaPercent))
    : polaMingguan.insight_down(i.menuName, i.weekdayLabel, Math.abs(i.deltaPercent));
}
