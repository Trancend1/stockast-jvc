import 'server-only';
import {
  createServerClient as createSSRServerClient,
  createBrowserClient as createSSRBrowserClient,
} from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/config/env';

/**
 * Per-request server client. Uses the user's session cookie for auth.
 * RLS policies apply — queries are scoped to the authenticated user.
 *
 * Call inside Server Actions, Server Components, and Route Handlers.
 * NOT suitable for admin/seed operations — use adminDb() for those.
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  return createSSRServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>,
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]),
          );
        } catch {
          // Called from Server Component — middleware handles refresh.
        }
      },
    },
  });
}

/**
 * Browser-side client for Client Components.
 * Uses anon key — RLS policies apply.
 */
export function createBrowserClient() {
  return createSSRBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
