const cacheName = 'cache-v1';
const filesToCache = [
  '/sudax.png',
  '/res/resume.pdf',
  '/res/logos/dev.svg',
  '/res/logos/facebook.svg',
  '/res/logos/github.svg',
  '/res/logos/gmail.svg',
  '/res/logos/instagram.svg',
  '/res/logos/linkedin.svg',
  '/res/logos/npm.svg',
  '/res/logos/phone.svg',
  '/res/logos/stackoverflow.svg',
  '/res/logos/twitter.svg',
  '/res/logos/whatsapp.svg',
  '/js/main.js',
  '/css/main.css',
  '/index.html'
];

//install the sw
self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', function (e) {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});