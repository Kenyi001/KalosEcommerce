/**
 * Marketplace Page - Main home page for authenticated users
 * Shows available professionals and services
 */

import { renderWithLayout, initializeLayout } from '../components/Layout.js';
import { professionalService } from '../services/professionals.js';
import { authService } from '../services/auth.js';
import { navigateTo } from '../utils/router.js';
import { ProfessionalCard } from '../components/professionals/ProfessionalCard.js';

export function renderMarketplacePage() {
  const content = `
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-brand to-deep-coral text-white py-16">
        <div class="max-w-6xl mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-display font-bold mb-4">
            Encuentra tu Profesional Ideal
          </h1>
          <p class="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Conecta con los mejores profesionales de belleza verificados en Bolivia
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <input
                type="text"
                id="searchInput"
                placeholder="¿Qué servicio necesitas? (ej: corte, manicure, maquillaje)"
                class="w-full px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
              />
              <button id="searchBtn" class="absolute right-2 top-2 bg-brand text-white px-6 py-2 rounded-full hover:bg-brand-hover transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Filters -->
      <section class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex space-x-2 overflow-x-auto">
              <button class="filter-btn active" data-category="">Todos</button>
              <button class="filter-btn" data-category="hair">Cabello</button>
              <button class="filter-btn" data-category="nails">Uñas</button>
              <button class="filter-btn" data-category="makeup">Maquillaje</button>
              <button class="filter-btn" data-category="skincare">Cuidado de piel</button>
              <button class="filter-btn" data-category="massage">Masajes</button>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Nueva Reserva Button (for customers) -->
              <button 
                id="newBookingBtn" 
                class="customer-only bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-hover transition-colors font-medium shadow-lg hidden">
                ✨ Nueva Reserva
              </button>
              
              <select id="sortBy" class="text-sm border border-gray-300 rounded-lg px-3 py-2">
                <option value="rating">Mejor valorados</option>
                <option value="distance">Más cercanos</option>
                <option value="price">Precio menor</option>
                <option value="recent">Más recientes</option>
              </select>
              
              <button id="filterToggle" class="text-sm bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                </svg>
                Filtros
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex gap-8">
          <!-- Filters Sidebar -->
          <div id="filtersSidebar" class="hidden lg:block w-64 flex-shrink-0">
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 class="text-lg font-semibold text-navy mb-4">Filtros</h3>
              
              <!-- Location Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <select id="locationFilter" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Toda Bolivia</option>
                  <option value="la-paz">La Paz</option>
                  <option value="santa-cruz">Santa Cruz</option>
                  <option value="cochabamba">Cochabamba</option>
                  <option value="sucre">Sucre</option>
                </select>
              </div>
              
              <!-- Price Range -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Rango de precios</label>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <input type="radio" name="price" value="" id="price-all" class="mr-2">
                    <label for="price-all" class="text-sm">Cualquier precio</label>
                  </div>
                  <div class="flex items-center">
                    <input type="radio" name="price" value="0-100" id="price-1" class="mr-2">
                    <label for="price-1" class="text-sm">Hasta 100 BOB</label>
                  </div>
                  <div class="flex items-center">
                    <input type="radio" name="price" value="100-250" id="price-2" class="mr-2">
                    <label for="price-2" class="text-sm">100 - 250 BOB</label>
                  </div>
                  <div class="flex items-center">
                    <input type="radio" name="price" value="250-500" id="price-3" class="mr-2">
                    <label for="price-3" class="text-sm">250 - 500 BOB</label>
                  </div>
                  <div class="flex items-center">
                    <input type="radio" name="price" value="500+" id="price-4" class="mr-2">
                    <label for="price-4" class="text-sm">500+ BOB</label>
                  </div>
                </div>
              </div>
              
              <!-- Service Type -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de servicio</label>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <input type="checkbox" id="home-service" class="mr-2">
                    <label for="home-service" class="text-sm">A domicilio</label>
                  </div>
                  <div class="flex items-center">
                    <input type="checkbox" id="in-shop" class="mr-2">
                    <label for="in-shop" class="text-sm">En local</label>
                  </div>
                </div>
              </div>
              
              <!-- Rating Filter -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Calificación mínima</label>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <input type="radio" name="rating" value="" id="rating-all" class="mr-2">
                    <label for="rating-all" class="text-sm">Cualquier calificación</label>
                  </div>
                  <div class="flex items-center">
                    <input type="radio" name="rating" value="4" id="rating-4" class="mr-2">
                    <label for="rating-4" class="text-sm flex items-center">
                      4+ <span class="text-yellow-400 ml-1">★★★★☆</span>
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input type="radio" name="rating" value="4.5" id="rating-45" class="mr-2">
                    <label for="rating-45" class="text-sm flex items-center">
                      4.5+ <span class="text-yellow-400 ml-1">★★★★★</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Area -->
          <div class="flex-1">
            <!-- Results Header -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-navy">Profesionales Disponibles</h2>
                <p id="resultsCount" class="text-gray-600 mt-1">Cargando profesionales...</p>
              </div>
            </div>

            <!-- Loading State -->
            <div id="loadingState" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div class="animate-pulse">
                <div class="bg-white rounded-lg p-6 shadow-sm">
                  <div class="h-32 bg-gray-200 rounded mb-4"></div>
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div class="animate-pulse">
                <div class="bg-white rounded-lg p-6 shadow-sm">
                  <div class="h-32 bg-gray-200 rounded mb-4"></div>
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div class="animate-pulse">
                <div class="bg-white rounded-lg p-6 shadow-sm">
                  <div class="h-32 bg-gray-200 rounded mb-4"></div>
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="hidden text-center py-16">
              <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <h3 class="text-xl font-semibold text-gray-600 mb-4">No encontramos profesionales</h3>
              <p class="text-gray-500 mb-6">Intenta cambiar los filtros o buscar en otra ubicación</p>
              <button id="clearFiltersBtn" class="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-hover transition-colors">
                Limpiar Filtros
              </button>
            </div>

            <!-- Professionals Grid -->
            <div id="professionalsGrid" class="hidden grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <!-- Professionals will be populated here -->
            </div>

            <!-- Load More -->
            <div id="loadMoreContainer" class="hidden text-center mt-8">
              <button id="loadMoreBtn" class="bg-white text-brand border border-brand px-6 py-3 rounded-lg hover:bg-brand hover:text-white transition-colors">
                Cargar Más Profesionales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: 'Marketplace - Kalos',
    showHeader: true,
    showFooter: true
  });
}

export function initializeMarketplacePage() {
  initializeLayout();
  
  let professionals = [];
  let filteredProfessionals = [];
  let currentFilters = {
    search: '',
    category: '',
    location: '',
    priceRange: '',
    rating: '',
    homeService: false,
    inShop: false,
    sortBy: 'rating'
  };
  let currentPage = 1;
  const itemsPerPage = 12;
  
  // Initialize page
  loadProfessionals();
  setupEventListeners();

  async function loadProfessionals() {
    try {
      showLoadingState();
      
      let professionals = [];
      let useDemo = false;
      
      // In development mode, try to load demo professionals first
      if (import.meta.env.DEV) {
        try {
          const demoProfessionals = localStorage.getItem('demoProfessionals');
          if (demoProfessionals) {
            const demoProfessionalsData = JSON.parse(demoProfessionals);
            professionals = demoProfessionalsData.map(prof => ({
              id: prof.id,
              userId: prof.userId,
              name: prof.name,
              email: prof.email,
              phone: prof.phone,
              location: prof.location,
              bio: prof.bio,
              specialties: prof.specialties,
              experience: prof.experience,
              rating: prof.rating,
              completedBookings: prof.completedBookings,
              verified: prof.verified,
              featured: prof.featured,
              published: prof.published,
              services: prof.services || []
            }));
            useDemo = true;
            console.log('🎭 Loaded professionals from demo data:', professionals.length);
          }
        } catch (error) {
          console.warn('⚠️ Error loading demo professionals:', error);
        }
      }
      
      // Fallback to Firebase if no demo data
      if (!useDemo) {
        const result = await professionalService.searchProfessionals({
          published: true,
          verified: true
        }, {
          limit: 50 // Load more for client-side filtering
        });
        
        if (result.success) {
          professionals = result.data;
        } else {
          throw new Error(result.error);
        }
      }
      
      window.loadedProfessionals = professionals; // Store globally for filtering
      applyFilters();
      renderProfessionals();
      
    } catch (error) {
      console.error('Error loading professionals:', error);
      showEmptyState();
    } finally {
      hideLoadingState();
    }
  }

  function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
    
    // Quick filters (category buttons)
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Apply filter
        currentFilters.category = e.target.dataset.category;
        currentPage = 1;
        applyFilters();
        renderProfessionals();
      });
    });
    
    // Sort
    document.getElementById('sortBy').addEventListener('change', (e) => {
      currentFilters.sortBy = e.target.value;
      applyFilters();
      renderProfessionals();
    });
    
    // Sidebar filters
    document.getElementById('locationFilter').addEventListener('change', (e) => {
      currentFilters.location = e.target.value;
      applyFilters();
      renderProfessionals();
    });
    
    // Price filters
    document.querySelectorAll('input[name="price"]').forEach(input => {
      input.addEventListener('change', (e) => {
        currentFilters.priceRange = e.target.value;
        applyFilters();
        renderProfessionals();
      });
    });
    
    // Rating filters
    document.querySelectorAll('input[name="rating"]').forEach(input => {
      input.addEventListener('change', (e) => {
        currentFilters.rating = e.target.value;
        applyFilters();
        renderProfessionals();
      });
    });
    
    // Service type checkboxes
    document.getElementById('home-service').addEventListener('change', (e) => {
      currentFilters.homeService = e.target.checked;
      applyFilters();
      renderProfessionals();
    });
    
    document.getElementById('in-shop').addEventListener('change', (e) => {
      currentFilters.inShop = e.target.checked;
      applyFilters();
      renderProfessionals();
    });
    
    // Clear filters
    document.getElementById('clearFiltersBtn').addEventListener('click', clearAllFilters);
    
    // Load more
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', loadMoreProfessionals);
    }
    
    // Filter toggle (mobile)
    document.getElementById('filterToggle').addEventListener('click', () => {
      const sidebar = document.getElementById('filtersSidebar');
      sidebar.classList.toggle('hidden');
    });
    
    // Nueva Reserva button
    const newBookingBtn = document.getElementById('newBookingBtn');
    if (newBookingBtn) {
      newBookingBtn.addEventListener('click', () => {
        navigateTo('/booking/new');
      });
    }
    
    // Show/hide booking button based on user role
    checkUserRoleAndShowButtons();
  }

  function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    currentFilters.search = searchTerm;
    currentPage = 1;
    applyFilters();
    renderProfessionals();
  }

  function applyFilters() {
    filteredProfessionals = professionals.filter(professional => {
      // Search filter
      if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        const matchesSearch = 
          professional.businessInfo?.businessName?.toLowerCase().includes(searchTerm) ||
          professional.businessInfo?.description?.toLowerCase().includes(searchTerm) ||
          professional.businessInfo?.categories?.some(cat => cat.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (currentFilters.category) {
        if (!professional.businessInfo?.categories?.includes(currentFilters.category)) {
          return false;
        }
      }
      
      // Location filter
      if (currentFilters.location) {
        const locationMatch = professional.location?.department?.toLowerCase().replace(' ', '-') === currentFilters.location;
        if (!locationMatch) return false;
      }
      
      // Rating filter
      if (currentFilters.rating) {
        const minRating = parseFloat(currentFilters.rating);
        if ((professional.stats?.averageRating || 0) < minRating) return false;
      }
      
      // Service type filters
      if (currentFilters.homeService && !professional.location?.homeService) return false;
      if (currentFilters.inShop && !professional.location?.inShop) return false;
      
      return true;
    });
    
    // Apply sorting
    switch (currentFilters.sortBy) {
      case 'rating':
        filteredProfessionals.sort((a, b) => (b.stats?.averageRating || 0) - (a.stats?.averageRating || 0));
        break;
      case 'price':
        // This would need service price data - placeholder for now
        break;
      case 'distance':
        // This would need location calculation - placeholder for now
        break;
      case 'recent':
        filteredProfessionals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
  }

  function renderProfessionals() {
    const grid = document.getElementById('professionalsGrid');
    const emptyState = document.getElementById('emptyState');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const resultsCount = document.getElementById('resultsCount');
    
    // Update results count
    resultsCount.textContent = `${filteredProfessionals.length} profesionales encontrados`;
    
    if (filteredProfessionals.length === 0) {
      grid.classList.add('hidden');
      emptyState.classList.remove('hidden');
      loadMoreContainer.classList.add('hidden');
      return;
    }
    
    // Show grid
    emptyState.classList.add('hidden');
    grid.classList.remove('hidden');
    
    // Calculate pagination
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const visibleProfessionals = filteredProfessionals.slice(startIndex, endIndex);
    
    // Render professionals
    grid.innerHTML = '';
    visibleProfessionals.forEach(professional => {
      const card = createProfessionalCard(professional);
      grid.appendChild(card);
    });
    
    // Show/hide load more
    if (endIndex < filteredProfessionals.length) {
      loadMoreContainer.classList.remove('hidden');
    } else {
      loadMoreContainer.classList.add('hidden');
    }
  }

  function createProfessionalCard(professional) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden';
    card.onclick = () => navigateTo(`/professionals/${professional.id}`);
    
    const businessName = professional.businessInfo?.businessName || 'Profesional';
    const location = `${professional.location?.city || ''}, ${professional.location?.department || ''}`.replace(/^,\s*|,\s*$/g, '');
    const rating = professional.stats?.averageRating || 0;
    const reviewCount = professional.stats?.reviewCount || 0;
    const categories = professional.businessInfo?.categories || [];
    
    const profileImage = professional.personalInfo?.profileImage || '/images/default-avatar.png';
    
    card.innerHTML = `
      <div class="h-48 bg-gradient-to-br from-brand/20 to-deep-coral/20 relative">
        ${profileImage !== '/images/default-avatar.png' ? 
          `<img src="${profileImage}" alt="${businessName}" class="w-full h-full object-cover">` :
          `<div class="w-full h-full flex items-center justify-center">
             <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center">
               <span class="text-2xl">💄</span>
             </div>
           </div>`
        }
        ${professional.verification?.verified ? 
          '<div class="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">✓ Verificado</div>' : 
          ''
        }
      </div>
      
      <div class="p-6">
        <h3 class="text-lg font-semibold text-navy mb-1">${businessName}</h3>
        <p class="text-gray-500 text-sm mb-3">${location}</p>
        
        <div class="flex items-center mb-3">
          <div class="flex text-yellow-400 text-sm mr-2">
            ${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}
          </div>
          <span class="text-gray-600 text-sm">${rating.toFixed(1)} (${reviewCount})</span>
        </div>
        
        <div class="flex flex-wrap gap-1 mb-4">
          ${categories.slice(0, 3).map(category => 
            `<span class="inline-block bg-brand/10 text-brand text-xs px-2 py-1 rounded">${getCategoryName(category)}</span>`
          ).join('')}
          ${categories.length > 3 ? `<span class="text-xs text-gray-500">+${categories.length - 3}</span>` : ''}
        </div>
        
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            ${professional.location?.homeService ? '🏠 A domicilio' : ''}
            ${professional.location?.homeService && professional.location?.inShop ? ' • ' : ''}
            ${professional.location?.inShop ? '🏪 En local' : ''}
          </div>
          <button class="text-brand hover:text-brand-hover text-sm font-medium">
            Ver perfil →
          </button>
        </div>
      </div>
    `;
    
    return card;
  }

  function loadMoreProfessionals() {
    currentPage++;
    renderProfessionals();
  }

  function clearAllFilters() {
    // Reset filters
    currentFilters = {
      search: '',
      category: '',
      location: '',
      priceRange: '',
      rating: '',
      homeService: false,
      inShop: false,
      sortBy: 'rating'
    };
    currentPage = 1;
    
    // Reset UI
    document.getElementById('searchInput').value = '';
    document.getElementById('sortBy').value = 'rating';
    document.getElementById('locationFilter').value = '';
    document.querySelectorAll('input[name="price"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);
    document.getElementById('home-service').checked = false;
    document.getElementById('in-shop').checked = false;
    
    // Reset category buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-category=""]').classList.add('active');
    
    // Apply and render
    applyFilters();
    renderProfessionals();
  }

  function showLoadingState() {
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('professionalsGrid').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
  }

  function hideLoadingState() {
    document.getElementById('loadingState').classList.add('hidden');
  }

  function showEmptyState() {
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('professionalsGrid').classList.add('hidden');
    document.getElementById('loadMoreContainer').classList.add('hidden');
  }

  function getCategoryName(categoryKey) {
    const categories = {
      hair: 'Cabello',
      nails: 'Uñas',  
      makeup: 'Maquillaje',
      skincare: 'Cuidado de piel',
      massage: 'Masajes',
      eyebrows: 'Cejas',
      eyelashes: 'Pestañas'
    };
    
    return categories[categoryKey] || categoryKey;
  }

  async function checkUserRoleAndShowButtons() {
    try {
      const { user, profile } = await authService.waitForAuth();
      
      const newBookingBtn = document.getElementById('newBookingBtn');
      
      if (user && profile && newBookingBtn) {
        // Show booking button for customers or users with customer role
        if (profile.activeRole === 'customer' || 
            (profile.availableRoles && profile.availableRoles.includes('customer'))) {
          newBookingBtn.classList.remove('hidden');
          console.log('🎯 Showing booking button for customer user');
        } else {
          newBookingBtn.classList.add('hidden');
          console.log('🎯 Hiding booking button for professional-only user');
        }
      } else {
        // Hide booking button for non-authenticated users
        if (newBookingBtn) {
          newBookingBtn.classList.add('hidden');
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  }
}

export default renderMarketplacePage;