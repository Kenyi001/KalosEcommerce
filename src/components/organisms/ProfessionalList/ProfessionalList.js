/**
 * Professional List Organism Component - Kalos Design System
 * Complete professional listing with advanced filtering
 */

import { BaseComponent } from '../../BaseComponent.js';
import { ServiceCard } from '../../molecules/Card/Card.js';
import { SearchBar } from '../../molecules/SearchBar/SearchBar.js';
import { Pagination } from '../../molecules/Navigation/Navigation.js';
import { Spinner } from '../../atoms/Loading/Loading.js';
import { renderIcon } from '../../atoms/Icon/Icon.js';

export class ProfessionalList extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      professionals: [],       // Array of professional data
      services: [],           // All services for filtering
      categories: [],         // Available categories
      locations: [],          // Available locations
      searchQuery: '',
      filters: {
        category: '',
        location: '',
        priceRange: { min: '', max: '' },
        rating: '',
        availability: ''
      },
      sortBy: 'rating',       // rating, price, name, reviews
      sortOrder: 'desc',      // asc, desc
      itemsPerPage: 12,
      currentPage: 1,
      totalCount: 0,
      loading: false,
      showSearch: true,
      showFilters: true,
      showSort: true,
      viewMode: 'grid',       // grid, list
      onSearch: () => {},
      onFilter: () => {},
      onSort: () => {},
      onPageChange: () => {},
      onProfessionalClick: () => {},
      onServiceBook: () => {},
      className: '',
      ...props
    };

    this.state = {
      searchQuery: this.props.searchQuery,
      filters: { ...this.props.filters },
      sortBy: this.props.sortBy,
      sortOrder: this.props.sortOrder,
      viewMode: this.props.viewMode,
      currentPage: this.props.currentPage
    };

    this.components = new Map();
  }

  render() {
    const { 
      professionals, 
      totalCount,
      loading, 
      showSearch, 
      showFilters, 
      showSort, 
      className 
    } = this.props;

    const { viewMode } = this.state;

    return `
      <div class="professional-list ${className}" data-component="professional-list">
        ${showSearch ? `
          <div class="professional-list-search">
            <div id="search-bar-container"></div>
          </div>
        ` : ''}

        <div class="professional-list-header">
          <div class="professional-list-results">
            <span class="results-count">
              ${loading ? 'Cargando...' : `${totalCount} profesionales encontrados`}
            </span>
          </div>

          <div class="professional-list-controls">
            ${showSort ? `
              <div class="sort-controls">
                <label class="sort-label">Ordenar por:</label>
                <select class="sort-select">
                  <option value="rating-desc">Mayor calificación</option>
                  <option value="rating-asc">Menor calificación</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                  <option value="reviews-desc">Más reseñas</option>
                </select>
              </div>
            ` : ''}

            <div class="view-controls">
              <button class="view-toggle ${viewMode === 'grid' ? 'active' : ''}" data-view="grid" aria-label="Vista en grilla">
                ${renderIcon('grid', { size: '16' })}
              </button>
              <button class="view-toggle ${viewMode === 'list' ? 'active' : ''}" data-view="list" aria-label="Vista en lista">
                ${renderIcon('list', { size: '16' })}
              </button>
            </div>
          </div>
        </div>

        ${showFilters ? `
          <div class="professional-list-filters">
            ${this.renderActiveFilters()}
          </div>
        ` : ''}

        <div class="professional-list-content">
          ${loading ? `
            <div class="professional-list-loading">
              <div id="loading-spinner"></div>
              <p>Buscando profesionales...</p>
            </div>
          ` : professionals.length > 0 ? `
            <div class="professional-list-grid professional-list-${viewMode}">
              ${professionals.map((professional, index) => `
                <div class="professional-list-item" data-professional-id="${professional.id}">
                  <div id="professional-card-${index}"></div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="professional-list-empty">
              <div class="empty-icon">
                ${renderIcon('search', { size: '48' })}
              </div>
              <h3>No se encontraron profesionales</h3>
              <p>Intenta ajustar tus criterios de búsqueda o filtros.</p>
              <button class="clear-filters-btn">Limpiar filtros</button>
            </div>
          `}
        </div>

        ${totalCount > this.props.itemsPerPage && !loading ? `
          <div class="professional-list-pagination">
            <div id="pagination-container"></div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderActiveFilters() {
    const { filters } = this.state;
    const activeFilters = [];

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (key === 'priceRange' && (value.min || value.max)) {
          let label = 'Precio: ';
          if (value.min && value.max) {
            label += `Bs. ${value.min} - ${value.max}`;
          } else if (value.min) {
            label += `Desde Bs. ${value.min}`;
          } else if (value.max) {
            label += `Hasta Bs. ${value.max}`;
          }
          activeFilters.push({ key, label, value });
        } else if (Array.isArray(value) && value.length > 0) {
          activeFilters.push({ 
            key, 
            label: `${this.getFilterLabel(key)}: ${value.join(', ')}`, 
            value 
          });
        } else {
          activeFilters.push({ 
            key, 
            label: `${this.getFilterLabel(key)}: ${this.getFilterValueLabel(key, value)}`, 
            value 
          });
        }
      }
    });

    if (activeFilters.length === 0) return '';

    return `
      <div class="active-filters">
        <span class="active-filters-label">Filtros activos:</span>
        <div class="active-filters-list">
          ${activeFilters.map(filter => `
            <span class="active-filter-tag" data-filter="${filter.key}">
              ${filter.label}
              <button class="remove-filter" data-filter="${filter.key}" aria-label="Remover filtro">
                ${renderIcon('x', { size: '12' })}
              </button>
            </span>
          `).join('')}
          <button class="clear-all-filters">Limpiar todo</button>
        </div>
      </div>
    `;
  }

  getFilterLabel(key) {
    const labels = {
      category: 'Categoría',
      location: 'Ubicación',
      rating: 'Calificación',
      availability: 'Disponibilidad'
    };
    return labels[key] || key;
  }

  getFilterValueLabel(key, value) {
    // Convert filter values to readable labels
    if (key === 'rating') {
      return `${value}+ estrellas`;
    }
    if (key === 'availability') {
      const availabilityLabels = {
        today: 'Hoy',
        tomorrow: 'Mañana',
        week: 'Esta semana',
        month: 'Este mes'
      };
      return availabilityLabels[value] || value;
    }
    return value;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="professional-list"]';
    this.initializeComponents();
  }

  initializeComponents() {
    // Initialize search bar
    if (this.props.showSearch) {
      this.initializeSearchBar();
    }

    // Initialize professional cards
    this.initializeProfessionalCards();

    // Initialize pagination
    if (this.props.totalCount > this.props.itemsPerPage) {
      this.initializePagination();
    }

    // Initialize loading spinner
    if (this.props.loading) {
      this.initializeLoadingSpinner();
    }
  }

  initializeSearchBar() {
    const container = this.element.querySelector('#search-bar-container');
    if (!container) return;

    const searchFilters = [
      {
        key: 'category',
        type: 'select',
        label: 'Categoría',
        options: this.props.categories.map(cat => ({
          value: cat.id,
          label: cat.name
        }))
      },
      {
        key: 'location',
        type: 'select',
        label: 'Ubicación',
        options: this.props.locations.map(loc => ({
          value: loc.id,
          label: loc.name
        }))
      },
      {
        key: 'priceRange',
        type: 'range',
        label: 'Rango de precio',
        min: 0,
        max: 1000
      },
      {
        key: 'rating',
        type: 'select',
        label: 'Calificación mínima',
        options: [
          { value: '4', label: '4+ estrellas' },
          { value: '3', label: '3+ estrellas' },
          { value: '2', label: '2+ estrellas' },
          { value: '1', label: '1+ estrellas' }
        ]
      }
    ];

    const searchBar = new SearchBar({
      placeholder: 'Buscar profesionales o servicios...',
      value: this.state.searchQuery,
      showFilters: this.props.showFilters,
      filters: searchFilters,
      suggestions: [], // Could be populated with recent searches
      onSearch: (query, filters) => {
        this.handleSearch(query, filters);
      },
      onFilterChange: (filters) => {
        this.handleFilterChange(filters);
      }
    });

    searchBar.mount(container);
    this.components.set('searchBar', searchBar);
  }

  initializeProfessionalCards() {
    this.props.professionals.forEach((professional, index) => {
      const container = this.element.querySelector(`#professional-card-${index}`);
      if (!container) return;

      // Find the main service to display
      const mainService = professional.services && professional.services[0];
      
      const serviceCard = new ServiceCard({
        service: {
          id: mainService?.id || '',
          name: mainService?.name || 'Consulta profesional',
          description: mainService?.description || professional.bio || '',
          price: mainService?.price || 0,
          duration: mainService?.duration || 60,
          images: mainService?.images || [professional.avatar],
          category: mainService?.category || professional.specialty
        },
        professional: {
          id: professional.id,
          name: professional.name,
          avatar: professional.avatar,
          rating: professional.rating,
          reviewCount: professional.reviewCount
        },
        onClick: (service) => {
          this.props.onProfessionalClick(professional, service);
        },
        onBookNow: (service) => {
          this.props.onServiceBook(professional, service);
        }
      });

      serviceCard.mount(container);
      this.components.set(`card-${index}`, serviceCard);
    });
  }

  initializePagination() {
    const container = this.element.querySelector('#pagination-container');
    if (!container) return;

    const totalPages = Math.ceil(this.props.totalCount / this.props.itemsPerPage);

    const pagination = new Pagination({
      currentPage: this.state.currentPage,
      totalPages: totalPages,
      totalItems: this.props.totalCount,
      itemsPerPage: this.props.itemsPerPage,
      onPageChange: (page) => {
        this.handlePageChange(page);
      }
    });

    pagination.mount(container);
    this.components.set('pagination', pagination);
  }

  initializeLoadingSpinner() {
    const container = this.element.querySelector('#loading-spinner');
    if (!container) return;

    const spinner = new Spinner({
      size: 'lg',
      variant: 'primary'
    });

    spinner.mount(container);
    this.components.set('spinner', spinner);
  }

  bindEvents() {
    // Sort controls
    const sortSelect = this.element.querySelector('.sort-select');
    if (sortSelect) {
      this.addEventListener(sortSelect, 'change', (e) => {
        const [sortBy, sortOrder] = e.target.value.split('-');
        this.handleSort(sortBy, sortOrder);
      });
    }

    // View toggle
    const viewToggles = this.element.querySelectorAll('.view-toggle');
    viewToggles.forEach(toggle => {
      this.addEventListener(toggle, 'click', (e) => {
        const viewMode = e.currentTarget.dataset.view;
        this.handleViewChange(viewMode);
      });
    });

    // Filter removal
    const removeFilters = this.element.querySelectorAll('.remove-filter');
    removeFilters.forEach(btn => {
      this.addEventListener(btn, 'click', (e) => {
        const filterKey = e.currentTarget.dataset.filter;
        this.removeFilter(filterKey);
      });
    });

    // Clear all filters
    const clearAllBtn = this.element.querySelector('.clear-all-filters');
    if (clearAllBtn) {
      this.addEventListener(clearAllBtn, 'click', () => {
        this.clearAllFilters();
      });
    }

    // Clear filters (empty state)
    const clearFiltersBtn = this.element.querySelector('.clear-filters-btn');
    if (clearFiltersBtn) {
      this.addEventListener(clearFiltersBtn, 'click', () => {
        this.clearAllFilters();
      });
    }
  }

  handleSearch(query, filters) {
    this.setState({ 
      searchQuery: query,
      filters: { ...this.state.filters, ...filters },
      currentPage: 1
    });

    if (this.props.onSearch) {
      this.props.onSearch(query, { ...this.state.filters, ...filters });
    }
  }

  handleFilterChange(filters) {
    this.setState({ 
      filters: { ...this.state.filters, ...filters },
      currentPage: 1
    });

    if (this.props.onFilter) {
      this.props.onFilter({ ...this.state.filters, ...filters });
    }
  }

  handleSort(sortBy, sortOrder) {
    this.setState({ sortBy, sortOrder });

    if (this.props.onSort) {
      this.props.onSort(sortBy, sortOrder);
    }
  }

  handleViewChange(viewMode) {
    this.setState({ viewMode });
  }

  handlePageChange(page) {
    this.setState({ currentPage: page });

    if (this.props.onPageChange) {
      this.props.onPageChange(page);
    }

    // Scroll to top
    this.element.scrollIntoView({ behavior: 'smooth' });
  }

  removeFilter(filterKey) {
    const newFilters = { ...this.state.filters };
    
    if (filterKey === 'priceRange') {
      newFilters[filterKey] = { min: '', max: '' };
    } else if (Array.isArray(newFilters[filterKey])) {
      newFilters[filterKey] = [];
    } else {
      newFilters[filterKey] = '';
    }

    this.setState({ filters: newFilters, currentPage: 1 });

    if (this.props.onFilter) {
      this.props.onFilter(newFilters);
    }
  }

  clearAllFilters() {
    const emptyFilters = {
      category: '',
      location: '',
      priceRange: { min: '', max: '' },
      rating: '',
      availability: ''
    };

    this.setState({ 
      filters: emptyFilters,
      searchQuery: '',
      currentPage: 1
    });

    // Clear search bar
    const searchBar = this.components.get('searchBar');
    if (searchBar) {
      searchBar.setValue('');
      searchBar.setFilters({});
    }

    if (this.props.onFilter) {
      this.props.onFilter(emptyFilters);
    }

    if (this.props.onSearch) {
      this.props.onSearch('', emptyFilters);
    }
  }

  destroy() {
    // Destroy all child components
    this.components.forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    this.components.clear();
    
    super.destroy();
  }

  // Public methods
  updateData(professionals, totalCount) {
    this.props.professionals = professionals;
    this.props.totalCount = totalCount;
    this.rerender();
  }

  setLoading(loading) {
    this.props.loading = loading;
    this.rerender();
  }

  getCurrentFilters() {
    return {
      query: this.state.searchQuery,
      filters: this.state.filters,
      sortBy: this.state.sortBy,
      sortOrder: this.state.sortOrder,
      page: this.state.currentPage
    };
  }
}

// Factory function
export function createProfessionalList(props) {
  return new ProfessionalList(props);
}