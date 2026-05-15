import type { Metadata } from 'next';
import { OnboardingForm } from '@/components/features/onboarding/OnboardingForm';

export const metadata: Metadata = {
  title: 'Kenalan dulu',
};

export default function OnboardingPage() {
  return (
    <main className="app-container flex min-h-dvh flex-col justify-center py-10">
      <OnboardingForm />
    </main>
  );
}
