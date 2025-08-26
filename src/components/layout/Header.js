// Header component for Kalos E-commerce
import { Button } from '../ui/Button.js';

export class Header {
  constructor(config = {}) {
    this.config = {
      showNavigation: config.showNavigation !== false,
      showAuth: config.showAuth !== false,
      currentUser: config.currentUser || null,
      onAuthClick: config.onAuthClick || (() => {}),
      onLogoClick: config.onLogoClick || (() => window.location.href = '/'),
      className: config.className || '',
      ...config
    };
  }

  render() {
    const header = document.createElement('header');
    header.className = `sticky top-0 z-50 bg-white border-b border-gray-200 ${this.config.className}`;
    
    header.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center cursor-pointer" id="header-logo">
            <div class="flex-shrink-0 flex items-center">
              <svg class="h-8 w-8 text-brand mr-2" viewBox="0 0 32 32" fill="currentColor">
                <rect width="32" height="32" rx="6" fill="#F74F4E"/>
                <path d="M8 24V8h3v6.5l6-6.5h4l-6 6 6 10h-4l-4-6.5-2 2V24H8z" fill="white"/>
                <circle cx="24" cy="12" r="2" fill="#FCBE3C" opacity="0.8"/>
                <circle cx="22" cy="20" r="1.5" fill="#FCBE3C" opacity="0.6"/>
              </svg>
              <span class="font-fraunces font-bold text-xl text-navy-900">Kalos</span>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-8" id="desktop-nav">
            <a href="/buscar" class="nav-link text-navy-600 hover:text-brand transition-colors">
              Buscar Servicios
            </a>
            <a href="/como-funciona" class="nav-link text-navy-600 hover:text-brand transition-colors">
              Cómo Funciona
            </a>
            <a href="/profesionales" class="nav-link text-navy-600 hover:text-brand transition-colors">
              Únete como Profesional
            </a>
          </nav>

          <!-- Auth Section -->
          <div class="hidden md:flex items-center space-x-4" id="auth-section">
            ${this.renderAuthSection()}
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button type="button" 
                    id="mobile-menu-button"
                    class="bg-white rounded-md p-2 inline-flex items-center justify-center text-navy-600 hover:text-brand hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
                    aria-expanded="false">
              <span class="sr-only">Abrir menú principal</span>
              <!-- Heroicon name: outline/menu -->
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="md:hidden hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-200">
          <a href="/buscar" class="nav-link block px-3 py-2 text-base font-medium text-navy-600 hover:text-brand hover:bg-gray-50 rounded-md">
            Buscar Servicios
          </a>
          <a href="/como-funciona" class="nav-link block px-3 py-2 text-base font-medium text-navy-600 hover:text-brand hover:bg-gray-50 rounded-md">
            Cómo Funciona
          </a>
          <a href="/profesionales" class="nav-link block px-3 py-2 text-base font-medium text-navy-600 hover:text-brand hover:bg-gray-50 rounded-md">
            Únete como Profesional
          </a>
          <div class="border-t border-gray-200 pt-4">
            ${this.renderMobileAuthSection()}
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(header);
    return header;
  }

  renderAuthSection() {
    if (this.config.currentUser) {
      // User is authenticated
      return `
        <div class="flex items-center space-x-3">
          <div class="flex items-center">
            <img class="h-8 w-8 rounded-full" 
                 src="${this.config.currentUser.photoURL || '/default-avatar.svg'}" 
                 alt="${this.config.currentUser.displayName}" />
            <span class="ml-2 text-sm font-medium text-navy-700 hidden lg:block">
              ${this.config.currentUser.displayName || 'Usuario'}
            </span>
          </div>
          <div class="relative">
            <button id="user-menu-button" 
                    class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand">
              <span class="sr-only">Abrir menú de usuario</span>
              <svg class="h-5 w-5 text-navy-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <!-- User dropdown menu will be added here -->
          </div>
        </div>
      `;
    } else {
      // User is not authenticated
      return `
        <div class="flex items-center space-x-4">
          <button id="login-button" class="text-navy-600 hover:text-brand font-medium transition-colors">
            Iniciar Sesión
          </button>
          <div id="register-button-container"></div>
        </div>
      `;
    }
  }

  renderMobileAuthSection() {
    if (this.config.currentUser) {
      return `
        <div class="flex items-center px-3 py-2">
          <img class="h-10 w-10 rounded-full" 
               src="${this.config.currentUser.photoURL || '/default-avatar.svg'}" 
               alt="${this.config.currentUser.displayName}" />
          <div class="ml-3">
            <div class="text-base font-medium text-navy-800">
              ${this.config.currentUser.displayName || 'Usuario'}
            </div>
            <div class="text-sm font-medium text-navy-500">
              ${this.config.currentUser.email}
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="px-3 py-2 space-y-2">
          <button id="mobile-login-button" 
                  class="w-full btn-outline">
            Iniciar Sesión
          </button>
          <div id="mobile-register-button-container"></div>
        </div>
      `;
    }
  }

  attachEventListeners(header) {
    // Logo click
    const logo = header.querySelector('#header-logo');
    if (logo) {
      logo.addEventListener('click', this.config.onLogoClick);
    }

    // Mobile menu toggle
    const mobileMenuButton = header.querySelector('#mobile-menu-button');
    const mobileMenu = header.querySelector('#mobile-menu');
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');
        } else {
          mobileMenu.classList.remove('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // Auth buttons
    if (!this.config.currentUser) {
      // Login buttons
      const loginButton = header.querySelector('#login-button');
      const mobileLoginButton = header.querySelector('#mobile-login-button');
      
      [loginButton, mobileLoginButton].forEach(button => {
        if (button) {
          button.addEventListener('click', () => this.config.onAuthClick('login'));
        }
      });

      // Register buttons - create with Button component
      const registerContainer = header.querySelector('#register-button-container');
      const mobileRegisterContainer = header.querySelector('#mobile-register-button-container');
      
      if (registerContainer) {
        const registerButton = Button.create({
          text: 'Registrarse',
          variant: 'primary',
          onClick: () => this.config.onAuthClick('register')
        });
        registerContainer.appendChild(registerButton);
      }

      if (mobileRegisterContainer) {
        const mobileRegisterButton = Button.create({
          text: 'Registrarse',
          variant: 'primary',
          fullWidth: true,
          onClick: () => this.config.onAuthClick('register')
        });
        mobileRegisterContainer.appendChild(mobileRegisterButton);
      }
    }

    // User menu (if authenticated)
    const userMenuButton = header.querySelector('#user-menu-button');
    if (userMenuButton) {
      userMenuButton.addEventListener('click', () => {
        // TODO: Implement user dropdown menu
        console.log('User menu clicked');
      });
    }
  }

  // Update user state
  updateUser(user) {
    this.config.currentUser = user;
    // Re-render header would go here in a more complex app
    // For now, we'll handle this in the main app
  }

  // Static method for quick header creation
  static create(config) {
    const header = new Header(config);
    return header.render();
  }
}

export default Header;