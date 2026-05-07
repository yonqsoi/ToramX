const CACHE_NAME = 'toramx-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'manifest.json'
];

// Install and Cache Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activation logic
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch logic
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Handle SKIP_WAITING for updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});