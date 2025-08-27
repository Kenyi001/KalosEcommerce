/**
 * Header Component - Main navigation for Kalos E-commerce
 * Includes logo, navigation menu, and authentication buttons
 */

import { authService } from '../services/auth.js';

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
          <div id="auth-buttons" class="flex items-center space-x-3">
            <!-- Guest buttons (shown when not logged in) -->
            <div id="guest-buttons" class="flex items-center space-x-3">
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
            </div>

            <!-- Authenticated user buttons (shown when logged in) -->
            <div id="user-buttons" class="hidden flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm font-bold" id="user-avatar">
                  UD
                </div>
                <span class="text-sm font-medium text-gray-700" id="user-name">Usuario</span>
              </div>
              
              <div class="relative">
                <button id="user-menu-button" class="text-gray-600 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button data-router-link data-href="/cuenta" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mi Cuenta
                  </button>
                  <div id="role-badge" class="px-4 py-2 text-xs text-gray-500 border-b">
                    Cliente
                  </div>
                  <button id="logout-button" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
            
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

    // User dropdown toggle
    if (event.target.closest('#user-menu-button')) {
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown) {
        dropdown.classList.toggle('hidden');
      }
    }

    // Close dropdown when clicking outside
    if (!event.target.closest('#user-menu-button') && !event.target.closest('#user-dropdown')) {
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
      }
    }

    // Logout button
    if (event.target.closest('#logout-button')) {
      handleLogout();
    }
  });

  // Update header based on auth state
  updateHeaderAuthState();
  
  // Expose function globally for other components
  window.updateHeaderAuthState = updateHeaderAuthState;
  
  // Listen for auth state changes
  if (typeof authService !== 'undefined') {
    authService.onAuthStateChange(() => {
      updateHeaderAuthState();
    });
  }
}

/**
 * Update header based on authentication state
 */
function updateHeaderAuthState() {
  // Check for demo user in localStorage (for dev mode)
  let user = null;
  let profile = null;

  if (import.meta.env.DEV) {
    try {
      const demoUser = localStorage.getItem('demoUser');
      const demoProfile = localStorage.getItem('demoProfile');
      
      if (demoUser && demoProfile) {
        user = JSON.parse(demoUser);
        profile = JSON.parse(demoProfile);
      }
    } catch (error) {
      console.error('Error reading demo user from localStorage:', error);
    }
  }

  // If not demo mode, get from auth service
  if (!user && typeof authService !== 'undefined') {
    user = authService.getCurrentUser();
    profile = authService.getCurrentUserProfile();
  }

  const guestButtons = document.getElementById('guest-buttons');
  const userButtons = document.getElementById('user-buttons');
  const userName = document.getElementById('user-name');
  const userAvatar = document.getElementById('user-avatar');
  const roleBadge = document.getElementById('role-badge');

  if (user && profile) {
    // User is authenticated - show user buttons, hide guest buttons
    if (guestButtons) guestButtons.classList.add('hidden');
    if (userButtons) userButtons.classList.remove('hidden');
    
    // Update user info
    if (userName) userName.textContent = profile.displayName || user.email;
    if (userAvatar) userAvatar.textContent = getInitials(profile.displayName || user.email);
    if (roleBadge) {
      const roleText = profile.activeRole === 'professional' ? 'Profesional' : 'Cliente';
      roleBadge.textContent = `Modo: ${roleText}`;
    }
  } else {
    // User not authenticated - show guest buttons, hide user buttons
    if (guestButtons) guestButtons.classList.remove('hidden');
    if (userButtons) userButtons.classList.add('hidden');
  }
}

/**
 * Handle user logout
 */
async function handleLogout() {
  const confirmed = confirm('¿Estás seguro que deseas cerrar sesión?');
  if (!confirmed) return;

  try {
    // For demo mode, clear localStorage
    if (import.meta.env.DEV) {
      localStorage.removeItem('demoUser');
      localStorage.removeItem('demoProfile');
      updateHeaderAuthState();
      window.location.href = '/';
      return;
    }

    // For production, use auth service
    if (typeof authService !== 'undefined') {
      const result = await authService.logout();
      if (result.success) {
        window.location.href = '/';
      }
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error al cerrar sesión');
  }
}

/**
 * Get user initials for avatar
 */
function getInitials(name) {
  if (!name) return '?';
  
  const names = name.split(' ');
  if (names.length >= 2) {
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  } else {
    return names[0].charAt(0).toUpperCase();
  }
}

export default renderHeader;