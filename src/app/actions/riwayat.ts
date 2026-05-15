'use server';

import { getDemoContext } from '@/lib/auth/demo-context';
import { listMenuItems } from '@/lib/db/queries/menu-items';
import { listRecentStockLogs } from '@/lib/db/queries/stock-logs';
import { type ActionResult, fail, ok } from '@/types/action-result';

export type RiwayatItem = {
  menuItemId: string;
  menuName: string;
  sold: number;
  leftover: number;
  unit: string;
};

export type RiwayatDay = {
  serviceDate: string;
  items: RiwayatItem[];
  totalSold: number;
  totalLeftover: number;
};

export type RiwayatData = { days: RiwayatDay[] };

export async function getRiwayat7d(): Promise<ActionResult<RiwayatData>> {
  const { outletId } = getDemoContext();
  try {
    const [menu, logs] = await Promise.all([
      listMenuItems(outletId),
      listRecentStockLogs(outletId, 7),
    ]);
    const days: RiwayatDay[] = logs.map((log) => {
      const rawItems = log.items as unknown as Array<{
        menu_item_id: string;
        sold: number;
        leftover: number;
        unit: string;
      }>;
      const items: RiwayatItem[] = rawItems.map((it) => {
        const m = menu.find((x) => x.id === it.menu_item_id);
        return {
          menuItemId: it.menu_item_id,
          menuName: m?.name ?? '—',
          sold: it.sold,
          leftover: it.leftover,
          unit: it.unit,
        };
      });
      return {
        serviceDate: log.service_date,
        items,
        totalSold: items.reduce((a, b) => a + b.sold, 0),
        totalLeftover: items.reduce((a, b) => a + b.leftover, 0),
      };
    });
    return ok({ days });
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}
