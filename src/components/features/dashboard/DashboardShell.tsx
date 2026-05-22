'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import {
  EmptyPanel,
  IllustError,
  IllustNoData,
  IllustNoHistory,
} from '@/components/ui-kit/illustrations/empty-states';
import { BelanjaCard } from '@/components/features/belanja/BelanjaCard';
import { BelanjaCardSkeleton } from '@/components/features/belanja/BelanjaCardSkeleton';
import { PromoCardList } from '@/components/features/belanja/PromoCardList';
import { CuacaCard } from '@/components/features/cuaca/CuacaCard';
import { PolaMingguanCard } from '@/components/features/pola-mingguan/PolaMingguanCard';
import { SubuhToggle } from '@/components/features/subuh/SubuhToggle';
import { Banner } from '@/components/ui-kit/notifications';
import { getBelanjaCard, type BelanjaCardData } from '@/app/actions/recommendation';
import { getPromosForToday } from '@/app/actions/promo';
import { getPolaMingguan } from '@/app/actions/pola-mingguan';
import type { PromoSuggestion } from '@/lib/services/PromoService';
import type { PolaMingguanData } from '@/lib/services/pola-mingguan';
import { belanja } from '@/lib/copy/belanja';
import { readOnboardingState } from '@/lib/onboarding-state';

type Phase = 'loading' | 'ready' | 'empty' | 'error' | 'unavailable';
type EmptyReason = 'NO_MENU' | 'NO_HISTORY';

export function DashboardShell() {
  const router = useRouter();
  const [warungName, setWarungName] = React.useState<string>(belanja.warung_fallback);
  const [phase, setPhase] = React.useState<Phase>('loading');
  const [card, setCard] = React.useState<BelanjaCardData | null>(null);
  const [promos, setPromos] = React.useState<PromoSuggestion[]>([]);
  const [pola, setPola] = React.useState<PolaMingguanData | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [emptyReason, setEmptyReason] = React.useState<EmptyReason>('NO_HISTORY');

  const applyCardError = React.useCallback(
    (error: NonNullable<Awaited<ReturnType<typeof getBelanjaCard>>['error']>) => {
      setErrorMsg(error.message);
      if (error.code === 'NOT_FOUND') {
        setEmptyReason(readEmptyReason(error.details?.reason));
        setPhase('empty');
        return;
      }
      if (error.code === 'SERVICE_UNAVAILABLE') {
        setPhase('unavailable');
        return;
      }
      setPhase('error');
    },
    [],
  );

  const loadAll = React.useCallback(
    async (name: string) => {
      setPhase('loading');
      setErrorMsg(null);
      const [cardResult, promoResult, polaResult] = await Promise.all([
        getBelanjaCard(),
        getPromosForToday({ warungName: name }),
        getPolaMingguan(),
      ]);

      if (cardResult.error) {
        applyCardError(cardResult.error);
        return;
      }

      setCard(cardResult.data);
      setPromos(promoResult.error ? [] : promoResult.data.promos);
      setPola(polaResult.error ? null : polaResult.data);
      setPhase('ready');
    },
    [applyCardError],
  );

  React.useEffect(() => {
    const state = readOnboardingState();
    const resolved = state?.warungName?.trim() || belanja.warung_fallback;
    setWarungName(resolved);
    void loadAll(resolved);
  }, [loadAll]);

  async function handleRefresh() {
    setPhase('loading');
    setErrorMsg(null);
    const cardResult = await getBelanjaCard({ forceRefresh: true });
    if (cardResult.error) {
      applyCardError(cardResult.error);
      return;
    }
    setCard(cardResult.data);
    setPhase('ready');
  }

  return (
    <AppLayout warungName={warungName} trailing={<SubuhToggle />}>
      <div className="flex flex-col gap-6 px-4 pt-4">
        {phase === 'loading' ? <BelanjaCardSkeleton /> : null}
        {phase === 'empty' ? <EmptyCard reason={emptyReason} message={errorMsg} /> : null}
        {phase === 'error' ? (
          <ErrorCard message={errorMsg} onRetry={() => loadAll(warungName)} />
        ) : null}
        {phase === 'unavailable' ? <UnavailableCard message={errorMsg} /> : null}

        {phase === 'ready' && card ? (
          <>
            <CuacaCard serviceDate={card.serviceDate} />
            <BelanjaCard data={card} />
            {card.cached ? (
              <Banner
                kind="info"
                title={belanja.cached_badge}
                message="Kartu ini dari cache terakhir. Refresh kalau stok sudah berubah."
                action={
                  <SkButton variant="ghost" size="sm" onClick={handleRefresh}>
                    {belanja.refresh}
                  </SkButton>
                }
              />
            ) : null}
            {pola ? <PolaMingguanCard data={pola} /> : null}
            <PromoCardList promos={promos} />
          </>
        ) : null}

        <SkButton variant="brand" size="lg" full onClick={() => router.push('/catat')}>
          {belanja.catat_cta}
        </SkButton>
      </div>
    </AppLayout>
  );
}

function EmptyCard({ reason, message }: { reason: EmptyReason; message: string | null }) {
  const copy =
    reason === 'NO_MENU'
      ? { title: belanja.empty.no_menu_title, description: message ?? belanja.empty.no_menu }
      : {
          title: belanja.empty.no_history_title,
          description: message ?? belanja.empty.no_history,
        };
  return (
    <EmptyPanel
      illust={reason === 'NO_MENU' ? IllustNoData : IllustNoHistory}
      title={copy.title}
      body={copy.description}
    />
  );
}

function ErrorCard({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <EmptyPanel
      illust={IllustError}
      title={belanja.error.title}
      body={message ?? belanja.error.fallback}
      cta={
        <SkButton variant="brand" size="lg" full onClick={onRetry}>
          {belanja.error.retry}
        </SkButton>
      }
    />
  );
}

function UnavailableCard({ message }: { message: string | null }) {
  return (
    <EmptyPanel
      illust={IllustError}
      title={belanja.service_unavailable.title}
      body={message ?? belanja.service_unavailable.description}
    />
  );
}

function readEmptyReason(reason: unknown): EmptyReason {
  return reason === 'NO_MENU' ? 'NO_MENU' : 'NO_HISTORY';
}
