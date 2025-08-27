/**
 * Professional Dashboard Page
 * Main control panel for professional users
 */

import { renderWithLayout, initializeLayout } from '../../components/Layout.js';
import { professionalService } from '../../services/professionals.js';
import { servicesService } from '../../services/services.js';
import { authService } from '../../services/auth.js';
import { navigateTo } from '../../utils/router.js';

export function renderProfessionalDashboardPage() {
  const content = `
    <div class="min-h-screen bg-gray-50">
      <!-- Loading State -->
      <div id="loadingState" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="animate-pulse">
            <div class="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="h-24 bg-gray-200 rounded-lg"></div>
              <div class="h-24 bg-gray-200 rounded-lg"></div>
              <div class="h-24 bg-gray-200 rounded-lg"></div>
              <div class="h-24 bg-gray-200 rounded-lg"></div>
            </div>
            <div class="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard -->
      <div id="mainContent" class="hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Header -->
          <div class="mb-8">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 class="text-3xl font-bold text-navy mb-2">Panel Profesional</h1>
                <p id="welcomeText" class="text-gray-600">Bienvenido/a a tu panel de control</p>
              </div>
              
              <div class="mt-4 lg:mt-0 flex gap-3">
                <button id="viewProfileBtn" class="bg-white text-brand border border-brand px-4 py-2 rounded-lg hover:bg-brand hover:text-white transition-colors">
                  Ver Mi Perfil
                </button>
                <button id="editProfileBtn" class="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-hover transition-colors">
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Bookings -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7H5a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V8a1 1 0 00-1-1h-3m-4 0V7"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Total Reservas</p>
                  <p id="totalBookings" class="text-2xl font-bold text-navy">-</p>
                </div>
              </div>
            </div>

            <!-- This Month -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Este Mes</p>
                  <p id="monthlyBookings" class="text-2xl font-bold text-navy">-</p>
                </div>
              </div>
            </div>

            <!-- Average Rating -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Calificación</p>
                  <p id="averageRating" class="text-2xl font-bold text-navy">-</p>
                </div>
              </div>
            </div>

            <!-- Active Services -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Servicios Activos</p>
                  <p id="activeServices" class="text-2xl font-bold text-navy">-</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 class="text-xl font-semibold text-navy mb-4">Acciones Rápidas</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button id="addServiceBtn" class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-brand/5 transition-colors">
                <svg class="w-8 h-8 text-brand mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span class="text-sm font-medium text-gray-700">Nuevo Servicio</span>
              </button>
              
              <button id="manageScheduleBtn" class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-brand/5 transition-colors">
                <svg class="w-8 h-8 text-brand mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7H5a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V8a1 1 0 00-1-1h-3m-4 0V7"/>
                </svg>
                <span class="text-sm font-medium text-gray-700">Horarios</span>
              </button>
              
              <button id="viewPortfolioBtn" class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-brand/5 transition-colors">
                <svg class="w-8 h-8 text-brand mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-sm font-medium text-gray-700">Portfolio</span>
              </button>
              
              <button id="viewReviewsBtn" class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-brand/5 transition-colors">
                <svg class="w-8 h-8 text-brand mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                <span class="text-sm font-medium text-gray-700">Reseñas</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Recent Bookings -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-navy">Reservas Recientes</h2>
                <button id="viewAllBookingsBtn" class="text-brand hover:text-brand-hover text-sm font-medium">
                  Ver Todas
                </button>
              </div>
              
              <div id="recentBookings">
                <!-- Bookings loading state -->
                <div id="bookingsLoading" class="space-y-4">
                  <div class="animate-pulse flex items-center space-x-4">
                    <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div class="animate-pulse flex items-center space-x-4">
                    <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
                
                <!-- No bookings state -->
                <div id="noBookings" class="hidden text-center py-8">
                  <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7H5a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V8a1 1 0 00-1-1h-3m-4 0V7"/>
                  </svg>
                  <p class="text-gray-500">No tienes reservas aún</p>
                  <p class="text-gray-400 text-sm mt-1">Las reservas aparecerán aquí cuando los clientes las hagan</p>
                </div>
              </div>
            </div>

            <!-- Services Management -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-navy">Mis Servicios</h2>
                <button id="manageServicesBtn" class="text-brand hover:text-brand-hover text-sm font-medium">
                  Gestionar
                </button>
              </div>
              
              <div id="servicesContainer">
                <!-- Services loading state -->
                <div id="servicesLoading" class="space-y-3">
                  <div class="animate-pulse">
                    <div class="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div class="animate-pulse">
                    <div class="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
                
                <!-- No services state -->
                <div id="noServices" class="hidden text-center py-8">
                  <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2"/>
                  </svg>
                  <p class="text-gray-500">No tienes servicios registrados</p>
                  <button onclick="document.getElementById('addServiceBtn').click()" class="text-brand hover:text-brand-hover text-sm font-medium mt-2">
                    Añadir tu primer servicio
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Status -->
          <div id="profileStatus" class="mt-8 hidden">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div class="flex items-start">
                <svg class="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <h3 class="text-yellow-800 font-semibold mb-2">Perfil en Revisión</h3>
                  <p class="text-yellow-700 text-sm mb-4">Tu perfil profesional está siendo verificado por nuestro equipo. Este proceso puede tomar hasta 48 horas.</p>
                  <div class="space-y-2 text-sm">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-gray-700">Información personal completa</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-gray-700">Servicios registrados</span>
                    </div>
                    <div id="portfolioStatus" class="flex items-center">
                      <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span class="text-gray-500">Portfolio (recomendado)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: 'Dashboard Profesional - Kalos',
    showHeader: true,
    showFooter: false
  });
}

export function initializeProfessionalDashboardPage() {
  initializeLayout();
  
  let currentUser = null;
  let professional = null;
  let services = [];
  let bookings = [];
  
  // Initialize dashboard
  loadDashboardData();

  async function loadDashboardData() {
    try {
      // Show loading state
      document.getElementById('loadingState').classList.remove('hidden');
      document.getElementById('mainContent').classList.add('hidden');
      
      // Get current user
      const authResult = await authService.waitForAuth();
      currentUser = authResult.user;
      
      if (!currentUser) {
        navigateTo('/auth/login');
        return;
      }
      
      // Load professional data
      const professionalResult = await professionalService.getProfessionalById(currentUser.uid);
      if (professionalResult.success) {
        professional = professionalResult.data;
      }
      
      // Load services
      const servicesResult = await servicesService.getServicesByProfessional(currentUser.uid);
      if (servicesResult.success) {
        services = servicesResult.data;
      }
      
      // TODO: Load bookings when booking system is implemented
      // const bookingsResult = await bookingsService.getBookingsByProfessional(currentUser.uid);
      // if (bookingsResult.success) {
      //   bookings = bookingsResult.data;
      // }
      
      // Render dashboard
      renderDashboard();
      
      // Hide loading, show content
      document.getElementById('loadingState').classList.add('hidden');
      document.getElementById('mainContent').classList.remove('hidden');
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError('Error al cargar el dashboard');
    }
  }

  function renderDashboard() {
    // Update welcome message
    const businessName = professional?.businessInfo?.businessName || currentUser?.email;
    document.getElementById('welcomeText').textContent = `Bienvenido/a, ${businessName}`;
    
    // Render stats
    renderStats();
    
    // Render recent bookings
    renderRecentBookings();
    
    // Render services
    renderServices();
    
    // Show profile status if not verified
    renderProfileStatus();
    
    // Setup event listeners
    setupEventListeners();
  }

  function renderStats() {
    // Total bookings (placeholder - will be updated when booking system is ready)
    document.getElementById('totalBookings').textContent = professional?.stats?.totalBookings || 0;
    
    // Monthly bookings (placeholder)
    document.getElementById('monthlyBookings').textContent = '0'; // TODO: Calculate from actual bookings
    
    // Average rating
    const averageRating = professional?.stats?.averageRating || 0;
    document.getElementById('averageRating').textContent = averageRating > 0 ? averageRating.toFixed(1) : '-';
    
    // Active services
    document.getElementById('activeServices').textContent = services.filter(service => service.active).length;
  }

  function renderRecentBookings() {
    const container = document.getElementById('recentBookings');
    const loading = document.getElementById('bookingsLoading');
    const noBookings = document.getElementById('noBookings');
    
    loading.classList.add('hidden');
    
    if (bookings.length === 0) {
      noBookings.classList.remove('hidden');
      return;
    }
    
    // TODO: Render actual bookings when booking system is implemented
    // For now, show no bookings state
    noBookings.classList.remove('hidden');
  }

  function renderServices() {
    const container = document.getElementById('servicesContainer');
    const loading = document.getElementById('servicesLoading');
    const noServices = document.getElementById('noServices');
    
    loading.classList.add('hidden');
    
    if (services.length === 0) {
      noServices.classList.remove('hidden');
      return;
    }
    
    noServices.classList.add('hidden');
    
    // Create services list
    const servicesList = document.createElement('div');
    servicesList.className = 'space-y-3';
    
    services.slice(0, 4).forEach(service => { // Show only first 4 services
      const serviceItem = document.createElement('div');
      serviceItem.className = 'flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-brand transition-colors';
      
      serviceItem.innerHTML = `
        <div class="flex-1">
          <div class="flex items-center">
            <h4 class="font-medium text-navy">${service.name}</h4>
            <div class="ml-2 flex items-center">
              ${service.active ? 
                '<span class="inline-block w-2 h-2 bg-green-400 rounded-full"></span>' :
                '<span class="inline-block w-2 h-2 bg-gray-300 rounded-full"></span>'
              }
            </div>
          </div>
          <div class="flex items-center mt-1 text-sm text-gray-500">
            <span>${service.price} BOB</span>
            <span class="mx-2">•</span>
            <span>${service.duration} min</span>
          </div>
        </div>
        <button class="text-brand hover:text-brand-hover text-sm font-medium" onclick="editService('${service.id}')">
          Editar
        </button>
      `;
      
      servicesList.appendChild(serviceItem);
    });
    
    container.innerHTML = '';
    container.appendChild(servicesList);
    
    // Show "view more" if there are more services
    if (services.length > 4) {
      const viewMore = document.createElement('div');
      viewMore.className = 'text-center mt-4';
      viewMore.innerHTML = `
        <button id="viewMoreServicesBtn" class="text-brand hover:text-brand-hover text-sm font-medium">
          Ver ${services.length - 4} servicios más
        </button>
      `;
      container.appendChild(viewMore);
      
      document.getElementById('viewMoreServicesBtn').addEventListener('click', () => {
        navigateTo('/pro/services');
      });
    }
  }

  function renderProfileStatus() {
    if (!professional) return;
    
    const profileStatus = document.getElementById('profileStatus');
    const portfolioStatus = document.getElementById('portfolioStatus');
    
    // Show profile status if not verified
    if (!professional.verification?.verified) {
      profileStatus.classList.remove('hidden');
      
      // Update portfolio status (placeholder - will be updated when portfolio system is ready)
      // if (hasPortfolio) {
      //   portfolioStatus.innerHTML = `
      //     <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
      //       <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      //     </svg>
      //     <span class="text-gray-700">Portfolio completo</span>
      //   `;
      // }
    }
  }

  function setupEventListeners() {
    // View profile
    document.getElementById('viewProfileBtn').addEventListener('click', () => {
      navigateTo(`/professionals/${currentUser.uid}`);
    });
    
    // Edit profile
    document.getElementById('editProfileBtn').addEventListener('click', () => {
      navigateTo('/pro/profile/edit');
    });
    
    // Add service
    document.getElementById('addServiceBtn').addEventListener('click', () => {
      navigateTo('/pro/services/new');
    });
    
    // Manage schedule
    document.getElementById('manageScheduleBtn').addEventListener('click', () => {
      navigateTo('/pro/schedule');
    });
    
    // View portfolio
    document.getElementById('viewPortfolioBtn').addEventListener('click', () => {
      navigateTo('/pro/portfolio');
    });
    
    // View reviews
    document.getElementById('viewReviewsBtn').addEventListener('click', () => {
      navigateTo('/pro/reviews');
    });
    
    // View all bookings
    document.getElementById('viewAllBookingsBtn').addEventListener('click', () => {
      navigateTo('/pro/bookings');
    });
    
    // Manage services
    document.getElementById('manageServicesBtn').addEventListener('click', () => {
      navigateTo('/pro/services');
    });
  }

  // Global function for editing services
  window.editService = function(serviceId) {
    navigateTo(`/pro/services/edit/${serviceId}`);
  };

  function showError(message) {
    // You could implement a toast notification here
    console.error(message);
  }
}

export default renderProfessionalDashboardPage;