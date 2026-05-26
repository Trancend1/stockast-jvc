import { recommend } from '@/lib/rules/recommendation';
import type { HistoryPoint } from '@/lib/rules/stock';
import type { WeatherCategory } from '@/lib/config/thresholds';
import { WEEKDAY_LABELS_ID } from '@/lib/utils';
import type { ConfidenceLabel, RecommendationItem } from '@/types/domain';

/**
 * Pure mapping over historical stock_logs → per-menu HistoryPoint arrays.
 * Lives outside RecommendationService so unit tests bypass server-only.
 */

export type StockLogShape = {
  service_date: string;
  items: Array<{
    menu_item_id: string;
    sold: number;
    leftover: number;
    unit: string;
  }>;
};

export type MenuRef = {
  id: string;
  name: string;
  normalized_name: string;
  unit: string;
};

export type ComputeRecommendationsInput = {
  menuItems: ReadonlyArray<MenuRef>;
  logs: ReadonlyArray<StockLogShape>;
  weekday: number;
  weather: WeatherCategory;
};

export type ComputeRecommendationsResult = {
  items: RecommendationItem[];
  confidenceLabel: ConfidenceLabel;
  leftoverYesterday: Map<string, number>;
};

type MenuWeatherKind = 'warm_fried' | 'cold_drink' | 'neutral';

export function computeRecommendations(
  input: ComputeRecommendationsInput,
): ComputeRecommendationsResult {
  const sortedLogs = [...input.logs].sort((a, b) =>
    a.service_date < b.service_date ? -1 : a.service_date > b.service_date ? 1 : 0,
  );

  const items: RecommendationItem[] = [];
  const leftoverYesterday = new Map<string, number>();
  let worstConfidence: ConfidenceLabel = 'Pola jelas';

  for (const menu of input.menuItems) {
    const history: HistoryPoint[] = sortedLogs
      .map((log) => {
        const it = log.items.find((x) => x.menu_item_id === menu.id);
        return it ? { date: log.service_date, sold: it.sold } : null;
      })
      .filter((p): p is HistoryPoint => p !== null);

    const result = recommend({
      history,
      weekday: input.weekday,
      weather: input.weather,
    });
    const overlayFactor = weatherOverlayFactor(
      classifyMenuWeatherKind(menu.normalized_name),
      input.weather,
    );

    items.push({
      menuItemId: menu.id,
      base: result.base,
      weatherFactor: roundFactor(result.weatherFactor * overlayFactor),
      weekdayFactor: result.weekdayFactor,
      suggested: Math.max(0, Math.round(result.suggested * overlayFactor)),
      confidenceLabel: result.confidenceLabel,
    });

    worstConfidence = downgrade(worstConfidence, result.confidenceLabel);

    const last = sortedLogs[sortedLogs.length - 1];
    if (last) {
      const lastForMenu = last.items.find((x) => x.menu_item_id === menu.id);
      if (lastForMenu) leftoverYesterday.set(menu.id, lastForMenu.leftover);
    }
  }

  return { items, confidenceLabel: worstConfidence, leftoverYesterday };
}

const RANK: Record<ConfidenceLabel, number> = {
  'Pola jelas': 2,
  'Data baru, hati-hati': 1,
  'Tidak yakin': 0,
};

function downgrade(current: ConfidenceLabel, candidate: ConfidenceLabel): ConfidenceLabel {
  return RANK[candidate] < RANK[current] ? candidate : current;
}

export function indonesianWeekdayLabel(weekday: number): string {
  return WEEKDAY_LABELS_ID[weekday] ?? 'hari ini';
}

function classifyMenuWeatherKind(normalizedName: string): MenuWeatherKind {
  const value = normalizedName.trim().toLowerCase();

  if (
    [
      'goreng',
      'bakwan',
      'mendoan',
      'tahu isi',
      'pisang goreng',
      'cireng',
      'bakso',
      'soto',
      'mie',
      'bubur',
      'kopi',
      'teh panas',
    ].some((keyword) => value.includes(keyword))
  ) {
    return 'warm_fried';
  }

  if (
    ['es ', 'jus', 'juice', 'teh es', 'kopi dingin', 'soda', 'jeruk', 'kelapa', 'minuman'].some(
      (keyword) => value.includes(keyword),
    )
  ) {
    return 'cold_drink';
  }

  return 'neutral';
}

function weatherOverlayFactor(kind: MenuWeatherKind, weather: WeatherCategory): number {
  if (weather === 'hujan_deras') {
    if (kind === 'warm_fried') return 1.1;
    if (kind === 'cold_drink') return 0.9;
    return 1;
  }

  if (weather === 'mendung') {
    if (kind === 'warm_fried') return 1.05;
    if (kind === 'cold_drink') return 0.95;
    return 1;
  }

  if (weather === 'cerah_libur') {
    if (kind === 'cold_drink') return 1.1;
    if (kind === 'neutral') return 1.03;
    return 1;
  }

  return 1;
}

function roundFactor(value: number): number {
  return Math.round(value * 1000) / 1000;
}
