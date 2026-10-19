# CLAUDE.md

## Stack
- Vanilla JavaScript (ES6+), HTML, CSS custom properties. No package.json, no bundler, no framework.
- Font Awesome 6.4.0 from cdnjs (with SRI). PWA: `manifest.json` + `service-worker.js`.
- Hosted on GitHub Pages: https://alanarex.github.io/TrixScore/

## Structure
- `index.html` loads every script with plain `<script>` tags; files share state via `window` globals (`state`, `GAME_CONFIG`, ...). Script order in `index.html` matters.
- `app.js`: navigation and global state. `src/core/` (constants, game, scoring, settings), `src/components/`, `src/helpers/`, `src/screens/`, `css/core|components|screens/`.
- `src/core/module-loader.js` is currently empty.

## Commands
- Dev: `python3 -m http.server 3000` or `npx http-server -p 3000`, open http://localhost:3000
- Build, lint, tests: none
- After changing the asset list, bump `CACHE_NAME` in `service-worker.js` and update its `ASSETS` array.

## Conventions
- JSDoc comments on functions; one CSS file per component/screen.
- Any user-controlled text put into an HTML string must go through `escapeHtml()` (`src/helpers/dom-helpers.js`); prefer `textContent`.
- Default branch is `main`. Work on `refresh/<topic>` branches and open a PR; never commit directly to `main`.
- No secrets in the repo. No history rewrite or force push without explicit approval. Do not alter commit dates or authors.

## Known issues
- No automated tests and no quality CI (the existing workflows only automate issues).
- The service worker's offline behaviour was not verified end to end in a real browser.
