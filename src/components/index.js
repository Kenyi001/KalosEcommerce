/**
 * Kalos Design System Component Library
 * Central export file for all components
 */

// Base Component
export { BaseComponent, ComponentRegistry } from './BaseComponent.js';

// Atomic Components
export { Button, createButton } from './atoms/Button/index.js';

// Molecular Components
export { FormField, createFormField, validators } from './molecules/FormField/FormField.js';

// Organism Components  
// (Will be added as we create them)

// Template Components
// (Will be added as we create them)

// Utility functions for component creation
export const ComponentUtils = {
  // Create any component by name
  create: (componentName, props = {}) => {
    switch (componentName.toLowerCase()) {
      case 'button':
        return new Button(props);
      case 'formfield':
        return new FormField(props);
      default:
        throw new Error(`Unknown component: ${componentName}`);
    }
  },
  
  // Mount multiple components
  mountAll: (components, container) => {
    if (!container) {
      console.error('Container is required for mounting components');
      return [];
    }
    
    return components.map(({ component, selector }) => {
      const targetElement = typeof selector === 'string' 
        ? container.querySelector(selector)
        : selector;
        
      if (targetElement && component) {
        return component.mount(targetElement);
      }
      return null;
    }).filter(Boolean);
  },
  
  // Destroy multiple components
  destroyAll: (components) => {
    components.forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
  }
};

// Design System constants
export const DesignTokens = {
  colors: {
    brand: '#F74F4E',
    navy: '#303F56',
    gold: '#FCBE3C',
    beige: '#F3E7DB',
    deepCoral: '#D55A78'
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem'
  },
  
  typography: {
    fontFamily: {
      display: 'Fraunces, Georgia, serif',
      sans: 'Inter, system-ui, sans-serif'
    }
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

// Global component registry initialization
import { ComponentRegistry } from './BaseComponent.js';
import { Button, createButton } from './atoms/Button/index.js';
import { FormField, createFormField, validators as formValidators } from './molecules/FormField/FormField.js';

// Register all components
ComponentRegistry.register('Button', Button);
ComponentRegistry.register('FormField', FormField);

// Export the registry
export { ComponentRegistry as Components };

// Version information
export const version = '1.0.0';
export const designSystemVersion = 'Phase 4 - v1.0.0';

console.log(`🎨 Kalos Design System v${version} loaded`);

export default {
  Button,
  createButton,
  FormField,
  createFormField,
  validators: formValidators,
  ComponentUtils,
  DesignTokens,
  Components: ComponentRegistry,
  version
};