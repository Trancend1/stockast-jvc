import 'server-only';
import { env } from '@/lib/config/env';

/**
 * Phase 1 demo: hardcoded single-tenant context.
 * Replaced by real auth + RLS in Phase 2 (requireOutletAccess from cookie session).
 *
 * Reads .env.local DEMO_USER_ID / DEMO_OUTLET_ID, matches the seeded outlet
 * in supabase/seed.sql.
 */
export function getDemoContext(): { userId: string; outletId: string } {
  const userId = env.DEMO_USER_ID;
  const outletId = env.DEMO_OUTLET_ID;
  if (!userId || !outletId) {
    throw new Error(
      'DEMO_USER_ID and DEMO_OUTLET_ID must be set in .env.local for Phase 1 demo.',
    );
  }
  return { userId, outletId };
}
