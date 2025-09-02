/**
 * Kalos Component Library - Complete System
 * Phase 4 implementation with full Atomic Design structure
 */

// Base Component
export { BaseComponent } from './BaseComponent.js';

// Atoms - Complete atomic design components
export * from './atoms/Button/index.js';
export * from './atoms/Input/index.js';  
export * from './atoms/Icon/index.js';
export * from './atoms/Select/index.js';
export * from './atoms/Typography/index.js';
export * from './atoms/Loading/index.js';

// Molecules - Composite UI components
export * from './molecules/FormField/index.js';
export * from './molecules/Card/index.js';
export * from './molecules/Modal/index.js';
export * from './molecules/Navigation/index.js';
export * from './molecules/Toast/index.js';
export * from './molecules/SearchBar/index.js';

// Organisms - Complex feature components
export * from './organisms/ProfessionalList/index.js';
export * from './organisms/BookingCalendar/index.js';

// Templates - Page layout components
export * from './templates/PageLayout/index.js';

// Organism Components (existing)
export { ProfessionalCard as LegacyProfessionalCard } from './professionals/ProfessionalCard.js';

// Layout Components (existing)
export { renderWithLayout, initializeLayout } from './Layout.js';

// Utility functions for component creation
export const ComponentUtils = {
  // Create any component by name
  create: (componentName, props = {}) => {
    // Dynamic component creation would go here
    throw new Error(`Dynamic component creation not yet implemented for: ${componentName}`);
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
import { Input, createInput } from './atoms/Input/index.js';
import { Select, createSelect } from './atoms/Select/index.js';
import { Heading, Paragraph, Text, Link, Code } from './atoms/Typography/index.js';
import { Spinner, ProgressBar, Skeleton } from './atoms/Loading/index.js';
import { FormField, createFormField, validators as formValidators } from './molecules/FormField/FormField.js';
import { ServiceCard, ProfessionalCard, ReviewCard } from './molecules/Card/index.js';
import { Modal, ModalService } from './molecules/Modal/index.js';
import { Toast, ToastService, Alert } from './molecules/Toast/index.js';
import { SearchBar } from './molecules/SearchBar/index.js';
import { ProfessionalList } from './organisms/ProfessionalList/index.js';
import { BookingCalendar } from './organisms/BookingCalendar/index.js';
import { MainLayout, AuthLayout, DashboardLayout, ErrorLayout } from './templates/PageLayout/index.js';

// Register all components in the global registry
ComponentRegistry.register('Button', Button);
ComponentRegistry.register('Input', Input);
ComponentRegistry.register('Select', Select);
ComponentRegistry.register('Heading', Heading);
ComponentRegistry.register('Paragraph', Paragraph);
ComponentRegistry.register('Text', Text);
ComponentRegistry.register('Link', Link);
ComponentRegistry.register('Code', Code);
ComponentRegistry.register('Spinner', Spinner);
ComponentRegistry.register('ProgressBar', ProgressBar);
ComponentRegistry.register('Skeleton', Skeleton);
ComponentRegistry.register('FormField', FormField);
ComponentRegistry.register('ServiceCard', ServiceCard);
ComponentRegistry.register('ProfessionalCard', ProfessionalCard);
ComponentRegistry.register('ReviewCard', ReviewCard);
ComponentRegistry.register('Modal', Modal);
ComponentRegistry.register('Toast', Toast);
ComponentRegistry.register('Alert', Alert);
ComponentRegistry.register('SearchBar', SearchBar);
ComponentRegistry.register('ProfessionalList', ProfessionalList);
ComponentRegistry.register('BookingCalendar', BookingCalendar);
ComponentRegistry.register('MainLayout', MainLayout);
ComponentRegistry.register('AuthLayout', AuthLayout);
ComponentRegistry.register('DashboardLayout', DashboardLayout);
ComponentRegistry.register('ErrorLayout', ErrorLayout);

// Export the registry
export { ComponentRegistry as Components };

// Version information
export const version = '1.0.0';
export const designSystemVersion = 'Phase 4 - v1.0.0';

console.log(`🎨 Kalos Design System v${version} loaded`);

// Enhanced default export with all components
export default {
  // Atoms
  Button,
  Input, 
  Select,
  Heading,
  Paragraph,
  Text,
  Link,
  Code,
  Spinner,
  ProgressBar,
  Skeleton,
  
  // Factory functions
  createButton,
  createInput,
  createSelect,
  
  // Molecules
  FormField,
  ServiceCard,
  ProfessionalCard,
  ReviewCard,
  Modal,
  Toast,
  Alert,
  SearchBar,
  
  // Molecule factories
  createFormField,
  
  // Organisms
  ProfessionalList,
  BookingCalendar,
  
  // Templates
  MainLayout,
  AuthLayout,
  DashboardLayout,
  ErrorLayout,
  
  // Services
  ModalService,
  ToastService,
  
  // Utilities
  validators: formValidators,
  ComponentUtils,
  DesignTokens,
  Components: ComponentRegistry,
  version
};