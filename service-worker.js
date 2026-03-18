const CACHE_NAME = "index-ai-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/style/main.css",
  "/style/chat.css",
  "/style/mobile.css",
  "/js/app.js",
  "/js/auth.js",
  "/js/chat.js",
  "/js/storage.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
