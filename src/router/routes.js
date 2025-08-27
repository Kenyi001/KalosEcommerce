/**
 * Route Configuration for Kalos E-commerce
 * Defines all routes and their handlers
 */

import { renderHomePage, initializeHomePage } from '../pages/Home.js';
import { renderNotFoundPage, initializeNotFoundPage } from '../pages/NotFound.js';
import { renderLoadingPage } from '../pages/Loading.js';
import { renderLoginPage, initializeLoginPage } from '../pages/Auth/Login.js';
import { renderRegisterPage, initializeRegisterPage } from '../pages/Auth/Register.js';
import { renderForgotPasswordPage, initializeForgotPasswordPage } from '../pages/Auth/ForgotPassword.js';
import { renderAccountPage, initializeAccountPage } from '../pages/Account.js';
import { requireAuth, requireGuest, requireCustomer, requireProfessional, requireCustomerOrProfessional } from '../utils/auth-guards.js';

// Professional management imports
import { renderProfessionalCreatePage, initializeProfessionalCreatePage } from '../pages/Professionals/Create.js';
import { renderProfessionalDetailPage, initializeProfessionalDetailPage } from '../pages/Professionals/Detail.js';
import { renderProfessionalDashboardPage, initializeProfessionalDashboardPage } from '../pages/Professionals/Dashboard.js';
import { renderProfessionalServicesPage, initializeProfessionalServicesPage } from '../pages/Professionals/Services.js';
import { renderServiceFormPage, initializeServiceFormPage } from '../pages/Professionals/ServiceForm.js';

// Landing and Marketplace imports
import { renderLandingPage, initializeLandingPage } from '../pages/Landing.js';
import { renderMarketplacePage, initializeMarketplacePage } from '../pages/Marketplace.js';

// Booking system imports
import { renderBookingFlowPage, initializeBookingFlowPage } from '../pages/Booking/BookingFlow.js';

// Import route handlers (will be implemented in later phases)
// import { renderSearchPage } from '../pages/Search.js';
// Note: renderBookingDetailPage and renderBookingConfirmationPage will be implemented next

/**
 * Route definitions following the Project Chapter specifications
 */
export const routes = [
  // Public routes (no authentication required)
  {
    path: '/',
    handler: () => {
      document.getElementById('app').innerHTML = renderLandingPage();
      initializeLandingPage();
    },
    title: 'Kalos - Belleza a Domicilio en Bolivia | Plataforma Líder',
    meta: { description: 'La plataforma líder de servicios de belleza a domicilio en Bolivia. Conecta con profesionales verificados.' }
  },

  {
    path: '/marketplace',
    handler: () => {
      document.getElementById('app').innerHTML = renderMarketplacePage();
      initializeMarketplacePage();
    },
    title: 'Marketplace - Kalos',
    meta: { description: 'Encuentra profesionales de belleza verificados cerca de ti' }
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

  // Authentication routes (guest only)
  {
    path: '/auth/login',
    handler: () => {
      document.getElementById('app').innerHTML = renderLoginPage();
      initializeLoginPage();
    },
    guards: import.meta.env.DEV ? [] : [requireGuest], // No guards in dev mode
    title: 'Iniciar Sesión - Kalos'
  },

  {
    path: '/auth/register',
    handler: () => {
      document.getElementById('app').innerHTML = renderRegisterPage();
      initializeRegisterPage();
    },
    guards: [requireGuest],
    title: 'Crear Cuenta - Kalos'
  },

  {
    path: '/auth/forgot-password',
    handler: () => {
      document.getElementById('app').innerHTML = renderForgotPasswordPage();
      initializeForgotPasswordPage();
    },
    guards: [requireGuest],
    title: 'Recuperar Contraseña - Kalos'
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
    guards: [requireCustomer],
    title: 'Solicitar Reserva - Kalos'
  },

  {
    path: '/cuenta',
    handler: () => {
      document.getElementById('app').innerHTML = renderAccountPage();
      initializeAccountPage();
    },
    guards: import.meta.env.DEV ? [] : [requireCustomerOrProfessional], // No guards in dev mode
    title: 'Mi Cuenta - Kalos'
  },

  // Protected professional routes
  {
    path: '/pro/dashboard',
    handler: () => {
      document.getElementById('app').innerHTML = renderProfessionalDashboardPage();
      initializeProfessionalDashboardPage();
    },
    guards: [requireProfessional],
    title: 'Dashboard Profesional - Kalos'
  },

  {
    path: '/pro/profile/create',
    handler: () => {
      document.getElementById('app').innerHTML = renderProfessionalCreatePage();
      initializeProfessionalCreatePage();
    },
    guards: import.meta.env.DEV ? [] : [requireProfessional],
    title: 'Crear Perfil Profesional - Kalos'
  },

  {
    path: '/pro/profile/edit',
    handler: () => {
      document.getElementById('app').innerHTML = renderProfessionalCreatePage();
      initializeProfessionalCreatePage();
    },
    guards: import.meta.env.DEV ? [] : [requireProfessional],
    title: 'Editar Perfil Profesional - Kalos'
  },

  {
    path: '/pro/services',
    handler: () => {
      document.getElementById('app').innerHTML = renderProfessionalServicesPage();
      initializeProfessionalServicesPage();
    },
    guards: import.meta.env.DEV ? [] : [requireProfessional],
    title: 'Mis Servicios - Kalos'
  },

  {
    path: '/pro/services/new',
    handler: () => {
      document.getElementById('app').innerHTML = renderServiceFormPage();
      initializeServiceFormPage();
    },
    guards: import.meta.env.DEV ? [] : [requireProfessional],
    title: 'Nuevo Servicio - Kalos'
  },

  {
    path: '/pro/services/edit/:id',
    handler: (path) => {
      const serviceId = path.split('/')[4];
      document.getElementById('app').innerHTML = renderServiceFormPage(serviceId);
      initializeServiceFormPage(serviceId);
    },
    guards: import.meta.env.DEV ? [] : [requireProfessional],
    title: 'Editar Servicio - Kalos'
  },

  {
    path: '/professionals/:id',
    handler: (path) => {
      const professionalId = path.split('/')[2];
      document.getElementById('app').innerHTML = renderProfessionalDetailPage(professionalId);
      initializeProfessionalDetailPage(professionalId);
    },
    title: 'Perfil Profesional - Kalos'
  },

  // Booking system routes
  {
    path: '/booking/new',
    handler: () => {
      document.getElementById('app').innerHTML = renderBookingFlowPage();
      initializeBookingFlowPage();
    },
    guards: [requireCustomer],
    title: 'Nueva Reserva - Kalos'
  },

  {
    path: '/booking/:id',
    handler: (path) => {
      const bookingId = path.split('/')[2];
      document.getElementById('app').innerHTML = renderBookingDetailPage(bookingId);
      initializeBookingDetailPage(bookingId);
    },
    guards: [requireCustomerOrProfessional],
    title: 'Detalles de Reserva - Kalos'
  },

  {
    path: '/booking/confirmation/:id',
    handler: (path) => {
      const bookingId = path.split('/')[2];
      document.getElementById('app').innerHTML = renderBookingConfirmationPage(bookingId);
      initializeBookingConfirmationPage(bookingId);
    },
    guards: [requireCustomerOrProfessional],
    title: 'Reserva Confirmada - Kalos'
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

  {
    path: '/legal/privacidad',
    handler: () => {
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen bg-gray-50 py-12">
          <div class="max-w-4xl mx-auto px-4">
            <h1 class="text-3xl font-display font-bold text-navy mb-8">Política de Privacidad</h1>
            <div class="bg-white rounded-lg p-8">
              <p class="text-gray-600 mb-4">
                Página en desarrollo. Próximamente tendremos nuestra política de privacidad completa.
              </p>
              <button data-router-link href="/" class="bg-brand text-white px-4 py-2 rounded">
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      `;
    },
    title: 'Política de Privacidad - Kalos'
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
      initializeNotFoundPage();
    },
    title: '404 - Página no encontrada'
  }
];

export default routes;