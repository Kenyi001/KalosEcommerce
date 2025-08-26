/**
 * Header Component - Main navigation for Kalos E-commerce
 * Includes logo, navigation menu, and authentication buttons
 */

export function renderHeader() {
  return `
    <header class="bg-kalos-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <button 
              data-router-link 
              data-href="/"
              class="flex items-center space-x-2">
              <span class="text-2xl">💄</span>
              <h1 class="text-2xl font-display font-bold text-brand">Kalos</h1>
            </button>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <button 
              data-router-link 
              data-href="/buscar"
              class="nav-link text-gray-600 hover:text-brand transition-colors">
              Buscar Profesionales
            </button>
            <button 
              data-router-link 
              data-href="/como-funciona"
              class="nav-link text-gray-600 hover:text-brand transition-colors">
              ¿Cómo Funciona?
            </button>
            <button 
              data-router-link 
              data-href="/ayuda"
              class="nav-link text-gray-600 hover:text-brand transition-colors">
              Ayuda
            </button>
          </div>

          <!-- Authentication Buttons -->
          <div class="flex items-center space-x-3">
            <button 
              data-router-link 
              data-href="/auth/login"
              class="hidden sm:inline-flex text-gray-600 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Iniciar Sesión
            </button>
            <button 
              data-router-link 
              data-href="/auth/signup"
              class="btn-primary text-sm px-4 py-2">
              Crear Cuenta
            </button>
            <button 
              data-router-link 
              data-href="/auth/signup?role=professional"
              class="btn-secondary text-sm px-4 py-2 hidden sm:inline-flex">
              Soy Profesional
            </button>
            
            <!-- Mobile menu button -->
            <button 
              id="mobile-menu-button"
              class="md:hidden p-2 rounded-md text-gray-600 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div id="mobile-menu" class="md:hidden hidden border-t border-gray-200 py-4">
          <div class="flex flex-col space-y-3">
            <button 
              data-router-link 
              data-href="/buscar"
              class="text-gray-600 hover:text-brand px-3 py-2 text-base font-medium transition-colors">
              Buscar Profesionales
            </button>
            <button 
              data-router-link 
              data-href="/como-funciona"
              class="text-gray-600 hover:text-brand px-3 py-2 text-base font-medium transition-colors">
              ¿Cómo Funciona?
            </button>
            <button 
              data-router-link 
              data-href="/ayuda"
              class="text-gray-600 hover:text-brand px-3 py-2 text-base font-medium transition-colors">
              Ayuda
            </button>
            <hr class="border-gray-200">
            <button 
              data-router-link 
              data-href="/auth/login"
              class="text-gray-600 hover:text-brand px-3 py-2 text-base font-medium transition-colors">
              Iniciar Sesión
            </button>
            <button 
              data-router-link 
              data-href="/auth/signup?role=professional"
              class="text-brand hover:text-brand-hover px-3 py-2 text-base font-medium transition-colors">
              Soy Profesional
            </button>
          </div>
        </div>
      </nav>
    </header>
  `;
}

/**
 * Initialize header interactions (mobile menu)
 */
export function initializeHeader() {
  // Mobile menu toggle
  document.addEventListener('click', (event) => {
    if (event.target.closest('#mobile-menu-button')) {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
      }
    }
    
    // Close mobile menu when clicking outside or on a link
    if (!event.target.closest('#mobile-menu-button') && !event.target.closest('#mobile-menu')) {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    }
  });
}

export default renderHeader;