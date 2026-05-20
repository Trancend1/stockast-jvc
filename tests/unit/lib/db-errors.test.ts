import { describe, expect, it } from 'vitest';
import {
  MissingTableError,
  isMissingTableError,
  throwIfMissingTable,
} from '@/lib/db/errors';

describe('isMissingTableError', () => {
  it('detects Supabase schema-cache errors for the requested table', () => {
    const error = {
      code: 'PGRST205',
      message: "Could not find the table 'public.menu_items' in the schema cache",
    };

    expect(isMissingTableError(error, 'menu_items')).toBe(true);
  });

  it('ignores errors for another table', () => {
    const error = new Error(
      "Could not find the table 'public.stock_logs' in the schema cache",
    );

    expect(isMissingTableError(error, 'menu_items')).toBe(false);
  });

  it('detects a MissingTableError instance for the requested table', () => {
    const error = new MissingTableError('stock_log_drafts');
    expect(isMissingTableError(error, 'stock_log_drafts')).toBe(true);
    expect(isMissingTableError(error, 'stock_logs')).toBe(false);
  });
});

describe('throwIfMissingTable', () => {
  it('throws MissingTableError when the error matches the table', () => {
    const error = {
      code: 'PGRST205',
      message: "Could not find the table 'public.stock_logs' in the schema cache",
    };
    expect(() => throwIfMissingTable(error, 'stock_logs')).toThrow(MissingTableError);
  });

  it('is a no-op when the error is unrelated', () => {
    const error = new Error('network timeout');
    expect(() => throwIfMissingTable(error, 'stock_logs')).not.toThrow();
  });

  it('is a no-op when the table name does not match', () => {
    const error = {
      code: 'PGRST205',
      message: "Could not find the table 'public.stock_logs' in the schema cache",
    };
    expect(() => throwIfMissingTable(error, 'menu_items')).not.toThrow();
  });
});
