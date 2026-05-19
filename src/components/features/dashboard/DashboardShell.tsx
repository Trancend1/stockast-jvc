'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CloudMark,
  EmptyState,
  NotebookMark,
  SproutMark,
} from '@/components/ui/illustration';
import { BelanjaCard } from '@/components/features/belanja/BelanjaCard';
import { PromoCardList } from '@/components/features/belanja/PromoCardList';
import { CuacaCard } from '@/components/features/cuaca/CuacaCard';
import { PolaMingguanCard } from '@/components/features/pola-mingguan/PolaMingguanCard';
import { SubuhToggle } from '@/components/features/subuh/SubuhToggle';
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
  const [warungName, setWarungName] = React.useState<string>(belanja.warung_fallback);
  const [phase, setPhase] = React.useState<Phase>('loading');
  const [card, setCard] = React.useState<BelanjaCardData | null>(null);
  const [promos, setPromos] = React.useState<PromoSuggestion[]>([]);
  const [pola, setPola] = React.useState<PolaMingguanData | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [emptyReason, setEmptyReason] = React.useState<EmptyReason>('NO_HISTORY');

  React.useEffect(() => {
    const state = readOnboardingState();
    const resolved = state?.warungName?.trim() || belanja.warung_fallback;
    setWarungName(resolved);
    void loadAll(resolved);
  }, []);

  async function loadAll(name: string) {
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
  }

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

  function applyCardError(error: NonNullable<Awaited<ReturnType<typeof getBelanjaCard>>['error']>) {
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
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-neutral-600">{belanja.greeting}</p>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {warungName}
          </h1>
        </div>
        <SubuhToggle />
      </header>

      {phase === 'loading' ? <LoadingCard /> : null}

      {phase === 'empty' ? <EmptyCard reason={emptyReason} message={errorMsg} /> : null}

      {phase === 'error' ? <ErrorCard message={errorMsg} /> : null}

      {phase === 'unavailable' ? <UnavailableCard message={errorMsg} /> : null}

      {phase === 'ready' && card ? (
        <>
          <CuacaCard serviceDate={card.serviceDate} />
          <BelanjaCard data={card} />
          {card.cached ? (
            <button
              type="button"
              onClick={handleRefresh}
              className="text-left text-xs font-semibold text-brand-700 hover:text-brand-800"
            >
              {belanja.cached_badge} · {belanja.refresh.toLowerCase()}
            </button>
          ) : null}
          {pola ? <PolaMingguanCard data={pola} /> : null}
          <PromoCardList promos={promos} />
        </>
      ) : null}

      <BottomNav />
    </div>
  );
}

function BottomNav() {
  return (
    <div className="flex flex-col gap-2">
      <Link href="/catat">
        <Button size="lg" className="w-full">
          {belanja.catat_cta}
        </Button>
      </Link>
      <Link href="/riwayat">
        <Button size="md" variant="ghost" className="w-full">
          {belanja.riwayat_cta}
        </Button>
      </Link>
    </div>
  );
}

function LoadingCard() {
  return (
    <Card>
      <CardContent>
        <EmptyState
          icon={<CloudMark />}
          title={belanja.loading.title}
          description={belanja.loading.description}
        />
      </CardContent>
    </Card>
  );
}

function EmptyCard({ reason, message }: { reason: EmptyReason; message: string | null }) {
  const copy =
    reason === 'NO_MENU'
      ? {
          title: belanja.empty.no_menu_title,
          description: message ?? belanja.empty.no_menu,
        }
      : {
          title: belanja.empty.no_history_title,
          description: message ?? belanja.empty.no_history,
        };

  return (
    <Card>
      <CardContent>
        <EmptyState
          icon={<SproutMark />}
          title={copy.title}
          description={copy.description}
        />
      </CardContent>
    </Card>
  );
}

function readEmptyReason(reason: unknown): EmptyReason {
  return reason === 'NO_MENU' ? 'NO_MENU' : 'NO_HISTORY';
}

function ErrorCard({ message }: { message: string | null }) {
  return (
    <Card>
      <CardContent>
        <EmptyState
          icon={<NotebookMark />}
          title={belanja.error.title}
          description={message ?? belanja.error.fallback}
        />
      </CardContent>
    </Card>
  );
}

function UnavailableCard({ message }: { message: string | null }) {
  return (
    <Card>
      <CardContent>
        <EmptyState
          icon={<NotebookMark />}
          title={belanja.service_unavailable.title}
          description={message ?? belanja.service_unavailable.description}
        />
      </CardContent>
    </Card>
  );
}
