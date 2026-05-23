'use client';

import * as React from 'react';
import { IconPercent, IconWhatsapp } from '@/components/ui-kit/icons';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkPill } from '@/components/ui-kit/primitives/sk-pill';
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
    <SkCard
      tone="ghost"
      style={{ borderColor: 'var(--sk-warn)', background: 'var(--sk-warn-soft)' }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-900">{promo.menuName}</span>
          {promo.discountPercent > 0 ? (
            <SkPill tone="warn" dot>
              <IconPercent size={12} />
              {promo.discountPercent}% {promoCopy.badge_diskon}
            </SkPill>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-line text-neutral-800">
          {promo.message}
        </p>
        <SkButton
          variant="secondary"
          onClick={handleCopy}
          full
          leading={<IconWhatsapp size={16} />}
        >
          {copied ? promoCopy.copied : promoCopy.copy}
        </SkButton>
      </div>
    </SkCard>
  );
}
