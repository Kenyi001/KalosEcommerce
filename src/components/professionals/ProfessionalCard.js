/**
 * ProfessionalCard Component
 * Displays professional information in card format for listings
 */

export class ProfessionalCard {
  constructor(professional, options = {}) {
    this.professional = professional;
    this.options = {
      showStats: true,
      showLocation: true,
      showCategories: true,
      clickable: true,
      ...options
    };
  }

  render() {
    const { professional, options } = this;
    const { personalInfo, businessInfo, location, stats } = professional;

    const profileImage = personalInfo?.profileImage || '/assets/default-avatar.png';
    const name = personalInfo?.firstName || 'Profesional';
    const businessName = businessInfo?.businessName || 'Sin nombre';
    const description = businessInfo?.description || 'Sin descripción';
    const categories = businessInfo?.categories || [];
    const rating = stats?.averageRating || 0;
    const reviewCount = stats?.totalReviews || 0;
    
    const locationText = location ? 
      `${location.city || ''}${location.zone ? ', ' + location.zone : ''}` : 
      'Ubicación no especificada';

    return `
      <div class="professional-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${options.clickable ? 'cursor-pointer hover:transform hover:scale-[1.02]' : ''}" 
           data-professional-id="${professional.id}">
        
        <!-- Header with image and basic info -->
        <div class="relative">
          <div class="h-48 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center overflow-hidden">
            ${profileImage && profileImage !== '/assets/default-avatar.png' ? `
              <img src="${profileImage}" 
                   alt="${name}" 
                   class="w-full h-full object-cover">
            ` : `
              <div class="w-20 h-20 bg-brand-200 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-brand-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            `}
          </div>
          
          <!-- Rating badge -->
          ${rating > 0 ? `
            <div class="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">${rating.toFixed(1)}</span>
            </div>
          ` : ''}
        </div>

        <!-- Content -->
        <div class="p-4">
          <!-- Name and business -->
          <div class="mb-2">
            <h3 class="font-semibold text-lg text-gray-900 truncate">${name}</h3>
            <p class="text-sm text-gray-600 truncate">${businessName}</p>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-700 mb-3 line-clamp-2">${description}</p>

          <!-- Categories -->
          ${options.showCategories && categories.length > 0 ? `
            <div class="flex flex-wrap gap-1 mb-3">
              ${categories.slice(0, 3).map(category => `
                <span class="inline-block bg-brand-100 text-brand-800 text-xs px-2 py-1 rounded-full">
                  ${category}
                </span>
              `).join('')}
              ${categories.length > 3 ? `
                <span class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +${categories.length - 3}
                </span>
              ` : ''}
            </div>
          ` : ''}

          <!-- Location -->
          ${options.showLocation && location ? `
            <div class="flex items-center text-sm text-gray-600 mb-3">
              <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="truncate">${locationText}</span>
            </div>
          ` : ''}

          <!-- Stats -->
          ${options.showStats ? `
            <div class="flex items-center space-x-3">
              ${reviewCount > 0 ? `
                <span class="text-sm text-gray-600">${reviewCount} reseña${reviewCount !== 1 ? 's' : ''}</span>
              ` : ''}
              ${stats?.totalServices > 0 ? `
                <span class="text-sm text-gray-600">${stats.totalServices} servicio${stats.totalServices !== 1 ? 's' : ''}</span>
              ` : ''}
            </div>
          ` : ''}

          <!-- Action buttons -->
          <div class="mt-4 flex space-x-2">
            <button class="flex-1 bg-brand text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-600 transition-colors"
                    data-action="view-professional">
              Ver Perfil
            </button>
            ${options.showBookButton ? `
              <button class="flex-1 bg-navy text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-navy-600 transition-colors"
                      data-action="book-professional">
                Reservar
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Mount the card to a container
   * @param {HTMLElement} container - Container element
   * @returns {ProfessionalCard} This instance for chaining
   */
  mount(container) {
    if (!container) {
      console.error('ProfessionalCard: Container is required');
      return this;
    }

    container.innerHTML = this.render();
    this.element = container.firstElementChild;

    // Add event listeners
    this.bindEvents();

    return this;
  }

  /**
   * Bind event listeners to the card
   * @private
   */
  bindEvents() {
    if (!this.element) return;

    // Handle view professional event
    const viewButton = this.element.querySelector('[data-action="view-professional"]');
    if (viewButton) {
      viewButton.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('view-professional', {
          detail: { professionalId: this.professional.id }
        }));
      });
    }

    // Handle book professional event
    const bookButton = this.element.querySelector('[data-action="book-professional"]');
    if (bookButton) {
      bookButton.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('book-professional', {
          detail: { professionalId: this.professional.id }
        }));
      });
    }
  }

  /**
   * Update the card with new professional data
   * @param {Object} professional - New professional data
   * @returns {ProfessionalCard} This instance for chaining
   */
  update(professional) {
    this.professional = professional;
    if (this.element && this.element.parentNode) {
      this.element.parentNode.innerHTML = this.render();
      this.element = this.element.parentNode.firstElementChild;
      this.bindEvents();
    }
    return this;
  }

  /**
   * Remove the card from the DOM
   * @returns {ProfessionalCard} This instance for chaining
   */
  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }
    return this;
  }

  /**
   * Create a new professional card instance
   * @static
   * @param {Object} professional - Professional data
   * @param {Object} options - Card options
   * @returns {ProfessionalCard} New card instance
   */
  static create(professional, options = {}) {
    return new ProfessionalCard(professional, options);
  }
}

export default ProfessionalCard;