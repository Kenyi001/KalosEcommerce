/**
 * Marketplace Page - Main home page for authenticated users
 * Shows available professionals and services
 */

import { renderWithLayout, initializeLayout } from '../components/Layout.js';
import { professionalService } from '../services/professionals.js';
import { authService } from '../services/auth.js';
import { navigateTo } from '../utils/router.js';
import { ProfessionalCard } from '../components/professionals/ProfessionalCard.js';
import SearchService from '../services/SearchService.js';
import SearchBar from '../components/search/SearchBar.js';
import SearchFilters from '../components/search/SearchFilters.js';

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
            <div id="searchBarContainer"></div>
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
            <div id="searchFiltersContainer" class="sticky top-24"></div>
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
  let searchBar = null;
  let searchFilters = null;
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
  initializeSearchComponents();
  setupEventListeners();

  async function loadProfessionals() {
    try {
      showLoadingState();
      

      
      // Always try to load from Firebase first
      let professionals = [];
      try {
        const result = await professionalService.searchProfessionals({
          published: true,
          verified: true
        }, {
          limit: 50 // Load more for client-side filtering
        });
        
        if (result.success && result.data.length > 0) {
          professionals = result.data.map(prof => ({
            id: prof.id,
            handle: prof.handle || prof.id,
            userId: prof.userId,
            name: prof.personalInfo?.firstName || prof.name,
            email: prof.email,
            phone: prof.phone,
            location: prof.location,
            bio: prof.businessInfo?.bio || prof.bio,
            specialties: prof.businessInfo?.categories || prof.specialties,
            experience: prof.businessInfo?.experienceYears || prof.experience,
            rating: prof.stats?.averageRating || prof.rating || 4.5,
            completedBookings: prof.stats?.completedBookings || prof.completedBookings || 0,
            verified: prof.verification?.status === 'approved' || prof.verified,
            featured: prof.featured || false,
            published: prof.status === 'active' || prof.published,
            services: prof.services || [],
            businessInfo: prof.businessInfo,
            personalInfo: prof.personalInfo,
            stats: prof.stats
          }));

        } else {
          throw new Error('No professionals found in Firebase');
        }
      } catch (error) {
        console.warn('⚠️ Error loading from Firebase:', error);
        
        // Fallback to demo data only if Firebase fails
      if (import.meta.env.DEV) {
        try {
          const demoProfessionals = localStorage.getItem('demoProfessionals');
          if (demoProfessionals) {
            const demoProfessionalsData = JSON.parse(demoProfessionals);
            professionals = demoProfessionalsData.map(prof => ({
              id: prof.id,
                handle: prof.handle || prof.id,
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
                services: prof.services || [],
                businessInfo: prof.businessInfo || {},
                personalInfo: prof.personalInfo || {},
                stats: prof.stats || {}
              }));

            }
          } catch (demoError) {
            console.warn('⚠️ Error loading demo professionals:', demoError);
          }
        }
        
        // If no data available, create minimal fallback
        if (professionals.length === 0) {
          professionals = createFallbackProfessionals();

        }
      }
      
      window.loadedProfessionals = professionals; // Store globally for filtering
      filteredProfessionals = professionals; // Initialize filtered list
      renderProfessionals();
      
    } catch (error) {
      console.error('Error loading professionals:', error);
      showEmptyState();
    } finally {
      hideLoadingState();
    }
  }

  function createFallbackProfessionals() {
    return [
      {
        id: 'maria-gonzalez',
        handle: 'maria-gonzalez',
        name: 'María González',
        location: { city: 'Santa Cruz', department: 'Santa Cruz' },
        businessInfo: {
          businessName: 'María González Beauty',
          description: 'Especialista en Maquillaje y Peinado',
          categories: ['makeup', 'hair'],
          experienceYears: 5
        },
        personalInfo: {
          firstName: 'María González',
          profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
        },
        stats: {
          averageRating: 4.8,
          totalReviews: 127,
          completedBookings: 156
        },
        verification: { status: 'approved' },
        status: 'active',
        verified: true,
        published: true,
        featured: true
      }
    ];
  }

  function initializeSearchComponents() {
    // Initialize SearchBar
    const searchBarContainer = document.getElementById('searchBarContainer');
    if (searchBarContainer) {
      searchBar = new SearchBar(searchBarContainer, {
        placeholder: '¿Qué servicio necesitas? (ej: corte, manicure, maquillaje)',
        onSearch: performSearch,
        onSuggestionSelect: (query, suggestion) => {
          console.log('Suggestion selected:', query, suggestion);
          performSearch(query);
        }
      });
    }

    // Initialize SearchFilters
    const filtersContainer = document.getElementById('searchFiltersContainer');
    if (filtersContainer) {
      searchFilters = new SearchFilters(filtersContainer, {
        onFiltersChange: applySearchFilters,
        defaultFilters: {}
      });
    }
  }

  async function performSearch(query) {
    if (!query) {
      // If no query, show all professionals
      filteredProfessionals = professionals;
      renderProfessionals();
      return;
    }

    try {
      showLoadingState();
      
      // Track search analytics
      SearchService.trackSearch(query);
      
      // Perform search using SearchService
      const searchOptions = {
        location: currentFilters.location?.coordinates ? {
          lat: currentFilters.location.coordinates.lat,
          lng: currentFilters.location.coordinates.lng,
          radius: currentFilters.location.radius || 10
        } : null,
        limit: 50
      };

      const searchResults = await SearchService.search(query, getSearchFilters(), searchOptions);
      
      if (searchResults.results) {
        filteredProfessionals = searchResults.results;
        currentPage = 1;
        renderProfessionals();
        
        // Update results count with search context
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
          resultsCount.textContent = `${searchResults.results.length} profesionales encontrados para "${query}"`;
        }
      }
      
    } catch (error) {
      console.error('Error performing search:', error);
      showEmptyState();
    } finally {
      hideLoadingState();
    }
  }

  function getSearchFilters() {
    return {
      categories: currentFilters.category ? [currentFilters.category] : [],
      priceRange: currentFilters.priceRange ? parsePriceRange(currentFilters.priceRange) : {},
      rating: currentFilters.rating ? parseFloat(currentFilters.rating) : null,
      location: currentFilters.location,
      availability: {
        date: null,
        timeSlots: []
      }
    };
  }

  function parsePriceRange(rangeStr) {
    if (!rangeStr) return {};
    
    if (rangeStr === '500+') {
      return { min: 500 };
    }
    
    const [min, max] = rangeStr.split('-').map(Number);
    return { min, max };
  }

  function applySearchFilters(filters) {
    console.log('Applying search filters:', filters);
    
    // Update current filters from SearchFilters component
    currentFilters = {
      ...currentFilters,
      category: filters.categories.length > 0 ? filters.categories[0] : '',
      priceRange: filters.priceRange,
      rating: filters.rating,
      location: filters.location,
      homeService: filters.availability?.timeSlots?.includes('home') || false,
      inShop: filters.availability?.timeSlots?.includes('shop') || false,
      sortBy: filters.sortBy || 'relevance'
    };
    
    // Perform new search with updated filters
    const currentQuery = searchBar ? searchBar.getValue() : '';
    if (currentQuery) {
      performSearch(currentQuery);
    } else {
      // Apply filters to current professionals list
      applyFilters();
      renderProfessionals();
    }
  }

  function setupEventListeners() {
    // Legacy search elements no longer exist, search is handled by SearchBar component
    
    // Quick filters (category buttons) - these still exist in the UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Apply filter - update search filters if available
        currentFilters.category = e.target.dataset.category;
        currentPage = 1;
        
        if (searchFilters) {
          // Update SearchFilters component
          const newFilters = searchFilters.getFilters();
          newFilters.categories = e.target.dataset.category ? [e.target.dataset.category] : [];
          searchFilters.setFilters(newFilters);
        } else {
          // Fallback to old filtering
          applyFilters();
          renderProfessionals();
        }
      });
    });
    
    // Sort dropdown
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentFilters.sortBy = e.target.value;
        if (searchFilters) {
          const newFilters = searchFilters.getFilters();
          newFilters.sortBy = e.target.value;
          searchFilters.setFilters(newFilters);
        } else {
          applyFilters();
          renderProfessionals();
        }
      });
    }
    
    // Load more
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', loadMoreProfessionals);
    }
    
    // Filter toggle (mobile)
    const filterToggle = document.getElementById('filterToggle');
    if (filterToggle) {
      filterToggle.addEventListener('click', () => {
        const sidebar = document.getElementById('filtersSidebar');
        if (sidebar) {
          sidebar.classList.toggle('hidden');
        }
      });
    }
    
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

  // handleSearch removed - handled by SearchBar component

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
    card.onclick = () => navigateTo(`/pro/${professional.handle || professional.id}`);
    
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
    
    // Reset SearchBar and SearchFilters components
    if (searchBar) {
      searchBar.setValue('');
    }
    
    if (searchFilters) {
      searchFilters.setFilters({
        categories: [],
        priceRange: { min: null, max: null },
        rating: null,
        location: {
          radius: null,
          coordinates: null,
          city: null
        },
        availability: {
          date: null,
          timeSlots: []
        },
        sortBy: 'relevance'
      });
    }
    
    // Reset UI elements that still exist
    const sortBy = document.getElementById('sortBy');
    if (sortBy) sortBy.value = 'rating';
    
    // Reset category buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const allCategoryBtn = document.querySelector('.filter-btn[data-category=""]');
    if (allCategoryBtn) allCategoryBtn.classList.add('active');
    
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