/**
 * BaseComponent - Base class for all Kalos UI components
 * Provides common functionality like lifecycle methods, state management,
 * event binding, and DOM manipulation utilities
 */

export class BaseComponent {
  constructor(element = null, props = {}) {
    this.element = element;
    this.props = props;
    this.state = {};
    this.eventListeners = [];
    this.isDestroyed = false;
    
    // Generate unique component ID
    this.componentId = this.generateId();
  }

  // Template method to be implemented by subclasses
  render() {
    throw new Error('render() method must be implemented by subclass');
  }

  // Mount component to DOM
  mount(container) {
    if (this.isDestroyed) {
      console.warn('Cannot mount destroyed component');
      return;
    }

    if (typeof this.render === 'function') {
      const html = this.render();
      if (container) {
        container.innerHTML = html;
        this.element = container.firstElementChild;
        
        if (this.element) {
          // Set component ID for debugging
          this.element.setAttribute('data-component-id', this.componentId);
          
          // Call lifecycle method
          this.afterMount();
        }
      }
    }
    
    return this;
  }

  // Lifecycle method called after mounting
  afterMount() {
    this.bindEvents();
  }

  // Event binding - to be implemented by subclasses
  bindEvents() {
    // To be implemented by subclasses
  }

  // Add event listener with cleanup tracking
  addEventListener(element, event, handler, options = {}) {
    if (!element) {
      console.warn('Cannot add event listener to null element');
      return;
    }

    element.addEventListener(event, handler, options);
    this.eventListeners.push({ element, event, handler, options });
  }

  // Update component state and re-render
  setState(newState) {
    if (this.isDestroyed) return;
    
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };
    
    // Call state change lifecycle method
    this.onStateChange(prevState, this.state);
    
    // Re-render if component is mounted
    if (this.element) {
      this.rerender();
    }
  }

  // Lifecycle method called when state changes
  onStateChange(prevState, newState) {
    // To be overridden by subclasses if needed
  }

  // Re-render component
  rerender() {
    if (!this.element || !this.element.parentNode || this.isDestroyed) {
      return;
    }

    const parent = this.element.parentNode;
    const nextSibling = this.element.nextSibling;
    
    // Clean up old event listeners
    this.cleanupEventListeners();
    
    // Render new HTML
    const html = this.render();
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;
    const newElement = tempContainer.firstElementChild;
    
    if (newElement) {
      // Set component ID
      newElement.setAttribute('data-component-id', this.componentId);
      
      // Replace old element
      parent.insertBefore(newElement, nextSibling);
      parent.removeChild(this.element);
      
      // Update reference
      this.element = newElement;
      
      // Re-bind events
      this.bindEvents();
    }
  }

  // Clean up event listeners
  cleanupEventListeners() {
    this.eventListeners.forEach(({ element, event, handler, options }) => {
      if (element && element.removeEventListener) {
        element.removeEventListener(event, handler, options);
      }
    });
    this.eventListeners = [];
  }

  // Cleanup component
  destroy() {
    if (this.isDestroyed) return;
    
    this.isDestroyed = true;
    
    // Call cleanup lifecycle method
    this.beforeDestroy();
    
    // Remove all event listeners
    this.cleanupEventListeners();

    // Remove from DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    // Clear references
    this.element = null;
    this.props = null;
    this.state = null;
  }

  // Lifecycle method called before destroy
  beforeDestroy() {
    // To be overridden by subclasses if needed
  }

  // Utility: Add CSS classes
  addClass(className) {
    if (this.element && className) {
      this.element.classList.add(className);
    }
    return this;
  }

  // Utility: Remove CSS classes
  removeClass(className) {
    if (this.element && className) {
      this.element.classList.remove(className);
    }
    return this;
  }

  // Utility: Toggle CSS classes
  toggleClass(className) {
    if (this.element && className) {
      this.element.classList.toggle(className);
    }
    return this;
  }

  // Utility: Check if class exists
  hasClass(className) {
    return this.element ? this.element.classList.contains(className) : false;
  }

  // Utility: Set attributes
  setAttribute(name, value) {
    if (this.element) {
      this.element.setAttribute(name, value);
    }
    return this;
  }

  // Utility: Get attributes
  getAttribute(name) {
    return this.element ? this.element.getAttribute(name) : null;
  }

  // Utility: Remove attributes
  removeAttribute(name) {
    if (this.element) {
      this.element.removeAttribute(name);
    }
    return this;
  }

  // Utility: Find child elements
  querySelector(selector) {
    return this.element ? this.element.querySelector(selector) : null;
  }

  // Utility: Find all child elements
  querySelectorAll(selector) {
    return this.element ? this.element.querySelectorAll(selector) : [];
  }

  // Generate unique ID for component instances
  generateId() {
    return `component_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
  }

  // Utility: Merge CSS classes
  mergeClasses(...classes) {
    return classes
      .filter(Boolean)
      .flatMap(cls => typeof cls === 'string' ? cls.split(' ') : [])
      .filter(Boolean)
      .join(' ');
  }

  // Utility: Create DOM element from HTML string
  createElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  // Utility: Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Utility: Debounce function calls
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Utility: Throttle function calls
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Static method to create component instance
  static create(props = {}) {
    return new this(null, props);
  }

  // Debug information
  debug() {
    return {
      id: this.componentId,
      constructor: this.constructor.name,
      props: this.props,
      state: this.state,
      element: this.element,
      eventListeners: this.eventListeners.length,
      isDestroyed: this.isDestroyed
    };
  }
}

// Component Registry for global component management
export class ComponentRegistry {
  static components = new Map();

  static register(name, ComponentClass) {
    this.components.set(name, ComponentClass);
  }

  static get(name) {
    return this.components.get(name);
  }

  static create(name, props = {}) {
    const ComponentClass = this.get(name);
    if (ComponentClass) {
      return new ComponentClass(null, props);
    }
    throw new Error(`Component "${name}" not registered`);
  }

  static list() {
    return Array.from(this.components.keys());
  }
}

export default BaseComponent;