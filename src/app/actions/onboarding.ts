'use server';

import { getDemoContext } from '@/lib/auth/demo-context';
import { listMenuItems } from '@/lib/db/queries/menu-items';
import {
  countRecentStockLogDays,
  upsertStockLogBatch,
} from '@/lib/db/queries/demo-seed';
import { buildDemoSeedDays } from '@/lib/services/demo-seed';
import { type ActionResult, fail, ok } from '@/types/action-result';
import { THRESHOLDS } from '@/lib/config/thresholds';

export type EnsureDemoSeedData = {
  inserted: number;
  skipped: boolean;
};

/**
 * Idempotent demo data backfill. Called after onboarding completes so the
 * Dashboard Belanja Card has at least HISTORY_WINDOW_DAYS of data to compute
 * recommendations from.
 *
 * Skip path: if outlet already has ≥ HISTORY_WINDOW_DAYS distinct service
 * dates in the recent window, do nothing. Onboarding can call this freely.
 */
export async function ensureDemoSeed(): Promise<ActionResult<EnsureDemoSeedData>> {
  const { outletId } = getDemoContext();

  try {
    const existing = await countRecentStockLogDays(outletId, THRESHOLDS.HISTORY_WINDOW_DAYS);
    if (existing >= THRESHOLDS.HISTORY_WINDOW_DAYS) {
      return ok({ inserted: 0, skipped: true });
    }

    const menu = await listMenuItems(outletId);
    if (menu.length === 0) {
      return fail('NOT_FOUND', 'Belum ada menu untuk warung ini.');
    }

    const anchor = new Date().toISOString().slice(0, 10);
    const days = buildDemoSeedDays(menu, anchor, THRESHOLDS.HISTORY_WINDOW_DAYS);
    const inserted = await upsertStockLogBatch(outletId, days);
    return ok({ inserted: inserted.length, skipped: false });
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}
