# TrixScore - Progressive Web App

A beautiful, fully offline-capable Progressive Web App for tracking scores in the card game **Trex**. Built with a mobile-first design philosophy, complete dark mode support, and intuitive touch-friendly controls.

![Version](https://img.shields.io/badge/version-2.0-red)
![PWA](https://img.shields.io/badge/PWA-ready-green)
![Offline](https://img.shields.io/badge/offline-capable-blue)

## ✨ Features

### Core Functionality
- **🎮 Game Modes**: Individual (4 players) and Teams (2v2) competitive modes
- **📊 Live Scoring**: Real-time round-by-round tracking with cumulative totals
- **🎯 Contract Forms**: Specialized input forms for each contract type (Trex, Queens, King, Diamonds, Tricks)
- **📜 Game History**: Persistent storage of all games with expandable round details
- **⚙️ Customizable Settings**: Edit score values for all contracts with instant preview

### User Experience
- **📱 Mobile-First**: Responsive design optimized for phones, tablets, and desktop
- **🌓 Dark Mode**: Beautiful light/dark theme toggle with smooth transitions
- **👆 Touch Optimized**: Large buttons, steppers, and gesture-friendly controls
- **⚡ Fast & Lightweight**: Minimal dependencies, vanilla JavaScript architecture
- **🔄 Progressive Enhancement**: Works offline after first load via Service Worker

### Technical Highlights
- **Modular Architecture**: Clean separation of concerns (components, screens, helpers, core)
- **Lazy Loading**: On-demand module loading for optimal performance
- **Type Documentation**: Comprehensive JSDoc comments throughout codebase
- **CSS Custom Properties**: Theming via CSS variables for easy customization
- **Zero Build Step**: Pure HTML/CSS/JS - no bundlers required

## 🎲 Game Rules

### Contracts (20 rounds total - 5 rounds per kingdom)
Each player selects one contract per round, cycling through:

1. **Trex** 👑
   - Rank players by finishing order (1st → 4th)
   - Points awarded based on placement

2. **Queens** ♕
   - Track who collected each of the 4 queens
   - Optional "doubled" bonus with toggle switch

3. **King** ♔
   - Track who collected the King of Hearts
   - Optional "doubled" bonus with toggle switch

4. **Diamonds** ♦️
   - Count diamonds collected per player (13 total)
   - Negative points per diamond

5. **Tricks** 🃏
   - Count tricks taken per player (13 total)
   - Negative points per trick

### Default Score Values

| Contract | Scoring |
|----------|---------|
| **Trex** | 1st: +200, 2nd: +150, 3rd: +100, 4th: +40 |
| **Queens** | Normal: -25, Doubled: -50, Bonus: +25 |
| **King** | Normal: -75, Doubled: -150, Bonus: +50 |
| **Diamonds** | -5 per diamond |
| **Tricks** | -10 per trick |

## 🚀 Quick Start

### Local Development
```bash
# Clone or download the repository
cd TrixScore

# Start a local server (Python 3)
python3 -m http.server 3000

# Or use PHP
php -S localhost:3000

# Or use Node.js
npx http-server -p 3000

# Open http://localhost:3000 in your browser
```

### Install as App
- **Desktop Chrome/Edge**: Click the install icon (⊕) in the address bar
- **iOS Safari**: Tap Share → Add to Home Screen
- **Android Chrome**: Tap menu (⋮) → Install App

### Deploy to Production
Simply upload all files to any static web hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any Apache/Nginx server

The app works completely offline once cached by the browser.

## 📁 Project Structure

```
TrixScore/
├── index.html                      # App entry point
├── app.js                          # Navigation & state management
├── manifest.json                   # PWA manifest
├── service-worker.js               # Offline caching
├── favicon.svg                     # App icon (King of Hearts)
│
├── AppImages/                      # Platform-specific icons
│   ├── android/                    # Android launcher icons
│   ├── ios/                        # iOS app icons
│   └── windows11/                  # Windows tile icons
│
├── css/
│   ├── core/
│   │   ├── theme.css              # CSS variables & theming
│   │   ├── base.css               # Global styles & resets
│   │   └── responsive.css         # Media queries
│   │
│   ├── components/
│   │   ├── buttons.css            # Generic button styles
│   │   ├── switch.css             # Toggle switch component
│   │   ├── inputs.css             # Form inputs
│   │   ├── stepper.css            # Number stepper
│   │   ├── modal.css              # Modal dialogs
│   │   ├── navbar.css             # Navigation bar
│   │   ├── tabs.css               # Tab navigation
│   │   ├── table.css              # Data tables
│   │   ├── picker.css             # List picker component
│   │   ├── contract-form.css      # Contract input forms
│   │   ├── button-pair.css        # Two-button layouts
│   │   ├── detail-row.css         # Detail view rows
│   │   └── form-group.css         # Form grouping
│   │
│   └── screens/
│       ├── home.css               # Home screen
│       ├── game-tab.css           # Active game view
│       ├── scoreboard.css         # Score display
│       ├── round-detail.css       # Round details
│       ├── player-input.css       # Player name entry
│       ├── settings.css           # Settings screen
│       ├── history.css            # Game history
│       └── choices-override.css   # Choices.js theming
│
└── src/
    ├── components/
    │   ├── modal.js               # Modal component class
    │   ├── navbar.js              # Navbar component class
    │   └── score-stepper.js       # Number stepper component
    │
    ├── core/
    │   ├── constants.js           # Game constants (GAME_CONFIG)
    │   ├── settings.js            # Settings persistence
    │   ├── scoring.js             # Scoring calculation engine
    │   ├── game.js                # Game history management
    │   └── module-loader.js       # Lazy module loading
    │
    ├── helpers/
    │   ├── dom-helpers.js         # DOM creation utilities
    │   ├── contract-helpers.js    # Contract form builders
    │   └── select-dropdown-helpers.js  # Dropdown components
    │
    └── screens/
        ├── home.js                # Home screen view
        ├── trex-select.js         # Game mode selection
        ├── player-input.js        # Player name input
        ├── game-tab.js            # Active game interface
        ├── contract-forms.js      # Contract form wrappers
        ├── scoreboard.js          # Score table view
        ├── round-detail.js        # Round detail view
        ├── settings.js            # Settings UI
        └── history.js             # Game history view
```

## 🎯 Usage Guide

### Starting a New Game
1. **Choose Game Mode**: Tap "Trex" on the home screen
2. **Select Format**: Choose Individual (4 players) or Teams (2v2)
3. **Enter Names**: Input 4 player names (or 4 team names)
4. **Begin Scoring**: You're ready to track scores!

### Scoring a Contract
Each contract has a specialized input form:

- **Trex**: Drag-and-drop or select finishing order (1st through 4th)
- **Queens**: Select who ate each queen, toggle "Doubled" switch if applicable
- **King**: Select who ate the king, toggle "Doubled" switch if applicable  
- **Diamonds**: Use steppers to set diamond count per player (max 13 total)
- **Tricks**: Use steppers to set trick count per player (max 13 total)

### Navigating the Game
- **Game Tab**: Current round contract input
- **Scoreboard Tab**: Live cumulative scores
- **Past Rounds Tab**: Review all completed rounds with expandable details
- **Settings**: Access via top-right gear icon

### Viewing Results
- Tap any completed round in "Past Rounds" to see detailed scoring breakdown
- Final scores appear in the Scoreboard after all 20 rounds
- Game automatically saves to History upon completion

## ⚙️ Customization

### Editing Score Values
1. Tap the **Settings** icon (⚙️) in the top-right
2. Scroll to **Game Settings**
3. Expand any contract to edit point values
4. Changes save automatically and apply to new games

### Theme Customization
Toggle between Light and Dark modes in Settings. Theme preference persists across sessions.

### Advanced: CSS Variables
Edit `css/core/theme.css` to customize colors:

```css
:root {
  --color-bg: #F8F8F8;           /* Background */
  --color-primary: #C62020;      /* Primary red */
  --color-accent: #8A8F9D;       /* Accent gray */
  --color-danger: #fd0000;       /* Danger red */
  --color-success: #70e000;      /* Success green */
  --color-text: #F8F8F8;         /* Text color */
  --color-card: #C62020;         /* Card background */
  --color-border: #0B132B;       /* Border color */
}
```

## 💾 Data & Privacy

- **100% Local**: All data stored in browser's `localStorage`
- **Zero Tracking**: No analytics, cookies, or external requests
- **Offline-First**: Works without internet after initial load
- **Privacy-Focused**: Your game data never leaves your device
- **Clear Data**: Reset everything by clearing browser cache/storage

## 🌐 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome / Edge | 40+ |
| Firefox | 44+ |
| Safari (iOS) | 11+ |
| Samsung Internet | 4+ |

**Note**: Service Worker support required for offline functionality.

## 🛠️ Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with Custom Properties
- **State**: Global state object with pub/sub pattern
- **Storage**: localStorage for persistence
- **PWA**: Service Worker + Web Manifest
- **Components**: Custom reusable classes (Modal, Navbar, ScoreStepper)
- **Lazy Loading**: Dynamic module imports for performance
- **Icons**: Font Awesome 6.4.0 (CDN)
- **Dropdowns**: Choices.js for enhanced selects

## 🚧 Roadmap

### Planned Features
- [ ] Trex Complex mode (40+ rounds)
- [ ] Game statistics and analytics dashboard
- [ ] Player rating system
- [ ] Export game data (JSON/CSV)
- [ ] Undo/redo round scoring
- [ ] Sound effects toggle
- [ ] Animation preferences
- [ ] Multiple language support

### Experimental
- [ ] Optional cloud sync (Firebase)
- [ ] Online multiplayer with WebRTC
- [ ] Alternative rule sets

## 🤝 Contributing

Contributions welcome! This is an open-source project.

### Development Guidelines
- Follow existing code style (JSDoc comments, modular structure)
- Test on mobile devices
- Ensure dark mode compatibility
- Maintain offline-first functionality

## 📄 License

Open source - free to use, modify, and distribute.

---

**Built with ❤️ for Trex enthusiasts**

*For questions, issues, or feature requests, please open an issue on the repository.*