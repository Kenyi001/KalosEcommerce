/**
 * Route Configuration for Kalos E-commerce
 * Defines all routes and their handlers
 */

import { renderHomePage } from '../pages/Home.js';
import { renderNotFoundPage } from '../pages/NotFound.js';
import { renderLoadingPage } from '../pages/Loading.js';

// Import route handlers (will be implemented in later phases)
// import { renderAuthPage } from '../pages/Auth.js';
// import { renderSearchPage } from '../pages/Search.js';
// import { renderProfessionalProfile } from '../pages/ProfessionalProfile.js';

/**
 * Route definitions following the Project Chapter specifications
 */
export const routes = [
  // Public routes (no authentication required)
  {
    path: '/',
    handler: () => {
      document.getElementById('app').innerHTML = renderHomePage();
    },
    title: 'Kalos E-commerce - Belleza a Domicilio',
    meta: { description: 'Marketplace de servicios de belleza a domicilio en Bolivia' }
  },

  // Search and browse
  {
    path: '/buscar',
    handler: () => {
      // TODO: Implement in Phase 3
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-navy mb-4">Búsqueda de Profesionales</h1>
            <p class="text-gray-600 mb-4">Próximamente en Fase 3</p>
            <button data-router-link href="/" class="bg-brand text-white px-4 py-2 rounded">
              Volver al inicio
            </button>
          </div>
        </div>
      `;
    },
    title: 'Buscar Profesionales - Kalos'
  },

  // Professional public profile
  {
    path: '/pro/:handle',
    handler: (path) => {
      const handle = path.split('/')[2];
      // TODO: Implement in Phase 2
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-navy mb-4">Perfil: @${handle}</h1>
            <p class="text-gray-600 mb-4">Próximamente en Fase 2</p>
            <button data-router-link href="/" class="bg-brand text-white px-4 py-2 rounded">
              Volver al inicio
            </button>
          </div>
        </div>
      `;
    },
    title: 'Perfil Profesional - Kalos'
  },

  // Authentication routes
  {
    path: '/auth/login',
    handler: () => {
      // TODO: Implement in Phase 1
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-navy mb-4">Iniciar Sesión</h1>
            <p class="text-gray-600 mb-4">Próximamente en Fase 1</p>
            <button data-router-link href="/" class="bg-brand text-white px-4 py-2 rounded">
              Volver al inicio
            </button>
          </div>
        </div>
      `;
    },
    title: 'Iniciar Sesión - Kalos'
  },

  {
    path: '/auth/signup',
    handler: () => {
      // TODO: Implement in Phase 1
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-navy mb-4">Crear Cuenta</h1>
            <p class="text-gray-600 mb-4">Próximamente en Fase 1</p>
            <button data-router-link href="/" class="bg-brand text-white px-4 py-2 rounded">
              Volver al inicio
            </button>
          </div>
        </div>
      `;
    },
    title: 'Crear Cuenta - Kalos'
  },

  // Protected customer routes (require authentication)
  {
    path: '/reservar',
    handler: () => {
      // TODO: Implement in Phase 3
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-navy mb-4">Solicitar Reserva</h1>
            <p class="text-gray-600 mb-4">Próximamente en Fase 3</p>
            <button data-router-link href="/" class="bg-brand text-white px-4 py-2 rounded">
              Volver al inicio
            </button>
          </div>
        </div>
      `;
    },
    requiresAuth: true,
    allowedRoles: ['customer'],
    title: 'Solicitar Reserva - Kalos'
  },

  {
    path: '/cuenta',
    handler: () => {
      // TODO: Implement in Phase 1
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-navy mb-4">Mi Cuenta</h1>
            <p class="text-gray-600 mb-4">Próximamente en Fase 1</p>
            <button data-router-link href="/" class="bg-brand text-white px-4 py-2 rounded">
              Volver al inicio
            </button>
          </div>
        </div>
      `;
    },
    requiresAuth: true,
    title: 'Mi Cuenta - Kalos'
  },

  // Protected professional routes
  {
    path: '/pro/dashboard',
    handler: () => {
      // TODO: Implement in Phase 2
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-navy mb-4">Dashboard Profesional</h1>
            <p class="text-gray-600 mb-4">Próximamente en Fase 2</p>
            <button data-router-link href="/" class="bg-brand text-white px-4 py-2 rounded">
              Volver al inicio
            </button>
          </div>
        </div>
      `;
    },
    requiresAuth: true,
    allowedRoles: ['professional'],
    title: 'Dashboard - Kalos Pro'
  },

  // Legal pages
  {
    path: '/legal/terminos',
    handler: () => {
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen bg-gray-50 py-12">
          <div class="max-w-4xl mx-auto px-4">
            <h1 class="text-3xl font-display font-bold text-navy mb-8">Términos y Condiciones</h1>
            <div class="bg-white rounded-lg p-8">
              <p class="text-gray-600 mb-4">
                Página en desarrollo. Próximamente tendremos nuestros términos y condiciones completos.
              </p>
              <button data-router-link href="/" class="bg-brand text-white px-4 py-2 rounded">
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      `;
    },
    title: 'Términos y Condiciones - Kalos'
  },

  // Loading page
  {
    path: '/loading',
    handler: () => {
      document.getElementById('app').innerHTML = renderLoadingPage();
    },
    title: 'Cargando - Kalos'
  },

  // 404 page
  {
    path: '/404',
    handler: () => {
      document.getElementById('app').innerHTML = renderNotFoundPage();
    },
    title: '404 - Página no encontrada'
  }
];

export default routes;