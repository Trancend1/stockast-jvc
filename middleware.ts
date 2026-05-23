import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/catat', '/riwayat'];
const AUTH_ROUTE = '/login';

/**
 * Middleware: session refresh + route protection.
 *
 * 1. Refreshes the Supabase session cookie on every request (prevents expiry).
 * 2. Redirects unauthenticated users away from protected routes to /login.
 * 3. Redirects authenticated users away from /login to /dashboard.
 *
 * Only active when FEATURE_AUTH_REQUIRED=true — checked via cookie presence
 * rather than env (middleware runs at edge, env parsing has limits).
 *
 * Source: CLAUDE.md core rule #9 (defense in depth: middleware + Server Action + RLS).
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — important for expiry handling.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const authRequired = process.env.FEATURE_AUTH_REQUIRED === 'true';

  if (!authRequired) return response;

  // Protect private routes.
  if (!user && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL(AUTH_ROUTE, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page.
  if (user && pathname === AUTH_ROUTE) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and Next.js internals.
     * Source: Supabase Auth Helpers recommended pattern.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
