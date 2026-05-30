const CACHE_NAME = 'pwd-github-v4';

// Sử dụng đường dẫn tương đối để điện thoại tự khớp thư mục app khi offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        'index.html',
        'manifest.json'
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
        // Trả về file offline ngay cho mượt, đồng thời âm thầm cập nhật nếu có mạng
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Offline mode */});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return caches.match('index.html');
      });
    })
  );
});
