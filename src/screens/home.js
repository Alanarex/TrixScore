// src/screens/home.js - Home screen rendering

(function() {
  function renderHomeScreenView({ pushScreen }) {
    const wrap = document.createElement('div');
    wrap.className = 'screen';
    wrap.appendChild(new Navbar({
      title: 'Trix Score',
      onSettings: () => pushScreen('settings'),
      onHistory: () => pushScreen('history')
    }).render());
    
    const trexBtn = document.createElement('button');
    trexBtn.className = 'btn btn-primary';
    trexBtn.textContent = 'Trex';
    trexBtn.onclick = () => pushScreen('trex-select');
    
    const complexBtn = document.createElement('button');
    complexBtn.className = 'btn btn-primary home-button-disabled';
    complexBtn.textContent = 'Trex Complex (Coming Soon)';
    complexBtn.disabled = true;
    
    wrap.appendChild(trexBtn);
    wrap.appendChild(complexBtn);
    return wrap;
  }

  window.renderHomeScreenView = renderHomeScreenView;
})();
