// src/screens/round-detail.js - Round detail screen rendering
// Shows per-contract detail for a given round

(function() {
  function renderRoundDetailScreenView({ state, pushScreen, goBack }) {
    const wrap = document.createElement('div');
    wrap.className = 'screen';
    
    const playerCount = state.game && state.game.players ? state.game.players.length : GAME_CONFIG.PLAYERS;
    const roundNum = state.roundIdx + 1;
    const kingdom = Math.floor(state.roundIdx / GAME_CONFIG.ROUNDS_PER_KINGDOM) + 1;
    const playerIdx = (state.roundIdx % playerCount);
    const playerName = state.game && state.game.players ? state.game.players[playerIdx] : `Player ${playerIdx + 1}`;
    
    wrap.appendChild(new Navbar({
      title: 'Round Details',
      left: 'back',
      onBack: () => goBack(),
      onSettings: () => pushScreen('settings'),
      onHistory: () => pushScreen('history')
    }).render());
    
    const content = document.createElement('div');
    content.className = 'round-detail-content';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'round-detail-header';
    const kingdomDiv = document.createElement('div');
    kingdomDiv.className = 'round-detail-kingdom';
    kingdomDiv.innerHTML = `Kingdom ${kingdom} — ${playerName}`;
    headerDiv.appendChild(kingdomDiv);
    const roundDiv = document.createElement('div');
    roundDiv.className = 'round-detail-round-number';
    roundDiv.textContent = `Round ${roundNum}/20`;
    headerDiv.appendChild(roundDiv);
    content.appendChild(headerDiv);

    const roundScores = state.game.roundScores[state.roundIdx];
    if (!roundScores || roundScores.length === 0) {
      const msg = document.createElement('div');
      msg.className = 'round-detail-no-data';
      msg.textContent = 'No data for this round.';
      content.appendChild(msg);
      wrap.appendChild(content);
      return wrap;
    }

    roundScores.forEach(entry => {
      const section = document.createElement('div');
      section.className = 'contract-section';
      const contractTitle = document.createElement('div');
      contractTitle.className = 'contract-title';
      contractTitle.textContent = entry.contract;
      section.appendChild(contractTitle);
      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'contract-details';
      
      if (entry.contract === 'Trex' && entry.details && entry.details.order) {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'trex-order-title';
        orderDiv.innerHTML = 'Finishing Order:';
        detailsDiv.appendChild(orderDiv);
        entry.details.order.forEach((pIdx, place) => {
          const line = document.createElement('div');
          line.className = 'trex-order-item';
          line.textContent = `${place + 1}${['st', 'nd', 'rd', 'th'][place] || 'th'}: ${state.game.players[pIdx]}`;
          detailsDiv.appendChild(line);
        });
      } else if (entry.contract === 'Queens' && entry.details && entry.details.queensData) {
        entry.details.queensData.forEach((q, qIdx) => {
          if (q && q.eater !== undefined && q.eater >= 0) {
            const qDiv = document.createElement('div');
            qDiv.className = 'detail-card';
            let text = `<span class="detail-card-title">Queen ${qIdx + 1}:</span> ${state.game.players[q.eater]}`;
            if (q.doubled) {
              text += ' <span class="detail-doubled">(Doubled)</span>';
              if (q.doubledPlayers && q.doubledPlayers.length > 0) {
                text += `<br><span class="detail-bonus">Bonus to: ${q.doubledPlayers.map(p => state.game.players[p]).join(', ')}</span>`;
              }
            }
            qDiv.innerHTML = text;
            detailsDiv.appendChild(qDiv);
          }
        });
      } else if (entry.contract === 'King' && entry.details) {
        const kDiv = document.createElement('div');
        kDiv.className = 'detail-card';
        let text = `<span class="detail-card-title">King eaten by:</span> ${state.game.players[entry.details.eater]}`;
        if (entry.details.doubled) {
          text += ' <span class="detail-doubled">(Doubled)</span>';
          if (entry.details.doubledPlayers && entry.details.doubledPlayers.length > 0) {
            text += `<br><span class="detail-bonus">Bonus to: ${entry.details.doubledPlayers.map(p => state.game.players[p]).join(', ')}</span>`;
          }
        }
        kDiv.innerHTML = text;
        detailsDiv.appendChild(kDiv);
      } else if (entry.contract === 'Diamonds' && entry.details && entry.details.counts) {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'count-table';
        entry.details.counts.forEach((count, pIdx) => {
          const line = document.createElement('div');
          line.className = 'count-item';
          const nameSpan = document.createElement('span');
          nameSpan.className = 'count-player-name';
          nameSpan.textContent = state.game.players[pIdx];
          line.appendChild(nameSpan);
          const countSpan = document.createElement('span');
          countSpan.className = 'count-value';
          countSpan.textContent = `${count} diamonds`;
          line.appendChild(countSpan);
          tableDiv.appendChild(line);
        });
        detailsDiv.appendChild(tableDiv);
      } else if (entry.contract === 'Tricks' && entry.details && entry.details.counts) {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'count-table';
        entry.details.counts.forEach((count, pIdx) => {
          const line = document.createElement('div');
          line.className = 'count-item';
          const nameSpan = document.createElement('span');
          nameSpan.className = 'count-player-name';
          nameSpan.textContent = state.game.players[pIdx];
          line.appendChild(nameSpan);
          const countSpan = document.createElement('span');
          countSpan.className = 'count-value';
          countSpan.textContent = `${count} tricks`;
          line.appendChild(countSpan);
          tableDiv.appendChild(line);
        });
        detailsDiv.appendChild(tableDiv);
      }
      
      section.appendChild(detailsDiv);
      const scoresTitle = document.createElement('div');
      scoresTitle.className = 'scores-section-title';
      scoresTitle.textContent = 'Scores:';
      section.appendChild(scoresTitle);
      const scoresDiv = document.createElement('div');
      entry.scores.forEach((s, j) => {
        const line = document.createElement('div');
        line.className = 'score-item';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'score-player-name';
        nameSpan.textContent = state.game.players[j];
        line.appendChild(nameSpan);
        const scoreSpan = document.createElement('span');
        scoreSpan.className = `score-value ${s >= 0 ? 'positive' : 'negative'}`;
        scoreSpan.textContent = s >= 0 ? `+${s}` : s;
        line.appendChild(scoreSpan);
        scoresDiv.appendChild(line);
      });
      section.appendChild(scoresDiv);
      content.appendChild(section);
    });

    wrap.appendChild(content);
    return wrap;
  }

  window.renderRoundDetailScreenView = renderRoundDetailScreenView;
})();
