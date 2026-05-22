import type { Metadata } from 'next';
import { StockFlow } from '@/components/features/stock/StockFlow';
import { flags } from '@/lib/config/env';

export const metadata: Metadata = {
  title: 'Catat stok',
};

export default function CatatPage() {
  return <StockFlow voiceEnabled={flags.voiceInput} />;
}
