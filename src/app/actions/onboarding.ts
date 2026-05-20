'use server';

import { getDemoContext } from '@/lib/auth/demo-context';
import { listMenuItems, syncOutletMenu } from '@/lib/db/queries/menu-items';
import {
  countRecentStockLogDays,
  upsertStockLogBatch,
} from '@/lib/db/queries/demo-seed';
import { updateOutletProfile } from '@/lib/db/queries/outlets';
import { buildDemoSeedDays } from '@/lib/services/demo-seed';
import {
  normalizeOnboardingProfile,
  type OnboardingProfilePayload,
} from '@/lib/services/onboarding-profile';
import { MissingTableError } from '@/lib/db/errors';
import { findLocation } from '@/lib/config/locations';
import { type ActionResult, fail, ok } from '@/types/action-result';
import { THRESHOLDS } from '@/lib/config/thresholds';
import { flags } from '@/lib/config/env';

export type EnsureDemoSeedData = {
  inserted: number;
  skipped: boolean;
  reason?: 'flag_off' | 'has_history' | 'no_menu' | 'missing_table';
};

export type ApplyOnboardingProfileData = {
  outletId: string;
  menuCount: number;
};

/**
 * Persist the user's onboarding inputs (warung name, location, menu) to the
 * demo outlet. Single-tenant Phase 1: we update the seeded DEMO_OUTLET_ID
 * in place rather than creating a new outlet, so subsequent reads of the
 * dashboard reflect THIS merchant's typed data instead of the Bu Yati seed.
 */
export async function applyOnboardingProfile(
  input: OnboardingProfilePayload,
): Promise<ActionResult<ApplyOnboardingProfileData>> {
  const normalized = normalizeOnboardingProfile(input);
  if ('error' in normalized) {
    return fail('INPUT_INVALID', normalizationMessage(normalized.error));
  }

  const { outletId } = getDemoContext();
  const location = findLocation(normalized.locationValue);

  try {
    await updateOutletProfile({
      outletId,
      name: normalized.warungName,
      locationLabel: location?.label ?? normalized.locationValue,
      adm4Code: location?.adm4Code ?? null,
    });

    const synced = await syncOutletMenu(outletId, normalized.menuItems);
    return ok({ outletId, menuCount: synced.length });
  } catch (err) {
    if (err instanceof MissingTableError) {
      return fail('SERVICE_UNAVAILABLE', err.message);
    }
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}

/**
 * Idempotent demo data backfill. Called after onboarding so the Dashboard
 * Belanja Card has at least HISTORY_WINDOW_DAYS of data to compute against
 * the merchant's actual menu (set via `applyOnboardingProfile`).
 *
 * Gated by `FEATURE_DEMO_AUTOSEED` — disable in production once real merchants
 * onboard.
 */
export async function ensureDemoSeed(): Promise<ActionResult<EnsureDemoSeedData>> {
  if (!flags.demoAutoseed) {
    return ok({ inserted: 0, skipped: true, reason: 'flag_off' });
  }

  const { outletId } = getDemoContext();

  try {
    const existing = await countRecentStockLogDays(outletId, THRESHOLDS.HISTORY_WINDOW_DAYS);
    if (existing >= THRESHOLDS.HISTORY_WINDOW_DAYS) {
      return ok({ inserted: 0, skipped: true, reason: 'has_history' });
    }

    const menu = await listMenuItems(outletId);
    if (menu.length === 0) {
      return ok({ inserted: 0, skipped: true, reason: 'no_menu' });
    }

    const anchor = new Date().toISOString().slice(0, 10);
    const days = buildDemoSeedDays(menu, anchor, THRESHOLDS.HISTORY_WINDOW_DAYS);
    const inserted = await upsertStockLogBatch(outletId, days);
    return ok({ inserted: inserted.length, skipped: false });
  } catch (err) {
    if (err instanceof MissingTableError) {
      return ok({ inserted: 0, skipped: true, reason: 'missing_table' });
    }
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}

function normalizationMessage(reason: 'INVALID_NAME' | 'INVALID_LOCATION' | 'NO_MENU'): string {
  switch (reason) {
    case 'INVALID_NAME':
      return 'Nama warung kosong atau kepanjangan.';
    case 'INVALID_LOCATION':
      return 'Pilih kota dulu.';
    case 'NO_MENU':
      return 'Minimal 1 menu ya.';
  }
}
