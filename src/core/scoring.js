/**
 * @file scoring.js - Game scoring calculations for all contract types
 * PURPOSE: Calculate scores for each contract type (Trex, Queens, King, Diamonds, Tricks)
 * based on player inputs and game settings. All scoring logic is centralized here.
 */

// Reference to contract names - loaded from constants.js which must be loaded first
const CONTRACTS = CONTRACT_NAMES;

/**
 * Get the scoring values for all contracts based on current game settings.
 * Creates a mapping of contract name to scoring configuration.
 *
 * @param {Object} settings - User settings object (from loadSettings)
 * @param {Object} settings.trex - Trex scoring: {first, second, third, last}
 * @param {Object} settings.queens - Queens scoring: {normal, doubled, plus}
 * @param {Object} settings.king - King scoring: {normal, doubled, plus}
 * @param {number} settings.diamonds.value - Points per diamond
 * @param {number} settings.tricks.value - Points per trick
 *
 * @returns {Object} Scores object with contract names as keys
 */
function getDefaultScores(settings) {
  return {
    Trex: [settings.trex.first, settings.trex.second, settings.trex.third, settings.trex.last],
    Queens: { normal: settings.queens.normal, doubled: settings.queens.doubled, plus: settings.queens.plus },
    King: { normal: settings.king.normal, doubled: settings.king.doubled, plus: settings.king.plus },
    Diamonds: settings.diamonds.value,
    Tricks: settings.tricks.value
  };
}

/**
 * Calculate scores for Trex contract (finishing order).
 * Points are assigned based on finishing positions (1st=high, Last=low).
 * Team mode: Team of 1st place player vs team of last place player.
 *
 * @param {Array<number>} order - Player indices in finishing order [1st, 2nd, 3rd, Last]
 * @param {Object} settings - User settings (must contain settings.trex values)
 *
 * @returns {Array<number>} Scores for each player [p0, p1, p2, p3]
 */
function calculateTrexOrderScores(order, settings) {
  // Map finishing positions to points
  const vals = [settings.trex.first, settings.trex.second, settings.trex.third, settings.trex.last];
  const scores = Array(order.length).fill(0);
  // Assign points to each player based on their finishing position
  order.forEach((playerIdx, i) => { scores[playerIdx] = vals[i]; });
  return scores;
}

/**
 * Calculate scores for Queens contract (4 queens, max 1 per player).
 * Queens contract is complex due to doubled penalties and bonus points.
 * Team vs Individual modes have different doubling rules.
 *
 * @param {Array<number>} queens - Player index who ate each queen [0-3]
 * @param {Array<boolean>} doubled - Whether each queen was doubled [4 booleans]
 * @param {Object} settings - User settings with queens scoring config
 * @param {Object} [doubledInfo=null] - Info about which queen was doubled
 * @param {boolean} teamMode - True if team game (0,2 vs 1,3), false if individual
 *
 * @returns {Array<number>} Scores for each player [p0, p1, p2, p3]
 */
function calculateQueensScores(queens, doubled, settings, doubledInfo, teamMode) {
  const scores = Array(4).fill(0);
  for (let i = 0; i < 4; ++i) {
    const eater = queens[i];
    if (doubled[i]) {
      // Doubled queen: eater gets doubled points, doubler gets bonus points
      if (doubledInfo && doubledInfo.queenIdx === i) {
        const { doublerIdx, receiverIdx } = doubledInfo;
        if (teamMode) {
          // Team mode: bonus split among team members
          if (sameTeam(doublerIdx, eater)) {
            scores[eater] += settings.queens.doubled;
            scores[doublerIdx] += settings.queens.plus;
          } else {
            scores[eater] += settings.queens.doubled;
            // Split bonus among eater's teammates
            [0,1,2,3].forEach(idx => { if (sameTeam(idx, doublerIdx)) scores[idx] += Math.floor(settings.queens.plus/2); });
          }
        } else {
          // Individual mode: bonus goes to selected player
          scores[eater] += settings.queens.doubled;
          scores[receiverIdx] += settings.queens.plus;
        }
      }
    } else {
      // Normal queen: just penalize the eater
      scores[eater] += settings.queens.normal;
    }
  }
  return scores;
}

/**
 * Calculate scores for King contract (1 king eaten).
 * King is always a high penalty, potentially doubled with bonus points for doubler.
 *
 * @param {number} eater - Player index who ate the King
 * @param {boolean} doubled - Whether the King was doubled
 * @param {Object} settings - User settings with king scoring config
 * @param {Object} [doubledInfo=null] - Info about doubler and bonus receiver
 * @param {boolean} teamMode - True if team game, false if individual
 *
 * @returns {Array<number>} Scores for each player [p0, p1, p2, p3]
 */
function calculateKingScores(eater, doubled, settings, doubledInfo, teamMode) {
  const scores = Array(4).fill(0);
  if (doubled) {
    if (doubledInfo) {
      const { doublerIdx, receiverIdx } = doubledInfo;
      if (teamMode) {
        if (sameTeam(doublerIdx, eater)) {
          scores[eater] += settings.king.doubled;
          scores[doublerIdx] += settings.king.plus;
        } else {
          scores[eater] += settings.king.doubled;
          [0,1,2,3].forEach(idx => { if (sameTeam(idx, doublerIdx)) scores[idx] += Math.floor(settings.king.plus/2); });
        }
      } else {
        scores[eater] += settings.king.doubled;
        scores[receiverIdx] += settings.king.plus;
      }
    }
  } else {
    scores[eater] += settings.king.normal;
  }
  return scores;
}

/**
 * Calculate scores for Diamonds contract.
 * Penalty is applied per diamond claimed by each player.
 *
 * @param {Array<number>} diamonds - Number of diamonds claimed by each player [0-13]
 * @param {Object} settings - User settings (must contain settings.diamonds.value)
 *
 * @returns {Array<number>} Scores for each player [p0, p1, p2, p3]
 */
function calculateDiamondsScores(diamonds, settings) {
  return diamonds.map(n => n * settings.diamonds.value);
}

/**
 * Calculate scores for Tricks contract.
 * Penalty is applied per trick claimed by each player.
 *
 * @param {Array<number>} tricks - Number of tricks claimed by each player [0-13]
 * @param {Object} settings - User settings (must contain settings.tricks.value)
 *
 * @returns {Array<number>} Scores for each player [p0, p1, p2, p3]
 */
function calculateTricksScores(tricks, settings) {
  return tricks.map(n => n * settings.tricks.value);
}

/**
 * Determine if two players are on the same team.
 * Team structure: Players 0,2 are on one team; Players 1,3 are on the other.
 * This is used for team-mode bonus calculations.
 *
 * @param {number} a - Player index (0-3)
 * @param {number} b - Player index (0-3)
 *
 * @returns {boolean} True if both players are on the same team
 */
function sameTeam(a, b) {
  // Check if both have same parity (both even or both odd)
  return (a % 2) === (b % 2);
}

// Export scoring functions to window for use by other modules

window.calculateDiamondsScores = calculateDiamondsScores;
window.calculateTricksScores = calculateTricksScores;
window.sameTeam = sameTeam;
