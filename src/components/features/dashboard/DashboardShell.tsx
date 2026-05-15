'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { readOnboardingState } from '@/components/features/onboarding/OnboardingForm';

/**
 * Phase 1 Dashboard placeholder. Sprint B replaces the placeholder card with
 * the real Belanja Card computed from rules + Gemini explanation.
 */
export function DashboardShell() {
  const [warungName, setWarungName] = React.useState<string | null>(null);

  React.useEffect(() => {
    const state = readOnboardingState();
    setWarungName(state?.warungName ?? null);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-neutral-600">Halo,</p>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          {warungName ?? 'warung'}
        </h1>
      </header>

      <Card>
        <CardContent>
          <CardTitle>Belanja besok</CardTitle>
          <CardDescription>
            Bakal muncul di sini setelah kamu catat stok 2 hari berturut-turut.
          </CardDescription>
        </CardContent>
      </Card>

      <Link href="/catat" className="contents">
        <Button size="lg" className="w-full">
          Catat hari ini
        </Button>
      </Link>
    </div>
  );
}
