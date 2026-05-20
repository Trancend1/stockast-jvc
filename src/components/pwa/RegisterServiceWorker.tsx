'use client';

import * as React from 'react';

/**
 * Registers the public/sw.js service worker once on client mount, in
 * production only. Dev registration is intentionally skipped — the
 * Next dev server's HMR + SW caching combine badly (stale chunks, hard
 * reloads needed) and the audit benefit isn't worth the friction.
 *
 * Failure modes (no SW support, network blocked, registration error) are
 * silent: SW is progressive enhancement, the app still works without it.
 */
export function RegisterServiceWorker() {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;

    void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);

  return null;
}
