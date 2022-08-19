let CACHE_NAME = "appv3";

this.addEventListener("install", event => {
    console.log("caching app shell");
    event.waitUntil(
        caches.open(CACHE_NAME).then(
            cache => {
                cache.addAll([
                    '/index.html',
                    '/static/js/main.7dd0099e.js',
                    '/static/css/main.e206c222.css',
                    '/favicon.ico',
                    '/',
                    '/logo-192.png',
                    '/manifest.json',
                ])
            }
        )
    )
})

this.addEventListener("fetch", event => {
    // if we are offline, go to the cache directly
    if (!navigator.onLine) {
        if (event.request.method === 'GET') {
            event.respondWith(
                caches
                    .match(event.request).then(resp => {
                        if (resp) {
                            return resp;
                        }
                        let requestUrl = event.request.clone();
                        fetch(requestUrl);
                    })

            );
        }
    }
})

const resendPostRequest = async () => {
    const BASE_NAME = 'backgroundSync';
    const STORE_NAME = 'messages';
    const VERSION = 1;

    const idb = this.indexedDB;
    const request = idb.open(BASE_NAME, VERSION);
    let db = null;
    request.onerror = error => {
        console.warning("An error occured with IndexDB")
        console.warning(error)
    }

    request.onsuccess = () => {
        console.log('Database is opened successfully!', request);
        db = request.result;
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const query = store.getAll();
        console.log(query);

        query.onsuccess = () => {
            const BACKEND_HOST = 'http://localhost:8000';
            console.log('query is successful!');
            query.result.forEach(note => {
                fetch(`${BACKEND_HOST}/notes`, {
                    method: "POST",
                    body: JSON.stringify(note),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                }).then(
                    res => res.json()
                ).then(createdNote => {
                    console.log(createdNote);
                });
            })
            store.clear();

        }
    }
}

this.addEventListener('sync', async (event) => {
    if (event.tag === 'back-sync') {
        console.log('[Service Worker] is background syncing...');
        await resendPostRequest();
        this.registration.showNotification('Your offilne notes have been sync!')
    }
})

