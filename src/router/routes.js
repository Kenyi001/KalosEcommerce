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

// Professional Profile imports
import { renderProfessionalProfilePage, initializeProfessionalProfilePage } from '../pages/ProfessionalProfile.js';

// Booking system imports
import { renderBookingFlowPage, initializeBookingFlowPage } from '../pages/Booking/BookingFlow.js';
import { renderBookingConfirmationPage, initializeBookingConfirmationPage } from '../pages/Booking/BookingConfirmation.js';
import { renderBookingDetailPage, initializeBookingDetailPage } from '../pages/Booking/BookingDetail.js';

// Demo setup imports  
import { renderDemoSetupPage, initializeDemoSetupPage } from '../pages/DemoSetup.js';

// Import route handlers (will be implemented in later phases)
// import { renderSearchPage } from '../pages/Search.js';

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
      document.getElementById('app').innerHTML = renderProfessionalProfilePage(handle);
      initializeProfessionalProfilePage(handle);
    },
    title: 'Perfil Profesional - Kalos',
    meta: { description: 'Perfil público de profesional de belleza con servicios, portfolio y reseñas' }
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

  // Demo and testing routes
  {
    path: '/demo/setup',
    handler: () => {
      document.getElementById('app').innerHTML = renderDemoSetupPage();
      initializeDemoSetupPage();
    },
    title: 'Demo Setup - Kalos'
  },

  // Legal pages
  // Contact page
  {
    path: '/contacto',
    handler: () => {
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-beige to-white">
          <div class="max-w-4xl mx-auto px-4 py-16">
            <div class="text-center mb-12">
              <h1 class="text-4xl font-fraunces font-bold text-navy mb-4">Contáctanos</h1>
              <p class="text-lg text-gray-600">Estamos aquí para ayudarte con cualquier consulta</p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <!-- Contact Info -->
              <div class="space-y-8">
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 class="text-2xl font-bold text-navy mb-6">Información de Contacto</h3>
                  
                  <div class="space-y-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-semibold text-navy">Teléfono</h4>
                        <p class="text-gray-600">+591 77 123 456</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-semibold text-navy">Email</h4>
                        <p class="text-gray-600">hola@kalos.bo</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-semibold text-navy">Ubicación</h4>
                        <p class="text-gray-600">Santa Cruz, Bolivia</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="bg-gradient-to-br from-brand to-deep-coral rounded-2xl p-8 text-white">
                  <h3 class="text-xl font-bold mb-4">¿Eres Profesional?</h3>
                  <p class="mb-6 opacity-90">Únete a nuestra plataforma y amplía tu clientela</p>
                  <button onclick="window.location.href='/auth/register?role=professional'" class="bg-white text-brand px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Registrarse como Profesional
                  </button>
                </div>
              </div>
              
              <!-- Quick Actions -->
              <div class="space-y-6">
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 class="text-2xl font-bold text-navy mb-6">Acciones Rápidas</h3>
                  
                  <div class="space-y-4">
                    <button onclick="window.location.href='/marketplace'" class="w-full bg-brand text-white px-6 py-4 rounded-lg font-semibold hover:bg-brand-hover transition-colors flex items-center justify-center gap-3">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                      Explorar Profesionales
                    </button>
                    
                    <button onclick="window.location.href='/auth/register'" class="w-full bg-navy text-white px-6 py-4 rounded-lg font-semibold hover:bg-navy-hover transition-colors flex items-center justify-center gap-3">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      Crear Cuenta
                    </button>
                    
                    <button onclick="window.location.href='/'" class="w-full border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                      </svg>
                      Volver al Inicio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },
    title: 'Contacto - Kalos',
    meta: { description: 'Ponte en contacto con Kalos para cualquier consulta sobre nuestros servicios de belleza' }
  },

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