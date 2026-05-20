'use server';

import { getDemoContext } from '@/lib/auth/demo-context';
import { listMenuItems } from '@/lib/db/queries/menu-items';
import { listRecentStockLogs } from '@/lib/db/queries/stock-logs';
import { computePolaMingguan, type PolaMingguanData } from '@/lib/services/pola-mingguan';
import type { StockLogShape } from '@/lib/services/recommendation-mapping';
import { type ActionResult, fail, ok } from '@/types/action-result';

export async function getPolaMingguan(): Promise<ActionResult<PolaMingguanData>> {
  const { outletId } = getDemoContext();
  try {
    const [menu, logs] = await Promise.all([
      listMenuItems(outletId),
      listRecentStockLogs(outletId, 28), // four-week lookback for better weekday samples
    ]);

    const shaped: StockLogShape[] = logs.map((log) => ({
      service_date: log.service_date,
      items: log.items as unknown as StockLogShape['items'],
    }));

    const data = computePolaMingguan(menu, shaped);
    return ok(data);
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}
