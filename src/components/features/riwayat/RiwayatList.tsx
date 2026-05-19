'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubuhToggle } from '@/components/features/subuh/SubuhToggle';
import {
  CloudMark,
  EmptyState,
  NotebookMark,
  SproutMark,
} from '@/components/ui/illustration';
import { riwayat } from '@/lib/copy/riwayat';
import { common } from '@/lib/copy/common';
import { getRiwayat7d, type RiwayatDay } from '@/app/actions/riwayat';

type Phase = 'loading' | 'ready' | 'empty' | 'error';

export function RiwayatList() {
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
    <div className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{riwayat.heading}</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              {riwayat.back}
            </Button>
          </Link>
          <SubuhToggle />
        </div>
      </header>

      {phase === 'loading' ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<CloudMark />}
              title={common.state.loading}
              description="Lagi ambil 7 hari terakhir."
            />
          </CardContent>
        </Card>
      ) : null}

      {phase === 'empty' ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<SproutMark />}
              title="Belum ada catatan"
              description={riwayat.empty}
              action={
                <Link href="/catat">
                  <Button size="md" className="w-full">
                    Catat hari ini
                  </Button>
                </Link>
              }
            />
          </CardContent>
        </Card>
      ) : null}

      {phase === 'error' ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<NotebookMark />}
              title="Gagal ambil riwayat"
              description={errorMsg ?? common.state.error_generic}
            />
          </CardContent>
        </Card>
      ) : null}

      {phase === 'ready'
        ? days.map((day) => <DayCard key={day.serviceDate} day={day} />)
        : null}
    </div>
  );
}

function DayCard({ day }: { day: RiwayatDay }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <span className="font-semibold text-neutral-900">{formatDate(day.serviceDate)}</span>
          <span className="text-xs text-neutral-500">
            {riwayat.total_sold} {day.totalSold} · {riwayat.total_leftover} {day.totalLeftover}
          </span>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {day.items.map((it) => (
            <li
              key={it.menuItemId}
              className="flex items-baseline justify-between text-sm"
            >
              <span className="text-neutral-700">{it.menuName}</span>
              <span className="text-neutral-900">
                <span className="font-semibold">{it.sold}</span>
                <span className="text-neutral-500"> {riwayat.total_sold}</span>
                {it.leftover > 0 ? (
                  <>
                    <span className="text-neutral-400"> · </span>
                    <span className="font-semibold text-warning">{it.leftover}</span>
                    <span className="text-neutral-500"> {riwayat.total_leftover}</span>
                  </>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const weekday = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][d.getDay()];
  const day = d.getDate();
  const month = d.toLocaleString('id-ID', { month: 'short' });
  return `${weekday}, ${day} ${month}`;
}
