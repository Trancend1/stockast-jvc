import type { DawnRibbonWeather } from '@/components/ui-kit/illustrations';

export type ItemTrend = 'up' | 'down' | 'flat';

export interface BelanjaItem {
  name: string;
  qty: number;
  unit: string;
  base: number;
  prevLeft: number;
  trend: ItemTrend;
  delta: string;
  note?: string;
}

export const BELANJA_ITEMS: ReadonlyArray<BelanjaItem> = [
  { name: 'Lele', qty: 24, unit: 'ekor', base: 30, prevLeft: 5, trend: 'down', delta: '−6' },
  { name: 'Ayam', qty: 12, unit: 'ekor', base: 10, prevLeft: 0, trend: 'up', delta: '+2', note: 'habis 14:00' },
  { name: 'Tahu', qty: 14, unit: 'pcs', base: 20, prevLeft: 8, trend: 'down', delta: '−6' },
  { name: 'Tempe', qty: 8, unit: 'papan', base: 8, prevLeft: 1, trend: 'flat', delta: '0' },
  { name: 'Cabai rawit', qty: 250, unit: 'g', base: 300, prevLeft: 50, trend: 'down', delta: '−50' },
];

export interface BelanjaCardCommonProps {
  items?: ReadonlyArray<BelanjaItem>;
  day?: string;
  date?: string;
  weather?: DawnRibbonWeather;
  subuh?: boolean;
  animate?: boolean;
}

export function trendColor(trend: ItemTrend): string {
  if (trend === 'down') return 'var(--sk-success)';
  if (trend === 'up') return 'var(--sk-warn)';
  return 'var(--sk-text-3)';
}
