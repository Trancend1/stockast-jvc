import 'server-only';
import { env } from '@/lib/config/env';

/**
 * Local-first anonymous context.
 *
 * Used when the user has not connected OTP yet, so onboarding and the magic
 * moment can run before account verification. Authenticated users still use
 * their session-scoped outlet through requireOutletAccess().
 */
export function getDemoContext(): { userId: string; outletId: string } {
  const userId = env.DEMO_USER_ID;
  const outletId = env.DEMO_OUTLET_ID;
  if (!userId || !outletId) {
    throw new Error('DEMO_USER_ID and DEMO_OUTLET_ID must be set in .env.local for demo mode.');
  }
  return { userId, outletId };
}
