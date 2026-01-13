// src/screens/settings.js - Settings screen UI rendering
// Renders the settings interface; actual settings persistence handled by src/core/settings.js

function renderSettingsScreen({ onBack, onHistory }) {
  const settings = loadSettings();
  
  const wrap = document.createElement('div');
  wrap.className = 'screen settings-screen';
  
  // Navbar
  wrap.appendChild(new Navbar({ title: 'Settings', left: 'back', onBack, onHistory }).render());
  
  // Content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'settings-content';
  
  // Helper function to create collapsible section
  function createCollapsibleSection(title, content, defaultOpen = true) {
    const section = document.createElement('div');
    section.className = 'settings-section';
    
    const header = document.createElement('div');
    header.className = 'settings-section-header';
    
    const titleEl = document.createElement('div');
    titleEl.className = 'settings-section-title';
    titleEl.textContent = title;
    
    const icon = document.createElement('span');
    icon.className = 'settings-section-icon';
    icon.textContent = '▼';
    
    header.appendChild(titleEl);
    header.appendChild(icon);
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = `settings-section-content ${defaultOpen ? 'open' : 'closed'}`;
    
    const contentInner = document.createElement('div');
    contentInner.className = 'settings-section-content-inner';
    contentInner.appendChild(content);
    contentWrapper.appendChild(contentInner);
    
    if (!defaultOpen) {
      icon.classList.add('rotated');
    }
    
    header.onclick = () => {
      const isOpen = contentWrapper.classList.contains('open');
      if (isOpen) {
        contentWrapper.classList.remove('open');
        contentWrapper.classList.add('closed');
        icon.classList.add('rotated');
      } else {
        contentWrapper.classList.add('open');
        contentWrapper.classList.remove('closed');
        icon.classList.remove('rotated');
      }
    };
    
    section.appendChild(header);
    section.appendChild(contentWrapper);
    return section;
  }
  
  // System Settings Section
  const systemContent = document.createElement('div');
  
  const darkModeRow = document.createElement('div');
  darkModeRow.className = 'dark-mode-row';
  
  const darkModeLabel = document.createElement('span');
  darkModeLabel.className = 'dark-mode-label';
  darkModeLabel.textContent = 'Dark Mode';
  
  const toggle = document.createElement('label');
  toggle.className = 'toggle-switch';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = settings.darkMode;
  input.onchange = (e) => {
    settings.darkMode = !!e.target.checked;
    applyTheme(settings.darkMode);
    saveSettings(settings);
  };
  const slider = document.createElement('span');
  slider.className = 'toggle-slider';
  toggle.appendChild(input);
  toggle.appendChild(slider);
  
  darkModeRow.appendChild(darkModeLabel);
  darkModeRow.appendChild(toggle);
  systemContent.appendChild(darkModeRow);
  
  contentContainer.appendChild(createCollapsibleSection('System', systemContent, true));
  
  // Game Settings Section (all game modes grouped together)
  const gameSettingsContent = document.createElement('div');
  
  const scoreGroups = [
    { key: 'trex', label: 'Trex', icon: 'fa-trophy', fields: ['first','second','third','last'], fieldLabels: { first: '1st', second: '2nd', third: '3rd', last: 'Last' } },
    { key: 'queens', label: 'Queens', icon: 'fa-chess-queen', fields: ['normal','doubled','plus'] },
    { key: 'king', label: 'King', icon: 'fa-chess-king', fields: ['normal','doubled','plus'] },
    { key: 'diamonds', label: 'Diamonds', icon: 'fa-gem', fields: ['value'] },
    { key: 'tricks', label: 'Tricks', icon: 'fa-layer-group', fields: ['value'] }
  ];
  
  scoreGroups.forEach((g, idx) => {
    const groupSection = document.createElement('div');
    groupSection.className = 'game-settings-group';
    
    const title = document.createElement('div');
    title.className = 'game-settings-title';
    
    const icon = document.createElement('i');
    icon.className = `fa-solid ${g.icon} game-settings-icon`;
    
    title.appendChild(icon);
    title.appendChild(document.createTextNode(g.label));
    groupSection.appendChild(title);
    
    const fieldsContainer = document.createElement('div');
    fieldsContainer.className = 'game-settings-fields';
    
    g.fields.forEach(f => {
      const fieldLabel = g.fieldLabels?.[f] || (f.charAt(0).toUpperCase() + f.slice(1));
      const inputRow = createNumberInput({
        label: fieldLabel,
        value: settings[g.key][f],
        min: -999,
        max: 999,
        step: 1,
        onChange: v => {
          settings[g.key][f] = v;
          saveSettings(settings);
        }
      });
      fieldsContainer.appendChild(inputRow);
    });
    
    groupSection.appendChild(fieldsContainer);
    gameSettingsContent.appendChild(groupSection);
  });
  
  contentContainer.appendChild(createCollapsibleSection('Game Settings', gameSettingsContent, false));
  
  wrap.appendChild(contentContainer);
  return wrap;
}

window.renderSettingsScreen = renderSettingsScreen;
