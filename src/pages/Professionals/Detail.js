/**
 * Professional Detail/Profile Page
 * Public profile view for a specific professional
 */

import { renderWithLayout, initializeLayout } from '../../components/Layout.js';
import { professionalService } from '../../services/professionals.js';
import { servicesService } from '../../services/services.js';
import { authService } from '../../services/auth.js';
import { navigateTo } from '../../utils/router.js';

export function renderProfessionalDetailPage(professionalId) {
  const content = `
    <div class="min-h-screen bg-gray-50">
      <!-- Loading State -->
      <div id="loadingState" class="py-16">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-lg shadow-sm p-8 animate-pulse">
            <div class="flex flex-col lg:flex-row gap-8">
              <div class="flex-shrink-0">
                <div class="w-32 h-32 bg-gray-200 rounded-full"></div>
              </div>
              <div class="flex-1 space-y-4">
                <div class="h-8 bg-gray-200 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div id="errorState" class="py-16 hidden">
        <div class="max-w-2xl mx-auto px-4 text-center">
          <div class="bg-red-50 border border-red-200 rounded-lg p-8">
            <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h2 class="text-2xl font-bold text-red-800 mb-2">Profesional no encontrado</h2>
            <p class="text-red-600 mb-6">El profesional que buscas no existe o no está disponible.</p>
            <button onclick="history.back()" class="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-hover transition-colors">
              Volver Atrás
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div id="mainContent" class="hidden">
        <!-- Hero Section -->
        <div class="relative">
          <!-- Cover Image -->
          <div id="coverImage" class="h-64 lg:h-80 bg-gradient-to-br from-brand to-deep-coral"></div>
          
          <!-- Professional Info Overlay -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div class="flex flex-col lg:flex-row items-start lg:items-end gap-6">
                <!-- Profile Image -->
                <div class="flex-shrink-0">
                  <img 
                    id="profileImage" 
                    src="" 
                    alt="Foto de perfil"
                    class="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                </div>
                
                <!-- Basic Info -->
                <div class="flex-1 text-white">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                    <div>
                      <h1 id="businessName" class="text-3xl lg:text-4xl font-bold mb-2"></h1>
                      <p id="location" class="text-lg opacity-90 mb-2"></p>
                    </div>
                    
                    <!-- Verification Badge -->
                    <div id="verificationBadge" class="hidden lg:flex items-center bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      Verificado
                    </div>
                  </div>
                  
                  <!-- Rating and Stats -->
                  <div class="flex items-center gap-6 text-sm">
                    <div class="flex items-center">
                      <div id="rating" class="flex items-center mr-2"></div>
                      <span id="reviewCount" class="opacity-90"></span>
                    </div>
                    <div id="experienceYears" class="opacity-90"></div>
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex gap-3">
                  <button id="contactBtn" class="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-hover transition-colors font-semibold flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.9-.481L5.34 21.2a.996.996 0 01-1.538-1.118L4.9 15.83C3.708 14.51 3 12.82 3 11c0-4.418 3.582-8 8-8s8 3.582 8 8z"/>
                    </svg>
                    Contactar
                  </button>
                  <button id="bookBtn" class="bg-white text-brand px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                    Reservar Cita
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Sections -->
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Column -->
            <div class="lg:col-span-2 space-y-8">
              <!-- About Section -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-bold text-navy mb-4">Acerca de</h2>
                <p id="description" class="text-gray-700 leading-relaxed whitespace-pre-line"></p>
                
                <!-- Specialties -->
                <div class="mt-6">
                  <h3 class="font-semibold text-navy mb-3">Especialidades</h3>
                  <div id="specialties" class="flex flex-wrap gap-2"></div>
                </div>
                
                <!-- Certifications -->
                <div id="certificationsSection" class="mt-6 hidden">
                  <h3 class="font-semibold text-navy mb-3">Certificaciones</h3>
                  <ul id="certifications" class="text-gray-700 space-y-1"></ul>
                </div>
              </div>

              <!-- Services Section -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-bold text-navy mb-4">Servicios</h2>
                <div id="servicesContainer">
                  <!-- Services will be loaded here -->
                  <div id="servicesLoading" class="space-y-4">
                    <div class="animate-pulse">
                      <div class="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div class="animate-pulse">
                      <div class="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Portfolio Section -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-bold text-navy mb-4">Portfolio</h2>
                <div id="portfolioContainer">
                  <!-- Portfolio will be loaded here -->
                  <div id="portfolioLoading" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div class="animate-pulse">
                      <div class="h-32 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div class="animate-pulse">
                      <div class="h-32 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div class="animate-pulse">
                      <div class="h-32 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reviews Section -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-bold text-navy mb-4">Reseñas</h2>
                <div id="reviewsContainer">
                  <!-- Reviews will be loaded here -->
                  <p class="text-gray-500 italic">Las reseñas se mostrarán una vez que estén disponibles.</p>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Contact Info -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-semibold text-navy mb-4">Información de Contacto</h3>
                <div class="space-y-3">
                  <div id="phoneInfo" class="flex items-center text-gray-700 hidden">
                    <svg class="w-5 h-5 text-brand mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span id="phone"></span>
                  </div>
                  
                  <div id="whatsappInfo" class="flex items-center text-gray-700 hidden">
                    <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span id="whatsapp"></span>
                  </div>
                </div>
              </div>

              <!-- Service Area -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-semibold text-navy mb-4">Área de Servicio</h3>
                <div class="space-y-3 text-gray-700">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-brand mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span id="serviceLocation"></span>
                  </div>
                  
                  <div id="serviceRadius" class="flex items-center">
                    <svg class="w-5 h-5 text-brand mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                    </svg>
                    <span id="radiusText"></span>
                  </div>
                  
                  <div class="mt-4 space-y-2">
                    <div id="homeServiceBadge" class="hidden inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                      </svg>
                      Servicio a domicilio
                    </div>
                    
                    <div id="inShopBadge" class="hidden inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      En su local
                    </div>
                  </div>
                </div>
              </div>

              <!-- Working Hours -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-semibold text-navy mb-4">Horarios de Atención</h3>
                <div id="workingHours" class="space-y-2 text-sm text-gray-700">
                  <!-- Working hours will be populated here -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: 'Perfil Profesional - Kalos',
    showHeader: true,
    showFooter: true
  });
}

export function initializeProfessionalDetailPage(professionalId) {
  initializeLayout();
  
  let professional = null;
  let services = [];
  
  // Load professional data
  loadProfessionalData();

  async function loadProfessionalData() {
    try {
      // Show loading state
      document.getElementById('loadingState').classList.remove('hidden');
      document.getElementById('mainContent').classList.add('hidden');
      document.getElementById('errorState').classList.add('hidden');
      
      // Get professional data
      const professionalResult = await professionalService.getProfessionalById(professionalId);
      
      if (!professionalResult.success) {
        throw new Error(professionalResult.error);
      }
      
      professional = professionalResult.data;
      
      // Load services
      const servicesResult = await servicesService.getServicesByProfessional(professionalId);
      if (servicesResult.success) {
        services = servicesResult.data;
      }
      
      // Render professional data
      renderProfessionalInfo();
      renderServices();
      
      // Hide loading, show content
      document.getElementById('loadingState').classList.add('hidden');
      document.getElementById('mainContent').classList.remove('hidden');
      
    } catch (error) {
      console.error('Error loading professional:', error);
      document.getElementById('loadingState').classList.add('hidden');
      document.getElementById('errorState').classList.remove('hidden');
    }
  }

  function renderProfessionalInfo() {
    if (!professional) return;
    
    // Basic info
    document.getElementById('businessName').textContent = professional.businessInfo?.businessName || 'Profesional';
    document.getElementById('location').textContent = `${professional.location?.city || ''}, ${professional.location?.department || ''}`.replace(/^,\s*|,\s*$/g, '');
    document.getElementById('description').textContent = professional.businessInfo?.description || '';
    
    // Images
    const profileImage = document.getElementById('profileImage');
    profileImage.src = professional.personalInfo?.profileImage || '/images/default-avatar.png';
    profileImage.alt = `${professional.businessInfo?.businessName} - Foto de perfil`;
    
    // Verification badge
    if (professional.verification?.verified) {
      document.getElementById('verificationBadge').classList.remove('hidden');
    }
    
    // Rating and stats
    renderRating();
    renderStats();
    renderSpecialties();
    renderCertifications();
    renderContactInfo();
    renderServiceArea();
    renderWorkingHours();
    
    // Update page title
    document.title = `${professional.businessInfo?.businessName} - Kalos`;
  }

  function renderRating() {
    const ratingContainer = document.getElementById('rating');
    const rating = professional.stats?.averageRating || 0;
    const reviewCount = professional.stats?.reviewCount || 0;
    
    // Create stars
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('svg');
      star.className = 'w-4 h-4 ' + (i <= rating ? 'text-yellow-400' : 'text-gray-300');
      star.fill = 'currentColor';
      star.viewBox = '0 0 20 20';
      star.innerHTML = '<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>';
      ratingContainer.appendChild(star);
    }
    
    document.getElementById('reviewCount').textContent = `(${reviewCount} reseñas)`;
  }

  function renderStats() {
    const experience = professional.businessInfo?.experience || 0;
    const experienceText = experience === 0 ? 'Nuevo' : 
                          experience === 1 ? '1 año de experiencia' :
                          experience >= 10 ? 'Más de 10 años de experiencia' :
                          `${experience} años de experiencia`;
    
    document.getElementById('experienceYears').textContent = experienceText;
  }

  function renderSpecialties() {
    const specialtiesContainer = document.getElementById('specialties');
    const categories = professional.businessInfo?.categories || [];
    
    specialtiesContainer.innerHTML = '';
    
    categories.forEach(category => {
      const badge = document.createElement('span');
      badge.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand/10 text-brand';
      badge.textContent = getCategoryName(category);
      specialtiesContainer.appendChild(badge);
    });
  }

  function renderCertifications() {
    const certifications = professional.businessInfo?.certifications || [];
    
    if (certifications.length > 0) {
      const certificationsSection = document.getElementById('certificationsSection');
      const certificationsContainer = document.getElementById('certifications');
      
      certificationsContainer.innerHTML = '';
      certifications.forEach(cert => {
        const li = document.createElement('li');
        li.className = 'flex items-center';
        li.innerHTML = `
          <svg class="w-4 h-4 text-brand mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          ${cert}
        `;
        certificationsContainer.appendChild(li);
      });
      
      certificationsSection.classList.remove('hidden');
    }
  }

  function renderContactInfo() {
    const phone = professional.personalInfo?.phone;
    const whatsapp = professional.personalInfo?.whatsapp || phone;
    
    if (phone) {
      document.getElementById('phoneInfo').classList.remove('hidden');
      document.getElementById('phone').textContent = phone;
    }
    
    if (whatsapp) {
      document.getElementById('whatsappInfo').classList.remove('hidden');
      document.getElementById('whatsapp').textContent = whatsapp;
    }
  }

  function renderServiceArea() {
    const location = professional.location;
    if (!location) return;
    
    // Service location
    const serviceLocation = `${location.zone ? location.zone + ', ' : ''}${location.city}, ${location.department}`;
    document.getElementById('serviceLocation').textContent = serviceLocation;
    
    // Service radius
    document.getElementById('radiusText').textContent = `Radio de ${location.serviceRadius || 10} km`;
    
    // Service types
    if (location.homeService) {
      document.getElementById('homeServiceBadge').classList.remove('hidden');
    }
    
    if (location.inShop) {
      document.getElementById('inShopBadge').classList.remove('hidden');
    }
  }

  function renderWorkingHours() {
    const workingHours = professional.workingHours;
    const workingHoursContainer = document.getElementById('workingHours');
    
    if (!workingHours) {
      workingHoursContainer.innerHTML = '<p class="text-gray-500 italic">Horarios no especificados</p>';
      return;
    }
    
    const days = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    
    workingHoursContainer.innerHTML = '';
    
    Object.entries(days).forEach(([key, dayName]) => {
      const dayHours = workingHours[key];
      const div = document.createElement('div');
      div.className = 'flex justify-between items-center';
      
      if (dayHours?.available) {
        div.innerHTML = `
          <span class="font-medium">${dayName}</span>
          <span>${dayHours.start} - ${dayHours.end}</span>
        `;
      } else {
        div.innerHTML = `
          <span class="font-medium text-gray-400">${dayName}</span>
          <span class="text-gray-400">Cerrado</span>
        `;
      }
      
      workingHoursContainer.appendChild(div);
    });
  }

  function renderServices() {
    const servicesContainer = document.getElementById('servicesContainer');
    const servicesLoading = document.getElementById('servicesLoading');
    
    servicesLoading.classList.add('hidden');
    
    if (services.length === 0) {
      servicesContainer.innerHTML = '<p class="text-gray-500 italic">No hay servicios disponibles</p>';
      return;
    }
    
    servicesContainer.innerHTML = '';
    
    services.forEach(service => {
      const serviceCard = document.createElement('div');
      serviceCard.className = 'border border-gray-200 rounded-lg p-4 hover:border-brand hover:shadow-sm transition-all';
      
      serviceCard.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold text-navy">${service.name}</h3>
          <div class="text-right">
            <div class="text-lg font-bold text-brand">${service.price} BOB</div>
            <div class="text-sm text-gray-500">${service.duration} min</div>
          </div>
        </div>
        <p class="text-gray-600 text-sm mb-3">${service.description}</p>
        <div class="flex justify-between items-center">
          <div class="flex flex-wrap gap-1">
            ${service.tags?.map(tag => 
              `<span class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">${tag}</span>`
            ).join('') || ''}
          </div>
          <button class="bg-brand text-white px-4 py-2 rounded text-sm hover:bg-brand-hover transition-colors" onclick="bookService('${service.id}')">
            Reservar
          </button>
        </div>
      `;
      
      servicesContainer.appendChild(serviceCard);
    });
  }

  // Setup event listeners
  setupEventListeners();

  function setupEventListeners() {
    // Contact button
    const contactBtn = document.getElementById('contactBtn');
    contactBtn.addEventListener('click', () => {
      const phone = professional.personalInfo?.whatsapp || professional.personalInfo?.phone;
      if (phone) {
        const message = `Hola! Me interesa contactar contigo para un servicio de belleza. Vi tu perfil en Kalos.`;
        const whatsappUrl = `https://wa.me/591${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }
    });
    
    // Book button
    const bookBtn = document.getElementById('bookBtn');
    bookBtn.addEventListener('click', () => {
      // Check if user is authenticated
      authService.waitForAuth().then(({ user }) => {
        if (!user) {
          sessionStorage.setItem('redirectAfterAuth', window.location.pathname);
          navigateTo('/auth/login');
        } else {
          navigateTo(`/booking/new?professional=${professionalId}`);
        }
      });
    });
  }

  // Global function for booking specific service
  window.bookService = function(serviceId) {
    authService.waitForAuth().then(({ user }) => {
      if (!user) {
        sessionStorage.setItem('redirectAfterAuth', window.location.pathname);
        navigateTo('/auth/login');
      } else {
        navigateTo(`/booking/new?professional=${professionalId}&service=${serviceId}`);
      }
    });
  };

  function getCategoryName(categoryKey) {
    const categories = {
      hair: 'Cabello',
      nails: 'Uñas',
      makeup: 'Maquillaje',
      skincare: 'Cuidado de la piel',
      massage: 'Masajes',
      eyebrows: 'Cejas',
      eyelashes: 'Pestañas'
    };
    
    return categories[categoryKey] || categoryKey;
  }
}

export default renderProfessionalDetailPage;