const cacheName = 'cache-v6';
const filesToCache = [
  '/',
  'sudax.png',
  'res/resume.pdf',
  'res/logos/dev.svg',
  'res/logos/facebook.svg',
  'res/logos/github.svg',
  'res/logos/gmail.svg',
  'res/logos/instagram.svg',
  'res/logos/linkedin.svg',
  'res/logos/npm.svg',
  'res/logos/phone.svg',
  'res/logos/stackoverflow.svg',
  'res/logos/twitter.svg',
  'res/logos/whatsapp.svg',
  'js/main.js',
  'css/main.css',
  'css/light.css',
  'css/dark.css',
  'index.html',
  'manifest.json',
  'todo/todo.js',
  'todo/todo.css',
  'todo/index.html',
  'todo/light.css',
  'todo/dark.css',
  'ourbox/ourbox.js',
  'ourbox/index.html',
  'ourbox/ourbox.css',
  'ourbox/light.css',
  'ourbox/dark.css',
];

self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map((key) => {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    }).catch(err => {
      console.log('SW-Fetch-Error', err);
    })
  );
});
