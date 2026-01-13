/**
 * @file settings.js - Settings persistence and theme management
 * PURPOSE: Manage user settings (dark mode, game scoring values) stored in browser localStorage.
 * This is a CORE MODULE - only settings logic, no UI rendering (UI is in src/screens/settings.js).
 */

/**
 * Default settings object with all game scoring values.
 * Any scoring customization by the user extends/overwrites these defaults.
 * Score values are negative for penalties, positive for bonuses.
 *
 * @constant {Object} DEFAULT_SETTINGS
 * @property {boolean} darkMode - Whether dark theme is enabled
 * @property {Object} trex - Trex contract points: {first, second, third, last}
 * @property {Object} queens - Queens contract points: {normal, doubled, plus}
 * @property {Object} king - King contract points: {normal, doubled, plus}
 * @property {Object} diamonds - Diamonds penalty per diamond: {value}
 * @property {Object} tricks - Tricks penalty per trick: {value}
 */
const DEFAULT_SETTINGS = {
  darkMode: false,
  trex: { first: 200, second: 150, third: 100, last: 40 },
  queens: { normal: -25, doubled: -50, plus: 25 },
  king: { normal: -75, doubled: -150, plus: 50 },
  diamonds: { value: -5 },
  tricks: { value: -10 }
};

/**
 * Load settings from browser localStorage.
 * Merges stored settings with DEFAULT_SETTINGS to handle missing keys gracefully.
 * If localStorage is corrupt or empty, returns defaults.
 *
 * @returns {Object} Settings object (defaults merged with stored values)
 */
function loadSettings() {
  let s = localStorage.getItem('trix_settings');
  if (!s) return { ...DEFAULT_SETTINGS };
  try {
    // Parse stored JSON and merge with defaults
    s = JSON.parse(s);
    return { ...DEFAULT_SETTINGS, ...s };
  } catch {
    // If JSON parse fails, return defaults (localStorage was corrupted)
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save settings object to browser localStorage as JSON.
 * Settings persist across browser sessions.
 *
 * @param {Object} settings - Settings object to save
 * @returns {void}
 */
function saveSettings(settings) {
  localStorage.setItem('trix_settings', JSON.stringify(settings));
}

/**
 * Apply theme (light/dark) by setting HTML data-theme attribute.
 * CSS uses [data-theme="dark"] selectors to apply dark mode styles.
 *
 * @param {boolean} dark - True for dark theme, false for light
 * @returns {void}
 */
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

// Export to window for global access from other modules

window.loadSettings = loadSettings;
window.saveSettings = saveSettings;
window.applyTheme = applyTheme;
