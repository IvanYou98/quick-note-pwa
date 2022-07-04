let CACHE_NAME = "appv3";
console.log('service worker in the public folder');

this.addEventListener("install", event => {
    console.log("caching app shell");
    event.waitUntil(
        caches.open(CACHE_NAME).then(
            cache => {
                cache.addAll([
                    '/index.html',
                    '/static/js/bundle.js',
                    '/favicon.ico',
                    '/login',
                    '/create',
                    '/',
                    '/logo-192.png',
                    '/ws',
                    '/static/js/main.e442bf35.js',
                    '/static/css/main.46d5106c.css',
                    '/manifest.json',

                ])
            }
        )
    )
})

this.addEventListener("fetch", event => {
    // if we are offline, go to the cache directly
    if (!navigator.onLine) {
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
})
