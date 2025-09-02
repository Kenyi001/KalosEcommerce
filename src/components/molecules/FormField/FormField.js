/**
 * FormField Component - Kalos Design System
 * A comprehensive form field component that handles various input types,
 * validation, error states, and accessibility features
 */

import { BaseComponent } from '../../BaseComponent.js';

export class FormField extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    // Default props with comprehensive configuration
    this.props = {
      type: 'text',              // text, email, password, number, tel, url, textarea, select
      name: '',
      label: '',
      placeholder: '',
      value: '',
      required: false,
      disabled: false,
      readonly: false,
      error: '',
      helpText: '',
      successMessage: '',
      options: [],               // For select type
      rows: 4,                  // For textarea type
      min: null,                // For number/date types
      max: null,                // For number/date types
      step: null,               // For number type
      pattern: null,            // For validation
      autocomplete: null,       // Autocomplete attribute
      validation: null,         // Custom validation function
      onChange: null,
      onBlur: null,
      onFocus: null,
      onInput: null,
      className: '',
      inputClassName: '',
      labelClassName: '',
      id: null,
      ariaDescribedBy: null,
      maxLength: null,
      minLength: null,
      ...props
    };

    // Validate required props
    if (!this.props.name) {
      console.warn('FormField requires a name prop');
    }

    this.state = {
      value: this.props.value || '',
      error: this.props.error || '',
      touched: false,
      focused: false,
      valid: true
    };

    // Generate unique IDs
    this.fieldId = this.props.id || `field-${this.componentId}`;
    this.errorId = `${this.fieldId}-error`;
    this.helpId = `${this.fieldId}-help`;
    this.successId = `${this.fieldId}-success`;
  }

  render() {
    const {
      type,
      name,
      label,
      placeholder,
      required,
      disabled,
      readonly,
      helpText,
      successMessage,
      options,
      rows,
      min,
      max,
      step,
      pattern,
      autocomplete,
      className,
      inputClassName,
      labelClassName,
      maxLength,
      minLength
    } = this.props;

    const { value, error, touched, focused, valid } = this.state;
    
    const hasError = touched && error;
    const hasSuccess = touched && !error && successMessage && valid;
    
    // Build aria-describedby
    const ariaDescribedBy = [];
    if (hasError) ariaDescribedBy.push(this.errorId);
    if (helpText && !hasError) ariaDescribedBy.push(this.helpId);
    if (hasSuccess) ariaDescribedBy.push(this.successId);
    if (this.props.ariaDescribedBy) ariaDescribedBy.push(this.props.ariaDescribedBy);

    return `
      <div class="form-field ${className}" data-component="form-field">
        ${label ? this.renderLabel() : ''}
        
        <div class="form-input-wrapper">
          ${this.renderInput()}
          ${this.renderValidationIcon()}
        </div>
        
        ${hasError ? this.renderError() : ''}
        ${hasSuccess ? this.renderSuccess() : ''}
        ${helpText && !hasError && !hasSuccess ? this.renderHelpText() : ''}
      </div>
    `;
  }

  renderLabel() {
    const { label, required, labelClassName } = this.props;
    
    return `
      <label 
        for="${this.fieldId}" 
        class="form-label ${required ? 'form-label-required' : ''} ${labelClassName}"
      >
        ${this.escapeHtml(label)}
        ${required ? '<span class="form-required-indicator" aria-label="required">*</span>' : ''}
      </label>
    `;
  }

  renderInput() {
    const {
      type,
      name,
      placeholder,
      disabled,
      readonly,
      options,
      rows,
      min,
      max,
      step,
      pattern,
      autocomplete,
      inputClassName,
      maxLength,
      minLength
    } = this.props;

    const { value, error, touched, focused } = this.state;
    
    const hasError = touched && error;
    const inputClasses = this.mergeClasses(
      'form-input',
      hasError ? 'form-input-error' : '',
      disabled ? 'form-input-disabled' : '',
      readonly ? 'form-input-readonly' : '',
      focused ? 'form-input-focused' : '',
      inputClassName
    );

    // Build aria-describedby
    const ariaDescribedBy = [];
    if (hasError) ariaDescribedBy.push(this.errorId);
    if (this.props.helpText && !hasError) ariaDescribedBy.push(this.helpId);
    if (this.props.ariaDescribedBy) ariaDescribedBy.push(this.props.ariaDescribedBy);

    const commonAttrs = `
      name="${this.escapeHtml(name)}"
      id="${this.fieldId}"
      class="${inputClasses}"
      ${placeholder ? `placeholder="${this.escapeHtml(placeholder)}"` : ''}
      ${disabled ? 'disabled' : ''}
      ${readonly ? 'readonly' : ''}
      ${pattern ? `pattern="${this.escapeHtml(pattern)}"` : ''}
      ${autocomplete ? `autocomplete="${this.escapeHtml(autocomplete)}"` : ''}
      ${maxLength ? `maxlength="${maxLength}"` : ''}
      ${minLength ? `minlength="${minLength}"` : ''}
      ${ariaDescribedBy.length ? `aria-describedby="${ariaDescribedBy.join(' ')}"` : ''}
      ${hasError ? 'aria-invalid="true"' : ''}
      ${this.props.required ? 'required aria-required="true"' : ''}
    `.trim();

    switch (type) {
      case 'textarea':
        return `
          <textarea
            ${commonAttrs}
            rows="${rows}"
          >${this.escapeHtml(value)}</textarea>
        `;

      case 'select':
        return `
          <select ${commonAttrs}>
            ${placeholder ? `<option value="">${this.escapeHtml(placeholder)}</option>` : ''}
            ${options.map(option => {
              const optionValue = typeof option === 'object' ? option.value : option;
              const optionLabel = typeof option === 'object' ? option.label : option;
              const isSelected = optionValue === value;
              
              return `
                <option 
                  value="${this.escapeHtml(optionValue)}" 
                  ${isSelected ? 'selected' : ''}
                  ${typeof option === 'object' && option.disabled ? 'disabled' : ''}
                >
                  ${this.escapeHtml(optionLabel)}
                </option>
              `;
            }).join('')}
          </select>
        `;

      case 'number':
        return `
          <input
            type="number"
            value="${this.escapeHtml(value)}"
            ${min !== null ? `min="${min}"` : ''}
            ${max !== null ? `max="${max}"` : ''}
            ${step !== null ? `step="${step}"` : ''}
            ${commonAttrs}
          />
        `;

      default:
        return `
          <input
            type="${type}"
            value="${this.escapeHtml(value)}"
            ${commonAttrs}
          />
        `;
    }
  }

  renderValidationIcon() {
    const { error, touched, valid } = this.state;
    const { successMessage } = this.props;
    
    if (!touched) return '';
    
    if (error) {
      return `
        <div class="form-validation-icon form-validation-icon-error">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5C3.962 16.333 4.924 18 6.464 18z"/>
          </svg>
        </div>
      `;
    }
    
    if (valid && successMessage) {
      return `
        <div class="form-validation-icon form-validation-icon-success">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      `;
    }
    
    return '';
  }

  renderError() {
    const { error } = this.state;
    
    return `
      <div class="form-error" id="${this.errorId}" role="alert">
        <svg class="form-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5C3.962 16.333 4.924 18 6.464 18z"/>
        </svg>
        <span>${this.escapeHtml(error)}</span>
      </div>
    `;
  }

  renderSuccess() {
    const { successMessage } = this.props;
    
    return `
      <div class="form-success" id="${this.successId}">
        <svg class="form-success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>${this.escapeHtml(successMessage)}</span>
      </div>
    `;
  }

  renderHelpText() {
    const { helpText } = this.props;
    
    return `
      <div class="form-help-text" id="${this.helpId}">
        ${this.escapeHtml(helpText)}
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="form-field"]';
    this.inputElement = this.element.querySelector('.form-input');
  }

  bindEvents() {
    if (!this.inputElement) return;

    // Input change handler
    this.addEventListener(this.inputElement, 'input', (e) => {
      const value = e.target.value;
      this.setState({ value });
      
      // Validate on input if field was previously touched and had an error
      if (this.state.touched && this.state.error) {
        this.validate();
      }
      
      if (this.props.onInput) {
        this.props.onInput(value, e);
      }
    });

    // Change handler (for selects and other special cases)
    this.addEventListener(this.inputElement, 'change', (e) => {
      const value = e.target.value;
      
      if (this.state.value !== value) {
        this.setState({ value });
        
        if (this.state.touched) {
          this.validate();
        }
      }
      
      if (this.props.onChange) {
        this.props.onChange(value, e);
      }
    });

    // Focus handler
    this.addEventListener(this.inputElement, 'focus', (e) => {
      this.setState({ focused: true });
      
      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    });

    // Blur handler (validation)
    this.addEventListener(this.inputElement, 'blur', (e) => {
      this.setState({ 
        touched: true,
        focused: false
      });
      
      this.validate();
      
      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    });
  }

  validate() {
    const { validation, required, type, min, max, pattern, minLength, maxLength } = this.props;
    const { value } = this.state;
    let error = '';
    let valid = true;

    // Required validation
    if (required && (!value || value.toString().trim() === '')) {
      error = 'Este campo es requerido';
      valid = false;
    }
    // Type-specific validation
    else if (value && value.toString().trim()) {
      switch (type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Ingresa un email válido';
            valid = false;
          }
          break;
          
        case 'tel':
          const phoneRegex = /^[67]\d{7}$/; // Bolivian phone format
          if (!phoneRegex.test(value.replace(/\D/g, ''))) {
            error = 'Ingresa un teléfono válido (ej: 70123456)';
            valid = false;
          }
          break;
          
        case 'url':
          try {
            new URL(value);
          } catch {
            error = 'Ingresa una URL válida';
            valid = false;
          }
          break;
          
        case 'number':
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            error = 'Ingresa un número válido';
            valid = false;
          } else {
            if (min !== null && numValue < min) {
              error = `El valor mínimo es ${min}`;
              valid = false;
            } else if (max !== null && numValue > max) {
              error = `El valor máximo es ${max}`;
              valid = false;
            }
          }
          break;
      }
      
      // Pattern validation
      if (valid && pattern) {
        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
          error = 'El formato no es válido';
          valid = false;
        }
      }
      
      // Length validation
      if (valid && minLength && value.length < minLength) {
        error = `Mínimo ${minLength} caracteres`;
        valid = false;
      }
      
      if (valid && maxLength && value.length > maxLength) {
        error = `Máximo ${maxLength} caracteres`;
        valid = false;
      }
    }
    
    // Custom validation
    if (valid && validation && typeof validation === 'function') {
      const validationResult = validation(value, this.props);
      if (validationResult !== true) {
        error = typeof validationResult === 'string' ? validationResult : 'Valor inválido';
        valid = false;
      }
    }

    this.setState({ error, valid });
    return valid;
  }

  // Public API methods
  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.setState({ value });
    return this;
  }

  getError() {
    return this.state.error;
  }

  setError(error) {
    this.setState({ error, touched: true, valid: !error });
    return this;
  }

  clearError() {
    this.setState({ error: '', valid: true });
    return this;
  }

  isValid() {
    return this.validate();
  }

  isTouched() {
    return this.state.touched;
  }

  focus() {
    if (this.inputElement) {
      this.inputElement.focus();
    }
    return this;
  }

  blur() {
    if (this.inputElement) {
      this.inputElement.blur();
    }
    return this;
  }

  reset() {
    this.setState({
      value: this.props.value || '',
      error: '',
      touched: false,
      focused: false,
      valid: true
    });
    return this;
  }

  setTouched(touched = true) {
    this.setState({ touched });
    return this;
  }

  // Static factory methods for common field types
  static email(props = {}) {
    return new FormField({ type: 'email', ...props });
  }

  static password(props = {}) {
    return new FormField({ type: 'password', ...props });
  }

  static textarea(props = {}) {
    return new FormField({ type: 'textarea', ...props });
  }

  static select(options, props = {}) {
    return new FormField({ type: 'select', options, ...props });
  }

  static number(props = {}) {
    return new FormField({ type: 'number', ...props });
  }

  static phone(props = {}) {
    return new FormField({ 
      type: 'tel', 
      placeholder: 'ej: 70123456',
      ...props 
    });
  }
}

// Common validation functions
export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Ingresa un email válido';
  },
  
  phone: (value) => {
    const phoneRegex = /^[67]\d{7}$/;
    const cleaned = value.replace(/\D/g, '');
    return phoneRegex.test(cleaned) || 'Ingresa un teléfono válido (ej: 70123456)';
  },
  
  required: (value) => {
    return (value && value.toString().trim()) || 'Este campo es requerido';
  },
  
  minLength: (min) => (value) => {
    return value.length >= min || `Mínimo ${min} caracteres`;
  },
  
  maxLength: (max) => (value) => {
    return value.length <= max || `Máximo ${max} caracteres`;
  },
  
  match: (otherField) => (value, props) => {
    return value === otherField.getValue() || 'Los valores no coinciden';
  },
  
  min: (minValue) => (value) => {
    const num = parseFloat(value);
    return (isNaN(num) || num >= minValue) || `El valor mínimo es ${minValue}`;
  },
  
  max: (maxValue) => (value) => {
    const num = parseFloat(value);
    return (isNaN(num) || num <= maxValue) || `El valor máximo es ${maxValue}`;
  }
};

// Factory function
export function createFormField(props = {}) {
  return new FormField(props);
}

export default FormField;