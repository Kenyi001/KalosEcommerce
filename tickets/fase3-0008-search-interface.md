# Ticket Fase 3-0008: Interfaz de Búsqueda Avanzada

## 📋 Descripción
Implementar sistema de búsqueda avanzada para profesionales y servicios con filtros inteligentes, sugerencias automáticas y resultados optimizados para el marketplace de Kalos.

## 🎯 Objetivos
- Búsqueda textual rápida y precisa
- Filtros avanzados por múltiples criterios
- Autocompletado y sugerencias inteligentes
- Geolocalización y búsqueda por proximidad
- Resultados ordenados por relevancia
- Search analytics para optimización

## 📊 Criterios de Aceptación

### ✅ Búsqueda Textual
- [ ] Search bar con autocompletado
- [ ] Búsqueda por nombre de profesional
- [ ] Búsqueda por tipo de servicio
- [ ] Búsqueda por ubicación
- [ ] Búsqueda fuzzy (tolerante a errores)
- [ ] Highlighting de términos encontrados

### ✅ Filtros Avanzados
- [ ] Filtro por categoría de servicio
- [ ] Filtro por rango de precio
- [ ] Filtro por calificación mínima
- [ ] Filtro por disponibilidad
- [ ] Filtro por ubicación (ciudad/zona)
- [ ] Filtro por servicios a domicilio/local

### ✅ Geolocalización
- [ ] Detección automática de ubicación
- [ ] Búsqueda por proximidad
- [ ] Mapa con marcadores de profesionales
- [ ] Filtro por radio de distancia
- [ ] Direcciones y navegación

### ✅ UX Optimizada
- [ ] Resultados en tiempo real
- [ ] Paginación infinita
- [ ] Loading states suaves
- [ ] No results state informativo
- [ ] Historial de búsquedas
- [ ] Búsquedas guardadas/favoritas

## 🔧 Implementación Técnica

### Search Component Architecture
```
src/
├── components/
│   └── search/
│       ├── SearchBar.js           # Componente principal de búsqueda
│       ├── SearchFilters.js       # Panel de filtros avanzados
│       ├── SearchResults.js       # Lista de resultados
│       ├── SearchSuggestions.js   # Autocompletado
│       ├── MapView.js             # Vista de mapa
│       └── SearchHistory.js       # Historial de búsquedas
├── services/
│   ├── SearchService.js           # Lógica de búsqueda
│   ├── GeolocationService.js      # Geolocalización
│   └── AnalyticsService.js        # Analytics de búsqueda
└── utils/
    ├── searchHelpers.js           # Utilidades de búsqueda
    └── locationHelpers.js         # Utilidades de ubicación
```

### SearchService Implementation
```javascript
// src/services/SearchService.js
export class SearchService {
  static searchIndex = new Map(); // Cache local para búsquedas
  static recentSearches = [];
  static searchAnalytics = [];

  /**
   * Búsqueda principal que combina texto, filtros y geolocalización
   */
  static async search(query, filters = {}, options = {}) {
    try {
      const startTime = Date.now();
      
      // Construir consulta Firestore
      let firebaseQuery = this.buildFirestoreQuery(query, filters);
      
      // Ejecutar búsqueda
      const results = await this.executeSearch(firebaseQuery, options);
      
      // Aplicar ordenamiento por relevancia
      const rankedResults = this.rankResults(results, query, filters);
      
      // Aplicar filtros de geolocalización si están disponibles
      const geoFilteredResults = await this.applyGeoFilters(rankedResults, filters);
      
      // Guardar en analytics
      this.trackSearch(query, filters, geoFilteredResults.length, Date.now() - startTime);
      
      return {
        success: true,
        results: geoFilteredResults,
        total: geoFilteredResults.length,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        error: error.message,
        results: [],
        total: 0
      };
    }
  }

  /**
   * Construir consulta Firestore basada en texto y filtros
   */
  static buildFirestoreQuery(query, filters) {
    let dbQuery = db.collection('professionals');
    
    // Filtros básicos
    if (filters.published !== false) {
      dbQuery = dbQuery.where('published', '==', true);
    }
    
    if (filters.verified) {
      dbQuery = dbQuery.where('verified', '==', true);
    }
    
    // Filtro por categoría
    if (filters.category) {
      dbQuery = dbQuery.where('specialties', 'array-contains', filters.category);
    }
    
    // Filtro por ciudad
    if (filters.city) {
      dbQuery = dbQuery.where('location.city', '==', filters.city);
    }
    
    // Filtro por calificación
    if (filters.minRating) {
      dbQuery = dbQuery.where('stats.averageRating', '>=', filters.minRating);
    }
    
    // Ordenamiento
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder || 'desc';
      dbQuery = dbQuery.orderBy(filters.sortBy, sortOrder);
    } else {
      // Default: ordenar por rating
      dbQuery = dbQuery.orderBy('stats.averageRating', 'desc');
    }
    
    // Paginación
    if (filters.limit) {
      dbQuery = dbQuery.limit(filters.limit);
    }
    
    if (filters.startAfter) {
      dbQuery = dbQuery.startAfter(filters.startAfter);
    }
    
    return dbQuery;
  }

  /**
   * Ejecutar búsqueda en Firestore
   */
  static async executeSearch(query, options = {}) {
    const snapshot = await query.get();
    const results = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      results.push({
        id: doc.id,
        ...data,
        _doc: doc // Guardar referencia para paginación
      });
    });
    
    return results;
  }

  /**
   * Ranking de resultados por relevancia
   */
  static rankResults(results, searchQuery, filters) {
    if (!searchQuery) return results;
    
    const query = searchQuery.toLowerCase();
    
    return results.map(result => {
      let score = 0;
      
      // Puntuación por coincidencia en nombre
      if (result.businessName.toLowerCase().includes(query)) {
        score += 10;
      }
      
      // Puntuación por coincidencia en especialidades
      result.specialties.forEach(specialty => {
        if (specialty.toLowerCase().includes(query)) {
          score += 5;
        }
      });
      
      // Puntuación por rating
      score += result.stats.averageRating || 0;
      
      // Puntuación por número de reseñas
      score += Math.min(result.stats.reviewCount / 10, 5) || 0;
      
      // Puntuación por verificación
      if (result.verified) {
        score += 2;
      }
      
      return { ...result, _searchScore: score };
    })
    .sort((a, b) => b._searchScore - a._searchScore);
  }

  /**
   * Aplicar filtros de geolocalización
   */
  static async applyGeoFilters(results, filters) {
    if (!filters.userLocation || !filters.radius) {
      return results;
    }
    
    const { lat: userLat, lng: userLng } = filters.userLocation;
    const radiusKm = filters.radius;
    
    return results.filter(result => {
      if (!result.location?.coordinates) return true;
      
      const { lat: profLat, lng: profLng } = result.location.coordinates;
      const distance = this.calculateDistance(userLat, userLng, profLat, profLng);
      
      return distance <= radiusKm;
    })
    .map(result => {
      if (result.location?.coordinates) {
        const { lat: profLat, lng: profLng } = result.location.coordinates;
        const distance = this.calculateDistance(userLat, userLng, profLat, profLng);
        return { ...result, _distance: distance };
      }
      return result;
    })
    .sort((a, b) => (a._distance || Infinity) - (b._distance || Infinity));
  }

  /**
   * Calcular distancia entre dos puntos (fórmula Haversine)
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  /**
   * Obtener sugerencias para autocompletado
   */
  static async getSuggestions(query, limit = 5) {
    if (!query || query.length < 2) return [];
    
    try {
      const suggestions = new Set();
      
      // Sugerencias de nombres de profesionales
      const professionalsSnapshot = await db.collection('professionals')
        .where('published', '==', true)
        .orderBy('businessName')
        .startAt(query)
        .endAt(query + '\uf8ff')
        .limit(limit)
        .get();
      
      professionalsSnapshot.forEach(doc => {
        suggestions.add(doc.data().businessName);
      });
      
      // Sugerencias de servicios
      const servicesSnapshot = await db.collection('services')
        .where('active', '==', true)
        .orderBy('name')
        .startAt(query)
        .endAt(query + '\uf8ff')
        .limit(limit)
        .get();
      
      servicesSnapshot.forEach(doc => {
        suggestions.add(doc.data().name);
      });
      
      // Sugerencias de categorías
      const categories = [
        'maquillaje', 'cabello', 'uñas', 'cuidado facial', 
        'masajes', 'depilación', 'cejas y pestañas'
      ];
      
      categories.forEach(category => {
        if (category.includes(query.toLowerCase())) {
          suggestions.add(category);
        }
      });
      
      return Array.from(suggestions).slice(0, limit);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  /**
   * Guardar búsqueda en historial
   */
  static saveSearch(query, filters) {
    const search = {
      query,
      filters,
      timestamp: Date.now()
    };
    
    // Evitar duplicados recientes
    this.recentSearches = this.recentSearches.filter(s => 
      s.query !== query || JSON.stringify(s.filters) !== JSON.stringify(filters)
    );
    
    this.recentSearches.unshift(search);
    this.recentSearches = this.recentSearches.slice(0, 10); // Máximo 10
    
    // Guardar en localStorage
    try {
      localStorage.setItem('kalos_recent_searches', JSON.stringify(this.recentSearches));
    } catch (error) {
      console.warn('Could not save search history:', error);
    }
  }

  /**
   * Cargar historial de búsquedas
   */
  static loadSearchHistory() {
    try {
      const saved = localStorage.getItem('kalos_recent_searches');
      if (saved) {
        this.recentSearches = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Could not load search history:', error);
    }
  }

  /**
   * Tracking de analytics de búsqueda
   */
  static trackSearch(query, filters, resultCount, executionTime) {
    const analytics = {
      query: query.toLowerCase(),
      filters,
      resultCount,
      executionTime,
      timestamp: Date.now()
    };
    
    this.searchAnalytics.push(analytics);
    
    // Mantener solo últimas 100 búsquedas
    if (this.searchAnalytics.length > 100) {
      this.searchAnalytics = this.searchAnalytics.slice(-100);
    }
  }

  /**
   * Obtener trending searches
   */
  static getTrendingSearches(limit = 5) {
    const queryCount = new Map();
    
    this.searchAnalytics.forEach(analytics => {
      const count = queryCount.get(analytics.query) || 0;
      queryCount.set(analytics.query, count + 1);
    });
    
    return Array.from(queryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }
}
```

### SearchBar Component
```javascript
// src/components/search/SearchBar.js
export class SearchBar {
  constructor(props = {}) {
    this.props = {
      placeholder: 'Buscar profesionales, servicios...',
      onSearch: () => {},
      onFilterChange: () => {},
      showFilters: true,
      showGeolocation: true,
      ...props
    };
    
    this.state = {
      query: '',
      suggestions: [],
      showSuggestions: false,
      isLoading: false,
      filtersOpen: false
    };
    
    this.debounceTimeout = null;
  }

  render() {
    const { placeholder, showFilters, showGeolocation } = this.props;
    const { query, suggestions, showSuggestions, isLoading, filtersOpen } = this.state;
    
    return `
      <div class="search-bar" data-component="search-bar">
        <div class="search-container relative">
          <!-- Main search input -->
          <div class="search-input-wrapper flex items-center bg-white border-2 border-gray-200 rounded-lg focus-within:border-brand">
            <svg class="search-icon w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            
            <input
              type="text"
              id="search-input"
              placeholder="${placeholder}"
              value="${query}"
              class="flex-1 py-3 px-3 border-none outline-none text-gray-900"
              autocomplete="off"
            />
            
            ${isLoading ? `
              <div class="loading-spinner w-5 h-5 mr-3">
                <svg class="animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ` : ''}
            
            ${query ? `
              <button id="clear-search" class="clear-btn p-2 text-gray-400 hover:text-gray-600 mr-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            ` : ''}
            
            ${showFilters ? `
              <button id="filters-toggle" class="filters-btn p-2 text-gray-400 hover:text-gray-600 mr-2 ${filtersOpen ? 'text-brand' : ''}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
                </svg>
              </button>
            ` : ''}
            
            ${showGeolocation ? `
              <button id="geolocation-btn" class="geolocation-btn p-2 text-gray-400 hover:text-gray-600 mr-2" title="Buscar cerca de mí">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            ` : ''}
          </div>
          
          <!-- Suggestions dropdown -->
          ${showSuggestions && suggestions.length > 0 ? `
            <div class="suggestions-dropdown absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
              ${suggestions.map((suggestion, index) => `
                <button
                  class="suggestion-item w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                  data-suggestion="${suggestion}"
                >
                  <svg class="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  ${suggestion}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <!-- Advanced filters panel -->
        ${filtersOpen ? this.renderFiltersPanel() : ''}
      </div>
    `;
  }

  renderFiltersPanel() {
    return `
      <div class="filters-panel bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Category filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select id="category-filter" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">Todas las categorías</option>
              <option value="maquillaje">Maquillaje</option>
              <option value="cabello">Cabello</option>
              <option value="unas">Uñas</option>
              <option value="facial">Cuidado facial</option>
              <option value="masajes">Masajes</option>
            </select>
          </div>
          
          <!-- Price range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rango de precio</label>
            <div class="flex space-x-2">
              <input type="number" id="price-min" placeholder="Min" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <input type="number" id="price-max" placeholder="Max" class="w-full border border-gray-300 rounded-md px-3 py-2">
            </div>
          </div>
          
          <!-- Rating filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Calificación mínima</label>
            <select id="rating-filter" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">Cualquier calificación</option>
              <option value="4">4+ estrellas</option>
              <option value="4.5">4.5+ estrellas</option>
              <option value="5">5 estrellas</option>
            </select>
          </div>
          
          <!-- Location filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
            <select id="city-filter" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">Todas las ciudades</option>
              <option value="La Paz">La Paz</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="Sucre">Sucre</option>
            </select>
          </div>
          
          <!-- Availability filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Disponibilidad</label>
            <select id="availability-filter" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">Cualquier momento</option>
              <option value="today">Disponible hoy</option>
              <option value="week">Esta semana</option>
              <option value="weekend">Fin de semana</option>
            </select>
          </div>
          
          <!-- Distance filter (if geolocation enabled) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Distancia</label>
            <select id="distance-filter" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">Cualquier distancia</option>
              <option value="5">Hasta 5 km</option>
              <option value="10">Hasta 10 km</option>
              <option value="25">Hasta 25 km</option>
            </select>
          </div>
        </div>
        
        <!-- Filter actions -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <button id="clear-filters" class="text-gray-600 hover:text-gray-800">
            Limpiar filtros
          </button>
          <button id="apply-filters" class="bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-hover">
            Aplicar filtros
          </button>
        </div>
      </div>
    `;
  }

  mount(container) {
    container.innerHTML = this.render();
    this.bindEvents();
    SearchService.loadSearchHistory();
  }

  bindEvents() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    const filtersToggle = document.getElementById('filters-toggle');
    const geolocationBtn = document.getElementById('geolocation-btn');

    // Search input events
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearchInput(e.target.value);
      });
      
      searchInput.addEventListener('focus', () => {
        this.setState({ showSuggestions: true });
      });
      
      searchInput.addEventListener('blur', () => {
        // Delay to allow suggestion clicks
        setTimeout(() => {
          this.setState({ showSuggestions: false });
        }, 200);
      });
    }

    // Clear search
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.setState({ query: '', suggestions: [] });
        this.props.onSearch('', {});
      });
    }

    // Toggle filters
    if (filtersToggle) {
      filtersToggle.addEventListener('click', () => {
        this.setState({ filtersOpen: !this.state.filtersOpen });
      });
    }

    // Geolocation
    if (geolocationBtn) {
      geolocationBtn.addEventListener('click', () => {
        this.requestGeolocation();
      });
    }

    // Suggestion clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion-item')) {
        const suggestion = e.target.dataset.suggestion;
        this.setState({ query: suggestion, showSuggestions: false });
        this.props.onSearch(suggestion, {});
      }
    });
  }

  async handleSearchInput(value) {
    this.setState({ query: value, isLoading: true });
    
    // Debounce search
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(async () => {
      if (value.length >= 2) {
        const suggestions = await SearchService.getSuggestions(value);
        this.setState({ suggestions, showSuggestions: true });
      } else {
        this.setState({ suggestions: [], showSuggestions: false });
      }
      
      this.setState({ isLoading: false });
      
      // Trigger search
      this.props.onSearch(value, {});
    }, 300);
  }

  requestGeolocation() {
    if (!navigator.geolocation) {
      alert('Geolocalización no está disponible en tu navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.props.onFilterChange({ userLocation: location });
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('No se pudo obtener tu ubicación');
      }
    );
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    // Re-render component
    const container = document.querySelector('[data-component="search-bar"]')?.parentNode;
    if (container) {
      this.mount(container);
    }
  }
}
```

## 🧪 Testing

### Search Functionality Tests
- [ ] Búsqueda textual funciona correctamente
- [ ] Filtros se aplican correctamente
- [ ] Autocompletado muestra sugerencias relevantes
- [ ] Geolocalización funciona en dispositivos compatibles
- [ ] Paginación carga más resultados
- [ ] Performance con grandes datasets

### User Experience Tests
- [ ] Loading states son suaves
- [ ] Responsive design en móviles
- [ ] Accesibilidad con teclado
- [ ] Búsquedas sin resultados se manejan bien

## 🚀 Deployment

### Search Optimization
- Considerar integración con Algolia para búsqueda avanzada
- Implementar caching de resultados frecuentes
- Optimizar consultas Firestore con indexes

### Performance Monitoring
- Track search response times
- Monitor search success rates
- Analizar queries más frecuentes

## 📦 Dependencies
- Firestore para base de datos
- Geolocation API del navegador
- localStorage para historial
- Opcional: Algolia para búsqueda avanzada

## 🔗 Relaciones
- **Depende de**: fase2-0006-professional-management
- **Integra con**: fase3-0007-booking-system
- **Mejora**: UX de fase4-0009-frontend-components

---

**Estado**: 🟡 Pendiente  
**Prioridad**: Alta  
**Estimación**: 12 horas  
**Asignado**: Frontend Developer  

**Sprint**: Sprint 3 - Sistema de Reservas  
**Deadline**: 9 septiembre 2025