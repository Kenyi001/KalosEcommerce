// Card component for Kalos E-commerce
export class Card {
  constructor(config = {}) {
    this.config = {
      padding: config.padding || 'md', // sm, md, lg, xl
      shadow: config.shadow || 'soft', // none, soft, medium, strong
      rounded: config.rounded || 'lg', // sm, md, lg, xl
      border: config.border || false,
      className: config.className || '',
      children: config.children || [],
      ...config
    };
  }

  getPaddingClasses() {
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    };
    return paddings[this.config.padding] || paddings.md;
  }

  getShadowClasses() {
    const shadows = {
      none: '',
      soft: 'shadow-soft',
      medium: 'shadow-medium',
      strong: 'shadow-strong'
    };
    return shadows[this.config.shadow] || shadows.soft;
  }

  getRoundedClasses() {
    const rounded = {
      none: '',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl'
    };
    return rounded[this.config.rounded] || rounded.lg;
  }

  render() {
    const baseClasses = 'bg-white';
    const paddingClasses = this.getPaddingClasses();
    const shadowClasses = this.getShadowClasses();
    const roundedClasses = this.getRoundedClasses();
    const borderClass = this.config.border ? 'border border-gray-200' : '';
    
    const allClasses = `${baseClasses} ${paddingClasses} ${shadowClasses} ${roundedClasses} ${borderClass} ${this.config.className}`.trim();

    const card = document.createElement('div');
    card.className = allClasses;

    // Add children
    if (Array.isArray(this.config.children)) {
      this.config.children.forEach(child => {
        if (child instanceof HTMLElement) {
          card.appendChild(child);
        } else if (typeof child === 'string') {
          card.innerHTML += child;
        }
      });
    } else if (this.config.children instanceof HTMLElement) {
      card.appendChild(this.config.children);
    } else if (typeof this.config.children === 'string') {
      card.innerHTML = this.config.children;
    }

    return card;
  }

  // Static method for quick card creation
  static create(config) {
    const card = new Card(config);
    return card.render();
  }
}

// Card Header component
export class CardHeader {
  constructor(config = {}) {
    this.config = {
      title: config.title || '',
      subtitle: config.subtitle || '',
      className: config.className || '',
      ...config
    };
  }

  render() {
    const header = document.createElement('div');
    header.className = `mb-4 ${this.config.className}`.trim();

    if (this.config.title) {
      const title = document.createElement('h3');
      title.className = 'text-lg font-semibold text-navy-900 font-inter';
      title.textContent = this.config.title;
      header.appendChild(title);
    }

    if (this.config.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.className = 'text-sm text-gray-600 font-inter mt-1';
      subtitle.textContent = this.config.subtitle;
      header.appendChild(subtitle);
    }

    return header;
  }

  static create(config) {
    const header = new CardHeader(config);
    return header.render();
  }
}

export default Card;