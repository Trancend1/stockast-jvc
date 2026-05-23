import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Find the outlet ID for an authenticated user by traversing:
 * users → memberships → organizations → outlets
 *
 * Returns null when the user exists in auth.users but hasn't completed
 * onboarding (no membership/outlet created yet).
 */
export async function getUserOutlet(db: SupabaseClient, userId: string): Promise<string | null> {
  const { data: membership, error: membershipError } = await db
    .from('memberships')
    .select('organization_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership) return null;

  const { data: outlet, error: outletError } = await db
    .from('outlets')
    .select('id')
    .eq('organization_id', membership.organization_id)
    .limit(1)
    .maybeSingle();

  if (outletError || !outlet) return null;
  return outlet.id as string;
}

/**
 * Upsert a public.users profile row linked to auth.users.
 * Called during first-time onboarding provisioning via adminDb().
 * public.users has no RLS so this can use either client,
 * but admin is passed explicitly for clarity.
 */
export async function upsertUserRecord(
  db: SupabaseClient,
  userId: string,
  phone: string,
): Promise<void> {
  const { error } = await db.from('users').upsert({ id: userId, phone }, { onConflict: 'id' });

  if (error) {
    throw new Error(`upsertUserRecord failed: ${error.message}`);
  }
}
