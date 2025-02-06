// Define the cache name for the service worker
const CACHE_NAME = "expense-tracker-v1";

// List of URLs to cache during the service worker installation
const urlsToCache = ["/", "/index.html", "/static/js/bundle.js"];

// Listen for the "install" event to cache files
var self = this;
self.addEventListener("install", (event) => {
  event.waitUntil(
    // Open the cache and add the specified URLs to it
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache); // Cache the necessary files
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Try to serve the requested resource from the cache first
    caches.match(event.request).then((response) => {
      return response || fetch(event.request); // If not in cache, fetch from network
    })
  );
});
