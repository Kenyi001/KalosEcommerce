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
          ${options.showStats && rating > 0 ? `
            <div class="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">${rating.toFixed(1)}</span>
            </div>
          ` : ''}
        </div>

        <!-- Content -->
        <div class="p-4">
          <!-- Business name and professional name -->
          <div class="mb-2">
            <h3 class="font-semibold text-lg text-navy-900 line-clamp-1">${businessName}</h3>
            <p class="text-sm text-gray-600">${name}</p>
          </div>

          <!-- Categories -->
          ${options.showCategories && categories.length > 0 ? `
            <div class="mb-3">
              <div class="flex flex-wrap gap-1">
                ${categories.slice(0, 3).map(category => `
                  <span class="inline-block px-2 py-1 bg-brand-100 text-brand-800 text-xs rounded-full capitalize">
                    ${this._formatCategory(category)}
                  </span>
                `).join('')}
                ${categories.length > 3 ? `
                  <span class="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +${categories.length - 3} más
                  </span>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">${description}</p>

          <!-- Stats and location -->
          <div class="flex items-center justify-between text-xs text-gray-500">
            ${options.showLocation ? `
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span class="truncate">${locationText}</span>
              </div>
            ` : ''}

            ${options.showStats ? `
              <div class="flex items-center space-x-3">
                ${reviewCount > 0 ? `
                  <span>${reviewCount} reseña${reviewCount !== 1 ? 's' : ''}</span>
                ` : ''}
                ${stats?.totalServices > 0 ? `
                  <span>${stats.totalServices} servicio${stats.totalServices !== 1 ? 's' : ''}</span>
                ` : ''}
              </div>
            ` : ''}
          </div>

          <!-- Action buttons -->
          <div class="mt-4 flex space-x-2">
            <button class="flex-1 bg-brand text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-brand-600 transition-colors"
                    onclick="window.dispatchEvent(new CustomEvent('view-professional', { detail: { professionalId: '${professional.id}' } }))">
              Ver Perfil
            </button>
            ${location?.homeService ? `
              <button class="flex-1 bg-navy-100 text-navy-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-navy-200 transition-colors"
                      onclick="window.dispatchEvent(new CustomEvent('book-service', { detail: { professionalId: '${professional.id}' } }))">
                Reservar
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Format category name for display
   * @private
   * @param {string} category - Category key
   * @returns {string} Formatted category name
   */
  _formatCategory(category) {
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

  /**
   * Mount the card to a container
   * @param {HTMLElement|string} container - Container element or selector
   */
  mount(container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }

    if (container) {
      const cardElement = document.createElement('div');
      cardElement.innerHTML = this.render();
      const cardNode = cardElement.firstElementChild;
      
      // Add click handler if clickable
      if (this.options.clickable) {
        cardNode.addEventListener('click', (e) => {
          // Don't trigger if clicking on action buttons
          if (!e.target.closest('button')) {
            window.dispatchEvent(new CustomEvent('view-professional', { 
              detail: { professionalId: this.professional.id } 
            }));
          }
        });
      }

      container.appendChild(cardNode);
      return cardNode;
    }
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