import { beforeEach, describe, expect, it, vi } from 'vitest';
import { revalidatePath } from 'next/cache';
import { requireOutletAccess } from '@/lib/auth/session';
import { listMenuItems } from '@/lib/db/queries/menu-items';
import {
  deleteRiwayatDay,
  getRiwayat7d,
  getRiwayatEditorData,
  updateRiwayatDay,
} from '@/app/actions/riwayat';
import {
  findStockLogById,
  listRecentStockLogs,
  softDeleteStockLog,
  updateStockLogItems,
} from '@/lib/db/queries/stock-logs';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/auth/session', () => ({
  requireOutletAccess: vi.fn(),
}));

vi.mock('@/lib/db/queries/menu-items', () => ({
  listMenuItems: vi.fn(),
}));

vi.mock('@/lib/db/queries/stock-logs', () => ({
  findStockLogById: vi.fn(),
  listRecentStockLogs: vi.fn(),
  softDeleteStockLog: vi.fn(),
  updateStockLogItems: vi.fn(),
}));

const DB = {} as never;

const MENU = [
  {
    id: 'menu-1',
    outlet_id: 'outlet-1',
    name: 'Siomay Ayam',
    normalized_name: 'siomay ayam',
    unit: 'porsi',
    deleted_at: null,
  },
  {
    id: 'menu-2',
    outlet_id: 'outlet-1',
    name: 'Pao Ayam',
    normalized_name: 'pao ayam',
    unit: 'porsi',
    deleted_at: null,
  },
];

const STOCK_LOG = {
  id: 'log-1',
  outlet_id: 'outlet-1',
  service_date: '2026-05-23',
  items: [
    { menu_item_id: 'menu-1', sold: 9, leftover: 0, unit: 'lusin' },
    { menu_item_id: 'menu-2', sold: 6, leftover: 3, unit: 'plat' },
  ],
  source_draft_id: 'draft-1',
  confirmed_at: '2026-05-23T05:00:00.000Z',
  created_at: '2026-05-23T05:00:00.000Z',
  deleted_at: null,
};

describe('riwayat actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireOutletAccess).mockResolvedValue({
      db: DB,
      outletId: 'outlet-1',
      userId: 'user-1',
    } as never);
    vi.mocked(listMenuItems).mockResolvedValue(MENU as never);
  });

  it('returns 7-day history with stockLogId mapped into each day', async () => {
    vi.mocked(listRecentStockLogs).mockResolvedValue([STOCK_LOG] as never);

    const result = await getRiwayat7d();

    expect(result.error).toBeFalsy();
    expect(result.data?.days[0]).toEqual(
      expect.objectContaining({
        stockLogId: 'log-1',
        serviceDate: '2026-05-23',
        totalSold: 15,
        totalLeftover: 3,
      }),
    );
  });

  it('returns editor data with one day and the outlet menu list', async () => {
    vi.mocked(findStockLogById).mockResolvedValue(STOCK_LOG as never);

    const result = await getRiwayatEditorData('log-1');

    expect(result.error).toBeFalsy();
    expect(result.data?.day).toEqual(
      expect.objectContaining({
        stockLogId: 'log-1',
        serviceDate: '2026-05-23',
      }),
    );
    expect(result.data?.menuItems).toEqual([
      { menuItemId: 'menu-1', menuName: 'Siomay Ayam', unit: 'porsi' },
      { menuItemId: 'menu-2', menuName: 'Pao Ayam', unit: 'porsi' },
    ]);
  });

  it('rejects update when items are empty, negative, or duplicated', async () => {
    const empty = await updateRiwayatDay({ stockLogId: 'log-1', items: [] });
    const negative = await updateRiwayatDay({
      stockLogId: 'log-1',
      items: [{ menuItemId: 'menu-1', sold: -1, leftover: 0 }],
    });
    const duplicated = await updateRiwayatDay({
      stockLogId: 'log-1',
      items: [
        { menuItemId: 'menu-1', sold: 1, leftover: 0 },
        { menuItemId: 'menu-1', sold: 2, leftover: 1 },
      ],
    });

    expect(empty.error?.code).toBe('INPUT_INVALID');
    expect(negative.error?.code).toBe('INPUT_INVALID');
    expect(duplicated.error?.code).toBe('INPUT_INVALID');
    expect(updateStockLogItems).not.toHaveBeenCalled();
  });

  it('updates one riwayat day, normalizes units from menu items, and revalidates dependent pages', async () => {
    vi.mocked(findStockLogById).mockResolvedValue(STOCK_LOG as never);
    vi.mocked(updateStockLogItems).mockResolvedValue({
      ...STOCK_LOG,
      items: [
        { menu_item_id: 'menu-1', sold: 10, leftover: 1, unit: 'porsi' },
        { menu_item_id: 'menu-2', sold: 8, leftover: 0, unit: 'porsi' },
      ],
    } as never);

    const result = await updateRiwayatDay({
      stockLogId: 'log-1',
      items: [
        { menuItemId: 'menu-1', sold: 10, leftover: 1 },
        { menuItemId: 'menu-2', sold: 8, leftover: 0 },
      ],
    });

    expect(result.error).toBeFalsy();
    expect(updateStockLogItems).toHaveBeenCalledWith(DB, {
      outletId: 'outlet-1',
      stockLogId: 'log-1',
      items: [
        { menu_item_id: 'menu-1', sold: 10, leftover: 1, unit: 'porsi' },
        { menu_item_id: 'menu-2', sold: 8, leftover: 0, unit: 'porsi' },
      ],
    });
    expect(revalidatePath).toHaveBeenCalledWith('/riwayat');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(revalidatePath).toHaveBeenCalledWith('/pola-mingguan');
  });

  it('soft deletes one day and revalidates dependent pages', async () => {
    vi.mocked(softDeleteStockLog).mockResolvedValue({
      ...STOCK_LOG,
      deleted_at: '2026-05-26T09:00:00.000Z',
    } as never);

    const result = await deleteRiwayatDay('log-1');

    expect(result.error).toBeFalsy();
    expect(softDeleteStockLog).toHaveBeenCalledWith(DB, {
      outletId: 'outlet-1',
      stockLogId: 'log-1',
    });
    expect(revalidatePath).toHaveBeenCalledWith('/riwayat');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(revalidatePath).toHaveBeenCalledWith('/pola-mingguan');
  });
});
