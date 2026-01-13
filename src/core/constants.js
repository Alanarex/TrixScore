/**
 * @file constants.js - Game configuration and immutable game parameters
 * PURPOSE: Centralize all magic numbers and game configuration in one place
 * to avoid hardcoding values throughout the codebase. This makes the game easy to extend
 * (e.g., changing from 4 to 6 players would only require updating values here).
 */

/**
 * Game configuration constants.
 * These values define the core game mechanics and structure.
 * Modify these to change game rules (e.g., PLAYERS: 6 for 6-player games).
 *
 * @constant {Object} GAME_CONFIG
 * @property {number} PLAYERS=4 - Number of players in each game
 * @property {number} KINGDOMS=4 - Number of kingdoms (contract types that cycle)
 * @property {number} ROUNDS_PER_KINGDOM=5 - Number of rounds per kingdom before advancing
 * @property {number} TOTAL_ROUNDS=20 - Total rounds in a complete game (KINGDOMS × ROUNDS_PER_KINGDOM)
 * @property {number} DIAMONDS_TOTAL=13 - Maximum diamonds that can be distributed in a round
 * @property {number} TRICKS_TOTAL=13 - Maximum tricks that can be distributed in a round
 */
const GAME_CONFIG = {
  PLAYERS: 4,
  KINGDOMS: 4,
  ROUNDS_PER_KINGDOM: 5,
  TOTAL_ROUNDS: 20,
  DIAMONDS_TOTAL: 13,
  TRICKS_TOTAL: 13
};

/**
 * Array of all contract type names in order.
 * Used throughout the app to reference contract types and ensure consistency.
 * The first contract (Trex) is always round 0, Queens round 1, etc.
 *
 * @constant {Array<string>} CONTRACT_NAMES - ['Trex', 'Queens', 'King', 'Diamonds', 'Tricks']
 */
const CONTRACT_NAMES = ['Trex', 'Queens', 'King', 'Diamonds', 'Tricks'];

// Export to global scope for use in all scripts
window.GAME_CONFIG = GAME_CONFIG;
window.CONTRACT_NAMES = CONTRACT_NAMES;
