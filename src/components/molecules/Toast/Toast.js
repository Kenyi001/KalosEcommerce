/**
 * Toast Notification Components - Kalos Design System
 * Toast notifications and alert system
 */

import { BaseComponent } from '../../BaseComponent.js';
import { renderIcon } from '../../atoms/Icon/Icon.js';

// Single Toast Component
export class Toast extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      message: '',
      variant: 'info',       // success, error, warning, info
      duration: 5000,        // Auto-dismiss time in ms, 0 for persistent
      dismissible: true,
      showIcon: true,
      position: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
      onClick: null,
      onClose: null,
      className: '',
      ...props
    };

    this.state = {
      visible: false,
      closing: false
    };

    this.dismissTimer = null;
  }

  render() {
    const { title, message, variant, dismissible, showIcon, className } = this.props;
    const { visible, closing } = this.state;
    
    if (!visible && !closing) return '';
    
    const classes = [
      'toast',
      `toast-${variant}`,
      closing ? 'toast-closing' : '',
      className
    ].filter(Boolean).join(' ');

    const iconName = this.getVariantIcon(variant);

    return `
      <div class="${classes}" data-component="toast" data-toast-id="${this.props.id}" role="alert">
        ${showIcon ? `
          <div class="toast-icon">
            ${renderIcon(iconName, { size: '20' })}
          </div>
        ` : ''}
        
        <div class="toast-content">
          ${title ? `<div class="toast-title">${title}</div>` : ''}
          ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
        
        ${dismissible ? `
          <button class="toast-close" aria-label="Cerrar notificación">
            ${renderIcon('x', { size: '16' })}
          </button>
        ` : ''}
      </div>
    `;
  }

  getVariantIcon(variant) {
    const iconMap = {
      success: 'check-circle',
      error: 'alert-circle',
      warning: 'alert-triangle',
      info: 'info'
    };
    return iconMap[variant] || 'info';
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="toast"]';
    
    // Show animation
    setTimeout(() => {
      this.setState({ visible: true });
    }, 10);

    // Auto-dismiss timer
    if (this.props.duration > 0) {
      this.dismissTimer = setTimeout(() => {
        this.dismiss();
      }, this.props.duration);
    }
  }

  bindEvents() {
    // Close button
    const closeBtn = this.element?.querySelector('.toast-close');
    if (closeBtn) {
      this.addEventListener(closeBtn, 'click', () => {
        this.dismiss();
      });
    }

    // Toast click
    if (this.props.onClick) {
      this.addEventListener(this.element, 'click', (e) => {
        if (!e.target.closest('.toast-close')) {
          this.props.onClick(this.props.id);
        }
      });
    }

    // Pause auto-dismiss on hover
    if (this.props.duration > 0) {
      this.addEventListener(this.element, 'mouseenter', () => {
        if (this.dismissTimer) {
          clearTimeout(this.dismissTimer);
          this.dismissTimer = null;
        }
      });

      this.addEventListener(this.element, 'mouseleave', () => {
        if (!this.state.closing) {
          this.dismissTimer = setTimeout(() => {
            this.dismiss();
          }, 1000); // Resume with shorter delay
        }
      });
    }
  }

  dismiss() {
    if (this.state.closing) return;

    this.setState({ closing: true });
    
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }

    // Wait for animation to complete
    setTimeout(() => {
      if (this.props.onClose) {
        this.props.onClose(this.props.id);
      }
      this.destroy();
    }, 300);
  }

  // Public methods
  show() {
    this.setState({ visible: true, closing: false });
  }

  hide() {
    this.dismiss();
  }
}

// Toast Container/Manager
export class ToastContainer extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      position: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
      maxToasts: 5,          // Maximum toasts to show at once
      spacing: 'md',         // sm, md, lg - spacing between toasts
      className: '',
      ...props
    };

    this.toasts = new Map(); // Track active toasts
  }

  render() {
    const { position, spacing, className } = this.props;
    
    const classes = [
      'toast-container',
      `toast-container-${position}`,
      `toast-container-spacing-${spacing}`,
      className
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}" data-component="toast-container" aria-live="polite"></div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="toast-container"]';
  }

  addToast(toastProps) {
    const toast = new Toast({
      ...toastProps,
      onClose: (id) => {
        this.removeToast(id);
        if (toastProps.onClose) {
          toastProps.onClose(id);
        }
      }
    });

    // Limit number of toasts
    if (this.toasts.size >= this.props.maxToasts) {
      const oldestId = this.toasts.keys().next().value;
      this.removeToast(oldestId);
    }

    this.toasts.set(toast.props.id, toast);
    
    // Create container for this toast
    const toastElement = document.createElement('div');
    this.element.appendChild(toastElement);
    
    toast.mount(toastElement);
    
    return toast.props.id;
  }

  removeToast(id) {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.destroy();
      this.toasts.delete(id);
    }
  }

  removeAllToasts() {
    this.toasts.forEach(toast => toast.destroy());
    this.toasts.clear();
    if (this.element) {
      this.element.innerHTML = '';
    }
  }

  // Public methods
  success(message, options = {}) {
    return this.addToast({
      variant: 'success',
      message,
      ...options
    });
  }

  error(message, options = {}) {
    return this.addToast({
      variant: 'error',
      message,
      duration: 0, // Persistent by default for errors
      ...options
    });
  }

  warning(message, options = {}) {
    return this.addToast({
      variant: 'warning',
      message,
      ...options
    });
  }

  info(message, options = {}) {
    return this.addToast({
      variant: 'info',
      message,
      ...options
    });
  }
}

// Global Toast Service
export class ToastService {
  static instance = null;
  static container = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ToastContainer();
      
      // Mount to body
      const containerElement = document.createElement('div');
      document.body.appendChild(containerElement);
      this.instance.mount(containerElement);
      
      this.container = this.instance;
    }
    return this.instance;
  }

  static show(message, options = {}) {
    const container = this.getInstance();
    return container.addToast({
      message,
      ...options
    });
  }

  static success(message, options = {}) {
    const container = this.getInstance();
    return container.success(message, options);
  }

  static error(message, options = {}) {
    const container = this.getInstance();
    return container.error(message, options);
  }

  static warning(message, options = {}) {
    const container = this.getInstance();
    return container.warning(message, options);
  }

  static info(message, options = {}) {
    const container = this.getInstance();
    return container.info(message, options);
  }

  static remove(id) {
    if (this.container) {
      this.container.removeToast(id);
    }
  }

  static clear() {
    if (this.container) {
      this.container.removeAllToasts();
    }
  }

  static setPosition(position) {
    if (this.container) {
      this.container.props.position = position;
      this.container.rerender();
    }
  }
}

// Alert Component (inline alerts)
export class Alert extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      variant: 'info',       // success, error, warning, info
      title: '',
      message: '',
      dismissible: false,
      showIcon: true,
      border: false,         // Show border variant
      onClose: null,
      className: '',
      children: '',
      ...props
    };

    this.state = {
      visible: true
    };
  }

  render() {
    const { variant, title, message, dismissible, showIcon, border, className, children } = this.props;
    const { visible } = this.state;
    
    if (!visible) return '';
    
    const classes = [
      'alert',
      `alert-${variant}`,
      border ? 'alert-border' : '',
      className
    ].filter(Boolean).join(' ');

    const iconName = this.getVariantIcon(variant);

    return `
      <div class="${classes}" data-component="alert" role="alert">
        ${showIcon ? `
          <div class="alert-icon">
            ${renderIcon(iconName, { size: '20' })}
          </div>
        ` : ''}
        
        <div class="alert-content">
          ${title ? `<div class="alert-title">${title}</div>` : ''}
          ${message ? `<div class="alert-message">${message}</div>` : ''}
          ${children ? `<div class="alert-body">${children}</div>` : ''}
        </div>
        
        ${dismissible ? `
          <button class="alert-close" aria-label="Cerrar alerta">
            ${renderIcon('x', { size: '16' })}
          </button>
        ` : ''}
      </div>
    `;
  }

  getVariantIcon(variant) {
    const iconMap = {
      success: 'check-circle',
      error: 'alert-circle',
      warning: 'alert-triangle',
      info: 'info'
    };
    return iconMap[variant] || 'info';
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="alert"]';
  }

  bindEvents() {
    const closeBtn = this.element?.querySelector('.alert-close');
    if (closeBtn) {
      this.addEventListener(closeBtn, 'click', () => {
        this.dismiss();
      });
    }
  }

  dismiss() {
    this.setState({ visible: false });
    
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  // Public methods
  show() {
    this.setState({ visible: true });
  }

  hide() {
    this.dismiss();
  }
}

// Factory functions
export function createToast(props) {
  return new Toast(props);
}

export function createToastContainer(props) {
  return new ToastContainer(props);
}

export function createAlert(props) {
  return new Alert(props);
}