import { weekdayRatio } from '@/lib/rules/stock';
import type { HistoryPoint } from '@/lib/rules/stock';
import type { MenuRef, StockLogShape } from './recommendation-mapping';

/**
 * Pure compute for Pola Mingguan card. Per-menu × per-weekday breakdown plus
 * an auto-insight ("Tiap Jumat lele +20%").
 *
 * Source: .docs/FEATURE_PRIORITY_MATRIX.md §2.5 — Phase 1.5 pull-forward.
 */

export type WeekdayBar = {
  /** 0 = Minggu, 6 = Sabtu. */
  weekday: number;
  /** Average sold on this weekday across all matching history points. */
  avgSold: number;
  /** Number of history points contributing to this bar. */
  samples: number;
};

export type PolaMingguanItem = {
  menuItemId: string;
  menuName: string;
  unit: string;
  weekdayMax: number;
  bars: WeekdayBar[];
};

export type PolaMingguanInsight = {
  menuName: string;
  weekday: number;
  weekdayLabel: string;
  deltaPercent: number;
  direction: 'up' | 'down';
};

export type PolaMingguanData = {
  items: PolaMingguanItem[];
  insight: PolaMingguanInsight | null;
};

const WEEKDAY_LABELS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;
const INSIGHT_DELTA_THRESHOLD = 0.15; // 15% deviation surfaces as an insight.

export function computePolaMingguan(
  menuItems: ReadonlyArray<MenuRef>,
  logs: ReadonlyArray<StockLogShape>,
): PolaMingguanData {
  if (logs.length === 0 || menuItems.length === 0) {
    return { items: [], insight: null };
  }

  const sorted = [...logs].sort((a, b) =>
    a.service_date < b.service_date ? -1 : a.service_date > b.service_date ? 1 : 0,
  );

  const items: PolaMingguanItem[] = menuItems.map((menu) => {
    const buckets = new Map<number, { sum: number; count: number }>();
    for (const log of sorted) {
      const it = log.items.find((x) => x.menu_item_id === menu.id);
      if (!it) continue;
      const weekday = new Date(log.service_date + 'T00:00:00').getDay();
      const cur = buckets.get(weekday) ?? { sum: 0, count: 0 };
      cur.sum += it.sold;
      cur.count += 1;
      buckets.set(weekday, cur);
    }

    const bars: WeekdayBar[] = WEEKDAY_LABELS.map((_, idx) => {
      const bucket = buckets.get(idx);
      return {
        weekday: idx,
        avgSold: bucket && bucket.count > 0 ? bucket.sum / bucket.count : 0,
        samples: bucket?.count ?? 0,
      };
    });

    const weekdayMax = bars.reduce((acc, b) => Math.max(acc, b.avgSold), 0);
    return {
      menuItemId: menu.id,
      menuName: menu.name,
      unit: menu.unit,
      weekdayMax,
      bars,
    };
  });

  const insight = findStrongestInsight(menuItems, sorted);
  return { items, insight };
}

export function weekdayLabel(weekday: number): string {
  return WEEKDAY_LABELS[weekday] ?? '';
}

/**
 * Scan menu × weekday space for the largest |weekdayRatio - 1|. Surface the
 * top one above threshold as an insight string-ready struct.
 */
function findStrongestInsight(
  menuItems: ReadonlyArray<MenuRef>,
  sortedLogs: ReadonlyArray<StockLogShape>,
): PolaMingguanInsight | null {
  let best: PolaMingguanInsight | null = null;
  let bestMagnitude = INSIGHT_DELTA_THRESHOLD;

  for (const menu of menuItems) {
    const history: HistoryPoint[] = sortedLogs
      .map((log) => {
        const it = log.items.find((x) => x.menu_item_id === menu.id);
        return it ? { date: log.service_date, sold: it.sold } : null;
      })
      .filter((p): p is HistoryPoint => p !== null);

    if (history.length < 3) continue;

    for (let weekday = 0; weekday < 7; weekday += 1) {
      const ratio = weekdayRatio(history, weekday);
      const delta = ratio - 1;
      const magnitude = Math.abs(delta);
      if (magnitude <= bestMagnitude) continue;

      bestMagnitude = magnitude;
      best = {
        menuName: menu.name,
        weekday,
        weekdayLabel: WEEKDAY_LABELS[weekday] ?? '',
        deltaPercent: Math.round(delta * 100),
        direction: delta > 0 ? 'up' : 'down',
      };
    }
  }

  return best;
}
