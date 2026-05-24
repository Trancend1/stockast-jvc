import type { Metadata } from 'next';
import { AppGate } from '@/components/features/app-gate/AppGate';
import { StockFlow } from '@/components/features/stock/StockFlow';
import { getSessionUser } from '@/lib/auth/session';
import { flags } from '@/lib/config/env';

export const metadata: Metadata = {
  title: 'Catat stok',
};

export default async function CatatPage() {
  const user = await getSessionUser();
  return (
    <AppGate
      allowWithoutOnboarding={Boolean(user)}
      fallback={<p className="text-sm text-neutral-500">Sebentar ya...</p>}
    >
      <StockFlow voiceEnabled={flags.voiceInput} />
    </AppGate>
  );
}
