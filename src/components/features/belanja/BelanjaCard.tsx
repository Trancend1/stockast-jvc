'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { belanja } from '@/lib/copy/belanja';
import type { BelanjaCardData } from '@/app/actions/recommendation';

/**
 * Signature visual — the Belanja Card.
 * Source: .docs/DESIGN_SYSTEM.md §5 (hero + card stack).
 */

export function BelanjaCard({ data }: { data: BelanjaCardData }) {
  const [copied, setCopied] = React.useState(false);
  const weekdayLabel = belanja.weekday[new Date(data.serviceDate + 'T00:00:00').getDay()] ?? '';

  async function handleCopy() {
    const text = buildShareText(data, weekdayLabel);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Salin manual:', text);
    }
  }

  return (
    <Card className="bg-gradient-to-br from-neutral-50 via-brand-50 to-neutral-50 border-brand-100">
      <CardContent>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            {weekdayLabel} · {formatShortDate(data.serviceDate)}
          </span>
          <ConfidenceBadge label={data.confidenceLabel} />
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">
          {belanja.heading}
        </h2>

        <ul className="mt-2 flex flex-col gap-3">
          {data.items.map((it) => (
            <li
              key={it.menuItemId}
              className="flex flex-col gap-1 rounded-[12px] border border-neutral-200 bg-neutral-50 p-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-neutral-900">{it.menuName}</span>
                <span className="text-2xl font-extrabold text-brand-700">
                  {it.suggested}
                  <span className="ml-1 text-sm font-medium text-neutral-500">{it.unit}</span>
                </span>
              </div>
              <p className="text-sm text-neutral-700">{it.reasoning}</p>
              {it.leftoverYesterday !== null && it.leftoverYesterday > 0 ? (
                <p className="text-xs text-neutral-500">
                  Sisa kemarin: {it.leftoverYesterday} {it.unit}
                </p>
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mt-3 text-sm leading-relaxed text-neutral-700">{data.summary}</p>
      </CardContent>

      <CardFooter className="justify-stretch">
        <Button onClick={handleCopy} size="lg" className="w-full">
          {copied ? belanja.share.copied : belanja.share.copy}
        </Button>
      </CardFooter>
    </Card>
  );
}

function ConfidenceBadge({ label }: { label: keyof typeof belanja.confidence }) {
  const tone =
    label === 'Pola jelas'
      ? 'bg-success/10 text-success'
      : label === 'Data baru, hati-hati'
        ? 'bg-warning/10 text-warning'
        : 'bg-danger/10 text-danger';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${tone}`}
    >
      {belanja.confidence[label]}
    </span>
  );
}

function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const day = d.getDate();
  const month = d.toLocaleString('id-ID', { month: 'short' });
  return `${day} ${month}`;
}

function buildShareText(data: BelanjaCardData, weekdayLabel: string): string {
  const dateLabel = `${weekdayLabel}, ${formatShortDate(data.serviceDate)}`;
  const lines: string[] = [`*Belanja besok — ${dateLabel}*`, ''];
  for (const it of data.items) {
    lines.push(`• ${it.menuName}: ${it.suggested} ${it.unit}`);
  }
  lines.push('');
  lines.push(data.summary);
  return lines.join('\n');
}
