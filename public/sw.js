/**
 * Stockast minimal service worker — Phase 1.5 / Sprint E.1.
 *
 * Strategy:
 *  - Precache the app shell on install (manifest, icons, root document).
 *  - Cache-first for static assets (Next chunks, CSS, fonts, images).
 *  - Network-first for HTML navigations, fall back to cached shell when offline.
 *  - Bypass everything else (Server Actions, API calls, RSC payloads, Supabase) —
 *    those must hit the network and surface their own errors.
 *
 * Bumping CACHE_VERSION invalidates previous caches on activate. Update on any
 * shell change so users stop seeing a stale UI.
 */

const CACHE_VERSION = 'stockast-shell-v1';
const SHELL_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/maskable-icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Same-origin only — third-party (Supabase, Gemini) must always go live.
  if (url.origin !== self.location.origin) return;

  // Skip Next data fetches and any internal infra paths.
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/_next/data/')) return;
  if (url.search.includes('_rsc=')) return;

  // Cache-first for static assets (Next chunks, CSS, fonts, images, the SVG icons).
  const dest = req.destination;
  if (
    dest === 'script' ||
    dest === 'style' ||
    dest === 'font' ||
    dest === 'image' ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            if (res && res.status === 200 && res.type === 'basic') {
              const copy = res.clone();
              caches
                .open(CACHE_VERSION)
                .then((cache) => cache.put(req, copy))
                .catch(() => undefined);
            }
            return res;
          })
          .catch(() => cached || Response.error());
      }),
    );
    return;
  }

  // Network-first for HTML navigations; fall back to last-good HTML offline.
  if (req.mode === 'navigate' || dest === 'document') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches
              .open(CACHE_VERSION)
              .then((cache) => cache.put(req, copy))
              .catch(() => undefined);
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match('/dashboard')),
        ),
    );
  }
});
