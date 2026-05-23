import 'server-only';
import { env, flags } from '@/lib/config/env';

/**
 * Phase 1 demo: hardcoded single-tenant context.
 * Only valid when FEATURE_AUTH_REQUIRED=false.
 *
 * Sprint F+: replaced by requireOutletAccess() from cookie session.
 * Reads .env.local DEMO_USER_ID / DEMO_OUTLET_ID, matches seeded outlet.
 */
export function getDemoContext(): { userId: string; outletId: string } {
  if (flags.authRequired) {
    throw new Error(
      'getDemoContext() called with FEATURE_AUTH_REQUIRED=true. Use requireOutletAccess() instead.',
    );
  }
  const userId = env.DEMO_USER_ID;
  const outletId = env.DEMO_OUTLET_ID;
  if (!userId || !outletId) {
    throw new Error('DEMO_USER_ID and DEMO_OUTLET_ID must be set in .env.local for demo mode.');
  }
  return { userId, outletId };
}
