// Bump this version on every deploy that changes cached files.
// Changing the name forces old caches to be deleted on activate.
const CACHE_NAME = 'ielanedge-v2';
const ASSETS = [
  '/index.html',
  '/pages/about.html',
  '/pages/services.html',
  '/pages/solutions.html',
  '/pages/ventures.html',
  '/pages/careers.html',
  '/pages/contact.html',
  '/pages/newsroom.html',
  '/assets/css/global.css',
  '/assets/js/layout.js',
  '/assets/js/main.js',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for navigations and same-origin assets, so visitors always
// get the latest deployed version. Falls back to cache only when offline.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  e.respondWith(
    fetch(req)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req).then(cached => cached || caches.match('/index.html')))
  );
});
