import type { Metadata } from 'next';
import { StockFlow } from '@/components/features/stock/StockFlow';
import { flags } from '@/lib/config/env';

export const metadata: Metadata = {
  title: 'Catat stok',
};

export default function CatatPage() {
  return (
    <main className="app-container flex min-h-dvh flex-col py-8">
      <StockFlow voiceEnabled={flags.voiceInput} />
    </main>
  );
}
