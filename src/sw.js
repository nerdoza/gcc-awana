/* global workbox, self */
const defaultMaxAge = 30 * 24 * 60 * 60

workbox.setConfig({
  debug: false
})

workbox.precaching.precacheAndRoute(self.__precacheManifest || [])

workbox.routing.registerRoute(
  /\/(?:index\.html)?(?:\?.*)?$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'html',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 2,
        maxAgeSeconds: defaultMaxAge
      })
    ]
  })
)

workbox.routing.registerRoute(
  /\/img\/icons\/.*$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'icon',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: defaultMaxAge
      })
    ]
  })
)

workbox.routing.registerRoute(
  /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/,
  new workbox.strategies.CacheFirst({
    cacheName: 'font',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10,
        maxAgeSeconds: defaultMaxAge
      })
    ]
  })
)
