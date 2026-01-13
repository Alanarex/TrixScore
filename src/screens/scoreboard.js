// src/screens/scoreboard.js - Scoreboard screen rendering
// Renders team and individual scoreboards using shared DOM helpers

(function() {
  /**
   * Render round rows for scoreboard (shared by team and individual modes)
   * @param {Array} roundScores - Round scores data
   * @param {Function} onDetail - Click handler for detail button
   * @returns {Array<HTMLElement>} Array of table rows
   */
  function renderRoundRows(roundScores, onDetail) {
    const rows = [];
    roundScores.forEach((roundScores, roundIdx) => {
      if (!roundScores || roundScores.length === 0) return;
      const roundPlayerScores = [0, 0, 0, 0];
      roundScores.forEach(entry => {
        for (let i = 0; i < 4; i++) {
          roundPlayerScores[i] += entry.scores[i];
        }
      });
      const maxScore = Math.max(...roundPlayerScores);
      const minScore = Math.min(...roundPlayerScores);
      const scoreRow = createElement('tr');
      scoreRow.appendChild(createElement('td', {
        className: 'scoreboard-round-cell',
        text: String(roundIdx + 1)
      }));
      for (let i = 0; i < 4; i++) {
        scoreRow.appendChild(createScoreCell(roundPlayerScores[i], maxScore, minScore));
      }
      scoreRow.appendChild(createActionCell(() => onDetail(roundIdx)));
      rows.push(scoreRow);
    });
    return rows;
  }

  function renderScoreboardScreen({ state, pushScreen }) {
    const div = createElement('div', {
      className: 'screen scoreboard-container'
    });
    
    const title = createElement('div', {
      className: 'scoreboard-title',
      text: 'Scores by Round'
    });
    div.appendChild(title);
    
    const table = createElement('table', {
      className: 'scoreboard-table'
    });
    
    // Build table based on game mode
    if (state.game.teamMode) {
      table.appendChild(createScoreboardTeamHeader(state.game.players));
      table.appendChild(createScoreboardPlayerNameRow(state.game.players));
      
      if (state.game.roundScores && state.game.roundScores.length) {
        const rows = renderRoundRows(state.game.roundScores, (roundIdx) => pushScreen('round-detail', { roundIdx }));
        rows.forEach(row => table.appendChild(row));
        
        const totals = state.game.totals || [0, 0, 0, 0];
        table.appendChild(createTotalRow('Total', totals, { actionCell: true }));
        const teamTotals = [totals[0] + totals[1], totals[2] + totals[3]];
        table.appendChild(createTotalRow('Total (Team)', teamTotals, { colSpans: [2, 2], actionCell: true }));
      }
    } else {
      table.appendChild(createScoreboardIndividualHeader(state.game.players));
      
      if (state.game.roundScores && state.game.roundScores.length) {
        const rows = renderRoundRows(state.game.roundScores, (roundIdx) => pushScreen('round-detail', { roundIdx }));
        rows.forEach(row => table.appendChild(row));
        
        const totals = state.game.totals || [0, 0, 0, 0];
        table.appendChild(createTotalRow('Total', totals, { actionCell: true }));
      }
    }
    
    div.appendChild(table);
    return div;
  }
  
  window.renderScoreboardScreen = renderScoreboardScreen;
})();
