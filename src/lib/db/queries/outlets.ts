import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { throwIfMissingTable } from '../errors';
import type { OutletRow } from '../types';

export type UpdateOutletProfileInput = {
  outletId: string;
  name: string;
  locationLabel: string;
  adm4Code: string | null;
};

const DEMO_ORGANIZATION_ID = '00000000-0000-0000-0000-000000000100';

export async function getOutletProfile(
  db: SupabaseClient,
  outletId: string,
): Promise<OutletRow | null> {
  const { data, error } = await db
    .from('outlets')
    .select('id, organization_id, name, location_label, adm4_code')
    .eq('id', outletId)
    .maybeSingle();

  if (error) {
    throwIfMissingTable(error, 'outlets');
    throw new Error(`getOutletProfile failed: ${error.message}`);
  }

  return data ? (data as OutletRow) : null;
}

export async function updateOutletProfile(
  db: SupabaseClient,
  input: UpdateOutletProfileInput,
): Promise<OutletRow> {
  const { data, error } = await db
    .from('outlets')
    .update({
      name: input.name,
      location_label: input.locationLabel,
      adm4_code: input.adm4Code,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.outletId)
    .select('id, organization_id, name, location_label, adm4_code')
    .single();

  if (error || !data) {
    throwIfMissingTable(error, 'outlets');
    throw new Error(`updateOutletProfile failed: ${error?.message ?? 'no row returned'}`);
  }
  return data as OutletRow;
}

export type UpsertDemoOutletProfileInput = UpdateOutletProfileInput & {
  userId: string;
};

export async function upsertDemoOutletProfile(
  db: SupabaseClient,
  input: UpsertDemoOutletProfileInput,
): Promise<OutletRow> {
  const now = new Date().toISOString();

  const userResult = await db
    .from('users')
    .upsert({ id: input.userId, phone: null, updated_at: now }, { onConflict: 'id' });
  if (userResult.error) {
    throwIfMissingTable(userResult.error, 'users');
    throw new Error(`upsertDemoOutletProfile user failed: ${userResult.error.message}`);
  }

  const orgResult = await db.from('organizations').upsert(
    {
      id: DEMO_ORGANIZATION_ID,
      name: input.name,
      owner_id: input.userId,
      updated_at: now,
    },
    { onConflict: 'id' },
  );
  if (orgResult.error) {
    throwIfMissingTable(orgResult.error, 'organizations');
    throw new Error(`upsertDemoOutletProfile organization failed: ${orgResult.error.message}`);
  }

  const membershipResult = await db.from('memberships').upsert(
    {
      user_id: input.userId,
      organization_id: DEMO_ORGANIZATION_ID,
      role: 'owner',
    },
    { onConflict: 'user_id,organization_id' },
  );
  if (membershipResult.error) {
    throwIfMissingTable(membershipResult.error, 'memberships');
    throw new Error(`upsertDemoOutletProfile membership failed: ${membershipResult.error.message}`);
  }

  const { data, error } = await db
    .from('outlets')
    .upsert(
      {
        id: input.outletId,
        organization_id: DEMO_ORGANIZATION_ID,
        name: input.name,
        location_label: input.locationLabel,
        adm4_code: input.adm4Code,
        updated_at: now,
      },
      { onConflict: 'id' },
    )
    .select('id, organization_id, name, location_label, adm4_code')
    .single();

  if (error || !data) {
    throwIfMissingTable(error, 'outlets');
    throw new Error(
      `upsertDemoOutletProfile outlet failed: ${error?.message ?? 'no row returned'}`,
    );
  }

  return data as OutletRow;
}
