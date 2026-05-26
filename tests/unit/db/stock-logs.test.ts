import { describe, expect, it } from 'vitest';
import {
  findStockLogById,
  softDeleteStockLog,
  updateStockLogItems,
} from '@/lib/db/queries/stock-logs';
import type { StockLogItemRow, StockLogRow } from '@/lib/db/types';

const STOCK_LOG: StockLogRow = {
  id: 'log-1',
  outlet_id: 'outlet-1',
  service_date: '2026-05-26',
  items: [{ menu_item_id: 'menu-1', sold: 10, leftover: 2, unit: 'porsi' }],
  source_draft_id: 'draft-1',
  confirmed_at: '2026-05-26T05:00:00.000Z',
  created_at: '2026-05-26T05:00:00.000Z',
  deleted_at: null,
};

function okResult(data: unknown = null) {
  return { data, error: null };
}

describe('stock log queries', () => {
  it('finds one stock log inside the active outlet only', async () => {
    const calls: Array<[string, unknown]> = [];
    const db = {
      from(table: string) {
        expect(table).toBe('stock_logs');
        return {
          select(selection: string) {
            expect(selection).toContain('deleted_at');
            return {
              eq(column: string, value: string) {
                calls.push([column, value]);
                return this;
              },
              is(column: string, value: null) {
                calls.push([column, value]);
                return {
                  maybeSingle: async () => okResult(STOCK_LOG),
                };
              },
            };
          },
        };
      },
    };

    const log = await findStockLogById(db as never, 'outlet-1', 'log-1');

    expect(log?.id).toBe('log-1');
    expect(calls).toEqual([
      ['id', 'log-1'],
      ['outlet_id', 'outlet-1'],
      ['deleted_at', null],
    ]);
  });

  it('updates items on a valid stock log within the active outlet only', async () => {
    const nextItems: StockLogItemRow[] = [
      { menu_item_id: 'menu-1', sold: 12, leftover: 1, unit: 'porsi' },
    ];
    const calls: Array<{ type: string; value: unknown }> = [];
    const db = {
      from(table: string) {
        expect(table).toBe('stock_logs');
        return {
          update(payload: unknown) {
            calls.push({ type: 'update', value: payload });
            return {
              eq(column: string, value: string) {
                calls.push({ type: column, value });
                return this;
              },
              is(column: string, value: null) {
                calls.push({ type: column, value });
                return {
                  select(selection: string) {
                    expect(selection).toContain('service_date');
                    return {
                      single: async () =>
                        okResult({
                          ...STOCK_LOG,
                          items: nextItems,
                        }),
                    };
                  },
                };
              },
            };
          },
        };
      },
    };

    const log = await updateStockLogItems(db as never, {
      outletId: 'outlet-1',
      stockLogId: 'log-1',
      items: nextItems,
    });

    expect(log.items).toEqual(nextItems);
    expect(calls).toEqual([
      {
        type: 'update',
        value: expect.objectContaining({
          items: nextItems,
          deleted_at: null,
        }),
      },
      { type: 'id', value: 'log-1' },
      { type: 'outlet_id', value: 'outlet-1' },
      { type: 'deleted_at', value: null },
    ]);
  });

  it('soft deletes one stock log inside the active outlet only', async () => {
    const calls: Array<{ type: string; value: unknown }> = [];
    const db = {
      from(table: string) {
        expect(table).toBe('stock_logs');
        return {
          update(payload: unknown) {
            calls.push({ type: 'update', value: payload });
            return {
              eq(column: string, value: string) {
                calls.push({ type: column, value });
                return this;
              },
              is(column: string, value: null) {
                calls.push({ type: column, value });
                return {
                  select() {
                    return {
                      single: async () =>
                        okResult({
                          ...STOCK_LOG,
                          deleted_at: '2026-05-26T08:00:00.000Z',
                        }),
                    };
                  },
                };
              },
            };
          },
        };
      },
    };

    const deleted = await softDeleteStockLog(db as never, {
      outletId: 'outlet-1',
      stockLogId: 'log-1',
    });

    expect(deleted.deleted_at).toContain('2026-05-26');
    expect(calls).toEqual([
      {
        type: 'update',
        value: expect.objectContaining({
          deleted_at: expect.any(String),
        }),
      },
      { type: 'id', value: 'log-1' },
      { type: 'outlet_id', value: 'outlet-1' },
      { type: 'deleted_at', value: null },
    ]);
  });
});
