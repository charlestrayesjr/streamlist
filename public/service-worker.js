const CACHE_NAME =
  "eztechmovie-streamlist-v1";

const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener(
  "install",
  (event) => {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(
            APP_SHELL
          );
        })
    );

    self.skipWaiting();
  }
);

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      caches
        .keys()
        .then(
          (cacheNames) => {
            return Promise.all(
              cacheNames
                .filter(
                  (cacheName) =>
                    cacheName !==
                    CACHE_NAME
                )
                .map(
                  (cacheName) =>
                    caches.delete(
                      cacheName
                    )
                )
            );
          }
        )
        .then(() =>
          self.clients.claim()
        )
    );
  }
);

self.addEventListener(
  "fetch",
  (event) => {
    if (
      event.request.method !==
      "GET"
    ) {
      return;
    }

    const requestUrl =
      new URL(
        event.request.url
      );

    if (
      requestUrl.origin !==
      self.location.origin
    ) {
      return;
    }

    if (
      event.request.mode ===
      "navigate"
    ) {
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            const copy =
              response.clone();

            caches
              .open(
                CACHE_NAME
              )
              .then((cache) => {
                cache.put(
                  event.request,
                  copy
                );
              });

            return response;
          })
          .catch(() =>
            caches.match("/")
          )
      );

      return;
    }

    event.respondWith(
      caches
        .match(event.request)
        .then(
          (
            cachedResponse
          ) => {
            if (
              cachedResponse
            ) {
              return cachedResponse;
            }

            return fetch(
              event.request
            ).then(
              (
                networkResponse
              ) => {
                if (
                  !networkResponse ||
                  networkResponse.status !==
                    200
                ) {
                  return networkResponse;
                }

                const copy =
                  networkResponse.clone();

                caches
                  .open(
                    CACHE_NAME
                  )
                  .then(
                    (cache) => {
                      cache.put(
                        event.request,
                        copy
                      );
                    }
                  );

                return networkResponse;
              }
            );
          }
        )
    );
  }
);