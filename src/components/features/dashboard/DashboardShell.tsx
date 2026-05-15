'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { BelanjaCard } from '@/components/features/belanja/BelanjaCard';
import { PromoCardList } from '@/components/features/belanja/PromoCardList';
import { readOnboardingState } from '@/components/features/onboarding/OnboardingForm';
import { getBelanjaCard, type BelanjaCardData } from '@/app/actions/recommendation';
import { getPromosForToday } from '@/app/actions/promo';
import type { PromoSuggestion } from '@/lib/services/PromoService';
import { belanja } from '@/lib/copy/belanja';
import { common } from '@/lib/copy/common';

type Phase = 'loading' | 'ready' | 'no-history' | 'error';

export function DashboardShell() {
  const [warungName, setWarungName] = React.useState<string | null>(null);
  const [phase, setPhase] = React.useState<Phase>('loading');
  const [card, setCard] = React.useState<BelanjaCardData | null>(null);
  const [promos, setPromos] = React.useState<PromoSuggestion[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    const state = readOnboardingState();
    setWarungName(state?.warungName ?? 'warung');
    void loadAll(state?.warungName ?? 'Warung');
  }, []);

  async function loadAll(name: string) {
    setPhase('loading');
    const [cardResult, promoResult] = await Promise.all([
      getBelanjaCard(),
      getPromosForToday({ warungName: name }),
    ]);

    if (cardResult.error) {
      if (cardResult.error.code === 'NOT_FOUND') {
        setPhase('no-history');
      } else {
        setErrorMsg(cardResult.error.message);
        setPhase('error');
      }
      return;
    }

    setCard(cardResult.data);
    setPromos(promoResult.error ? [] : promoResult.data.promos);
    setPhase('ready');
  }

  async function handleRefresh() {
    setPhase('loading');
    const cardResult = await getBelanjaCard({ forceRefresh: true });
    if (cardResult.error) {
      setErrorMsg(cardResult.error.message);
      setPhase('error');
      return;
    }
    setCard(cardResult.data);
    setPhase('ready');
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-neutral-600">Halo,</p>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          {warungName ?? 'warung'}
        </h1>
      </header>

      {phase === 'loading' ? <LoadingCard /> : null}

      {phase === 'no-history' ? <EmptyCard /> : null}

      {phase === 'error' ? <ErrorCard message={errorMsg} /> : null}

      {phase === 'ready' && card ? (
        <>
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
          <PromoCardList promos={promos} />
        </>
      ) : null}

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
    </div>
  );
}

function LoadingCard() {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-neutral-600">{common.state.loading}</p>
      </CardContent>
    </Card>
  );
}

function EmptyCard() {
  return (
    <Card>
      <CardContent>
        <CardTitle>{belanja.heading}</CardTitle>
        <CardDescription>{belanja.empty.no_history}</CardDescription>
      </CardContent>
    </Card>
  );
}

function ErrorCard({ message }: { message: string | null }) {
  return (
    <Card>
      <CardContent>
        <CardTitle>Ups</CardTitle>
        <CardDescription>{message ?? common.state.error_generic}</CardDescription>
      </CardContent>
    </Card>
  );
}
