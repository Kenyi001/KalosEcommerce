/**
 * Button Component - Kalos Design System
 * A flexible button component with multiple variants, sizes, and states
 */

import { BaseComponent } from '../../BaseComponent.js';

export class Button extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    // Default props with validation
    this.props = {
      variant: 'primary',        // primary, secondary, ghost, danger, success
      size: 'md',               // xs, sm, md, lg, xl
      disabled: false,
      loading: false,
      fullWidth: false,
      type: 'button',           // button, submit, reset
      children: '',
      onClick: null,
      onFocus: null,
      onBlur: null,
      className: '',
      icon: null,               // Icon component or string
      iconPosition: 'left',     // left, right
      ariaLabel: null,
      id: null,
      ...props
    };

    // Validate props
    this.validateProps();
    
    this.state = {
      loading: this.props.loading,
      disabled: this.props.disabled,
      focused: false,
      pressed: false
    };
  }

  validateProps() {
    const validVariants = ['primary', 'secondary', 'ghost', 'danger', 'success'];
    const validSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    const validTypes = ['button', 'submit', 'reset'];
    const validIconPositions = ['left', 'right'];

    if (!validVariants.includes(this.props.variant)) {
      console.warn(`Invalid button variant: ${this.props.variant}. Using 'primary'.`);
      this.props.variant = 'primary';
    }

    if (!validSizes.includes(this.props.size)) {
      console.warn(`Invalid button size: ${this.props.size}. Using 'md'.`);
      this.props.size = 'md';
    }

    if (!validTypes.includes(this.props.type)) {
      console.warn(`Invalid button type: ${this.props.type}. Using 'button'.`);
      this.props.type = 'button';
    }

    if (!validIconPositions.includes(this.props.iconPosition)) {
      console.warn(`Invalid icon position: ${this.props.iconPosition}. Using 'left'.`);
      this.props.iconPosition = 'left';
    }
  }

  render() {
    const {
      variant,
      size,
      fullWidth,
      type,
      children,
      className,
      icon,
      iconPosition,
      ariaLabel,
      id
    } = this.props;

    const { loading, disabled, focused, pressed } = this.state;

    const baseClasses = this.mergeClasses(
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      fullWidth ? 'btn-full-width' : '',
      disabled || loading ? 'btn-disabled' : '',
      loading ? 'btn-loading' : '',
      focused ? 'btn-focused' : '',
      pressed ? 'btn-pressed' : '',
      icon ? 'btn-with-icon' : '',
      icon && !children ? 'btn-icon-only' : '',
      className
    );

    const buttonId = id || `btn-${this.componentId}`;

    return `
      <button
        type="${type}"
        class="${baseClasses}"
        ${disabled || loading ? 'disabled aria-disabled="true"' : ''}
        ${ariaLabel ? `aria-label="${this.escapeHtml(ariaLabel)}"` : ''}
        id="${buttonId}"
        data-component="button"
        data-variant="${variant}"
        data-size="${size}"
      >
        ${loading ? this.renderLoadingSpinner() : ''}
        
        <span class="btn-content ${loading ? 'btn-content-hidden' : ''}">
          ${icon && iconPosition === 'left' ? this.renderIcon() : ''}
          ${children ? `<span class="btn-text">${children}</span>` : ''}
          ${icon && iconPosition === 'right' ? this.renderIcon() : ''}
        </span>
      </button>
    `;
  }

  renderIcon() {
    const { icon } = this.props;
    
    if (!icon) return '';
    
    // If icon is a string, treat it as an emoji or text
    if (typeof icon === 'string') {
      return `<span class="btn-icon" aria-hidden="true">${icon}</span>`;
    }
    
    // If icon is an object with svg property
    if (typeof icon === 'object' && icon.svg) {
      return `<span class="btn-icon" aria-hidden="true">${icon.svg}</span>`;
    }
    
    return '';
  }

  renderLoadingSpinner() {
    const { size } = this.props;
    
    // Determine spinner size based on button size
    let spinnerSize = '16';
    switch (size) {
      case 'xs':
      case 'sm':
        spinnerSize = '14';
        break;
      case 'lg':
      case 'xl':
        spinnerSize = '18';
        break;
      default:
        spinnerSize = '16';
    }

    return `
      <span class="btn-spinner" aria-hidden="true">
        <svg class="btn-spinner-icon" width="${spinnerSize}" height="${spinnerSize}" viewBox="0 0 24 24" fill="none">
          <circle 
            class="btn-spinner-circle" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-dasharray="31.416"
            stroke-dashoffset="31.416">
            <animate 
              attributeName="stroke-dasharray" 
              dur="1.5s" 
              values="0 31.416;15.708 15.708;0 31.416" 
              repeatCount="indefinite"/>
            <animate 
              attributeName="stroke-dashoffset" 
              dur="1.5s" 
              values="0;-15.708;-31.416" 
              repeatCount="indefinite"/>
          </circle>
        </svg>
      </span>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="button"]';
  }

  bindEvents() {
    if (!this.element) return;

    // Click handler
    this.addEventListener(this.element, 'click', (e) => {
      if (this.state.disabled || this.state.loading) {
        e.preventDefault();
        return;
      }

      if (this.props.onClick) {
        this.props.onClick(e);
      }
    });

    // Focus handlers
    this.addEventListener(this.element, 'focus', (e) => {
      this.setState({ focused: true });
      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    });

    this.addEventListener(this.element, 'blur', (e) => {
      this.setState({ focused: false });
      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    });

    // Mouse down/up for pressed state
    this.addEventListener(this.element, 'mousedown', () => {
      if (!this.state.disabled && !this.state.loading) {
        this.setState({ pressed: true });
      }
    });

    this.addEventListener(this.element, 'mouseup', () => {
      this.setState({ pressed: false });
    });

    this.addEventListener(this.element, 'mouseleave', () => {
      this.setState({ pressed: false });
    });

    // Keyboard handlers for pressed state
    this.addEventListener(this.element, 'keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !this.state.disabled && !this.state.loading) {
        this.setState({ pressed: true });
      }
    });

    this.addEventListener(this.element, 'keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.setState({ pressed: false });
      }
    });
  }

  // Public API methods
  setLoading(loading) {
    this.setState({ loading: Boolean(loading) });
    return this;
  }

  setDisabled(disabled) {
    this.setState({ disabled: Boolean(disabled) });
    return this;
  }

  setText(text) {
    this.props.children = text;
    this.rerender();
    return this;
  }

  focus() {
    if (this.element) {
      this.element.focus();
    }
    return this;
  }

  blur() {
    if (this.element) {
      this.element.blur();
    }
    return this;
  }

  click() {
    if (this.element && !this.state.disabled && !this.state.loading) {
      this.element.click();
    }
    return this;
  }

  // Static factory methods for common button types
  static primary(props = {}) {
    return new Button({ variant: 'primary', ...props });
  }

  static secondary(props = {}) {
    return new Button({ variant: 'secondary', ...props });
  }

  static ghost(props = {}) {
    return new Button({ variant: 'ghost', ...props });
  }

  static danger(props = {}) {
    return new Button({ variant: 'danger', ...props });
  }

  static success(props = {}) {
    return new Button({ variant: 'success', ...props });
  }

  // Helper for creating icon buttons
  static icon(icon, props = {}) {
    return new Button({
      icon,
      ariaLabel: props.ariaLabel || 'Icon button',
      ...props
    });
  }
}

// Factory function for easier instantiation
export function createButton(props = {}) {
  return new Button(props);
}

// Export as default
export default Button;