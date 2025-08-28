/**
 * Header Component - Navigation header with authentication
 */

import { authService } from '../services/auth.js';

// Idempotencia global
if (!window.__headerMounted) window.__headerMounted = false;

export function renderHeader() {
  // Always render in default state (not authenticated)
  // updateHeaderAuthState() will fix the visibility after page load
  
  return `
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <button id="logo-button" class="flex-shrink-0 flex items-center">
              <div class="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold text-lg mr-3">
                K
              </div>
              <span class="font-display font-bold text-xl text-navy">Kalos</span>
            </button>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-6">
            <button 
              data-router-link 
              data-href="/marketplace"
              class="text-gray-600 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Marketplace
            </button>
            <button 
              data-router-link 
              data-href="/como-funciona"
              class="text-gray-600 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
              ¿Cómo Funciona?
            </button>
            <button 
              data-router-link 
              data-href="/ayuda"
              class="text-gray-600 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
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
                data-href="/auth/register"
                class="btn-primary text-sm px-4 py-2">
                Crear Cuenta
              </button>
              <button 
                data-router-link 
                data-href="/auth/register?role=professional"
                class="btn-secondary text-sm px-4 py-2 hidden sm:inline-flex">
                Soy Profesional
              </button>
            </div>

            <!-- Authenticated user buttons (shown when logged in) -->
            <div id="user-buttons" class="hidden flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm font-bold" id="user-avatar">
                  U
                </div>
                <span class="text-sm font-medium text-gray-700" id="user-name">
                  Usuario
                </span>
              </div>
              
              <div class="relative">
                <button id="user-menu-button" class="text-gray-600 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10">
                  <button data-router-link data-href="/cuenta" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mi Cuenta
                  </button>
                  
                  <div class="border-t border-gray-100 mt-1 pt-1">
                    <div class="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                      Cambiar Rol
                    </div>
                    <div id="role-switcher-menu"></div>
                  </div>
                  
                  <div class="border-t border-gray-100 mt-1 pt-1">
                    <div id="role-badge" class="px-4 py-2 text-xs text-gray-500">
                      Cliente
                    </div>
                    <button id="logout-button" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Cerrar Sesión
                    </button>
                  </div>
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
              data-href="/marketplace"
              class="text-gray-600 hover:text-brand px-3 py-2 text-base font-medium transition-colors">
              Marketplace
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
              data-href="/auth/register"
              class="text-brand hover:text-brand-hover px-3 py-2 text-base font-medium transition-colors">
              Crear Cuenta
            </button>
          </div>
        </div>
      </nav>
    </header>
  `;
}

export async function initializeHeader() {
  if (window.__headerMounted) {
    console.log('🏠 Header already mounted, skipping...');
    return;
  }
  
  console.log('🏠 Initializing header...');
  await waitForHeader();
  mountHeaderListeners();
  
  // Initial state update
  updateHeaderAuthState();
  
  // Subscribe to auth state changes
  subscribeToAuthChanges();
  
  window.__headerMounted = true;
  console.log('🏠 Header mounted successfully');
}

function subscribeToAuthChanges() {
  console.log('🏠 Subscribing to auth state changes...');
  
  // Listen for auth state changes
  if (authService && authService.onAuthStateChange) {
    authService.onAuthStateChange((authState) => {
      console.log('🏠 Header received auth state change:', authState);
      updateHeaderAuthState();
    });
  }
  
  // Also listen for auth state manager events (fallback)
  document.addEventListener('authStateChange', (event) => {
    console.log('🏠 Header received DOM auth state change:', event.detail);
    updateHeaderAuthState();
  });
}

async function waitForHeader() {
  const requiredNodes = ['auth-buttons', 'guest-buttons', 'user-buttons'];
  
  const hasRequired = () => requiredNodes.every(id => document.getElementById(id));
  
  // Wait for DOM ready first
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  }
  
  // Check if required nodes already exist
  if (hasRequired()) {
    console.log('🏠 Required header nodes found immediately');
    return;
  }
  
  // Wait for nodes with MutationObserver + timeout
  console.log('🏠 Waiting for header nodes...');
  await new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (hasRequired()) {
        console.log('🏠 Required header nodes found via observer');
        observer.disconnect();
        resolve();
      }
    });
    
    observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true 
    });
    
    // Timeout fallback
    setTimeout(() => {
      observer.disconnect();
      console.log('🏠 Header wait timeout, proceeding anyway');
      resolve();
    }, 3000);
  });
}

function mountHeaderListeners() {
  // Remove any existing listener first
  if (window.headerClickListener) {
    document.removeEventListener('click', window.headerClickListener);
  }
  
  // Create new listener
  window.headerClickListener = handleHeaderClick;
  document.addEventListener('click', handleHeaderClick);
  console.log('🏠 Header click listener mounted');
}

function handleHeaderClick(event) {
  const target = event.target;
  
  // User dropdown toggle - null-safe
  const userMenuButton = document.getElementById('user-menu-button');
  const userDropdown = document.getElementById('user-dropdown');
  
  if (userMenuButton && userDropdown) {
    const clickedButton = userMenuButton.contains(target);
    const clickedDropdown = userDropdown.contains(target);
    
    if (clickedButton) {
      event.preventDefault();
      event.stopPropagation();
      userDropdown.classList.toggle('hidden');
      console.log('🔽 User dropdown toggled');
      return;
    } else if (!clickedDropdown && !userDropdown.classList.contains('hidden')) {
      userDropdown.classList.add('hidden');
      console.log('🔽 User dropdown closed (click outside)');
    }
  }
  
  // Logo button handling
  if (target.closest('#logo-button')) {
    event.preventDefault();
    
    // Smart redirect based on user role
    if (import.meta.env.DEV) {
      try {
        const demoProfile = localStorage.getItem('demoProfile');
        if (demoProfile) {
          const profile = JSON.parse(demoProfile);
          if (profile.activeRole === 'professional') {
            window.location.href = '/pro/dashboard';
            return;
          }
        }
      } catch (error) {
        console.error('Error checking demo profile:', error);
      }
    }
    
    // For authenticated users via authService
    if (typeof authService !== 'undefined') {
      const profile = authService.getCurrentUserProfile();
      if (profile?.activeRole === 'professional') {
        window.location.href = '/pro/dashboard';
        return;
      }
    }
    
    // Default redirect
    window.location.href = '/';
  }
  
  // Router link handling
  const routerLink = target.closest('[data-router-link]');
  if (routerLink) {
    event.preventDefault();
    const href = routerLink.getAttribute('data-href');
    if (href && window.navigateTo) {
      // Close dropdown if open
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
      }
      window.navigateTo(href);
    }
  }
  
  // Logout handling
  if (target.closest('#logout-button')) {
    event.preventDefault();
    handleLogout();
  }
  
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuButton && mobileMenu && mobileMenuButton.contains(target)) {
    mobileMenu.classList.toggle('hidden');
  }
}

export function applyAuthVisibility({ authenticated }) {
  const guestButtons = document.getElementById('guest-buttons');
  const userButtons = document.getElementById('user-buttons');
  
  console.log('🏠 Looking for auth buttons:', {
    guestButtons: !!guestButtons,
    userButtons: !!userButtons,
    authenticated
  });
  
  if (!guestButtons || !userButtons) {
    console.warn('🏠 Auth buttons not found, skipping visibility update');
    console.warn('🏠 Available elements with IDs:', 
      Array.from(document.querySelectorAll('[id]')).map(el => el.id));
    return;
  }
  
  // Use only CSS classes, never inline styles
  guestButtons.classList.toggle('hidden', !!authenticated);
  userButtons.classList.toggle('hidden', !authenticated);
  
  console.log('🏠 Auth visibility updated:', { 
    authenticated,
    guestHidden: guestButtons.classList.contains('hidden'),
    userHidden: userButtons.classList.contains('hidden')
  });
}

// Global function for manual re-sync from views that render late
window.forceHeaderUpdate = function(authState) {
  console.log('🏠 Force header update called:', authState);
  
  if (authState) {
    applyAuthVisibility(authState);
    if (authState.authenticated) {
      updateUserInfo();
    }
  } else {
    // Auto-detect current auth state
    const currentAuth = getCurrentAuthState();
    applyAuthVisibility(currentAuth);
    if (currentAuth.authenticated) {
      updateUserInfo();
    }
  }
};

function getCurrentAuthState() {
  // Adapt this to your auth system
  if (typeof authService !== 'undefined' && authService.getCurrentUser) {
    return { authenticated: !!authService.getCurrentUser() };
  }
  
  // Fallback for demo mode
  const demoProfile = localStorage.getItem('demoProfile');
  return { authenticated: !!demoProfile };
}

function getCurrentUser() {
  console.log('🔍 getCurrentUser() called');
  console.log('🔍 authService available:', typeof authService !== 'undefined');
  console.log('🔍 window.authService available:', typeof window.authService !== 'undefined');
  
  // Try multiple ways to access authService
  let user = null;
  
  if (typeof authService !== 'undefined' && authService?.getCurrentUser) {
    user = authService.getCurrentUser();
    console.log('🔍 authService.getCurrentUser():', user?.email || 'null');
  } else if (typeof window.authService !== 'undefined' && window.authService?.getCurrentUser) {
    user = window.authService.getCurrentUser();
    console.log('🔍 window.authService.getCurrentUser():', user?.email || 'null');
  } else {
    // Demo mode fallback
    const demoUser = localStorage.getItem('demoUser');
    user = demoUser ? JSON.parse(demoUser) : null;
    console.log('🔍 Demo user from localStorage:', user?.email || 'null');
  }
  
  return user;
}

function getCurrentProfile() {
  console.log('🔍 getCurrentProfile() called');
  
  // Try multiple ways to access authService
  let profile = null;
  
  if (typeof authService !== 'undefined' && authService?.getCurrentUserProfile) {
    profile = authService.getCurrentUserProfile();
    console.log('🔍 authService.getCurrentUserProfile():', profile?.activeRole || 'null');
  } else if (typeof window.authService !== 'undefined' && window.authService?.getCurrentUserProfile) {
    profile = window.authService.getCurrentUserProfile();
    console.log('🔍 window.authService.getCurrentUserProfile():', profile?.activeRole || 'null');
  } else {
    // Demo mode fallback
    const demoProfile = localStorage.getItem('demoProfile');
    profile = demoProfile ? JSON.parse(demoProfile) : null;
    console.log('🔍 Demo profile from localStorage:', profile?.activeRole || 'null');
  }
  
  return profile;
}

function updateHeaderAuthState() {
  console.log('🔄 Updating header auth state...');
  
  const user = getCurrentUser();
  const profile = getCurrentProfile();
  
  if (user && profile) {
    console.log('🔄 User authenticated, showing user buttons');
    applyAuthVisibility({ authenticated: true });
    updateUserInfo();
  } else {
    console.log('🔄 User NOT authenticated, showing guest buttons');
    applyAuthVisibility({ authenticated: false });
  }
}

function updateUserInfo() {
  const user = getCurrentUser();
  const profile = getCurrentProfile();
  
  if (!user || !profile) return;
  
  const userName = document.getElementById('user-name');
  const userAvatar = document.getElementById('user-avatar');
  const roleBadge = document.getElementById('role-badge');
  
  // Update user info
  if (userName) userName.textContent = profile.displayName || user.email?.split('@')[0] || 'Usuario';
  if (userAvatar) userAvatar.textContent = getInitials(profile.displayName || user.email);
  if (roleBadge) {
    const roleText = profile.activeRole === 'professional' ? 'Profesional' : 'Cliente';
    roleBadge.textContent = roleText;
  }
  
  // Populate role switcher menu
  const roleSwitcherMenu = document.getElementById('role-switcher-menu');
  if (roleSwitcherMenu && profile.availableRoles) {
    populateRoleSwitcherMenu(roleSwitcherMenu, profile.availableRoles, profile.activeRole);
  }
}

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
}

async function handleLogout() {
  console.log('🚪 Logout button clicked');
  const confirmed = confirm('¿Estás seguro que deseas cerrar sesión?');
  if (!confirmed) return;

  try {
    console.log('🚪 Processing logout...');
    
    // For demo mode, clear localStorage
    if (import.meta.env.DEV) {
      console.log('🚪 Demo mode logout - clearing localStorage');
      localStorage.removeItem('demoUser');
      localStorage.removeItem('demoProfile');
      console.log('🚪 localStorage cleared, updating header');
      updateHeaderAuthState();
      console.log('🚪 Redirecting to home');
      window.location.href = '/';
      return;
    }
    
    // Use authService for real logout
    if (typeof authService !== 'undefined' && authService.logout) {
      await authService.logout();
      console.log('🚪 User logged out via authService');
      updateHeaderAuthState();
      window.location.href = '/';
    }
  } catch (error) {
    console.error('🚪 Error during logout:', error);
    alert('Error al cerrar sesión. Por favor intenta de nuevo.');
  }
}

function populateRoleSwitcherMenu(menuContainer, availableRoles, activeRole) {
  if (!menuContainer || !availableRoles) return;
  
  menuContainer.innerHTML = '';
  
  availableRoles.forEach(role => {
    if (role !== activeRole) {
      const button = document.createElement('button');
      button.className = 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';
      button.textContent = role === 'professional' ? 'Cambiar a Profesional' : 'Cambiar a Cliente';
      button.addEventListener('click', () => switchToRole(role));
      menuContainer.appendChild(button);
    }
  });
}

function switchToRole(newRole) {
  console.log('🔄 Switching to role:', newRole);
  
  if (import.meta.env.DEV) {
    // Demo mode
    const demoProfile = JSON.parse(localStorage.getItem('demoProfile') || '{}');
    demoProfile.activeRole = newRole;
    localStorage.setItem('demoProfile', JSON.stringify(demoProfile));
    
    // Update header
    updateHeaderAuthState();
    
    // Navigate to appropriate page
    if (newRole === 'professional') {
      window.location.href = '/pro/dashboard';
    } else {
      window.location.href = '/marketplace';
    }
  } else {
    // Use authService for real role switch
    if (typeof authService !== 'undefined' && authService.switchRole) {
      authService.switchRole(newRole);
    }
  }
}

// Expose functions globally
window.updateHeaderAuthState = updateHeaderAuthState;
window.initializeHeader = initializeHeader;

export default { renderHeader, initializeHeader, applyAuthVisibility };