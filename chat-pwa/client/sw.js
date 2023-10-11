const VERSION = 1;
const ASSETS_CACHE_PREFIX = "mpr-pwa-assets";
const ASSETS_CACHE_NAME = `${ASSETS_CACHE_PREFIX}-${VERSION}`;

const ASSET_URLS = [
    "/",
    "/offline.html",
    "/manifest.json",
    "/images/daniel.jpg",
    "/images/manuel.jpg",
    "/images/guenther.jpg",
    "/images/franz.jpg",
    "/images/manifest_512x512.png"
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

    if (ASSET_URLS.find((item) => item.includes(path))) {
        event.respondWith((async function () {
            const cache = await caches.open(ASSETS_CACHE_NAME);
            const cachedResponse = await cache.match(request);

            if (cachedResponse) {
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