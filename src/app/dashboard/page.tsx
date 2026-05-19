import type { Metadata } from 'next';
import { AppGate } from '@/components/features/app-gate/AppGate';
import { DashboardShell } from '@/components/features/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: 'Beranda',
};

export default function DashboardPage() {
  return (
    <main className="app-container flex min-h-dvh flex-col py-8">
      <AppGate fallback={<p className="text-sm text-neutral-500">Sebentar ya...</p>}>
        <DashboardShell />
      </AppGate>
    </main>
  );
}
