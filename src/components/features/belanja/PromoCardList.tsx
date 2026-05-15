'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { promoCopy } from '@/lib/copy/belanja';
import { markPromoCopiedAction } from '@/app/actions/promo';
import type { PromoSuggestion } from '@/lib/services/PromoService';

export function PromoCardList({ promos }: { promos: PromoSuggestion[] }) {
  if (promos.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold tracking-tight text-neutral-900">{promoCopy.heading}</h2>
      {promos.map((p) => (
        <PromoCard key={p.promoId} promo={p} />
      ))}
    </section>
  );
}

function PromoCard({ promo }: { promo: PromoSuggestion }) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(promo.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      void markPromoCopiedAction(promo.promoId);
    } catch {
      window.prompt('Salin manual:', promo.message);
    }
  }

  return (
    <Card className="border-warning/40 bg-warning/5">
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-900">{promo.menuName}</span>
          {promo.discountPercent > 0 ? (
            <span className="inline-flex items-center rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">
              {promo.discountPercent}% {promoCopy.badge_diskon}
            </span>
          ) : null}
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-800">
          {promo.message}
        </p>
      </CardContent>
      <CardFooter className="justify-stretch">
        <Button variant="secondary" onClick={handleCopy} className="w-full">
          {copied ? promoCopy.copied : promoCopy.copy}
        </Button>
      </CardFooter>
    </Card>
  );
}
