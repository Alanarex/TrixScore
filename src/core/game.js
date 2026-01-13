/**
 * @file game.js - Game history persistence and history screen rendering
 * PURPOSE: Save completed games to localStorage and render the game history screen.
 * Also handles loading past games for review.
 */

/**
 * Save a completed game to browser localStorage history.
 * Game is appended to the existing history array.
 *
 * @param {Object} game - Completed game object containing:
 *   - date: Date string or timestamp
 *   - players: Array of player names
 *   - totals: Array of final scores for each player
 *   - roundScores: Array of round-by-round score details
 *   - rounds: Array of round contract/score data
 * @returns {void}
 */
function saveGameHistory(game) {
  // Load existing history, append new game, save back
  let history = JSON.parse(localStorage.getItem('trix_history') || '[]');
  history.push(game);
  localStorage.setItem('trix_history', JSON.stringify(history));
}

/**
 * Load all completed games from browser localStorage history.
 *
 * @returns {Array<Object>} Array of completed game objects (empty array if none exist)
 */
function loadGameHistory() {
  return JSON.parse(localStorage.getItem('trix_history') || '[]');
}

/**
 * Render the Game History screen showing all past games with scores and details.
 *
 * @param {Object} params - Screen parameters
 * @param {Function} params.onBack - Callback when back button is clicked
 * @param {Function} params.onSettings - Callback when settings button is clicked
 *
 * @returns {HTMLElement} The complete history screen element
 */
function renderHistoryScreen({ onBack, onSettings }) {
  const wrap = document.createElement('div');
  wrap.className = 'screen history-screen';
  wrap.appendChild(new Navbar({ title: 'Game History', left: 'back', onBack, onSettings }).render());
  const history = loadGameHistory();
  
  // Show empty state if no games played
  if (!history.length) {
    const empty = document.createElement('div');
    empty.className = 'history-empty';
    empty.textContent = 'No games played yet.';
    wrap.appendChild(empty);
    return wrap;
  }
  
  // Create list of games in reverse chronological order (newest first)
  const historyList = document.createElement('div');
  historyList.className = 'history-list';
  history.slice().reverse().forEach(game => {
    const card = document.createElement('div');
    card.className = 'history-card';
    
    // Game date/time
    const date = document.createElement('div');
    date.className = 'history-date';
    date.textContent = new Date(game.date).toLocaleString();
    card.appendChild(date);
    
    // Player names
    const players = document.createElement('div');
    players.className = 'history-players';
    players.textContent = 'Players: ' + game.players.join(', ');
    card.appendChild(players);
    
    // Final scores
    const result = document.createElement('div');
    result.className = 'history-result';
    result.textContent = 'Final: ' + game.totals.map(t => t).join(' / ');
    card.appendChild(result);
    
    // Expandable section with round-by-round score breakdown
    const scores = document.createElement('details');
    scores.className = 'history-scores';
    scores.innerHTML = '<summary>Show Scores</summary>';
    if (game.roundScores && game.roundScores.length) {
      game.roundScores.forEach((roundData, roundIdx) => {
        const rd = document.createElement('div');
        rd.className = 'history-round';
        rd.textContent = `Round ${roundIdx+1}:`;
        scores.appendChild(rd);
        roundData.forEach(entry => {
          const line = document.createElement('div');
          line.className = 'history-round-entry';
          line.textContent = `${game.players[entry.player]} (${entry.contract}): ${entry.scores.join('/')}`;
          scores.appendChild(line);
        });
      });
    }
    card.appendChild(scores);
    historyList.appendChild(card);
  });
  wrap.appendChild(historyList);
  return wrap;
}

window.saveGameHistory = saveGameHistory;
window.loadGameHistory = loadGameHistory;
window.renderHistoryScreen = renderHistoryScreen;
