export default class SearchFilters {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.getElementById(container) : container;
        this.options = {
            showLocationFilter: true,
            showPriceFilter: true,
            showCategoryFilter: true,
            showRatingFilter: true,
            showAvailabilityFilter: true,
            showSortOptions: true,
            onFiltersChange: null,
            defaultFilters: {},
            ...options
        };
        
        this.filters = {
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
            sortBy: 'relevance',
            ...this.options.defaultFilters
        };
        
        this.isExpanded = false;
        this.categories = [];
        
        this.init();
        this.bindEvents();
    }

    async init() {
        await this.loadCategories();
        this.container.innerHTML = this.render();
        
        // Wait for DOM to be fully updated before binding events
        setTimeout(() => {
            this.bindFilterEvents();
        }, 0);
    }

    async loadCategories() {
        try {
            if (import.meta.env.DEV) {
                this.categories = [
                    { id: 'peluqueria', name: 'Peluquería', count: 15 },
                    { id: 'manicure', name: 'Manicure', count: 12 },
                    { id: 'pedicure', name: 'Pedicure', count: 10 },
                    { id: 'maquillaje', name: 'Maquillaje', count: 8 },
                    { id: 'cejas', name: 'Cejas', count: 14 },
                    { id: 'pestañas', name: 'Pestañas', count: 9 },
                    { id: 'masajes', name: 'Masajes', count: 7 },
                    { id: 'depilacion', name: 'Depilación', count: 11 }
                ];
            } else {
                const { getDocs, collection } = await import('firebase/firestore');
                const { db } = await import('../../config/firebase-config.js');
                
                const snapshot = await getDocs(collection(db, 'categories'));
                this.categories = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            this.categories = [];
        }
    }

    render() {
        return `
            <div class="search-filters bg-white border border-gray-200 rounded-lg">
                <!-- Filter Header -->
                <div class="filter-header px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-sm font-semibold text-gray-700">Filtros</h3>
                    <div class="flex items-center space-x-2">
                        <button class="clear-filters text-xs text-primary-600 hover:text-primary-700">
                            Limpiar todo
                        </button>
                        <button class="toggle-filters lg:hidden text-gray-400 hover:text-gray-600">
                            <svg class="w-5 h-5 transform transition-transform ${this.isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Filter Content -->
                <div class="filter-content ${this.isExpanded ? '' : 'hidden lg:block'}">
                    ${this.options.showSortOptions ? this.renderSortOptions() : ''}
                    ${this.options.showCategoryFilter ? this.renderCategoryFilter() : ''}
                    ${this.options.showPriceFilter ? this.renderPriceFilter() : ''}
                    ${this.options.showRatingFilter ? this.renderRatingFilter() : ''}
                    ${this.options.showLocationFilter ? this.renderLocationFilter() : ''}
                    ${this.options.showAvailabilityFilter ? this.renderAvailabilityFilter() : ''}
                </div>

                <!-- Active Filters Display -->
                <div class="active-filters px-4 py-3 border-t border-gray-100 hidden">
                    <div class="flex flex-wrap gap-2">
                        <!-- Active filter tags will be inserted here -->
                    </div>
                </div>
            </div>
        `;
    }

    renderSortOptions() {
        const sortOptions = [
            { value: 'relevance', label: 'Más relevantes' },
            { value: 'rating', label: 'Mejor calificados' },
            { value: 'price_low', label: 'Precio: menor a mayor' },
            { value: 'price_high', label: 'Precio: mayor a menor' },
            { value: 'distance', label: 'Más cercanos' },
            { value: 'newest', label: 'Más recientes' }
        ];

        return `
            <div class="filter-section px-4 py-3 border-b border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Ordenar por</h4>
                <select class="sort-select w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    ${sortOptions.map(option => `
                        <option value="${option.value}" ${this.filters.sortBy === option.value ? 'selected' : ''}>
                            ${option.label}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    renderCategoryFilter() {
        return `
            <div class="filter-section px-4 py-3 border-b border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Categorías</h4>
                <div class="category-filters space-y-2 max-h-48 overflow-y-auto">
                    ${this.categories.map(category => `
                        <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input type="checkbox" 
                                   class="category-checkbox text-primary-600 focus:ring-primary-500" 
                                   value="${category.id}"
                                   ${this.filters.categories.includes(category.id) ? 'checked' : ''}>
                            <span class="flex-1 text-sm text-gray-700">${category.name}</span>
                            <span class="text-xs text-gray-400">(${category.count || 0})</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderPriceFilter() {
        return `
            <div class="filter-section px-4 py-3 border-b border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Rango de precios (Bs.)</h4>
                <div class="price-inputs flex items-center space-x-2">
                    <input type="number" 
                           class="price-min flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                           placeholder="Min"
                           value="${this.filters.priceRange.min || ''}"
                           min="0">
                    <span class="text-gray-400">-</span>
                    <input type="number" 
                           class="price-max flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                           placeholder="Max"
                           value="${this.filters.priceRange.max || ''}"
                           min="0">
                </div>
                
                <!-- Quick Price Ranges -->
                <div class="price-ranges mt-3 flex flex-wrap gap-2">
                    <button class="price-range-btn px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" 
                            data-min="0" data-max="50">
                        0-50 Bs.
                    </button>
                    <button class="price-range-btn px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" 
                            data-min="50" data-max="100">
                        50-100 Bs.
                    </button>
                    <button class="price-range-btn px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" 
                            data-min="100" data-max="200">
                        100-200 Bs.
                    </button>
                    <button class="price-range-btn px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" 
                            data-min="200" data-max="">
                        200+ Bs.
                    </button>
                </div>
            </div>
        `;
    }

    renderRatingFilter() {
        return `
            <div class="filter-section px-4 py-3 border-b border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Calificación mínima</h4>
                <div class="rating-filters space-y-2">
                    ${[5, 4, 3, 2, 1].map(rating => `
                        <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input type="radio" 
                                   name="rating" 
                                   class="rating-radio text-primary-600 focus:ring-primary-500" 
                                   value="${rating}"
                                   ${this.filters.rating === rating ? 'checked' : ''}>
                            <div class="flex items-center space-x-1">
                                ${this.renderStars(rating)}
                                <span class="text-sm text-gray-700 ml-1">y más</span>
                            </div>
                        </label>
                    `).join('')}
                    <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input type="radio" 
                               name="rating" 
                               class="rating-radio text-primary-600 focus:ring-primary-500" 
                               value=""
                               ${!this.filters.rating ? 'checked' : ''}>
                        <span class="text-sm text-gray-700">Cualquier calificación</span>
                    </label>
                </div>
            </div>
        `;
    }

    renderLocationFilter() {
        return `
            <div class="filter-section px-4 py-3 border-b border-gray-100">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Ubicación</h4>
                
                <!-- Current Location Button -->
                <button class="use-location-btn w-full mb-3 px-3 py-2 text-sm bg-primary-50 text-primary-700 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors flex items-center justify-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    </svg>
                    <span>Usar mi ubicación actual</span>
                </button>
                
                <!-- Distance Radius -->
                <div class="distance-filter ${this.filters.location.coordinates ? '' : 'hidden'}">
                    <label class="block text-sm text-gray-600 mb-2">Radio de búsqueda</label>
                    <select class="radius-select w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="1" ${this.filters.location.radius === 1 ? 'selected' : ''}>1 km</option>
                        <option value="2" ${this.filters.location.radius === 2 ? 'selected' : ''}>2 km</option>
                        <option value="5" ${this.filters.location.radius === 5 ? 'selected' : ''}>5 km</option>
                        <option value="10" ${this.filters.location.radius === 10 ? 'selected' : ''}>10 km</option>
                        <option value="20" ${this.filters.location.radius === 20 ? 'selected' : ''}>20 km</option>
                        <option value="" ${!this.filters.location.radius ? 'selected' : ''}>Sin límite</option>
                    </select>
                </div>
                
                <!-- City Filter -->
                <div class="city-filter mt-3">
                    <label class="block text-sm text-gray-600 mb-2">Ciudad</label>
                    <select class="city-select w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">Todas las ciudades</option>
                        <option value="la-paz" ${this.filters.location.city === 'la-paz' ? 'selected' : ''}>La Paz</option>
                        <option value="cochabamba" ${this.filters.location.city === 'cochabamba' ? 'selected' : ''}>Cochabamba</option>
                        <option value="santa-cruz" ${this.filters.location.city === 'santa-cruz' ? 'selected' : ''}>Santa Cruz</option>
                        <option value="sucre" ${this.filters.location.city === 'sucre' ? 'selected' : ''}>Sucre</option>
                        <option value="tarija" ${this.filters.location.city === 'tarija' ? 'selected' : ''}>Tarija</option>
                        <option value="oruro" ${this.filters.location.city === 'oruro' ? 'selected' : ''}>Oruro</option>
                        <option value="potosi" ${this.filters.location.city === 'potosi' ? 'selected' : ''}>Potosí</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderAvailabilityFilter() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        return `
            <div class="filter-section px-4 py-3">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Disponibilidad</h4>
                
                <!-- Date Filter -->
                <div class="date-filter mb-3">
                    <label class="block text-sm text-gray-600 mb-2">Fecha preferida</label>
                    <input type="date" 
                           class="availability-date w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                           min="${tomorrowStr}"
                           value="${this.filters.availability.date || ''}">
                </div>
                
                <!-- Time Slots -->
                <div class="time-slots">
                    <label class="block text-sm text-gray-600 mb-2">Horarios preferidos</label>
                    <div class="time-slot-options grid grid-cols-2 gap-2">
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" 
                                   class="time-slot-checkbox text-primary-600 focus:ring-primary-500" 
                                   value="morning"
                                   ${this.filters.availability.timeSlots.includes('morning') ? 'checked' : ''}>
                            <span class="text-sm text-gray-700">Mañana (8-12)</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" 
                                   class="time-slot-checkbox text-primary-600 focus:ring-primary-500" 
                                   value="afternoon"
                                   ${this.filters.availability.timeSlots.includes('afternoon') ? 'checked' : ''}>
                            <span class="text-sm text-gray-700">Tarde (12-18)</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" 
                                   class="time-slot-checkbox text-primary-600 focus:ring-primary-500" 
                                   value="evening"
                                   ${this.filters.availability.timeSlots.includes('evening') ? 'checked' : ''}>
                            <span class="text-sm text-gray-700">Noche (18-22)</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" 
                                   class="time-slot-checkbox text-primary-600 focus:ring-primary-500" 
                                   value="weekend"
                                   ${this.filters.availability.timeSlots.includes('weekend') ? 'checked' : ''}>
                            <span class="text-sm text-gray-700">Fines de semana</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        return Array.from({ length: 5 }, (_, i) => {
            const filled = i < rating;
            return `<svg class="w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>`;
        }).join('');
    }

    bindEvents() {
        const toggleBtn = this.container.querySelector('.toggle-filters');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', this.toggleExpanded.bind(this));
        }

        const clearBtn = this.container.querySelector('.clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', this.clearAllFilters.bind(this));
        }
    }

    bindFilterEvents() {
        // Ensure container exists before binding events
        if (!this.container) {
            console.warn('SearchFilters container not found, skipping event binding');
            return;
        }
        
        // Sort select
        const sortSelect = this.container.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sortBy = e.target.value;
                this.onFiltersChange();
            });
        }

        // Category checkboxes
        const categoryCheckboxes = this.container.querySelectorAll('.category-checkbox');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (!this.filters.categories.includes(e.target.value)) {
                        this.filters.categories.push(e.target.value);
                    }
                } else {
                    this.filters.categories = this.filters.categories.filter(cat => cat !== e.target.value);
                }
                this.onFiltersChange();
                this.updateActiveFilters();
            });
        });

        // Price inputs
        const priceMin = this.container.querySelector('.price-min');
        const priceMax = this.container.querySelector('.price-max');
        
        if (priceMin && priceMax) {
            const updatePriceFilter = () => {
                this.filters.priceRange.min = priceMin.value ? parseInt(priceMin.value) : null;
                this.filters.priceRange.max = priceMax.value ? parseInt(priceMax.value) : null;
                this.onFiltersChange();
                this.updateActiveFilters();
            };
            
            priceMin.addEventListener('input', updatePriceFilter);
            priceMax.addEventListener('input', updatePriceFilter);
        }

        // Quick price range buttons
        const priceRangeBtns = this.container.querySelectorAll('.price-range-btn');
        priceRangeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const min = btn.dataset.min;
                const max = btn.dataset.max;
                
                if (priceMin) priceMin.value = min;
                if (priceMax) priceMax.value = max || '';
                
                this.filters.priceRange.min = min ? parseInt(min) : null;
                this.filters.priceRange.max = max ? parseInt(max) : null;
                
                this.onFiltersChange();
                this.updateActiveFilters();
            });
        });

        // Rating radios
        const ratingRadios = this.container.querySelectorAll('.rating-radio');
        ratingRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.rating = e.target.value ? parseInt(e.target.value) : null;
                this.onFiltersChange();
                this.updateActiveFilters();
            });
        });

        // Location filters
        const useLocationBtn = this.container.querySelector('.use-location-btn');
        if (useLocationBtn) {
            useLocationBtn.addEventListener('click', this.useCurrentLocation.bind(this));
        }

        const radiusSelect = this.container.querySelector('.radius-select');
        if (radiusSelect) {
            radiusSelect.addEventListener('change', (e) => {
                this.filters.location.radius = e.target.value ? parseInt(e.target.value) : null;
                this.onFiltersChange();
                this.updateActiveFilters();
            });
        }

        const citySelect = this.container.querySelector('.city-select');
        if (citySelect) {
            citySelect.addEventListener('change', (e) => {
                this.filters.location.city = e.target.value || null;
                this.onFiltersChange();
                this.updateActiveFilters();
            });
        }

        // Availability filters
        const availabilityDate = this.container.querySelector('.availability-date');
        if (availabilityDate) {
            availabilityDate.addEventListener('change', (e) => {
                this.filters.availability.date = e.target.value || null;
                this.onFiltersChange();
                this.updateActiveFilters();
            });
        }

        const timeSlotCheckboxes = this.container.querySelectorAll('.time-slot-checkbox');
        timeSlotCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (!this.filters.availability.timeSlots.includes(e.target.value)) {
                        this.filters.availability.timeSlots.push(e.target.value);
                    }
                } else {
                    this.filters.availability.timeSlots = this.filters.availability.timeSlots.filter(slot => slot !== e.target.value);
                }
                this.onFiltersChange();
                this.updateActiveFilters();
            });
        });
    }

    useCurrentLocation() {
        if (!navigator.geolocation) {
            alert('La geolocalización no está disponible en tu navegador');
            return;
        }

        const btn = this.container.querySelector('.use-location-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = `
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Obteniendo ubicación...</span>
        `;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.filters.location.coordinates = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                if (!this.filters.location.radius) {
                    this.filters.location.radius = 5; // Default 5km radius
                }
                
                btn.innerHTML = `
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Ubicación obtenida</span>
                `;
                
                // Show distance filter
                const distanceFilter = this.container.querySelector('.distance-filter');
                if (distanceFilter) {
                    distanceFilter.classList.remove('hidden');
                }

                this.onFiltersChange();
                this.updateActiveFilters();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            },
            (error) => {
                console.error('Error getting location:', error);
                btn.innerHTML = `
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Error al obtener ubicación</span>
                `;
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            }
        );
    }

    toggleExpanded() {
        this.isExpanded = !this.isExpanded;
        const content = this.container.querySelector('.filter-content');
        const toggleBtn = this.container.querySelector('.toggle-filters svg');
        
        if (this.isExpanded) {
            content.classList.remove('hidden');
            toggleBtn.classList.add('rotate-180');
        } else {
            content.classList.add('hidden');
            toggleBtn.classList.remove('rotate-180');
        }
    }

    clearAllFilters() {
        this.filters = {
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
        };
        
        // Reset UI
        this.container.innerHTML = this.render();
        this.bindFilterEvents();
        
        this.onFiltersChange();
        this.updateActiveFilters();
    }

    updateActiveFilters() {
        const activeFiltersContainer = this.container.querySelector('.active-filters');
        const filtersDiv = activeFiltersContainer.querySelector('div');
        const activeTags = [];

        // Category filters
        this.filters.categories.forEach(categoryId => {
            const category = this.categories.find(cat => cat.id === categoryId);
            if (category) {
                activeTags.push({
                    type: 'category',
                    id: categoryId,
                    label: category.name
                });
            }
        });

        // Price filter
        if (this.filters.priceRange.min || this.filters.priceRange.max) {
            const min = this.filters.priceRange.min || '0';
            const max = this.filters.priceRange.max || '∞';
            activeTags.push({
                type: 'price',
                id: 'price',
                label: `${min} - ${max} Bs.`
            });
        }

        // Rating filter
        if (this.filters.rating) {
            activeTags.push({
                type: 'rating',
                id: 'rating',
                label: `${this.filters.rating}+ estrellas`
            });
        }

        // Location filters
        if (this.filters.location.city) {
            const cityNames = {
                'la-paz': 'La Paz',
                'cochabamba': 'Cochabamba',
                'santa-cruz': 'Santa Cruz',
                'sucre': 'Sucre',
                'tarija': 'Tarija',
                'oruro': 'Oruro',
                'potosi': 'Potosí'
            };
            activeTags.push({
                type: 'city',
                id: 'city',
                label: cityNames[this.filters.location.city]
            });
        }

        if (this.filters.location.radius) {
            activeTags.push({
                type: 'radius',
                id: 'radius',
                label: `Dentro de ${this.filters.location.radius} km`
            });
        }

        // Availability filters
        if (this.filters.availability.date) {
            const date = new Date(this.filters.availability.date);
            activeTags.push({
                type: 'date',
                id: 'date',
                label: `Fecha: ${date.toLocaleDateString('es-BO')}`
            });
        }

        this.filters.availability.timeSlots.forEach(slot => {
            const slotNames = {
                'morning': 'Mañana',
                'afternoon': 'Tarde',
                'evening': 'Noche',
                'weekend': 'Fines de semana'
            };
            activeTags.push({
                type: 'timeSlot',
                id: slot,
                label: slotNames[slot]
            });
        });

        if (activeTags.length > 0) {
            activeFiltersContainer.classList.remove('hidden');
            filtersDiv.innerHTML = activeTags.map(tag => `
                <span class="filter-tag inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    ${tag.label}
                    <button class="remove-filter ml-1 hover:text-primary-900" data-type="${tag.type}" data-id="${tag.id}">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </span>
            `).join('');

            // Bind remove filter events
            filtersDiv.querySelectorAll('.remove-filter').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeFilter(btn.dataset.type, btn.dataset.id);
                });
            });
        } else {
            activeFiltersContainer.classList.add('hidden');
        }
    }

    removeFilter(type, id) {
        switch (type) {
            case 'category':
                this.filters.categories = this.filters.categories.filter(cat => cat !== id);
                break;
            case 'price':
                this.filters.priceRange = { min: null, max: null };
                break;
            case 'rating':
                this.filters.rating = null;
                break;
            case 'city':
                this.filters.location.city = null;
                break;
            case 'radius':
                this.filters.location.radius = null;
                break;
            case 'date':
                this.filters.availability.date = null;
                break;
            case 'timeSlot':
                this.filters.availability.timeSlots = this.filters.availability.timeSlots.filter(slot => slot !== id);
                break;
        }

        // Re-render to update UI
        this.container.innerHTML = this.render();
        this.bindFilterEvents();
        this.updateActiveFilters();
        this.onFiltersChange();
    }

    onFiltersChange() {
        if (this.options.onFiltersChange) {
            this.options.onFiltersChange(this.getFilters());
        }
    }

    getFilters() {
        return { ...this.filters };
    }

    setFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        this.container.innerHTML = this.render();
        this.bindFilterEvents();
        this.updateActiveFilters();
    }

    destroy() {
        this.container.innerHTML = '';
    }
}