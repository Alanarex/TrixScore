// DOM Helper Functions - Reduce boilerplate and repetition in app.js
// PURPOSE: Provide reusable, type-safe element creators to reduce code duplication
// and improve consistency across screens

/**
 * Create an HTML element with attributes, classes, and styles in a single call.
 * USE CASE: Avoid repeated document.createElement calls with manual attribute setting
 *
 * @param {string} tag - HTML tag name (e.g., 'div', 'span', 'button')
 * @param {Object} [opts={}] - Configuration object
 * @param {string} [opts.className] - CSS class name(s)
 * @param {string} [opts.text] - Element text content (sets textContent)
 * @param {string} [opts.html] - Element HTML content (sets innerHTML)
 * @param {Object} [opts.attrs] - Key-value pairs for HTML attributes
 * @param {Object} [opts.styles] - Key-value pairs for inline styles
 *
 * @returns {HTMLElement} - The created element with all properties applied
 */
function createElement(tag, opts = {}) {
  const el = document.createElement(tag);
  if (opts.className) el.className = opts.className;
  if (opts.text) el.textContent = opts.text;
  if (opts.html) el.innerHTML = opts.html;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (opts.styles) Object.entries(opts.styles).forEach(([k, v]) => el.style[k] = v);
  return el;
}

/**
 * Create a labeled input field with wrapper for consistency.
 * USE CASE: Form fields where label and input must stay together with consistent styling
 *
 * @param {string} label - Label display text
 * @param {string} [type='text'] - Input type (text, password, email, number, checkbox, etc)
 * @param {Object} [opts={}] - Configuration object
 * @param {string} [opts.value] - Pre-filled input value
 * @param {string} [opts.placeholder] - Placeholder text when empty
 * @param {string} [opts.className] - CSS class for the input (default: 'input')
 * @param {number} [opts.maxLength] - Maximum character length
 * @param {boolean} [opts.required] - Whether field is required
 * @param {Function} [opts.onChange] - Change event handler
 * @param {Object} [opts.attrs] - Additional HTML attributes
 *
 * @returns {HTMLElement} - Container div with label and input elements
 */
function createInputGroup(label, type = 'text', opts = {}) {
  const group = document.createElement('div');
  group.className = 'input-group';
  
  // Add label if provided
  if (label) {
    const labelEl = document.createElement('div');
    labelEl.className = 'input-label';
    labelEl.textContent = label;
    group.appendChild(labelEl);
  }
  
  // Create input with all specified properties
  const input = document.createElement('input');
  input.className = opts.className || 'input';
  input.type = type;
  if (opts.value) input.value = opts.value;
  if (opts.placeholder) input.placeholder = opts.placeholder;
  if (opts.maxLength) input.maxLength = opts.maxLength;
  if (opts.required) input.required = true;
  if (opts.onChange) input.onchange = opts.onChange;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => input.setAttribute(k, v));
  
  group.appendChild(input);
  return group;
}

/**
 * Create a read-only label-value pair display row.
 * USE CASE: Show game details, scores, or other information in a two-column layout
 *
 * @param {string} label - Display label
 * @param {string|HTMLElement} value - Value to display (string or element)
 *
 * @returns {HTMLElement} - Row element with label on left, value on right
 */
function createDetailRow(label, value) {
  const row = document.createElement('div');
  row.className = 'detail-row';
  
  // Create and style label span
  const labelSpan = document.createElement('span');
  labelSpan.className = 'detail-label';
  labelSpan.textContent = label;
  row.appendChild(labelSpan);
  
  // Create and style value span (can contain text or nested elements)
  const valueSpan = document.createElement('span');
  valueSpan.className = 'detail-value';
  if (typeof value === 'string') {
    valueSpan.textContent = value;
  } else {
    valueSpan.appendChild(value);  // value is already an HTMLElement
  }
  row.appendChild(valueSpan);
  
  return row;
}

/**
 * Create a styled button element with optional danger styling.
 * USE CASE: Consistent button styling and behavior across the app
 *
 * @param {string} label - Button display text
 * @param {Object} [opts={}] - Configuration object
 * @param {Function} [opts.onClick] - Click event handler
 * @param {string} [opts.className] - Base CSS class (default: 'btn btn-primary')
 * @param {boolean} [opts.danger] - Apply danger styling (red) for destructive actions
 * @param {string} [opts.width] - Custom width (e.g., '100px')
 * @param {Object} [opts.style] - Additional inline styles
 * @param {boolean} [opts.disabled] - Whether button is disabled
 * @param {string} [opts.title] - Tooltip text on hover
 *
 * @returns {HTMLElement} - The button element
 */
function createButton(label, opts = {}) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.className = opts.className || 'btn btn-primary';
  if (opts.onClick) btn.onclick = opts.onClick;
  if (opts.danger) btn.classList.add('btn-danger');  // Red styling for destructive actions
  if (opts.disabled) btn.disabled = true;
  if (opts.width) {
    btn.classList.add('btn-custom-width');
    btn.style.setProperty('--btn-width', opts.width);
  }
  if (opts.title) btn.title = opts.title;
  return btn;
}

/**
 * Create a labeled section with optional background
 * @param {string} title - Section title
 * @param {HTMLElement} content - Content element
 * @param {Object} opts - Options: { className, styles }
 * @returns {HTMLElement}
 */
function createSection(title, content, opts = {}) {
  const section = document.createElement('div');
  section.className = opts.className || 'contract-section';
  
  if (title) {
    const titleEl = document.createElement('div');
    titleEl.className = 'contract-title';
    titleEl.textContent = title;
    section.appendChild(titleEl);
  }
  
  if (content) {
    section.appendChild(content);
  }
  
  if (opts.styles) {
    Object.entries(opts.styles).forEach(([k, v]) => section.style[k] = v);
  }
  
  return section;
}

/**
 * Create a horizontal flex row with two buttons (back/submit pattern)
 * @param {Object} actions - { label1, onClick1, accent1, label2, onClick2, danger2 }
 * @returns {HTMLElement}
 */
function createButtonPair(actions) {
  const wrapper = document.createElement('div');
  wrapper.className = 'button-pair';
  
  const btn1 = createButton(actions.label1, {
    onClick: actions.onClick1,
    width: '45%',
    className: actions.accent1 ? 'btn btn-accent' : 'btn btn-primary'
  });
  
  const btn2 = createButton(actions.label2, {
    onClick: actions.onClick2,
    width: '45%',
    danger: actions.danger2
  });
  
  wrapper.appendChild(btn1);
  wrapper.appendChild(btn2);
  return wrapper;
}

/**
 * Create a table row with specific styling
 * @param {Array<HTMLElement|string>} cells - Array of cell contents (strings or elements)
 * @param {Object} opts - Options: { className, headerRow, align, cellClasses }
 * @returns {HTMLElement}
 */
function createTableRow(cells, opts = {}) {
  const row = document.createElement('tr');
  const cellTag = opts.headerRow ? 'th' : 'td';
  
  cells.forEach((content, idx) => {
    const cell = document.createElement(cellTag);
    
    // Apply base class
    if (opts.cellClasses && opts.cellClasses[idx]) {
      cell.className = opts.cellClasses[idx];
    }
    
    // Set content
    if (typeof content === 'string') {
      cell.textContent = content;
    } else if (content instanceof HTMLElement) {
      cell.appendChild(content);
    }
    
    // Set colspan if needed
    if (opts.colSpans && opts.colSpans[idx]) {
      cell.colSpan = opts.colSpans[idx];
    }
    
    row.appendChild(cell);
  });
  
  return row;
}

/**
 * Create a scoreboard table header row for team mode
 * @param {Array<string>} playerNames - 4 player names
 * @returns {HTMLElement}
 */
function createScoreboardTeamHeader(playerNames) {
  const headerRow = document.createElement('tr');
  
  const rndHeader = createElement('th', {
    className: 'scoreboard-round-header',
    text: 'Rnd'
  });
  headerRow.appendChild(rndHeader);
  
  const team1Header = createElement('th', {
    className: 'scoreboard-team-header scoreboard-team1-header',
    text: 'Team 1',
    attrs: { colSpan: '2' }
  });
  headerRow.appendChild(team1Header);
  
  const team2Header = createElement('th', {
    className: 'scoreboard-team-header scoreboard-team2-header',
    text: 'Team 2',
    attrs: { colSpan: '2' }
  });
  headerRow.appendChild(team2Header);
  
  const actionHeader = createElement('th', {
    className: 'scoreboard-action-header',
    text: ''
  });
  headerRow.appendChild(actionHeader);
  
  return headerRow;
}

/**
 * Create a scoreboard table header row for individual mode
 * @param {Array<string>} playerNames - 4 player names
 * @returns {HTMLElement}
 */
function createScoreboardIndividualHeader(playerNames) {
  const headerRow = document.createElement('tr');
  
  const rndHeader = createElement('th', {
    className: 'scoreboard-round-header',
    text: 'Rnd'
  });
  headerRow.appendChild(rndHeader);
  
  playerNames.forEach(name => {
    const cell = createElement('th', {
      className: 'scoreboard-player-header',
      text: name
    });
    headerRow.appendChild(cell);
  });
  
  const actionHeader = createElement('th', {
    className: 'scoreboard-action-header',
    text: ''
  });
  headerRow.appendChild(actionHeader);
  
  return headerRow;
}

/**
 * Create a player names row for scoreboard tables
 * @param {Array<string>} playerNames - 4 player names
 * @returns {HTMLElement}
 */
function createScoreboardPlayerNameRow(playerNames) {
  const playerRow = document.createElement('tr');
  
  const emptyCell = createElement('th', {
    className: 'scoreboard-empty-cell'
  });
  playerRow.appendChild(emptyCell);
  
  playerNames.forEach(name => {
    const cell = createElement('td', {
      className: 'scoreboard-player-name-cell',
      text: name
    });
    playerRow.appendChild(cell);
  });
  
  const emptyActionCell = createElement('th', {
    className: 'scoreboard-empty-action-cell',
    styles: { borderBottom: '1px solid var(--color-border, rgba(0,0,0,0.1))' }
  });
  playerRow.appendChild(emptyActionCell);
  
  return playerRow;
}

/**
 * Create a score cell with optional highlighting
 * @param {number} score - The score value
 * @param {number} maxScore - Maximum score in the row (for highlighting)
 * @param {number} minScore - Minimum score in the row (for highlighting)
 * @returns {HTMLElement}
 */
function createScoreCell(score, maxScore, minScore) {
  const cell = createElement('td', {
    className: 'scoreboard-score-cell',
    text: String(score)
  });
  
  if (score === maxScore && maxScore !== minScore) {
    cell.classList.add('max');
  } else if (score === minScore && maxScore !== minScore) {
    cell.classList.add('min');
  }
  
  return cell;
}

/**
 * Create an action button cell for scoreboard
 * @param {Function} onClick - Click handler
 * @returns {HTMLElement}
 */
function createActionCell(onClick) {
  const cell = createElement('td', {
    className: 'scoreboard-action-cell'
  });
  
  const btn = createButton('ⓘ', {
    className: 'scoreboard-action-btn',
    onClick
  });
  
  cell.appendChild(btn);
  return cell;
}

/**
 * Create a team header label (Team 1, Team 2)
 * @param {string} teamName - Team name or label
 * @param {boolean} isFirst - If true, applies "first" margin
 * @returns {HTMLElement}
 */
function createTeamHeader(teamName, isFirst = false) {
  const header = createElement('div', {
    className: `team-header ${isFirst ? 'first' : 'second'}`,
    text: teamName
  });
  return header;
}

/**
 * Create a div for displaying contract details (e.g., in round-detail)
 * @param {string} title - Title of the detail
 * @param {string|HTMLElement} content - The detail content
 * @returns {HTMLElement}
 */
function createDetailCard(title, content) {
  const card = createElement('div', {
    className: 'detail-card'
  });
  
  const titleEl = createElement('span', {
    className: 'detail-card-title',
    text: title
  });
  card.appendChild(titleEl);
  
  if (typeof content === 'string') {
    card.appendChild(document.createTextNode(': ' + content));
  } else if (content instanceof HTMLElement) {
    card.appendChild(document.createTextNode(': '));
    card.appendChild(content);
  }
  
  return card;
}

/**
 * Create a count item row (for Diamonds/Tricks display)
 * @param {string} playerName - Player name
 * @param {number} count - Count value
 * @param {string} label - Label (e.g., 'diamonds', 'tricks')
 * @returns {HTMLElement}
 */
function createCountItem(playerName, count, label) {
  const item = createElement('div', {
    className: 'count-item'
  });
  
  const nameSpan = createElement('span', {
    className: 'count-player-name',
    text: playerName
  });
  
  const countSpan = createElement('span', {
    className: 'count-value',
    text: `${count} ${label}`
  });
  
  item.appendChild(nameSpan);
  item.appendChild(countSpan);
  return item;
}

/**
 * Create a score display item (for round-detail scores)
 * @param {string} playerName - Player name
 * @param {number} score - Score value
 * @returns {HTMLElement}
 */
function createScoreItem(playerName, score) {
  const item = createElement('div', {
    className: 'score-item'
  });
  
  const nameSpan = createElement('span', {
    className: 'score-player-name',
    text: playerName
  });
  
  const scoreSpan = createElement('span', {
    className: `score-value ${score >= 0 ? 'positive' : 'negative'}`,
    text: score >= 0 ? `+${score}` : String(score)
  });
  
  item.appendChild(nameSpan);
  item.appendChild(scoreSpan);
  return item;
}

/**
 * Create a total row for scoreboard (with highlighting)
 * @param {string} label - Row label (e.g., 'Total', 'Total (Team)')
 * @param {Array<number>} values - Array of total values
 * @param {Object} opts - Options: { colSpans, actionCell }
 * @returns {HTMLElement}
 */
function createTotalRow(label, values, opts = {}) {
  const row = document.createElement('tr');
  
  const labelCell = createElement('td', {
    className: 'scoreboard-total-label',
    text: label
  });
  row.appendChild(labelCell);
  
  const maxTotal = Math.max(...values);
  const minTotal = Math.min(...values);
  
  values.forEach((val, idx) => {
    const cell = createElement('td', {
      className: 'scoreboard-total-cell',
      text: String(val)
    });
    
    if (opts.colSpans && opts.colSpans[idx]) {
      cell.colSpan = opts.colSpans[idx];
    }
    
    if (val === maxTotal && maxTotal !== minTotal) {
      cell.classList.add('max');
    } else if (val === minTotal && maxTotal !== minTotal) {
      cell.classList.add('min');
    }
    
    row.appendChild(cell);
  });
  
  if (opts.actionCell) {
    const actionCell = createElement('td', {
      className: 'scoreboard-empty-action-cell'
    });
    row.appendChild(actionCell);
  }
  
  return row;
}

/**
 * Add a modifier class to an element conditionally
 * @param {HTMLElement} el - The element
 * @param {string} className - The class to add
 * @param {boolean} condition - Whether to add the class
 */
function toggleClass(el, className, condition) {
  if (condition) {
    el.classList.add(className);
  } else {
    el.classList.remove(className);
  }
}

// Export to window
window.createElement = createElement;
window.createInputGroup = createInputGroup;
window.createDetailRow = createDetailRow;
window.createButton = createButton;
window.createSection = createSection;
window.createButtonPair = createButtonPair;
window.createTableRow = createTableRow;
window.createScoreboardTeamHeader = createScoreboardTeamHeader;
window.createScoreboardIndividualHeader = createScoreboardIndividualHeader;
window.createScoreboardPlayerNameRow = createScoreboardPlayerNameRow;
window.createScoreCell = createScoreCell;
window.createActionCell = createActionCell;
window.createTeamHeader = createTeamHeader;
window.createDetailCard = createDetailCard;
window.createCountItem = createCountItem;
window.createScoreItem = createScoreItem;
window.createTotalRow = createTotalRow;
window.toggleClass = toggleClass;
