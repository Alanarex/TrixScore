// src/screens/trex-select.js - Trex mode selection screen

(function() {
  function renderTrexSelectScreenView({ goBack, pushScreen }) {
    const wrap = document.createElement('div');
    wrap.className = 'screen';
    wrap.appendChild(new Navbar({
      title: 'Trex',
      left: 'back',
      onBack: () => goBack(),
      onSettings: () => pushScreen('settings'),
      onHistory: () => pushScreen('history')
    }).render());
    
    const indivBtn = document.createElement('button');
    indivBtn.className = 'btn btn-primary';
    indivBtn.textContent = 'Individual Mode (4 players)';
    indivBtn.onclick = () => pushScreen('player-input', { teamMode: false });
    
    const teamBtn = document.createElement('button');
    teamBtn.className = 'btn btn-primary';
    teamBtn.textContent = 'Teams Mode (2v2)';
    teamBtn.onclick = () => pushScreen('player-input', { teamMode: true });
    
    wrap.appendChild(indivBtn);
    wrap.appendChild(teamBtn);
    return wrap;
  }

  window.renderTrexSelectScreenView = renderTrexSelectScreenView;
})();
