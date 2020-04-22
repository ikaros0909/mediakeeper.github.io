var cacheName = 'bayo20200422a'; 
var dataCacheName = 'notInUse';
var filesToCache = [
    '/',
    '/index.html',
    '/css/materialize.min.css',	
    '/css/style.css',	  
    '/ejs/materialize.min.js',	 
    '/ejs/sha256.min.js',
    '/ejs/base64js.min.js',	
    '/ejs/localforage.min.js',
    '/js/bayoCryptoMain_v1.0.js',
    '/js/bayoCryptoUtil_v1.0.js',
    '/js/bayoCryptoWorker_v1.0.js',
    '/icons/icon-36.png',
    '/icons/icon-512.png',
    '/icons/bayo.svg',
    '/jpgMaskSample/bernard-hermant-665508-unsplash.jpg',
    '/jpgMaskSample/justin-lim-500765-unsplash.jpg',
    '/jpgMaskSample/michael-prewett-126900-unsplash.jpg',
    '/jpgMaskSample/palesa-717372-unsplash.jpg',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/banners/defaultBayoBanner.jpg'
];




self.addEventListener('install', function(e) {
//   console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
    //   console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
//   console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
        //   console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
//   console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://mediakeeper.github.io/data';
  if (e.request.url.indexOf(dataUrl) > -1) {
    // 이건 미사용중
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  } 
});
 