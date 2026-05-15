import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/config/env';

/**
 * Service-role Supabase client. Bypasses RLS.
 *
 * Phase 1 only: single-tenant demo uses hardcoded DEMO_USER_ID/DEMO_OUTLET_ID,
 * so we don't have an authenticated session. Service role is the simplest
 * way to read/write the demo outlet's data.
 *
 * BOUNDARY: never expose this to the browser. `server-only` guards bundling.
 * Phase 2 swaps to per-request server client with cookie session + RLS.
 */
let cached: SupabaseClient | null = null;

export function adminDb(): SupabaseClient {
  if (cached) return cached;
  cached = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: { schema: 'public' },
  });
  return cached;
}
