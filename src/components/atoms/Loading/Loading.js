/**
 * Loading Components - Kalos Design System
 * Spinners, progress bars, and loading states
 */

import { BaseComponent } from '../../BaseComponent.js';

// Spinner Component
export class Spinner extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      size: 'md',            // xs, sm, md, lg, xl
      variant: 'primary',    // primary, secondary, white, gray
      speed: 'normal',       // slow, normal, fast
      className: '',
      ...props
    };
  }

  render() {
    const { size, variant, speed, className } = this.props;
    
    const classes = [
      'spinner',
      `spinner-${size}`,
      `spinner-${variant}`,
      `spinner-${speed}`,
      className
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}" data-component="spinner" role="status" aria-label="Cargando">
        <svg class="spinner-svg" viewBox="0 0 24 24" fill="none">
          <circle 
            class="spinner-track" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="2"
          />
          <circle 
            class="spinner-head" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round"
            stroke-dasharray="31.416"
            stroke-dashoffset="31.416"
          />
        </svg>
        <span class="sr-only">Cargando...</span>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="spinner"]';
  }
}

// Dots Spinner Component
export class DotsSpinner extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      size: 'md',            // sm, md, lg
      variant: 'primary',    // primary, secondary, white, gray
      className: '',
      ...props
    };
  }

  render() {
    const { size, variant, className } = this.props;
    
    const classes = [
      'dots-spinner',
      `dots-spinner-${size}`,
      `dots-spinner-${variant}`,
      className
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}" data-component="dots-spinner" role="status" aria-label="Cargando">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
        <span class="sr-only">Cargando...</span>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="dots-spinner"]';
  }
}

// Progress Bar Component
export class ProgressBar extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      value: 0,              // 0-100
      max: 100,
      size: 'md',            // sm, md, lg
      variant: 'primary',    // primary, secondary, success, warning, error
      striped: false,
      animated: false,
      showLabel: false,
      label: '',
      className: '',
      ...props
    };

    this.state = {
      value: this.props.value
    };
  }

  render() {
    const { max, size, variant, striped, animated, showLabel, label, className } = this.props;
    const { value } = this.state;
    
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    const classes = [
      'progress-bar',
      `progress-bar-${size}`,
      striped ? 'progress-bar-striped' : '',
      animated ? 'progress-bar-animated' : '',
      className
    ].filter(Boolean).join(' ');

    const fillClasses = [
      'progress-bar-fill',
      `progress-bar-fill-${variant}`
    ].join(' ');

    return `
      <div class="${classes}" data-component="progress-bar">
        ${showLabel ? `
          <div class="progress-bar-label">
            ${label || `${Math.round(percentage)}%`}
          </div>
        ` : ''}
        
        <div class="progress-bar-track" role="progressbar" aria-valuenow="${value}" aria-valuemax="${max}">
          <div class="${fillClasses}" style="width: ${percentage}%">
            <span class="sr-only">${Math.round(percentage)}% completado</span>
          </div>
        </div>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="progress-bar"]';
  }

  // Public methods
  setValue(newValue) {
    this.setState({ value: newValue });
  }

  increment(amount = 1) {
    const newValue = Math.min(this.props.max, this.state.value + amount);
    this.setState({ value: newValue });
  }

  decrement(amount = 1) {
    const newValue = Math.max(0, this.state.value - amount);
    this.setState({ value: newValue });
  }
}

// Circular Progress Component
export class CircularProgress extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      value: 0,              // 0-100
      max: 100,
      size: 'md',            // sm, md, lg, xl
      variant: 'primary',    // primary, secondary, success, warning, error
      thickness: 4,          // stroke width
      showLabel: true,
      label: '',
      className: '',
      ...props
    };

    this.state = {
      value: this.props.value
    };
  }

  render() {
    const { max, size, variant, thickness, showLabel, label, className } = this.props;
    const { value } = this.state;
    
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const classes = [
      'circular-progress',
      `circular-progress-${size}`,
      className
    ].filter(Boolean).join(' ');

    const progressClasses = [
      'circular-progress-circle',
      `circular-progress-${variant}`
    ].join(' ');

    return `
      <div class="${classes}" data-component="circular-progress">
        <div class="circular-progress-svg-container">
          <svg class="circular-progress-svg" viewBox="0 0 100 100">
            <!-- Background circle -->
            <circle
              class="circular-progress-track"
              cx="50"
              cy="50"
              r="${radius}"
              stroke="currentColor"
              stroke-width="${thickness}"
              fill="none"
            />
            <!-- Progress circle -->
            <circle
              class="${progressClasses}"
              cx="50"
              cy="50"
              r="${radius}"
              stroke="currentColor"
              stroke-width="${thickness}"
              fill="none"
              stroke-linecap="round"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${strokeDashoffset}"
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          ${showLabel ? `
            <div class="circular-progress-label">
              ${label || `${Math.round(percentage)}%`}
            </div>
          ` : ''}
        </div>
        
        <span class="sr-only">${Math.round(percentage)}% completado</span>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="circular-progress"]';
  }

  // Public methods
  setValue(newValue) {
    this.setState({ value: newValue });
  }

  increment(amount = 1) {
    const newValue = Math.min(this.props.max, this.state.value + amount);
    this.setState({ value: newValue });
  }

  decrement(amount = 1) {
    const newValue = Math.max(0, this.state.value - amount);
    this.setState({ value: newValue });
  }
}

// Skeleton Loader Component
export class Skeleton extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      variant: 'text',       // text, rectangular, circular, custom
      width: null,           // CSS width value
      height: null,          // CSS height value
      lines: 1,              // For text variant, number of lines
      animated: true,
      className: '',
      children: null,        // Custom skeleton content
      ...props
    };
  }

  render() {
    const { variant, width, height, lines, animated, className, children } = this.props;
    
    const classes = [
      'skeleton',
      `skeleton-${variant}`,
      animated ? 'skeleton-animated' : '',
      className
    ].filter(Boolean).join(' ');

    const style = [];
    if (width) style.push(`width: ${width}`);
    if (height) style.push(`height: ${height}`);
    const styleAttr = style.length ? `style="${style.join('; ')}"` : '';

    if (children) {
      return `
        <div class="${classes}" data-component="skeleton" ${styleAttr}>
          ${children}
        </div>
      `;
    }

    if (variant === 'text' && lines > 1) {
      return `
        <div class="skeleton-text-container" data-component="skeleton">
          ${Array.from({ length: lines }, (_, index) => `
            <div class="${classes}" ${index === lines - 1 ? 'style="width: 75%"' : ''}></div>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="${classes}" data-component="skeleton" ${styleAttr}></div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="skeleton"]';
  }
}

// Loading Overlay Component
export class LoadingOverlay extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      show: false,
      spinner: 'default',    // default, dots, minimal
      message: 'Cargando...',
      blur: true,            // Blur background content
      transparent: false,    // Transparent overlay
      className: '',
      ...props
    };

    this.state = {
      show: this.props.show
    };
  }

  render() {
    const { spinner, message, blur, transparent, className } = this.props;
    const { show } = this.state;
    
    if (!show) return '';
    
    const classes = [
      'loading-overlay',
      blur ? 'loading-overlay-blur' : '',
      transparent ? 'loading-overlay-transparent' : '',
      className
    ].filter(Boolean).join(' ');

    let spinnerContent = '';
    switch (spinner) {
      case 'dots':
        spinnerContent = `<div class="dots-spinner dots-spinner-lg dots-spinner-white">
          <div class="dot dot-1"></div>
          <div class="dot dot-2"></div>
          <div class="dot dot-3"></div>
        </div>`;
        break;
      case 'minimal':
        spinnerContent = `<div class="spinner spinner-lg spinner-white spinner-normal">
          <svg class="spinner-svg" viewBox="0 0 24 24" fill="none">
            <circle class="spinner-head" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416" />
          </svg>
        </div>`;
        break;
      default:
        spinnerContent = `<div class="spinner spinner-xl spinner-white spinner-normal">
          <svg class="spinner-svg" viewBox="0 0 24 24" fill="none">
            <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <circle class="spinner-head" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416" />
          </svg>
        </div>`;
    }

    return `
      <div class="${classes}" data-component="loading-overlay">
        <div class="loading-overlay-content">
          ${spinnerContent}
          ${message ? `<div class="loading-overlay-message">${message}</div>` : ''}
        </div>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="loading-overlay"]';
    
    // Prevent body scroll when overlay is shown
    if (this.state.show) {
      document.body.classList.add('loading-overlay-active');
    }
  }

  destroy() {
    document.body.classList.remove('loading-overlay-active');
    super.destroy();
  }

  // Public methods
  show() {
    this.setState({ show: true });
    document.body.classList.add('loading-overlay-active');
  }

  hide() {
    this.setState({ show: false });
    document.body.classList.remove('loading-overlay-active');
  }
}

// Factory functions
export function createSpinner(props) {
  return new Spinner(props);
}

export function createDotsSpinner(props) {
  return new DotsSpinner(props);
}

export function createProgressBar(props) {
  return new ProgressBar(props);
}

export function createCircularProgress(props) {
  return new CircularProgress(props);
}

export function createSkeleton(props) {
  return new Skeleton(props);
}

export function createLoadingOverlay(props) {
  return new LoadingOverlay(props);
}