const CACHE_NAME = 'pwd-manager-v2';

// Tự động bắt tất cả các file cần thiết khi cài đặt app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Cơ chế thông minh: Có mạng thì tải mới + lưu lại, mất mạng thì lôi rác cache ra chạy ngầm
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Trả về file đã lưu trong máy ngay để app mở lên nhanh, rồi âm thầm cập nhật bản mới nếu có mạng
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Offline */});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Nếu mất mạng hoàn toàn và không có cache, cố gắng trả về file gốc
        return caches.match('/index.html');
      });
    })
  );
});
