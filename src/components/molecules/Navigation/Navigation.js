/**
 * Navigation Components - Kalos Design System
 * Breadcrumbs, Pagination, and other navigation utilities
 */

import { BaseComponent } from '../../BaseComponent.js';
import { renderIcon } from '../../atoms/Icon/Icon.js';

// Breadcrumb Component
export class Breadcrumb extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      items: [],              // Array of { label, href, isActive }
      separator: 'chevron-right',
      maxItems: 4,           // Max items to show before truncating
      className: '',
      onNavigate: null,
      ...props
    };
  }

  render() {
    const { items, separator, maxItems, className } = this.props;
    
    if (!items || items.length === 0) return '';
    
    // Truncate items if needed
    let displayItems = [...items];
    if (items.length > maxItems) {
      displayItems = [
        items[0],
        { label: '...', href: null, isEllipsis: true },
        ...items.slice(-maxItems + 1)
      ];
    }
    
    return `
      <nav class="breadcrumb ${className}" aria-label="Breadcrumb" data-component="breadcrumb">
        <ol class="breadcrumb-list">
          ${displayItems.map((item, index) => `
            <li class="breadcrumb-item ${item.isActive ? 'breadcrumb-active' : ''}">
              ${item.isEllipsis ? `
                <span class="breadcrumb-ellipsis">${item.label}</span>
              ` : item.isActive ? `
                <span class="breadcrumb-current" aria-current="page">${item.label}</span>
              ` : `
                <a href="${item.href}" class="breadcrumb-link">${item.label}</a>
              `}
              
              ${index < displayItems.length - 1 ? `
                <span class="breadcrumb-separator" aria-hidden="true">
                  ${renderIcon(separator, { size: '16', className: 'separator-icon' })}
                </span>
              ` : ''}
            </li>
          `).join('')}
        </ol>
      </nav>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="breadcrumb"]';
  }

  bindEvents() {
    const links = this.element?.querySelectorAll('.breadcrumb-link');
    if (links && this.props.onNavigate) {
      links.forEach(link => {
        this.addEventListener(link, 'click', (e) => {
          e.preventDefault();
          const href = link.getAttribute('href');
          const item = this.props.items.find(item => item.href === href);
          if (item) {
            this.props.onNavigate(item, e);
          }
        });
      });
    }
  }
}

// Pagination Component
export class Pagination extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      showFirst: true,
      showLast: true,
      showPrevNext: true,
      showInfo: true,        // Show "Page X of Y" info
      maxVisiblePages: 5,    // Max page buttons to show
      size: 'md',            // sm, md, lg
      className: '',
      onPageChange: () => {},
      ...props
    };
  }

  render() {
    const { 
      currentPage, 
      totalPages, 
      totalItems, 
      itemsPerPage,
      showFirst, 
      showLast, 
      showPrevNext, 
      showInfo,
      maxVisiblePages,
      size,
      className 
    } = this.props;
    
    if (totalPages <= 1) return '';
    
    const pages = this.getVisiblePages();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return `
      <nav class="pagination pagination-${size} ${className}" aria-label="Navegación de páginas" data-component="pagination">
        ${showInfo ? `
          <div class="pagination-info">
            Mostrando ${startItem}-${endItem} de ${totalItems} resultados
          </div>
        ` : ''}
        
        <div class="pagination-controls">
          ${showFirst && currentPage > 1 ? `
            <button class="pagination-btn pagination-first" data-page="1" aria-label="Primera página">
              ${renderIcon('chevron-left', { size: '16' })}
              ${renderIcon('chevron-left', { size: '16' })}
            </button>
          ` : ''}
          
          ${showPrevNext && currentPage > 1 ? `
            <button class="pagination-btn pagination-prev" data-page="${currentPage - 1}" aria-label="Página anterior">
              ${renderIcon('chevron-left', { size: '16' })}
              Anterior
            </button>
          ` : ''}
          
          <div class="pagination-pages">
            ${pages.map(page => {
              if (page === '...') {
                return `<span class="pagination-ellipsis">...</span>`;
              }
              
              const isActive = page === currentPage;
              return `
                <button 
                  class="pagination-btn pagination-page ${isActive ? 'pagination-active' : ''}" 
                  data-page="${page}"
                  ${isActive ? 'aria-current="page"' : ''}
                >
                  ${page}
                </button>
              `;
            }).join('')}
          </div>
          
          ${showPrevNext && currentPage < totalPages ? `
            <button class="pagination-btn pagination-next" data-page="${currentPage + 1}" aria-label="Página siguiente">
              Siguiente
              ${renderIcon('chevron-right', { size: '16' })}
            </button>
          ` : ''}
          
          ${showLast && currentPage < totalPages ? `
            <button class="pagination-btn pagination-last" data-page="${totalPages}" aria-label="Última página">
              ${renderIcon('chevron-right', { size: '16' })}
              ${renderIcon('chevron-right', { size: '16' })}
            </button>
          ` : ''}
        </div>
      </nav>
    `;
  }

  getVisiblePages() {
    const { currentPage, totalPages, maxVisiblePages } = this.props;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    // Always show first page
    if (currentPage > halfVisible + 2) {
      pages.push(1);
      if (currentPage > halfVisible + 3) {
        pages.push('...');
      }
    }
    
    // Show pages around current page
    const start = Math.max(1, currentPage - halfVisible);
    const end = Math.min(totalPages, currentPage + halfVisible);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Always show last page
    if (currentPage < totalPages - halfVisible - 1) {
      if (currentPage < totalPages - halfVisible - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="pagination"]';
  }

  bindEvents() {
    const buttons = this.element?.querySelectorAll('.pagination-btn[data-page]');
    if (buttons) {
      buttons.forEach(button => {
        this.addEventListener(button, 'click', (e) => {
          e.preventDefault();
          const page = parseInt(button.dataset.page);
          if (page !== this.props.currentPage) {
            this.props.onPageChange(page);
          }
        });
      });
    }
  }
}

// Steps/Progress Navigation Component
export class Steps extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      steps: [],             // Array of { title, description?, status: 'pending'|'current'|'completed' }
      currentStep: 0,
      orientation: 'horizontal', // horizontal, vertical
      showNumbers: true,
      showConnector: true,
      size: 'md',           // sm, md, lg
      className: '',
      onStepClick: null,
      ...props
    };
  }

  render() {
    const { steps, currentStep, orientation, showNumbers, showConnector, size, className } = this.props;
    
    if (!steps || steps.length === 0) return '';
    
    return `
      <nav class="steps steps-${orientation} steps-${size} ${className}" data-component="steps">
        <ol class="steps-list">
          ${steps.map((step, index) => {
            const status = this.getStepStatus(index);
            const isClickable = this.props.onStepClick && (status === 'completed' || status === 'current');
            
            return `
              <li class="step step-${status} ${isClickable ? 'step-clickable' : ''}" data-step="${index}">
                ${showConnector && index > 0 ? `
                  <div class="step-connector" aria-hidden="true">
                    <div class="step-connector-line"></div>
                  </div>
                ` : ''}
                
                <div class="step-content">
                  <div class="step-indicator">
                    ${showNumbers ? `
                      <div class="step-number">
                        ${status === 'completed' ? 
                          renderIcon('check', { size: '16', className: 'step-check' }) : 
                          index + 1
                        }
                      </div>
                    ` : `
                      <div class="step-dot"></div>
                    `}
                  </div>
                  
                  <div class="step-info">
                    <div class="step-title">${step.title}</div>
                    ${step.description ? `
                      <div class="step-description">${step.description}</div>
                    ` : ''}
                  </div>
                </div>
              </li>
            `;
          }).join('')}
        </ol>
      </nav>
    `;
  }

  getStepStatus(index) {
    const { currentStep } = this.props;
    
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="steps"]';
  }

  bindEvents() {
    if (this.props.onStepClick) {
      const clickableSteps = this.element?.querySelectorAll('.step-clickable');
      if (clickableSteps) {
        clickableSteps.forEach(step => {
          this.addEventListener(step, 'click', (e) => {
            e.preventDefault();
            const stepIndex = parseInt(step.dataset.step);
            this.props.onStepClick(stepIndex, this.props.steps[stepIndex]);
          });
        });
      }
    }
  }
}

// Tab Navigation Component
export class Tabs extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      tabs: [],              // Array of { id, label, content?, disabled? }
      activeTab: null,
      variant: 'default',    // default, pills, underline
      size: 'md',            // sm, md, lg
      fullWidth: false,
      className: '',
      onTabChange: () => {},
      ...props
    };

    this.state = {
      activeTab: this.props.activeTab || (this.props.tabs[0]?.id)
    };
  }

  render() {
    const { tabs, variant, size, fullWidth, className } = this.props;
    const { activeTab } = this.state;
    
    if (!tabs || tabs.length === 0) return '';
    
    return `
      <div class="tabs tabs-${variant} tabs-${size} ${fullWidth ? 'tabs-full-width' : ''} ${className}" data-component="tabs">
        <!-- Tab List -->
        <div class="tab-list" role="tablist">
          ${tabs.map(tab => `
            <button
              class="tab-button ${activeTab === tab.id ? 'tab-active' : ''} ${tab.disabled ? 'tab-disabled' : ''}"
              role="tab"
              aria-selected="${activeTab === tab.id}"
              aria-controls="tabpanel-${tab.id}"
              data-tab="${tab.id}"
              ${tab.disabled ? 'disabled' : ''}
            >
              ${tab.label}
            </button>
          `).join('')}
        </div>
        
        <!-- Tab Panels -->
        <div class="tab-panels">
          ${tabs.map(tab => `
            <div
              class="tab-panel ${activeTab === tab.id ? 'tab-panel-active' : ''}"
              role="tabpanel"
              id="tabpanel-${tab.id}"
              aria-labelledby="tab-${tab.id}"
              ${activeTab !== tab.id ? 'hidden' : ''}
            >
              ${tab.content || ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="tabs"]';
  }

  bindEvents() {
    const tabButtons = this.element?.querySelectorAll('.tab-button:not(.tab-disabled)');
    if (tabButtons) {
      tabButtons.forEach(button => {
        this.addEventListener(button, 'click', (e) => {
          e.preventDefault();
          const tabId = button.dataset.tab;
          this.setActiveTab(tabId);
        });
      });
    }

    // Keyboard navigation
    const tabList = this.element?.querySelector('.tab-list');
    if (tabList) {
      this.addEventListener(tabList, 'keydown', (e) => {
        this.handleKeyboard(e);
      });
    }
  }

  handleKeyboard(e) {
    const tabs = Array.from(this.element.querySelectorAll('.tab-button:not(.tab-disabled)'));
    const currentIndex = tabs.findIndex(tab => tab.dataset.tab === this.state.activeTab);
    
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    const newTabId = tabs[newIndex].dataset.tab;
    this.setActiveTab(newTabId);
    tabs[newIndex].focus();
  }

  setActiveTab(tabId) {
    const previousTab = this.state.activeTab;
    this.setState({ activeTab: tabId });
    
    // Update tab buttons
    const buttons = this.element?.querySelectorAll('.tab-button');
    buttons?.forEach(button => {
      const isActive = button.dataset.tab === tabId;
      button.classList.toggle('tab-active', isActive);
      button.setAttribute('aria-selected', isActive);
    });
    
    // Update tab panels
    const panels = this.element?.querySelectorAll('.tab-panel');
    panels?.forEach(panel => {
      const isActive = panel.id === `tabpanel-${tabId}`;
      panel.classList.toggle('tab-panel-active', isActive);
      panel.hidden = !isActive;
    });
    
    // Call callback
    if (this.props.onTabChange && previousTab !== tabId) {
      const tab = this.props.tabs.find(t => t.id === tabId);
      this.props.onTabChange(tabId, tab);
    }
  }

  // Public methods
  getActiveTab() {
    return this.state.activeTab;
  }

  activateTab(tabId) {
    this.setActiveTab(tabId);
  }
}

// Factory functions
export function createBreadcrumb(props) {
  return new Breadcrumb(props);
}

export function createPagination(props) {
  return new Pagination(props);
}

export function createSteps(props) {
  return new Steps(props);
}

export function createTabs(props) {
  return new Tabs(props);
}