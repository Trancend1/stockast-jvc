/**
 * Wipes all user-generated rows from the Stockast Supabase project.
 * Runs against the URL + service role key in .env.local.
 *
 * Usage: pnpm db:wipe
 * After running: clear browser localStorage (F12 -> Application -> Local Storage -> Delete All)
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Service role key bypasses RLS, so all rows are visible and deletable.
const db = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Ordered by FK dependency: children first, parents last.
// memberships has composite PK (user_id, organization_id), so there is no id column.
const steps: Array<[string, () => Promise<{ error: unknown }>]> = [
  ['ai_audit_logs', () => db.from('ai_audit_logs').delete().not('id', 'is', null)],
  ['weather_snapshots', () => db.from('weather_snapshots').delete().not('id', 'is', null)],
  ['promo_drafts', () => db.from('promo_drafts').delete().not('id', 'is', null)],
  ['recommendations', () => db.from('recommendations').delete().not('id', 'is', null)],
  ['stock_logs', () => db.from('stock_logs').delete().not('id', 'is', null)],
  ['stock_log_drafts', () => db.from('stock_log_drafts').delete().not('id', 'is', null)],
  ['menu_items', () => db.from('menu_items').delete().not('id', 'is', null)],
  ['outlets', () => db.from('outlets').delete().not('id', 'is', null)],
  ['memberships', () => db.from('memberships').delete().not('user_id', 'is', null)],
  ['organizations', () => db.from('organizations').delete().not('id', 'is', null)],
  ['users', () => db.from('users').delete().not('id', 'is', null)],
];

async function run() {
  process.stdout.write('Wiping all dev data...\n\n');
  let allOk = true;

  for (const [name, fn] of steps) {
    const { error } = await fn();
    if (error) {
      console.error(`  x ${name}:`, (error as { message?: string }).message ?? String(error));
      allOk = false;
      continue;
    }

    process.stdout.write(`  ok ${name}\n`);
  }

  process.stdout.write('\nDB clean.\n');
  process.stdout.write(
    'Next: clear browser localStorage -> F12 -> Application -> Local Storage -> localhost:3000 -> Delete All\n\n',
  );

  if (!allOk) process.exit(1);
}

void run();
