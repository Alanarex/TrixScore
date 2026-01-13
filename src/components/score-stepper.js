// score-stepper.js - Reusable ScoreStepper component
class ScoreStepper {
  constructor({ value = 0, min = -999, max = 999, step = 1, onChange = null, parent = null, allowManualInput = true }) {
    this.value = value;
    this.min = min;
    this.max = max;
    this.step = step;
    this.onChange = onChange;
    this.parent = parent;
    this.allowManualInput = allowManualInput;
    this.el = null;
  }
  render() {
    const wrap = document.createElement('div');
    wrap.className = 'score-stepper';
    
    let intervalId = null;
    let timeoutId = null;
    
    const startIncrement = (direction) => {
      // Clear any existing intervals
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      
      // Immediate first change
      this.setValue(this.value + (direction * this.step));
      
      // Delay before starting continuous increment
      timeoutId = setTimeout(() => {
        intervalId = setInterval(() => {
          this.setValue(this.value + (direction * this.step));
        }, 100); // Continue every 100ms
      }, 300); // Start after 300ms hold
    };
    
    const stopIncrement = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    
    const minus = document.createElement('button');
    minus.className = 'stepper-btn';
    minus.innerHTML = '<i class="fa-solid fa-minus"></i>';
    minus.onmousedown = () => startIncrement(-1);
    minus.onmouseup = stopIncrement;
    minus.onmouseleave = stopIncrement;
    minus.ontouchstart = (e) => { if (e.cancelable) e.preventDefault(); startIncrement(-1); };
    minus.ontouchend = stopIncrement;
    minus.ontouchcancel = stopIncrement;
    
    const valueDiv = document.createElement('div');
    valueDiv.className = 'stepper-value';
    if (this.allowManualInput) valueDiv.classList.add('editable');
    valueDiv.textContent = this.value;
    
    // Make value editable on click only if allowed
    if (this.allowManualInput) {
      valueDiv.onclick = () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.inputMode = 'numeric';
      input.pattern = '-?[0-9]*';
      input.value = this.value;
      input.className = 'stepper-value-input';
      
      // Filter input to only allow numbers and minus sign
      input.oninput = (e) => {
        let val = e.target.value;
        // Remove any characters that aren't digits or minus
        val = val.replace(/[^\d-]/g, '');
        // Allow minus only at the start
        if (val.indexOf('-') > 0) {
          val = val.replace(/-/g, '');
          if (val.charAt(0) !== '-') val = '-' + val;
        }
        // Remove duplicate minus signs
        const minusCount = (val.match(/-/g) || []).length;
        if (minusCount > 1) {
          val = '-' + val.replace(/-/g, '');
        }
        e.target.value = val;
      };
      
      const finishEdit = () => {
        let val = parseInt(input.value) || 0;
        this.setValue(val);
        valueDiv.textContent = this.value;
        valueDiv.classList.remove('hidden');
        input.remove();
      };
      
      input.onblur = finishEdit;
      input.onkeydown = (e) => {
        if (e.key === 'Enter') {
          finishEdit();
        } else if (e.key === 'Escape') {
          valueDiv.textContent = this.value;
          valueDiv.classList.remove('hidden');
          input.remove();
        }
      };
      
      valueDiv.classList.add('hidden');
      valueDiv.parentElement.insertBefore(input, valueDiv);
      input.focus();
      input.select();
    };
    }
    
    const plus = document.createElement('button');
    plus.className = 'stepper-btn';
    plus.innerHTML = '<i class="fa-solid fa-plus"></i>';
    plus.onmousedown = () => startIncrement(1);
    plus.onmouseup = stopIncrement;
    plus.onmouseleave = stopIncrement;
    plus.ontouchstart = (e) => { if (e.cancelable) e.preventDefault(); startIncrement(1); };
    plus.ontouchend = stopIncrement;
    plus.ontouchcancel = stopIncrement;
    
    wrap.appendChild(minus);
    wrap.appendChild(valueDiv);
    wrap.appendChild(plus);
    this.el = wrap;
    this.valueDiv = valueDiv;
    return wrap;
  }
  setValue(val, silent = false) {
    val = Math.max(this.min, Math.min(this.max, Number(val)));
    if (isNaN(val)) val = this.min;
    this.value = val;
    if (this.valueDiv) this.valueDiv.textContent = this.value;
    if (this.onChange && !silent) this.onChange(this.value);
  }
  getValue() {
    return this.value;
  }
}

// Helper function to create a labeled number input field
function createNumberInput({ label, value = 0, min = -999, max = 999, step = 1, onChange = null, allowManualInput = true }) {
  const row = document.createElement('div');
  row.className = 'number-input-field';
  
  const labelEl = document.createElement('label');
  labelEl.className = 'number-input-label';
  labelEl.textContent = label;
  row.appendChild(labelEl);
  
  const stepper = new ScoreStepper({
    value,
    min,
    max,
    step,
    onChange,
    allowManualInput
  });
  const stepperEl = stepper.render();
  stepperEl.classList.add('number-input-stepper');
  row.appendChild(stepperEl);
  
  // Attach stepper instance to row for external access
  row._stepper = stepper;
  
  return row;
}

window.ScoreStepper = ScoreStepper;
window.createNumberInput = createNumberInput;
