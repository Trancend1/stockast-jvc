'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState, NotebookMark } from '@/components/ui/illustration';
import { polaMingguan } from '@/lib/copy/pola-mingguan';
import type { PolaMingguanData, PolaMingguanItem } from '@/lib/services/pola-mingguan';

const WEEKDAY_SHORT = ['M', 'S', 'S', 'R', 'K', 'J', 'S'] as const;

export function PolaMingguanCard({ data }: { data: PolaMingguanData }) {
  if (data.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{polaMingguan.heading}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<NotebookMark />}
            title=""
            description={polaMingguan.empty}
          />
        </CardContent>
      </Card>
    );
  }

  const insightText = formatInsight(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{polaMingguan.heading}</CardTitle>
        <CardDescription>{polaMingguan.subheading}</CardDescription>
      </CardHeader>
      <CardContent>
        {insightText ? (
          <p className="rounded-[12px] bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800">
            💡 {insightText}
          </p>
        ) : null}
        <ul className="flex flex-col gap-3">
          {data.items.map((item) => (
            <PolaItemRow key={item.menuItemId} item={item} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function PolaItemRow({ item }: { item: PolaMingguanItem }) {
  const today = new Date().getDay();
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="font-semibold text-neutral-900">{item.menuName}</span>
        <span className="text-xs text-neutral-500">{item.unit}</span>
      </div>
      <WeekdayChart bars={item.bars} max={item.weekdayMax} today={today} />
    </li>
  );
}

const CHART_W = 280;
const CHART_H = 64;
const BAR_GAP = 8;
const TICK_H = 14;

function WeekdayChart({
  bars,
  max,
  today,
}: {
  bars: ReadonlyArray<{ weekday: number; avgSold: number; samples: number }>;
  max: number;
  today: number;
}) {
  const usableW = CHART_W;
  const barW = (usableW - BAR_GAP * 6) / 7;
  const drawableH = CHART_H - TICK_H - 4;
  const safeMax = max > 0 ? max : 1;

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      role="img"
      aria-label="Bar chart penjualan per hari"
      className="w-full max-w-[320px]"
    >
      {bars.map((bar, idx) => {
        const x = idx * (barW + BAR_GAP);
        const h = bar.avgSold === 0 ? 2 : Math.max(2, (bar.avgSold / safeMax) * drawableH);
        const y = drawableH - h;
        const isToday = bar.weekday === today;
        const hasSample = bar.samples > 0;
        const fill = !hasSample
          ? 'var(--color-neutral-200)'
          : isToday
            ? 'var(--color-brand-500)'
            : 'var(--color-brand-300)';
        return (
          <g key={idx}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={3}
              fill={fill}
            />
            <text
              x={x + barW / 2}
              y={drawableH + TICK_H - 2}
              fontSize={11}
              fontWeight={isToday ? 700 : 500}
              textAnchor="middle"
              fill="var(--color-neutral-600)"
            >
              {WEEKDAY_SHORT[bar.weekday]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function formatInsight(data: PolaMingguanData): string | null {
  if (!data.insight) return null;
  const i = data.insight;
  return i.direction === 'up'
    ? polaMingguan.insight_up(i.menuName, i.weekdayLabel, Math.abs(i.deltaPercent))
    : polaMingguan.insight_down(i.menuName, i.weekdayLabel, Math.abs(i.deltaPercent));
}
