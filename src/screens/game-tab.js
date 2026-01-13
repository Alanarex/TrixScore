// src/screens/game-tab.js - Game tab content rendering
// Builds the contract selection and contract forms area inside the Game screen

(function() {
  function renderGameTabContentView({
    state,
    render,
    advanceRound,
    submitContractScore,
    renderTrexScreen,
    renderQueensScreen,
    renderKingScreen,
    renderDiamondsScreen,
    renderTricksScreen
  }) {
    const div = document.createElement('div');
    div.className = 'screen game-tab-container';
    
    // Round info
    const progress = document.createElement('div');
    progress.className = 'game-tab-progress';
    const playerCount = state.game && state.game.players ? state.game.players.length : GAME_CONFIG.PLAYERS;
    const currentRoundNum = state.currentRound + 1; // 1-20
    const currentKingdom = Math.floor(state.currentRound / GAME_CONFIG.ROUNDS_PER_KINGDOM) + 1; // 1-4
    const currentPlayerIdx = (state.currentRound % playerCount);
    const currentPlayerName = state.game && state.game.players ? state.game.players[currentPlayerIdx] : `Player ${currentPlayerIdx + 1}`;
    
    const roundDiv = createElement('div', {
      className: 'game-tab-progress-wrapper',
      html: `<div class="game-tab-progress-title">Kingdom ${currentKingdom} — ${currentPlayerName}</div><div class="game-tab-progress-subtitle">Round ${currentRoundNum}/20</div>`
    });
    progress.appendChild(roundDiv);
    div.appendChild(progress);

    const form = document.createElement('div');
    form.className = 'game-tab-form';

    // Dropdown for contract selection
    const selectLabel = createElement('div', {
      className: 'game-select-label',
      text: 'Select Game Mode:'
    });
    form.appendChild(selectLabel);

    const availableContracts = CONTRACTS.filter(c => !state.usedContracts.includes(c));
    
    if (availableContracts.length === 0) {
      const msg = createElement('div', {
        className: 'input game-all-complete-msg',
        text: 'All modes complete!'
      });
      form.appendChild(msg);
      
      const nextBtn = createButton(state.currentRound >= GAME_CONFIG.TOTAL_ROUNDS - 1 ? 'Finish Game' : 'Next Round', {
        className: 'btn btn-primary game-next-btn',
        onClick: () => advanceRound()
      });
      form.appendChild(nextBtn);
    } else {
      createListPicker({
        container: form,
        options: availableContracts,
        placeholder: 'Select a game mode…',
        selectedValue: state.selectedContract,
        onChange: (val) => {
          if (val) {
            state.selectedContract = val;
            render();
          }
        }
      });

      // Show the selected contract's form
      if (state.selectedContract) {
        const contractForm = document.createElement('div');
        contractForm.className = 'game-tab-contract-form';
        
        const contractTitle = createElement('div', {
          className: 'contract-form-title',
          text: state.selectedContract
        });
        contractForm.appendChild(contractTitle);

        if (state.selectedContract === 'Trex') {
          contractForm.appendChild(renderTrexScreen());
        } else if (state.selectedContract === 'Queens') {
          contractForm.appendChild(renderQueensScreen());
        } else if (state.selectedContract === 'King') {
          contractForm.appendChild(renderKingScreen());
        } else if (state.selectedContract === 'Diamonds') {
          contractForm.appendChild(renderDiamondsScreen());
        } else if (state.selectedContract === 'Tricks') {
          contractForm.appendChild(renderTricksScreen());
        }

        const buttonsWrapper = createButtonPair({
          label1: 'Back',
          onClick1: () => { state.selectedContract = null; render(); },
          accent1: true,
          label2: 'Submit',
          onClick2: () => submitContractScore()
        });
        contractForm.appendChild(buttonsWrapper);
        form.appendChild(contractForm);
      }
    }

    div.appendChild(form);
    return div;
  }

  window.renderGameTabContentView = renderGameTabContentView;
})();
