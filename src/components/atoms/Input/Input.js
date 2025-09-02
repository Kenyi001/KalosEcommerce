/**
 * Input Atomic Component - Kalos Design System
 * Various input types with validation and accessibility
 */

import { BaseComponent } from '../../BaseComponent.js';

export class Input extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      type: 'text',           // text, email, password, number, tel, url
      name: '',
      id: '',
      value: '',
      placeholder: '',
      disabled: false,
      required: false,
      readonly: false,
      autoComplete: '',
      maxLength: null,
      minLength: null,
      min: null,
      max: null,
      step: null,
      pattern: null,
      size: 'md',            // sm, md, lg
      variant: 'default',    // default, error, success
      icon: null,            // left icon
      iconRight: null,       // right icon
      className: '',
      onChange: () => {},
      onFocus: () => {},
      onBlur: () => {},
      onKeyDown: () => {},
      ...props
    };

    this.state = {
      value: this.props.value,
      focused: false,
      hasValue: !!this.props.value
    };
  }

  render() {
    const {
      type,
      name,
      id,
      placeholder,
      disabled,
      required,
      readonly,
      autoComplete,
      maxLength,
      minLength,
      min,
      max,
      step,
      pattern,
      size,
      variant,
      icon,
      iconRight,
      className
    } = this.props;

    const { value, focused, hasValue } = this.state;
    
    const inputClasses = [
      'input',
      `input-${size}`,
      `input-${variant}`,
      icon ? 'input-with-icon-left' : '',
      iconRight ? 'input-with-icon-right' : '',
      disabled ? 'input-disabled' : '',
      focused ? 'input-focused' : '',
      hasValue ? 'input-has-value' : '',
      className
    ].filter(Boolean).join(' ');

    const inputId = id || name;

    return `
      <div class="input-wrapper" data-component="input">
        ${icon ? `
          <div class="input-icon input-icon-left">
            ${icon}
          </div>
        ` : ''}
        
        <input
          type="${type}"
          id="${inputId}"
          name="${name}"
          value="${value}"
          placeholder="${placeholder}"
          class="${inputClasses}"
          ${disabled ? 'disabled' : ''}
          ${required ? 'required' : ''}
          ${readonly ? 'readonly' : ''}
          ${autoComplete ? `autocomplete="${autoComplete}"` : ''}
          ${maxLength ? `maxlength="${maxLength}"` : ''}
          ${minLength ? `minlength="${minLength}"` : ''}
          ${min ? `min="${min}"` : ''}
          ${max ? `max="${max}"` : ''}
          ${step ? `step="${step}"` : ''}
          ${pattern ? `pattern="${pattern}"` : ''}
        />
        
        ${iconRight ? `
          <div class="input-icon input-icon-right">
            ${iconRight}
          </div>
        ` : ''}
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="input"]';
    this.inputElement = this.element.querySelector('input');
  }

  bindEvents() {
    if (!this.inputElement) return;

    // Handle input change
    this.addEventListener(this.inputElement, 'input', (e) => {
      const value = e.target.value;
      this.setState({ 
        value,
        hasValue: !!value
      });
      
      if (this.props.onChange) {
        this.props.onChange(value, e);
      }
    });

    // Handle focus
    this.addEventListener(this.inputElement, 'focus', (e) => {
      this.setState({ focused: true });
      
      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    });

    // Handle blur
    this.addEventListener(this.inputElement, 'blur', (e) => {
      this.setState({ focused: false });
      
      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    });

    // Handle keydown
    this.addEventListener(this.inputElement, 'keydown', (e) => {
      if (this.props.onKeyDown) {
        this.props.onKeyDown(e);
      }
    });
  }

  // Public methods
  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.setState({ 
      value,
      hasValue: !!value
    });
    if (this.inputElement) {
      this.inputElement.value = value;
    }
  }

  focus() {
    if (this.inputElement) {
      this.inputElement.focus();
    }
  }

  blur() {
    if (this.inputElement) {
      this.inputElement.blur();
    }
  }

  clear() {
    this.setValue('');
  }

  setVariant(variant) {
    // Remove old variant classes
    const oldClass = this.element.querySelector('input').className;
    const newClass = oldClass.replace(/input-\w+(?=\s|$)/g, '').trim();
    
    this.element.querySelector('input').className = `${newClass} input-${variant}`;
    this.props.variant = variant;
  }
}

// Factory function
export function createInput(props) {
  return new Input(props);
}

// Specialized input components
export class EmailInput extends Input {
  constructor(props = {}) {
    super({
      type: 'email',
      autoComplete: 'email',
      ...props
    });
  }
}

export class PasswordInput extends Input {
  constructor(props = {}) {
    super({
      type: 'password',
      autoComplete: 'current-password',
      ...props
    });
  }
}

export class NumberInput extends Input {
  constructor(props = {}) {
    super({
      type: 'number',
      ...props
    });
  }
}

export class PhoneInput extends Input {
  constructor(props = {}) {
    super({
      type: 'tel',
      autoComplete: 'tel',
      pattern: '[67][0-9]{7}',
      placeholder: 'Ej: 70123456',
      ...props
    });
  }
}