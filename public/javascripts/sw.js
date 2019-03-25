var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
// add the files you want to cache here
    '/javascripts/index.js',
    '/javascripts/login.js',
    '/javascripts/register.js'
];

/* install service worker*/
self.addEventListener('install'
    , function(event) {
// Perform install steps
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function(cache) {
                    console.log('Opened cache');
                    return cache.addAll(urlsToCache);
                })
        );
    });


/* when the worker receives a fetch request */
// self.addEventListener('fetch', function(event) {
//     event.respondWith(
// // it checks if the requested page is among the cached ones
//         caches.match(event.request)
//             .then(function(response) {
// // Cache hit - return the cache response (the cached page)
//                 if (response) {
//                     return response;
//                 } //cache does not have the page — go to the server
//                 return fetch(event.request);
//             })
//     );
// });

/* when the worker receives a fetch request */
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
// Cache hit - return response
                    if (response) {
                        return response;
                    }
                    var fetchRequest = event.request.clone();
                    return fetch(fetchRequest).then(
                        function (response) {
                            // Check if we received a valid response. A basic response is one that
                            // is made when we fetch from our own site. Do not cache responses to
                            // requests made to other sites
                            // if the file does not exist, do not cache - just return to the browser
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }
                            // response is valid. Cache the fetched file
                            // IMPORTANT: as mentioned we must clone the response.
                            // A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have two streams.
                            var responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(function (cache) {
                                    cache.put(event.request, responseToCache); // here we use the clone
                                });
                            return response; // here we use the original response
                        })
                })
            );
});