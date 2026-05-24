import 'server-only';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/db/supabase-client';
import { adminDb } from '@/lib/db/admin';
import { getDemoContext } from '@/lib/auth/demo-context';
import { getUserOutlet } from '@/lib/db/queries/users';

export type SessionContext = {
  userId: string;
  outletId: string;
  db: SupabaseClient;
};

/**
 * Resolve the current session context (user + outlet) for Server Actions.
 *
 * Authenticated users are scoped through their session + RLS. Users who have
 * not connected OTP yet use the local-first demo outlet, so onboarding stays
 * business-only and auth can live under /setelan.
 */
export async function requireOutletAccess(): Promise<SessionContext> {
  const db = await createServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) {
    const { userId, outletId } = getDemoContext();
    return { userId, outletId, db: adminDb() };
  }

  const outletId = await getUserOutlet(db, user.id);
  if (!outletId) {
    redirect('/onboarding');
  }

  return { userId: user.id, outletId, db };
}

/**
 * Returns the authenticated user or null. Does not redirect.
 * Use in pages/layouts that need to conditionally render based on auth state.
 */
export async function getSessionUser(): Promise<{ id: string; phone: string | null } | null> {
  const db = await createServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) return null;
  return { id: user.id, phone: user.phone ?? null };
}
