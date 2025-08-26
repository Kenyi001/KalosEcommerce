/**
 * Account Dashboard Page for Kalos E-commerce
 * Shows different content based on user role (customer/professional)
 */

import { renderWithLayout } from '../components/Layout.js';
import { authService } from '../services/auth.js';
import { navigateTo } from '../utils/router.js';

/**
 * Render account dashboard page
 * @returns {string} HTML content
 */
export function renderAccountPage() {
  const content = `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
        <div class="bg-white rounded-lg shadow p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-3xl font-display font-bold text-navy">Mi Cuenta</h1>
              <p class="text-gray-600 mt-2" data-user-email></p>
              <span class="inline-block px-3 py-1 text-sm font-medium rounded-full mt-2" data-role-badge></span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center font-bold text-lg" data-user-avatar></div>
              <div>
                <p class="font-medium text-navy" data-user-name></p>
                <p class="text-sm text-gray-600">Miembro desde <span data-member-since></span></p>
              </div>
            </div>
          </div>

          <div id="accountContent">
            <!-- Content will be populated based on user role -->
          </div>

          <div class="mt-8 pt-6 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row gap-4">
              <button id="updateProfileBtn" class="px-4 py-2 bg-brand text-white rounded hover:bg-brand-hover transition-colors">
                Actualizar Perfil
              </button>
              <button id="changePasswordBtn" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                Cambiar Contraseña
              </button>
              <div class="flex-1"></div>
              <button id="logoutBtn" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return renderWithLayout(content, {
    title: 'Mi Cuenta - Kalos',
    showHeader: true,
    showFooter: true
  });
}

/**
 * Initialize account dashboard page functionality
 */
export function initializeAccountPage() {
  const logoutBtn = document.getElementById('logoutBtn');
  const updateProfileBtn = document.getElementById('updateProfileBtn');
  const changePasswordBtn = document.getElementById('changePasswordBtn');

  // Wait for auth and populate user info
  authService.waitForAuth().then(({ user, profile }) => {
    if (!user || !profile) {
      navigateTo('/auth/login');
      return;
    }

    populateUserInfo(user, profile);
    populateRoleContent(profile.role);
  });

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const confirmed = confirm('¿Estás seguro que deseas cerrar sesión?');
      if (!confirmed) return;

      logoutBtn.disabled = true;
      logoutBtn.textContent = 'Cerrando...';

      try {
        const result = await authService.logout();
        if (result.success) {
          navigateTo('/');
        } else {
          alert('Error al cerrar sesión: ' + result.error);
          logoutBtn.disabled = false;
          logoutBtn.textContent = 'Cerrar Sesión';
        }
      } catch (error) {
        console.error('Logout error:', error);
        alert('Error inesperado al cerrar sesión');
        logoutBtn.disabled = false;
        logoutBtn.textContent = 'Cerrar Sesión';
      }
    });
  }

  // Update profile functionality
  if (updateProfileBtn) {
    updateProfileBtn.addEventListener('click', () => {
      // TODO: Implement profile update modal
      alert('Funcionalidad en desarrollo');
    });
  }

  // Change password functionality
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
      // TODO: Redirect to password change page
      navigateTo('/auth/forgot-password');
    });
  }
}

/**
 * Populate user information in the page
 */
function populateUserInfo(user, profile) {
  // User name
  const userNameElements = document.querySelectorAll('[data-user-name]');
  userNameElements.forEach(el => {
    el.textContent = profile.displayName || user.email;
  });

  // User email
  const userEmailElements = document.querySelectorAll('[data-user-email]');
  userEmailElements.forEach(el => {
    el.textContent = user.email;
  });

  // User avatar
  const userAvatarElements = document.querySelectorAll('[data-user-avatar]');
  userAvatarElements.forEach(el => {
    const initials = getInitials(profile.displayName || user.email);
    el.textContent = initials;
  });

  // Role badge
  const roleBadgeElements = document.querySelectorAll('[data-role-badge]');
  roleBadgeElements.forEach(el => {
    const roleText = profile.role === 'professional' ? 'Profesional' : 'Cliente';
    const roleClass = profile.role === 'professional' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
    el.textContent = roleText;
    el.className += ' ' + roleClass;
  });

  // Member since
  const memberSinceElements = document.querySelectorAll('[data-member-since]');
  memberSinceElements.forEach(el => {
    const date = profile.createdAt?.toDate ? profile.createdAt.toDate() : new Date(profile.createdAt);
    el.textContent = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  });
}

/**
 * Populate content based on user role
 */
function populateRoleContent(role) {
  const contentDiv = document.getElementById('accountContent');
  if (!contentDiv) return;

  if (role === 'professional') {
    contentDiv.innerHTML = getProfessionalContent();
  } else {
    contentDiv.innerHTML = getCustomerContent();
  }
}

/**
 * Get professional dashboard content
 */
function getProfessionalContent() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-500 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">Mi Perfil Profesional</h3>
            <p class="text-gray-600">Gestionar información y servicios</p>
          </div>
        </div>
        <div class="mt-4">
          <button class="text-purple-600 hover:text-purple-800 font-medium">Ver perfil →</button>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-500 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">Mis Reservas</h3>
            <p class="text-gray-600">Próximamente en Fase 3</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-gray-500">En desarrollo...</span>
        </div>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">Estadísticas</h3>
            <p class="text-gray-600">Análisis de rendimiento</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-gray-500">Próximamente...</span>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-bold text-navy mb-4">Acciones Rápidas</h2>
      <div class="flex flex-wrap gap-4">
        <button class="px-4 py-2 bg-brand text-white rounded hover:bg-brand-hover transition-colors">
          Actualizar Servicios
        </button>
        <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
          Ver Mi Perfil Público
        </button>
        <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
          Configurar Disponibilidad
        </button>
      </div>
    </div>
  `;
}

/**
 * Get customer dashboard content
 */
function getCustomerContent() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-pink-500 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">Mis Reservas</h3>
            <p class="text-gray-600">Historial y próximas citas</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-gray-500">Próximamente en Fase 3</span>
        </div>
      </div>

      <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-500 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">Mis Favoritos</h3>
            <p class="text-gray-600">Profesionales guardados</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-gray-500">Próximamente...</span>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-bold text-navy mb-4">Acciones Rápidas</h2>
      <div class="flex flex-wrap gap-4">
        <button class="px-4 py-2 bg-brand text-white rounded hover:bg-brand-hover transition-colors" onclick="window.location.href='/buscar'">
          Buscar Profesionales
        </button>
        <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
          Ver Historial
        </button>
      </div>
    </div>
  `;
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