'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { readOnboardingState } from '@/lib/onboarding-state';

export default function HomePage() {
  const router = useRouter();

  React.useEffect(() => {
    const state = readOnboardingState();
    if (state) {
      router.replace('/dashboard');
    } else {
      router.replace('/homepage');
    }
  }, [router]);

  return (
    <main className="app-container flex min-h-dvh items-center justify-center">
      <p className="text-sm text-neutral-500">Sebentar ya...</p>
    </main>
  );
}
