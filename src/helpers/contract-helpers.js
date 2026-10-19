// Contract Form Builders - Reduces repetition in contract screen creation
// PURPOSE: Each contract type (Trex, Queens, King, Diamonds, Tricks) needs a form to collect
// game-specific data. These builders encapsulate form creation and state management.

/**
 * Show a modal dialog for selecting which player gets bonus points.
 * USE CASE: Queens and King contracts allow doubling on one specific player
 *
 * @param {Array<string>} playerNames - Array of player names (typically 4 players)
 *
 * @returns {Promise<number|null>} Promise resolving to:
 *   - Selected player index (0-3) if player selected
 *   - null if no selection made
 */
function showBonusSelectorModal(playerNames) {
  return new Promise((resolve) => {
    // Build clickable rows for each player
    const playerOptions = playerNames.map((p, i) =>
      `<div class="picker-row" data-value="${i}" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border); cursor: pointer;">${escapeHtml(p)}</div>`
    ).join('');

    // Create modal with player options
    const bonusModal = new Modal({
      content: `<div style="margin-bottom: 1rem; font-weight: 500;">Select who gets bonus points:</div><div class="picker-list" style="max-height: 60vh; overflow-y: auto;">${playerOptions}</div>`,
      actions: [],
      blockClose: false
    });
    bonusModal.show();

    // Track selected player (zero-indexed)
    let selectedPlayer = null;
    
    // Attach click handlers to player rows
    const rows = bonusModal.modal.querySelectorAll('.picker-row');
    rows.forEach(row => {
      row.onclick = () => {
        // Remove selection from all rows
        rows.forEach(r => {
          r.classList.remove('selected');
        });
        // Mark this row as selected
        selectedPlayer = row.getAttribute('data-value');
        row.classList.add('selected');
      };
    });

    // Add Done button to confirm selection
    const confirmBtn = createButton('Done', {
      style: { marginTop: '1rem' },
      onClick: () => {
        bonusModal.close();
        // Resolve with player index (0-3) or null
        resolve(selectedPlayer ? parseInt(selectedPlayer) : null);
      }
    });
    bonusModal.modal.querySelector('.modal-content').appendChild(confirmBtn);
  });
}

/**
 * Build a Trex contract form (player finishing order).
 * Allows selection of players in 1st, 2nd, 3rd, Last finishing positions.
 * USE CASE: Trex contract requires recording which player finished last
 *
 * @param {Array<string>} playerNames - Array of player names
 * @param {Object} state - Game state object (unused in current implementation)
 *
 * @returns {Object} - {element: HTMLElement, getOrder: Function}
 *   - element: The form DOM
 *   - getOrder: Function that returns array of selected player indices [0-3 for places 1-4]
 */
function buildTrexForm(playerNames, state) {
  const div = document.createElement('div');
  const label = createElement('div', { className: 'contract-form-label', text: 'Select finishing order (1st → 4th):' });
  div.appendChild(label);

  const order = [];
  const selects = [];

  // Create 4 pickers for positions 1-4
  for (let i = 0; i < GAME_CONFIG.PLAYERS; ++i) {
    const picker = createListPicker({
      container: div,
      options: playerNames.map((p, j) => ({ value: j, label: p })),
      placeholder: `Place ${i + 1}`,
      selectedValue: order[i] != null ? order[i] : '',
      onChange: (val) => {
        const playerIdx = parseInt(val);
        // Prevent same player from being selected twice
        // If this player was already selected elsewhere, clear that selection
        for (let j = 0; j < GAME_CONFIG.PLAYERS; ++j) {
          if (j !== i && order[j] === playerIdx) {
            order[j] = undefined;
            selects[j].textContent = `Place ${j + 1}`;
            break;
          }
        }
        order[i] = playerIdx;
      }
    });
    selects.push(picker.element);
  }

  return {
    element: div,
    getOrder: () => order
  };
}

/**
 * Build a Queens contract form (4 queens with optional doubled bonus).
 * Each queen can be "eaten" by one player, and optionally doubled on another player.
 * USE CASE: Queens contract requires specifying who ate each queen and bonus points
 *
 * @param {Array<string>} playerNames - Array of player names
 *
 * @returns {Object} - {element: HTMLElement, getQueensData: Function}
 *   - element: The form DOM
 *   - getQueensData: Function returning array of queen data objects:
 *     [{eater: number, doubled: boolean, doubledPlayers: [number]}, ...]
 */
function buildQueensForm(playerNames) {
  const div = document.createElement('div');
  const queenData = [];

  // Create a form group for each of the 4 queens
  for (let q = 0; q < GAME_CONFIG.PLAYERS; ++q) {
    const group = document.createElement('div');
    group.className = 'contract-form-row';

    const label = createElement('div', {
      text: `Queen ${q + 1}`,
      styles: { marginBottom: '0.4rem', fontWeight: '500' }
    });
    group.appendChild(label);

    // Picker for selecting which player ate this queen
    createListPicker({
      container: group,
      options: playerNames.map((p, i) => ({ value: i, label: p })),
      placeholder: 'Who?',
      onChange: (val) => {
        // Initialize or update queen data with selected eater
        if (!queenData[q]) queenData[q] = { eater: parseInt(val) };
        else queenData[q].eater = parseInt(val);
      }
    });

    const switchWrapper = document.createElement('div');
    switchWrapper.className = 'switch-wrapper';

    const switchLabel = document.createElement('label');
    switchLabel.className = 'switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.onchange = async (e) => {
      // Initialize queen data if needed
      if (!queenData[q]) queenData[q] = { eater: -1 };

      // When switch is toggled on, show modal to select bonus player
      if (e.target.checked) {
        const selectedPlayer = await showBonusSelectorModal(playerNames);
        queenData[q].doubledPlayers = selectedPlayer !== null ? [selectedPlayer] : [];
      } else {
        queenData[q].doubledPlayers = [];
      }
      // Record whether this queen was doubled
      queenData[q].doubled = e.target.checked;
    };

    const slider = document.createElement('span');
    slider.className = 'switch-slider';

    const labelText = document.createElement('span');
    labelText.className = 'switch-label';
    labelText.textContent = 'Doubled';

    // Build switch structure
    switchLabel.appendChild(input);
    switchLabel.appendChild(slider);
    switchWrapper.appendChild(switchLabel);
    switchWrapper.appendChild(labelText);
    group.appendChild(switchWrapper);
    div.appendChild(group);
  }

  return {
    element: div,
    getQueensData: () => queenData
  };
}

/**
 * Build a King contract form (who ate the king, optional doubled).
 * The King is eaten by one player and can be doubled on another player.
 * USE CASE: King contract requires selecting which player ate the King
 *
 * @param {Array<string>} playerNames - Array of player names
 *
 * @returns {Object} - {element: HTMLElement, getKingData: Function}
 *   - element: The form DOM
 *   - getKingData: Function returning king data object:
 *     {eater: number|string, doubled: boolean, doubledPlayers: [number]}
 */
function buildKingForm(playerNames) {
  const div = document.createElement('div');

  const label = createElement('div', {
    className: 'contract-form-label',
    text: 'Who ate the king?'
  });
  div.appendChild(label);

  // Track which player ate the King
  let kingEater = '';
  createListPicker({
    container: div,
    options: playerNames.map((p, i) => ({ value: i, label: p })),
    placeholder: 'Select player',
    onChange: (val) => { kingEater = val; }
  });

  const switchWrapper = document.createElement('div');
  switchWrapper.className = 'switch-wrapper';

  const switchLabel = document.createElement('label');
  switchLabel.className = 'switch';

  const input = document.createElement('input');
  input.type = 'checkbox';
  let kingDoubledPlayers = [];

  input.onchange = async (e) => {
    // When switch is toggled on, show modal to select which player gets doubled bonus
    if (e.target.checked) {
      const selectedPlayer = await showBonusSelectorModal(playerNames);
      kingDoubledPlayers = selectedPlayer !== null ? [selectedPlayer] : [];
    } else {
      kingDoubledPlayers = [];
    }
  };

  const slider = document.createElement('span');
  slider.className = 'switch-slider';

  const labelText = document.createElement('span');
  labelText.className = 'switch-label';
  labelText.textContent = 'Doubled';

  // Build switch structure
  switchLabel.appendChild(input);
  switchLabel.appendChild(slider);
  switchWrapper.appendChild(switchLabel);
  switchWrapper.appendChild(labelText);
  div.appendChild(switchWrapper);

  return {
    element: div,
    getKingData: () => ({
      eater: kingEater ? parseInt(kingEater) : '',
      doubled: input.checked,
      doubledPlayers: kingDoubledPlayers
    })
  };
}

/**
 * Build a Diamonds contract form (count per player, max 13 total).
 * Uses number steppers where total across all players cannot exceed 13.
 * USE CASE: Diamonds contract requires distribution of diamond points among players
 *
 * @param {Array<string>} playerNames - Array of player names
 *
 * @returns {Object} - {element: HTMLElement, getSteppers: Function}
 *   - element: The form DOM
 *   - getSteppers: Function returning array of stepper objects with getValue() method
 */
function buildDiamondsForm(playerNames) {
  const div = document.createElement('div');

  const label = createElement('div', {
    className: 'contract-form-label',
    text: 'How many diamonds per player?'
  });
  div.appendChild(label);

  const steppers = [];

  /**
   * Update stepper max values to enforce the constraint that all steppers sum to max 13.
   * This function is called whenever any stepper value changes.
   */
  const updateMaxValues = () => {
    let total = 0;
    steppers.forEach(s => total += s.getValue());
    // Calculate how many diamonds remain available
    const remaining = GAME_CONFIG.DIAMONDS_TOTAL - total;
    // Ensure each stepper can go up to its current value plus remaining diamonds
    steppers.forEach(stepper => {
      const currentValue = stepper.getValue();
      stepper.max = currentValue + remaining;
    });
  };

  // Create a stepper for each player to input their diamond count
  playerNames.forEach((p, i) => {
    const inputRow = createNumberInput({
      label: p,
      value: 0,
      min: 0,
      max: GAME_CONFIG.DIAMONDS_TOTAL,
      step: 1,
      allowManualInput: false,
      onChange: (val) => { updateMaxValues(); }
    });
    inputRow.className = 'contract-form-stepper-row';
    steppers.push(inputRow._stepper);
    div.appendChild(inputRow);
  });

  return {
    element: div,
    getSteppers: () => steppers
  };
}

/**
 * Build a Tricks contract form (count per player, max 13 total).
 * Uses number steppers where total across all players cannot exceed 13.
 * USE CASE: Tricks contract requires distribution of tricks among players
 *
 * @param {Array<string>} playerNames - Array of player names
 *
 * @returns {Object} - {element: HTMLElement, getSteppers: Function}
 *   - element: The form DOM
 *   - getSteppers: Function returning array of stepper objects with getValue() method
 */
function buildTricksForm(playerNames) {
  const div = document.createElement('div');

  const label = createElement('div', {
    className: 'contract-form-label',
    text: 'How many tricks per player?'
  });
  div.appendChild(label);

  const steppers = [];

  const updateMaxValues = () => {
    let total = 0;
    steppers.forEach(s => total += s.getValue());
    const remaining = GAME_CONFIG.TRICKS_TOTAL - total;
    steppers.forEach(stepper => {
      const currentValue = stepper.getValue();
      stepper.max = currentValue + remaining;
    });
  };

  playerNames.forEach((p, i) => {
    const inputRow = createNumberInput({
      label: p,
      value: 0,
      min: 0,
      max: GAME_CONFIG.TRICKS_TOTAL,
      step: 1,
      allowManualInput: false,
      onChange: (val) => { updateMaxValues(); }
    });
    inputRow.className = 'contract-form-stepper-row';
    steppers.push(inputRow._stepper);
    div.appendChild(inputRow);
  });

  return {
    element: div,
    getSteppers: () => steppers
  };
}

// Export to window
window.showBonusSelectorModal = showBonusSelectorModal;
window.buildTrexForm = buildTrexForm;
window.buildQueensForm = buildQueensForm;
window.buildKingForm = buildKingForm;
window.buildDiamondsForm = buildDiamondsForm;
window.buildTricksForm = buildTricksForm;
