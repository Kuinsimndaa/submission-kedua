module.exports = {
  globDirectory: '.',
  globPatterns: [
    '**/*.{html,js,css,png,svg,ico,json}'
  ],
  swDest: 'service-worker.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }
      }
    },
    {
      urlPattern: /^https:\/\/unpkg\.com\/leaflet\/dist\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'leaflet-cache',
        expiration: { maxEntries: 10, maxAgeSeconds: 30 * 24 * 60 * 60 }
      }
    },
    {
      urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'fa-cache',
        expiration: { maxEntries: 10, maxAgeSeconds: 30 * 24 * 60 * 60 }
      }
    }
  ]
};
