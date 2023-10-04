const VERSION = 1;
const ASSETS_CACHE_PREFIX = "mpr-pwa-assets";
const ASSETS_CACHE_NAME = `${ASSETS_CACHE_PREFIX}-${VERSION}`;

// const ASSET_URLS = [
//     "index.html",
//     "offline.html",
//     "http://localhost:5000/images/daniel.jpg",
//     "http://localhost:5000/images/manuel.jpg",
//     "http://localhost:5000/images/guenther.jpg",
//     "http://localhost:5000/images/franz.jpg"
// ];
const ASSET_URLS = [
    "/",
    "offline.html",
    "images/daniel.jpg",
    "images/manuel.jpg",
    "images/guenther.jpg",
    "images/franz.jpg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(ASSETS_CACHE_NAME)
            .then((cache) => cache.addAll(ASSET_URLS))
    );
});

self.addEventListener("fetch", (event) => {
    const {request} = event;
    const path = new URL(request.url).pathname;

    // if (ASSET_URLS.find((item) => request.url === item || path.includes(item))) {
    if (ASSET_URLS.find((item) => path.includes(item))) {
        event.respondWith((async function () {
            const cache = await caches.open(ASSETS_CACHE_NAME);
            const cachedResponse = await cache.match(request);

            if (cachedResponse) {
                // if (cachedResponse.url.endsWith("index.html")) {
                if (cachedResponse.url === "http://localhost:5000/") {
                    return await fetch(request)
                        .catch(() => {
                            return caches.match("./offline.html");
                        });
                } else {
                    return cachedResponse;
                }
            }

            const response = await fetch(request);
            await cache.put(request, response.clone());

            return response;
        })());
    }
});

self.addEventListener("activate", (event) => {
    event.waitUntil(async function () {
        const keys = await caches.keys();

        return Promise.all(keys.map((key) => {
            if (key.startsWith(ASSETS_CACHE_PREFIX) && key !== ASSETS_CACHE_NAME) {
                return caches.delete(key);
            }
        }));
    }());
});