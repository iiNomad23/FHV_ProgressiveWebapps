const VERSION = 1;

const INDEXED_DB_NAME = "mpr-pwa-db";
const ASSETS_CACHE_PREFIX = "mpr-pwa-assets";
const ASSETS_CACHE_NAME = `${ASSETS_CACHE_PREFIX}-${VERSION}`;

const URLS_TO_CACHE = [
    "/",
    "/manifest.json",
    "/images/daniel.jpg",
    "/images/manuel.jpg",
    "/images/guenther.jpg",
    "/images/franz.jpg",
    "/images/manifest_512x512.png",
    "/css/layout.css",
    "/css/chat.css",
    "/lib/history.production.min.js",
    "/src/Api.js",
    "/src/ChatApp.js",
    "/src/ConversationManager.js",
    "/src/Root.js"
];

const ENDPOINTS_TO_CACHE = [
    "/users",
    "/conversations",
    "/messages"
]

const OBJECT_STORE_NAMES = {
    users: ENDPOINTS_TO_CACHE[0],
    conversations: ENDPOINTS_TO_CACHE[1],
    messages: ENDPOINTS_TO_CACHE[2]
}

self.addEventListener("install", (event) => {
    event.waitUntil((async function () {
        createObjectStoreItems();

        let cache = await caches.open(ASSETS_CACHE_NAME);
        await cache.addAll(URLS_TO_CACHE);
    })());
});

self.addEventListener("fetch", (event) => {
    const {request} = event;
    const path = new URL(request.url).pathname;

    if (URLS_TO_CACHE.find((item) => item.includes(path))) {
        event.respondWith((async function () {
            const cache = await caches.open(ASSETS_CACHE_NAME);
            const cachedResponse = await cache.match(request);

            if (cachedResponse) {
                return cachedResponse;
            }

            const response = await fetch(request);
            await cache.put(request, response.clone());

            return response;
        })());
    } else if (ENDPOINTS_TO_CACHE.find((item) => item.includes(path) || path.endsWith(OBJECT_STORE_NAMES.messages))) {
        event.respondWith((async function () {

            let storagePath = path;
            if (path.includes(OBJECT_STORE_NAMES.messages)) {
                storagePath = OBJECT_STORE_NAMES.messages;
            }

            try {
                const response = await fetch(request);
                await storeResponseInIndexedDB(response.clone(), storagePath, path);
                return response;
            } catch (e) {
                return getResponseFromIndexedDB(storagePath);
            }
        })());
    }
});

self.addEventListener("activate", (event) => {
    event.waitUntil(async function () {
        createObjectStoreItems();

        const keys = await caches.keys();
        return Promise.all(keys.map((key) => {
            if (key.startsWith(ASSETS_CACHE_PREFIX) && key !== ASSETS_CACHE_NAME) {
                return caches.delete(key);
            }
        }));
    }());
});

function createObjectStoreItems() {
    const openRequest = indexedDB.open(INDEXED_DB_NAME, VERSION);

    openRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(OBJECT_STORE_NAMES.users, {keyPath: "username"});
        db.createObjectStore(OBJECT_STORE_NAMES.conversations, {keyPath: "id"});
        db.createObjectStore(OBJECT_STORE_NAMES.messages, {keyPath: "conversationId"});
    };
}

function getResponseFromIndexedDB(storagePath) {
    switch (storagePath) {
        case OBJECT_STORE_NAMES.users:
            break;
        case OBJECT_STORE_NAMES.conversations:
            break;
        case OBJECT_STORE_NAMES.messages:
    }
}

async function storeResponseInIndexedDB(response, storagePath, path) {
    let result = await response.json();

    const openRequest = indexedDB.open(INDEXED_DB_NAME, VERSION);
    openRequest.onsuccess = () => {
        const db = openRequest.result;

        const transaction = db.transaction(storagePath, 'readwrite');
        const store = transaction.objectStore(storagePath);

        switch (storagePath) {
            case OBJECT_STORE_NAMES.users:
            case OBJECT_STORE_NAMES.conversations:
                result.forEach((item) => {
                    store.put(item);
                });
                break;

            case OBJECT_STORE_NAMES.messages:
                let conversationId = path.split("/")[2];
                store.put({
                    conversationId: parseInt(conversationId),
                    messages: result
                });
        }
    }
}