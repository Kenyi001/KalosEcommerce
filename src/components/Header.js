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
              id="logo-button"
              class="flex items-center space-x-2">
              <span class="text-2xl">💄</span>
              <h1 class="text-2xl font-display font-bold text-brand">Kalos</h1>
            </button>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <button 
              data-router-link 
              data-href="/marketplace"
              class="nav-link text-gray-600 hover:text-brand transition-colors">
              Marketplace
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
                
                <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10">
                  <button data-router-link data-href="/cuenta" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mi Cuenta
                  </button>
                  
                  <div class="border-t border-gray-100 mt-1 pt-1">
                    <div class="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                      Cambiar Rol
                    </div>
                    <div id="role-switcher-menu">
                      <!-- Role options will be populated by JavaScript -->
                    </div>
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
              data-href="/auth/register?role=professional"
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
  console.log('🚀 Initializing header...');
  
  // Logo click - smart home redirect
  document.addEventListener('click', (event) => {
    if (event.target.closest('#logo-button')) {
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
    
    // Mobile menu toggle
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
  
  // Debug function for console
  window.debugHeader = () => {
    console.log('🐛 Manual header debug:');
    console.log('🐛 authService exists:', typeof authService !== 'undefined');
    console.log('🐛 authService.getCurrentUser():', authService?.getCurrentUser()?.email);
    console.log('🐛 authService.getCurrentUserProfile():', authService?.getCurrentUserProfile());
    
    // Check localStorage too
    if (import.meta.env.DEV) {
      console.log('🐛 localStorage demoUser:', localStorage.getItem('demoUser') ? 'exists' : 'none');
      console.log('🐛 localStorage demoProfile:', localStorage.getItem('demoProfile') ? JSON.parse(localStorage.getItem('demoProfile')) : 'none');
    }
    
    // Check DOM elements
    const guestButtons = document.getElementById('guest-buttons');
    const userButtons = document.getElementById('user-buttons');
    console.log('🐛 guest-buttons visible:', guestButtons && !guestButtons.classList.contains('hidden'));
    console.log('🐛 user-buttons visible:', userButtons && !userButtons.classList.contains('hidden'));
    
    updateHeaderAuthState();
  };
  
  // Also call immediately
  console.log('🚀 Calling initial header update...');
  updateHeaderAuthState();
  
  // Listen for auth state changes
  if (typeof authService !== 'undefined') {
    authService.onAuthStateChange((user, profile) => {
      console.log('🔔 Header received auth state change notification');
      console.log('🔔 User:', user?.email);
      console.log('🔔 Profile active role:', profile?.activeRole);
      console.log('🔔 Profile available roles:', profile?.availableRoles);
      
      // Small delay to ensure all state is settled
      setTimeout(() => {
        console.log('🔄 Updating header from auth state change...');
        updateHeaderAuthState();
      }, 100);
    });
  }
}

/**
 * Update header based on authentication state
 */
function updateHeaderAuthState() {
  console.log('🔄 Updating header auth state...');
  
  let user = null;
  let profile = null;

  // Always prioritize authService if available
  if (typeof authService !== 'undefined') {
    user = authService.getCurrentUser();
    profile = authService.getCurrentUserProfile();
    console.log('🔄 Auth service user:', user?.email);
    console.log('🔄 Auth service profile roles:', profile?.availableRoles);
    console.log('🔄 Auth service profile activeRole:', profile?.activeRole);
  }

  // Fallback to localStorage in dev mode if authService doesn't have data
  if ((!user || !profile) && import.meta.env.DEV) {
    try {
      const demoUser = localStorage.getItem('demoUser');
      const demoProfile = localStorage.getItem('demoProfile');
      
      console.log('🔄 Fallback: Demo user from localStorage:', demoUser ? 'found' : 'not found');
      console.log('🔄 Fallback: Demo profile from localStorage:', demoProfile ? 'found' : 'not found');
      
      if (demoUser && demoProfile) {
        user = JSON.parse(demoUser);
        profile = JSON.parse(demoProfile);
        console.log('🔄 Fallback: Parsed demo user:', user?.email);
        console.log('🔄 Fallback: Parsed demo profile roles:', profile?.availableRoles);
        console.log('🔄 Fallback: Parsed demo profile activeRole:', profile?.activeRole);
      }
    } catch (error) {
      console.error('Error reading demo user from localStorage:', error);
    }
  }

  const guestButtons = document.getElementById('guest-buttons');
  const userButtons = document.getElementById('user-buttons');
  const userName = document.getElementById('user-name');
  const userAvatar = document.getElementById('user-avatar');
  const roleBadge = document.getElementById('role-badge');

  if (user && profile) {
    console.log('🔄 User authenticated, showing user buttons');
    // User is authenticated - show user buttons, hide guest buttons
    if (guestButtons) guestButtons.classList.add('hidden');
    if (userButtons) userButtons.classList.remove('hidden');
    
    // Update user info
    if (userName) userName.textContent = profile.displayName || user.email;
    if (userAvatar) userAvatar.textContent = getInitials(profile.displayName || user.email);
    if (roleBadge) {
      const roleText = profile.activeRole === 'professional' ? 'Profesional' : 'Cliente';
      roleBadge.textContent = `Modo: ${roleText}`;
      console.log('🔄 Updated role badge to:', roleText);
    }

    // Populate role switcher menu
    const roleSwitcherMenu = document.getElementById('role-switcher-menu');
    const availableRoles = profile.availableRoles || [];
    
    console.log('🔄 Populating role menu with roles:', availableRoles);
    if (roleSwitcherMenu) {
      populateRoleSwitcherMenu(roleSwitcherMenu, availableRoles, profile.activeRole);
    }
  } else {
    console.log('🔄 User NOT authenticated, showing guest buttons');
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

/**
 * Populate role switcher menu
 */
function populateRoleSwitcherMenu(menuContainer, availableRoles, currentRole) {
  menuContainer.innerHTML = '';

  if (availableRoles.length <= 1) {
    // Only one role or no roles - show add role options
    if (!availableRoles.includes('customer')) {
      const addCustomerBtn = document.createElement('button');
      addCustomerBtn.className = 'block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100';
      addCustomerBtn.innerHTML = '👤 Agregar Rol Cliente';
      addCustomerBtn.addEventListener('click', () => addRole('customer'));
      menuContainer.appendChild(addCustomerBtn);
    }

    if (!availableRoles.includes('professional')) {
      const addProfessionalBtn = document.createElement('button');
      addProfessionalBtn.className = 'block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-100';
      addProfessionalBtn.innerHTML = '👩‍💼 Agregar Rol Profesional';
      addProfessionalBtn.addEventListener('click', () => addRole('professional'));
      menuContainer.appendChild(addProfessionalBtn);
    }

    if (availableRoles.length === 0) {
      menuContainer.innerHTML = '<div class="px-4 py-2 text-sm text-gray-500">Sin roles disponibles</div>';
    }
  } else {
    // Multiple roles - show switch options
    availableRoles.forEach(role => {
      const roleButton = document.createElement('button');
      roleButton.className = `block w-full text-left px-4 py-2 text-sm transition-colors ${
        role === currentRole 
          ? 'bg-brand text-white font-medium' 
          : 'text-gray-700 hover:bg-gray-100'
      }`;
      
      const roleIcon = role === 'professional' ? '👩‍💼' : '👤';
      const roleText = role === 'professional' ? 'Profesional' : 'Cliente';
      
      roleButton.innerHTML = `${roleIcon} ${roleText} ${role === currentRole ? '✓' : ''}`;
      
      if (role !== currentRole) {
        roleButton.addEventListener('click', () => switchToRole(role));
      }
      
      menuContainer.appendChild(roleButton);
    });
  }
}

/**
 * Add new role to user account
 */
async function addRole(role) {
  const confirmed = confirm(`¿Quieres agregar el rol de ${role === 'professional' ? 'profesional' : 'cliente'} a tu cuenta?`);
  if (!confirmed) return;

  try {
    console.log('🔄 Adding role:', role);
    if (typeof authService !== 'undefined') {
      const result = await authService.addRole(role);
      console.log('🔄 AddRole result:', result);
      
      if (result.success) {
        alert(`¡Rol ${role === 'professional' ? 'profesional' : 'cliente'} agregado exitosamente!`);
        
        // Wait a bit for the state to update, then refresh header
        setTimeout(() => {
          console.log('🔄 Refreshing header after role add...');
          updateHeaderAuthState();
        }, 500);
      } else {
        alert('Error al agregar rol: ' + result.error);
      }
    }
  } catch (error) {
    console.error('Error adding role:', error);
    alert('Error inesperado al agregar rol');
  }
}

/**
 * Switch to different role
 */
async function switchToRole(newRole) {
  try {
    console.log('🔄 Switching to role:', newRole);
    if (typeof authService !== 'undefined') {
      const result = await authService.switchRole(newRole);
      console.log('🔄 SwitchRole result:', result);
      
      if (result.success) {
        console.log('🎭 Role switch successful, updating header immediately...');
        updateHeaderAuthState();
        
        // Small delay to ensure UI updates before redirect
        setTimeout(() => {
          if (newRole === 'professional') {
            console.log('🏠 Redirecting professional to dashboard...');
            window.location.href = '/pro/dashboard';
          } else {
            console.log('🏠 Professional switching to customer, staying on current page...');
            // Don't redirect customers automatically - let them stay where they are
            // Unless they're on a professional-only page
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/pro/')) {
              console.log('🏠 Customer on pro page, redirecting to marketplace...');
              window.location.href = '/marketplace';
            } else {
              console.log('🏠 Customer can stay on current page');
            }
          }
        }, 200);
      } else {
        alert('Error al cambiar rol: ' + result.error);
      }
    }
  } catch (error) {
    console.error('Error switching role:', error);
    alert('Error inesperado al cambiar rol');
  }
}

export default renderHeader;