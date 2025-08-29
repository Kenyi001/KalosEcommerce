/**
 * Landing Page - Enhanced marketing page using Kalos Design System
 * Modern landing page with component-based architecture
 */

import { MainLayout } from '../components/templates/PageLayout/PageLayout.js';
import './Landing.css';
import { Button } from '../components/atoms/Button/Button.js';
import { Heading, Paragraph } from '../components/atoms/Typography/Typography.js';
import { ServiceCard } from '../components/molecules/Card/Card.js';
import { Skeleton } from '../components/atoms/Loading/Loading.js';
import { renderIcon } from '../components/atoms/Icon/Icon.js';
import { navigateTo } from '../utils/router.js';
import { authService } from '../services/auth.js';

export function renderLandingPage() {
  const content = `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero-section">
        ${renderHeroSection()}
      </section>

      <!-- Info Banner -->
      ${renderInfoBanner()}

      <!-- How It Works Section -->
      ${renderHowItWorksSection()}

      <!-- Featured Services Section -->
      <section class="featured-services-section" id="featured-services">
        ${renderFeaturedServicesSection()}
      </section>

      <!-- Value Proposition Section -->
      <section class="value-proposition-section">
        ${renderValuePropositionSection()}
      </section>

      <!-- For Professionals Section -->
      <section class="professionals-cta-section">
        ${renderProfessionalsCTASection()}
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        ${renderStatsSection()}
      </section>

      <!-- Final CTA Section -->
      <section class="final-cta-section">
        ${renderFinalCTASection()}
      </section>
    </div>
  `;

  const layout = new MainLayout({
    title: 'Kalos - Belleza a Domicilio en Bolivia | Plataforma Líder',
    description: 'La plataforma líder de servicios de belleza a domicilio en Bolivia. Conecta con profesionales verificados y disfruta servicios de calidad en tu hogar.',
    showHeader: true,
    showFooter: true,
    containerSize: 'full',
    children: content,
    className: 'landing-layout'
  });

  return layout.render();
}

function renderHeroSection() {
  return `
    <div class="hero-container">
      <div class="hero-background">
        <div class="hero-gradient"></div>
        <div class="hero-decorations">
          <div class="decoration decoration-1">${renderIcon('sparkles', { size: '48' })}</div>
          <div class="decoration decoration-2">${renderIcon('heart', { size: '36' })}</div>
          <div class="decoration decoration-3">${renderIcon('star', { size: '24' })}</div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Servicios de belleza a domicilio
          </h1>
          
          <p class="hero-subtitle">
            Reserva con profesionales verificados. El pago es directo con el profesional tras confirmar tu reserva. Operamos primero en Santa Cruz.
          </p>
          
          <div class="hero-features">
            <div class="feature-item">
              <div class="feature-icon">${renderIcon('shield-check', { size: '20' })}</div>
              <span>Profesionales verificados</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">${renderIcon('credit-card', { size: '20' })}</div>
              <span>Pago directo con el profesional</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">${renderIcon('map-pin', { size: '20' })}</div>
              <span>Cobertura: Santa Cruz (piloto)</span>
            </div>
          </div>
        </div>
        
        <div class="hero-actions">
          <div id="hero-primary-btn"></div>
          <div id="hero-secondary-btn"></div>
        </div>
        
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">Profesionales</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">2K+</div>
            <div class="stat-label">Clientes</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">4.9</div>
            <div class="stat-label">Calificación</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderInfoBanner() {
  return `
    <section class="info-banner" aria-label="Información importante">
      <div class="info-container">
        <ul class="info-list">
          <li class="info-item">
            <div class="info-icon">${renderIcon('check-circle', { size: '16' })}</div>
            <span>Sin pasarela de pago por ahora: paga directo al profesional</span>
          </li>
          <li class="info-item">
            <div class="info-icon">${renderIcon('check-circle', { size: '16' })}</div>
            <span>La reserva se activa cuando el profesional confirma</span>
          </li>
          <li class="info-item">
            <div class="info-icon">${renderIcon('check-circle', { size: '16' })}</div>
            <span>Cobertura inicial: Santa Cruz; más ciudades pronto</span>
          </li>
        </ul>
      </div>
    </section>
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
    <section id="how-it-works" class="how-it-works">
      <div class="how-it-works-container">
        <div class="section-header">
          <h2 class="section-title">Cómo funciona</h2>
          <p class="section-subtitle">
            Proceso simple y transparente para reservar tu servicio
          </p>
        </div>
        
        <ol class="steps-list">
          ${steps.map((step, index) => `
            <li class="step-item" data-step="${index + 1}">
              <div class="step-number">${index + 1}</div>
              <div class="step-icon">
                ${renderIcon(step.icon, { size: '32' })}
              </div>
              <h3 class="step-title">${step.title}</h3>
              <p class="step-description">${step.description}</p>
            </li>
          `).join('')}
        </ol>
      </div>
    </section>
  `;
}

function renderFeaturedServicesSection() {
  return `
    <div class="featured-services-container">
      <div class="section-header">
        <h2 class="section-title">Servicios Populares</h2>
        <p class="section-subtitle">
          Los servicios más solicitados por nuestros clientes
        </p>
      </div>
      
      <div class="services-grid" id="services-grid">
        ${renderServiceSkeletons()}
      </div>
      
      <div class="services-cta">
        <div id="view-all-services-btn"></div>
      </div>
    </div>
  `;
}

function renderServiceSkeletons() {
  return Array(6).fill().map(() => `
    <div class="service-skeleton">
      <div class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-line-title"></div>
          <div class="skeleton-line skeleton-line-subtitle"></div>
          <div class="skeleton-line skeleton-line-price"></div>
          <div class="skeleton-actions">
            <div class="skeleton-button"></div>
            <div class="skeleton-button skeleton-button-primary"></div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderValuePropositionSection() {
  const values = [
    {
      icon: 'shield-check',
      title: 'Verificación Total',
      description: 'Todos nuestros profesionales pasan por verificación de identidad, credenciales y antecedentes penales.',
      color: 'green'
    },
    {
      icon: 'star',
      title: 'Calidad Garantizada',
      description: 'Sistema de reseñas, seguimiento de calidad y garantía de satisfacción en todos los servicios.',
      color: 'yellow'
    },
    {
      icon: 'credit-card',
      title: 'Pagos Seguros',
      description: 'Transacciones protegidas, múltiples métodos de pago y reembolsos automáticos si algo sale mal.',
      color: 'blue'
    },
    {
      icon: 'clock',
      title: 'Disponibilidad Total',
      description: 'Servicios disponibles 7 días a la semana. Reservas de emergencia y servicios de último minuto.',
      color: 'purple'
    },
    {
      icon: 'map-pin',
      title: 'Cobertura Nacional',
      description: 'Presente en todos los departamentos de Bolivia con profesionales locales certificados.',
      color: 'red'
    },
    {
      icon: 'headphones',
      title: 'Soporte 24/7',
      description: 'Atención al cliente disponible siempre. Chat en vivo, WhatsApp y línea telefónica dedicada.',
      color: 'indigo'
    }
  ];

  return `
    <div class="value-proposition-container">
      <div class="section-header">
        <h2 class="section-title">¿Por Qué Elegir Kalos?</h2>
        <p class="section-subtitle">
          La plataforma más confiable y completa de servicios de belleza en Bolivia
        </p>
      </div>
      
      <div class="values-grid">
        ${values.map(value => `
          <div class="value-card">
            <div class="value-icon value-icon-${value.color}">
              ${renderIcon(value.icon, { size: '24' })}
            </div>
            <h3 class="value-title">${value.title}</h3>
            <p class="value-description">${value.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderProfessionalsCTASection() {
  const benefits = [
    'Sin costos de afiliación iniciales',
    'Comisiones competitivas del mercado',
    'Herramientas de gestión incluidas',
    'Pagos semanales garantizados',
    'Capacitación y certificación',
    'Soporte técnico especializado'
  ];

  return `
    <div class="professionals-cta-container">
      <div class="professionals-content">
        <div class="professionals-text">
          <h2 class="professionals-title">
            ¿Eres Profesional de Belleza?
          </h2>
          <p class="professionals-subtitle">
            Únete a la red de profesionales más exitosa de Bolivia. 
            Amplía tu clientela, gestiona tu agenda y aumenta tus ingresos de manera consistente.
          </p>
          
          <div class="benefits-list">
            ${benefits.map(benefit => `
              <div class="benefit-item">
                <div class="benefit-check">
                  ${renderIcon('check', { size: '16' })}
                </div>
                <span class="benefit-text">${benefit}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="professionals-actions">
            <div id="join-professional-btn"></div>
            <div id="learn-more-pro-btn"></div>
          </div>
        </div>
        
        <div class="professionals-visual">
          <div class="visual-card">
            <div class="visual-icon">
              ${renderIcon('briefcase', { size: '64' })}
            </div>
            <h3 class="visual-title">¡Comienza Hoy!</h3>
            <p class="visual-description">
              Registro simple, verificación rápida y comienza a recibir clientes en 48 horas
            </p>
            <div class="visual-stats">
              <div class="visual-stat">
                <div class="stat-value">$2,500</div>
                <div class="stat-label">Ingreso promedio mensual</div>
              </div>
            </div>
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
    <div class="stats-container">
      <div class="stats-content">
        <div class="stats-header">
          <h2 class="stats-title">Creciendo Juntos en Bolivia</h2>
          <p class="stats-subtitle">
            Miles de bolivianos ya confían en Kalos para sus servicios de belleza
          </p>
        </div>
        
        <div class="stats-grid">
          ${stats.map(stat => `
            <div class="stat-card">
              <div class="stat-icon">
                ${renderIcon(stat.icon, { size: '28' })}
              </div>
              <div class="stat-value">${stat.value}</div>
              <div class="stat-label">${stat.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderFinalCTASection() {
  return `
    <div class="final-cta-container">
      <div class="final-cta-content">
        <h2 class="final-cta-title">
          ¿Listo para la Experiencia Kalos?
        </h2>
        <p class="final-cta-subtitle">
          Únete a miles de bolivianos que ya disfrutan de servicios de belleza 
          profesionales en la comodidad de su hogar
        </p>
        
        <div class="final-cta-actions">
          <div id="final-cta-primary-btn"></div>
          <div id="final-cta-secondary-btn"></div>
        </div>
        
        <div class="final-cta-guarantee">
          <div class="guarantee-icon">
            ${renderIcon('shield-check', { size: '24' })}
          </div>
          <span>Garantía de satisfacción al 100% o devolvemos tu dinero</span>
        </div>
      </div>
    </div>
  `;
}

export function initializeLandingPage() {
  // Initialize layout
  const layout = document.querySelector('[data-component="main-layout"]');
  if (layout) {
    // Layout is already initialized by MainLayout component
  }

  // Initialize all buttons with actual component instances
  initializeButtons();
  
  // Load featured services
  loadFeaturedServices();

  // Set up smooth scrolling
  initializeSmoothScrolling();

  // Set up intersection observer for animations
  initializeAnimations();
}

function initializeButtons() {
  // Hero section buttons
  const heroPrimaryBtn = new Button({
    variant: 'primary',
    size: 'lg',
    children: `
      ${renderIcon('search', { size: '20' })}
      Explorar servicios
    `,
    'data-router-link': true,
    'data-href': '/marketplace',
    'aria-label': 'Explorar servicios',
    onClick: () => navigateBasedOnAuth('/marketplace')
  });
  
  const heroSecondaryBtn = new Button({
    variant: 'ghost',
    size: 'lg',
    children: `
      ${renderIcon('play-circle', { size: '20' })}
      Cómo funciona
    `,
    id: 'open-how-it-works',
    'aria-label': 'Cómo funciona',
    onClick: (e) => {
      e.preventDefault();
      const howItWorksSection = document.getElementById('how-it-works');
      if (howItWorksSection) {
        howItWorksSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Mount hero buttons
  const heroPrimaryContainer = document.getElementById('hero-primary-btn');
  const heroSecondaryContainer = document.getElementById('hero-secondary-btn');
  
  if (heroPrimaryContainer) heroPrimaryBtn.mount(heroPrimaryContainer);
  if (heroSecondaryContainer) heroSecondaryBtn.mount(heroSecondaryContainer);

  // View all services button
  const viewAllServicesBtn = new Button({
    variant: 'primary',
    size: 'lg',
    children: `
      Ver Todos los Servicios
      ${renderIcon('arrow-right', { size: '20' })}
    `,
    onClick: () => navigateBasedOnAuth('/marketplace')
  });

  const viewAllContainer = document.getElementById('view-all-services-btn');
  if (viewAllContainer) viewAllServicesBtn.mount(viewAllContainer);

  // Professional CTA buttons
  const joinProfessionalBtn = new Button({
    variant: 'primary',
    size: 'lg',
    children: `
      ${renderIcon('user-plus', { size: '20' })}
      Únete como Profesional
    `,
    onClick: () => navigateTo('/auth/register?role=professional')
  });

  const learnMoreProBtn = new Button({
    variant: 'ghost',
    size: 'md',
    children: `
      Conocer Más
      ${renderIcon('arrow-right', { size: '16' })}
    `,
    onClick: () => navigateTo('/profesionales/info')
  });

  const joinProfessionalContainer = document.getElementById('join-professional-btn');
  const learnMoreProContainer = document.getElementById('learn-more-pro-btn');
  
  if (joinProfessionalContainer) joinProfessionalBtn.mount(joinProfessionalContainer);
  if (learnMoreProContainer) learnMoreProBtn.mount(learnMoreProContainer);

  // Final CTA buttons
  const finalCtaPrimaryBtn = new Button({
    variant: 'primary',
    size: 'xl',
    children: `
      ${renderIcon('rocket', { size: '24' })}
      Comenzar Ahora
    `,
    onClick: () => navigateBasedOnAuth('/marketplace')
  });

  const finalCtaSecondaryBtn = new Button({
    variant: 'secondary',
    size: 'lg',
    children: `
      ${renderIcon('message-circle', { size: '20' })}
      Contactar
    `,
    onClick: () => navigateTo('/contacto')
  });

  const finalCtaPrimaryContainer = document.getElementById('final-cta-primary-btn');
  const finalCtaSecondaryContainer = document.getElementById('final-cta-secondary-btn');
  
  if (finalCtaPrimaryContainer) finalCtaPrimaryBtn.mount(finalCtaPrimaryContainer);
  if (finalCtaSecondaryContainer) finalCtaSecondaryBtn.mount(finalCtaSecondaryContainer);
}

async function navigateBasedOnAuth(defaultPath) {
  try {
    const { user, profile } = await authService.waitForAuth();
    
    if (user && profile) {
      if (profile.activeRole === 'professional') {
        navigateTo('/pro/dashboard');
      } else {
        navigateTo(defaultPath);
      }
    } else {
      navigateTo(defaultPath);
    }
  } catch (error) {
    console.error('Error checking auth state:', error);
    navigateTo(defaultPath);
  }
}

async function loadFeaturedServices() {
  try {
    // Simulate loading featured services
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

    // Mock featured services data
    const featuredServices = [
      {
        id: '1',
        name: 'Manicure y Pedicure Premium',
        description: 'Servicio completo de manicure y pedicure con productos de alta gama',
        price: 120,
        duration: 90,
        images: ['/placeholder-manicure.jpg'],
        category: 'nails'
      },
      {
        id: '2',
        name: 'Corte y Peinado Profesional',
        description: 'Corte personalizado y peinado profesional en tu hogar',
        price: 80,
        duration: 60,
        images: ['/placeholder-hair.jpg'],
        category: 'hair'
      },
      {
        id: '3',
        name: 'Maquillaje Social',
        description: 'Maquillaje para eventos sociales y ocasiones especiales',
        price: 100,
        duration: 45,
        images: ['/placeholder-makeup.jpg'],
        category: 'makeup'
      },
      {
        id: '4',
        name: 'Tratamiento Facial Hidratante',
        description: 'Limpieza facial profunda y tratamiento hidratante',
        price: 150,
        duration: 75,
        images: ['/placeholder-skincare.jpg'],
        category: 'skincare'
      },
      {
        id: '5',
        name: 'Masaje Relajante',
        description: 'Masaje corporal relajante con aceites aromáticos',
        price: 180,
        duration: 90,
        images: ['/placeholder-massage.jpg'],
        category: 'massage'
      },
      {
        id: '6',
        name: 'Depilación con Cera',
        description: 'Servicio completo de depilación con cera de calidad',
        price: 60,
        duration: 45,
        images: ['/placeholder-waxing.jpg'],
        category: 'skincare'
      }
    ];

    // Create service cards
    const serviceCardsHTML = featuredServices.map(service => {
      const professional = {
        id: 'pro-' + service.id,
        name: `Profesional ${service.category}`,
        avatar: '/placeholder-avatar.jpg',
        rating: 4.8 + Math.random() * 0.2,
        reviewCount: Math.floor(Math.random() * 50) + 10
      };

      const serviceCard = new ServiceCard({
        service,
        professional,
        onClick: (service) => {
          navigateTo(`/servicios/${service.id}`);
        },
        onBookNow: (service) => {
          navigateBasedOnAuth(`/reservar/${service.id}`);
        }
      });

      const container = document.createElement('div');
      serviceCard.mount(container);
      return container.innerHTML;
    }).join('');

    servicesGrid.innerHTML = serviceCardsHTML;

  } catch (error) {
    console.error('Error loading featured services:', error);
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid) {
      servicesGrid.innerHTML = `
        <div class="services-error">
          <p>Error cargando servicios. <button onclick="loadFeaturedServices()">Reintentar</button></p>
        </div>
      `;
    }
  }
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