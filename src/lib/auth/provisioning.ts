import 'server-only';
import { adminDb } from '@/lib/db/admin';

export type ProvisionNewUserArgs = {
  userId: string;
  phone: string;
  warungName: string;
  locationLabel: string;
  adm4Code: string | null;
};

export type ProvisionResult = {
  outletId: string;
  organizationId: string;
};

/**
 * One-time new-user setup. Creates:
 *   public.users  → auth profile row
 *   organizations → the merchant's business entity
 *   memberships   → owner role binding
 *   outlets       → the physical warung location
 *
 * Uses adminDb() because new users have no memberships yet,
 * so RLS would block writes to organizations/memberships/outlets.
 *
 * Called once per user from applyOnboardingProfile when no outlet exists.
 */
export async function provisionNewUser(args: ProvisionNewUserArgs): Promise<ProvisionResult> {
  const db = adminDb();

  // 1. Upsert public.users profile linked to auth.users.
  const { error: userErr } = await db
    .from('users')
    .upsert({ id: args.userId, phone: args.phone }, { onConflict: 'id' });
  if (userErr) {
    throw new Error(`provisionNewUser: upsert user failed — ${userErr.message}`);
  }

  // 2. Create organization.
  const { data: org, error: orgErr } = await db
    .from('organizations')
    .insert({ name: args.warungName, owner_id: args.userId })
    .select('id')
    .single();
  if (orgErr || !org) {
    throw new Error(`provisionNewUser: create org failed — ${orgErr?.message}`);
  }

  // 3. Create owner membership.
  const { error: memErr } = await db
    .from('memberships')
    .insert({ user_id: args.userId, organization_id: org.id, role: 'owner' });
  if (memErr) {
    throw new Error(`provisionNewUser: create membership failed — ${memErr.message}`);
  }

  // 4. Create outlet.
  const { data: outlet, error: outletErr } = await db
    .from('outlets')
    .insert({
      organization_id: org.id,
      name: args.warungName,
      location_label: args.locationLabel,
      adm4_code: args.adm4Code,
    })
    .select('id')
    .single();
  if (outletErr || !outlet) {
    throw new Error(`provisionNewUser: create outlet failed — ${outletErr?.message}`);
  }

  return { outletId: outlet.id as string, organizationId: org.id as string };
}
