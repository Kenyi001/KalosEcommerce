/**
 * Professionals List Page
 * Displays a searchable and filterable list of professionals
 */
import { professionalService } from '../../services/professionals.js';
import { ProfessionalCard } from '../../components/professionals/ProfessionalCard.js';
import { SERVICE_CATEGORIES, LOCATIONS } from '../../models/professional.js';

export class ProfessionalsListPage {
  constructor() {
    this.state = {
      professionals: [],
      loading: false,
      error: null,
      filters: {
        category: '',
        department: '',
        city: '',
        minRating: 0,
        sortBy: 'stats.averageRating',
        sortOrder: 'desc'
      },
      pagination: {
        hasMore: true,
        lastDoc: null,
        currentPage: 1
      },
      searchTerm: ''
    };

    this.loadProfessionals = this.loadProfessionals.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  async loadProfessionals(append = false) {
    try {
      this.setState({ loading: true, error: null });

      const result = await professionalService.searchProfessionals(
        this.state.filters,
        {
          limit: 12,
          startAfterDoc: append ? this.state.pagination.lastDoc : null
        }
      );

      this.setState({
        professionals: append ? 
          [...this.state.professionals, ...result.professionals] : 
          result.professionals,
        pagination: {
          hasMore: result.hasMore,
          lastDoc: result.lastDoc,
          currentPage: append ? this.state.pagination.currentPage + 1 : 1
        },
        loading: false
      });

    } catch (error) {
      console.error('Error loading professionals:', error);
      this.setState({
        error: 'Error al cargar los profesionales. Inténtalo de nuevo.',
        loading: false
      });
    }
  }

  handleFilterChange(filterKey, value) {
    this.setState({
      filters: {
        ...this.state.filters,
        [filterKey]: value
      }
    });

    // Reset pagination and reload
    this.setState({
      pagination: {
        hasMore: true,
        lastDoc: null,
        currentPage: 1
      }
    });

    // Debounce the search
    setTimeout(() => {
      this.loadProfessionals();
    }, 300);
  }

  handleSearch(searchTerm) {
    this.setState({ searchTerm });
    // TODO: Implement text search (would require Algolia or similar)
  }

  handleLoadMore() {
    if (this.state.pagination.hasMore && !this.state.loading) {
      this.loadProfessionals(true);
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    const { professionals, loading, error, filters, pagination, searchTerm } = this.state;

    return `
      <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 class="text-3xl font-fraunces font-bold text-navy-900">
                  Profesionales de Belleza
                </h1>
                <p class="mt-1 text-gray-600">
                  Encuentra el profesional perfecto para tus necesidades de belleza
                </p>
              </div>
              
              <!-- Search Bar -->
              <div class="mt-4 md:mt-0 md:ml-6">
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Buscar profesionales..."
                    class="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    value="${searchTerm}"
                    id="search-input">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="bg-white border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex flex-wrap gap-4 items-center">
              <!-- Category Filter -->
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent"
                  id="category-filter">
                  <option value="">Todas las categorías</option>
                  ${Object.entries(SERVICE_CATEGORIES).map(([key, value]) => `
                    <option value="${value}" ${filters.category === value ? 'selected' : ''}>
                      ${this._formatCategoryName(value)}
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Department Filter -->
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent"
                  id="department-filter">
                  <option value="">Todos los departamentos</option>
                  ${LOCATIONS.departments.map(dept => `
                    <option value="${dept}" ${filters.department === dept ? 'selected' : ''}>${dept}</option>
                  `).join('')}
                </select>
              </div>

              <!-- City Filter -->
              <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <select 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent"
                  id="city-filter">
                  <option value="">Todas las ciudades</option>
                  ${this._getCitiesForDepartment(filters.department).map(city => `
                    <option value="${city}" ${filters.city === city ? 'selected' : ''}>${city}</option>
                  `).join('')}
                </select>
              </div>

              <!-- Rating Filter -->
              <div class="flex-1 min-w-[150px]">
                <label class="block text-sm font-medium text-gray-700 mb-1">Calificación mínima</label>
                <select 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent"
                  id="rating-filter">
                  <option value="0" ${filters.minRating === 0 ? 'selected' : ''}>Cualquiera</option>
                  <option value="3" ${filters.minRating === 3 ? 'selected' : ''}>3+ estrellas</option>
                  <option value="4" ${filters.minRating === 4 ? 'selected' : ''}>4+ estrellas</option>
                  <option value="4.5" ${filters.minRating === 4.5 ? 'selected' : ''}>4.5+ estrellas</option>
                </select>
              </div>

              <!-- Sort Filter -->
              <div class="flex-1 min-w-[150px]">
                <label class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                <select 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-transparent"
                  id="sort-filter">
                  <option value="stats.averageRating-desc" ${filters.sortBy === 'stats.averageRating' && filters.sortOrder === 'desc' ? 'selected' : ''}>
                    Mejor calificados
                  </option>
                  <option value="stats.totalReviews-desc" ${filters.sortBy === 'stats.totalReviews' && filters.sortOrder === 'desc' ? 'selected' : ''}>
                    Más reseñas
                  </option>
                  <option value="createdAt-desc" ${filters.sortBy === 'createdAt' && filters.sortOrder === 'desc' ? 'selected' : ''}>
                    Más recientes
                  </option>
                  <option value="createdAt-asc" ${filters.sortBy === 'createdAt' && filters.sortOrder === 'asc' ? 'selected' : ''}>
                    Más antiguos
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Results Count -->
          <div class="mb-6">
            <p class="text-gray-600">
              ${loading ? 'Cargando...' : `${professionals.length} profesional${professionals.length !== 1 ? 'es' : ''} encontrado${professionals.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <!-- Error State -->
          ${error ? `
            <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">${error}</p>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Professionals Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="professionals-grid">
            ${loading && professionals.length === 0 ? this._renderSkeletonCards() : ''}
          </div>

          <!-- Load More Button -->
          ${pagination.hasMore && professionals.length > 0 ? `
            <div class="text-center mt-8">
              <button 
                id="load-more-btn" 
                class="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}"
                ${loading ? 'disabled' : ''}>
                ${loading ? 'Cargando...' : 'Cargar más profesionales'}
              </button>
            </div>
          ` : ''}

          <!-- Empty State -->
          ${!loading && professionals.length === 0 && !error ? `
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron profesionales</h3>
              <p class="mt-1 text-sm text-gray-500">Intenta ajustar tus filtros para ver más resultados.</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Filter selects
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.handleFilterChange('category', e.target.value);
      });
    }

    const departmentFilter = document.getElementById('department-filter');
    if (departmentFilter) {
      departmentFilter.addEventListener('change', (e) => {
        this.handleFilterChange('department', e.target.value);
        // Reset city when department changes
        this.handleFilterChange('city', '');
      });
    }

    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
      cityFilter.addEventListener('change', (e) => {
        this.handleFilterChange('city', e.target.value);
      });
    }

    const ratingFilter = document.getElementById('rating-filter');
    if (ratingFilter) {
      ratingFilter.addEventListener('change', (e) => {
        this.handleFilterChange('minRating', parseFloat(e.target.value));
      });
    }

    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        const [sortBy, sortOrder] = e.target.value.split('-');
        this.handleFilterChange('sortBy', sortBy);
        this.handleFilterChange('sortOrder', sortOrder);
      });
    }

    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', this.handleLoadMore);
    }

    // Render professional cards
    this.renderProfessionalCards();
  }

  renderProfessionalCards() {
    const grid = document.getElementById('professionals-grid');
    if (!grid || this.state.loading) return;

    // Clear existing cards (except skeletons during loading)
    if (!this.state.loading) {
      grid.innerHTML = '';
    }

    // Render professional cards
    this.state.professionals.forEach(professional => {
      const card = ProfessionalCard.create(professional);
      card.mount(grid);
    });
  }

  _renderSkeletonCards() {
    return Array(8).fill(0).map(() => `
      <div class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div class="h-48 bg-gray-200"></div>
        <div class="p-4">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div class="flex space-x-1 mb-3">
            <div class="h-5 bg-gray-200 rounded-full w-16"></div>
            <div class="h-5 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div class="h-3 bg-gray-200 rounded mb-3"></div>
          <div class="flex justify-between">
            <div class="h-3 bg-gray-200 rounded w-20"></div>
            <div class="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div class="flex space-x-2 mt-4">
            <div class="flex-1 h-8 bg-gray-200 rounded"></div>
            <div class="flex-1 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  _formatCategoryName(category) {
    const categoryNames = {
      hair: 'Cabello',
      nails: 'Uñas',
      makeup: 'Maquillaje',
      skincare: 'Cuidado de piel',
      massage: 'Masajes',
      eyebrows: 'Cejas',
      eyelashes: 'Pestañas'
    };
    
    return categoryNames[category] || category;
  }

  _getCitiesForDepartment(department) {
    if (!department || !LOCATIONS.cities[department]) {
      return [];
    }
    return LOCATIONS.cities[department];
  }

  mount(container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    
    container.innerHTML = this.render();
    this.attachEvents();

    // Load initial data
    this.loadProfessionals();
  }

  unmount() {
    // Cleanup any event listeners if needed
  }

  static create() {
    return new ProfessionalsListPage();
  }
}

export default ProfessionalsListPage;