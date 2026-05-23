import type { Metadata } from 'next';
import { AppGate } from '@/components/features/app-gate/AppGate';
import { PolaMingguanShell } from '@/components/features/pola-mingguan/PolaMingguanShell';
import { polaMingguan } from '@/lib/copy/pola-mingguan';

export const metadata: Metadata = {
  title: polaMingguan.page_title,
};

export default function PolaMingguanPage() {
  return (
    <AppGate fallback={<p className="text-sm text-neutral-500">Sebentar ya...</p>}>
      <PolaMingguanShell />
    </AppGate>
  );
}
