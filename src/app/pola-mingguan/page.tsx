import type { Metadata } from 'next';
import { AppGate } from '@/components/features/app-gate/AppGate';
import { PolaMingguanShell } from '@/components/features/pola-mingguan/PolaMingguanShell';
import { polaMingguan } from '@/lib/copy/pola-mingguan';
import { getSessionUser } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: polaMingguan.page_title,
};

export default async function PolaMingguanPage() {
  const user = await getSessionUser();
  return (
    <AppGate
      allowWithoutOnboarding={Boolean(user)}
      fallback={<p className="text-sm text-neutral-500">Sebentar ya...</p>}
    >
      <PolaMingguanShell />
    </AppGate>
  );
}
