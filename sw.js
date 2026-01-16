const CACHE_NAME = "Spectrum-v4"; // Har update par ye v3, v4 badalte rahein
const urlsToCache = [
  "/",
  "/home.html",
  "/manifest.json",
  "/iconzip.png",
  "/bscwap.png"
];

// Install Event: Files ko cache karna
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching new files");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); 
});

// Activate Event: Purane caches delete karna
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) {
            console.log("Deleting old cache:", k);
            return caches.delete(k);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch Event: Network First ya Stale-while-revalidate strategy
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Background mein cache update karna
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      // Agar cache mein hai toh wahi dikhao, varna network se lao
      return cachedResponse || fetchPromise;
    })
  );
});
