// service-worker.js - PWA offline caching
const CACHE_NAME = 'trixscore-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/settings.js',
  '/score-stepper.js',
  '/navbar.js',
  '/modal.js',
  '/scoring.js',
  '/game.js',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg'
];
self.addEventListener('install', e => {
  // Cache disabled for development
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  // Clear all caches
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
});
self.addEventListener('fetch', e => {
  // No caching - always fetch from network
  e.respondWith(fetch(e.request));
});
