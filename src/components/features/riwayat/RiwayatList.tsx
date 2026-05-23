'use client';

import { getRiwayat7d, type RiwayatDay } from '@/app/actions/riwayat';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  EmptyPanel,
  IllustError,
  IllustNoData,
  IllustNoHistory,
} from '@/components/ui-kit/illustrations/empty-states';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkPill } from '@/components/ui-kit/primitives/sk-pill';
import { common } from '@/lib/copy/common';
import { riwayat } from '@/lib/copy/riwayat';
import { useRouter } from 'next/navigation';
import * as React from 'react';

type Phase = 'loading' | 'ready' | 'empty' | 'error';

export function RiwayatList() {
  const router = useRouter();
  const [phase, setPhase] = React.useState<Phase>('loading');
  const [days, setDays] = React.useState<RiwayatDay[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    void load();
  }, []);

  async function load() {
    const result = await getRiwayat7d();
    if (result.error) {
      setErrorMsg(result.error.message);
      setPhase('error');
      return;
    }
    if (result.data.days.length === 0) {
      setPhase('empty');
      return;
    }
    setDays(result.data.days);
    setPhase('ready');
  }

  return (
    <AppLayout title="Riwayat 7 Hari">
      <div className="flex flex-col gap-4 px-4 pt-4">
        {phase === 'loading' ? (
          <EmptyPanel
            illust={IllustNoHistory}
            title={common.state.loading}
            body="Lagi ambil 7 hari terakhir."
          />
        ) : null}

        {phase === 'empty' ? (
          <EmptyPanel
            illust={IllustNoData}
            title="Belum ada catatan"
            body={riwayat.empty}
            cta={
              <SkButton variant="brand" size="md" full onClick={() => router.push('/catat')}>
                Catat hari ini
              </SkButton>
            }
          />
        ) : null}

        {phase === 'error' ? (
          <EmptyPanel
            illust={IllustError}
            title="Gagal ambil riwayat"
            body={errorMsg ?? common.state.error_generic}
          />
        ) : null}

        {phase === 'ready' ? days.map((day) => <DayCard key={day.serviceDate} day={day} />) : null}
      </div>
    </AppLayout>
  );
}

function DayCard({ day }: { day: RiwayatDay }) {
  return (
    <SkCard>
      <div style={{ padding: '0.75rem 1rem' }}>
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 flex-1 font-semibold text-neutral-900">
            {formatDate(day.serviceDate)}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <SkPill tone="success">
              {riwayat.total_sold} {day.totalSold}
            </SkPill>
            {day.totalLeftover > 0 ? (
              <SkPill tone="warn">
                {riwayat.total_leftover} {day.totalLeftover}
              </SkPill>
            ) : null}
          </div>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {day.items.map((it) => (
            <li key={it.menuItemId} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 flex-1 truncate text-neutral-700">{it.menuName}</span>
              <span className="inline-flex shrink-0 items-baseline gap-1 whitespace-nowrap text-neutral-900 tabular-nums">
                <span className="font-semibold">{it.sold}</span>
                <span className="text-neutral-500">{riwayat.total_sold}</span>
                {it.leftover > 0 ? (
                  <>
                    <span className="text-neutral-400"> · </span>
                    <span className="text-warning font-semibold">{it.leftover}</span>
                    <span className="text-neutral-500">{riwayat.total_leftover}</span>
                  </>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SkCard>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const weekday = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][d.getDay()];
  const day = d.getDate();
  const month = d.toLocaleString('id-ID', { month: 'short' });
  return `${weekday}, ${day} ${month}`;
}
