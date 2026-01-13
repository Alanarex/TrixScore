// app.js - Main navigation, state, and offline logic
(function() {
  let state = {
    screen: 'home',
    mode: null,
    teamMode: false,
    players: [],
    settings: null,
    game: null,
    darkMode: false,
    tab: 'game',
    currentRound: 0,
    selectedContract: null,
    usedContracts: [], // Contracts used in current round
    navStack: []
  };

  function setScreen(screen, opts = {}) {
    state.screen = screen;
    Object.assign(state, opts);
    render();
  }

  function pushScreen(screen, opts = {}) {
    if (state.screen) state.navStack.push(state.screen);
    setScreen(screen, { prevScreen: state.screen, ...opts });
  }

  function goBack() {
    if (state.navStack.length) {
      const target = state.navStack.pop();
      const prev = state.navStack[state.navStack.length - 1] || null;
      setScreen(target, { prevScreen: prev });
    } else {
      state.navStack = [];
      setScreen('home', { prevScreen: null });
    }
  }

  function render() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    state.settings = loadSettings();
    applyTheme(state.settings.darkMode);
    if (state.screen === 'home') {
      app.appendChild(renderHomeScreen());
    } else if (state.screen === 'trex-select') {
      app.appendChild(renderTrexSelectScreen());
    } else if (state.screen === 'player-input') {
      app.appendChild(renderPlayerInputScreen());
    } else if (state.screen === 'game') {
      app.appendChild(renderGameScreen());
    } else if (state.screen === 'settings') {
      app.appendChild(renderSettingsScreen({
        onBack: () => goBack(),
        onHistory: () => pushScreen('history')
      }));
    } else if (state.screen === 'history') {
      app.appendChild(renderHistoryScreen({
        onBack: () => goBack(),
        onSettings: () => pushScreen('settings')
      }));
    } else if (state.screen === 'round-detail') {
      app.appendChild(renderRoundDetailScreen());
    }
  }

  function renderHomeScreen() {
    return window.renderHomeScreenView({ pushScreen });
  }

  function renderTrexSelectScreen() {
    return window.renderTrexSelectScreenView({ goBack, pushScreen });
  }

  function renderPlayerInputScreen() {
    return window.renderPlayerInputScreenView({ state, goBack, pushScreen });
  }

  function renderGameScreen() {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.minHeight = '100vh';
    wrap.appendChild(new Navbar({
      title: 'Trex Game',
      left: 'back',
      onBack: confirmExitGame,
      onSettings: () => pushScreen('settings'),
      onHistory: () => pushScreen('history')
    }).render());
    const content = document.createElement('div');
    content.style.flex = '1';
    content.style.overflowY = 'auto';
    content.style.paddingBottom = '56px';
    if (state.tab === 'game') {
      // Avoid potential native select dropdown misalignment inside overflow containers
      content.style.overflowY = 'visible';
      content.appendChild(renderGameTabContent());
    } else if (state.tab === 'scoreboard') {
      content.appendChild(renderScoreboardTab());
    }
    wrap.appendChild(content);
    wrap.appendChild(renderGameTabbar());
    return wrap;
  }

  function renderGameTabContent() {
    return window.renderGameTabContentView({
      state,
      render,
      advanceRound,
      submitContractScore,
      renderTrexScreen,
      renderQueensScreen,
      renderKingScreen,
      renderDiamondsScreen,
      renderTricksScreen
    });
  }

  function renderTrexScreen() {
    return window.renderTrexContractForm(state.game.players, state);
  }

  function renderQueensScreen() {
    return window.renderQueensContractForm(state.game.players, state);
  }

  function renderKingScreen() {
    return window.renderKingContractForm(state.game.players, state);
  }

  function renderDiamondsScreen() {
    return window.renderDiamondsContractForm(state.game.players, state);
  }

  function renderTricksScreen() {
    return window.renderTricksContractForm(state.game.players, state);
  }

  function submitContractScore() {
    const contract = state.selectedContract;
    const scores = calculateContractScores(contract);
    if (!scores) return;
    
    // Gather detailed data based on contract type
    let details = null;
    if (contract === 'Trex') {
      details = { order: state._trexOrder ? state._trexOrder() : [] };
    } else if (contract === 'Queens') {
      details = { queensData: state._queensData ? state._queensData() : [] };
    } else if (contract === 'King') {
      details = state._kingData ? state._kingData() : {};
    } else if (contract === 'Diamonds') {
      const steppers = state._diamondSteppers || [];
      details = { counts: steppers.map(s => s.getValue()) };
    } else if (contract === 'Tricks') {
      const steppers = state._trickSteppers || [];
      details = { counts: steppers.map(s => s.getValue()) };
    }
    
    state.game.roundScores[state.currentRound].push({
      contract: contract,
      scores: scores,
      details: details
    });
    state.game.totals = state.game.totals.map((t, i) => t + scores[i]);
    state.usedContracts.push(contract);
    state.selectedContract = null;
    if (state.currentRound >= GAME_CONFIG.TOTAL_ROUNDS - 1) {
      endGame();
    } else {
      advanceRound();
    }
  }

  function advanceRound() {
    state.currentRound += 1;
    // Reset available contracts when a kingdom is completed
    if (state.currentRound % GAME_CONFIG.ROUNDS_PER_KINGDOM === 0) {
      state.usedContracts = [];
    }
    state.selectedContract = null;
    render();
  }

  function endGame() {
    const game = {
      date: new Date().toISOString(),
      players: state.game.players,
      teamMode: state.game.teamMode,
      roundScores: state.game.roundScores,
      totals: state.game.totals
    };
    saveGameHistory(game);
    new Modal({
      content: '<b>Game Over!</b><br>' + state.game.players.map((p, i) => `${p}: ${state.game.totals[i]}`).join('<br>'),
      actions: [{ label: 'Home', onClick: () => { state.navStack = []; setScreen('home'); } }],
      blockClose: true
    }).show();
  }

  function calculateContractScores(contract) {
    const settings = state.settings;
    let scores = [0,0,0,0];
    if (contract === 'Trex') {
      const order = state._trexOrder ? state._trexOrder() : [];
      if (order.length !== 4 || order.some(v => v === '' || isNaN(v))) {
        new Modal({
          content: 'Please select all finishing positions.',
          actions: [{ label: 'OK', onClick: null }]
        }).show();
        return null;
      }
      scores = calculateTrexOrderScores(order, settings);
    } else if (contract === 'Queens') {
      const data = state._queensData ? state._queensData() : [];
      // Check if all 4 queens are properly set
      let allQueensSet = true;
      for (let i = 0; i < 4; i++) {
        if (!data[i] || data[i].eater === undefined || data[i].eater === '' || data[i].eater < 0 || isNaN(data[i].eater)) {
          allQueensSet = false;
          break;
        }
      }
      if (!allQueensSet) {
        new Modal({
          content: 'Please select who ate all queens.',
          actions: [{ label: 'OK', onClick: null }]
        }).show();
        return null;
      }
      data.forEach((q, i) => {
        if (q && q.eater >= 0) {
          const eater = q.eater;
          if (q.doubled) {
            scores[eater] += settings.queens.doubled;
            // Apply bonus to selected doubled players (only the plus value)
            if (q.doubledPlayers && q.doubledPlayers.length > 0) {
              q.doubledPlayers.forEach(player => {
                scores[player] += settings.queens.plus;
              });
            }
          } else {
            scores[eater] += settings.queens.normal;
          }
        }
      });
    } else if (contract === 'King') {
      const data = state._kingData ? state._kingData() : {};
      if (data.eater === '' || data.eater === undefined || isNaN(data.eater)) {
        new Modal({
          content: 'Please select who ate the king.',
          actions: [{ label: 'OK', onClick: null }]
        }).show();
        return null;
      }
      const val = data.doubled ? settings.king.doubled : settings.king.normal;
      scores[data.eater] = val;
      // Apply bonus to selected doubled players (only the plus value)
      if (data.doubled && data.doubledPlayers && data.doubledPlayers.length > 0) {
        data.doubledPlayers.forEach(player => {
          scores[player] += settings.king.plus;
        });
      }
    } else if (contract === 'Diamonds') {
      const steppers = state._diamondSteppers || [];
      if (!steppers.length) return null;
      let total = 0;
      steppers.forEach((s, i) => {
        const count = s.getValue();
        total += count;
        scores[i] = count * settings.diamonds.value;
      });
      if (total !== GAME_CONFIG.DIAMONDS_TOTAL) {
        new Modal({
          content: `Total diamonds must equal 13. Current total: ${total}`,
          actions: [{ label: 'OK', onClick: null }]
        }).show();
        return null;
      }
    } else if (contract === 'Tricks') {
      const steppers = state._trickSteppers || [];
      if (!steppers.length) return null;
      let total = 0;
      steppers.forEach((s, i) => {
        const count = s.getValue();
        total += count;
        scores[i] = count * settings.tricks.value;
      });
      if (total !== GAME_CONFIG.TRICKS_TOTAL) {
        new Modal({
          content: `Total tricks must equal 13. Current total: ${total}`,
          actions: [{ label: 'OK', onClick: null }]
        }).show();
        return null;
      }
    }
    return scores;
  }

  function renderScoreboardTab() {
    return window.renderScoreboardScreen({ state, pushScreen });
  }

  function renderRoundDetailScreen() {
    return window.renderRoundDetailScreenView({ state, pushScreen, goBack });
  }

  function renderGameTabbar() {
    const tabbar = document.createElement('div');
    tabbar.className = 'tabbar';
    const tabs = [
      { id: 'game', label: 'Game' },
      { id: 'scoreboard', label: 'Scoreboard' }
    ];
    tabs.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'tab-btn' + (state.tab === t.id ? ' active' : '');
      btn.textContent = t.label;
      btn.onclick = () => { state.tab = t.id; render(); };
      tabbar.appendChild(btn);
    });
    return tabbar;
  }

  function confirmExitGame() {
    new Modal({
      content: '<b>Exit game?</b><br>Progress will be lost.',
      actions: [
        { label: 'Cancel', onClick: null, className: 'btn btn-accent' },
        { label: 'Exit', danger: true, onClick: () => { state.navStack = []; setScreen('home'); } }
      ],
      blockClose: true
    }).show();
  }

  window.addEventListener('DOMContentLoaded', render);
  window.setScreen = setScreen;
})();
