'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ONBOARDING_STORAGE_KEY, readOnboardingState } from '@/lib/onboarding-state';

export default function HomePage() {
  const router = useRouter();

  React.useEffect(() => {
    // Dev: always start clean — each root visit resets to onboarding.
    if (process.env.NODE_ENV === 'development') {
      try {
        localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      } catch {
        // Storage unavailable — proceed anyway.
      }
      router.replace('/onboarding');
      return;
    }
    const state = readOnboardingState();
    router.replace(state ? '/dashboard' : '/onboarding');
  }, [router]);

  return (
    <main className="app-container flex min-h-dvh items-center justify-center">
      <p className="text-sm text-neutral-500">Sebentar ya...</p>
    </main>
  );
}
