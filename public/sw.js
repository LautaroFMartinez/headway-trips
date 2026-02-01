const CACHE_NAME = 'headway-trips-v1';

const PRECACHE_ASSETS = ['/', '/manifest.json', '/1.png', '/offline.html', '/globals.css'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((response) => {
            // Cache new successful responses for GET requests
            if (event.request.method === 'GET' && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                // Don't cache everything to avoid quota issues broadly, typically just static assets
                // For this simple example, we just fetch
                // cache.put(event.request, responseClone);
              });
            }
            return response;
          })
        );
      })
      .catch(() => {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});
