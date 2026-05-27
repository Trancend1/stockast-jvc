'use client';

import { readOnboardingState } from '@/lib/onboarding-state';
import { useRouter } from 'next/navigation';
import * as React from 'react';

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
    // BUG-06: authenticated users (allowWithoutOnboarding=true) skip the
    // localStorage gate entirely — the server already validated their session
    // and requireOutletAccess() handles the /onboarding redirect server-side.
    if (allowWithoutOnboarding) {
      setReady(true);
      return;
    }
    const state = readOnboardingState();
    if (!state) {
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
