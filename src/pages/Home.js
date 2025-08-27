/**
 * Home Page - Landing page for Kalos E-commerce
 * Clean design with subtle role selection
 */

import { renderWithLayout, initializeLayout } from '../components/Layout.js';
import { navigateTo } from '../utils/router.js';
import { authService } from '../services/auth.js';

export function renderHomePage() {
  const content = `
    <div class="bg-kalos-white">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-brand to-deep-coral text-white py-20">
        <div class="max-w-6xl mx-auto px-4 text-center">
          <h1 class="text-5xl md:text-6xl font-display font-semibold mb-6">
            Belleza a Domicilio
          </h1>
          <p class="text-xl md:text-2xl mb-12 text-white/90">
            Conectamos profesionales de belleza con clientes en Bolivia
          </p>
          
          <!-- Role Selection - Subtle Integration -->
          <div class="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button 
              id="customerModeBtn"
              class="bg-kalos-white text-brand px-8 py-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg group">
              <div class="text-3xl mb-2">💅</div>
              <div class="text-lg font-bold">Necesito un Servicio</div>
              <div class="text-sm text-gray-600 mt-1">Buscar profesionales</div>
            </button>
            
            <button 
              id="professionalModeBtn"
              class="border-2 border-kalos-white text-kalos-white px-8 py-6 rounded-lg font-semibold hover:bg-white/10 transition-colors group">
              <div class="text-3xl mb-2">✨</div>
              <div class="text-lg font-bold">Quiero Ofrecer Servicios</div>
              <div class="text-sm text-white/80 mt-1">Únete como profesional</div>
            </button>
          </div>

          <div class="mt-8">
            <button 
              id="loginBtn"
              class="text-white/90 hover:text-white text-sm underline">
              ¿Ya tienes cuenta? Iniciar sesión
            </button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4">
          <h2 class="text-3xl font-display text-center mb-12 text-navy">
            ¿Cómo Funciona?
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🔍</span>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-navy">Busca</h3>
              <p class="text-gray-600">Encuentra profesionales cerca de ti</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">📅</span>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-navy">Reserva</h3>
              <p class="text-gray-600">Solicita tu cita preferida</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">✨</span>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-navy">Disfruta</h3>
              <p class="text-gray-600">Belleza en la comodidad de tu hogar</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="py-16 bg-white">
        <div class="max-w-6xl mx-auto px-4">
          <div class="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 class="text-3xl font-display font-bold text-navy mb-8">
                ¿Por qué elegir Kalos?
              </h2>
              <div class="space-y-6">
                <div class="flex items-start space-x-4">
                  <div class="w-8 h-8 bg-brand/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span class="text-brand text-lg">🛡️</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-navy mb-2">Profesionales Verificados</h4>
                    <p class="text-gray-600">Todos nuestros profesionales están verificados</p>
                  </div>
                </div>
                <div class="flex items-start space-x-4">
                  <div class="w-8 h-8 bg-brand/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span class="text-brand text-lg">⭐</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-navy mb-2">Calidad Garantizada</h4>
                    <p class="text-gray-600">Sistema de reseñas y calificaciones</p>
                  </div>
                </div>
                <div class="flex items-start space-x-4">
                  <div class="w-8 h-8 bg-brand/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span class="text-brand text-lg">🏠</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-navy mb-2">Comodidad Total</h4>
                    <p class="text-gray-600">Servicios profesionales en tu hogar</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <div class="bg-gray-50 rounded-2xl p-8">
                <div class="text-6xl mb-4">💄</div>
                <h3 class="text-2xl font-bold text-navy mb-4">¡Únete hoy!</h3>
                <div class="grid grid-cols-2 gap-4 text-center">
                  <div class="bg-white rounded-lg p-4">
                    <div class="text-2xl font-bold text-brand">500+</div>
                    <div class="text-sm text-gray-600">Profesionales</div>
                  </div>
                  <div class="bg-white rounded-lg p-4">
                    <div class="text-2xl font-bold text-brand">2K+</div>
                    <div class="text-sm text-gray-600">Clientes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 bg-navy text-white">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl font-display mb-6">¿Listo para empezar?</h2>
          <p class="text-xl mb-8 text-white/90">
            Únete a la plataforma de belleza más confiable de Bolivia
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              id="ctaCustomerBtn"
              class="bg-brand hover:bg-brand-hover text-kalos-white px-8 py-4 rounded-lg font-semibold transition-colors">
              Buscar Servicios
            </button>
            <button 
              id="ctaProfessionalBtn"
              class="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-colors">
              Ofrecer Servicios
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: 'Kalos - Servicios de Belleza a Domicilio en Bolivia',
    showHeader: true,
    showFooter: true
  });
}

export function initializeHomePage() {
  initializeLayout();

  // Check if user is already authenticated
  authService.waitForAuth().then(({ user, profile }) => {
    // For demo mode, check localStorage
    if (!user || !profile) {
      if (import.meta.env.DEV) {
        try {
          const demoUser = localStorage.getItem('demoUser');
          const demoProfile = localStorage.getItem('demoProfile');
          
          if (demoUser && demoProfile) {
            user = JSON.parse(demoUser);
            profile = JSON.parse(demoProfile);
          }
        } catch (error) {
          console.error('Error loading demo user:', error);
        }
      }
    }

    if (user && profile) {
      // If user is professional, redirect to their dashboard instead of staying on home
      if (profile.activeRole === 'professional') {
        console.log('🏠 Professional user detected, redirecting to dashboard...');
        navigateTo('/pro/dashboard');
        return;
      }
      
      // User is logged in, update buttons accordingly
      updateButtonsForAuthenticatedUser(profile);
      
      // Update header to show authenticated state
      if (window.updateHeaderAuthState) {
        console.log('🔄 Updating header from home page...');
        window.updateHeaderAuthState();
      }
    }
  });

  // Customer mode buttons
  const customerModeBtn = document.getElementById('customerModeBtn');
  const ctaCustomerBtn = document.getElementById('ctaCustomerBtn');
  
  [customerModeBtn, ctaCustomerBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => handleCustomerFlow());
    }
  });

  // Professional mode buttons  
  const professionalModeBtn = document.getElementById('professionalModeBtn');
  const ctaProfessionalBtn = document.getElementById('ctaProfessionalBtn');
  
  [professionalModeBtn, ctaProfessionalBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => handleProfessionalFlow());
    }
  });

  // Login button
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      navigateTo('/auth/login');
    });
  }
}

/**
 * Handle customer flow
 */
function handleCustomerFlow() {
  // Check if user is authenticated
  authService.waitForAuth().then(({ user, profile }) => {
    if (user && profile) {
      // User is logged in, go directly to marketplace
      navigateTo('/marketplace');
    } else {
      // User needs to register/login as customer
      navigateTo('/auth/register?mode=customer');
    }
  });
}

/**
 * Handle professional flow
 */
function handleProfessionalFlow() {
  // Check if user is authenticated
  authService.waitForAuth().then(({ user, profile }) => {
    if (user && profile) {
      // Check if user is already a professional
      if (profile.availableRoles && profile.availableRoles.includes('professional')) {
        navigateTo('/pro/dashboard');
      } else {
        // User needs to become a professional
        navigateTo('/become-professional');
      }
    } else {
      // User needs to register/login as professional
      navigateTo('/auth/register?mode=professional');
    }
  });
}

/**
 * Update buttons for authenticated users
 */
function updateButtonsForAuthenticatedUser(profile) {
  const customerModeBtn = document.getElementById('customerModeBtn');
  const professionalModeBtn = document.getElementById('professionalModeBtn');
  const loginBtn = document.getElementById('loginBtn');

  if (customerModeBtn) {
    customerModeBtn.querySelector('div:last-child').textContent = 'Ir a búsqueda';
  }

  if (professionalModeBtn) {
    if (profile.availableRoles && profile.availableRoles.includes('professional')) {
      professionalModeBtn.querySelector('div:last-child').textContent = 'Ir a dashboard';
    } else {
      professionalModeBtn.querySelector('div:last-child').textContent = 'Convertirse en pro';
    }
  }

  if (loginBtn) {
    loginBtn.textContent = 'Mi Cuenta';
    loginBtn.onclick = () => navigateTo('/cuenta');
  }
}

export default renderHomePage;