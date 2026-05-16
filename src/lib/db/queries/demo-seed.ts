import 'server-only';
import { adminDb } from '../admin';
import type { StockLogRow } from '../types';
import type { DemoSeedRow } from '@/lib/services/demo-seed';

/**
 * Upsert a batch of stock_logs for a single outlet. Used by ensureDemoSeed
 * during onboarding to guarantee the Dashboard Belanja Card has data.
 *
 * Idempotent: upsert on (outlet_id, service_date) so re-running onboarding
 * does not duplicate rows.
 */
export async function upsertStockLogBatch(
  outletId: string,
  days: ReadonlyArray<DemoSeedRow>,
): Promise<StockLogRow[]> {
  if (days.length === 0) return [];

  const rows = days.map((day) => ({
    outlet_id: outletId,
    service_date: day.service_date,
    items: day.items,
    confirmed_at: day.confirmed_at,
  }));

  const { data, error } = await adminDb()
    .from('stock_logs')
    .upsert(rows, { onConflict: 'outlet_id,service_date' })
    .select('id, outlet_id, service_date, items, source_draft_id, confirmed_at, created_at, deleted_at');

  if (error) {
    throw new Error(`upsertStockLogBatch failed: ${error.message}`);
  }
  return (data ?? []) as StockLogRow[];
}

/**
 * Count distinct service_dates for outlet in the last `days` window. Lets
 * onboarding skip pre-seed when sufficient real data already exists.
 */
export async function countRecentStockLogDays(outletId: string, days: number): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceDate = since.toISOString().slice(0, 10);

  const { count, error } = await adminDb()
    .from('stock_logs')
    .select('id', { count: 'exact', head: true })
    .eq('outlet_id', outletId)
    .is('deleted_at', null)
    .gte('service_date', sinceDate);

  if (error) {
    throw new Error(`countRecentStockLogDays failed: ${error.message}`);
  }
  return count ?? 0;
}
