const CACHE = "bobs-bakery-v1";
const ASSETS = [
  "/Bob-s-Bakery/",
  "/Bob-s-Bakery/index.html",
  "/Bob-s-Bakery/css/style.css",
  "/Bob-s-Bakery/js/app.js",
  "/Bob-s-Bakery/js/products.js",
  "/Bob-s-Bakery/images/bg-hero.png",
  "/Bob-s-Bakery/images/bg-pattern.png",
  "/Bob-s-Bakery/images/icon-192.png",
  "/Bob-s-Bakery/images/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
