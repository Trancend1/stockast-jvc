/* eslint-disable no-console */
/**
 * scripts/seed-dimsum.ts
 *
 * Dynamic seed — Warung Dimsum Pak Budi, Salatiga.
 *
 * DYNAMIC SCHEMA DETECTION:
 *   On startup, queries `get_columns_meta(table)` (defined in
 *   0002_dev_helpers.sql) via supabase.rpc(). If the helper isn't installed
 *   yet (migration not run), falls back to inline column definitions so the
 *   script still works. All INSERT payloads are built from the live schema:
 *   columns with server-side defaults (e.g. created_at = now()) are skipped
 *   automatically, and new nullable columns added later are ignored without
 *   manual updates.
 *
 * SCENARIO:
 *   10 dimsum menu items · 20 days of sales · ~100–150 total sold per item.
 *   Realistic day-of-week variance (Jumat/Sabtu peak). Idempotent: re-running
 *   is safe — all inserts use ON CONFLICT DO NOTHING / upsert.
 *
 * USAGE:
 *   pnpm seed:dimsum
 *   Login phone: +6281234567000 (override with SEED_DIMSUM_PHONE)
 *   Demo OTP fallback: 123456 (override with SEED_DIMSUM_OTP)
 *   Fallback auth email: dimsum-seed@stockast.local (override with SEED_DIMSUM_EMAIL)
 *
 * REQUIRES:
 *   .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';

// ─── Environment ──────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SEED_PHONE   = process.env.SEED_DIMSUM_PHONE?.trim() || '+6281234567000';
const SEED_EMAIL   = process.env.SEED_DIMSUM_EMAIL?.trim() || 'dimsum-seed@stockast.local';
const SEED_PASSWORD = process.env.SEED_DIMSUM_PASSWORD?.trim() || 'StockastDimsum!2026';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('\n❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local\n');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── Scenario constants (deterministic UUIDs → idempotent re-runs) ────────────

const S = {
  orgId:    '20000000-0000-0000-0000-000000000100',
  outletId: '20000000-0000-0000-0000-000000000010',
} as const;

// 10 dimsum items. baselinePerDay × 20 days × ~1.0 avg multiplier ≈ target total.
// Targeting 100–150 total sold per item over the 20-day window.
const MENU = [
  { id: '20000000-0000-0000-0000-000000001001', name: 'Siomay Ayam',       baselinePerDay: 7 },
  { id: '20000000-0000-0000-0000-000000001002', name: 'Hakau Udang',        baselinePerDay: 7 },
  { id: '20000000-0000-0000-0000-000000001003', name: 'Pao Ayam',           baselinePerDay: 6 },
  { id: '20000000-0000-0000-0000-000000001004', name: 'Pao Kacang Merah',   baselinePerDay: 5 },
  { id: '20000000-0000-0000-0000-000000001005', name: 'Ceker Pedas',        baselinePerDay: 7 },
  { id: '20000000-0000-0000-0000-000000001006', name: 'Tahu Udang',         baselinePerDay: 6 },
  { id: '20000000-0000-0000-0000-000000001007', name: 'Ekado',              baselinePerDay: 7 },
  { id: '20000000-0000-0000-0000-000000001008', name: 'Lumpia Goreng',      baselinePerDay: 5 },
  { id: '20000000-0000-0000-0000-000000001009', name: 'Pangsit Goreng',     baselinePerDay: 6 },
  { id: '20000000-0000-0000-0000-000000001010', name: 'Batagor',            baselinePerDay: 5 },
] as const;

const DAYS_BACK = 20;

// ─── Schema introspection ─────────────────────────────────────────────────────

type ColumnMeta = {
  column_name:    string;
  data_type:      string;
  udt_name:       string;
  is_nullable:    'YES' | 'NO';
  column_default: string | null;
  ordinal_position: number;
};

// Fallback column lists used when get_columns_meta RPC is unavailable.
// Lists only columns that must be supplied — columns with DB-generated defaults
// (id, created_at, updated_at, deleted_at) are intentionally omitted.
const FALLBACK_COLS: Record<string, string[]> = {
  users:         ['id'],
  organizations: ['id', 'name', 'owner_id'],
  memberships:   ['user_id', 'organization_id', 'role'],
  outlets:       ['id', 'organization_id', 'name', 'location_label', 'adm4_code'],
  menu_items:    ['id', 'outlet_id', 'name', 'normalized_name', 'unit'],
  stock_logs:    ['outlet_id', 'service_date', 'items', 'confirmed_at'],
};

// Build synthetic ColumnMeta from fallback list (all required, no defaults).
function fallbackMeta(table: string): ColumnMeta[] {
  const cols = FALLBACK_COLS[table] ?? [];
  return cols.map((c, i) => ({
    column_name:      c,
    data_type:        c === 'items' ? 'jsonb' : 'text',
    udt_name:         c === 'items' ? 'jsonb' : 'text',
    is_nullable:      'NO' as const,
    column_default:   null,
    ordinal_position: i + 1,
  }));
}

const schemaCache = new Map<string, ColumnMeta[]>();
let dynamicMode = false;

async function getColumns(table: string): Promise<ColumnMeta[]> {
  if (schemaCache.has(table)) return schemaCache.get(table)!;

  const { data, error } = await db.rpc('get_columns_meta', { p_table: table });
  if (!error && Array.isArray(data) && data.length > 0) {
    const meta = data as ColumnMeta[];
    schemaCache.set(table, meta);
    dynamicMode = true;
    return meta;
  }

  const meta = fallbackMeta(table);
  schemaCache.set(table, meta);
  return meta;
}

/**
 * Build an INSERT payload from `values` filtered to only columns that exist
 * in the live schema. Columns with server-side defaults that are NOT in
 * `values` are skipped (DB handles them). New nullable columns added to the
 * schema after this script was written are silently ignored.
 */
async function buildPayload(
  table: string,
  values: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const cols = await getColumns(table);
  const payload: Record<string, unknown> = {};

  for (const col of cols) {
    const { column_name, is_nullable, column_default } = col;

    if (!(column_name in values)) {
      // Skip if DB has a default (server generates the value) or column is optional.
      const hasDefault = column_default !== null;
      if (hasDefault || is_nullable === 'YES') continue;
      // Required column with no default and not provided → warn but continue.
      // The DB will reject the INSERT; that's the right signal.
      console.warn(`  ⚠  ${table}.${column_name}: required but not provided`);
      continue;
    }

    const v = values[column_name];
    if (v !== undefined) payload[column_name] = v;
  }

  return payload;
}

// ─── Sales data generator ─────────────────────────────────────────────────────

// Day-of-week multipliers — Jumat/Sabtu peak matches warung research.
const DOW_MULT: Record<number, number> = {
  0: 1.05, // Minggu
  1: 0.92, // Senin
  2: 0.95, // Selasa
  3: 1.00, // Rabu
  4: 1.02, // Kamis
  5: 1.18, // Jumat
  6: 1.15, // Sabtu
};

/** Deterministic noise in [0.85, 1.15] keyed by arbitrary string + salt. */
function noise(seed: string, salt: number): number {
  let h = (salt * 2654435761) >>> 0;
  for (let i = 0; i < seed.length; i++) h = ((h * 31 + seed.charCodeAt(i)) >>> 0);
  return 0.85 + ((h % 10_000) / 10_000) * 0.30;
}

type StockItem = { menu_item_id: string; sold: number; leftover: number; unit: string };

function buildStockDays() {
  const anchor = new Date();
  anchor.setUTCHours(0, 0, 0, 0);

  return Array.from({ length: DAYS_BACK }, (_, idx) => {
    const offset = DAYS_BACK - idx; // counts down from DAYS_BACK to 1
    const day = new Date(anchor);
    day.setUTCDate(day.getUTCDate() - offset);
    const iso     = day.toISOString().slice(0, 10);
    const mult    = DOW_MULT[day.getUTCDay()] ?? 1.0;

    const items: StockItem[] = MENU.map((m, i) => {
      const sold     = Math.max(1, Math.round(m.baselinePerDay * mult * noise(`${iso}:sold:${m.id}`, i)));
      const expected = Math.round(m.baselinePerDay * mult);
      // Leftover: 0 on peak days; 0–3 on slow days (dimsum is made fresh).
      const leftover = sold >= expected
        ? 0
        : Math.min(3, Math.round((noise(`${iso}:left:${m.id}`, i + 100) - 0.85) / 0.30 * 4));
      return { menu_item_id: m.id, sold, leftover: Math.max(0, leftover), unit: 'porsi' };
    });

    // Realistic confirmed_at: 21:00–21:45 WIB on each day.
    const mins = Math.round((noise(`${iso}:time`, 77) - 0.85) / 0.30 * 45);
    return {
      service_date: iso,
      items,
      confirmed_at: `${iso}T21:${String(mins).padStart(2, '0')}:00+07:00`,
    };
  });
}

// ─── Insert helpers ───────────────────────────────────────────────────────────

async function upsert(
  table: string,
  values: Record<string, unknown>,
  onConflict?: string,
): Promise<void> {
  const payload = await buildPayload(table, values);
  const opts = onConflict ? { onConflict } : {};
  const { error } = await db.from(table).upsert(payload, opts);
  if (error) throw new Error(`upsert(${table}): ${error.message}`);
}

function normalizePhone(phone: string | undefined): string {
  return (phone ?? '').replace(/^\+/, '');
}

async function findAuthUserIdByPhone(phone: string): Promise<string | null> {
  const normalizedPhone = normalizePhone(phone);
  const perPage = 1000;
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`list auth users: ${error.message}`);
    const user = data.users.find((candidate) => normalizePhone(candidate.phone) === normalizedPhone);
    if (user) return user.id;
    if (data.users.length < perPage) return null;
  }
  return null;
}

async function ensureAuthUser(): Promise<string> {
  const existingUserId = await findAuthUserIdByPhone(SEED_PHONE);
  const metadata = {
    user_metadata: { warung_name: 'Warung Dimsum Pak Budi' },
    app_metadata: { seed: 'dimsum' },
  };

  if (existingUserId) {
    const { error } = await db.auth.admin.updateUserById(existingUserId, {
      phone: SEED_PHONE,
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
      phone_confirm: true,
      email_confirm: true,
      ...metadata,
    });
    if (error) throw new Error(`update auth user: ${error.message}`);
    return existingUserId;
  }

  const { data, error } = await db.auth.admin.createUser({
    phone: SEED_PHONE,
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
    phone_confirm: true,
    email_confirm: true,
    ...metadata,
  });
  if (error || !data.user) throw new Error(`create auth user: ${error?.message}`);
  return data.user.id;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n🥟  Seed — Warung Dimsum Pak Budi, Salatiga\n');

  // Probe schema introspection (result stored in dynamicMode flag via getColumns).
  await getColumns('users');
  console.log(`  schema: ${dynamicMode ? 'dynamic via get_columns_meta RPC' : 'fallback (run db:reset to enable dynamic mode)'}`);

  // ── Identity & org layer ──────────────────────────────────────────────────

  const authUserId = await ensureAuthUser();
  console.log(`  auth phone: ${SEED_PHONE}`);

  await upsert('users', { id: authUserId, phone: SEED_PHONE }, 'id');
  console.log('  auth user + public user');

  await upsert('organizations', {
    id:       S.orgId,
    name:     'Warung Dimsum Pak Budi',
    owner_id: authUserId,
  }, 'id');
  console.log('  ✓ organization');

  await upsert('memberships', {
    user_id:         authUserId,
    organization_id: S.orgId,
    role:            'owner',
  }, 'user_id,organization_id');
  console.log('  ✓ membership');

  await upsert('outlets', {
    id:              S.outletId,
    organization_id: S.orgId,
    name:            'Warung Dimsum Pak Budi',
    location_label:  'Salatiga, Jawa Tengah',
    adm4_code:       '33.73.01.1001',
  }, 'id');
  console.log('  ✓ outlet');

  // ── Menu items ────────────────────────────────────────────────────────────

  for (const m of MENU) {
    await upsert('menu_items', {
      id:              m.id,
      outlet_id:       S.outletId,
      name:            m.name,
      normalized_name: m.name.toLowerCase().trim(),
      unit:            'porsi',
    }, 'outlet_id,normalized_name');
  }
  console.log(`  ✓ ${MENU.length} menu items`);

  // ── Stock logs (20 days) ──────────────────────────────────────────────────

  const days = buildStockDays();
  for (const day of days) {
    await upsert('stock_logs', {
      outlet_id:    S.outletId,
      service_date: day.service_date,
      items:        day.items,
      confirmed_at: day.confirmed_at,
    }, 'outlet_id,service_date');
  }
  console.log(`  ✓ ${days.length} stock log days  (${days[0]!.service_date} → ${days.at(-1)!.service_date})`);

  // ── Totals summary ────────────────────────────────────────────────────────

  console.log('\n  Menu totals (20-day window):');
  const totals = new Map(MENU.map((m) => [m.id, 0]));
  for (const day of days) {
    for (const item of day.items) {
      totals.set(item.menu_item_id, (totals.get(item.menu_item_id) ?? 0) + item.sold);
    }
  }

  const maxTotal = Math.max(...totals.values());
  for (const m of MENU) {
    const total = totals.get(m.id) ?? 0;
    const bar   = '█'.repeat(Math.round((total / maxTotal) * 20));
    console.log(`    ${m.name.padEnd(18)} ${String(total).padStart(3)}  ${bar}`);
  }

  console.log('\n  ✅  Done.\n');
  console.log('  Tip: open the app, log in as this outlet, and see Belanja Card with 20 days of dimsum data.');
  console.log('  Tip: run  pnpm db:wipe  to remove all seeded data.\n');
}

void run().catch((err: unknown) => {
  console.error('\n❌ ', (err as Error).message ?? err);
  process.exit(1);
});
