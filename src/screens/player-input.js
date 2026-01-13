// src/screens/player-input.js - Player name input screen

(function() {
  function renderPlayerInputScreenView({ state, goBack, pushScreen }) {
    const wrap = document.createElement('div');
    wrap.className = 'screen';
    wrap.appendChild(new Navbar({
      title: state.teamMode ? 'Teams' : 'Players',
      left: 'back',
      onBack: () => goBack(),
      onSettings: () => pushScreen('settings'),
      onHistory: () => pushScreen('history')
    }).render());
    
    const form = document.createElement('form');
    form.className = 'player-input-form';
    form.onsubmit = e => {
      e.preventDefault();
      const names = Array.from(form.querySelectorAll('input')).map(i => i.value.trim()).filter(Boolean);
      if (names.length === GAME_CONFIG.PLAYERS) {
        const gameState = {
          players: names,
          teamMode: state.teamMode,
          rounds: [],
          totals: Array(GAME_CONFIG.PLAYERS).fill(0),
          roundScores: Array(GAME_CONFIG.TOTAL_ROUNDS).fill(null).map(() => [])
        };
        pushScreen('game', { 
          game: gameState, 
          currentRound: 0, 
          selectedContract: null,
          usedContracts: [],
          tab: 'game' 
        });
      }
    };
    
    for (let i = 0; i < GAME_CONFIG.PLAYERS; ++i) {
      // Add team headers in team mode
      if (state.teamMode && i === 0) {
        form.appendChild(createTeamHeader('Team 1', true));
      }
      if (state.teamMode && i === 2) {
        form.appendChild(createTeamHeader('Team 2', false));
      }
      
      form.appendChild(createInputGroup(
        `Player ${i+1}`,
        'text',
        {
          required: true,
          maxLength: 16,
          placeholder: 'Name',
          attrs: { autocomplete: 'off' }
        }
      ));
    }
    
    const startBtn = createButton('Start Game', {
      className: 'btn btn-primary',
      onClick: () => form.onsubmit({ preventDefault: () => {} })
    });
    startBtn.type = 'submit';
    form.appendChild(startBtn);
    wrap.appendChild(form);
    return wrap;
  }

  window.renderPlayerInputScreenView = renderPlayerInputScreenView;
})();
