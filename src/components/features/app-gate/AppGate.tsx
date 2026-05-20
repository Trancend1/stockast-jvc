'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { readOnboardingState } from '@/lib/onboarding-state';

/**
 * Phase 1 client-side gate: if onboarding state is missing in localStorage,
 * redirect to /onboarding. Phase 2 replaces this with a server-side cookie
 * + RLS gate.
 */
export function AppGate({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const state = readOnboardingState();
    if (!state) {
      router.replace('/onboarding');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <>{fallback ?? null}</>;
  }
  return <>{children}</>;
}
