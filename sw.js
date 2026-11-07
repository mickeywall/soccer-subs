/* Sideline Subs service worker: offline cache + notification button taps (from phone or Pixel Watch). */
const CACHE = 'sideline-subs-v2';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Try the network first (so a new version arrives as soon as you have signal), but fall back to the saved copy
// after 3 seconds or when offline, so the app always opens at the field.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const key = url.origin + url.pathname;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const net = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 3000))]);
      if (net.ok) cache.put(key, net.clone());
      return net;
    } catch (err) {
      const hit = await cache.match(key);
      if (hit) return hit;
      return fetch(req);
    }
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const action = e.action || 'open', t = Date.now();
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (wins.length) {
      wins.forEach(w => w.postMessage({ type: 'notif', action, t }));
      if (action === 'open') { try { await wins[0].focus(); } catch (err) {} }   // only pull the app forward on a plain tap
    } else {
      await self.clients.openWindow('./?action=' + encodeURIComponent(action) + '&t=' + t);
    }
  })());
});
