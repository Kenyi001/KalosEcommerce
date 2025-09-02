/**
 * Modal System - Kalos Design System
 * Accessible modal components with focus management and backdrop handling
 */

import { BaseComponent } from '../../BaseComponent.js';
import { renderIcon } from '../../atoms/Icon/Icon.js';

export class Modal extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      isOpen: false,
      title: '',
      children: '',
      size: 'md',               // sm, md, lg, xl, full
      variant: 'default',       // default, danger, success, warning
      closeOnOverlay: true,
      closeOnEscape: true,
      showCloseButton: true,
      showHeader: true,
      showFooter: false,
      footer: '',
      onClose: () => {},
      onOpen: () => {},
      className: '',
      ...props
    };

    this.state = {
      isOpen: this.props.isOpen,
      isAnimating: false
    };

    // Focus management
    this.focusableElements = [];
    this.previousFocusedElement = null;
    this.trapFocus = this.trapFocus.bind(this);
  }

  render() {
    const { title, children, size, variant, showCloseButton, showHeader, showFooter, footer, className } = this.props;
    const { isOpen, isAnimating } = this.state;
    
    if (!isOpen && !isAnimating) return '';
    
    return `
      <div class="modal-overlay ${isOpen ? 'modal-open' : 'modal-closing'} ${className}" data-component="modal">
        <div class="modal-container modal-${size} modal-${variant}" role="dialog" aria-modal="true" ${title ? `aria-labelledby="modal-title"` : ''}>
          
          ${showHeader ? `
            <!-- Modal Header -->
            <div class="modal-header">
              ${title ? `<h2 id="modal-title" class="modal-title">${title}</h2>` : ''}
              ${showCloseButton ? `
                <button 
                  class="modal-close-btn" 
                  aria-label="Cerrar modal"
                  type="button"
                >
                  ${renderIcon('close', { size: '20', className: 'close-icon' })}
                </button>
              ` : ''}
            </div>
          ` : ''}
          
          <!-- Modal Content -->
          <div class="modal-content">
            ${children}
          </div>
          
          ${showFooter && footer ? `
            <!-- Modal Footer -->
            <div class="modal-footer">
              ${footer}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="modal"]';
    
    // Prevent body scroll when modal is open
    document.body.classList.add('modal-open');
    
    // Store previously focused element
    this.previousFocusedElement = document.activeElement;
    
    // Set up focus trap
    this.setupFocusTrap();
    
    // Focus first focusable element or close button
    this.focusFirstElement();
    
    // Add animation class after mounting
    requestAnimationFrame(() => {
      if (this.element) {
        this.element.classList.add('modal-enter');
      }
    });

    // Call onOpen callback
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  bindEvents() {
    const { closeOnOverlay, closeOnEscape } = this.props;
    
    // Close on overlay click
    if (closeOnOverlay && this.element) {
      this.addEventListener(this.element, 'click', (e) => {
        if (e.target === this.element) {
          this.close();
        }
      });
    }
    
    // Close on escape key
    if (closeOnEscape) {
      this.addEventListener(document, 'keydown', (e) => {
        if (e.key === 'Escape') {
          this.close();
        }
      });
    }
    
    // Close button
    const closeBtn = this.element?.querySelector('.modal-close-btn');
    if (closeBtn) {
      this.addEventListener(closeBtn, 'click', () => {
        this.close();
      });
    }
    
    // Focus trap
    this.addEventListener(document, 'keydown', this.trapFocus);
    
    // Prevent clicks inside modal from closing it
    const modalContainer = this.element?.querySelector('.modal-container');
    if (modalContainer) {
      this.addEventListener(modalContainer, 'click', (e) => {
        e.stopPropagation();
      });
    }
  }

  setupFocusTrap() {
    if (!this.element) return;
    
    this.focusableElements = this.element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
  }

  focusFirstElement() {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  trapFocus(e) {
    if (e.key !== 'Tab' || !this.element || this.focusableElements.length === 0) {
      return;
    }

    const firstFocusable = this.focusableElements[0];
    const lastFocusable = this.focusableElements[this.focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  // Public methods
  open() {
    if (this.state.isOpen) return;
    
    this.setState({ isOpen: true, isAnimating: true });
    
    // Add to DOM if not already there
    if (!this.element) {
      const container = document.createElement('div');
      document.body.appendChild(container);
      this.mount(container);
    }

    // Reset animation state after animation completes
    setTimeout(() => {
      this.setState({ isAnimating: false });
    }, 300);
  }

  close() {
    if (!this.state.isOpen) return;
    
    this.setState({ isAnimating: true });
    
    // Add closing animation class
    if (this.element) {
      this.element.classList.remove('modal-enter');
      this.element.classList.add('modal-exit');
    }
    
    // Complete close after animation
    setTimeout(() => {
      this.setState({ isOpen: false, isAnimating: false });
      
      // Restore body scroll
      document.body.classList.remove('modal-open');
      
      // Restore focus to previously focused element
      if (this.previousFocusedElement) {
        this.previousFocusedElement.focus();
      }
      
      // Call onClose callback
      if (this.props.onClose) {
        this.props.onClose();
      }
      
      // Remove from DOM
      this.destroy();
    }, 300);
  }

  toggle() {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  updateContent(content) {
    const contentEl = this.element?.querySelector('.modal-content');
    if (contentEl) {
      contentEl.innerHTML = content;
      this.setupFocusTrap(); // Recalculate focusable elements
    }
  }

  destroy() {
    // Remove modal-open class from body
    document.body.classList.remove('modal-open');
    
    // Call parent destroy
    super.destroy();
  }
}

// Confirmation Modal
export class ConfirmModal extends Modal {
  constructor(props = {}) {
    super({
      size: 'sm',
      variant: 'danger',
      title: props.title || '¿Estás seguro?',
      children: `
        <p class="confirm-message">
          ${props.message || 'Esta acción no se puede deshacer.'}
        </p>
      `,
      showFooter: true,
      footer: `
        <div class="modal-actions">
          <button class="btn btn-ghost cancel-btn">
            Cancelar
          </button>
          <button class="btn btn-danger confirm-btn">
            ${props.confirmText || 'Confirmar'}
          </button>
        </div>
      `,
      onConfirm: props.onConfirm || (() => {}),
      onCancel: props.onCancel || (() => {}),
      ...props
    });
  }

  bindEvents() {
    super.bindEvents();
    
    // Cancel button
    const cancelBtn = this.element?.querySelector('.cancel-btn');
    if (cancelBtn) {
      this.addEventListener(cancelBtn, 'click', () => {
        if (this.props.onCancel) {
          this.props.onCancel();
        }
        this.close();
      });
    }
    
    // Confirm button
    const confirmBtn = this.element?.querySelector('.confirm-btn');
    if (confirmBtn) {
      this.addEventListener(confirmBtn, 'click', () => {
        if (this.props.onConfirm) {
          this.props.onConfirm();
        }
        this.close();
      });
    }
  }
}

// Alert Modal
export class AlertModal extends Modal {
  constructor(props = {}) {
    super({
      size: 'sm',
      variant: props.type || 'default',
      title: props.title || 'Información',
      children: `
        <div class="alert-content">
          ${props.icon ? `
            <div class="alert-icon">
              ${renderIcon(props.icon, { size: '24', className: 'icon' })}
            </div>
          ` : ''}
          <p class="alert-message">
            ${props.message || ''}
          </p>
        </div>
      `,
      showFooter: true,
      footer: `
        <div class="modal-actions">
          <button class="btn btn-primary ok-btn">
            ${props.okText || 'OK'}
          </button>
        </div>
      `,
      onOk: props.onOk || (() => {}),
      ...props
    });
  }

  bindEvents() {
    super.bindEvents();
    
    // OK button
    const okBtn = this.element?.querySelector('.ok-btn');
    if (okBtn) {
      this.addEventListener(okBtn, 'click', () => {
        if (this.props.onOk) {
          this.props.onOk();
        }
        this.close();
      });
    }
  }
}

// Modal Service for programmatic modals
export class ModalService {
  static activeModals = [];
  static modalStack = [];
  
  static show(content, options = {}) {
    const modal = new Modal({
      isOpen: true,
      children: content,
      onClose: () => {
        this.destroy(modal);
      },
      ...options
    });
    
    const container = document.createElement('div');
    document.body.appendChild(container);
    modal.mount(container);
    
    this.activeModals.push(modal);
    this.modalStack.push(modal);
    
    // Update z-index for stacked modals
    this.updateModalZIndex();
    
    return modal;
  }
  
  static confirm(message, options = {}) {
    return new Promise((resolve) => {
      const modal = new ConfirmModal({
        message,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
        ...options
      });
      
      modal.open();
      this.activeModals.push(modal);
      
      return modal;
    });
  }
  
  static alert(message, options = {}) {
    return new Promise((resolve) => {
      const modal = new AlertModal({
        message,
        onOk: () => resolve(true),
        ...options
      });
      
      modal.open();
      this.activeModals.push(modal);
      
      return modal;
    });
  }
  
  static destroy(modal) {
    const index = this.activeModals.indexOf(modal);
    if (index > -1) {
      this.activeModals.splice(index, 1);
      
      // Remove from stack
      const stackIndex = this.modalStack.indexOf(modal);
      if (stackIndex > -1) {
        this.modalStack.splice(stackIndex, 1);
      }
      
      modal.destroy();
      this.updateModalZIndex();
    }
  }
  
  static destroyAll() {
    this.activeModals.forEach(modal => modal.destroy());
    this.activeModals = [];
    this.modalStack = [];
    
    // Remove modal-open class if no modals are active
    document.body.classList.remove('modal-open');
  }
  
  static updateModalZIndex() {
    this.modalStack.forEach((modal, index) => {
      if (modal.element) {
        modal.element.style.zIndex = 1050 + index;
      }
    });
  }
  
  static getActiveCount() {
    return this.activeModals.length;
  }
  
  static isAnyOpen() {
    return this.activeModals.length > 0;
  }
}

// Factory functions
export function createModal(props) {
  return new Modal(props);
}

export function createConfirmModal(props) {
  return new ConfirmModal(props);
}

export function createAlertModal(props) {
  return new AlertModal(props);
}

// Convenience functions
export function showModal(content, options = {}) {
  return ModalService.show(content, options);
}

export function showConfirm(message, options = {}) {
  return ModalService.confirm(message, options);
}

export function showAlert(message, options = {}) {
  return ModalService.alert(message, options);
}

// Export modal service instance
export { ModalService };