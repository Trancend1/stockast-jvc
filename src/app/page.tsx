'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { readOnboardingState } from '@/lib/onboarding-state';

/**
 * Phase 1 entry: route to /onboarding if not done, otherwise /dashboard.
 * Phase 2 replaces with server-side cookie gate in middleware.
 */
export default function HomePage() {
  const router = useRouter();

  React.useEffect(() => {
    const state = readOnboardingState();
    router.replace(state ? '/dashboard' : '/onboarding');
  }, [router]);

  return (
    <main className="app-container flex min-h-dvh items-center justify-center">
      <p className="text-sm text-neutral-500">Sebentar ya...</p>
    </main>
  );
}
