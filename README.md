# TrixScore

> A mobile-first Progressive Web App to keep score in the card game **Trex**, written in vanilla JavaScript with no build step.

[Live demo](https://alanarex.github.io/TrixScore/)

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-custom_properties-1572B6?logo=css3&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8)
![License](https://img.shields.io/badge/license-MIT-green)

**Résumé (FR)** : application web progressive (PWA) pour compter les points au Trex (jeu de cartes à 4 joueurs). Saisie par contrat, mode individuel ou par équipes, historique des parties, barèmes modifiables, thème clair/sombre. JavaScript pur, sans outil de build ; les données sont stockées dans le navigateur (`localStorage`).

## Features

- Individual (4 players) and team (2 vs 2) modes.
- Dedicated input form for each contract: Trex, Queens, King, Diamonds, Tricks.
- Live scoreboard with cumulative totals and per-round details.
- Game history saved in `localStorage` (key `trix_history`).
- Editable score values with defaults restored on demand.
- Light / dark theme, touch-friendly steppers and pickers.
- Installable PWA with an offline-capable service worker.

## Game rules implemented

A game has 20 rounds: 4 kingdoms of 5 rounds, each round played with one contract.

| Contract | Default scoring |
|---|---|
| Trex | 1st +200, 2nd +150, 3rd +100, 4th +50 |
| Queens | normal -25, doubled -50, bonus +25 |
| King | normal -75, doubled -150, bonus +50 |
| Diamonds | -5 per diamond (13 total) |
| Tricks | -10 per trick (13 total) |

All values are editable in Settings (`src/core/settings.js` holds the defaults).

## Architecture

Plain `<script>` tags loaded from `index.html`, sharing state through globals (no bundler, no framework).

```
index.html, app.js      # entry point, navigation and global state
src/core/               # constants, game history, scoring, settings
src/components/         # Modal, Navbar, ScoreStepper
src/helpers/            # DOM helpers (incl. escapeHtml), contract forms, pickers
src/screens/            # home, player input, scoreboard, round detail, settings...
css/{core,components,screens}/
service-worker.js       # offline cache, manifest.json for install
```

## Run locally

No install needed. Serve the folder with any static server:

```sh
python3 -m http.server 3000     # or: npx http-server -p 3000
```

Then open http://localhost:3000. Service workers only work on `localhost` or HTTPS.

## Tests

No automated tests yet (see the open issues).

## What it demonstrates

- A complete app in framework-free JavaScript, organised in modules by responsibility.
- Business-rule scoring logic (individual and team modes, doubling and bonuses).
- PWA fundamentals: manifest, installability, service worker caching.
- Mobile-first UI with theming through CSS variables.

## License

MIT, see [LICENSE](LICENSE).
