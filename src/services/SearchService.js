/**
 * SearchService - Advanced search functionality for Kalos E-commerce
 * Handles text search, filtering, geolocation, and search analytics
 */

import { db } from '../config/firebase-config.js';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

export class SearchService {
  static searchIndex = new Map(); // Cache local para búsquedas
  static recentSearches = [];
  static searchAnalytics = [];

  /**
   * Búsqueda principal que combina texto, filtros y geolocalización
   * @param {string} searchQuery - Texto de búsqueda
   * @param {Object} filters - Filtros aplicados
   * @param {Object} options - Opciones de búsqueda
   * @returns {Promise<Object>} Resultados de búsqueda
   */
  static async search(searchQuery = '', filters = {}, options = {}) {
    try {
      console.log('🔍 SearchService.search called:', { searchQuery, filters, options });
      const startTime = Date.now();
      
      // In dev mode, try demo data first
      if (import.meta.env.DEV && this.isDemoDataAvailable()) {
        const demoResults = await this.searchDemoData(searchQuery, filters);
        if (demoResults.length > 0) {
          console.log('🔍 Using demo data for search:', demoResults.length, 'results');
          
          // Apply geolocation filters if needed
          const geoFilteredResults = await this.applyGeoFilters(demoResults, filters);
          
          // Track search
          this.trackSearch(searchQuery, filters, geoFilteredResults.length, Date.now() - startTime);
          this.saveSearch(searchQuery, filters);
          
          return {
            success: true,
            results: geoFilteredResults,
            total: geoFilteredResults.length,
            executionTime: Date.now() - startTime,
            source: 'demo'
          };
        }
      }
      
      // Construir consulta Firestore para datos reales
      let firebaseQuery = this.buildFirestoreQuery(searchQuery, filters);
      
      // Ejecutar búsqueda en Firestore
      const results = await this.executeSearch(firebaseQuery, options);
      
      // Aplicar ranking por relevancia
      const rankedResults = this.rankResults(results, searchQuery, filters);
      
      // Aplicar filtros de geolocalización si están disponibles
      const geoFilteredResults = await this.applyGeoFilters(rankedResults, filters);
      
      // Guardar en analytics e historial
      this.trackSearch(searchQuery, filters, geoFilteredResults.length, Date.now() - startTime);
      this.saveSearch(searchQuery, filters);
      
      return {
        success: true,
        results: geoFilteredResults,
        total: geoFilteredResults.length,
        executionTime: Date.now() - startTime,
        source: 'firestore'
      };
    } catch (error) {
      console.error('🔍 Search error:', error);
      return {
        success: false,
        error: error.message,
        results: [],
        total: 0
      };
    }
  }

  /**
   * Check if demo data is available for search
   */
  static isDemoDataAvailable() {
    try {
      const demoProfessionals = localStorage.getItem('demoProfessionals');
      return demoProfessionals && JSON.parse(demoProfessionals).length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Debug function to inspect demo data
   */
  static debugDemoData() {
    const data = localStorage.getItem('demoProfessionals');
    console.log('🔍 Raw demo data:', data);
    if (data) {
      const professionals = JSON.parse(data);
      console.log('🔍 Parsed professionals:', professionals);
      console.log('🔍 Professional names:', professionals.map(p => p.name));
      return professionals;
    }
    return [];
  }

  /**
   * Search in demo data (for development)
   */
  static async searchDemoData(searchQuery, filters) {
    try {
      let professionals = JSON.parse(localStorage.getItem('demoProfessionals') || '[]');
      
      console.log('🔍 Searching in demo data:', professionals.length, 'professionals');
      
      // Debug: show first professional structure
      if (professionals.length > 0) {
        console.log('🔍 Sample professional structure:', professionals[0]);
      }
      
      // Apply text search
      if (searchQuery && searchQuery.length >= 2) {
        const query = searchQuery.toLowerCase();
        console.log('🔍 Searching for:', query);
        console.log('🔍 Available professionals:', professionals.map(p => p.name));
        
        professionals = professionals.filter(prof => {
          const nameMatch = prof.name.toLowerCase().includes(query);
          const bioMatch = prof.bio.toLowerCase().includes(query);
          const specialtyMatch = prof.specialties.some(spec => spec.toLowerCase().includes(query));
          const serviceMatch = (prof.services || []).some(service => 
            service.name.toLowerCase().includes(query) ||
            service.description.toLowerCase().includes(query)
          );
          
          const matches = nameMatch || bioMatch || specialtyMatch || serviceMatch;
          
          if (matches) {
            console.log(`✅ Found match: ${prof.name}`, { nameMatch, bioMatch, specialtyMatch, serviceMatch });
          }
          
          return matches;
        });
        
        console.log('🔍 Search results:', professionals.length);
      }

      // Apply category filter
      if (filters.category) {
        professionals = professionals.filter(prof => 
          prof.specialties.some(spec => 
            spec.toLowerCase().includes(filters.category.toLowerCase())
          )
        );
      }

      // Apply city filter
      if (filters.city) {
        professionals = professionals.filter(prof => 
          prof.location && prof.location.city === filters.city
        );
      }

      // Apply rating filter
      if (filters.minRating) {
        professionals = professionals.filter(prof => 
          (prof.rating || 0) >= parseFloat(filters.minRating)
        );
      }

      // Apply price range filter
      if (filters.priceMin || filters.priceMax) {
        professionals = professionals.filter(prof => {
          if (!prof.services || prof.services.length === 0) return false;
          
          const prices = prof.services.map(s => s.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          
          let matches = true;
          if (filters.priceMin) {
            matches = matches && minPrice >= parseFloat(filters.priceMin);
          }
          if (filters.priceMax) {
            matches = matches && maxPrice <= parseFloat(filters.priceMax);
          }
          
          return matches;
        });
      }

      // Apply verified filter
      if (filters.verified) {
        professionals = professionals.filter(prof => prof.verified === true);
      }

      // Apply featured filter
      if (filters.featured) {
        professionals = professionals.filter(prof => prof.featured === true);
      }

      // Convert to search result format
      const results = professionals.map(prof => ({
        id: prof.id,
        businessName: prof.name,
        name: prof.name,
        bio: prof.bio,
        specialties: prof.specialties || [],
        location: prof.location || {},
        rating: prof.rating || 0,
        completedBookings: prof.completedBookings || 0,
        verified: prof.verified || false,
        featured: prof.featured || false,
        published: prof.published !== false,
        services: prof.services || [],
        stats: {
          averageRating: prof.rating || 0,
          reviewCount: prof.completedBookings || 0
        }
      }));

      return results;
    } catch (error) {
      console.error('🔍 Error searching demo data:', error);
      return [];
    }
  }

  /**
   * Construir consulta Firestore basada en texto y filtros
   */
  static buildFirestoreQuery(searchQuery, filters) {
    console.log('🔍 Building Firestore query:', { searchQuery, filters });
    
    let dbQuery = query(collection(db, 'professionals'));
    
    // Filtros básicos
    if (filters.published !== false) {
      dbQuery = query(dbQuery, where('published', '==', true));
    }
    
    if (filters.verified) {
      dbQuery = query(dbQuery, where('verified', '==', true));
    }
    
    // Filtro por especialidad/categoría
    if (filters.category) {
      dbQuery = query(dbQuery, where('specialties', 'array-contains', filters.category));
    }
    
    // Filtro por ciudad
    if (filters.city) {
      dbQuery = query(dbQuery, where('location.city', '==', filters.city));
    }
    
    // Filtro por calificación mínima
    if (filters.minRating) {
      dbQuery = query(dbQuery, where('stats.averageRating', '>=', parseFloat(filters.minRating)));
    }
    
    // Ordenamiento
    let orderByField = 'stats.averageRating';
    let orderDirection = 'desc';
    
    if (filters.sortBy) {
      orderByField = filters.sortBy;
      orderDirection = filters.sortOrder || 'desc';
    }
    
    dbQuery = query(dbQuery, orderBy(orderByField, orderDirection));
    
    // Límite de resultados
    const limitCount = filters.limit || 20;
    dbQuery = query(dbQuery, limit(limitCount));
    
    // Paginación
    if (filters.startAfter) {
      dbQuery = query(dbQuery, startAfter(filters.startAfter));
    }
    
    return dbQuery;
  }

  /**
   * Ejecutar búsqueda en Firestore
   */
  static async executeSearch(firebaseQuery, options = {}) {
    console.log('🔍 Executing Firestore search...');
    
    const snapshot = await getDocs(firebaseQuery);
    const results = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      results.push({
        id: doc.id,
        ...data,
        _doc: doc // Guardar referencia para paginación
      });
    });
    
    console.log('🔍 Firestore search results:', results.length);
    return results;
  }

  /**
   * Ranking de resultados por relevancia
   */
  static rankResults(results, searchQuery, filters) {
    if (!searchQuery || searchQuery.length < 2) {
      return results;
    }
    
    console.log('🔍 Ranking results by relevance...');
    const query = searchQuery.toLowerCase();
    
    return results.map(result => {
      let score = 0;
      
      // Puntuación por coincidencia exacta en nombre
      const businessName = (result.businessName || result.name || '').toLowerCase();
      if (businessName === query) {
        score += 20; // Coincidencia exacta
      } else if (businessName.includes(query)) {
        score += 15; // Coincidencia parcial en nombre
      }
      
      // Puntuación por coincidencia en especialidades
      if (result.specialties && Array.isArray(result.specialties)) {
        result.specialties.forEach(specialty => {
          if (specialty.toLowerCase().includes(query)) {
            score += 10;
          }
        });
      }
      
      // Puntuación por coincidencia en biografía
      if (result.bio && result.bio.toLowerCase().includes(query)) {
        score += 5;
      }
      
      // Puntuación por rating (0-5 estrellas)
      score += (result.stats?.averageRating || result.rating || 0) * 2;
      
      // Puntuación por número de reseñas (max 5 puntos)
      const reviewCount = result.stats?.reviewCount || result.completedBookings || 0;
      score += Math.min(reviewCount / 10, 5);
      
      // Bonus por verificación
      if (result.verified) {
        score += 3;
      }
      
      // Bonus por ser destacado
      if (result.featured) {
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
    
    console.log('🔍 Applying geo filters:', { userLocation: filters.userLocation, radius: filters.radius });
    
    const { lat: userLat, lng: userLng } = filters.userLocation;
    const radiusKm = parseFloat(filters.radius);
    
    return results.filter(result => {
      if (!result.location?.coordinates) {
        return true; // Keep results without location
      }
      
      const { lat: profLat, lng: profLng } = result.location.coordinates;
      const distance = this.calculateDistance(userLat, userLng, profLat, profLng);
      
      return distance <= radiusKm;
    })
    .map(result => {
      if (result.location?.coordinates) {
        const { lat: profLat, lng: profLng } = result.location.coordinates;
        const distance = this.calculateDistance(userLat, userLng, profLat, profLng);
        return { ...result, _distance: Math.round(distance * 100) / 100 }; // Round to 2 decimals
      }
      return result;
    })
    .sort((a, b) => (a._distance || Infinity) - (b._distance || Infinity));
  }

  /**
   * Calcular distancia entre dos puntos usando la fórmula de Haversine
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
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
    
    console.log('🔍 Getting suggestions for:', query);
    
    try {
      const suggestions = new Set();
      
      // In dev mode, use demo data for suggestions
      if (import.meta.env.DEV && this.isDemoDataAvailable()) {
        const demoProfessionals = JSON.parse(localStorage.getItem('demoProfessionals') || '[]');
        const queryLower = query.toLowerCase();
        
        // Sugerencias de nombres de profesionales
        demoProfessionals.forEach(prof => {
          if (prof.name.toLowerCase().includes(queryLower)) {
            suggestions.add(prof.name);
          }
          
          // Sugerencias de especialidades
          if (prof.specialties) {
            prof.specialties.forEach(specialty => {
              if (specialty.toLowerCase().includes(queryLower)) {
                suggestions.add(specialty);
              }
            });
          }
          
          // Sugerencias de servicios
          if (prof.services) {
            prof.services.forEach(service => {
              if (service.name.toLowerCase().includes(queryLower)) {
                suggestions.add(service.name);
              }
            });
          }
        });
      } else {
        // Production: query Firestore for suggestions
        // Sugerencias de nombres de profesionales
        const professionalsQuery = query(
          collection(db, 'professionals'),
          where('published', '==', true),
          orderBy('businessName'),
          limit(limit)
        );
        
        const professionalsSnapshot = await getDocs(professionalsQuery);
        professionalsSnapshot.forEach(doc => {
          const name = doc.data().businessName || doc.data().name;
          if (name && name.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(name);
          }
        });
      }
      
      // Sugerencias de categorías predefinidas
      const categories = [
        'Maquillaje', 'Cabello', 'Uñas', 'Cuidado facial', 
        'Masajes', 'Depilación', 'Cejas y pestañas',
        'Peinados', 'Cortes', 'Tratamientos', 'Manicure', 'Pedicure'
      ];
      
      categories.forEach(category => {
        if (category.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(category);
        }
      });
      
      const result = Array.from(suggestions).slice(0, limit);
      console.log('🔍 Generated suggestions:', result);
      return result;
    } catch (error) {
      console.error('🔍 Error getting suggestions:', error);
      return [];
    }
  }

  /**
   * Guardar búsqueda en historial
   */
  static saveSearch(query, filters) {
    if (!query || query.length < 2) return;
    
    const search = {
      query: query.trim(),
      filters: { ...filters },
      timestamp: Date.now()
    };
    
    // Evitar duplicados recientes
    this.recentSearches = this.recentSearches.filter(s => 
      s.query !== search.query || JSON.stringify(s.filters) !== JSON.stringify(search.filters)
    );
    
    this.recentSearches.unshift(search);
    this.recentSearches = this.recentSearches.slice(0, 10); // Máximo 10
    
    // Guardar en localStorage
    try {
      localStorage.setItem('kalos_recent_searches', JSON.stringify(this.recentSearches));
    } catch (error) {
      console.warn('🔍 Could not save search history:', error);
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
      console.warn('🔍 Could not load search history:', error);
      this.recentSearches = [];
    }
    return this.recentSearches;
  }

  /**
   * Limpiar historial de búsquedas
   */
  static clearSearchHistory() {
    this.recentSearches = [];
    try {
      localStorage.removeItem('kalos_recent_searches');
    } catch (error) {
      console.warn('🔍 Could not clear search history:', error);
    }
  }

  /**
   * Tracking de analytics de búsqueda
   */
  static trackSearch(query, filters, resultCount, executionTime) {
    const analytics = {
      query: query.toLowerCase().trim(),
      filters: { ...filters },
      resultCount,
      executionTime,
      timestamp: Date.now()
    };
    
    this.searchAnalytics.push(analytics);
    
    // Mantener solo últimas 100 búsquedas para evitar memory leaks
    if (this.searchAnalytics.length > 100) {
      this.searchAnalytics = this.searchAnalytics.slice(-100);
    }
    
    console.log('🔍 Search tracked:', analytics);
  }

  /**
   * Obtener trending searches
   */
  static getTrendingSearches(limit = 5) {
    const queryCount = new Map();
    
    // Contar frecuencia de queries
    this.searchAnalytics
      .filter(analytics => analytics.query.length >= 2)
      .forEach(analytics => {
        const count = queryCount.get(analytics.query) || 0;
        queryCount.set(analytics.query, count + 1);
      });
    
    return Array.from(queryCount.entries())
      .sort((a, b) => b[1] - a[1]) // Sort por frecuencia descendente
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }

  /**
   * Get search analytics summary
   */
  static getSearchAnalytics() {
    return {
      totalSearches: this.searchAnalytics.length,
      averageExecutionTime: this.searchAnalytics.reduce((sum, a) => sum + a.executionTime, 0) / this.searchAnalytics.length || 0,
      averageResultCount: this.searchAnalytics.reduce((sum, a) => sum + a.resultCount, 0) / this.searchAnalytics.length || 0,
      trending: this.getTrendingSearches(),
      recent: this.recentSearches.slice(0, 5)
    };
  }
}

// Make debug function available globally
window.debugSearch = SearchService.debugDemoData;

export default SearchService;