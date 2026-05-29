'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { WelcomeHero, WordLogo } from '@/components/ui-kit/illustrations/branding';

export default function HomepagePage() {
  const router = useRouter();

  return (
    <main
      className="app-container relative flex min-h-dvh flex-col px-5 py-6 sm:px-8"
      style={{ background: 'var(--sk-bg)' }}
    >
      <header className="flex w-full justify-start">
        <WordLogo width={118} height={30} />
      </header>

      <div className="flex flex-1 items-center justify-center py-6">
        <div className="flex w-full max-w-[332px] flex-col items-center gap-6">
          <div className="flex w-full justify-center" aria-hidden="true">
            <WelcomeHero width={304} height={210} />
          </div>
          <div className="flex w-full max-w-[300px] flex-col gap-2 text-center">
            <h1 className="text-[1.58rem] leading-[1.08] font-bold tracking-[-0.03em] text-neutral-900">
              Mau mulai dari mana?
            </h1>
            <p className="text-[0.76rem] leading-4.5 text-neutral-600">
              Buat setup warung baru dalam 3 langkah, atau masuk kalau datamu sudah pernah dibuat.
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-3">
            <SkButton
              variant="brand"
              size="md"
              className="w-full max-w-[280px]"
              onClick={() => router.push('/onboarding')}
            >
              Buat Warung Baru
            </SkButton>
            <SkButton
              variant="secondary"
              size="md"
              className="w-full max-w-[280px]"
              onClick={() => router.push('/login')}
            >
              Sudah Punya Warung
            </SkButton>
          </div>
        </div>
      </div>
    </main>
  );
}
