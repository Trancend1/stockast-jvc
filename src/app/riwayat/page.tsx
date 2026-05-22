import type { Metadata } from 'next';
import { AppGate } from '@/components/features/app-gate/AppGate';
import { RiwayatList } from '@/components/features/riwayat/RiwayatList';

export const metadata: Metadata = {
  title: 'Riwayat 7 hari',
};

export default function RiwayatPage() {
  return (
    <AppGate fallback={<p className="text-sm text-neutral-500">Sebentar ya...</p>}>
      <RiwayatList />
    </AppGate>
  );
}
