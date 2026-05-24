import type { Metadata } from 'next';
import { AppGate } from '@/components/features/app-gate/AppGate';
import { DashboardShell } from '@/components/features/dashboard/DashboardShell';
import { getSessionUser } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Beranda',
};

export default async function DashboardPage() {
  const user = await getSessionUser();
  return (
    <AppGate
      allowWithoutOnboarding={Boolean(user)}
      fallback={<p className="text-sm text-neutral-500">Sebentar ya...</p>}
    >
      <DashboardShell />
    </AppGate>
  );
}
