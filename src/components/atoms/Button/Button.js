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

    // Use only Tailwind CSS classes instead of custom Button.css
    const baseClasses = this.mergeClasses(
      // Base button styles (Tailwind only)
      'inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      
      // Size classes (Tailwind only)
      size === 'xs' ? 'px-2.5 py-1.5 text-xs min-h-6' :
      size === 'sm' ? 'px-3 py-2 text-sm min-h-8' :
      size === 'md' ? 'px-4 py-2.5 text-base min-h-10' :
      size === 'lg' ? 'px-5 py-3 text-lg min-h-12' :
      size === 'xl' ? 'px-6 py-3.5 text-xl min-h-14' : 'px-4 py-2.5 text-base min-h-10',
      
      // Variant classes (Tailwind only)
      variant === 'primary' ? 'bg-brand text-white border-brand hover:bg-brand-hover focus:ring-brand' :
      variant === 'secondary' ? 'bg-navy text-white border-navy hover:bg-navy-hover focus:ring-navy' :
      variant === 'ghost' ? 'bg-transparent text-navy border-2 border-navy/30 hover:bg-navy/10 hover:border-navy focus:ring-navy' :
      variant === 'danger' ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-red-500' :
      variant === 'success' ? 'bg-green-600 text-white border-green-600 hover:bg-green-700 focus:ring-green-500' :
      'bg-brand text-white border-brand hover:bg-brand-hover focus:ring-brand',
      
      // State classes (Tailwind only)
      fullWidth ? 'w-full' : '',
      disabled ? 'opacity-60' : '', // FIX: Remove cursor-not-allowed to keep clicks working
      loading ? 'opacity-60' : '', // FIX: Remove cursor-wait to keep clicks working
      pressed ? 'transform translate-y-0.5' : '',
      icon && !children ? 'aspect-square p-2' : '',
      'cursor-pointer', // FIX: Always keep cursor pointer for clicks
      
      // Custom classes passed via props
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
    console.log('🔘 Button afterMount called:', {
      hasElement: !!this.element,
      componentId: this.componentId,
      hasOnClick: !!this.props.onClick
    });
  }

  bindEvents() {
    if (!this.element) {
      console.warn('🚨 Button bindEvents called but element is null:', this.componentId);
      return;
    }
    
    // Prevent multiple bindings using component instance tracking
    if (this._eventsbound) {
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.log('🔗 Button events already bound, skipping:', this.componentId);
      }
      return;
    }
    
    // Only log in development mode
    if (import.meta.env.DEV) {
      console.log('🔗 Button bindEvents called:', {
        elementExists: !!this.element,
        componentId: this.componentId,
        hasOnClick: !!this.props.onClick
      });
    }

    // FIX: Use addEventListener instead of onclick to avoid overwriting manual handlers
    if (this.props.onClick) {
    this.addEventListener(this.element, 'click', (e) => {
        console.log('🔘 Button click event triggered:', {
          disabled: this.state.disabled,
          loading: this.state.loading,
          hasOnClick: !!this.props.onClick
        });
        
      if (this.state.disabled || this.state.loading) {
          console.log('🔘 Button click prevented - disabled or loading');
        e.preventDefault();
          e.stopPropagation();
        return;
      }

        console.log('🔘 Executing button onClick handler');
        this.props.onClick(e);
      });
    } else {
      console.log('🔘 No onClick handler defined for button');
    }
    
    // Mark component as having events bound
    this._eventsbound = true;
    
    // Only log in development mode
    if (import.meta.env.DEV) {
      console.log('✅ Button click event listener added successfully:', this.componentId);
    }

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


  afterMount() {

    super.afterMount();

    this.selector = '[data-component="button"]';

    console.log('🔘 Button afterMount called:', {
      hasElement: !!this.element,
      componentId: this.componentId,
      hasOnClick: !!this.props.onClick
    });
  }



  bindEvents() {

    if (!this.element) {
      console.warn('🚨 Button bindEvents called but element is null:', this.componentId);
      return;
    }
    
    // Prevent multiple bindings using component instance tracking
    if (this._eventsbound) {
      console.log('🔗 Button events already bound, skipping:', this.componentId);
      return;
    }
    
    console.log('🔗 Button bindEvents called:', {
      elementExists: !!this.element,
      componentId: this.componentId,
      hasOnClick: !!this.props.onClick
    });


    // Click handler

    this.addEventListener(this.element, 'click', (e) => {

      console.log('🔘 Button click event triggered:', {
        disabled: this.state.disabled,
        loading: this.state.loading,
        hasOnClick: !!this.props.onClick
      });
      
      if (this.state.disabled || this.state.loading) {

        console.log('🔘 Button click prevented - disabled or loading');
        e.preventDefault();

        e.stopPropagation();
        return;

      }



      if (this.props.onClick) {

        console.log('🔘 Executing button onClick handler');
        this.props.onClick(e);

      } else {
        console.log('🔘 No onClick handler defined for button');
      }

    });

    
    // Mark component as having events bound
    this._eventsbound = true;
    
    console.log('✅ Button click event listener added successfully:', this.componentId);


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
