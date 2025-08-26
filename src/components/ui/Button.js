// Button component for Kalos E-commerce
export class Button {
  constructor(config = {}) {
    this.config = {
      text: config.text || 'Button',
      type: config.type || 'button',
      variant: config.variant || 'primary', // primary, secondary, outline, ghost
      size: config.size || 'md', // sm, md, lg
      disabled: config.disabled || false,
      loading: config.loading || false,
      fullWidth: config.fullWidth || false,
      onClick: config.onClick || (() => {}),
      className: config.className || '',
      ...config
    };
  }

  getVariantClasses() {
    const variants = {
      primary: 'bg-brand text-white hover:bg-brand-600 focus:bg-brand-700 border-transparent',
      secondary: 'bg-navy text-white hover:bg-navy-700 focus:bg-navy-800 border-transparent',
      outline: 'bg-transparent text-brand border-brand hover:bg-brand-50 focus:bg-brand-100',
      ghost: 'bg-transparent text-navy hover:bg-gray-50 focus:bg-gray-100 border-transparent'
    };
    return variants[this.config.variant] || variants.primary;
  }

  getSizeClasses() {
    const sizes = {
      sm: 'px-3 py-2 text-sm h-8',
      md: 'px-4 py-2.5 text-base h-10',
      lg: 'px-6 py-3 text-lg h-12'
    };
    return sizes[this.config.size] || sizes.md;
  }

  render() {
    const baseClasses = 'inline-flex items-center justify-center font-inter font-semibold rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();
    const widthClass = this.config.fullWidth ? 'w-full' : '';
    const disabledClass = this.config.disabled ? 'pointer-events-none' : '';
    
    const allClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${disabledClass} ${this.config.className}`.trim();

    const button = document.createElement('button');
    button.type = this.config.type;
    button.className = allClasses;
    button.disabled = this.config.disabled;

    // Loading state
    if (this.config.loading) {
      button.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Cargando...
      `;
    } else {
      button.textContent = this.config.text;
    }

    // Event listeners
    button.addEventListener('click', (e) => {
      if (!this.config.disabled && !this.config.loading) {
        this.config.onClick(e);
      }
    });

    return button;
  }

  // Static method for quick button creation
  static create(config) {
    const button = new Button(config);
    return button.render();
  }
}

export default Button;