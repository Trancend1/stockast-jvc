'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { WordLogo } from '@/components/ui-kit/illustrations/branding';
import { readOnboardingState } from '@/lib/onboarding-state';

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    const state = readOnboardingState();
    if (state) {
      router.replace('/dashboard');
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <main className="app-container flex min-h-dvh items-center justify-center">
        <p className="text-sm text-neutral-500">Sebentar ya...</p>
      </main>
    );
  }

  return (
    <main
      className="app-container flex min-h-dvh flex-col items-center justify-center px-5"
      style={{ background: 'var(--sk-bg)' }}
    >
      <div className="flex w-full max-w-[360px] flex-col items-center gap-8">
        <WordLogo width={132} height={34} />
        <div className="flex w-full flex-col gap-3 text-center">
          <h1 className="text-2xl leading-tight font-bold tracking-tight text-neutral-900">
            Mau mulai dari mana?
          </h1>
          <p className="text-sm leading-relaxed text-neutral-600">
            Buat setup warung baru dalam 3 langkah, atau masuk kalau datamu sudah pernah dibuat.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <SkButton variant="brand" size="lg" full onClick={() => router.push('/onboarding')}>
            Buat Warung Baru
          </SkButton>
          <SkButton variant="secondary" size="lg" full onClick={() => router.push('/login')}>
            Sudah Punya Warung
          </SkButton>
        </div>
      </div>
    </main>
  );
}
