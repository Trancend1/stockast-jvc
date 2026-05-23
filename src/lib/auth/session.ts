import 'server-only';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/db/supabase-client';
import { adminDb } from '@/lib/db/admin';
import { getDemoContext } from '@/lib/auth/demo-context';
import { getUserOutlet } from '@/lib/db/queries/users';
import { flags } from '@/lib/config/env';

export type SessionContext = {
  userId: string;
  outletId: string;
  db: SupabaseClient;
};

/**
 * Resolve the current session context (user + outlet) for Server Actions.
 *
 * When FEATURE_AUTH_REQUIRED=false (Phase 1 demo), falls back to getDemoContext()
 * so local dev without phone auth still works.
 *
 * When FEATURE_AUTH_REQUIRED=true (Sprint F+), reads from cookie session.
 * Redirects to /login if unauthenticated, /onboarding if no outlet yet.
 */
export async function requireOutletAccess(): Promise<SessionContext> {
  if (!flags.authRequired) {
    const { userId, outletId } = getDemoContext();
    return { userId, outletId, db: adminDb() };
  }

  const db = await createServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) {
    redirect('/login');
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
  if (!flags.authRequired) return null;

  const db = await createServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) return null;
  return { id: user.id, phone: user.phone ?? null };
}
