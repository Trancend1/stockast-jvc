import type { MenuItemRow, StockLogItemRow } from '@/lib/db/types';

/**
 * Deterministic 7-day demo data generator for the single-tenant Phase 1 demo.
 *
 * Anchored on the current Asia/Jakarta date so Belanja Card on the dashboard
 * always sees yesterday + 6 prior days. Variance is pseudo-random but seeded
 * by date string so the same day produces the same numbers (idempotency
 * matters because onboarding can fire ensureDemoSeed multiple times).
 *
 * Pure function — extracted so it can be unit tested.
 */

export type DemoSeedRow = {
  service_date: string;
  items: StockLogItemRow[];
  confirmed_at: string;
};

export function buildDemoSeedDays(
  menuItems: ReadonlyArray<MenuItemRow>,
  anchorIso: string,
  daysBack: number = 7,
): DemoSeedRow[] {
  if (menuItems.length === 0) return [];
  // Parse anchor as a UTC midnight + iterate in UTC so the returned date strings
  // are independent of the host timezone (CI runners + Jakarta dev machines).
  const anchor = new Date(anchorIso + 'T00:00:00Z');
  const rows: DemoSeedRow[] = [];

  for (let offset = daysBack; offset >= 1; offset -= 1) {
    const day = new Date(anchor.getTime());
    day.setUTCDate(day.getUTCDate() - offset);
    const iso = day.toISOString().slice(0, 10);
    const weekday = day.getUTCDay();

    const items: StockLogItemRow[] = menuItems.map((menu, idx) => {
      const baseline = baselineFor(menu.normalized_name);
      const weekdayMultiplier = WEEKDAY_MULT[weekday] ?? 1;
      const noise = pseudoNoise(iso + menu.id, idx);
      const sold = Math.max(0, Math.round(baseline * weekdayMultiplier * noise));
      const leftover = leftoverFor(baseline, sold, iso, menu.id, idx);
      return {
        menu_item_id: menu.id,
        sold,
        leftover,
        unit: menu.unit,
      };
    });

    rows.push({
      service_date: iso,
      items,
      confirmed_at: `${iso}T22:00:00+07:00`,
    });
  }

  return rows;
}

const WEEKDAY_MULT: Record<number, number> = {
  0: 1.05, // Minggu
  1: 0.92, // Senin
  2: 0.95, // Selasa
  3: 1.0, // Rabu
  4: 1.02, // Kamis
  5: 1.18, // Jumat — riset Bu Maya, Bu Sari
  6: 1.15, // Sabtu
};

function baselineFor(normalizedName: string): number {
  // Sensible per-menu baselines for the Bu Yati demo warung.
  if (normalizedName.includes('lele')) return 28;
  if (normalizedName.includes('ayam')) return 24;
  if (normalizedName.includes('tahu')) return 38;
  if (normalizedName.includes('tempe')) return 34;
  if (normalizedName.includes('nasi')) return 55;
  return 20;
}

function leftoverFor(baseline: number, sold: number, dateIso: string, id: string, idx: number): number {
  const noise = pseudoNoise(`${dateIso}|leftover|${id}`, idx + 17);
  const fraction = noise > 1 ? 0 : (1 - noise) * 0.2;
  const leftover = Math.round(baseline * fraction);
  // Hide leftover when day already sold above baseline (busy day).
  if (sold >= baseline * 1.05) return 0;
  return leftover;
}

/**
 * Cheap deterministic noise in roughly [0.85, 1.15] keyed by an arbitrary
 * string. Not crypto-safe; for demo seed only.
 */
function pseudoNoise(seed: string, salt: number): number {
  let hash = salt * 2654435761;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const fraction = (hash % 10_000) / 10_000; // [0, 1)
  return 0.85 + fraction * 0.3;
}
