const CACHE_NAME = 'ielanedge-v1';
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
  '/assets/js/main.js',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html'))));
});
