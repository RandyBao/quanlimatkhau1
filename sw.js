const CACHE_NAME = 'pwd-github-v3';

// Thêm chính xác đường dẫn kho chứa vào danh sách lưu offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/quanlimatkhau1/',
        '/quanlimatkhau1/index.html',
        '/quanlimatkhau1/manifest.json'
      ]);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Offline */});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return caches.match('/quanlimatkhau1/index.html');
      });
    })
  );
});
