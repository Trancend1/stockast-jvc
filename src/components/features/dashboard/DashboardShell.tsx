'use client';

import * as React from 'react';
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
import { getCuacaCardData } from '@/app/actions/weather';
import { Banner } from '@/components/ui-kit/notifications';
import { getBelanjaCard, type BelanjaCardData } from '@/app/actions/recommendation';
import { getPromosForToday } from '@/app/actions/promo';
import type { PromoSuggestion } from '@/lib/services/PromoService';
import { belanja } from '@/lib/copy/belanja';
import { readOnboardingState } from '@/lib/onboarding-state';
import type { WeatherSnapshot } from '@/lib/weather';

type Phase = 'loading' | 'ready' | 'empty' | 'error' | 'unavailable';
type EmptyReason = 'NO_MENU' | 'NO_HISTORY';

export function DashboardShell() {
  const [warungName, setWarungName] = React.useState<string | undefined>(undefined);
  const [phase, setPhase] = React.useState<Phase>('loading');
  const [card, setCard] = React.useState<BelanjaCardData | null>(null);
  const [promos, setPromos] = React.useState<PromoSuggestion[]>([]);
  const [weather, setWeather] = React.useState<WeatherSnapshot | null>(null);
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
      const [cardResult, promoResult, weatherResult] = await Promise.all([
        getBelanjaCard(),
        getPromosForToday({ warungName: name }),
        getCuacaCardData(),
      ]);

      if (cardResult.error) {
        applyCardError(cardResult.error);
        return;
      }

      setCard(cardResult.data);
      setPromos(promoResult.error ? [] : promoResult.data.promos);
      setWeather(weatherResult.error ? null : weatherResult.data.weather);
      setPhase('ready');
    },
    [applyCardError],
  );

  React.useEffect(() => {
    const state = readOnboardingState();
    const storedName = state?.warungName?.trim();
    const resolved = storedName || belanja.warung_fallback;
    setWarungName(storedName || undefined);
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
    const weatherResult = await getCuacaCardData({ serviceDate: cardResult.data.serviceDate });
    setWeather(weatherResult.error ? null : weatherResult.data.weather);
    setPhase('ready');
  }

  return (
    <AppLayout warungName={warungName} contentWidth="full">
      {phase === 'ready' && card ? (
        <div className="dashboard-shell" data-testid="dashboard-layout">
          <div className="dashboard-main-column" data-testid="dashboard-main-column">
            <BelanjaCard data={card} />
          </div>
          <div className="dashboard-side-column" data-testid="dashboard-side-column">
            {weather ? <CuacaCard weather={weather} /> : null}
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
            <PromoCardList promos={promos} />
          </div>
        </div>
      ) : (
        <div className="dashboard-shell dashboard-shell-single">
          {phase === 'loading' ? <BelanjaCardSkeleton /> : null}
          {phase === 'empty' ? <EmptyCard reason={emptyReason} message={errorMsg} /> : null}
          {phase === 'error' ? (
            <ErrorCard
              message={errorMsg}
              onRetry={() => loadAll(warungName ?? belanja.warung_fallback)}
            />
          ) : null}
          {phase === 'unavailable' ? <UnavailableCard message={errorMsg} /> : null}
        </div>
      )}
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
        <SkButton variant="brand" size="md" full onClick={onRetry}>
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
