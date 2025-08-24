// Input component for Kalos E-commerce
export class Input {
  constructor(config = {}) {
    this.config = {
      type: config.type || 'text',
      placeholder: config.placeholder || '',
      value: config.value || '',
      label: config.label || '',
      error: config.error || '',
      required: config.required || false,
      disabled: config.disabled || false,
      fullWidth: config.fullWidth || true,
      id: config.id || `input-${Math.random().toString(36).substr(2, 9)}`,
      name: config.name || '',
      className: config.className || '',
      onInput: config.onInput || (() => {}),
      onBlur: config.onBlur || (() => {}),
      onFocus: config.onFocus || (() => {}),
      ...config
    };
  }

  getInputClasses() {
    const baseClasses = 'block w-full px-3 py-2.5 text-base text-navy-900 bg-white border rounded-lg font-inter placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const errorClass = this.config.error ? 'border-error focus:border-error' : 'border-gray-200 focus:border-brand';
    const widthClass = this.config.fullWidth ? 'w-full' : '';
    
    return `${baseClasses} ${errorClass} ${widthClass} ${this.config.className}`.trim();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'space-y-1';

    // Label
    if (this.config.label) {
      const label = document.createElement('label');
      label.htmlFor = this.config.id;
      label.className = 'block text-sm font-semibold text-navy-900 font-inter';
      label.textContent = this.config.label;
      
      if (this.config.required) {
        const asterisk = document.createElement('span');
        asterisk.className = 'text-error ml-1';
        asterisk.textContent = '*';
        label.appendChild(asterisk);
      }
      
      container.appendChild(label);
    }

    // Input
    const input = document.createElement('input');
    input.type = this.config.type;
    input.id = this.config.id;
    input.name = this.config.name;
    input.placeholder = this.config.placeholder;
    input.value = this.config.value;
    input.required = this.config.required;
    input.disabled = this.config.disabled;
    input.className = this.getInputClasses();

    // Event listeners
    input.addEventListener('input', (e) => {
      this.config.value = e.target.value;
      this.config.onInput(e.target.value, e);
    });

    input.addEventListener('blur', (e) => {
      this.config.onBlur(e.target.value, e);
    });

    input.addEventListener('focus', (e) => {
      this.config.onFocus(e.target.value, e);
    });

    container.appendChild(input);

    // Error message
    if (this.config.error) {
      const errorMsg = document.createElement('p');
      errorMsg.className = 'text-sm text-error font-inter';
      errorMsg.textContent = this.config.error;
      container.appendChild(errorMsg);
    }

    this.element = container;
    this.input = input;
    return container;
  }

  // Methods to update the input
  setValue(value) {
    this.config.value = value;
    if (this.input) {
      this.input.value = value;
    }
  }

  setError(error) {
    this.config.error = error;
    if (this.element) {
      // Remove existing error message
      const existingError = this.element.querySelector('.text-error');
      if (existingError) {
        existingError.remove();
      }

      // Update input classes
      this.input.className = this.getInputClasses();

      // Add new error message if exists
      if (error) {
        const errorMsg = document.createElement('p');
        errorMsg.className = 'text-sm text-error font-inter';
        errorMsg.textContent = error;
        this.element.appendChild(errorMsg);
      }
    }
  }

  getValue() {
    return this.input ? this.input.value : this.config.value;
  }

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  // Static method for quick input creation
  static create(config) {
    const input = new Input(config);
    return input.render();
  }
}

export default Input;