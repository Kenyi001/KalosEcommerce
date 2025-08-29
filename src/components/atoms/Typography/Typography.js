/**
 * Typography Components - Kalos Design System
 * Headings, paragraphs and text elements
 */

import { BaseComponent } from '../../BaseComponent.js';

// Heading Component
export class Heading extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      level: 1,              // 1-6 for h1-h6
      size: null,            // display-lg, display-md, xl, lg, md, sm, xs (overrides level default)
      weight: null,          // light, normal, medium, semibold, bold, extrabold
      color: null,           // text color class
      align: null,           // left, center, right, justify
      children: '',
      as: null,              // Override semantic tag (e.g., h1 styled as h3)
      className: '',
      ...props
    };
  }

  render() {
    const { level, size, weight, color, align, children, as, className } = this.props;
    
    const tag = as || `h${Math.max(1, Math.min(6, level))}`;
    
    const sizeClass = size ? `text-${size}` : this.getDefaultSizeClass(level);
    const weightClass = weight ? `font-${weight}` : '';
    const colorClass = color ? `text-${color}` : '';
    const alignClass = align ? `text-${align}` : '';
    
    const classes = [
      'heading',
      sizeClass,
      weightClass,
      colorClass,
      alignClass,
      className
    ].filter(Boolean).join(' ');

    return `
      <${tag} class="${classes}" data-component="heading">
        ${children}
      </${tag}>
    `;
  }

  getDefaultSizeClass(level) {
    const sizeMap = {
      1: 'text-display-lg',
      2: 'text-display-md', 
      3: 'text-xl',
      4: 'text-lg',
      5: 'text-base',
      6: 'text-sm'
    };
    return sizeMap[level] || 'text-base';
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="heading"]';
  }
}

// Paragraph Component
export class Paragraph extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      size: 'base',          // xs, sm, base, lg, xl
      weight: null,          // light, normal, medium, semibold, bold
      color: null,           // text color class
      align: null,           // left, center, right, justify
      leading: null,         // tight, normal, relaxed, loose
      children: '',
      className: '',
      ...props
    };
  }

  render() {
    const { size, weight, color, align, leading, children, className } = this.props;
    
    const sizeClass = `text-${size}`;
    const weightClass = weight ? `font-${weight}` : '';
    const colorClass = color ? `text-${color}` : '';
    const alignClass = align ? `text-${align}` : '';
    const leadingClass = leading ? `leading-${leading}` : '';
    
    const classes = [
      'paragraph',
      sizeClass,
      weightClass,
      colorClass,
      alignClass,
      leadingClass,
      className
    ].filter(Boolean).join(' ');

    return `
      <p class="${classes}" data-component="paragraph">
        ${children}
      </p>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="paragraph"]';
  }
}

// Text Component (inline text with styling)
export class Text extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      size: 'base',          // xs, sm, base, lg, xl
      weight: null,          // light, normal, medium, semibold, bold
      color: null,           // text color class
      variant: null,         // muted, accent, brand, success, warning, error
      decoration: null,      // underline, line-through, no-underline
      transform: null,       // uppercase, lowercase, capitalize
      family: null,          // sans, display, mono
      children: '',
      as: 'span',            // span, strong, em, mark, code
      className: '',
      ...props
    };
  }

  render() {
    const { size, weight, color, variant, decoration, transform, family, children, as, className } = this.props;
    
    const sizeClass = `text-${size}`;
    const weightClass = weight ? `font-${weight}` : '';
    const familyClass = family ? `font-${family}` : '';
    
    // Handle color variants
    let colorClass = '';
    if (variant) {
      const variantMap = {
        muted: 'text-gray-500',
        accent: 'text-navy',
        brand: 'text-brand',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        error: 'text-red-600'
      };
      colorClass = variantMap[variant] || '';
    } else if (color) {
      colorClass = `text-${color}`;
    }
    
    const decorationClass = decoration ? (decoration === 'no-underline' ? 'no-underline' : `${decoration}`) : '';
    const transformClass = transform ? `${transform}` : '';
    
    const classes = [
      'text-element',
      sizeClass,
      weightClass,
      familyClass,
      colorClass,
      decorationClass,
      transformClass,
      className
    ].filter(Boolean).join(' ');

    return `
      <${as} class="${classes}" data-component="text">
        ${children}
      </${as}>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="text"]';
  }
}

// Link Component
export class Link extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      href: '#',
      target: null,          // _blank, _self, etc.
      variant: 'default',    // default, brand, muted, no-style
      size: null,            // xs, sm, base, lg, xl
      weight: null,          // light, normal, medium, semibold, bold
      decoration: null,      // underline, no-underline, hover-underline
      external: false,       // Auto-add external link icon and attributes
      disabled: false,
      children: '',
      onClick: null,
      className: '',
      ...props
    };
  }

  render() {
    const { 
      href, 
      target, 
      variant, 
      size, 
      weight, 
      decoration, 
      external, 
      disabled, 
      children, 
      className 
    } = this.props;
    
    const sizeClass = size ? `text-${size}` : '';
    const weightClass = weight ? `font-${weight}` : '';
    
    let variantClass = '';
    switch (variant) {
      case 'brand':
        variantClass = 'text-brand hover:text-brand-hover';
        break;
      case 'muted':
        variantClass = 'text-gray-500 hover:text-gray-700';
        break;
      case 'no-style':
        variantClass = 'text-inherit hover:text-inherit';
        break;
      default:
        variantClass = 'text-navy hover:text-brand';
    }
    
    let decorationClass = '';
    switch (decoration) {
      case 'underline':
        decorationClass = 'underline';
        break;
      case 'no-underline':
        decorationClass = 'no-underline';
        break;
      case 'hover-underline':
        decorationClass = 'no-underline hover:underline';
        break;
      default:
        decorationClass = variant === 'no-style' ? 'no-underline' : 'hover:underline';
    }
    
    const classes = [
      'link',
      sizeClass,
      weightClass,
      variantClass,
      decorationClass,
      disabled ? 'link-disabled' : '',
      external ? 'link-external' : '',
      className
    ].filter(Boolean).join(' ');

    const linkTarget = target || (external ? '_blank' : null);
    const linkRel = external ? 'noopener noreferrer' : null;
    const ariaDisabled = disabled ? 'true' : null;

    return `
      <a 
        href="${disabled ? '#' : href}" 
        class="${classes}"
        ${linkTarget ? `target="${linkTarget}"` : ''}
        ${linkRel ? `rel="${linkRel}"` : ''}
        ${ariaDisabled ? `aria-disabled="${ariaDisabled}"` : ''}
        data-component="link"
      >
        ${children}
        ${external ? `
          <svg class="link-external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15,3 21,3 21,9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        ` : ''}
      </a>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="link"]';
  }

  bindEvents() {
    if (this.props.onClick && !this.props.disabled) {
      this.addEventListener(this.element, 'click', (e) => {
        if (this.props.href === '#') {
          e.preventDefault();
        }
        this.props.onClick(e);
      });
    }

    if (this.props.disabled) {
      this.addEventListener(this.element, 'click', (e) => {
        e.preventDefault();
      });
    }
  }
}

// Code Component
export class Code extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      size: 'sm',            // xs, sm, base
      variant: 'default',    // default, brand, success, warning, error
      block: false,          // true for <pre><code>, false for inline <code>
      children: '',
      className: '',
      ...props
    };
  }

  render() {
    const { size, variant, block, children, className } = this.props;
    
    const sizeClass = `text-${size}`;
    let variantClass = 'code-default';
    
    switch (variant) {
      case 'brand':
        variantClass = 'code-brand';
        break;
      case 'success':
        variantClass = 'code-success';
        break;
      case 'warning':
        variantClass = 'code-warning';
        break;
      case 'error':
        variantClass = 'code-error';
        break;
    }
    
    const classes = [
      'code',
      sizeClass,
      variantClass,
      block ? 'code-block' : 'code-inline',
      className
    ].filter(Boolean).join(' ');

    if (block) {
      return `
        <pre class="${classes}" data-component="code">
          <code>${children}</code>
        </pre>
      `;
    }

    return `
      <code class="${classes}" data-component="code">
        ${children}
      </code>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="code"]';
  }
}

// Factory functions
export function createHeading(props) {
  return new Heading(props);
}

export function createParagraph(props) {
  return new Paragraph(props);
}

export function createText(props) {
  return new Text(props);
}

export function createLink(props) {
  return new Link(props);
}

export function createCode(props) {
  return new Code(props);
}