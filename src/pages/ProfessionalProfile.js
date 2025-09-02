/**
 * Professional Profile Page - Public profile for professionals
 * Route: /pro/:handle
 * Shows professional's portfolio, services, reviews, and booking options
 */

import { renderWithLayout, initializeLayout } from '../components/Layout.js';
import { Button } from '../components/atoms/Button/Button.js';
import { Heading, Paragraph } from '../components/atoms/Typography/Typography.js';
import { ServiceCard, ReviewCard } from '../components/molecules/Card/Card.js';
import { Skeleton } from '../components/atoms/Loading/Loading.js';
import { renderIcon } from '../components/atoms/Icon/Icon.js';
import { ChatModal } from '../components/molecules/Chat/ChatModal.js';
import { ServiceDetailsModal } from '../components/molecules/ServiceDetails/ServiceDetailsModal.js';
import { navigateTo } from '../utils/router.js';
import { authService } from '../services/auth.js';
import { professionalService } from '../services/professionals.js';
import { servicesService } from '../services/services.js';
import { AvailabilityService } from '../services/availability.js';

// Global variables
let currentProfessionalData = null;
let chatModal = null;
let serviceDetailsModal = null;

export function renderProfessionalProfilePage(handle) {
  const content = `
    <div class="min-h-screen bg-white" data-handle="${handle}">
      <!-- Loading State -->
      <div id="profile-loading" class="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600 font-medium">Cargando perfil profesional...</p>
        </div>
      </div>

      <!-- Profile Content (hidden initially) -->
      <div id="profile-content" style="display: none;">
        <!-- Professional Header -->
        ${renderProfessionalHeader()}

        <!-- Services Section -->
        ${renderServicesSection()}

        <!-- Portfolio Gallery -->
        <section id="portfolio-section">
          ${renderPortfolioSection()}
        </section>

        <!-- Reviews Section -->
        ${renderReviewsSection()}

        <!-- Contact CTA Section -->
        ${renderContactSection()}
      </div>

      <!-- Error State -->
      <div id="profile-error" class="fixed inset-0 bg-white flex items-center justify-center z-50" style="display: none;">
        <div class="max-w-md mx-auto text-center px-6">
          <div class="w-20 h-20 mx-auto mb-6 text-gray-400">
            ${renderIcon('user-x', { size: '80' })}
          </div>
          <h2 class="text-2xl font-display font-bold text-gray-900 mb-4">Profesional no encontrado</h2>
          <p class="text-gray-600 mb-8 leading-relaxed">
            Lo sentimos, no pudimos encontrar el perfil del profesional que buscas.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <div id="back-to-marketplace-btn"></div>
            <div id="search-professionals-btn"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  return renderWithLayout(content, {
    showHeader: true,
    showFooter: true,
    containerClass: 'min-h-screen flex flex-col professional-profile-layout'
  });
}

function renderProfessionalHeader() {
  return `
    <section class="bg-gradient-to-r from-brand to-navy text-white py-16">
      <div class="max-w-4xl mx-auto px-6">
        <div class="flex flex-col lg:flex-row items-center gap-8">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl" id="professional-avatar">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face" 
                alt="Profesional" 
                class="w-full h-full object-cover"
                id="avatar-image"
              />
            </div>
          </div>
          
          <!-- Info -->
          <div class="flex-1 text-center lg:text-left space-y-4">
            <div class="space-y-2">
              <h1 class="text-3xl lg:text-4xl font-display font-bold text-white" id="professional-name">
                María González
              </h1>
              <p class="text-lg text-white/90" id="professional-specialty">
                Especialista en Maquillaje y Peinado
              </p>
              <div class="flex items-center justify-center lg:justify-start gap-2 text-white/80" id="professional-location">
                ${renderIcon('map-pin', { size: '16' })}
                <span>Santa Cruz, Bolivia</span>
              </div>
              <div class="inline-flex items-center gap-2 bg-success/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium" id="verification-badge">
                ${renderIcon('check-circle', { size: '16' })}
                <span>Verificado</span>
              </div>
            </div>
            
            <!-- Stats compactas -->
            <div class="flex items-center justify-center lg:justify-start gap-6 text-sm">
              <div class="flex items-center gap-1" id="rating-value">
                ${renderIcon('star', { size: '16' })}
                <span class="font-semibold">4.8</span>
                <span class="text-white/70">(127 reseñas)</span>
              </div>
              <div class="flex items-center gap-1">
                ${renderIcon('briefcase', { size: '16' })}
                <span class="font-semibold" id="services-count">12 servicios</span>
              </div>
              <div class="flex items-center gap-1">
                ${renderIcon('clock', { size: '16' })}
                <span class="font-semibold" id="experience-years">5+ años</span>
              </div>
            </div>
            
            <!-- Bio breve -->
            <p class="text-white/90 text-sm max-w-lg" id="professional-bio">
              Especialista certificada en maquillaje y peinado. Trabajo con productos premium y me especializo en novias y eventos especiales.
            </p>
            
            <!-- Botones -->
            <div class="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button class="bg-white text-brand hover:bg-gray-50 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2" id="contact-professional-btn">
                ${renderIcon('message-circle', { size: '18' })}
                Contactar
              </button>
              <button class="border border-white/30 text-white hover:bg-white/10 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2" id="view-availability-btn">
                ${renderIcon('calendar', { size: '18' })}
                Disponibilidad
              </button>
              <button class="border border-white/30 text-white hover:bg-white/10 px-3 py-2 rounded-lg font-semibold transition-colors" id="share-profile-btn">
                ${renderIcon('share-2', { size: '18' })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderServicesSection() {
  return `
    <section class="py-16 bg-gray-50" id="services-section">
      <div class="max-w-6xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">Servicios Disponibles</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre todos los servicios que ofrece este profesional
          </p>
        </div>
        
        <!-- Services Filters -->
        <div class="mb-8" id="services-filters">
          <div class="flex flex-wrap gap-3 justify-center">
            <button class="px-6 py-3 bg-brand text-white rounded-full font-semibold transition-all duration-200 hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/50 filter-btn active" data-category="all">
              Todos
            </button>
            <button class="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-brand focus:outline-none focus:ring-2 focus:ring-brand/50 filter-btn" data-category="makeup">
              Maquillaje
            </button>
            <button class="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-brand focus:outline-none focus:ring-2 focus:ring-brand/50 filter-btn" data-category="hair">
              Cabello
            </button>
            <button class="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-brand focus:outline-none focus:ring-2 focus:ring-brand/50 filter-btn" data-category="nails">
              Uñas
            </button>
            <button class="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-brand focus:outline-none focus:ring-2 focus:ring-brand/50 filter-btn" data-category="skincare">
              Cuidado facial
            </button>
          </div>
        </div>
        
        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" id="services-grid">
          <!-- Services will be loaded dynamically -->
          ${renderServicesSkeletons()}
        </div>
        
        <!-- Services CTA -->
        <div class="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 class="text-2xl font-display font-bold text-gray-900 mb-4">¿No encuentras lo que buscas?</h3>
          <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
            Cuéntale al profesional qué necesitas. Quizás pueda crear un servicio personalizado para ti o agregarlo a su catálogo.
          </p>
          <div id="book-consultation-btn"></div>
          <p class="text-sm text-gray-500 mt-4">
            💡 Tu mensaje llegará marcado como "solicitud de servicio personalizado"
          </p>
        </div>
      </div>
    </section>
  `;
}

function renderPortfolioSection() {
  return `
    <section class="py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">Portfolio</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Mira algunos trabajos recientes de este profesional
          </p>
        </div>
        
        <!-- Portfolio Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8" id="portfolio-grid">
          <!-- Portfolio items will be loaded dynamically -->
          ${renderPortfolioSkeletons()}
        </div>
        
        <!-- Chat Modal Container -->
        <div id="chat-modal-container"></div>
        
        <!-- Service Details Modal Container -->
        <div id="service-details-modal-container"></div>
        
        <!-- Portfolio Lightbox -->
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="portfolio-lightbox" style="display: none;">
          <div class="relative max-w-4xl max-h-full w-full">
            <!-- Close Button -->
            <button class="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors duration-200 lightbox-close" aria-label="Cerrar">
              ${renderIcon('x', { size: '24' })}
            </button>
            
            <!-- Image Container -->
            <div class="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div class="relative">
                <img class="w-full h-auto max-h-[70vh] object-contain lightbox-image" src="" alt="" />
                
                <!-- Navigation Buttons -->
                <button class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-200 lightbox-prev" aria-label="Anterior">
                  ${renderIcon('chevron-left', { size: '24' })}
                </button>
                <button class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-200 lightbox-next" aria-label="Siguiente">
                  ${renderIcon('chevron-right', { size: '24' })}
                </button>
              </div>
              
              <!-- Image Info -->
              <div class="p-6">
                <h3 class="text-xl font-display font-bold text-gray-900 mb-2 lightbox-title"></h3>
                <p class="text-gray-600 lightbox-description"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderReviewsSection() {
  return `
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">Reseñas y Testimonios</h2>
          <div class="flex items-center justify-center gap-4" id="reviews-summary">
            <div class="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <!-- Reviews Stats -->
        <div class="mb-12" id="reviews-stats">
          ${renderReviewsStatsSkeletons()}
        </div>
        
        <!-- Reviews List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" id="reviews-list">
          <!-- Reviews will be loaded dynamically -->
          ${renderReviewsSkeletons()}
        </div>
        
        <!-- Reviews Pagination -->
        <div class="flex justify-center" id="reviews-pagination">
          <!-- Pagination will be added if needed -->
        </div>
      </div>
    </section>
  `;
}

function renderContactSection() {
  return `
    <div class="bg-gradient-to-br from-brand to-navy text-white py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Contact Info -->
          <div class="space-y-8">
            <div class="space-y-4">
              <h2 class="text-3xl lg:text-4xl font-display font-bold text-white">¿Listo para reservar?</h2>
              <p class="text-xl text-white/90 leading-relaxed">
                Contacta con este profesional para coordinar tu servicio de belleza a domicilio
              </p>
            </div>
            
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  ${renderIcon('calendar', { size: '24' })}
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-1">Agenda flexible</h4>
                  <p class="text-white/80">Horarios disponibles de lunes a domingo</p>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  ${renderIcon('map-pin', { size: '24' })}
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-1">Servicio a domicilio</h4>
                  <p class="text-white/80">El profesional va hasta tu ubicación</p>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  ${renderIcon('shield-check', { size: '24' })}
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-white mb-1">Profesional verificado</h4>
                  <p class="text-white/80">Identidad y credenciales confirmadas</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contact Actions -->
          <div class="space-y-6">
            <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div class="text-center mb-6">
                <h3 class="text-2xl font-semibold text-white mb-2">¿Listo para comenzar?</h3>
                <p class="text-white/80 text-sm">Explora servicios o consulta directamente</p>
              </div>
              <div class="space-y-4">
                <div id="book-service-btn"></div>
                <div class="relative">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-white/20"></div>
                  </div>
                  <div class="relative flex justify-center text-sm">
                    <span class="px-3 bg-gradient-to-r from-brand to-navy text-white/60 text-xs">o</span>
                  </div>
                </div>
                <div id="send-message-btn"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Skeleton loading components
function renderServicesSkeletons() {
  return Array(6).fill().map(() => `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div class="h-48 bg-gray-200"></div>
      <div class="p-6 space-y-4">
        <div class="space-y-3">
          <div class="h-6 w-3/4 bg-gray-200 rounded"></div>
          <div class="h-4 w-full bg-gray-200 rounded"></div>
          <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="h-6 w-20 bg-gray-200 rounded"></div>
          <div class="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div class="flex gap-3 pt-2 border-t border-gray-100">
          <div class="h-8 w-24 bg-gray-200 rounded"></div>
          <div class="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPortfolioSkeletons() {
  return Array(8).fill().map(() => `
    <div class="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
  `).join('');
}

function renderReviewsStatsSkeletons() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div class="text-center">
        <div class="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
        <div class="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
      </div>
      <div class="text-center">
        <div class="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
        <div class="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
      </div>
      <div class="text-center">
        <div class="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
        <div class="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
      </div>
    </div>
  `;
}

function renderReviewsSkeletons() {
  return Array(6).fill().map(() => `
    <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6 animate-pulse">
      <div class="flex items-start gap-4 mb-4">
        <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div class="flex-1">
          <div class="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
        <div class="flex gap-1">
          ${Array(5).fill().map(() => '<div class="w-4 h-4 bg-gray-200 rounded"></div>').join('')}
        </div>
      </div>
      <div class="space-y-2">
        <div class="h-4 w-full bg-gray-200 rounded"></div>
        <div class="h-4 w-full bg-gray-200 rounded"></div>
        <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    </div>
  `).join('');
}

export function initializeProfessionalProfilePage(handle) {
  console.log(`🏗️ Initializing Professional Profile Page for handle: ${handle}`);
  
  // Avatar is now directly visible with Tailwind classes
  
  // Initialize layout with header functionality
  initializeLayout();

  // Initialize buttons
  initializeButtons();
  
  // Load professional data
  loadProfessionalData(handle);
  
  // Set up scroll animations
  initializeScrollAnimations();
  
  // Initialize chat system
  initializeChatSystem();
  
  // Update meta tags for SEO
  updateMetaTags(handle);
}

// Function removed - using Tailwind classes for immediate visibility

function initializeButtons() {
  // Error state buttons
  const backToMarketplaceBtn = new Button({
    variant: 'ghost',
    size: 'lg',
    children: `
      ${renderIcon('arrow-left', { size: '20' })}
      Volver al marketplace
    `,
    onClick: () => navigateTo('/marketplace')
  });

  const searchProfessionalsBtn = new Button({
    variant: 'primary',
    size: 'lg',
    children: `
      ${renderIcon('search', { size: '20' })}
      Buscar profesionales
    `,
    onClick: () => navigateTo('/professionals')
  });

  // Mount error buttons
  const backContainer = document.getElementById('back-to-marketplace-btn');
  const searchContainer = document.getElementById('search-professionals-btn');
  
  if (backContainer) backToMarketplaceBtn.mount(backContainer);
  if (searchContainer) searchProfessionalsBtn.mount(searchContainer);

  // Profile action buttons (will be initialized after data loads)
  // These will be created dynamically in loadProfessionalData
}

async function loadProfessionalData(handle) {
  try {
    // Show loading state
    showLoadingState();
    
    // Simulate API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock professional data
    const professionalData = {
      id: 'prof-' + handle,
      handle: handle,
      name: 'María González',
      specialty: 'Especialista en Maquillaje y Peinado',
      location: 'Santa Cruz, Bolivia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      verified: true,
      rating: 4.8,
      reviewsCount: 127,
      servicesCount: 12,
      experienceYears: 5,
      bio: 'Profesional certificada en maquillaje y peinado con más de 5 años de experiencia. Especializada en maquillaje para novias, eventos sociales y sesiones fotográficas. Trabajo con productos de alta calidad y me apasiona realzar la belleza natural de cada cliente.',
      socialMedia: {
        instagram: 'https://instagram.com/maria_makeup_bo',
        facebook: 'https://facebook.com/MariaGonzalezMakeup',
        whatsapp: 'https://wa.me/59177123456',
        tiktok: 'https://tiktok.com/@maria_beauty'
      },
      services: [
        {
          id: 'service-1',
          name: 'Maquillaje de Novia',
          description: 'Maquillaje completo para el día más especial, incluye prueba previa',
          price: 350,
          duration: 120,
          category: 'makeup',
          images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=300&fit=crop']
        },
        {
          id: 'service-2',
          name: 'Peinado para Evento',
          description: 'Peinado elegante y duradero para eventos especiales',
          price: 180,
          duration: 90,
          category: 'hair',
          images: ['https://images.unsplash.com/photo-1560869713-bf165a7c7e8b?w=500&h=300&fit=crop']
        },
        {
          id: 'service-3',
          name: 'Maquillaje Social',
          description: 'Maquillaje para fiestas, reuniones y eventos sociales',
          price: 150,
          duration: 60,
          category: 'makeup',
          images: ['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&h=300&fit=crop']
        },
        {
          id: 'service-4',
          name: 'Tratamiento Facial',
          description: 'Limpieza facial profunda con productos naturales',
          price: 200,
          duration: 75,
          category: 'skincare',
          images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&h=300&fit=crop']
        },
        {
          id: 'service-5',
          name: 'Manicure Gel',
          description: 'Manicure completo con esmaltado en gel de larga duración',
          price: 80,
          duration: 45,
          category: 'nails',
          images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=300&fit=crop']
        },
        {
          id: 'service-6',
          name: 'Pedicure Spa',
          description: 'Pedicure relajante con exfoliación y masaje',
          price: 90,
          duration: 60,
          category: 'nails',
          images: ['https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&h=300&fit=crop']
        }
      ],
      portfolio: [
        {
          id: 'portfolio-1',
          title: 'Maquillaje de Novia - Ana',
          description: 'Look natural y elegante para boda en jardín',
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
          category: 'makeup'
        },
        {
          id: 'portfolio-2',
          title: 'Peinado Vintage - Carmen',
          description: 'Estilo retro para evento temático',
          image: 'https://images.unsplash.com/photo-1560869713-bf165a7c7e8b?w=400&h=400&fit=crop',
          category: 'hair'
        },
        {
          id: 'portfolio-3',
          title: 'Maquillaje Dramático - Sofía',
          description: 'Look intenso para sesión fotográfica',
          image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop',
          category: 'makeup'
        },
        {
          id: 'portfolio-4',
          title: 'Nail Art Floral - Lucía',
          description: 'Diseño personalizado con motivos florales',
          image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop',
          category: 'nails'
        },
        {
          id: 'portfolio-5',
          title: 'Maquillaje Artístico - Elena',
          description: 'Maquillaje creativo para sesión de moda',
          image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop',
          category: 'makeup'
        },
        {
          id: 'portfolio-6',
          title: 'Peinado Elegante - Isabella',
          description: 'Recogido sofisticado para gala',
          image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop',
          category: 'hair'
        }
      ],
      reviews: [
        {
          id: 'review-1',
          customerName: 'Ana Rodríguez',
          customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          comment: 'Excelente profesional! El maquillaje de mi boda quedó perfecto y duró todo el día. Muy recomendada.',
          service: 'Maquillaje de Novia',
          date: '2024-01-15',
          verified: true
        },
        {
          id: 'review-2',
          customerName: 'Carmen Vásquez',
          customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          comment: 'María es increíble! Llegó puntual, fue muy profesional y el resultado superó mis expectativas.',
          service: 'Peinado para Evento',
          date: '2024-01-10',
          verified: true
        },
        {
          id: 'review-3',
          customerName: 'Sofía Mendoza',
          customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
          rating: 4,
          comment: 'Muy buen servicio, el maquillaje quedó hermoso. Solo sugiero llegar un poco más temprano.',
          service: 'Maquillaje Social',
          date: '2024-01-08',
          verified: false
        },
        {
          id: 'review-4',
          customerName: 'Isabella Torres',
          customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          comment: 'Increíble trabajo! El peinado duró toda la noche sin problemas. Definitivamente la volveré a contratar.',
          service: 'Peinado para Evento',
          date: '2024-01-12',
          verified: true
        },
        {
          id: 'review-5',
          customerName: 'Lucía Morales',
          customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          comment: 'El tratamiento facial fue relajante y mi piel se veía radiante. Muy profesional en su trabajo.',
          service: 'Tratamiento Facial',
          date: '2024-01-05',
          verified: true
        }
      ]
    };

    // Store professional data globally for chat
    currentProfessionalData = professionalData;
    
    // Populate professional data
    populateProfessionalData(professionalData);
    
    // Load services
    loadServices(professionalData.services);
    
    // Load portfolio
    loadPortfolio(professionalData.portfolio);
    
    // Load reviews
    loadReviews(professionalData.reviews);
    
    // Initialize dynamic buttons
    initializeDynamicButtons(professionalData);
    

    
    // Hide loading and show content
    hideLoadingState();
    
  } catch (error) {
    console.error('Error loading professional data:', error);
    showErrorState();
  }
}

function populateProfessionalData(data) {
  console.log('🖼️ Populating professional data for:', data.name);
  console.log('🖼️ Avatar URL:', data.avatar);
  
  // Update page title and meta
  document.title = `${data.name} - Profesional de Belleza | Kalos`;
  
  // Populate avatar - simplificado ya que el avatar está hardcodeado en el HTML
  const avatarImg = document.getElementById('avatar-image');
  if (avatarImg && data.avatar) {
    console.log('🖼️ Setting avatar src to:', data.avatar);
    avatarImg.src = data.avatar;
    avatarImg.alt = data.name;
  }
  
  // Show verification badge
  if (data.verified) {
    const verificationBadge = document.getElementById('verification-badge');
    if (verificationBadge) {
      verificationBadge.style.display = 'flex';
    }
  }
  
  // Populate name and info
  const nameElement = document.getElementById('professional-name');
  if (nameElement) {
    nameElement.textContent = data.name;
  }
  
  const specialtyElement = document.getElementById('professional-specialty');
  if (specialtyElement) {
    specialtyElement.textContent = data.specialty;
  }
  
  const locationElement = document.getElementById('professional-location');
  if (locationElement) {
    locationElement.innerHTML = `
      ${renderIcon('map-pin', { size: '16' })}
      <span>${data.location}</span>
    `;
  }
  
  // Populate stats (nueva estructura compacta)
  const ratingElement = document.getElementById('rating-value');
  if (ratingElement) {
    const ratingNumber = ratingElement.querySelector('span.font-semibold');
    const reviewsText = ratingElement.querySelector('span.text-white\\/70');
    if (ratingNumber) ratingNumber.textContent = data.rating;
    if (reviewsText) reviewsText.textContent = `(${data.reviewsCount || data.reviewCount || 127} reseñas)`;
  }
  
  const servicesCountElement = document.getElementById('services-count');
  if (servicesCountElement) {
    servicesCountElement.textContent = `${data.servicesCount || data.services?.length || 12} servicios`;
  }
  
  const experienceElement = document.getElementById('experience-years');
  if (experienceElement) {
    experienceElement.textContent = `${data.experienceYears}+ años`;
  }
  
  // Populate bio (texto directo, sin HTML)
  const bioElement = document.getElementById('professional-bio');
  if (bioElement) {
    bioElement.textContent = data.bio || 'Especialista certificada en maquillaje y peinado. Trabajo con productos premium y me especializo en novias y eventos especiales.';
  }
}

function loadServices(services) {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;

  // Limpiar grid
  servicesGrid.innerHTML = '';

  services.forEach(service => {
    const professional = {
      id: 'current-professional',
      name: 'Profesional actual',
      avatar: '/images/professionals/current.jpg',
      rating: 4.8,
      reviewCount: 127
    };

    const serviceCard = new ServiceCard({
      service,
      professional,
      showProfessional: false, // Don't show professional info on their own profile
      onClick: (service) => {
        console.log('🔍 Service card clicked:', service.name);
        showServiceDetails(service);
      },
      onBookNow: (service) => {
        console.log('📅 Book now clicked:', service.name);
        navigateTo(`/booking/${service.id}`);
      }
    });

    // Crear container para cada service card
    const container = document.createElement('div');
    container.className = 'service-card-container';
    
    // Montar componente correctamente
    serviceCard.mount(container);
    
    // Agregar al grid
    servicesGrid.appendChild(container);
  });


  
  // Inicializar filtros después de cargar los servicios
  setTimeout(() => {
    initializeFilters();

  }, 100);
}

function loadPortfolio(portfolioItems) {
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (!portfolioGrid) return;

  const portfolioHTML = portfolioItems.map((item, index) => `
    <div class="portfolio-item group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300" data-index="${index}" data-portfolio-id="${item.id}">
      <img 
        src="${item.image}" 
        alt="${item.title}"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div class="text-center text-white p-4">
          <h4 class="font-display font-bold text-lg mb-2 text-white">${item.title}</h4>
          <p class="text-sm text-white/90 mb-4 line-clamp-2">${item.description}</p>
          <button class="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200" aria-label="Ver imagen completa">
            ${renderIcon('eye', { size: '24' })}
          </button>
        </div>
      </div>
    </div>
  `).join('');

  portfolioGrid.innerHTML = portfolioHTML;
  
  // Initialize lightbox after portfolio is loaded
  initializePortfolioLightbox();
}

function loadReviews(reviews) {
  // Update reviews summary in header
  const reviewsSummary = document.getElementById('reviews-summary');
  if (reviewsSummary) {
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    reviewsSummary.innerHTML = `
      <div class="flex items-center justify-center gap-3">
        <div class="flex items-center gap-1">
          ${renderStars(avgRating)}
        </div>
        <span class="text-lg font-semibold text-gray-900">${avgRating.toFixed(1)}</span>
        <span class="text-gray-500">•</span>
        <span class="text-lg text-gray-600">${reviews.length} reseñas</span>
      </div>
    `;
  }

  // Load reviews stats
  const reviewsStats = document.getElementById('reviews-stats');
  if (reviewsStats) {
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
      reviews.filter(review => review.rating === rating).length
    );

    reviewsStats.innerHTML = `
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <!-- Overall Rating -->
          <div class="text-center lg:text-left">
            <div class="flex items-center justify-center lg:justify-start gap-4 mb-4">
              <div class="text-5xl font-display font-bold text-gray-900">${avgRating.toFixed(1)}</div>
              <div>
                <div class="flex items-center gap-1 mb-1">
                  ${renderStars(avgRating)}
                </div>
                <div class="text-sm text-gray-600">${reviews.length} reseñas</div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-brand">${reviews.length}</div>
                <div class="text-xs text-gray-600 uppercase tracking-wide">Total</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-success">${Math.round((ratingCounts[0] + ratingCounts[1]) / reviews.length * 100)}%</div>
                <div class="text-xs text-gray-600 uppercase tracking-wide">Positivas</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-gold">${avgRating.toFixed(1)}</div>
                <div class="text-xs text-gray-600 uppercase tracking-wide">Promedio</div>
              </div>
            </div>
          </div>
          
          <!-- Rating Breakdown -->
          <div class="space-y-3">
            ${ratingCounts.map((count, index) => `
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1 min-w-[80px]">
                  <span class="text-sm font-medium text-gray-700">${5 - index}</span>
                  <div class="text-gold">${renderIcon('star', { size: '16' })}</div>
                </div>
                <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div class="bg-gradient-to-r from-gold to-brand h-full rounded-full transition-all duration-500" style="width: ${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%"></div>
                </div>
                <span class="text-sm font-medium text-gray-600 min-w-[30px] text-right">${count}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Load reviews list
  const reviewsList = document.getElementById('reviews-list');
  if (reviewsList) {
    const reviewsHTML = reviews.map(review => {
      const reviewCard = new ReviewCard({
        review,
        showService: true
      });

      const container = document.createElement('div');
      reviewCard.mount(container);
      return container.innerHTML;
    }).join('');

    reviewsList.innerHTML = reviewsHTML;
  }
}

function initializeDynamicButtons(professionalData) {
  console.log('🔘 Initializing dynamic buttons for:', professionalData.name);
  console.log('📍 Button locations:');
  console.log('  • Services CTA: book-consultation-btn → Chat con mensaje personalizado');
  console.log('  • Contact Actions: book-service-btn (Reservar) + send-message-btn (Chat)');
  console.log('  • Hero buttons: contact-professional-btn (Chat), view-availability-btn (Booking), share-profile-btn (Compartir)');
  
  // Contact professional button (NOT USED - for reference only)
  const contactBtn = new Button({
    variant: 'primary',
    size: 'lg',
    children: `
      ${renderIcon('message-circle', { size: '20' })}
      Contactar profesional
    `,
    onClick: () => {
      openChat();
    }
  });

  // View availability button
  const availabilityBtn = new Button({
    variant: 'secondary',
    size: 'lg',
    children: `
      ${renderIcon('calendar', { size: '20' })}
      Ver disponibilidad
    `,
    onClick: () => {
      // Show availability calendar
      showAvailabilityCalendar(professionalData);
    }
  });

  // Share profile button
  const shareBtn = new Button({
    variant: 'ghost',
    size: 'lg',
    children: `
      ${renderIcon('share-2', { size: '20' })}
      Compartir
    `,
    onClick: () => {
      shareProfile(professionalData);
    }
  });

  // Custom service consultation button
  const consultationBtn = new Button({
    variant: 'primary',
    size: 'xl',
    children: `
      ${renderIcon('message-square', { size: '24' })}
      Consultar servicio personalizado
    `,
    onClick: () => {
      console.log('💬 Custom service consultation clicked');
      openChatWithMessage(professionalData, 'custom-service');
    }
  });

  // Book service button - scroll to services section
  const bookServiceBtn = new Button({
    variant: 'primary',
    size: 'xl',
    children: `
      ${renderIcon('calendar', { size: '24' })}
      Ver servicios disponibles
    `,
    onClick: () => {
      console.log('📅 Book service button clicked - scrolling to services');
      scrollToServicesSection();
    }
  });

  // Send message button - with service selection
  const sendMessageBtn = new Button({
    variant: 'secondary',
    size: 'lg',
    children: `
      ${renderIcon('message-square', { size: '20' })}
      Consultar sobre servicio
    `,
    onClick: () => {
      console.log('💬 Opening service selection for chat');
      openServiceSelectionForChat(professionalData);
    }
  });

  // Call professional button
  const callBtn = new Button({
    variant: 'ghost',
    size: 'md',
    children: `
      ${renderIcon('phone', { size: '20' })}
      Llamar
    `,
    onClick: () => {
      // This would typically show a phone number or initiate a call
      alert('Función de llamada disponible próximamente');
    }
  });

  // Mount buttons only for CTA sections (not hero)
  const consultationContainer = document.getElementById('book-consultation-btn');
  const bookServiceContainer = document.getElementById('book-service-btn');
  const sendMessageContainer = document.getElementById('send-message-btn');

  console.log('🔘 Mounting CTA buttons:');
  console.log('  - Consultation container:', consultationContainer ? '✅' : '❌');
  console.log('  - Book service container:', bookServiceContainer ? '✅' : '❌');
  console.log('  - Send message container:', sendMessageContainer ? '✅' : '❌');

  if (consultationContainer) {
    consultationBtn.mount(consultationContainer);
    console.log('✅ Consultation button mounted');
    
    // FIX: Apply triple fallback for consultation button
    if (!consultationBtn.element) {
      consultationBtn.element = consultationContainer.querySelector('button[data-component="button"]');
      if (consultationBtn.element && typeof consultationBtn.bindEvents === 'function') {
        consultationBtn.bindEvents();
      }
    }
    
    const consultationMountedButton = consultationContainer.querySelector('button');
    if (consultationMountedButton) {

      
      // Remove ALL existing event listeners first by cloning
      consultationMountedButton.replaceWith(consultationMountedButton.cloneNode(true));
      const cleanConsultationButton = consultationContainer.querySelector('button');
      
      // Add direct onclick - most reliable method
      cleanConsultationButton.onclick = (e) => {
        console.log('🚀 CONSULTATION ONCLICK DETECTED!');
        e.preventDefault();
        e.stopPropagation();
        openChatWithMessage(professionalData, 'custom-service');
      };
      
      // Also add addEventListener as backup
      cleanConsultationButton.addEventListener('click', (e) => {
        console.log('🚀 CONSULTATION ADDEVENTLISTENER DETECTED!');
        e.preventDefault();
        e.stopPropagation();
        openChatWithMessage(professionalData, 'custom-service');
      }, { capture: true });
      
      console.log('✅ Triple fallback applied to consultation button');
    }
  }
  if (bookServiceContainer) {

    
    bookServiceBtn.mount(bookServiceContainer);
    console.log('✅ Book service button mounted');
    
    // FIX: Manually assign this.element if it's null
    if (!bookServiceBtn.element) {
      bookServiceBtn.element = bookServiceContainer.querySelector('button[data-component="button"]');

      
      // Re-bind events after assigning element
      if (bookServiceBtn.element && typeof bookServiceBtn.bindEvents === 'function') {
        bookServiceBtn.bindEvents();

      }
    } else {
      console.log('✅ Button element already assigned correctly');
    }
    
    // Verify button is clickable
    const mountedButton = bookServiceContainer.querySelector('button');
    if (mountedButton) {
      console.log('✅ Button element found in DOM');
      console.log('🔍 Button text (cleaned):', mountedButton.textContent.trim());
      console.log('🔍 Button component element:', bookServiceBtn.element);
      console.log('🔍 Button has onClick:', !!bookServiceBtn.props.onClick);
      
      // Test if manual event listener gets added

      
      // Manual test click handler - PRIORITY
      const manualHandler = (e) => {
        console.log('🚀 MANUAL CLICK DETECTED!');
        e.preventDefault();
        e.stopPropagation();

        scrollToServicesSection();
      };
      
      mountedButton.addEventListener('click', manualHandler, true);
      console.log('✅ Manual event listener added');
      
      // Remove ALL existing event listeners first
      mountedButton.replaceWith(mountedButton.cloneNode(true));
      const cleanButton = bookServiceContainer.querySelector('button');
      
      // Add direct onclick - most reliable method
      cleanButton.onclick = (e) => {
        console.log('🚀 ONCLICK DETECTED!');
        e.preventDefault();
        e.stopPropagation();
        scrollToServicesSection();
      };
      
      // Also add addEventListener as backup
      cleanButton.addEventListener('click', (e) => {
        console.log('🚀 ADDEVENTLISTENER DETECTED!');
        e.preventDefault();
        e.stopPropagation();
        scrollToServicesSection();
      });
      

      
    } else {
      console.warn('⚠️ Button element not found after mounting');
    }
  }
  if (sendMessageContainer) {

    sendMessageBtn.mount(sendMessageContainer);
    console.log('✅ Send message button mounted');
    
    // FIX: Manually assign this.element if it's null
    if (!sendMessageBtn.element) {
      sendMessageBtn.element = sendMessageContainer.querySelector('button[data-component="button"]');

      
      // Re-bind events after assigning element
      if (sendMessageBtn.element && typeof sendMessageBtn.bindEvents === 'function') {
        sendMessageBtn.bindEvents();

      }
    }
    
    // Verify button is clickable
    const mountedButton = sendMessageContainer.querySelector('button');
    if (mountedButton) {
      console.log('✅ Send message button element found in DOM');
      console.log('🔍 Send message button element:', sendMessageBtn.element);
      console.log('🔍 Send message button has onClick:', !!sendMessageBtn.props.onClick);
      
      // Test if manual event listener gets added

      
      // Manual test click handler - PRIORITY
      const manualHandler = (e) => {
        console.log('🚀 MANUAL SEND MESSAGE CLICK DETECTED!');
        e.preventDefault();
        e.stopPropagation();

        openServiceSelectionForChat(professionalData);
      };
      
      mountedButton.addEventListener('click', manualHandler, true);
      console.log('✅ Manual send message event listener added');
      
      // Remove ALL existing event listeners first
      mountedButton.replaceWith(mountedButton.cloneNode(true));
      const cleanButton = sendMessageContainer.querySelector('button');
      
      // Add direct onclick - most reliable method
      cleanButton.onclick = (e) => {
        console.log('🚀 SEND MESSAGE ONCLICK DETECTED!');
        e.preventDefault();
        e.stopPropagation();
        openServiceSelectionForChat(professionalData);
      };
      
      // Also add addEventListener as backup
      cleanButton.addEventListener('click', (e) => {
        console.log('🚀 SEND MESSAGE ADDEVENTLISTENER DETECTED!');
        e.preventDefault();
        e.stopPropagation();
        openServiceSelectionForChat(professionalData);
      });
      

      
    } else {
      console.warn('⚠️ Send message button element not found after mounting');
    }
  }

  // Add event listeners for hero buttons (simple HTML buttons)
  const heroContactBtn = document.getElementById('contact-professional-btn');
  const heroAvailabilityBtn = document.getElementById('view-availability-btn');
  const heroShareBtn = document.getElementById('share-profile-btn');

  if (heroContactBtn) {
    heroContactBtn.addEventListener('click', () => openChat());
  }
  if (heroAvailabilityBtn) {
    heroAvailabilityBtn.addEventListener('click', () => {
      console.log('📅 Opening availability calendar for:', professionalData.name);
      openAvailabilityCalendar(professionalData);
    });
  }
  if (heroShareBtn) {
    heroShareBtn.addEventListener('click', () => shareProfile(professionalData));
  }
}

function initializeFilters() {

  
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('[data-component="service-card"]');
  
  console.log(`📊 Found ${filterButtons.length} filter buttons and ${serviceCards.length} service cards`);
  
  if (filterButtons.length === 0 || serviceCards.length === 0) {
    console.warn('⚠️ No filter buttons or service cards found');
    return;
  }

  // Remove existing event listeners to prevent duplicates
  filterButtons.forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });

  // Re-query after cloning
  const newFilterButtons = document.querySelectorAll('.filter-btn');

  newFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      console.log(`🔍 Filtering by category: ${category}`);
      
      // Update active filter styles
      newFilterButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-brand', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-200');
      });
      
      // Set active button styles
      button.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-200');
      button.classList.add('active', 'bg-brand', 'text-white');
      
      // Get fresh service cards each time
      const currentServiceCards = document.querySelectorAll('[data-component="service-card"]');
      let visibleCount = 0;
      
      // Filter services with animation
      currentServiceCards.forEach(card => {
        const serviceCategory = card.dataset.category || 'all';
        const cardContainer = card.closest('.service-card-container') || card;
        
        if (category === 'all' || serviceCategory === category) {
          visibleCount++;
          cardContainer.style.display = 'block';
          setTimeout(() => {
            cardContainer.classList.remove('opacity-0', 'scale-95');
            cardContainer.classList.add('opacity-100', 'scale-100', 'transition-all', 'duration-300');
          }, 50);
        } else {
          cardContainer.classList.remove('opacity-100', 'scale-100');
          cardContainer.classList.add('opacity-0', 'scale-95', 'transition-all', 'duration-300');
          setTimeout(() => {
            if (cardContainer.classList.contains('opacity-0')) {
              cardContainer.style.display = 'none';
            }
          }, 300);
        }
      });
      
      console.log(`📈 Showing ${visibleCount} services for category: ${category}`);
    });
  });
  
  console.log('✅ Service filters initialized successfully');
}

function initializePortfolioLightbox() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const lightbox = document.getElementById('portfolio-lightbox');
  const lightboxImage = lightbox?.querySelector('.lightbox-image');
  const lightboxTitle = lightbox?.querySelector('.lightbox-title');
  const lightboxDescription = lightbox?.querySelector('.lightbox-description');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const prevBtn = lightbox?.querySelector('.lightbox-prev');
  const nextBtn = lightbox?.querySelector('.lightbox-next');
  
  let currentImageIndex = 0;
  let portfolioData = [];

  // Collect portfolio data
  portfolioItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const portfolioId = item.dataset.portfolioId;
    
    // Get data from dataset or from the item itself
    const title = item.querySelector('h4')?.textContent || `Portfolio ${index + 1}`;
    const description = item.querySelector('p')?.textContent || 'Ver trabajo completo';
    
    portfolioData.push({
      src: img?.src || '',
      alt: img?.alt || '',
      title,
      description
    });

    // Add click listener
    item.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    if (!lightbox || portfolioData.length === 0) return;
    
    updateLightboxContent();
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const current = portfolioData[currentImageIndex];
    if (!current) return;

    if (lightboxImage) lightboxImage.src = current.src;
    if (lightboxTitle) lightboxTitle.textContent = current.title;
    if (lightboxDescription) lightboxDescription.textContent = current.description;
  }

  function showPrevious() {
    currentImageIndex = (currentImageIndex - 1 + portfolioData.length) % portfolioData.length;
    updateLightboxContent();
  }

  function showNext() {
    currentImageIndex = (currentImageIndex + 1) % portfolioData.length;
    updateLightboxContent();
  }

  // Event listeners
  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrevious);
  nextBtn?.addEventListener('click', showNext);

  // Close on overlay click
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox?.style.display === 'flex') {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          showPrevious();
          break;
        case 'ArrowRight':
          showNext();
          break;
      }
    }
  });
}

function initializeScrollAnimations() {
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

  // Observe sections for animations
  document.querySelectorAll('.professional-services-section, .professional-portfolio-section, .professional-reviews-section').forEach(el => {
    observer.observe(el);
  });
}

function updateMetaTags(handle) {
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', `Perfil profesional de ${handle} - Servicios de belleza a domicilio en Bolivia. Reserva ahora con Kalos.`);
  } else {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = `Perfil profesional de ${handle} - Servicios de belleza a domicilio en Bolivia. Reserva ahora con Kalos.`;
    document.head.appendChild(meta);
  }

  // Add Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:title');
    meta.content = `Perfil Profesional - ${handle} | Kalos`;
    document.head.appendChild(meta);
  }
}

// Utility functions
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHtml = '';
  
  for (let i = 0; i < fullStars; i++) {
    starsHtml += `<span class="text-gold">${renderIcon('star', { size: '16' })}</span>`;
  }
  
  if (hasHalfStar) {
    starsHtml += `<span class="text-gold">${renderIcon('star', { size: '16' })}</span>`;
  }
  
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += `<span class="text-gray-300">${renderIcon('star', { size: '16' })}</span>`;
  }
  
  return starsHtml;
}

function renderRatingStars(rating) {
  return renderStars(rating);
}

function showLoadingState() {
  const loading = document.getElementById('profile-loading');
  const content = document.getElementById('profile-content');
  const error = document.getElementById('profile-error');
  
  if (loading) loading.style.display = 'flex';
  if (content) content.style.display = 'none';
  if (error) error.style.display = 'none';
}

function hideLoadingState() {
  const loading = document.getElementById('profile-loading');
  const content = document.getElementById('profile-content');
  
  if (loading) loading.style.display = 'none';
  if (content) content.style.display = 'block';
}

function showErrorState() {
  const loading = document.getElementById('profile-loading');
  const content = document.getElementById('profile-content');
  const error = document.getElementById('profile-error');
  
  if (loading) loading.style.display = 'none';
  if (content) content.style.display = 'none';
  if (error) error.style.display = 'flex';
}

// Modal and interaction functions
function openContactModal(professional) {
  // This would open a contact modal
  console.log('Opening contact modal for:', professional.name);
  // Implementation would go here
}

function showAvailabilityCalendar(professional) {
  // This would show availability calendar
  console.log('Showing availability for:', professional.name);
  // Implementation would go here
}

function shareProfile(professional) {
  console.log('📱 Showing social media links...');
  
  if (!professional || !professional.socialMedia) {
    alert('No hay redes sociales disponibles para este profesional');
    return;
  }

  const socialMedia = professional.socialMedia;
  
  // Crear modal simple para mostrar redes sociales
  const modalHTML = `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="social-modal">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-brand to-navy p-6 text-white text-center">
          <h3 class="text-xl font-semibold">Redes Sociales</h3>
          <p class="text-white/80 text-sm mt-1">Sigue a ${professional.name}</p>
        </div>
        
        <!-- Social Links -->
        <div class="p-6 space-y-4">
          ${socialMedia.instagram ? `
            <a href="${socialMedia.instagram}" target="_blank" class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors group">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                ${renderIcon('instagram', { size: '24' })}
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 group-hover:text-pink-600">Instagram</h4>
                <p class="text-gray-500 text-sm">@maria_makeup_bo</p>
              </div>
              <div class="text-gray-400 group-hover:text-pink-500">
                ${renderIcon('external-link', { size: '20' })}
              </div>
            </a>
          ` : ''}
          
          ${socialMedia.facebook ? `
            <a href="${socialMedia.facebook}" target="_blank" class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group">
              <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                ${renderIcon('facebook', { size: '24' })}
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 group-hover:text-blue-600">Facebook</h4>
                <p class="text-gray-500 text-sm">María González Makeup</p>
              </div>
              <div class="text-gray-400 group-hover:text-blue-500">
                ${renderIcon('external-link', { size: '20' })}
              </div>
            </a>
          ` : ''}
          
          ${socialMedia.whatsapp ? `
            <a href="${socialMedia.whatsapp}" target="_blank" class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors group">
              <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white">
                ${renderIcon('message-circle', { size: '24' })}
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 group-hover:text-green-600">WhatsApp</h4>
                <p class="text-gray-500 text-sm">+591 77123456</p>
              </div>
              <div class="text-gray-400 group-hover:text-green-500">
                ${renderIcon('external-link', { size: '20' })}
              </div>
            </a>
          ` : ''}
          
          ${socialMedia.tiktok ? `
            <a href="${socialMedia.tiktok}" target="_blank" class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors group">
              <div class="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white">
                ${renderIcon('play', { size: '24' })}
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 group-hover:text-gray-700">TikTok</h4>
                <p class="text-gray-500 text-sm">@maria_beauty</p>
              </div>
              <div class="text-gray-400 group-hover:text-gray-500">
                ${renderIcon('external-link', { size: '20' })}
              </div>
            </a>
          ` : ''}
        </div>
        
        <!-- Footer -->
        <div class="border-t border-gray-100 p-4">
          <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors" onclick="closeSocialModal()">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Agregar modal al DOM
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);
  
  // Agregar función global para cerrar modal
  window.closeSocialModal = function() {
    modalContainer.remove();
    delete window.closeSocialModal;
  };
  
  // Cerrar con click en backdrop
  const modal = modalContainer.querySelector('#social-modal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      window.closeSocialModal();
    }
  });
  
  // Cerrar con Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      window.closeSocialModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function showServiceDetails(service) {
  console.log('🔍 Showing service details for:', service.name);
  
  if (!service || !currentProfessionalData) {
    console.error('❌ Missing service or professional data');
    return;
  }

  // Crear modal si no existe
  if (!serviceDetailsModal) {
    serviceDetailsModal = new ServiceDetailsModal({
      service: service,
      professional: currentProfessionalData,
      isOpen: false,
      onClose: closeServiceDetails,
      onBookService: (selectedService) => {
        console.log('📅 Booking service:', selectedService.name);
        navigateTo(`/booking/${currentProfessionalData.id}?service=${selectedService.id}`);
      }
    });

    // Mount modal
    const container = document.getElementById('service-details-modal-container');
    if (container) {
      serviceDetailsModal.mount(container);
    }
  } else {
    // Actualizar datos del modal existente
    serviceDetailsModal.props.service = service;
    serviceDetailsModal.props.professional = currentProfessionalData;
  }

  // Abrir modal
  serviceDetailsModal.props.isOpen = true;
  serviceDetailsModal.render();
  
  // Re-mount para actualizar estado
  const container = document.getElementById('service-details-modal-container');
  if (container && serviceDetailsModal) {
    serviceDetailsModal.mount(container);
  }
}

function closeServiceDetails() {
  console.log('🔒 Closing service details modal...');
  
  if (serviceDetailsModal) {
    try {
      serviceDetailsModal.props.isOpen = false;
      
      // Cleanup if method exists
      if (typeof serviceDetailsModal.cleanup === 'function') {
        serviceDetailsModal.cleanup();
      }
      
      // Limpiar container
      const container = document.getElementById('service-details-modal-container');
      if (container) {
        container.innerHTML = '';
      }
      
      serviceDetailsModal = null;
      console.log('✅ Service details modal closed successfully');
    } catch (error) {
      console.error('❌ Error closing service details modal:', error);
      
      // Force cleanup container
      const container = document.getElementById('service-details-modal-container');
      if (container) {
        container.innerHTML = '';
      }
      serviceDetailsModal = null;
    }
  }
}

// Chat System Functions
// Utility function for checking authentication (similar to Header.js)
function getCurrentUser() {
  console.log('🔍 ProfessionalProfile: getCurrentUser() called');
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

// Utility function for checking if user is authenticated
function isUserAuthenticated() {
  const user = getCurrentUser();
  const isAuth = !!user;
  console.log('🔐 User authenticated:', isAuth, user?.email || 'none');
  return isAuth;
}

// Utility function for getting service category icon
function getServiceIcon(category) {
  const icons = {
    makeup: '💄',
    hair: '💇‍♀️',
    nails: '💅',
    skincare: '✨',
    facial: '🧴',
    massage: '💆‍♀️',
    beauty: '💫',
    default: '🔹'
  };
  return icons[category] || icons.default;
}

// Generate mock availability data for current month
function generateMockAvailability() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const availability = {};
  
  // Generate availability for current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    // Use local date string to avoid timezone issues
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = date.getDay();
    const today = new Date().toDateString();
    const currentDate = date.toDateString();
    
    // console.log(`📅 Generating day ${day}: dateStr=${dateStr}, dayOfWeek=${dayOfWeek}`);
    
    // Skip past dates
    if (currentDate < today) {
      availability[dateStr] = { status: 'past', slots: [] };
      continue;
    }
    
    // Skip Sundays (day 0)
    if (dayOfWeek === 0) {
      availability[dateStr] = { status: 'unavailable', slots: [] };
      continue;
    }
    
    // Random availability status
    const rand = Math.random();
    let status, slots;
    
    if (rand < 0.3) {
      status = 'unavailable';
      slots = [];
    } else if (rand < 0.6) {
      status = 'limited';
      slots = generateTimeSlots(2, 4); // 2-4 slots available
    } else {
      status = 'available';
      slots = generateTimeSlots(4, 8); // 4-8 slots available
    }
    
    availability[dateStr] = { status, slots };
  }
  
  return availability;
}

// Generate time slots for a day
function generateTimeSlots(min, max) {
  const slots = [];
  const baseHours = [9, 10, 11, 14, 15, 16, 17, 18]; // Working hours
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Randomly select time slots
  const selectedHours = baseHours.sort(() => 0.5 - Math.random()).slice(0, count);
  
  selectedHours.forEach(hour => {
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      available: true,
      price: 80 + Math.floor(Math.random() * 40) // $80-120
    });
    
    // Sometimes add a half-hour slot
    if (Math.random() < 0.3) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:30`,
        available: true,
        price: 80 + Math.floor(Math.random() * 40)
      });
    }
  });
  
  return slots.sort((a, b) => a.time.localeCompare(b.time));
}

// Generate calendar days HTML
function generateCalendarDays(availabilityData) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Get first day of month and how many days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  let calendarHTML = '';
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarHTML += '<div class="calendar-day-empty p-2"></div>';
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    // Use local date string to avoid timezone issues
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const availability = availabilityData[dateStr] || { status: 'unavailable', slots: [] };
    
    // console.log(`📅 Calendar day ${day}: dateStr=${dateStr}, status=${availability.status}`);
    
    let dayClass = 'calendar-day p-3 text-center cursor-pointer rounded-xl border-2 border-transparent hover:border-brand transition-all duration-200 min-h-[60px] flex flex-col justify-center relative';
    let bgColor = '';
    let textColor = 'text-gray-900';
    let shadowClass = '';
    
    switch (availability.status) {
      case 'available':
        bgColor = 'bg-green-50 hover:bg-green-100 border-green-200';
        shadowClass = 'hover:shadow-md';
        break;
      case 'limited':
        bgColor = 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200';
        shadowClass = 'hover:shadow-md';
        break;
      case 'unavailable':
        bgColor = 'bg-red-50 border-red-200';
        dayClass += ' cursor-not-allowed unavailable opacity-60';
        textColor = 'text-red-600';
        break;
      case 'past':
        bgColor = 'bg-gray-50 border-gray-200';
        dayClass += ' cursor-not-allowed past opacity-50';
        textColor = 'text-gray-400';
        break;
    }
    
    calendarHTML += `
      <div class="${dayClass} ${bgColor} ${textColor} ${shadowClass}" data-date="${dateStr}" data-day="${day}">
        <div class="font-semibold text-lg">${day}</div>
        ${availability.slots.length > 0 ? `
          <div class="text-xs font-medium mt-1">
            <div class="inline-flex items-center px-2 py-1 rounded-full bg-white/70">
              ${availability.slots.length} slots
            </div>
          </div>
        ` : ''}
        ${availability.status === 'available' ? '<div class="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>' : ''}
        ${availability.status === 'limited' ? '<div class="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>' : ''}
      </div>
    `;
  }
  
  return calendarHTML;
}

// Helper function to format date avoiding timezone issues
function formatDateLocal(dateString, options = {}) {
  const [year, month, day] = dateString.split('-').map(Number);
  const localDate = new Date(year, month - 1, day); // month is 0-indexed in JavaScript
  
  const defaultOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return localDate.toLocaleDateString('es-ES', { ...defaultOptions, ...options });
}

// Load time slots for selected date
function loadTimeSlots(date, professionalData) {
  console.log('📅 Loading time slots for:', date);
  console.log('📅 Date object created:', new Date(date));
  console.log('📅 Date string parts:', date.split('-'));
  
  // Use the same availability data that was generated for the calendar
  const availabilityData = window.currentAvailabilityData || generateMockAvailability();
  const dayData = availabilityData[date];
  
  console.log('📅 Using availability data:', {
    isConsistent: !!window.currentAvailabilityData,
    dayData: dayData,
    slotsCount: dayData?.slots?.length || 0
  });
  
  const container = document.getElementById('time-slots-container');
  if (!container) return;
  
  if (!dayData || dayData.slots.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-500 py-12">
        <div class="mb-4">
          ${renderIcon('x-circle', { size: '48', color: '#EF4444' })}
        </div>
        <h4 class="text-lg font-medium text-gray-900 mb-2">No hay horarios disponibles</h4>
        <p class="text-sm text-gray-600">Este día no tiene citas disponibles. Prueba con otra fecha.</p>
      </div>
    `;
    return;
  }
  
  const formattedDate = formatDateLocal(date);
  
  console.log('📅 Fixed date formatting:', { 
    originalDate: date, 
    formattedDate 
  });
  
  container.innerHTML = `
    <div class="mb-6">
      <h4 class="text-lg font-semibold text-gray-900 mb-2">
        ${formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
      </h4>
      <p class="text-sm text-gray-600">Selecciona un horario para tu cita con ${professionalData.name}</p>
    </div>
    
    <div class="space-y-3 max-h-80 overflow-y-auto pr-2">
      ${dayData.slots.map(slot => `
        <button class="time-slot w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-brand hover:bg-brand/5 hover:shadow-md transition-all duration-200 group" data-time="${slot.time}" data-price="${slot.price}">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                ${renderIcon('clock', { size: '20', color: '#E11D48' })}
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-lg">${slot.time}</div>
                <div class="text-sm text-gray-600">60-90 minutos aprox.</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-brand text-xl">$${slot.price}</div>
              <div class="text-xs text-green-600 font-medium flex items-center gap-1">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                Disponible
              </div>
            </div>
          </div>
        </button>
      `).join('')}
    </div>
  `;
  
  // Add event listeners to time slots
  const timeSlots = container.querySelectorAll('.time-slot');
  const bookBtn = document.getElementById('book-selected-slot');
  
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      const selectedTime = slot.dataset.time;
      const selectedPrice = slot.dataset.price;
      
      console.log('📅 Time slot clicked:', selectedTime, 'Price:', selectedPrice);
      
      // Open service selection for this time slot
      openServiceSelectionForBooking(date, selectedTime, selectedPrice, professionalData);
    });
  });
}

// Show booking confirmation with service information
function showBookingConfirmationWithService(date, time, finalPrice, selectedService, professionalData) {
  const formattedDate = formatDateLocal(date);
  
  // Close availability modal first
  const availabilityModal = document.getElementById('availability-modal');
  if (availabilityModal) {
    availabilityModal.remove();
  }
  
  // Determine service info
  const serviceInfo = selectedService ? {
    name: selectedService.name,
    icon: getServiceIcon(selectedService.category),
    category: selectedService.category,
    duration: selectedService.duration,
    description: selectedService.description
  } : {
    name: 'Consulta General',
    icon: '💬',
    category: 'consulta',
    duration: '60',
    description: 'Asesoría personalizada y consulta sobre cualquier tema de belleza'
  };
  
  // Create confirmation modal
  const confirmationModal = document.createElement('div');
  confirmationModal.id = 'booking-confirmation-modal';
  confirmationModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  confirmationModal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-lg w-full shadow-xl">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            ${renderIcon('check', { size: '24', color: '#10B981' })}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Confirmar Reserva</h3>
            <p class="text-sm text-gray-600">Revisa todos los detalles de tu cita</p>
          </div>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Professional -->
        <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <img src="${professionalData.avatar}" alt="${professionalData.name}" class="w-12 h-12 rounded-full object-cover">
          <div>
            <div class="font-semibold text-gray-900">${professionalData.name}</div>
            <div class="text-sm text-gray-600">${professionalData.specialties?.join(', ') || 'Especialista en belleza'}</div>
          </div>
        </div>
        
        <!-- Selected Service -->
        <div class="p-4 border-2 border-brand/20 rounded-xl bg-brand/5">
          <div class="flex items-center gap-3 mb-3">
            <div class="text-2xl">${serviceInfo.icon}</div>
            <div>
              <h4 class="font-semibold text-gray-900">${serviceInfo.name}</h4>
              <p class="text-sm text-gray-600">${serviceInfo.description}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-xs bg-white text-gray-600 px-3 py-1 rounded-full font-medium">
              ${serviceInfo.duration} minutos
            </span>
            <span class="text-xs bg-brand/20 text-brand px-3 py-1 rounded-full font-medium">
              ${serviceInfo.category}
            </span>
          </div>
        </div>
        
        <!-- Date & Time -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-5 h-5 text-brand">
                ${renderIcon('calendar', { size: '20' })}
              </div>
              <div class="font-medium text-gray-900">Fecha</div>
            </div>
            <div class="text-sm text-gray-600">${formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}</div>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-5 h-5 text-brand">
                ${renderIcon('clock', { size: '20' })}
              </div>
              <div class="font-medium text-gray-900">Hora</div>
            </div>
            <div class="text-sm text-gray-600">${time}</div>
          </div>
        </div>
        
        <!-- Price -->
        <div class="p-4 bg-brand/5 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">Precio Total</div>
              <div class="text-sm text-gray-600">Incluye todos los servicios</div>
            </div>
            <div class="text-right">
              <div class="font-bold text-brand text-2xl">$${finalPrice}</div>
            </div>
          </div>
        </div>
        
        <!-- Note -->
        <div class="p-4 bg-blue-50 rounded-xl">
          <p class="text-sm text-blue-800">
            <strong>Importante:</strong> Recibirás una confirmación por email. Puedes gestionar o modificar tu cita desde tu cuenta hasta 24 horas antes.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-6 border-t border-gray-100 flex gap-3">
        <button id="cancel-booking" class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          Volver Atrás
        </button>
        <button id="confirm-booking" class="flex-1 px-4 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand-hover transition-colors">
          Confirmar Cita
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(confirmationModal);
  
  // Event listeners
  const cancelBtn = confirmationModal.querySelector('#cancel-booking');
  const confirmBtn = confirmationModal.querySelector('#confirm-booking');
  
  cancelBtn.addEventListener('click', () => {
    confirmationModal.remove();
    // Reopen availability modal
    openAvailabilityCalendar(professionalData);
  });
  
        confirmBtn.addEventListener('click', () => {
        console.log('📅 Redirecting to booking flow with data:', { 
          date, 
          time, 
          service: serviceInfo.name, 
          price: finalPrice, 
          professional: professionalData.name 
        });
        
        // Store booking data in sessionStorage for BookingFlow
        const bookingPreData = {
          professionalId: professionalData.id || professionalData.handle,
          professionalName: professionalData.name,
          serviceId: selectedService?.id || 'general-consultation',
          serviceName: serviceInfo.name,
          servicePrice: finalPrice,
          serviceDuration: serviceInfo.duration,
          serviceCategory: selectedService?.category || 'consultation',
          scheduledDate: date,
          scheduledTime: time,
          fromCalendar: true
        };
        
        sessionStorage.setItem('bookingPreData', JSON.stringify(bookingPreData));
        
        // Close confirmation modal
        confirmationModal.remove();
        
        // Close availability modal if it exists
        const availabilityModal = document.getElementById('availability-modal');
        if (availabilityModal) {
          window.currentAvailabilityData = null;
          availabilityModal.remove();
        }
        
        // Navigate to booking flow
        navigateTo('/booking/new');
      });
  
  // Close on backdrop click
  confirmationModal.addEventListener('click', (e) => {
    if (e.target === confirmationModal) {
      confirmationModal.remove();
    }
  });
  
  confirmationModal.classList.add('opacity-0');
  setTimeout(() => {
    confirmationModal.classList.remove('opacity-0');
    confirmationModal.classList.add('opacity-100');
  }, 10);
}

// Show booking confirmation (legacy function for compatibility)
function showBookingConfirmation(date, time, professionalData) {
  const formattedDate = formatDateLocal(date);
  
  // Close availability modal first
  const availabilityModal = document.getElementById('availability-modal');
  if (availabilityModal) {
    availabilityModal.remove();
  }
  
  // Create confirmation modal
  const confirmationModal = document.createElement('div');
  confirmationModal.id = 'booking-confirmation-modal';
  confirmationModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  confirmationModal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-xl">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            ${renderIcon('check', { size: '24', color: '#10B981' })}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Confirmación de Cita</h3>
            <p class="text-sm text-gray-600">Revisa los detalles antes de confirmar</p>
          </div>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-6 space-y-4">
        <!-- Professional -->
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <img src="${professionalData.avatar}" alt="${professionalData.name}" class="w-10 h-10 rounded-full object-cover">
          <div>
            <div class="font-medium text-gray-900">${professionalData.name}</div>
            <div class="text-sm text-gray-600">${professionalData.specialties?.join(', ') || 'Especialista en belleza'}</div>
          </div>
        </div>
        
        <!-- Date & Time -->
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 text-brand">
              ${renderIcon('calendar', { size: '20' })}
            </div>
            <div>
              <div class="font-medium text-gray-900">Fecha</div>
              <div class="text-sm text-gray-600">${formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}</div>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 text-brand">
              ${renderIcon('clock', { size: '20' })}
            </div>
            <div>
              <div class="font-medium text-gray-900">Hora</div>
              <div class="text-sm text-gray-600">${time} (60-90 minutos aprox.)</div>
            </div>
          </div>
        </div>
        
        <!-- Note -->
        <div class="p-3 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Nota:</strong> Recibirás una confirmación por email y podrás gestionar tu cita desde tu cuenta.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-6 border-t border-gray-100 flex gap-3">
        <button id="cancel-booking" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button id="confirm-booking" class="flex-1 px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-hover transition-colors">
          Confirmar Cita
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(confirmationModal);
  
  // Event listeners
  const cancelBtn = confirmationModal.querySelector('#cancel-booking');
  const confirmBtn = confirmationModal.querySelector('#confirm-booking');
  
  cancelBtn.addEventListener('click', () => {
    confirmationModal.remove();
    // Reopen availability modal
    openAvailabilityCalendar(professionalData);
  });
  
  confirmBtn.addEventListener('click', () => {
    console.log('📅 Booking confirmed:', { date, time, professional: professionalData.name });
    
    // Show success message
    confirmationModal.remove();
    showBookingSuccess(date, time, professionalData);
  });
  
  // Close on backdrop click
  confirmationModal.addEventListener('click', (e) => {
    if (e.target === confirmationModal) {
      confirmationModal.remove();
    }
  });
  
  confirmationModal.classList.add('opacity-0');
  setTimeout(() => {
    confirmationModal.classList.remove('opacity-0');
    confirmationModal.classList.add('opacity-100');
  }, 10);
}

// Show booking success with service information
function showBookingSuccessWithService(date, time, serviceInfo, finalPrice, professionalData) {
  const successModal = document.createElement('div');
  successModal.id = 'booking-success-modal';
  successModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  successModal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-xl">
      <div class="p-8 text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          ${renderIcon('check', { size: '40', color: '#10B981' })}
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">¡Cita Confirmada!</h3>
        
        <!-- Service Info -->
        <div class="bg-brand/5 rounded-xl p-4 mb-6">
          <div class="flex items-center justify-center gap-3 mb-2">
            <span class="text-2xl">${serviceInfo.icon}</span>
            <h4 class="font-semibold text-gray-900">${serviceInfo.name}</h4>
          </div>
          <p class="text-sm text-gray-600">con ${professionalData.name}</p>
        </div>
        
        <!-- Date & Time -->
        <div class="space-y-2 mb-6">
          <div class="flex items-center justify-center gap-2 text-gray-600">
            ${renderIcon('calendar', { size: '16' })}
            <span class="text-sm">${formatDateLocal(date, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <div class="flex items-center justify-center gap-2 text-gray-600">
            ${renderIcon('clock', { size: '16' })}
            <span class="text-sm">${time} (${serviceInfo.duration} min)</span>
          </div>
          <div class="flex items-center justify-center gap-2 text-brand font-semibold">
            ${renderIcon('dollar-sign', { size: '16' })}
            <span class="text-sm">$${finalPrice}</span>
          </div>
        </div>
        
        <p class="text-gray-600 text-sm mb-6">
          Te hemos enviado los detalles por email. Puedes gestionar tu cita desde tu cuenta.
        </p>
        
        <button id="close-success" class="w-full px-4 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand-hover transition-colors">
          Perfecto
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(successModal);
  
  const closeBtn = successModal.querySelector('#close-success');
  closeBtn.addEventListener('click', () => {
    successModal.remove();
  });
  
  successModal.classList.add('opacity-0');
  setTimeout(() => {
    successModal.classList.remove('opacity-0');
    successModal.classList.add('opacity-100');
  }, 10);
  
  // Auto-close after 8 seconds
  setTimeout(() => {
    if (document.body.contains(successModal)) {
      successModal.remove();
    }
  }, 8000);
}

// Show booking success (legacy function for compatibility)
function showBookingSuccess(date, time, professionalData) {
  const successModal = document.createElement('div');
  successModal.id = 'booking-success-modal';
  successModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  successModal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-xl">
      <div class="p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          ${renderIcon('check', { size: '32', color: '#10B981' })}
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">¡Cita Reservada!</h3>
        <p class="text-gray-600 mb-6">
          Tu cita con ${professionalData.name} ha sido confirmada para el 
          ${formatDateLocal(date, { day: 'numeric', month: 'long', year: 'numeric' })} a las ${time}.
        </p>
        <button id="close-success" class="w-full px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-hover transition-colors">
          Entendido
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(successModal);
  
  const closeBtn = successModal.querySelector('#close-success');
  closeBtn.addEventListener('click', () => {
    successModal.remove();
  });
  
  successModal.classList.add('opacity-0');
  setTimeout(() => {
    successModal.classList.remove('opacity-0');
    successModal.classList.add('opacity-100');
  }, 10);
  
  // Auto-close after 5 seconds
  setTimeout(() => {
    if (document.body.contains(successModal)) {
      successModal.remove();
    }
  }, 5000);
}

// Utility function for safe login redirection
function redirectToLogin(originPath = null) {
  const currentPath = originPath || window.location.pathname;
  
  console.log('🔐 Redirecting to login from:', currentPath);
  
  // Evitar bucles de redirección
  if (currentPath.startsWith('/auth/login')) {
    console.warn('⚠️ Already on login page, redirecting to clean login');
    navigateTo('/auth/login');
    return;
  }
  
  // Si no hay path específico o es inválido, usar path del profesional actual
  if (!currentPath || currentPath === '/' || currentPath.startsWith('/auth')) {
    // Intentar obtener el handle del profesional actual
    const professionalHandle = currentProfessionalData?.handle || 'maria-gonzalez';
    const fallbackPath = `/pro/${professionalHandle}`;
    console.log('🔄 Using fallback path:', fallbackPath);
    navigateTo(`/auth/login?redirect=${encodeURIComponent(fallbackPath)}`);
    return;
  }
  
  // Redirección normal
  navigateTo(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
}

// Scroll to services section utility
function scrollToServicesSection() {
  console.log('📍 Utility: Scrolling to services section...');
  
  const servicesSection = document.querySelector('#services-section');
  
  if (servicesSection) {
    console.log('✅ Services section found');
    
    // Get header height dynamically
    const header = document.querySelector('header, nav, .header');
    const headerHeight = header ? header.offsetHeight : 80;
    
    const elementPosition = servicesSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; // Extra 20px padding
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    console.log('✅ Scrolled to services section');
    return true;
  } else {
    console.error('❌ Services section not found');
    return false;
  }
}

function initializeChatSystem() {
  // Inicializar sistema de chat pero no crear modal hasta que se necesite
  console.log('💬 Chat system initialized');
  
  // Hacer openChat accesible globalmente para otros componentes
  window.openChat = openChat;
  window.openChatWithMessage = openChatWithMessage;
  window.openServiceSelectionForChat = openServiceSelectionForChat;
  window.scrollToServicesSection = scrollToServicesSection;
}

function openChat() {
  console.log('💬 Attempting to open chat...');
  
  // Verificar autenticación primero
  if (!isUserAuthenticated()) {
    console.log('🔐 User not authenticated, redirecting to login...');
    
    // Mostrar alerta y redirigir a login
    alert('Debes iniciar sesión para poder contactar al profesional');
    
    // Redirigir a login de forma segura
    redirectToLogin();
    return;
  }

  if (!currentProfessionalData) {
    console.error('❌ No professional data available');
    return;
  }

  console.log('✅ User authenticated, opening chat...');

  // Crear modal si no existe
  if (!chatModal) {
    chatModal = new ChatModal({
      professionalId: currentProfessionalData.id,
      professionalName: currentProfessionalData.name,
      professionalAvatar: currentProfessionalData.avatar,
      chatTitle: `💬 Chat con ${currentProfessionalData.name}`,
      chatSubtitle: 'Consulta general',
      isOpen: false,
      onClose: closeChat
    });

    // Mount modal
    const container = document.getElementById('chat-modal-container');
    if (container) {
      chatModal.mount(container);
    }
  }

  // Abrir modal
  chatModal.props.isOpen = true;
  chatModal.render();
  
  // Re-mount para actualizar estado
  const container = document.getElementById('chat-modal-container');
  if (container && chatModal) {
    chatModal.mount(container);
  }
}

function closeChat() {
  console.log('🔒 Closing chat modal...');
  
  if (chatModal) {
    try {
      chatModal.props.isOpen = false;
      
      // Cleanup if method exists
      if (typeof chatModal.cleanup === 'function') {
        chatModal.cleanup();
      }
      
      // Limpiar container
      const container = document.getElementById('chat-modal-container');
      if (container) {
        container.innerHTML = '';
      }
      
      chatModal = null;
      console.log('✅ Chat modal closed successfully');
    } catch (error) {
      console.error('❌ Error closing chat modal:', error);
      
      // Force cleanup container
      const container = document.getElementById('chat-modal-container');
      if (container) {
        container.innerHTML = '';
      }
      chatModal = null;
    }
  }
}

// Open chat with predefined message
function openChatWithMessage(professionalData, messageType, selectedService = null) {
  console.log('💬 Opening chat with predefined message:', messageType, selectedService?.name || '');
  
  // Verificar autenticación primero
  if (!isUserAuthenticated()) {
    console.log('🔐 User not authenticated, redirecting to login...');
    
    // Mostrar alerta y redirigir a login
    alert('Debes iniciar sesión para poder contactar al profesional');
    
    // Redirigir a login de forma segura
    redirectToLogin();
    return;
  }

  if (!currentProfessionalData) {
    console.error('❌ No professional data available');
    return;
  }

  // Agregar categorización visual al chat
  let chatTitle = `Chat con ${professionalData.name}`;
  let chatSubtitle = '';
  
  switch (messageType) {
    case 'custom-service':
      chatTitle = `💡 Servicio Personalizado - ${professionalData.name}`;
      chatSubtitle = 'Solicitud de servicio personalizado';
      break;
    case 'service-inquiry':
      if (selectedService) {
        chatTitle = `${getServiceIcon(selectedService.category)} ${selectedService.name} - ${professionalData.name}`;
        chatSubtitle = `Consulta sobre ${selectedService.name}`;
      }
      break;
    default:
      chatTitle = `💬 Chat con ${professionalData.name}`;
      chatSubtitle = 'Consulta general';
  }

  console.log('✅ User authenticated, opening chat with predefined message...');

  // Crear modal si no existe
  if (!chatModal) {
    chatModal = new ChatModal({
      professionalId: currentProfessionalData.id,
      professionalName: currentProfessionalData.name,
      professionalAvatar: currentProfessionalData.avatar,
      chatTitle: chatTitle,
      chatSubtitle: chatSubtitle,
      isOpen: false,
      onClose: closeChat
    });

    // Mount modal
    const container = document.getElementById('chat-modal-container');
    if (container) {
      chatModal.mount(container);
    }
  }

  // Abrir modal
  chatModal.props.isOpen = true;
  chatModal.render();
  
  // Re-mount para actualizar estado
  const container = document.getElementById('chat-modal-container');
  if (container && chatModal) {
    chatModal.mount(container);
  }

  // Enviar mensaje predefinido después de un breve delay para asegurar que el modal esté montado
  setTimeout(() => {
    let predefinedMessage = '';
    
    switch (messageType) {
      case 'custom-service':
        predefinedMessage = `🔍 Solicitud de servicio personalizado\n\nHola ${professionalData.name}, estuve revisando tus servicios pero no encontré exactamente lo que necesito.\n\n¿Sería posible que me ayudes con algo personalizado? Te cuento lo que busco:\n\n[Escribe aquí qué necesitas específicamente]\n\n¿Podrías ofrecerme este tipo de servicio o agregarlo a tu catálogo?`;
        break;
      case 'service-inquiry':
        if (selectedService) {
          predefinedMessage = `💄 Consulta sobre: ${selectedService.name}\n\nHola ${professionalData.name}, me interesa tu servicio de "${selectedService.name}".\n\nDetalles del servicio:\n💰 Precio: $${selectedService.price}\n⏰ Duración: ${selectedService.duration}\n\nMe gustaría saber más sobre:\n• Disponibilidad de fechas\n• Qué incluye exactamente el servicio\n• Preparación previa necesaria\n• [Agrega aquí otras preguntas específicas]\n\n¿Podrías darme más información?`;
        } else {
          predefinedMessage = `Hola ${professionalData.name}, me interesa consultar sobre uno de tus servicios.`;
        }
        break;
      default:
        predefinedMessage = `Hola ${professionalData.name}, me interesa contactarte para más información sobre tus servicios.`;
    }

    // Buscar el textarea del chat y prellenarlo
    const chatTextarea = document.querySelector('#chat-modal-container textarea[placeholder*="mensaje"]');
    if (chatTextarea) {
      chatTextarea.value = predefinedMessage;
      chatTextarea.focus();
      
      // Trigger resize event si es necesario
      chatTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      
      console.log('✅ Predefined message set:', messageType);
    } else {
      console.warn('⚠️ Chat textarea not found, message not prefilled');
    }
  }, 300); // Pequeño delay para asegurar que el DOM esté listo
}

// Open service selection modal before chat
function openServiceSelectionForChat(professionalData) {
  console.log('📋 Opening service selection for chat');
  
  // Verificar autenticación primero
  if (!isUserAuthenticated()) {
    console.log('🔐 User not authenticated, redirecting to login...');
    alert('Debes iniciar sesión para poder contactar al profesional');
    
    // Redirigir a login de forma segura
    redirectToLogin();
    return;
  }

  // Evitar duplicar modales si ya existe uno
  const existingModal = document.getElementById('service-selection-modal');
  if (existingModal) {
    console.log('⚠️ Service selection modal already exists, removing...');
    existingModal.remove();
  }

  // Crear modal de selección de servicio
  const serviceSelectionModal = document.createElement('div');
  serviceSelectionModal.id = 'service-selection-modal';
  serviceSelectionModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  serviceSelectionModal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900">¿Sobre qué servicio quieres consultar?</h3>
          <button class="text-gray-400 hover:text-gray-600 transition-colors" id="close-service-selection">
            ${renderIcon('x', { size: '24' })}
          </button>
        </div>
        <p class="text-sm text-gray-600 mt-2">Selecciona el servicio para personalizar tu mensaje</p>
      </div>
      
      <!-- Services List -->
      <div class="p-6 max-h-96 overflow-y-auto" id="service-selection-list">
        <div class="space-y-3">
          ${professionalData.services.map(service => `
            <button class="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-brand hover:bg-brand/5 transition-all duration-200 service-option" data-service-id="${service.id}">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  ${renderIcon('briefcase', { size: '20', className: 'text-brand' })}
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-gray-900 text-sm">${service.name}</h4>
                  <p class="text-xs text-gray-600 mt-1 line-clamp-2">${service.description}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-sm font-semibold text-brand">$${service.price}</span>
                    <span class="text-xs text-gray-500">• ${service.duration}</span>
                  </div>
                </div>
              </div>
            </button>
          `).join('')}
          
          <!-- Opción general -->
          <button class="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-brand hover:bg-brand/5 transition-all duration-200 service-option" data-service-id="general">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                ${renderIcon('message-circle', { size: '20', className: 'text-gray-600' })}
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 text-sm">Consulta general</h4>
                <p class="text-xs text-gray-600 mt-1">Para preguntas generales o información</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;

  // Agregar al DOM
  document.body.appendChild(serviceSelectionModal);

  // Event listeners
  const closeBtn = serviceSelectionModal.querySelector('#close-service-selection');
  const serviceOptions = serviceSelectionModal.querySelectorAll('.service-option');

  closeBtn.addEventListener('click', () => {
    serviceSelectionModal.remove();
  });

  serviceSelectionModal.addEventListener('click', (e) => {
    if (e.target === serviceSelectionModal) {
      serviceSelectionModal.remove();
    }
  });

  serviceOptions.forEach(option => {
    option.addEventListener('click', () => {
      const serviceId = option.dataset.serviceId;
      serviceSelectionModal.remove();
      
      if (serviceId === 'general') {
        // Chat normal
        openChat();
      } else {
        // Chat con servicio específico
        const selectedService = professionalData.services.find(s => s.id === serviceId);
        openChatWithMessage(professionalData, 'service-inquiry', selectedService);
      }
    });
  });

  console.log('✅ Service selection modal opened');
}

// Open availability calendar modal
function openAvailabilityCalendar(professionalData) {
  console.log('📅 Opening availability calendar for:', professionalData.name);
  
  // Evitar duplicar modales si ya existe uno
  const existingModal = document.getElementById('availability-modal');
  if (existingModal) {
    console.log('⚠️ Availability modal already exists, removing...');
    existingModal.remove();
  }

  // Crear modal de calendario
  const availabilityModal = document.createElement('div');
  availabilityModal.id = 'availability-modal';
  availabilityModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  // Generar datos de disponibilidad mock y almacenarlos globalmente para consistencia
  const availabilityData = generateMockAvailability();
  window.currentAvailabilityData = availabilityData;
  
  console.log('📅 Generated consistent availability data for', Object.keys(availabilityData).length, 'days');
  
  availabilityModal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-brand to-navy text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img src="${professionalData.avatar}" alt="${professionalData.name}" class="w-12 h-12 rounded-full object-cover border-2 border-white/20">
            <div>
              <h3 class="text-xl font-semibold">Disponibilidad de ${professionalData.name}</h3>
              <p class="text-white/80 text-sm">Selecciona una fecha para ver horarios disponibles</p>
            </div>
          </div>
          <button id="close-availability" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
            ${renderIcon('x', { size: '24', color: 'white' })}
          </button>
        </div>
      </div>
      
      <!-- Calendar Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 h-[70vh]">
        <!-- Calendar Side -->
        <div class="p-6 border-r border-gray-100">
          <div class="mb-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold text-gray-900">Enero 2024</h4>
              <div class="flex gap-2">
                <button id="prev-month" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  ${renderIcon('chevron-left', { size: '20' })}
                </button>
                <button id="next-month" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  ${renderIcon('chevron-right', { size: '20' })}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-2 mb-3">
            ${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => 
              `<div class="text-center text-sm font-semibold text-gray-600 py-2">${day}</div>`
            ).join('')}
          </div>
          
          <div class="grid grid-cols-7 gap-2" id="calendar-grid">
            ${generateCalendarDays(availabilityData)}
          </div>
          
          <!-- Legend -->
          <div class="mt-6 flex flex-wrap gap-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-green-500 rounded"></div>
              <span class="text-gray-600">Disponible</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-yellow-500 rounded"></div>
              <span class="text-gray-600">Pocas citas</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-red-500 rounded"></div>
              <span class="text-gray-600">No disponible</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-gray-300 rounded"></div>
              <span class="text-gray-600">Pasado</span>
            </div>
          </div>
        </div>
        
        <!-- Time Slots Side -->
        <div class="p-6 bg-gray-50">
          <div id="time-slots-container">
            <div class="text-center text-gray-500 py-12">
              <div class="mb-4">
                ${renderIcon('calendar', { size: '48', color: '#9CA3AF' })}
              </div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Selecciona una fecha</h4>
              <p class="text-sm text-gray-600">Elige un día del calendario para ver los horarios disponibles</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-6 border-t border-gray-100 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            <p><strong>Nota:</strong> Los horarios están en zona horaria local. Duración aproximada por cita: 60-90 minutos.</p>
          </div>
          <button id="book-selected-slot" class="px-6 py-2 bg-brand text-white rounded-lg font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Reservar Cita
          </button>
        </div>
      </div>
    </div>
  `;

  // Agregar al DOM
  document.body.appendChild(availabilityModal);

  // Event listeners
  const closeBtn = availabilityModal.querySelector('#close-availability');
  const prevMonth = availabilityModal.querySelector('#prev-month');
  const nextMonth = availabilityModal.querySelector('#next-month');
  const bookBtn = availabilityModal.querySelector('#book-selected-slot');

  closeBtn.addEventListener('click', () => {
    // Limpiar datos globales al cerrar
    window.currentAvailabilityData = null;
    availabilityModal.remove();
  });

  // Close on backdrop click
  availabilityModal.addEventListener('click', (e) => {
    if (e.target === availabilityModal) {
      // Limpiar datos globales al cerrar
      window.currentAvailabilityData = null;
      availabilityModal.remove();
    }
  });

  // Calendar navigation (placeholder)
  prevMonth.addEventListener('click', () => {
    console.log('📅 Previous month clicked');
    // TODO: Implement month navigation
  });

  nextMonth.addEventListener('click', () => {
    console.log('📅 Next month clicked');
    // TODO: Implement month navigation
  });

  // Day selection
  const calendarDays = availabilityModal.querySelectorAll('.calendar-day');
  calendarDays.forEach(day => {
    day.addEventListener('click', () => {
      if (day.classList.contains('unavailable') || day.classList.contains('past')) {
        return;
      }
      
      // Remove previous selection
      calendarDays.forEach(d => d.classList.remove('selected'));
      day.classList.add('selected');
      
      const date = day.dataset.date;
      const dayNumber = day.dataset.day;
      console.log('📅 Selected date:', date, 'Day number:', dayNumber);
      console.log('📅 Day element classes:', day.className);
      console.log('📅 Day element innerHTML:', day.innerHTML);
      
      // Load time slots for selected date
      loadTimeSlots(date, professionalData);
    });
  });

  // Book button
  bookBtn.addEventListener('click', () => {
    const selectedDate = availabilityModal.querySelector('.calendar-day.selected')?.dataset.date;
    const selectedTime = availabilityModal.querySelector('.time-slot.selected')?.dataset.time;
    
    if (selectedDate && selectedTime) {
      console.log('📅 Booking appointment:', { date: selectedDate, time: selectedTime });
      
      // Check authentication first
      if (!isUserAuthenticated()) {
        alert('Debes iniciar sesión para reservar una cita');
        redirectToLogin();
        return;
      }
      
      // Show booking confirmation
      showBookingConfirmation(selectedDate, selectedTime, professionalData);
    }
  });

  availabilityModal.classList.add('opacity-0');
  setTimeout(() => {
    availabilityModal.classList.remove('opacity-0');
    availabilityModal.classList.add('opacity-100');
  }, 10);

  console.log('✅ Availability calendar opened');
}

// Open service selection for booking a specific time slot
function openServiceSelectionForBooking(date, time, price, professionalData) {
  console.log('🛍️ Opening service selection for booking:', { date, time, price });
  
  const formattedDate = formatDateLocal(date);
  
  // Create service selection modal
  const serviceBookingModal = document.createElement('div');
  serviceBookingModal.id = 'service-booking-modal';
  serviceBookingModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  serviceBookingModal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-brand to-navy text-white">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold mb-1">Selecciona tu Servicio</h3>
            <p class="text-white/80 text-sm">
              ${formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)} a las ${time}
            </p>
          </div>
          <button id="close-service-booking" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
            ${renderIcon('x', { size: '24', color: 'white' })}
          </button>
        </div>
      </div>
      
      <!-- Selected Time Info -->
      <div class="p-4 bg-brand/5 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-brand/20 rounded-lg flex items-center justify-center">
              ${renderIcon('clock', { size: '20', color: '#E11D48' })}
            </div>
            <div>
              <div class="font-semibold text-gray-900">Horario Seleccionado</div>
              <div class="text-sm text-gray-600">${time} - ${formattedDate}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-600">Precio base del slot</div>
            <div class="font-bold text-brand text-lg">$${price}</div>
          </div>
        </div>
      </div>
      
      <!-- Services List -->
      <div class="p-6 max-h-96 overflow-y-auto">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">¿Qué servicio deseas reservar?</h4>
        
        <div class="space-y-3" id="booking-services-list">
          ${professionalData.services.map(service => `
            <button class="service-booking-option w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-brand hover:bg-brand/5 transition-all duration-200 group" data-service-id="${service.id}">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src="${service.images[0] || '/images/placeholder-service.jpg'}" alt="${service.name}" class="w-full h-full object-cover">
                  </div>
                  <div class="flex-1">
                    <h5 class="font-semibold text-gray-900 text-lg group-hover:text-brand transition-colors">
                      ${getServiceIcon(service.category)} ${service.name}
                    </h5>
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">${service.description}</p>
                    <div class="flex items-center gap-3 mt-2">
                      <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        ${service.duration} min
                      </span>
                      <span class="text-xs bg-brand/10 text-brand px-2 py-1 rounded-full font-medium">
                        ${service.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-brand text-xl">$${service.price}</div>
                  <div class="text-xs text-gray-500 mt-1">Precio final</div>
                </div>
              </div>
            </button>
          `).join('')}
          
          <!-- Consulta General Option -->
          <button class="service-booking-option w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-brand hover:bg-brand/5 transition-all duration-200 group" data-service-id="consultation">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-brand/20 to-navy/20 flex items-center justify-center flex-shrink-0">
                  ${renderIcon('message-circle', { size: '32', color: '#E11D48' })}
                </div>
                <div class="flex-1">
                  <h5 class="font-semibold text-gray-900 text-lg group-hover:text-brand transition-colors">
                    💬 Consulta General
                  </h5>
                  <p class="text-sm text-gray-600 mt-1">Asesoría personalizada y consulta sobre cualquier tema de belleza</p>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      60 min
                    </span>
                    <span class="text-xs bg-brand/10 text-brand px-2 py-1 rounded-full font-medium">
                      consulta
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-brand text-xl">$${price}</div>
                <div class="text-xs text-gray-500 mt-1">Precio del slot</div>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-6 border-t border-gray-100 bg-gray-50">
        <p class="text-sm text-gray-600 text-center">
          <strong>Nota:</strong> El precio final puede variar según el servicio seleccionado. 
          Confirmarás todos los detalles en el siguiente paso.
        </p>
      </div>
    </div>
  `;

  // Add to DOM
  document.body.appendChild(serviceBookingModal);

  // Event listeners
  const closeBtn = serviceBookingModal.querySelector('#close-service-booking');
  const serviceOptions = serviceBookingModal.querySelectorAll('.service-booking-option');

  closeBtn.addEventListener('click', () => {
    serviceBookingModal.remove();
  });

  // Close on backdrop click
  serviceBookingModal.addEventListener('click', (e) => {
    if (e.target === serviceBookingModal) {
      serviceBookingModal.remove();
    }
  });

  // Service selection
  serviceOptions.forEach(option => {
    option.addEventListener('click', () => {
      const serviceId = option.dataset.serviceId;
      
      serviceBookingModal.remove();
      
      if (serviceId === 'consultation') {
        // General consultation
        showBookingConfirmationWithService(date, time, price, null, professionalData);
      } else {
        // Specific service
        const selectedService = professionalData.services.find(s => s.id === serviceId);
        showBookingConfirmationWithService(date, time, selectedService.price, selectedService, professionalData);
      }
    });
  });

  serviceBookingModal.classList.add('opacity-0');
  setTimeout(() => {
    serviceBookingModal.classList.remove('opacity-0');
    serviceBookingModal.classList.add('opacity-100');
  }, 10);

  console.log('✅ Service booking selection opened');
}

// Redirect to booking flow with pre-filled data
function redirectToBookingFlow(date, time, finalPrice, selectedService, professionalData) {
  console.log('📅 Preparing redirect to booking flow...', {
    date, time, finalPrice, selectedService, professionalData
  });

  // Store booking data in sessionStorage for BookingFlow
  const bookingPreData = {
    professionalId: professionalData.id || professionalData.handle,
    professionalName: professionalData.name,
    professionalAvatar: professionalData.avatar,
    serviceId: selectedService?.id || 'general-consultation',
    serviceName: selectedService?.name || 'Consulta General',
    servicePrice: selectedService?.price || finalPrice,
    serviceDuration: selectedService?.duration || 60,
    serviceCategory: selectedService?.category || 'consultation',
    serviceDescription: selectedService?.description || 'Consulta general con el profesional',
    scheduledDate: date,
    scheduledTime: time,
    fromCalendar: true,
    timestamp: Date.now()
  };

  console.log('📅 Storing booking pre-data:', bookingPreData);
  sessionStorage.setItem('bookingPreData', JSON.stringify(bookingPreData));

  // Navigate to booking flow
  navigateTo('/booking/new');
}





export default renderProfessionalProfilePage;

