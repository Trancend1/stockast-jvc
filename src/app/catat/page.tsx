import type { Metadata } from 'next';
import { AppGate } from '@/components/features/app-gate/AppGate';
import { StockFlow } from '@/components/features/stock/StockFlow';
import { flags } from '@/lib/config/env';

export const metadata: Metadata = {
  title: 'Catat stok',
};

export default function CatatPage() {
  return (
    <AppGate fallback={<p className="text-sm text-neutral-500">Sebentar ya...</p>}>
      <StockFlow voiceEnabled={flags.voiceInput} />
    </AppGate>
  );
}
