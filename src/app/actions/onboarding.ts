'use server';

import { getDemoContext } from '@/lib/auth/demo-context';
import { adminDb } from '@/lib/db/admin';
import { createServerClient } from '@/lib/db/supabase-client';
import { provisionNewUser } from '@/lib/auth/provisioning';
import { getUserOutlet } from '@/lib/db/queries/users';
import { listMenuItems, syncOutletMenu } from '@/lib/db/queries/menu-items';
import { countRecentStockLogDays, upsertStockLogBatch } from '@/lib/db/queries/demo-seed';
import {
  getOutletProfile,
  updateOutletProfile,
  upsertDemoOutletProfile,
} from '@/lib/db/queries/outlets';
import { requireOutletAccess } from '@/lib/auth/session';
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
 * Persist onboarding inputs to the database.
 *
 * FEATURE_AUTH_REQUIRED=true:
 *   Anonymous → updates the local-first demo outlet so onboarding stays light.
 *   New auth user → provision org + membership + outlet, then sync menu.
 *   Returning auth user → update existing outlet + resync menu.
 *
 * FEATURE_AUTH_REQUIRED=false (Phase 1 demo):
 *   Updates the seeded DEMO_OUTLET_ID outlet in place.
 */
export async function applyOnboardingProfile(
  input: OnboardingProfilePayload,
): Promise<ActionResult<ApplyOnboardingProfileData>> {
  const normalized = normalizeOnboardingProfile(input);
  if ('error' in normalized) {
    return fail('INPUT_INVALID', normalizationMessage(normalized.error));
  }

  const location = findLocation(normalized.locationValue);
  const locationLabel = location?.label ?? normalized.locationValue;
  const adm4Code = location?.adm4Code ?? null;

  if (!flags.authRequired) {
    const { userId, outletId } = getDemoContext();
    try {
      await upsertDemoOutletProfile(adminDb(), {
        userId,
        outletId,
        name: normalized.warungName,
        locationLabel,
        adm4Code,
      });
      const synced = await syncOutletMenu(adminDb(), outletId, normalized.menuItems);
      return ok({ outletId, menuCount: synced.length });
    } catch (err) {
      if (err instanceof MissingTableError) return fail('SERVICE_UNAVAILABLE', err.message);
      return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
    }
  }

  // Sprint F+ authenticated path
  const sessionDb = await createServerClient();
  const {
    data: { user },
  } = await sessionDb.auth.getUser();
  if (!user) {
    const { userId, outletId } = getDemoContext();
    try {
      await upsertDemoOutletProfile(adminDb(), {
        userId,
        outletId,
        name: normalized.warungName,
        locationLabel,
        adm4Code,
      });
      const synced = await syncOutletMenu(adminDb(), outletId, normalized.menuItems);
      return ok({ outletId, menuCount: synced.length });
    } catch (err) {
      if (err instanceof MissingTableError) return fail('SERVICE_UNAVAILABLE', err.message);
      return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
    }
  }

  const existingOutletId = await getUserOutlet(sessionDb, user.id);

  try {
    let outletId: string;

    if (!existingOutletId) {
      // New user: provision using admin (no RLS for memberships/outlet yet)
      const provisioned = await provisionNewUser({
        userId: user.id,
        phone: user.phone ?? '',
        warungName: normalized.warungName,
        locationLabel,
        adm4Code,
      });
      outletId = provisioned.outletId;
      // Use adminDb for initial menu sync — JWT may not yet reflect new membership
      const synced = await syncOutletMenu(adminDb(), outletId, normalized.menuItems);
      return ok({ outletId, menuCount: synced.length });
    }

    // Returning user: session client enforces RLS ownership
    outletId = existingOutletId;
    await updateOutletProfile(sessionDb, {
      outletId,
      name: normalized.warungName,
      locationLabel,
      adm4Code,
    });
    const synced = await syncOutletMenu(sessionDb, outletId, normalized.menuItems);
    return ok({ outletId, menuCount: synced.length });
  } catch (err) {
    if (err instanceof MissingTableError) return fail('SERVICE_UNAVAILABLE', err.message);
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}

/**
 * Idempotent demo data backfill for the given outlet.
 * Pass outletId from applyOnboardingProfile result.
 */
export async function ensureDemoSeed(outletId: string): Promise<ActionResult<EnsureDemoSeedData>> {
  if (!flags.demoAutoseed) {
    return ok({ inserted: 0, skipped: true, reason: 'flag_off' });
  }
  const db = adminDb(); // seed is admin-only
  try {
    const existing = await countRecentStockLogDays(outletId, THRESHOLDS.HISTORY_WINDOW_DAYS);
    if (existing >= THRESHOLDS.HISTORY_WINDOW_DAYS) {
      return ok({ inserted: 0, skipped: true, reason: 'has_history' });
    }
    const menu = await listMenuItems(db, outletId);
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

/**
 * Resolves the current outlet name from the database.
 */
export async function getActiveWarungName(): Promise<ActionResult<string | null>> {
  try {
    const ctx = await requireOutletAccess();
    const outlet = await getOutletProfile(ctx.db, ctx.outletId);
    return ok(outlet?.name ?? null);
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}
