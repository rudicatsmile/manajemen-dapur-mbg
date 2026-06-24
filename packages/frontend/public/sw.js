/* Service Worker — Manajemen Dapur MBG
 * Vanilla SW (tanpa build-plugin) agar aman untuk Turbopack & Webpack.
 * Strategi:
 *  - Navigasi (HTML): network-first -> fallback cache -> /offline
 *  - Aset statis Next (/_next/static, ikon, font): cache-first
 *  - GET /api: network-first -> fallback cache
 *  - Non-GET: lewat (ditangani outbox di app, Fase 3)
 */
const VERSION = 'v1';
const STATIC_CACHE = `mbg-static-${VERSION}`;
const PAGE_CACHE = `mbg-pages-${VERSION}`;
const API_CACHE = `mbg-api-${VERSION}`;
const OFFLINE_URL = '/offline';
const PRECACHE = [OFFLINE_URL, '/icons/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, PAGE_CACHE, API_CACHE].includes(k))
          .map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(?:js|css|woff2?|ttf|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname)
  );
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await caches.match(fallbackUrl);
      if (fallback) return fallback;
    }
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // non-GET ditangani app (outbox)

  const url = new URL(request.url);

  // API (beda origin / path /api)
  if (url.pathname.startsWith('/api') || url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE, OFFLINE_URL));
    return;
  }
});

// Background Sync (Fase 3): trigger replay outbox di klien.
self.addEventListener('sync', (event) => {
  if (event.tag === 'mbg-outbox-sync') {
    event.waitUntil(
      self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => client.postMessage({ type: 'REPLAY_OUTBOX' }));
      }),
    );
  }
});
