const CACHE_NAME = "pwa-cache";
/* const ASSETS = [
  "/parking-pwa/",
  "/parking-pwa/index.php",
  "/parking-pwa/css/styles.css",
  "/parking-pwa/css/ticket.css",
  "/parking-pwa/img/logo.jpg",
  "/parking-pwa/js/app.js",
  "/parking-pwa/js/logo.js",
  "/parking-pwa/js/lib/jsbarcode.js",
  "/parking-pwa/js/lib/moment.js",
  "/parking-pwa/js/lib/boostrap.css",
  "/parking-pwa/js/lib/boostrap.js",
  "/parking-pwa/js/lib/awesome.css",
  "/parking-pwa/js/lib/sweetalert.css",
  "/parking-pwa/js/lib/sweetalert.js",
  "/parking-pwa/js/lib/fonts/fontawesome-webfont.eot",
  "/parking-pwa/js/lib/fonts/fontawesome-webfont.ttf",
  "/parking-pwa/js/lib/fonts/fontawesome-webfont.woff",
  "/parking-pwa/js/lib/fonts/fontawesome-webfont.woff2",
  "/parking-pwa/js/lib/fonts/fontawesome.otf",
]; */

const ASSETS = [
  "/",
  "/index.php",
  "/css/styles.css",
  "/css/ticket.css",
  "/img/logo.jpg",
  "/js/app.js",
  "/js/logo.js",
  "/js/lib/jsbarcode.js",
  "/js/lib/moment.js",
  "/js/lib/boostrap.css",
  "/js/lib/boostrap.js",
  "/js/lib/awesome.css",
  "/js/lib/sweetalert.css",
  "/js/lib/sweetalert.js",
  "/js/lib/fonts/fontawesome-webfont.eot",
  "/js/lib/fonts/fontawesome-webfont.ttf",
  "/js/lib/fonts/fontawesome-webfont.woff",
  "/js/lib/fonts/fontawesome-webfont.woff2",
  "/js/lib/fonts/fontawesome.otf",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache abierto");
      return cache.addAll(ASSETS);
    })
  );
});

// Interceptar solicitudes y servir desde la caché
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Actualizar la caché cuando hay cambios
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
