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
  allowWithoutOnboarding = false,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  allowWithoutOnboarding?: boolean;
}) {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const state = readOnboardingState();
    if (!state) {
      if (allowWithoutOnboarding) {
        setReady(true);
        return;
      }
      router.replace('/onboarding');
      return;
    }
    setReady(true);
  }, [allowWithoutOnboarding, router]);

  if (!ready) {
    return <>{fallback ?? null}</>;
  }
  return <>{children}</>;
}
