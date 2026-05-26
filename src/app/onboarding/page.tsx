import Link from 'next/link';
import * as React from 'react';
import type { Metadata } from 'next';
import { OnboardingForm } from '@/components/features/onboarding/OnboardingForm';

export const metadata: Metadata = {
  title: 'Kenalan dulu',
};

export default function OnboardingPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col bg-[var(--sk-bg)] px-5 py-4 sm:px-8 md:px-10">
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-1">
        <Link
          href="/"
          className="inline-flex w-fit text-xs font-semibold text-neutral-600 no-underline"
        >
          Kembali
        </Link>
        <OnboardingForm />
      </div>
    </main>
  );
}
