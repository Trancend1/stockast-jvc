import { compactHint } from './mock';
import type { WeatherSnapshot } from './types';

type BMKGEntry = {
  local_datetime?: string;
  datetime?: string;
  utc_datetime?: string;
  time?: string;
  weather_desc?: string;
  weather?: string;
};

const DAYTIME_START_HOUR = 9;
const DAYTIME_END_HOUR = 21;

export async function fetchBmkgWeather(args: {
  adm4Code: string;
  serviceDate: string;
  fetchImpl: typeof fetch;
}): Promise<WeatherSnapshot> {
  const res = await args.fetchImpl(
    `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(args.adm4Code)}`,
    { cache: 'no-store' },
  );
  if (!res.ok) {
    throw new Error(`BMKG weather request failed: ${res.status}`);
  }

  const payload: unknown = await res.json();
  const entries = collectBmkgEntries(payload);
  if (entries.length === 0) {
    throw new Error('BMKG weather response empty');
  }

  const relevant = entries.filter((entry) => entry.serviceDate === args.serviceDate);
  const pool = relevant.length > 0 ? relevant : entries;
  const daytime = pool.filter(
    (entry) =>
      entry.hour !== null && entry.hour >= DAYTIME_START_HOUR && entry.hour <= DAYTIME_END_HOUR,
  );
  const candidates = daytime.length > 0 ? daytime : pool;
  const chosen = candidates.reduce((current, entry) =>
    severityRank(entry.category) > severityRank(current.category) ? entry : current,
  );

  return {
    serviceDate: args.serviceDate,
    adm4Code: args.adm4Code,
    category: chosen.category,
    label: labelForCategory(chosen.category),
    hint: compactHint(chosen.category),
    source: 'bmkg',
    fetchedAt: new Date().toISOString(),
    cacheHit: false,
    cacheLayer: 'none',
  };
}

function collectBmkgEntries(payload: unknown): Array<{
  category: WeatherSnapshot['category'];
  serviceDate: string | null;
  hour: number | null;
}> {
  const out: Array<{
    category: WeatherSnapshot['category'];
    serviceDate: string | null;
    hour: number | null;
  }> = [];

  walkPayload(payload, out);
  return out;
}

function walkPayload(
  value: unknown,
  out: Array<{
    category: WeatherSnapshot['category'];
    serviceDate: string | null;
    hour: number | null;
  }>,
): void {
  if (Array.isArray(value)) {
    for (const item of value) walkPayload(item, out);
    return;
  }

  if (!value || typeof value !== 'object') return;
  const candidate = value as BMKGEntry;
  const description = candidate.weather_desc ?? candidate.weather;
  if (description) {
    const normalizedDate = normalizeServiceDate(
      candidate.local_datetime ?? candidate.datetime ?? candidate.utc_datetime ?? candidate.time,
    );
    out.push({
      category: categoryFromDescription(description),
      serviceDate: normalizedDate?.serviceDate ?? null,
      hour: normalizedDate?.hour ?? null,
    });
  }

  for (const nested of Object.values(value)) {
    walkPayload(nested, out);
  }
}

function normalizeServiceDate(
  raw: string | undefined,
): { serviceDate: string; hour: number | null } | null {
  if (!raw) return null;
  const match = raw.match(/(\d{4}-\d{2}-\d{2})[ T](\d{2})/);
  if (match) {
    const serviceDate = match[1];
    const hourRaw = match[2];
    if (!serviceDate || !hourRaw) return null;
    return {
      serviceDate,
      hour: Number(hourRaw),
    };
  }
  const compactMatch = raw.match(/(\d{4})(\d{2})(\d{2})(\d{2})/);
  if (compactMatch) {
    const year = compactMatch[1];
    const month = compactMatch[2];
    const day = compactMatch[3];
    const hourRaw = compactMatch[4];
    if (!year || !month || !day || !hourRaw) return null;
    return {
      serviceDate: `${year}-${month}-${day}`,
      hour: Number(hourRaw),
    };
  }
  return null;
}

function categoryFromDescription(description: string): WeatherSnapshot['category'] {
  const normalized = description.trim().toLowerCase();
  if (
    normalized.includes('petir') ||
    normalized.includes('lebat') ||
    normalized.includes('badai') ||
    normalized.includes('hujan sedang') ||
    normalized.includes('hujan deras')
  ) {
    return 'hujan_deras';
  }
  if (
    normalized.includes('hujan') ||
    normalized.includes('gerimis') ||
    normalized.includes('mendung') ||
    normalized.includes('berawan')
  ) {
    return 'mendung';
  }
  if (normalized.includes('cerah') || normalized.includes('terang')) {
    return 'cerah_libur';
  }
  return 'unknown';
}

function severityRank(category: WeatherSnapshot['category']): number {
  if (category === 'hujan_deras') return 3;
  if (category === 'mendung') return 2;
  if (category === 'cerah_libur') return 1;
  return 0;
}

function labelForCategory(category: WeatherSnapshot['category']): string {
  if (category === 'hujan_deras') return 'Hujan deras';
  if (category === 'mendung') return 'Mendung';
  if (category === 'cerah_libur') return 'Cerah';
  return 'Cuaca belum kebaca';
}
