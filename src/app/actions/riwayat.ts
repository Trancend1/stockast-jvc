'use server';

import { revalidatePath } from 'next/cache';
import { requireOutletAccess } from '@/lib/auth/session';
import { listMenuItems } from '@/lib/db/queries/menu-items';
import {
  findStockLogById,
  listRecentStockLogs,
  softDeleteStockLog,
  updateStockLogItems,
} from '@/lib/db/queries/stock-logs';
import type { MenuItemRow, StockLogItemRow, StockLogRow } from '@/lib/db/types';
import { type ActionResult, fail, ok } from '@/types/action-result';

export type RiwayatItem = {
  menuItemId: string;
  menuName: string;
  sold: number;
  leftover: number;
  unit: string;
};

export type RiwayatDay = {
  stockLogId: string;
  serviceDate: string;
  items: RiwayatItem[];
  totalSold: number;
  totalLeftover: number;
};

export type RiwayatData = { days: RiwayatDay[] };

export type RiwayatEditorMenuItem = {
  menuItemId: string;
  menuName: string;
  unit: string;
};

export type RiwayatEditorData = {
  day: RiwayatDay;
  menuItems: RiwayatEditorMenuItem[];
};

export type UpdateRiwayatDayInput = {
  stockLogId: string;
  items: Array<{
    menuItemId: string;
    sold: number;
    leftover: number;
  }>;
};

export async function getRiwayat7d(): Promise<ActionResult<RiwayatData>> {
  const ctx = await requireOutletAccess();
  try {
    const [menu, logs] = await Promise.all([
      listMenuItems(ctx.db, ctx.outletId),
      listRecentStockLogs(ctx.db, ctx.outletId, 7),
    ]);
    const days = logs.map((log) => mapLogToDay(log, menu));
    return ok({ days });
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}

export async function getRiwayatEditorData(
  stockLogId: string,
): Promise<ActionResult<RiwayatEditorData>> {
  const ctx = await requireOutletAccess();

  if (!stockLogId) {
    return fail('INPUT_INVALID', 'Riwayat yang dipilih tidak valid.');
  }

  try {
    const [menu, log] = await Promise.all([
      listMenuItems(ctx.db, ctx.outletId),
      findStockLogById(ctx.db, ctx.outletId, stockLogId),
    ]);

    if (!log) {
      return fail('NOT_FOUND', 'Riwayat tidak ditemukan.');
    }

    return ok({
      day: mapLogToDay(log, menu),
      menuItems: menu.map((item) => ({
        menuItemId: item.id,
        menuName: item.name,
        unit: item.unit,
      })),
    });
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}

export async function updateRiwayatDay(
  input: UpdateRiwayatDayInput,
): Promise<ActionResult<{ day: RiwayatDay }>> {
  const ctx = await requireOutletAccess();

  if (!input.stockLogId) {
    return fail('INPUT_INVALID', 'Riwayat yang dipilih tidak valid.');
  }
  if (!input.items.length) {
    return fail('INPUT_INVALID', 'Minimal ada satu item.');
  }

  try {
    const [menu, log] = await Promise.all([
      listMenuItems(ctx.db, ctx.outletId),
      findStockLogById(ctx.db, ctx.outletId, input.stockLogId),
    ]);

    if (!log) {
      return fail('NOT_FOUND', 'Riwayat tidak ditemukan.');
    }

    const menuById = new Map(menu.map((item) => [item.id, item]));
    const seen = new Set<string>();
    const items: StockLogItemRow[] = [];

    for (const item of input.items) {
      if (!item.menuItemId) {
        return fail('INPUT_INVALID', 'Menu item wajib dipilih.');
      }
      if (!Number.isInteger(item.sold) || item.sold < 0) {
        return fail('INPUT_INVALID', 'Angka laku harus bilangan bulat nol atau lebih.');
      }
      if (!Number.isInteger(item.leftover) || item.leftover < 0) {
        return fail('INPUT_INVALID', 'Angka sisa harus bilangan bulat nol atau lebih.');
      }
      if (seen.has(item.menuItemId)) {
        return fail('INPUT_INVALID', 'Item menu tidak boleh dobel dalam satu hari.');
      }

      const menuItem = menuById.get(item.menuItemId);
      if (!menuItem) {
        return fail('INPUT_INVALID', 'Ada item menu yang sudah tidak tersedia.');
      }

      seen.add(item.menuItemId);
      items.push({
        menu_item_id: item.menuItemId,
        sold: item.sold,
        leftover: item.leftover,
        unit: menuItem.unit,
      });
    }

    const updated = await updateStockLogItems(ctx.db, {
      outletId: ctx.outletId,
      stockLogId: input.stockLogId,
      items,
    });

    revalidateRiwayatSurfaces();
    return ok({ day: mapLogToDay(updated, menu) });
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}

export async function deleteRiwayatDay(
  stockLogId: string,
): Promise<ActionResult<{ stockLogId: string }>> {
  const ctx = await requireOutletAccess();

  if (!stockLogId) {
    return fail('INPUT_INVALID', 'Riwayat yang dipilih tidak valid.');
  }

  try {
    await softDeleteStockLog(ctx.db, {
      outletId: ctx.outletId,
      stockLogId,
    });
    revalidateRiwayatSurfaces();
    return ok({ stockLogId });
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}

function mapLogToDay(log: StockLogRow, menu: MenuItemRow[]): RiwayatDay {
  const rawItems = log.items as unknown as StockLogItemRow[];
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
    stockLogId: log.id,
    serviceDate: log.service_date,
    items,
    totalSold: items.reduce((a, b) => a + b.sold, 0),
    totalLeftover: items.reduce((a, b) => a + b.leftover, 0),
  };
}

function revalidateRiwayatSurfaces() {
  revalidatePath('/riwayat');
  revalidatePath('/dashboard');
  revalidatePath('/pola-mingguan');
}
