// service-worker.js - offline support for TrixScore
// Strategy: precache the app shell on install, then answer requests with
// stale-while-revalidate (cached copy first, refreshed in the background).
// Bump CACHE_NAME when the ASSETS list changes.
const CACHE_NAME = 'trixscore-v2';

// Relative URLs so the app works from a sub-path (e.g. GitHub Pages /TrixScore/).
const ASSETS = [
  './',
  'index.html',
  'app.js',
  'manifest.json',
  'favicon.svg',
  'AppImages/ios/180.png',
  'AppImages/android/android-launchericon-192-192.png',
  'AppImages/android/android-launchericon-512-512.png',
  'css/components/button-pair.css',
  'css/components/buttons.css',
  'css/components/contract-form.css',
  'css/components/detail-row.css',
  'css/components/form-group.css',
  'css/components/inputs.css',
  'css/components/modal.css',
  'css/components/navbar.css',
  'css/components/picker.css',
  'css/components/settings.css',
  'css/components/stepper.css',
  'css/components/switch.css',
  'css/components/table.css',
  'css/components/tabs.css',
  'css/core/base.css',
  'css/core/responsive.css',
  'css/core/theme.css',
  'css/screens/choices-override.css',
  'css/screens/game-tab.css',
  'css/screens/game.css',
  'css/screens/history.css',
  'css/screens/home.css',
  'css/screens/player-input.css',
  'css/screens/round-detail.css',
  'css/screens/scoreboard.css',
  'css/screens/settings.css',
  'src/components/modal.js',
  'src/components/navbar.js',
  'src/components/score-stepper.js',
  'src/core/constants.js',
  'src/core/game.js',
  'src/core/module-loader.js',
  'src/core/scoring.js',
  'src/core/settings.js',
  'src/helpers/contract-helpers.js',
  'src/helpers/dom-helpers.js',
  'src/helpers/select-dropdown-helpers.js',
  'src/screens/contract-forms.js',
  'src/screens/game-tab.js',
  'src/screens/home.js',
  'src/screens/player-input.js',
  'src/screens/round-detail.js',
  'src/screens/scoreboard.js',
  'src/screens/settings.js',
  'src/screens/trex-select.js'
];

// Font Awesome is loaded by index.html with crossorigin="anonymous", so cache it as a CORS request.
const FONT_AWESOME_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        await cache.addAll(ASSETS);
        // Optional: do not fail the install if the CDN is unreachable.
        await cache.add(new Request(FONT_AWESOME_CSS, { mode: 'cors', credentials: 'omit' })).catch(() => {});
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(request, { ignoreSearch: true });
      const network = fetch(request)
        .then(response => {
          // Cache good same-origin responses and the (CORS) Font Awesome assets.
          if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
