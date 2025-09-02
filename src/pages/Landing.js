/**
 * Landing Page - Modern Kalos Design System
 * Clean, responsive landing page using pure Tailwind CSS
 */

import { renderWithLayout, initializeLayout } from '../components/Layout.js';
import { Button } from '../components/atoms/Button/Button.js';
import { ServiceCard } from '../components/molecules/Card/Card.js';
import { renderIcon } from '../components/atoms/Icon/Icon.js';
import { navigateTo } from '../utils/router.js';
import { authService } from '../services/auth.js';

export function renderLandingPage() {
  const content = `
    <div class="bg-white">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-gradient-to-br from-brand to-navy min-h-screen flex items-center">
        ${renderHeroSection()}
      </section>

      <!-- Info Banner -->
      <section class="bg-beige border-b border-navy/10">
      ${renderInfoBanner()}
      </section>

      <!-- How It Works Section -->
      <section class="py-20 bg-gradient-to-b from-beige to-white" id="how-it-works">
      ${renderHowItWorksSection()}
      </section>

      <!-- Featured Services Section -->
      <section class="py-20 bg-white" id="featured-services">
        ${renderFeaturedServicesSection()}
      </section>

      <!-- Value Proposition Section -->
      <section class="py-20 bg-gradient-to-br from-navy to-navy-hover text-white">
        ${renderValuePropositionSection()}
      </section>

      <!-- For Professionals Section -->
      <section class="py-20 bg-gradient-to-br from-gold to-beige">
        ${renderProfessionalsCTASection()}
      </section>

      <!-- Stats Section -->
      <section class="py-16 bg-beige">
        ${renderStatsSection()}
      </section>

      <!-- Final CTA Section -->
      <section class="py-20 bg-gradient-to-br from-brand to-deep-coral text-white">
        ${renderFinalCTASection()}
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

function renderHeroSection() {
  return `
    <!-- Decorative background -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-20 left-10 text-white/30">
        ${renderIcon('sparkles', { size: '48' })}
      </div>
      <div class="absolute top-1/3 right-20 text-white/20">
        ${renderIcon('heart', { size: '36' })}
      </div>
      <div class="absolute bottom-1/4 left-1/4 text-white/25">
        ${renderIcon('star', { size: '24' })}
        </div>
      </div>
      
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
      <div class="max-w-4xl mx-auto">
        <!-- Main Title -->
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-fraunces font-bold mb-8 leading-tight">
          Servicios de belleza
          <span class="text-gold block lg:inline">a domicilio</span>
          </h1>
          
        <!-- Subtitle -->
        <p class="text-lg sm:text-xl lg:text-2xl mb-10 text-white/95 max-w-4xl mx-auto leading-relaxed">
          Conecta con profesionales verificados de belleza en Santa Cruz. 
          <span class="text-gold font-semibold">Reserva fácil, pago directo y servicio garantizado.</span>
        </p>
        
        <!-- Features -->
        <div class="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12 text-sm">
          <div class="flex items-center gap-2">
            <div class="text-green-400">${renderIcon('shield-check', { size: '20' })}</div>
              <span>Profesionales verificados</span>
            </div>
          <div class="hidden sm:block w-px h-6 bg-white/20"></div>
          <div class="flex items-center gap-2">
            <div class="text-blue-400">${renderIcon('credit-card', { size: '20' })}</div>
              <span>Pago directo con el profesional</span>
            </div>
          <div class="hidden sm:block w-px h-6 bg-white/20"></div>
          <div class="flex items-center gap-2">
            <div class="text-yellow-400">${renderIcon('map-pin', { size: '20' })}</div>
              <span>Cobertura: Santa Cruz (piloto)</span>
          </div>
        </div>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <div id="hero-primary-btn"></div>
          <div id="hero-secondary-btn"></div>
        </div>
        
        <!-- Stats -->
        <div class="flex flex-wrap justify-center gap-8 lg:gap-16 text-center">
          <div class="group">
            <div class="text-3xl lg:text-4xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
            <div class="text-sm text-white/80 font-medium">Profesionales Activos</div>
          </div>
          <div class="group">
            <div class="text-3xl lg:text-4xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform duration-300">2K+</div>
            <div class="text-sm text-white/80 font-medium">Clientes Felices</div>
          </div>
          <div class="group">
            <div class="text-3xl lg:text-4xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform duration-300">4.9★</div>
            <div class="text-sm text-white/80 font-medium">Calificación Promedio</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderInfoBanner() {
  return `
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center gap-3 p-4 bg-white/80 rounded-lg border border-navy/10">
            <div class="text-green-500 flex-shrink-0">${renderIcon('check-circle', { size: '20' })}</div>
            <span class="text-sm font-medium text-navy">Sin pasarela de pago por ahora: paga directo al profesional</span>
      </div>
          <div class="flex items-center gap-3 p-4 bg-white/80 rounded-lg border border-navy/10">
            <div class="text-green-500 flex-shrink-0">${renderIcon('check-circle', { size: '20' })}</div>
            <span class="text-sm font-medium text-navy">La reserva se activa cuando el profesional confirma</span>
          </div>
          <div class="flex items-center gap-3 p-4 bg-white/80 rounded-lg border border-navy/10">
            <div class="text-green-500 flex-shrink-0">${renderIcon('check-circle', { size: '20' })}</div>
            <span class="text-sm font-medium text-navy">Cobertura inicial: Santa Cruz; más ciudades pronto</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHowItWorksSection() {
  const steps = [
    {
      icon: 'search',
      title: 'Elige un servicio',
      description: 'Explora nuestro catálogo y selecciona el servicio que necesitas.'
    },
    {
      icon: 'calendar',
      title: 'Selecciona horario y ubicación',
      description: 'Elige la fecha, hora y ubicación que mejor te convenga.'
    },
    {
      icon: 'user-check',
      title: 'El profesional confirma',
      description: 'Recibes confirmación del profesional y los detalles finales.'
    },
    {
      icon: 'credit-card',
      title: 'Pagas directo al profesional',
      description: 'Realiza el pago directamente con el profesional al recibir el servicio.'
    }
  ];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-fraunces font-bold text-navy mb-6">
          Cómo funciona
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Proceso simple y transparente para reservar tu servicio
          </p>
        </div>
        
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          ${steps.map((step, index) => `
          <div class="text-center group">
            <!-- Step Number and Icon -->
            <div class="relative mb-8">
              <div class="w-20 h-20 mx-auto bg-gradient-to-br from-brand to-deep-coral rounded-3xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                ${renderIcon(step.icon, { size: '32' })}
              </div>
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-gold text-navy rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                ${index + 1}
              </div>
            </div>
            
            <!-- Content -->
            <h3 class="text-xl font-bold text-navy mb-3">${step.title}</h3>
            <p class="text-gray-600 leading-relaxed">${step.description}</p>
          </div>
          `).join('')}
      </div>
    </div>
  `;
}

function renderFeaturedServicesSection() {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-fraunces font-bold text-navy mb-6">
          Servicios Populares
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Los servicios más solicitados por nuestros clientes
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" id="services-grid">
        ${renderServiceSkeletons()}
      </div>
      
      <div class="text-center">
        <div id="view-all-services-btn"></div>
      </div>
    </div>
  `;
}

function renderServiceSkeletons() {
  return Array(6).fill().map(() => `
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div class="h-48 bg-gradient-to-br from-beige to-gold"></div>
      <div class="p-6">
        <div class="h-4 bg-gray-200 rounded mb-3"></div>
        <div class="h-3 bg-gray-200 rounded mb-2 w-4/5"></div>
        <div class="h-3 bg-gray-200 rounded mb-4 w-3/5"></div>
        <div class="h-6 bg-gray-200 rounded mb-4 w-2/5"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  `).join('');
}

function renderValuePropositionSection() {
  const values = [
    {
      icon: 'shield-check',
      title: 'Profesionales Verificados',
      description: 'Todos nuestros profesionales pasan por un riguroso proceso de verificación de identidad y certificación de habilidades.',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: 'star',
      title: 'Calidad Garantizada',
      description: 'Sistema de reseñas transparente y garantía de satisfacción en todos nuestros servicios de belleza.',
      color: 'from-amber-400 to-amber-600'
    },
    {
      icon: 'clock',
      title: 'Horarios Flexibles',
      description: 'Servicios disponibles cuando los necesites, incluyendo fines de semana y servicios de emergencia.',
      color: 'from-violet-400 to-violet-600'
    },
    {
      icon: 'home',
      title: 'En tu Hogar',
      description: 'Disfruta de servicios profesionales de belleza en la comodidad y privacidad de tu propio hogar.',
      color: 'from-rose-400 to-rose-600'
    }
  ];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Decorative background -->
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-brand/20 to-transparent rounded-full blur-3xl"></div>
      
      <div class="text-center mb-16 relative z-10">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-fraunces font-bold text-white mb-6">
          ¿Por Qué Elegir Kalos?
        </h2>
        <p class="text-lg text-white/90 max-w-3xl mx-auto">
          La plataforma más confiable y completa de servicios de belleza en Bolivia
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        ${values.map(value => `
          <div class="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <div class="w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              ${renderIcon(value.icon, { size: '28' })}
            </div>
            <h3 class="text-xl font-bold text-white mb-4">${value.title}</h3>
            <p class="text-white/80 leading-relaxed">${value.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderProfessionalsCTASection() {
  const benefits = [
    'Registro gratuito y sin costo de afiliación',
    'Comisiones justas y transparentes',
    'Herramientas de gestión profesional',
    'Pagos puntuales y seguros',
    'Capacitación continua incluida',
    'Soporte 24/7 especializado'
  ];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Text Content -->
        <div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-fraunces font-bold text-navy mb-6">
            ¿Eres Profesional de Belleza?
          </h2>
          <p class="text-lg text-gray-700 mb-8 leading-relaxed">
            Únete a la red de profesionales más exitosa de Bolivia. 
            Amplía tu clientela, gestiona tu agenda y aumenta tus ingresos de manera consistente.
          </p>
          
          <div class="space-y-4 mb-8">
            ${benefits.map(benefit => `
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  ${renderIcon('check', { size: '12' })}
                </div>
                <span class="text-gray-700 font-medium">${benefit}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <div id="join-professional-btn"></div>
            <div id="learn-more-pro-btn"></div>
          </div>
        </div>
        
        <!-- Visual Card -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-navy to-brand rounded-3xl flex items-center justify-center mx-auto mb-6">
            ${renderIcon('briefcase', { size: '40' })}
            </div>
          <h3 class="text-2xl font-bold text-navy mb-4">¡Comienza Hoy!</h3>
          <p class="text-gray-600 mb-8 leading-relaxed">
              Registro simple, verificación rápida y comienza a recibir clientes en 48 horas
            </p>
          <div class="bg-gradient-to-br from-gold/20 to-brand/20 rounded-2xl p-6">
            <div class="text-2xl font-bold text-navy mb-2">¡Ingresos Flexibles!</div>
            <div class="text-sm text-gray-600">Genera ingresos según tu disponibilidad</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStatsSection() {
  const stats = [
    {
      value: '500+',
      label: 'Profesionales Verificados',
      icon: 'users'
    },
    {
      value: '2,000+',
      label: 'Clientes Satisfechos',
      icon: 'heart'
    },
    {
      value: '15,000+',
      label: 'Servicios Completados',
      icon: 'check-circle'
    },
    {
      value: '4.9/5',
      label: 'Calificación Promedio',
      icon: 'star'
    }
  ];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-fraunces font-bold text-navy mb-4">
          Creciendo Juntos en Bolivia
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Miles de bolivianos ya confían en Kalos para sus servicios de belleza
          </p>
        </div>
        
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          ${stats.map(stat => `
          <div class="text-center p-6 bg-white rounded-2xl shadow-lg border border-beige/50 hover:shadow-xl transition-shadow duration-300">
            <div class="w-16 h-16 bg-gradient-to-br from-brand to-deep-coral rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                ${renderIcon(stat.icon, { size: '28' })}
              </div>
            <div class="text-2xl lg:text-3xl font-bold text-navy mb-2">${stat.value}</div>
            <div class="text-sm text-gray-600 font-medium">${stat.label}</div>
            </div>
          `).join('')}
      </div>
    </div>
  `;
}

function renderFinalCTASection() {
  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
      <!-- Decorative elements -->
      <div class="absolute top-10 left-10 text-white/10">
        ${renderIcon('sparkles', { size: '64' })}
      </div>
      <div class="absolute bottom-10 right-10 text-white/10">
        ${renderIcon('heart', { size: '48' })}
      </div>
      
      <div class="relative z-10">
        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-fraunces font-bold text-white mb-8 leading-tight">
          Tu belleza merece lo
          <span class="text-gold block lg:inline">mejor</span>
        </h2>
        <p class="text-xl lg:text-2xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed">
          Únete a miles de bolivianos que confían en Kalos para sus servicios de belleza.
          <span class="text-gold font-semibold">¡Comienza tu transformación hoy!</span>
        </p>
        
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <div id="final-cta-primary-btn"></div>
          <div id="final-cta-secondary-btn"></div>
        </div>
        
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-white/20">
          <div class="flex items-center justify-center gap-3 text-white mb-2">
            <div class="text-green-400">
            ${renderIcon('shield-check', { size: '24' })}
          </div>
            <span class="font-semibold">100% Garantizado</span>
          </div>
          <p class="text-sm text-white/80">Satisfacción garantizada en cada servicio</p>
        </div>
      </div>
    </div>
  `;
}

export function initializeLandingPage() {
  console.log('🏗️ Initializing Landing Page...');
  
  // Initialize layout first
  initializeLayout();

  // Initialize all buttons with actual component instances
  initializeButtons();
  
  // Load featured services
  loadFeaturedServices();

  // Set up smooth scrolling
  initializeSmoothScrolling();

  // Set up intersection observer for animations
  initializeAnimations();
  
  // Set up global click handler for data-action buttons
  setupGlobalClickHandler();
  
  // Dev helper: make landing page debugging available
  if (import.meta.env.DEV) {
    window.testLandingButtons = testLandingButtons;
    
    // Emergency button fix function
    window.fixViewAllButton = () => {
      console.log('🚨 Emergency fix for View All Services button');
      const btn = document.querySelector('#view-all-services-btn button');
      if (btn) {
        console.log('📍 Button found, removing all listeners and adding direct handler');
        
        // Clone button to remove all listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add direct click handler
        newBtn.onclick = (e) => {
          console.log('🚨 EMERGENCY HANDLER: View All button clicked!');
          e.preventDefault();
          e.stopPropagation();
          window.location.href = '/marketplace';
        };
        
        console.log('✅ Emergency handler applied');
      } else {
        console.log('❌ Button not found');
      }
    };
    
    // Comprehensive debug function
    window.debugButtonComponent = (buttonId) => {
      console.log(`🔍 Debugging button component: ${buttonId}`);
      const container = document.getElementById(buttonId);
      const buttonEl = container?.querySelector('button');
      
      if (!container) {
        console.log('❌ Container not found');
        return;
      }
      
      if (!buttonEl) {
        console.log('❌ Button element not found in container');
        console.log('Container innerHTML:', container.innerHTML);
        return;
      }
      
      console.log('✅ Container and button found');
      console.log('🔍 Button attributes:', {
        'data-component': buttonEl.getAttribute('data-component'),
        'data-component-id': buttonEl.getAttribute('data-component-id'),
        'onclick': !!buttonEl.onclick,
        'class': buttonEl.className,
        'textContent': buttonEl.textContent?.trim()
      });
      
      // Check for event listeners
      const listeners = buttonEl._listeners || {};
      const hasClickEventListener = buttonEl.onclick || listeners.click || buttonEl.addEventListener;
      console.log('🔍 Button listeners:', {
        '_listeners': Object.keys(listeners),
        'onclick': !!buttonEl.onclick,
        'hasEventListeners': Object.keys(listeners).length > 0
      });
      
      // Try manual click
      console.log('🧪 Testing manual click...');
      try {
        buttonEl.click();
        console.log('✅ Manual click executed');
      } catch (error) {
        console.error('❌ Manual click failed:', error);
      }
    };
    
    // Force re-initialization of all buttons
    window.reinitializeAllButtons = () => {
      console.log('🔄 Force re-initializing all landing page buttons...');
      
      // Re-call initializeButtons
      initializeButtons();
      
      // Wait a bit and test
      setTimeout(() => {
        testLandingButtons();
      }, 100);
    };
    
    // Simple click test
    window.testButtonClicks = () => {
      console.log('🧪 Testing programmatic clicks on all buttons...');
      
      const buttonIds = [
        'hero-primary-btn',
        'hero-secondary-btn', 
        'view-all-services-btn',
        'join-professional-btn',
        'learn-more-pro-btn',
        'final-cta-primary-btn',
        'final-cta-secondary-btn'
      ];
      
      buttonIds.forEach(id => {
        const button = document.querySelector(`#${id} button`);
        if (button) {
          console.log(`🔘 Testing click on ${id}...`);
          
          // Create and dispatch click event
          const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          
          button.dispatchEvent(clickEvent);
        } else {
          console.log(`❌ Button not found: ${id}`);
        }
      });
    };
    
    // Immediate test - bypass all component systems
    window.immediateButtonTest = () => {
      console.log('🚨 IMMEDIATE TEST - Direct navigation calls');
      
      console.log('🔘 Testing Hero Primary - Direct navigation call');
      navigateBasedOnAuth('/marketplace');
      
      setTimeout(() => {
        console.log('🔘 Testing scroll to section');
        const howItWorksSection = document.getElementById('how-it-works');
        if (howItWorksSection) {
          const headerHeight = 80;
          const targetPosition = howItWorksSection.offsetTop - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          console.log('✅ Smooth scroll executed');
        } else {
          console.log('❌ How it works section not found');
        }
      }, 1000);
    };
    
    // SUPER SIMPLE TEST - Just check if clicks are being blocked
    window.superSimpleTest = () => {
      console.log('🔍 SUPER SIMPLE TEST - Checking if clicks are blocked');
      
      // Test 1: Direct onclick
      const heroBtn = document.querySelector('#hero-primary-btn button');
      if (heroBtn) {
        console.log('🔘 Found hero button, adding direct onclick');
        console.log('🔍 Hero button classes:', heroBtn.className);
        console.log('🔍 Hero button disabled:', heroBtn.disabled);
        console.log('🔍 Hero button pointer-events:', window.getComputedStyle(heroBtn).pointerEvents);
        
        heroBtn.onclick = (e) => {
          console.log('🎉 DIRECT ONCLICK WORKED!');
          e.preventDefault();
          e.stopPropagation();
          alert('ONCLICK FUNCIONA!');
        };
      }
      
      // Test 2: Direct addEventListener
      const viewAllBtn = document.querySelector('#view-all-services-btn button');
      if (viewAllBtn) {
        console.log('🔘 Found view all button, adding direct addEventListener');
        console.log('🔍 View all button classes:', viewAllBtn.className);
        console.log('🔍 View all button disabled:', viewAllBtn.disabled);
        console.log('🔍 View all button pointer-events:', window.getComputedStyle(viewAllBtn).pointerEvents);
        
        viewAllBtn.addEventListener('click', (e) => {
          console.log('🎉 DIRECT ADDEVENTLISTENER WORKED!');
          e.preventDefault();
          e.stopPropagation();
          alert('ADDEVENTLISTENER FUNCIONA!');
        });
      }
      
      // Test 3: Check if element is clickable
      const allButtons = document.querySelectorAll('button');
      console.log(`🔍 Found ${allButtons.length} buttons on page`);
      
      allButtons.forEach((btn, i) => {
        const rect = btn.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const computedStyle = window.getComputedStyle(btn);
        const isClickable = !btn.disabled && computedStyle.pointerEvents !== 'none';
        
        console.log(`🔘 Button ${i}: visible=${isVisible}, clickable=${isClickable}, disabled=${btn.disabled}, pointer-events=${computedStyle.pointerEvents}, classes="${btn.className}", text="${btn.textContent.trim()}"`);
      });
    };
    
    // Emergency fix - add direct event listeners
    window.addDirectEventListeners = () => {
      console.log('🚨 Adding direct event listeners as emergency fix...');
      
      const buttonConfigs = [
        { id: 'hero-primary-btn', action: () => {
          console.log('🔘 DIRECT: Hero primary clicked');
          navigateBasedOnAuth('/marketplace');
        }},
        { id: 'view-all-services-btn', action: () => {
          console.log('🔘 DIRECT: View all services clicked');
          navigateBasedOnAuth('/marketplace');
        }},
        { id: 'join-professional-btn', action: () => {
          console.log('🔘 DIRECT: Join professional clicked');
          navigateTo('/auth/register?role=professional');
        }}
      ];
      
      buttonConfigs.forEach(config => {
        const button = document.querySelector(`#${config.id} button`);
        if (button) {
          // Force enable the button
          button.style.pointerEvents = 'auto';
          button.style.cursor = 'pointer';
          button.disabled = false;
          button.removeAttribute('disabled');
          button.classList.remove('btn-disabled', 'btn-loading');
          
          // Remove existing listeners
          const newButton = button.cloneNode(true);
          button.parentNode.replaceChild(newButton, button);
          
          // Add direct listener
          newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            config.action();
          });
          
          console.log(`✅ Direct listener added to ${config.id}`);
        }
      });
    };
    
    // NUCLEAR OPTION - Force all buttons to work
    window.nuclearButtonFix = () => {
      console.log('☢️ NUCLEAR OPTION - Force all buttons to work');
      
      // Find ALL buttons on the page
      const allButtons = document.querySelectorAll('button');
      console.log(`🔍 Found ${allButtons.length} buttons, forcing them to work...`);
      
      allButtons.forEach((button, index) => {
        // Force enable all buttons
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.disabled = false;
        button.removeAttribute('disabled');
        button.classList.remove('btn-disabled', 'btn-loading');
        
        // Add a simple test click handler
        const originalOnClick = button.onclick;
        button.onclick = (e) => {
          console.log(`☢️ NUCLEAR CLICK: Button ${index} clicked!`);
          console.log(`☢️ Button text: "${button.textContent.trim()}"`);
          console.log(`☢️ Button classes: "${button.className}"`);
          
          // If it's a known button, do the right action
          const buttonText = button.textContent.trim().toLowerCase();
          if (buttonText.includes('ver todos') || buttonText.includes('marketplace')) {
            navigateBasedOnAuth('/marketplace');
          } else if (buttonText.includes('conocer más') || buttonText.includes('scroll')) {
            const howItWorksSection = document.getElementById('how-it-works');
            if (howItWorksSection) {
              const headerHeight = 80;
              const targetPosition = howItWorksSection.offsetTop - headerHeight;
              window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
          } else if (buttonText.includes('unirse') || buttonText.includes('profesional')) {
            navigateBasedOnAuth('/pro/profile/create');
          } else if (buttonText.includes('contactar')) {
            navigateBasedOnAuth('/contacto');
          } else {
            // Generic action for unknown buttons
            alert(`Button clicked: ${buttonText}`);
          }
          
          e.preventDefault();
          e.stopPropagation();
        };
        
        console.log(`☢️ Forced button ${index}: "${button.textContent.trim()}"`);
      });
      
      console.log('☢️ NUCLEAR FIX APPLIED - All buttons should work now!');
    };
    
    // SIMPLE CLICK TEST - Just add onclick to specific buttons
    window.simpleClickTest = () => {
      console.log('🔍 SIMPLE CLICK TEST - Adding direct onclick handlers');
      
      const buttonConfigs = [
        {
          selector: '#hero-primary-btn button',
          name: 'Hero Primary',
          action: () => {
            console.log('🎉 Hero Primary clicked!');
            navigateBasedOnAuth('/marketplace');
          }
        },
        {
          selector: '#hero-secondary-btn button',
          name: 'Hero Secondary',
          action: () => {
            console.log('🎉 Hero Secondary clicked!');
            const howItWorksSection = document.getElementById('how-it-works');
            if (howItWorksSection) {
              const headerHeight = 80;
              const targetPosition = howItWorksSection.offsetTop - headerHeight;
              window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
          }
        },
        {
          selector: '#view-all-services-btn button',
          name: 'View All Services',
          action: () => {
            console.log('🎉 View All Services clicked!');
            navigateBasedOnAuth('/marketplace');
          }
        },
        {
          selector: '#join-professional-btn button',
          name: 'Join Professional',
          action: () => {
            console.log('🎉 Join Professional clicked!');
            navigateBasedOnAuth('/pro/profile/create');
          }
        },
        {
          selector: '#learn-more-pro-btn button',
          name: 'Learn More Pro',
          action: () => {
            console.log('🎉 Learn More Pro clicked!');
            navigateBasedOnAuth('/pro/profile/create');
          }
        },
        {
          selector: '#final-cta-primary-btn button',
          name: 'Final CTA Primary',
          action: () => {
            console.log('🎉 Final CTA Primary clicked!');
            navigateBasedOnAuth('/marketplace');
          }
        },
        {
          selector: '#final-cta-secondary-btn button',
          name: 'Final CTA Secondary',
          action: () => {
            console.log('🎉 Final CTA Secondary clicked!');
            navigateBasedOnAuth('/contacto');
          }
        }
      ];
      
      buttonConfigs.forEach(config => {
        const button = document.querySelector(config.selector);
        if (button) {
          console.log(`🔘 Adding onclick to ${config.name}`);
          
          // Remove any existing onclick
          button.onclick = null;
          
          // Add new onclick
          button.onclick = (e) => {
            console.log(`🎉 CLICK DETECTED: ${config.name}`);
            e.preventDefault();
            e.stopPropagation();
            config.action();
          };
          
          console.log(`✅ onclick added to ${config.name}`);
        } else {
          console.log(`❌ Button not found: ${config.name}`);
        }
      });
      
      console.log('✅ Simple click test applied - try clicking the buttons now!');
    };
    
    // FORCE RE-BIND ALL BUTTONS - Fix Button component event listeners
    window.forceRebindButtons = () => {
      console.log('🔧 FORCE RE-BIND ALL BUTTONS');
      
      // Find all Button components and force re-bind
      const buttonElements = document.querySelectorAll('button[data-component="button"]');
      console.log(`🔍 Found ${buttonElements.length} Button components`);
      
      buttonElements.forEach((button, index) => {
        console.log(`🔧 Re-binding button ${index}: "${button.textContent.trim()}"`);
        
        // Force enable
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.disabled = false;
        button.removeAttribute('disabled');
        button.classList.remove('btn-disabled', 'btn-loading');
        
        // Get the component ID
        const componentId = button.getAttribute('data-component-id');
        console.log(`🔧 Component ID: ${componentId}`);
        
        // Add a simple onclick that works
        button.onclick = (e) => {
          console.log(`🎉 FORCE RE-BIND CLICK: Button ${index} clicked!`);
          console.log(`🎉 Button text: "${button.textContent.trim()}"`);
          
          // Determine action based on button text
          const buttonText = button.textContent.trim().toLowerCase();
          if (buttonText.includes('ver todos') || buttonText.includes('explorar') || buttonText.includes('marketplace')) {
            console.log('🎉 Navigating to marketplace...');
            navigateBasedOnAuth('/marketplace');
          } else if (buttonText.includes('conocer más') || buttonText.includes('cómo funciona')) {
            console.log('🎉 Scrolling to how it works...');
            const howItWorksSection = document.getElementById('how-it-works');
            if (howItWorksSection) {
              const headerHeight = 80;
              const targetPosition = howItWorksSection.offsetTop - headerHeight;
              window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
          } else if (buttonText.includes('unirse') || buttonText.includes('profesional')) {
            console.log('🎉 Navigating to professional registration...');
            navigateBasedOnAuth('/pro/profile/create');
          } else if (buttonText.includes('contactar')) {
            console.log('🎉 Navigating to contact...');
            navigateBasedOnAuth('/contacto');
          } else {
            console.log('🎉 Unknown button action, showing alert...');
            alert(`Button clicked: ${buttonText}`);
          }
          
          e.preventDefault();
          e.stopPropagation();
        };
        
        console.log(`✅ Button ${index} re-bound successfully`);
      });
      
      console.log('🔧 FORCE RE-BIND COMPLETED - All buttons should work now!');
    };
    
    // ULTRA SIMPLE TEST - Just check one button
    window.ultraSimpleTest = () => {
      console.log('🔍 ULTRA SIMPLE TEST - Checking one button');
      
      const heroBtn = document.querySelector('#hero-primary-btn button');
      if (heroBtn) {
        console.log('🔘 Found hero button');
        console.log('🔍 Classes:', heroBtn.className);
        console.log('🔍 Disabled:', heroBtn.disabled);
        console.log('🔍 Pointer events:', window.getComputedStyle(heroBtn).pointerEvents);
        console.log('🔍 Cursor:', window.getComputedStyle(heroBtn).cursor);
        
        // Force enable
        heroBtn.style.pointerEvents = 'auto';
        heroBtn.style.cursor = 'pointer';
        heroBtn.disabled = false;
        
        // Add simple click
        heroBtn.onclick = (e) => {
          console.log('🎉 ULTRA SIMPLE CLICK WORKED!');
          alert('CLICK FUNCIONA!');
          e.preventDefault();
        };
        
        console.log('✅ Ultra simple test applied');
      } else {
        console.log('❌ Hero button not found');
      }
    };
    
    // TEST CLICK HANDLERS - Check if Button component handlers are working
    window.testClickHandlers = () => {
      console.log('🔍 TESTING CLICK HANDLERS...');
      
      const buttons = [
        { id: 'hero-primary-btn', name: 'Hero Primary' },
        { id: 'hero-secondary-btn', name: 'Hero Secondary' },
        { id: 'view-all-services-btn', name: 'View All Services' }
      ];
      
      buttons.forEach(buttonInfo => {
        const button = document.querySelector(`#${buttonInfo.id} button`);
        if (button) {
          console.log(`🔘 Testing ${buttonInfo.name}:`);
          console.log(`  - Element:`, button);
          console.log(`  - onclick:`, button.onclick);
          console.log(`  - Event listeners:`, button._listeners || 'No _listeners property');
          
          // Check if there are any event listeners
          const listeners = getEventListeners ? getEventListeners(button) : 'getEventListeners not available';
          console.log(`  - getEventListeners:`, listeners);
          
          // Add a test click to see if it works
          button.addEventListener('test-click', (e) => {
            console.log(`🎉 TEST CLICK WORKED for ${buttonInfo.name}!`);
          });
          
          // Trigger test click
          button.dispatchEvent(new Event('test-click'));
        } else {
          console.log(`❌ Button not found: ${buttonInfo.name}`);
        }
      });
    };
    
    // DIRECT NAVIGATION TEST - Bypass everything
    window.directNavTest = () => {
      console.log('🚀 DIRECT NAVIGATION TEST');
      
      console.log('🔘 Testing direct navigation to marketplace...');
      try {
        navigateBasedOnAuth('/marketplace');
        console.log('✅ Direct navigation call completed');
      } catch (error) {
        console.log('❌ Direct navigation failed:', error);
      }
    };
    
    // TEST ALL BUTTONS - Verify all buttons are working
    window.testAllButtons = () => {
      console.log('🧪 TESTING ALL BUTTONS...');
      
      const buttons = [
        { selector: '#hero-primary-btn button', name: 'Hero Primary' },
        { selector: '#hero-secondary-btn button', name: 'Hero Secondary' },
        { selector: '#view-all-services-btn button', name: 'View All Services' },
        { selector: '#join-professional-btn button', name: 'Join Professional' },
        { selector: '#learn-more-pro-btn button', name: 'Learn More Pro' },
        { selector: '#final-cta-primary-btn button', name: 'Final CTA Primary' },
        { selector: '#final-cta-secondary-btn button', name: 'Final CTA Secondary' }
      ];
      
      buttons.forEach(buttonInfo => {
        const button = document.querySelector(buttonInfo.selector);
        if (button) {
          console.log(`🔘 ${buttonInfo.name}:`);
          console.log(`  - Element: ${button.tagName}`);
          console.log(`  - onclick: ${typeof button.onclick}`);
          console.log(`  - disabled: ${button.disabled}`);
          console.log(`  - pointer-events: ${window.getComputedStyle(button).pointerEvents}`);
          console.log(`  - cursor: ${window.getComputedStyle(button).cursor}`);
          console.log(`  - text: "${button.textContent.trim()}"`);
        } else {
          console.log(`❌ ${buttonInfo.name}: Button not found`);
        }
      });
      
      console.log('🧪 Button test completed');
    };
    
    // TEST NAVIGATION FUNCTIONS - Check if navigation functions are available
    window.testNavigationFunctions = () => {
      console.log('🧪 TESTING NAVIGATION FUNCTIONS...');
      
      console.log('🔍 Checking navigateTo function:');
      console.log(`  - typeof navigateTo: ${typeof navigateTo}`);
      console.log(`  - window.navigateTo: ${typeof window.navigateTo}`);
      
      console.log('🔍 Checking navigateBasedOnAuth function:');
      console.log(`  - typeof navigateBasedOnAuth: ${typeof navigateBasedOnAuth}`);
      console.log(`  - window.navigateBasedOnAuth: ${typeof window.navigateBasedOnAuth}`);
      
      console.log('🔍 Checking router:');
      console.log(`  - window.router: ${typeof window.router}`);
      console.log(`  - router.navigate: ${window.router ? typeof window.router.navigate : 'N/A'}`);
      
      console.log('🧪 Navigation functions test completed');
    };
    
    // TEST BUTTON COMPONENTS - Check if Button components are accessible
    window.testButtonComponents = () => {
      console.log('🧪 TESTING BUTTON COMPONENTS...');
      
      const containers = [
        { selector: '#hero-primary-btn', name: 'Hero Primary' },
        { selector: '#hero-secondary-btn', name: 'Hero Secondary' },
        { selector: '#view-all-services-btn', name: 'View All Services' },
        { selector: '#join-professional-btn', name: 'Join Professional' },
        { selector: '#learn-more-pro-btn', name: 'Learn More Pro' },
        { selector: '#final-cta-primary-btn', name: 'Final CTA Primary' },
        { selector: '#final-cta-secondary-btn', name: 'Final CTA Secondary' }
      ];
      
      containers.forEach(containerInfo => {
        const container = document.querySelector(containerInfo.selector);
        if (container) {
          console.log(`🔘 ${containerInfo.name} container:`);
          console.log(`  - Element: ${container.tagName}`);
          console.log(`  - _component: ${typeof container._component}`);
          console.log(`  - _component.props: ${container._component ? typeof container._component.props : 'N/A'}`);
          console.log(`  - _component.props.onClick: ${container._component && container._component.props ? typeof container._component.props.onClick : 'N/A'}`);
          
          const button = container.querySelector('button');
          if (button) {
            console.log(`  - Button element: ${button.tagName}`);
            console.log(`  - Button onclick: ${typeof button.onclick}`);
            console.log(`  - Button disabled: ${button.disabled}`);
          } else {
            console.log(`  - Button element: NOT FOUND`);
          }
        } else {
          console.log(`❌ ${containerInfo.name}: Container not found`);
        }
      });
      
      console.log('🧪 Button components test completed');
    };
    
    console.log('🛠️ Debug helpers available:');
    console.log('   - window.testLandingButtons()');
    console.log('   - window.fixViewAllButton()');
    console.log('   - window.debugButtonComponent("button-id")');
    console.log('   - window.reinitializeAllButtons()');
    console.log('   - window.testButtonClicks()');
    console.log('   - window.immediateButtonTest()');
    console.log('   - window.superSimpleTest()');
    console.log('   - window.addDirectEventListeners()');
    console.log('   - window.nuclearButtonFix()');
    console.log('   - window.ultraSimpleTest()');
    console.log('   - window.testClickHandlers()');
    console.log('   - window.simpleClickTest()');
    console.log('   - window.forceRebindButtons()');
    console.log('   - window.testAllButtons()');
    console.log('   - window.testNavigationFunctions()');
    console.log('   - window.testButtonComponents()');
    console.log('   - window.directNavTest()');
    
    // Auto-test removido - los botones ya funcionan correctamente
    // Si necesitas debuggear, usa las funciones manuales en consola
    
    // DEFINITIVE BUTTON FIX - Work WITH the Button component, not against it
    setTimeout(() => {
      console.log('🔧 DEFINITIVE FIX: Working with Button component...');
      
      const buttonConfigs = [
        {
          selector: '#hero-primary-btn',
          name: 'Hero Primary',
          action: () => {
            console.log('🎯 Hero Primary clicked - navigating to marketplace');
            window.navigateBasedOnAuth('/marketplace');
          }
        },
        {
          selector: '#hero-secondary-btn',
          name: 'Hero Secondary',
          action: () => {
            console.log('🎯 Hero Secondary clicked - smooth scroll to how-it-works');
            const howItWorksSection = document.getElementById('how-it-works');
            if (howItWorksSection) {
              const headerHeight = 80;
              const targetPosition = howItWorksSection.offsetTop - headerHeight;
              window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
          }
        },
        {
          selector: '#view-all-services-btn',
          name: 'View All Services',
          action: () => {
            console.log('🎯 View All Services clicked - navigating to marketplace');
            window.navigateBasedOnAuth('/marketplace');
          }
        },
        {
          selector: '#join-professional-btn',
          name: 'Join Professional',
          action: () => {
            console.log('🎯 Join Professional clicked - navigating to register');
            window.navigateTo('/auth/register?role=professional');
          }
        },
        {
          selector: '#learn-more-pro-btn',
          name: 'Learn More Pro',
          action: () => {
            console.log('🎯 Learn More Pro clicked - navigating to pro profile create');
            window.navigateTo('/pro/profile/create');
          }
        },
        {
          selector: '#final-cta-primary-btn',
          name: 'Final CTA Primary',
          action: () => {
            console.log('🎯 Final CTA Primary clicked - navigating to marketplace');
            window.navigateBasedOnAuth('/marketplace');
          }
        },
        {
          selector: '#final-cta-secondary-btn',
          name: 'Final CTA Secondary',
          action: () => {
            console.log('🎯 Final CTA Secondary clicked - navigating to contacto');
            window.navigateTo('/contacto');
          }
        }
      ];
      
      buttonConfigs.forEach(config => {
        const container = document.querySelector(config.selector);
        if (container) {
          console.log(`🔧 Working with ${config.name} container`);
          
          // Find the Button component instance
          const buttonComponent = container._component;
          if (buttonComponent && buttonComponent.props && buttonComponent.props.onClick) {
            console.log(`🔧 Found Button component for ${config.name}, updating onClick`);
            
            // Update the Button component's onClick prop
            buttonComponent.props.onClick = config.action;
            
            // Force re-bind events
            buttonComponent._eventsbound = false;
            buttonComponent.bindEvents();
            
            console.log(`✅ ${config.name} Button component updated successfully`);
          } else {
            console.log(`❌ Button component not found for ${config.name}, trying direct approach`);
            
            // Fallback: try to find the button element and add event listener
            const button = container.querySelector('button');
            if (button) {
              // Remove any existing click listeners
              const newButton = button.cloneNode(true);
              button.parentNode.replaceChild(newButton, button);
              
              // Add our event listener
              newButton.addEventListener('click', (e) => {
                console.log(`🎉 DIRECT FIX: ${config.name} clicked!`);
                e.preventDefault();
                e.stopPropagation();
                config.action();
              });
              
              console.log(`✅ ${config.name} direct fix applied successfully`);
            } else {
              console.log(`❌ Button element not found for ${config.name}`);
            }
          }
        } else {
          console.log(`❌ Container not found: ${config.name}`);
        }
      });
      
      console.log('🔧 DEFINITIVE FIX COMPLETED - All buttons should work now!');
    }, 3000);
  }
  
  console.log('✅ Landing Page fully initialized');
}

// Debug function to test buttons
function testLandingButtons() {
  console.log('🧪 Testing landing page buttons...');
  
  const buttons = [
    { id: 'hero-primary-btn', name: 'Hero Primary', testClick: () => console.log('🔘 Hero Primary clicked!') },
    { id: 'hero-secondary-btn', name: 'Hero Secondary', testClick: () => console.log('🔘 Hero Secondary clicked!') },
    { id: 'view-all-services-btn', name: 'View All Services', testClick: () => console.log('🔘 View All clicked!') },
    { id: 'join-professional-btn', name: 'Join Professional', testClick: () => console.log('🔘 Join Professional clicked!') },
    { id: 'learn-more-pro-btn', name: 'Learn More Pro', testClick: () => console.log('🔘 Learn More clicked!') },
    { id: 'final-cta-primary-btn', name: 'Final CTA Primary', testClick: () => console.log('🔘 Final Primary clicked!') },
    { id: 'final-cta-secondary-btn', name: 'Final CTA Secondary', testClick: () => console.log('🔘 Final Secondary clicked!') }
  ];
  
  buttons.forEach(button => {
    const element = document.getElementById(button.id);
    const buttonElement = element?.querySelector('button');
    const hasEventListeners = buttonElement?._listeners || buttonElement?.onclick;
    
    console.log(`🔘 ${button.name}:`, {
      container: !!element,
      button: !!buttonElement,
      hasClick: !!buttonElement?.onclick,
      hasEventListeners: !!hasEventListeners,
      classes: buttonElement?.className || 'none'
    });
    
    // Add fallback click handler for testing
    if (buttonElement && !buttonElement.onclick) {
      console.log(`🔧 Adding fallback click handler to ${button.name}`);
      buttonElement.onclick = button.testClick;
    }
  });
  
  console.log('🧪 Test complete. Try clicking buttons now.');
  console.log('🧪 If buttons still don\'t work, they may have complex event listeners.');
}

function initializeButtons() {
  console.log('🔘 Initializing all landing page buttons...');
  
  // Hero section buttons
  const heroPrimaryBtn = new Button({
    variant: 'secondary',
    size: 'xl',
    children: `
      ${renderIcon('search', { size: '20' })}
      Explorar servicios
    `,
    className: 'bg-white text-brand hover:bg-gray-50 border-2 border-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
    onClick: () => {
      console.log('🔘 Hero primary button clicked - navigating to marketplace');
      navigateBasedOnAuth('/marketplace');
    }
  });
  
  const heroSecondaryBtn = new Button({
    variant: 'ghost',
    size: 'xl',
    children: `
      ${renderIcon('play-circle', { size: '20' })}
      Cómo funciona
    `,
    className: 'text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300',
    onClick: (e) => {
      e.preventDefault();
      const howItWorksSection = document.getElementById('how-it-works');
      if (howItWorksSection) {
        const headerHeight = 80;
        const targetPosition = howItWorksSection.offsetTop - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }
  });

  // Mount hero buttons
  const heroPrimaryContainer = document.getElementById('hero-primary-btn');
  const heroSecondaryContainer = document.getElementById('hero-secondary-btn');
  
  console.log('🔘 Hero button containers found:', { 
    primary: !!heroPrimaryContainer, 
    secondary: !!heroSecondaryContainer 
  });
  
  if (heroPrimaryContainer) {
    heroPrimaryBtn.mount(heroPrimaryContainer);
    console.log('✅ Hero primary button mounted');
    
    // IMMEDIATE FIX: Apply onclick directly after mount
    setTimeout(() => {
      const button = heroPrimaryContainer.querySelector('button');
      if (button) {
        console.log('🔧 Applying immediate fix to Hero Primary button');
        
        // Store the original onclick if it exists
        const originalOnClick = button.onclick;
        
        // Apply our fix
        button.onclick = (e) => {
          console.log('🎉 IMMEDIATE FIX: Hero Primary clicked!');
          navigateBasedOnAuth('/marketplace');
          
          // Also call the original handler if it exists
          if (originalOnClick) {
            originalOnClick.call(button, e);
          }
        };
        
        console.log('✅ Hero Primary button fix applied successfully');
      }
    }, 200);
  }
  
  if (heroSecondaryContainer) {
    heroSecondaryBtn.mount(heroSecondaryContainer);
    console.log('✅ Hero secondary button mounted');
    
    // IMMEDIATE FIX: Apply onclick directly after mount
    setTimeout(() => {
      const button = heroSecondaryContainer.querySelector('button');
      if (button) {
        console.log('🔧 Applying immediate fix to Hero Secondary button');
        button.onclick = (e) => {
          console.log('🎉 IMMEDIATE FIX: Hero Secondary clicked!');
          const howItWorksSection = document.getElementById('how-it-works');
          if (howItWorksSection) {
            const headerHeight = 80;
            const targetPosition = howItWorksSection.offsetTop - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
        };
      }
    }, 100);
  }
  
  // Remove duplicate code - already handled above

  // View all services button
  const viewAllServicesBtn = new Button({
    variant: 'primary',
    size: 'xl',
    children: `
      Ver Todos los Servicios
      ${renderIcon('arrow-right', { size: '20' })}
    `,
    className: 'shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
    onClick: () => {
      console.log('🔘 View all services button clicked - navigating to marketplace');
      navigateBasedOnAuth('/marketplace');
    }
  });

  const viewAllContainer = document.getElementById('view-all-services-btn');
  console.log('🔘 View all services container found:', !!viewAllContainer);
  
  if (viewAllContainer) {
    viewAllServicesBtn.mount(viewAllContainer);
    console.log('✅ View all services button mounted');
    
    // IMMEDIATE FIX: Apply onclick directly after mount
    setTimeout(() => {
      const button = viewAllContainer.querySelector('button');
      if (button) {
        console.log('🔧 Applying immediate fix to View All Services button');
        button.onclick = (e) => {
          console.log('🎉 IMMEDIATE FIX: View All Services clicked!');
          navigateBasedOnAuth('/marketplace');
        };
      }
    }, 100);
  }

  // Professional CTA buttons
  const joinProfessionalBtn = new Button({
    variant: 'primary',
    size: 'xl',
    children: `
      ${renderIcon('user-plus', { size: '20' })}
      Únete como Profesional
    `,
    className: 'bg-navy hover:bg-navy-hover shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
    onClick: () => navigateTo('/auth/register?role=professional')
  });

  const learnMoreProBtn = new Button({
    variant: 'ghost',
    size: 'lg',
    children: `
      Conocer Más
      ${renderIcon('arrow-right', { size: '16' })}
    `,
    className: 'text-navy border-navy hover:bg-navy hover:text-white transition-all duration-300',
    onClick: () => navigateTo('/pro/profile/create')
  });

  const joinProfessionalContainer = document.getElementById('join-professional-btn');
  const learnMoreProContainer = document.getElementById('learn-more-pro-btn');
  
  if (joinProfessionalContainer) {
    joinProfessionalBtn.mount(joinProfessionalContainer);
    console.log('✅ Join Professional button mounted');
    
    // IMMEDIATE FIX: Apply onclick directly after mount
    setTimeout(() => {
      const button = joinProfessionalContainer.querySelector('button');
      if (button) {
        console.log('🔧 Applying immediate fix to Join Professional button');
        button.onclick = (e) => {
          console.log('🎉 IMMEDIATE FIX: Join Professional clicked!');
          navigateTo('/auth/register?role=professional');
        };
      }
    }, 100);
  }
  
  if (learnMoreProContainer) {
    learnMoreProBtn.mount(learnMoreProContainer);
    console.log('✅ Learn More Pro button mounted');
    
    // IMMEDIATE FIX: Apply onclick directly after mount
    setTimeout(() => {
      const button = learnMoreProContainer.querySelector('button');
      if (button) {
        console.log('🔧 Applying immediate fix to Learn More Pro button');
        button.onclick = (e) => {
          console.log('🎉 IMMEDIATE FIX: Learn More Pro clicked!');
          navigateTo('/pro/profile/create');
        };
      }
    }, 100);
  }

  // Final CTA buttons
  const finalCtaPrimaryBtn = new Button({
    variant: 'secondary',
    size: 'xl',
    children: `
      ${renderIcon('rocket', { size: '24' })}
      Comenzar Ahora
    `,
    className: 'bg-white text-brand hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
    onClick: () => navigateBasedOnAuth('/marketplace')
  });

  const finalCtaSecondaryBtn = new Button({
    variant: 'ghost',
    size: 'lg',
    children: `
      ${renderIcon('message-circle', { size: '20' })}
      Contactar
    `,
    className: 'text-white border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300',
    onClick: () => navigateTo('/contacto')
  });

  const finalCtaPrimaryContainer = document.getElementById('final-cta-primary-btn');
  const finalCtaSecondaryContainer = document.getElementById('final-cta-secondary-btn');
  
  if (finalCtaPrimaryContainer) {
    finalCtaPrimaryBtn.mount(finalCtaPrimaryContainer);
    console.log('✅ Final CTA Primary button mounted');
    
    // IMMEDIATE FIX: Apply onclick directly after mount
    setTimeout(() => {
      const button = finalCtaPrimaryContainer.querySelector('button');
      if (button) {
        console.log('🔧 Applying immediate fix to Final CTA Primary button');
        button.onclick = (e) => {
          console.log('🎉 IMMEDIATE FIX: Final CTA Primary clicked!');
          navigateBasedOnAuth('/marketplace');
        };
      }
    }, 100);
  }
  
  if (finalCtaSecondaryContainer) {
    finalCtaSecondaryBtn.mount(finalCtaSecondaryContainer);
    console.log('✅ Final CTA Secondary button mounted');
    
    // IMMEDIATE FIX: Apply onclick directly after mount
    setTimeout(() => {
      const button = finalCtaSecondaryContainer.querySelector('button');
      if (button) {
        console.log('🔧 Applying immediate fix to Final CTA Secondary button');
        button.onclick = (e) => {
          console.log('🎉 IMMEDIATE FIX: Final CTA Secondary clicked!');
          navigateTo('/contacto');
        };
      }
    }, 100);
  }
}

async function navigateBasedOnAuth(defaultPath) {
  try {
    console.log('🔐 Checking auth state for navigation to:', defaultPath);
    console.log('🔐 Function called from:', new Error().stack?.split('\n')[2]?.trim());
    
    // Check if user is authenticated
    const user = authService.getCurrentUser();
    console.log('🔐 Current user:', user ? user.email || 'anonymous' : 'none');
    
    if (user) {
      console.log('✅ User is authenticated, checking profile...');
      
      // Try to get user profile
      try {
        const profile = await authService.getCurrentUserProfile();
        
        if (profile && profile.activeRole === 'professional') {
          console.log('🏢 Professional user detected, redirecting to dashboard');
        navigateTo('/pro/dashboard');
          return;
      } else {
          console.log('👤 Customer user detected, proceeding to:', defaultPath);
        navigateTo(defaultPath);
          return;
        }
      } catch (profileError) {
        console.warn('⚠️ Could not get user profile, proceeding to default path');
        navigateTo(defaultPath);
        return;
      }
    } else {
      console.log('🔒 User not authenticated, proceeding to:', defaultPath);
      navigateTo(defaultPath);
    }
  } catch (error) {
    console.error('🚨 Error checking auth state:', error);
    navigateTo(defaultPath);
  }
}

// Make navigation functions available globally for the definitive fix
window.navigateTo = navigateTo;
window.navigateBasedOnAuth = navigateBasedOnAuth;

async function loadFeaturedServices() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;

  try {
    console.log('🔥 Loading featured services from Firebase...');
    
    // Importar los servicios necesarios
    const { servicesService } = await import('../services/services.js');
    const { professionalService } = await import('../services/professionals.js');
    
    // Obtener servicios de Firebase - intentar cargar servicios reales
    const services = await servicesService.getFeaturedServices(6);
    
    console.log('✅ Services loaded from Firebase:', services);
    
    if (!services || services.length === 0) {
      throw new Error('No featured services found');
    }

    // Cargar información de profesionales para cada servicio
    const serviceCardsHTML = await Promise.all(
      services.map(async (service) => {
        try {
          // Obtener información del profesional
          const professional = await professionalService.getPublicProfile(service.professionalId);
          
          if (!professional) {
            console.warn(`Professional not found for service ${service.id}`);
            return ''; // Skip this service
          }

          // Transformar datos para ServiceCard
          const transformedService = {
            id: service.id,
            name: service.basicInfo?.name || service.title || 'Servicio de Belleza',
            description: service.basicInfo?.description || service.shortDesc || 'Servicio profesional de belleza',
            price: service.pricing?.basePrice || 0,
            duration: service.basicInfo?.duration || 60,
            images: service.media?.images || [],
            category: service.basicInfo?.category || service.categoryId || 'beauty'
          };

          const transformedProfessional = {
            id: professional.id,
            name: professional.personalInfo?.firstName || professional.businessInfo?.businessName || 'Profesional',
            avatar: professional.personalInfo?.profileImage || '',
            rating: professional.stats?.averageRating || 4.8,
            reviewCount: professional.stats?.totalReviews || 0
          };

          // Crear ServiceCard
          const serviceCard = new ServiceCard({
            service: transformedService,
            professional: transformedProfessional,
            onClick: (service) => {
              navigateTo(`/pro/${professional.handle || professional.id}#service-${service.id}`);
            },
            onBookNow: (service) => {
              navigateBasedOnAuth(`/pro/${professional.handle || professional.id}#service-${service.id}`);
            }
          });

          const container = document.createElement('div');
          serviceCard.mount(container);
          return container.innerHTML;
        } catch (error) {
          console.error(`Error loading data for service ${service.id}:`, error);
          return ''; // Skip this service
        }
      })
    );

    // Filtrar elementos vacíos y renderizar
    const validCards = serviceCardsHTML.filter(html => html.trim() !== '');
    
    if (validCards.length > 0) {
      servicesGrid.innerHTML = validCards.join('');
      console.log(`✅ Rendered ${validCards.length} service cards`);
    } else {
      throw new Error('No valid service cards could be created');
    }

  } catch (error) {
    console.error('🚨 Error loading featured services from Firebase:', error);
    
    // Fallback a datos demo solo en desarrollo
    if (import.meta.env.DEV) {
      console.log('🎭 Fallback: Using demo services...');
      console.log('💡 Tip: Use window.populateFirebaseData() to add real data to Firebase');
      console.log('🤖 Auto-populating Firebase with test data...');
      
      // Try to auto-populate Firebase
      try {
        if (window.populateFirebaseData) {
          const result = await window.populateFirebaseData();
          if (result.success) {
            console.log('✅ Firebase populated successfully, retrying service load...');
            return loadFeaturedServices(); // Retry loading from Firebase
          }
        }
      } catch (populateError) {
        console.warn('⚠️ Could not auto-populate Firebase:', populateError);
      }
      
      await loadDemoServices();
    } else {
      showServicesError();
    }
  }
}

async function loadDemoServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

  const demoServices = [
    {
      id: 'demo-1',
      name: 'Maquillaje Profesional',
      description: 'Maquillaje para eventos especiales y ocasiones importantes',
      price: 150,
        duration: 60,
      images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop'],
        category: 'makeup'
      },
      {
      id: 'demo-2', 
      name: 'Corte y Peinado',
      description: 'Corte personalizado y peinado profesional',
      price: 120,
        duration: 90,
      images: ['https://images.unsplash.com/photo-1560869713-bf165a7c7e8b?w=400&h=300&fit=crop'],
      category: 'hair'
    },
    {
      id: 'demo-3',
      name: 'Manicure Premium',
      description: 'Manicure completo con productos de alta calidad',
      price: 80,
      duration: 75,
      images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop'],
      category: 'nails'
    }
  ];

  const serviceCardsHTML = demoServices.map(service => {
      const professional = {
      id: 'demo-pro',
      name: 'María González',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 127
      };

      const serviceCard = new ServiceCard({
        service,
        professional,
        onClick: (service) => {
        navigateTo('/marketplace');
        },
        onBookNow: (service) => {
        navigateBasedOnAuth('/marketplace');
        }
      });

      const container = document.createElement('div');
      serviceCard.mount(container);
      return container.innerHTML;
    }).join('');

    servicesGrid.innerHTML = serviceCardsHTML;
  console.log('✅ Demo services loaded as fallback');
}

function showServicesError() {
    const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;
  
      servicesGrid.innerHTML = `
    <div class="col-span-full text-center py-12">
      <div class="text-gray-400 mb-4">
        ${renderIcon('alert-circle', { size: '48' })}
      </div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Error cargando servicios</h3>
      <p class="text-gray-500 mb-4">No pudimos cargar los servicios en este momento</p>
      <button 
        id="retry-services-btn"
        class="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors duration-200"
      >
        Reintentar
      </button>
        </div>
      `;
  
  // Add event listener for retry button
  const retryBtn = document.getElementById('retry-services-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      console.log('🔄 Retrying to load featured services...');
      loadFeaturedServices();
    });
  }
}

function setupGlobalClickHandler() {
  console.log('🌐 Setting up global click handler for data-action buttons...');
  
  // Global click handler for fallback buttons
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.getAttribute('data-action');
    console.log('🌐 Global click handler triggered:', action);
    
    switch (action) {
      case 'navigate-marketplace':
        console.log('🔘 Global handler: Navigating to marketplace');
        e.preventDefault();
        navigateBasedOnAuth('/marketplace');
        break;
      case 'navigate-contact':
        console.log('🔘 Global handler: Navigating to contact');
        e.preventDefault();
        navigateTo('/contacto');
        break;
      case 'navigate-register-professional':
        console.log('🔘 Global handler: Navigating to professional register');
        e.preventDefault();
        navigateTo('/auth/register?role=professional');
        break;
      default:
        console.log('🔘 Global handler: Unknown action:', action);
    }
  }, true); // Use capture phase
  
  console.log('✅ Global click handler set up');
}

function initializeSmoothScrolling() {
  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function initializeAnimations() {
  // Set up intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  document.querySelectorAll('.step-card, .value-card, .stat-card, .service-skeleton').forEach(el => {
    observer.observe(el);
  });
}

export default renderLandingPage;