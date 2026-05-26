import Link from 'next/link';
import * as React from 'react';
import type { Metadata } from 'next';
import { OnboardingForm } from '@/components/features/onboarding/OnboardingForm';

export const metadata: Metadata = {
  title: 'Kenalan dulu',
};

export default function OnboardingPage() {
  return (
    <main className="onboarding-page-shell">
      <div className="onboarding-page-frame">
        <Link href="/" className="onboarding-back-link">
          Kembali
        </Link>
        <OnboardingForm />
      </div>
    </main>
  );
}
