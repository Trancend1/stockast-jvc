'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getPolaMingguan } from '@/app/actions/pola-mingguan';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  EmptyPanel,
  IllustError,
  IllustNoHistory,
} from '@/components/ui-kit/illustrations/empty-states';
import { common } from '@/lib/copy/common';
import { polaMingguan } from '@/lib/copy/pola-mingguan';
import type { PolaMingguanData } from '@/lib/services/pola-mingguan';
import { PolaMingguanCard } from './PolaMingguanCard';

type Phase = 'loading' | 'ready' | 'error';

export function PolaMingguanShell() {
  const router = useRouter();
  const [phase, setPhase] = React.useState<Phase>('loading');
  const [data, setData] = React.useState<PolaMingguanData | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      const result = await getPolaMingguan();
      if (result.error) {
        setErrorMsg(result.error.message);
        setPhase('error');
        return;
      }
      setData(result.data);
      setPhase('ready');
    }

    void load();
  }, []);

  return (
    <AppLayout
      title={polaMingguan.page_title}
      topbarMode="task"
      onBack={() => router.push('/dashboard')}
    >
      <div className="flex flex-col gap-4 px-4 pt-4">
        {phase === 'loading' ? (
          <EmptyPanel
            illust={IllustNoHistory}
            title={common.state.loading}
            body="Lagi ambil pola penjualan mingguan."
          />
        ) : null}

        {phase === 'error' ? (
          <EmptyPanel
            illust={IllustError}
            title="Gagal ambil Pola Mingguan"
            body={errorMsg ?? common.state.error_generic}
          />
        ) : null}

        {phase === 'ready' && data ? <PolaMingguanCard data={data} /> : null}
      </div>
    </AppLayout>
  );
}
