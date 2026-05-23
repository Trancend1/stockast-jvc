import type { Metadata } from 'next';
import { OnboardingForm } from '@/components/features/onboarding/OnboardingForm';

export const metadata: Metadata = {
  title: 'Kenalan dulu',
};

export default function OnboardingPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col bg-[var(--sk-bg)] px-5 py-4 sm:px-8 md:px-10">
      <OnboardingForm />
    </main>
  );
}
