/**
 * Page Layout Templates - Kalos Design System
 * Complete page layouts for different application contexts
 */

import { BaseComponent } from '../../BaseComponent.js';

// Main Application Layout
export class MainLayout extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      title: 'Kalos Beauty',
      description: '',
      showHeader: true,
      showFooter: true,
      showSidebar: false,
      sidebarPosition: 'left',  // left, right
      containerSize: 'full',    // sm, md, lg, xl, full
      headerContent: '',
      footerContent: '',
      sidebarContent: '',
      children: '',
      className: '',
      ...props
    };
  }

  render() {
    const { 
      title, 
      description,
      showHeader, 
      showFooter, 
      showSidebar,
      sidebarPosition,
      containerSize, 
      headerContent,
      footerContent,
      sidebarContent,
      children, 
      className 
    } = this.props;

    const layoutClasses = [
      'main-layout',
      showSidebar ? 'has-sidebar' : '',
      showSidebar ? `sidebar-${sidebarPosition}` : '',
      className
    ].filter(Boolean).join(' ');

    const containerClasses = [
      'main-container',
      containerSize !== 'full' ? `container-${containerSize}` : ''
    ].filter(Boolean).join(' ');

    return `
      <div class="${layoutClasses}" data-component="main-layout">
        ${showHeader ? `
          <header class="main-header">
            ${headerContent || this.renderDefaultHeader()}
          </header>
        ` : ''}

        <div class="main-wrapper">
          ${showSidebar ? `
            <aside class="main-sidebar">
              <div class="sidebar-content">
                ${sidebarContent}
              </div>
            </aside>
          ` : ''}

          <main class="main-content" role="main">
            <div class="${containerClasses}">
              ${title && !showHeader ? `
                <div class="page-header">
                  <h1 class="page-title">${title}</h1>
                  ${description ? `<p class="page-description">${description}</p>` : ''}
                </div>
              ` : ''}
              
              <div class="page-content">
                ${children}
              </div>
            </div>
          </main>
        </div>

        ${showFooter ? `
          <footer class="main-footer">
            ${footerContent || this.renderDefaultFooter()}
          </footer>
        ` : ''}
      </div>
    `;
  }

  renderDefaultHeader() {
    return `
      <div class="header-content">
        <div class="header-brand">
          <img src="/logo.svg" alt="Kalos" class="brand-logo" />
          <span class="brand-name">Kalos</span>
        </div>
        
        <nav class="header-nav">
          <a href="/" class="nav-link">Inicio</a>
          <a href="/professionals" class="nav-link">Profesionales</a>
          <a href="/services" class="nav-link">Servicios</a>
          <a href="/about" class="nav-link">Nosotros</a>
        </nav>
        
        <div class="header-actions">
          <button class="btn btn-ghost btn-sm">Iniciar sesión</button>
          <button class="btn btn-primary btn-sm">Registrarse</button>
        </div>
      </div>
    `;
  }

  renderDefaultFooter() {
    return `
      <div class="footer-content">
        <div class="footer-section">
          <h4>Kalos Beauty</h4>
          <p>La mejor plataforma para conectar con profesionales de belleza en Bolivia.</p>
        </div>
        
        <div class="footer-section">
          <h5>Enlaces</h5>
          <ul class="footer-links">
            <li><a href="/professionals">Profesionales</a></li>
            <li><a href="/services">Servicios</a></li>
            <li><a href="/about">Nosotros</a></li>
            <li><a href="/contact">Contacto</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h5>Legal</h5>
          <ul class="footer-links">
            <li><a href="/privacy">Privacidad</a></li>
            <li><a href="/terms">Términos</a></li>
          </ul>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 Kalos Beauty. Todos los derechos reservados.</p>
        </div>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="main-layout"]';
  }
}

// Authentication Layout
export class AuthLayout extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      title: '',
      subtitle: '',
      showLogo: true,
      backgroundImage: '/auth-bg.jpg',
      children: '',
      className: '',
      ...props
    };
  }

  render() {
    const { title, subtitle, showLogo, backgroundImage, children, className } = this.props;

    return `
      <div class="auth-layout ${className}" data-component="auth-layout">
        <div class="auth-background" style="background-image: url(${backgroundImage})">
          <div class="auth-overlay"></div>
        </div>
        
        <div class="auth-content">
          <div class="auth-container">
            ${showLogo ? `
              <div class="auth-logo">
                <img src="/logo.svg" alt="Kalos" />
                <h1>Kalos</h1>
              </div>
            ` : ''}
            
            <div class="auth-header">
              ${title ? `<h2 class="auth-title">${title}</h2>` : ''}
              ${subtitle ? `<p class="auth-subtitle">${subtitle}</p>` : ''}
            </div>
            
            <div class="auth-form">
              ${children}
            </div>
            
            <div class="auth-footer">
              <p>¿Necesitas ayuda? <a href="/support">Contacta soporte</a></p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="auth-layout"]';
  }
}

// Dashboard Layout
export class DashboardLayout extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      title: 'Dashboard',
      user: null,               // User object with name, avatar, etc.
      sidebarItems: [],         // Navigation items
      headerActions: [],        // Header action buttons
      showBreadcrumbs: true,
      breadcrumbs: [],
      notifications: [],
      children: '',
      className: '',
      onNavigate: () => {},
      onLogout: () => {},
      ...props
    };

    this.state = {
      sidebarCollapsed: false,
      showNotifications: false
    };
  }

  render() {
    const { 
      title, 
      user, 
      sidebarItems, 
      headerActions,
      showBreadcrumbs,
      breadcrumbs,
      notifications,
      children, 
      className 
    } = this.props;

    const { sidebarCollapsed, showNotifications } = this.state;

    const layoutClasses = [
      'dashboard-layout',
      sidebarCollapsed ? 'sidebar-collapsed' : '',
      className
    ].filter(Boolean).join(' ');

    return `
      <div class="${layoutClasses}" data-component="dashboard-layout">
        <!-- Dashboard Sidebar -->
        <aside class="dashboard-sidebar">
          <div class="sidebar-header">
            <div class="sidebar-logo">
              <img src="/logo.svg" alt="Kalos" />
              ${!sidebarCollapsed ? '<span>Kalos</span>' : ''}
            </div>
            
            <button class="sidebar-toggle" aria-label="Toggle sidebar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <nav class="sidebar-nav">
            <ul class="nav-list">
              ${sidebarItems.map(item => `
                <li class="nav-item">
                  <a href="${item.href}" class="nav-link ${item.active ? 'active' : ''}" data-nav="${item.key}">
                    ${item.icon ? `<span class="nav-icon">${item.icon}</span>` : ''}
                    ${!sidebarCollapsed ? `<span class="nav-label">${item.label}</span>` : ''}
                    ${item.badge && !sidebarCollapsed ? `<span class="nav-badge">${item.badge}</span>` : ''}
                  </a>
                </li>
              `).join('')}
            </ul>
          </nav>
          
          ${user ? `
            <div class="sidebar-user">
              <div class="user-info">
                <img src="${user.avatar || '/default-avatar.png'}" alt="${user.name}" class="user-avatar" />
                ${!sidebarCollapsed ? `
                  <div class="user-details">
                    <div class="user-name">${user.name}</div>
                    <div class="user-role">${user.role || 'Usuario'}</div>
                  </div>
                ` : ''}
              </div>
              
              <button class="logout-btn" aria-label="Cerrar sesión" title="Cerrar sesión">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          ` : ''}
        </aside>

        <!-- Dashboard Main Content -->
        <div class="dashboard-main">
          <!-- Dashboard Header -->
          <header class="dashboard-header">
            <div class="header-left">
              <h1 class="dashboard-title">${title}</h1>
              
              ${showBreadcrumbs && breadcrumbs.length > 0 ? `
                <nav class="breadcrumbs" aria-label="Navegación de migas">
                  <ol class="breadcrumb-list">
                    ${breadcrumbs.map((crumb, index) => `
                      <li class="breadcrumb-item">
                        ${index < breadcrumbs.length - 1 ? `
                          <a href="${crumb.href}" class="breadcrumb-link">${crumb.label}</a>
                        ` : `
                          <span class="breadcrumb-current">${crumb.label}</span>
                        `}
                      </li>
                    `).join('')}
                  </ol>
                </nav>
              ` : ''}
            </div>
            
            <div class="header-right">
              ${headerActions.map(action => `
                <button class="header-action ${action.className || ''}" data-action="${action.key}" title="${action.title}">
                  ${action.icon}
                  ${action.badge ? `<span class="action-badge">${action.badge}</span>` : ''}
                </button>
              `).join('')}
              
              ${notifications.length > 0 ? `
                <div class="notifications-dropdown">
                  <button class="notifications-toggle ${showNotifications ? 'active' : ''}" aria-label="Notificaciones">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span class="notifications-count">${notifications.length}</span>
                  </button>
                  
                  ${showNotifications ? `
                    <div class="notifications-panel">
                      <div class="notifications-header">
                        <h4>Notificaciones</h4>
                        <button class="mark-all-read">Marcar todas como leídas</button>
                      </div>
                      <ul class="notifications-list">
                        ${notifications.slice(0, 5).map(notification => `
                          <li class="notification-item ${notification.read ? 'read' : 'unread'}">
                            <div class="notification-content">
                              <p class="notification-text">${notification.text}</p>
                              <time class="notification-time">${notification.time}</time>
                            </div>
                          </li>
                        `).join('')}
                      </ul>
                      <div class="notifications-footer">
                        <a href="/notifications" class="view-all-notifications">Ver todas</a>
                      </div>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          </header>

          <!-- Dashboard Content -->
          <main class="dashboard-content">
            ${children}
          </main>
        </div>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="dashboard-layout"]';
  }

  bindEvents() {
    // Sidebar toggle
    const sidebarToggle = this.element.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      this.addEventListener(sidebarToggle, 'click', () => {
        this.toggleSidebar();
      });
    }

    // Navigation links
    const navLinks = this.element.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      this.addEventListener(link, 'click', (e) => {
        const navKey = e.currentTarget.dataset.nav;
        if (this.props.onNavigate && navKey) {
          e.preventDefault();
          this.props.onNavigate(navKey, e.currentTarget.href);
        }
      });
    });

    // Logout button
    const logoutBtn = this.element.querySelector('.logout-btn');
    if (logoutBtn) {
      this.addEventListener(logoutBtn, 'click', () => {
        if (this.props.onLogout) {
          this.props.onLogout();
        }
      });
    }

    // Notifications toggle
    const notificationsToggle = this.element.querySelector('.notifications-toggle');
    if (notificationsToggle) {
      this.addEventListener(notificationsToggle, 'click', () => {
        this.setState({ showNotifications: !this.state.showNotifications });
      });
    }

    // Header actions
    const headerActions = this.element.querySelectorAll('.header-action');
    headerActions.forEach(action => {
      this.addEventListener(action, 'click', (e) => {
        const actionKey = e.currentTarget.dataset.action;
        const actionConfig = this.props.headerActions.find(a => a.key === actionKey);
        if (actionConfig && actionConfig.onClick) {
          actionConfig.onClick();
        }
      });
    });

    // Close notifications on outside click
    this.addEventListener(document, 'click', (e) => {
      const notificationsDropdown = this.element.querySelector('.notifications-dropdown');
      if (notificationsDropdown && !notificationsDropdown.contains(e.target)) {
        this.setState({ showNotifications: false });
      }
    });
  }

  toggleSidebar() {
    this.setState({ sidebarCollapsed: !this.state.sidebarCollapsed });
  }

  // Public methods
  setActiveNavItem(key) {
    this.props.sidebarItems.forEach(item => {
      item.active = item.key === key;
    });
    this.rerender();
  }

  addNotification(notification) {
    this.props.notifications.unshift(notification);
    this.rerender();
  }

  clearNotifications() {
    this.props.notifications = [];
    this.rerender();
  }
}

// Error Layout
export class ErrorLayout extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      errorCode: '404',
      title: 'Página no encontrada',
      message: 'Lo sentimos, la página que buscas no existe.',
      showHomeButton: true,
      showBackButton: true,
      children: '',
      className: '',
      ...props
    };
  }

  render() {
    const { errorCode, title, message, showHomeButton, showBackButton, children, className } = this.props;

    return `
      <div class="error-layout ${className}" data-component="error-layout">
        <div class="error-container">
          <div class="error-content">
            <div class="error-code">${errorCode}</div>
            <h1 class="error-title">${title}</h1>
            <p class="error-message">${message}</p>
            
            ${children || ''}
            
            <div class="error-actions">
              ${showBackButton ? `
                <button class="btn btn-ghost btn-lg back-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H6m6-6-6 6 6 6"/>
                  </svg>
                  Volver
                </button>
              ` : ''}
              
              ${showHomeButton ? `
                <a href="/" class="btn btn-primary btn-lg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                  Ir al inicio
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="error-layout"]';
  }

  bindEvents() {
    const backBtn = this.element.querySelector('.back-btn');
    if (backBtn) {
      this.addEventListener(backBtn, 'click', () => {
        window.history.back();
      });
    }
  }
}

// Factory functions
export function createMainLayout(props) {
  return new MainLayout(props);
}

export function createAuthLayout(props) {
  return new AuthLayout(props);
}

export function createDashboardLayout(props) {
  return new DashboardLayout(props);
}

export function createErrorLayout(props) {
  return new ErrorLayout(props);
}