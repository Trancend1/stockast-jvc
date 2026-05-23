'use client';

import type { BelanjaCardData } from '@/app/actions/recommendation';
import { Toast } from '@/components/ui-kit/notifications';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkPill } from '@/components/ui-kit/primitives/sk-pill';
import { belanja } from '@/lib/copy/belanja';
import { polaMingguan } from '@/lib/copy/pola-mingguan';
import { weekdayFromServiceDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export function BelanjaCard({ data }: { data: BelanjaCardData }) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const weekdayLabel = React.useMemo(() => {
    const idx = weekdayFromServiceDate(data.serviceDate);
    return belanja.weekday[idx] ?? '';
  }, [data.serviceDate]);

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

  const confidenceTone =
    data.confidenceLabel === 'Pola jelas'
      ? 'success'
      : data.confidenceLabel === 'Data baru, hati-hati'
        ? 'warn'
        : ('danger' as const);

  return (
    <SkCard signature className="belanja-card-reveal belanja-card-surface border-brand-100">
      <div style={{ padding: '1rem' }}>
        <div className="flex items-baseline justify-between">
          <span className="text-brand-700 text-xs font-semibold tracking-wider uppercase">
            {weekdayLabel} · {formatShortDate(data.serviceDate)}
          </span>
          <SkPill tone={confidenceTone}>{belanja.confidence[data.confidenceLabel]}</SkPill>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">
          {belanja.heading}
        </h2>

        <ul className="mt-2 flex flex-col gap-3">
          {data.items.map((it, idx) => (
            <li
              key={it.menuItemId}
              className="belanja-item-reveal rounded-button flex flex-col gap-1 border border-neutral-200 bg-neutral-50 p-3"
              style={{ animationDelay: `${120 + idx * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex-1 leading-tight font-semibold text-neutral-900">
                  {it.menuName}
                </span>
                <span className="flex shrink-0 items-baseline gap-1">
                  <span className="text-brand-700 text-2xl font-extrabold tabular-nums">
                    {it.suggested}
                  </span>
                  <span className="text-sm font-medium text-neutral-500">{it.unit}</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-700">{it.reasoning}</p>
              {it.leftoverYesterday !== null && it.leftoverYesterday > 0 ? (
                <p className="text-xs text-neutral-500">
                  Sisa kemarin: {it.leftoverYesterday} {it.unit}
                </p>
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mt-3 text-sm leading-relaxed text-neutral-700">{data.summary}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <SkButton
            variant="secondary"
            size="lg"
            full
            onClick={() => router.push('/pola-mingguan')}
          >
            {polaMingguan.action}
          </SkButton>
          <SkButton variant="brand" size="lg" full onClick={handleCopy}>
            {copied ? belanja.share.copied : belanja.share.copy}
          </SkButton>
        </div>
        {copied ? (
          <div className="mt-3">
            <Toast
              kind="success"
              title={belanja.share.copied}
              message="Tinggal paste ke WhatsApp langganan."
              onClose={() => setCopied(false)}
            />
          </div>
        ) : null}
      </div>
    </SkCard>
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
