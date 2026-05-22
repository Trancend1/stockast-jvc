// @vitest-environment node
/**
 * Tenant isolation smoke test.
 * Verifies that Postgres RLS correctly scopes stock_logs by outlet.
 *
 * Prerequisites: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *   SUPABASE_SERVICE_ROLE_KEY set (loaded from .env.local by integration/setup.ts).
 *
 * Runs against the remote Supabase project — NOT a mock.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const RUN_ID = crypto.randomUUID().slice(0, 8);
const EMAIL_A = `test-rls-a-${RUN_ID}@stockast-test.invalid`;
const EMAIL_B = `test-rls-b-${RUN_ID}@stockast-test.invalid`;
const TEST_PASSWORD = 'RlsTest!2026xZ';

function adminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars for integration test');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function userClient(accessToken: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

let userIdA: string;
let userIdB: string;
let outletIdA: string;
let outletIdB: string;
let tokenA: string;

beforeAll(async () => {
  const admin = adminClient();

  // Create test users with email+password (no SMS required)
  const { data: a, error: errA } = await admin.auth.admin.createUser({
    email: EMAIL_A,
    password: TEST_PASSWORD,
    email_confirm: true,
  });
  if (errA ?? !a.user) throw new Error(`createUser A failed: ${errA?.message}`);
  userIdA = a.user!.id;

  const { data: b, error: errB } = await admin.auth.admin.createUser({
    email: EMAIL_B,
    password: TEST_PASSWORD,
    email_confirm: true,
  });
  if (errB ?? !b.user) throw new Error(`createUser B failed: ${errB?.message}`);
  userIdB = b.user!.id;

  // Create public.users records (not auto-created by Supabase trigger)
  await admin.from('users').insert({ id: userIdA });
  await admin.from('users').insert({ id: userIdB });

  // Provision org + membership + outlet for User A
  const { data: orgA, error: orgErrA } = await admin
    .from('organizations')
    .insert({ name: `Test Org A ${RUN_ID}`, owner_id: userIdA })
    .select('id')
    .single();
  if (orgErrA ?? !orgA) throw new Error(`insert orgA: ${orgErrA?.message}`);

  await admin.from('memberships').insert({
    user_id: userIdA,
    organization_id: orgA.id,
    role: 'owner',
  });

  const { data: outA, error: outErrA } = await admin
    .from('outlets')
    .insert({ organization_id: orgA.id, name: 'Warung A Test', location_label: 'RLS Test' })
    .select('id')
    .single();
  if (outErrA ?? !outA) throw new Error(`insert outletA: ${outErrA?.message}`);
  outletIdA = outA.id as string;

  // Provision org + membership + outlet for User B
  const { data: orgB, error: orgErrB } = await admin
    .from('organizations')
    .insert({ name: `Test Org B ${RUN_ID}`, owner_id: userIdB })
    .select('id')
    .single();
  if (orgErrB ?? !orgB) throw new Error(`insert orgB: ${orgErrB?.message}`);

  await admin.from('memberships').insert({
    user_id: userIdB,
    organization_id: orgB.id,
    role: 'owner',
  });

  const { data: outB, error: outErrB } = await admin
    .from('outlets')
    .insert({ organization_id: orgB.id, name: 'Warung B Test', location_label: 'RLS Test' })
    .select('id')
    .single();
  if (outErrB ?? !outB) throw new Error(`insert outletB: ${outErrB?.message}`);
  outletIdB = outB.id as string;

  // Insert one stock_log per outlet via service role
  const { error: slErrA } = await admin
    .from('stock_logs')
    .insert({ outlet_id: outletIdA, service_date: '2026-01-01', items: [] });
  if (slErrA) throw new Error(`insert stock_log A: ${slErrA.message}`);

  const { error: slErrB } = await admin
    .from('stock_logs')
    .insert({ outlet_id: outletIdB, service_date: '2026-01-01', items: [] });
  if (slErrB) throw new Error(`insert stock_log B: ${slErrB.message}`);

  // Sign in as User A to obtain JWT for RLS tests
  const anonUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const { data: session, error: signInErr } = await createClient(
    anonUrl,
    anonKey,
  ).auth.signInWithPassword({
    email: EMAIL_A,
    password: TEST_PASSWORD,
  });
  if (signInErr ?? !session.session) throw new Error(`signIn A failed: ${signInErr?.message}`);
  tokenA = session.session.access_token;
}, 30_000);

afterAll(async () => {
  if (!userIdA && !userIdB) return;
  const admin = adminClient();
  // Delete in FK-safe order
  await admin.from('stock_logs').delete().in('outlet_id', [outletIdA, outletIdB].filter(Boolean));
  await admin.from('outlets').delete().in('id', [outletIdA, outletIdB].filter(Boolean));
  await admin.from('memberships').delete().in('user_id', [userIdA, userIdB].filter(Boolean));
  await admin.from('organizations').delete().filter('name', 'like', `%${RUN_ID}%`);
  await admin.from('users').delete().in('id', [userIdA, userIdB].filter(Boolean));
  if (userIdA) await admin.auth.admin.deleteUser(userIdA);
  if (userIdB) await admin.auth.admin.deleteUser(userIdB);
}, 30_000);

describe('RLS tenant isolation — stock_logs', () => {
  it('user A can read their own stock_logs', async () => {
    const client = userClient(tokenA);
    const { data, error } = await client.from('stock_logs').select('id').eq('outlet_id', outletIdA);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it('user A cannot read user B stock_logs — RLS returns empty set', async () => {
    const client = userClient(tokenA);
    const { data, error } = await client.from('stock_logs').select('id').eq('outlet_id', outletIdB);
    // RLS policy silently filters — no error, empty result
    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });

  it('service role bypasses RLS and reads all test stock_logs', async () => {
    const admin = adminClient();
    const { data, error } = await admin
      .from('stock_logs')
      .select('id')
      .in('outlet_id', [outletIdA, outletIdB]);
    expect(error).toBeNull();
    expect(data).toHaveLength(2);
  });
});

describe('RLS tenant isolation — outlets', () => {
  it('user A cannot see user B outlet via select', async () => {
    const client = userClient(tokenA);
    const { data } = await client.from('outlets').select('id').eq('id', outletIdB);
    expect(data).toHaveLength(0);
  });

  it('user A can see their own outlet', async () => {
    const client = userClient(tokenA);
    const { data } = await client.from('outlets').select('id').eq('id', outletIdA);
    expect(data).toHaveLength(1);
  });
});
