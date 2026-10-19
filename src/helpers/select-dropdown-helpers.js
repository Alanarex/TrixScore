(function() {
  /**
   * Create a Choices.js-enhanced select dropdown with styled UI.
   * USE CASE: When you need a searchable, styled dropdown with custom visual treatment
   * (e.g., game mode selection, settings with enhanced appearance).
   *
   * @param {Object} options - Configuration object
   * @param {HTMLElement} [options.container] - Element to append the select to (optional)
   * @param {Array<string|number|Object>} [options.options=[]] - Dropdown options: strings, numbers, or {value, label, disabled, selected}
   * @param {string} [options.placeholder='Select…'] - Placeholder text when nothing selected
   * @param {string|number|null} [options.selectedValue=null] - Pre-selected value
   * @param {Function} [options.onChange=null] - Callback: function(value, event)
   * @param {string} [options.className='input select-input'] - CSS classes for the select element
   * @param {string|null} [options.id=null] - HTML id attribute
   * @param {string|null} [options.name=null] - HTML name attribute
   * @param {Object} [options.choicesConfig={}] - Additional Choices.js configuration
   *
   * @returns {Object} {select: HTMLSelectElement, instance: Choices|null} - Select element and Choices.js instance
   */
  function createSelectDropdown({
    container,
    options = [],
    placeholder = 'Select…',
    selectedValue = null,
    onChange = null,
    className = 'input select-input',
    id = null,
    name = null,
    choicesConfig = {}
  } = {}) {
    const select = document.createElement('select');
    select.className = className;

    if (id) select.id = id;
    if (name) select.name = name;

    // Create disabled placeholder option that appears selected when no value chosen
    const placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.textContent = placeholder;
    placeholderOpt.disabled = true;
    placeholderOpt.selected = true;
    placeholderOpt.hidden = true;
    select.appendChild(placeholderOpt);

    // Normalize and add all option elements to the select
    options.forEach(opt => {
      const o = document.createElement('option');
      // Handle both string/number options and {value, label, disabled, selected} objects
      if (typeof opt === 'string' || typeof opt === 'number') {
        o.value = String(opt);
        o.textContent = String(opt);
      } else {
        o.value = String(opt.value);
        o.textContent = opt.label != null ? String(opt.label) : String(opt.value);
        if (opt.disabled) o.disabled = true;
        if (opt.selected) o.selected = true;
      }
      select.appendChild(o);
    });

    // Attach change listener if provided
    if (typeof onChange === 'function') {
      select.onchange = (e) => onChange(e.target.value, e);
    }

    // Append to container if provided
    if (container) {
      container.appendChild(select);
    }

    // Initialize Choices.js library for enhanced UX (search, styling, etc.)
    // Choices.js must be loaded in the page before calling this function
    let instance = null;
    if (window.Choices) {
      instance = new Choices(select, Object.assign({
        searchEnabled: false,      // Disable search for simple dropdowns
        itemSelectText: '',        // Remove "Press to select" text
        placeholder: true,         // Show placeholder option
        placeholderValue: placeholder,
        shouldSort: false,         // Preserve original option order
        position: 'auto'          // Auto-position below/above based on viewport space
      }, choicesConfig));

      // Apply pre-selected value after Choices.js initialization
      if (selectedValue != null && selectedValue !== '') {
        instance.setChoiceByValue(String(selectedValue));
      }
    }

    return { select, instance };
  }

  /**
   * Create a simple native HTML select without styling libraries.
   * USE CASE: When you need a lightweight, unstyled dropdown that doesn't require Choices.js
   * (e.g., simple forms where native select is sufficient).
   *
   * @param {Object} options - Configuration object
   * @param {HTMLElement} [options.container] - Element to append the select to (optional)
   * @param {Array<string|number|Object>} [options.options=[]] - Dropdown options: strings, numbers, or {value, label, disabled, selected}
   * @param {string} [options.placeholder='Select…'] - Placeholder text when nothing selected
   * @param {string|number|null} [options.selectedValue=null] - Pre-selected value
   * @param {Function} [options.onChange=null] - Callback: function(value, event)
   * @param {string} [options.className='input'] - CSS classes for the select element
   * @param {string|null} [options.id=null] - HTML id attribute
   * @param {string|null} [options.name=null] - HTML name attribute
   *
   * @returns {Object} {select: HTMLSelectElement} - The native select element
   */
  function createSimpleSelect({
    container,
    options = [],
    placeholder = 'Select…',
    selectedValue = null,
    onChange = null,
    className = 'input',
    id = null,
    name = null
  } = {}) {
    // Wrapper div fixes dropdown positioning issues with flexbox parents
    const wrapper = document.createElement('div');
    wrapper.className = 'form-select-wrapper';
    
    const select = document.createElement('select');
    select.className = className;

    if (id) select.id = id;
    if (name) select.name = name;

    // Create disabled placeholder option
    const placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.textContent = placeholder;
    placeholderOpt.disabled = true;
    placeholderOpt.selected = true;
    placeholderOpt.hidden = true;
    select.appendChild(placeholderOpt);

    // Normalize and add all option elements to the select
    options.forEach(opt => {
      const o = document.createElement('option');
      // Handle both string/number options and {value, label, disabled, selected} objects
      if (typeof opt === 'string' || typeof opt === 'number') {
        o.value = String(opt);
        o.textContent = String(opt);
      } else {
        o.value = String(opt.value);
        o.textContent = opt.label != null ? String(opt.label) : String(opt.value);
        if (opt.disabled) o.disabled = true;
        if (opt.selected) o.selected = true;
      }
      select.appendChild(o);
    });

    // Attach change listener if provided
    if (typeof onChange === 'function') {
      select.onchange = (e) => onChange(e.target.value, e);
    }

    wrapper.appendChild(select);

    // Append wrapper (not select directly) to preserve layout integrity
    if (container) {
      container.appendChild(wrapper);
    }

    // Set the pre-selected value on the native select
    if (selectedValue != null && selectedValue !== '') {
      select.value = String(selectedValue);
    }

    return { select };
  }

  /**
   * Create a modal-based list picker that opens in a popup dialog.
   * USE CASE: When you need a mobile-friendly, touch-optimized picker for games
   * (e.g., selecting players, choosing contract options on mobile devices).
   * Opens a full-screen modal with scrollable options instead of a dropdown.
   *
   * @param {Object} options - Configuration object
   * @param {HTMLElement} [options.container] - Element to append the picker input to (optional)
   * @param {Array<string|number|Object>} [options.options=[]] - Picker options: strings, numbers, or {value, label}
   * @param {string} [options.placeholder='Select…'] - Placeholder text when nothing selected
   * @param {string|number|null} [options.selectedValue=null] - Pre-selected value
   * @param {Function} [options.onChange=null] - Callback: function(value)
   * @param {string} [options.className='input'] - CSS classes for the picker input element
   *
   * @returns {Object} {element: HTMLDivElement} - The clickable picker input div
   */
  function createListPicker({
    container,
    options = [],
    placeholder = 'Select…',
    selectedValue = null,
    onChange = null,
    className = 'input'
  } = {}) {
    // Normalize all options to {value, label} objects
    const parseOpt = (opt) => (
      typeof opt === 'string' || typeof opt === 'number'
        ? { value: String(opt), label: String(opt) }
        : { value: String(opt.value), label: opt.label != null ? String(opt.label) : String(opt.value) }
    );

    const normalized = options.map(parseOpt);
    
    // Create the clickable input div that displays current selection
    const input = document.createElement('div');
    input.className = className + ' picker-input';
    input.tabIndex = 0;  // Make it focusable for accessibility
    // Display the label of selected value, or placeholder if none selected
    input.textContent = (() => {
      const match = normalized.find(o => o.value === String(selectedValue));
      return match ? match.label : placeholder;
    })();

    /**
     * Open modal with scrollable list of options
     * Handles click events and updates input when selection is made
     */
    function openPicker() {
      // Build HTML for all picker rows
      const rows = normalized.map(o => `<div class="picker-row" data-value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</div>`).join('');
      
      // Create modal with list of options
      const pickerModal = new Modal({
        content: `<div class="picker-list">${rows}</div>`,
        actions: [],
        blockClose: false
      });
      pickerModal.show();
      
      // Attach click handlers to each picker row option
      const modalEl = pickerModal.modal;
      if (modalEl) {
        const listEl = modalEl.querySelector('.picker-list');
        listEl.querySelectorAll('.picker-row').forEach(row => {
          row.addEventListener('click', () => {
            // Get selected value and find corresponding label
            const val = row.getAttribute('data-value');
            const chosen = normalized.find(o => o.value === val);
            // Update input text with selected label
            input.textContent = chosen ? chosen.label : placeholder;
            // Fire onChange callback with selected value
            if (typeof onChange === 'function') onChange(val);
            // Close the modal after selection
            pickerModal.close();
          });
        });
      }
    }

    // Add click listener to open picker modal when input is clicked
    input.addEventListener('click', openPicker);
    // Add keyboard support: Enter or Space opens the picker
    input.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        openPicker(); 
      } 
    });

    // Append to container if provided
    if (container) container.appendChild(input);

    return { element: input };
  }

  // Expose globally for easy use in app.js and other modules
  window.createSelectDropdown = createSelectDropdown;
  window.createSimpleSelect = createSimpleSelect;
  window.createListPicker = createListPicker;
})();
