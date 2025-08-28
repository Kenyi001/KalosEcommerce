/**
 * Landing Page - True marketing/presentation page for Kalos
 * Clean, focused landing page to present the platform
 */

import { renderWithLayout, initializeLayout } from '../components/Layout.js';
import { navigateTo } from '../utils/router.js';
import { authService } from '../services/auth.js';

export function renderLandingPage() {
  const content = `
    <div class="bg-kalos-white">
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-br from-brand to-deep-coral text-white py-24 lg:py-32">
        <div class="max-w-6xl mx-auto px-4 text-center">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-5xl lg:text-7xl font-display font-bold mb-8 leading-tight">
              Belleza a <span class="text-kalos-white">Domicilio</span>
            </h1>
            <p class="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">
              La plataforma líder que conecta profesionales de belleza con clientes en Bolivia. 
              Servicios profesionales en la comodidad de tu hogar.
            </p>
            
            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                id="enterPlatformBtn"
                class="bg-kalos-white text-brand px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                🚀 Ingresar a la Plataforma
              </button>
              
              <button 
                id="learnMoreBtn"
                class="border-2 border-kalos-white text-kalos-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white/10 transition-all duration-300">
                📖 Conocer Más
              </button>
            </div>
          </div>
        </div>
        
        <!-- Decorative elements -->
        <div class="absolute top-10 left-10 text-6xl opacity-20">💄</div>
        <div class="absolute bottom-10 right-10 text-6xl opacity-20">✨</div>
        <div class="absolute top-1/2 left-20 text-4xl opacity-10">💅</div>
      </section>

      <!-- Value Proposition -->
      <section class="py-20 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-display font-bold text-navy mb-6">
              ¿Por qué elegir Kalos?
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos la primera plataforma especializada en servicios de belleza a domicilio en Bolivia
            </p>
          </div>

          <div class="grid lg:grid-cols-3 gap-8">
            <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div class="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mb-6">
                <span class="text-3xl">🛡️</span>
              </div>
              <h3 class="text-2xl font-bold text-navy mb-4">Profesionales Verificados</h3>
              <p class="text-gray-600 leading-relaxed">
                Todos nuestros profesionales pasan por un riguroso proceso de verificación de credenciales, 
                experiencia y antecedentes.
              </p>
            </div>

            <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div class="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mb-6">
                <span class="text-3xl">⭐</span>
              </div>
              <h3 class="text-2xl font-bold text-navy mb-4">Calidad Garantizada</h3>
              <p class="text-gray-600 leading-relaxed">
                Sistema completo de reseñas, calificaciones y seguimiento de calidad. 
                Tu satisfacción es nuestra prioridad.
              </p>
            </div>

            <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div class="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mb-6">
                <span class="text-3xl">🏠</span>
              </div>
              <h3 class="text-2xl font-bold text-navy mb-4">Comodidad Total</h3>
              <p class="text-gray-600 leading-relaxed">
                Servicios profesionales de belleza en tu hogar, oficina o donde necesites. 
                Ahorra tiempo y disfruta la comodidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- How it Works -->
      <section class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-display font-bold text-navy mb-6">
              ¿Cómo Funciona?
            </h2>
            <p class="text-xl text-gray-600">
              Reservar tu servicio de belleza nunca fue tan fácil
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-12">
            <div class="text-center">
              <div class="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-4xl">🔍</span>
              </div>
              <h3 class="text-2xl font-bold text-navy mb-4">1. Busca</h3>
              <p class="text-gray-600 text-lg leading-relaxed">
                Encuentra profesionales especializados cerca de tu ubicación. 
                Filtra por servicio, precio y disponibilidad.
              </p>
            </div>

            <div class="text-center">
              <div class="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-4xl">📅</span>
              </div>
              <h3 class="text-2xl font-bold text-navy mb-4">2. Reserva</h3>
              <p class="text-gray-600 text-lg leading-relaxed">
                Selecciona tu horario preferido y confirma tu cita. 
                Pago seguro y confirmación instantánea.
              </p>
            </div>

            <div class="text-center">
              <div class="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-4xl">✨</span>
              </div>
              <h3 class="text-2xl font-bold text-navy mb-4">3. Disfruta</h3>
              <p class="text-gray-600 text-lg leading-relaxed">
                Relájate mientras un profesional certificado te brinda 
                el mejor servicio de belleza en tu hogar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-20 bg-navy text-white">
        <div class="max-w-6xl mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-display font-bold mb-6">
              Creciendo Juntos
            </h2>
            <p class="text-xl text-white/90">
              Miles de bolivianos ya confían en Kalos
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div class="text-5xl font-bold text-brand mb-2">500+</div>
              <div class="text-xl text-white/90">Profesionales Verificados</div>
            </div>
            <div>
              <div class="text-5xl font-bold text-brand mb-2">2,000+</div>
              <div class="text-xl text-white/90">Clientes Satisfechos</div>
            </div>
            <div>
              <div class="text-5xl font-bold text-brand mb-2">9</div>
              <div class="text-xl text-white/90">Departamentos de Bolivia</div>
            </div>
          </div>
        </div>
      </section>

      <!-- For Professionals Section -->
      <section class="py-20 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4">
          <div class="bg-white rounded-3xl p-12 shadow-xl">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 class="text-4xl font-display font-bold text-navy mb-6">
                  ¿Eres Profesional de Belleza?
                </h2>
                <p class="text-xl text-gray-600 mb-8 leading-relaxed">
                  Únete a la red de profesionales más confiable de Bolivia. 
                  Amplía tu clientela, gestiona tu agenda y aumenta tus ingresos.
                </p>
                
                <div class="space-y-4 mb-8">
                  <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                      <span class="text-white text-sm">✓</span>
                    </div>
                    <span class="text-gray-700">Sin costos de afiliación</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                      <span class="text-white text-sm">✓</span>
                    </div>
                    <span class="text-gray-700">Pagos seguros y puntuales</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                      <span class="text-white text-sm">✓</span>
                    </div>
                    <span class="text-gray-700">Herramientas de gestión incluidas</span>
                  </div>
                </div>

                <button 
                  id="joinProBtn"
                  class="bg-brand hover:bg-brand-hover text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors">
                  👩‍💼 Únete como Profesional
                </button>
              </div>

              <div class="text-center">
                <div class="bg-gradient-to-br from-brand/20 to-deep-coral/20 rounded-2xl p-8">
                  <div class="text-8xl mb-4">💼</div>
                  <h3 class="text-2xl font-bold text-navy mb-4">
                    ¡Comienza Hoy!
                  </h3>
                  <p class="text-gray-600">
                    Proceso de registro simple y aprobación rápida
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="py-20 bg-gradient-to-r from-brand to-deep-coral text-white">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-4xl font-display font-bold mb-8">
            ¿Listo para la Experiencia Kalos?
          </h2>
          <p class="text-xl mb-12 text-white/90">
            Únete a miles de bolivianos que ya disfrutan de servicios de belleza profesionales en casa
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              id="finalCtaBtn"
              class="bg-kalos-white text-brand px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
              🚀 Comenzar Ahora
            </button>
            
            <button 
              id="contactBtn"
              class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white/10 transition-colors">
              💬 Contactar
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: 'Kalos - Belleza a Domicilio en Bolivia | Plataforma Líder',
    description: 'La plataforma líder de servicios de belleza a domicilio en Bolivia. Conecta con profesionales verificados y disfruta servicios de calidad en tu hogar.',
    showHeader: true,
    showFooter: true
  });
}

export function initializeLandingPage() {
  initializeLayout();

  // Check if user is logged in and redirect accordingly
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

    // No auto-redirect when authenticated; let user choose via CTA
    if (user && profile) {
      console.log('🏠 Authenticated user on landing page:', { 
        role: profile.activeRole,
        name: profile.displayName || user.email 
      });
      // User can navigate manually via CTAs
    }
  });

  // Enter Platform button - smart redirect based on auth
  const enterPlatformBtn = document.getElementById('enterPlatformBtn');
  const finalCtaBtn = document.getElementById('finalCtaBtn');
  
  [enterPlatformBtn, finalCtaBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        // Check current auth state for smart redirect
        authService.waitForAuth().then(({ user, profile }) => {
          if (user && profile) {
            if (profile.activeRole === 'professional') {
              navigateTo('/pro/dashboard');
            } else {
              navigateTo('/marketplace');
            }
          } else {
            navigateTo('/marketplace'); // Default for non-authenticated
          }
        });
      });
    }
  });

  // Join as Professional button
  const joinProBtn = document.getElementById('joinProBtn');
  if (joinProBtn) {
    joinProBtn.addEventListener('click', () => {
      navigateTo('/auth/register?role=professional');
    });
  }

  // Learn More button - smooth scroll to how it works
  const learnMoreBtn = document.getElementById('learnMoreBtn');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      const howItWorksSection = document.querySelector('section:nth-of-type(3)'); // How it works section
      if (howItWorksSection) {
        howItWorksSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Contact button
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      navigateTo('/contacto');
    });
  }
}

export default renderLandingPage;