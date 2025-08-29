/**
 * Card Molecular Components - Kalos Design System
 * Reusable card components for services, professionals, and general content
 */

import { BaseComponent } from '../../BaseComponent.js';
import { renderIcon } from '../../atoms/Icon/Icon.js';

// Base Card Component
export class Card extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      variant: 'default',    // default, elevated, bordered, flat
      padding: 'md',         // none, sm, md, lg
      rounded: 'md',         // none, sm, md, lg, full
      shadow: true,
      hover: false,          // hover effects
      clickable: false,
      className: '',
      children: '',
      onClick: null,
      ...props
    };
  }

  render() {
    const { variant, padding, rounded, shadow, hover, clickable, className, children } = this.props;
    
    const cardClasses = [
      'card',
      `card-${variant}`,
      `card-padding-${padding}`,
      `card-rounded-${rounded}`,
      shadow ? 'card-shadow' : '',
      hover ? 'card-hover' : '',
      clickable ? 'card-clickable' : '',
      className
    ].filter(Boolean).join(' ');

    return `
      <div class="${cardClasses}" data-component="card">
        ${children}
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="card"]';
  }

  bindEvents() {
    if (this.props.clickable && this.props.onClick && this.element) {
      this.addEventListener(this.element, 'click', (e) => {
        this.props.onClick(e);
      });
    }
  }
}

// Service Card Component
export class ServiceCard extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      service: {
        id: '',
        name: '',
        description: '',
        price: 0,
        duration: 0,
        images: [],
        category: '',
        professionalId: ''
      },
      professional: {
        id: '',
        name: '',
        avatar: '',
        rating: 0,
        reviewCount: 0,
        verified: false
      },
      showProfessional: true,
      compact: false,        // Compact layout
      onClick: null,
      onBookNow: null,
      onFavorite: null,
      className: '',
      ...props
    };
  }

  render() {
    const { service, professional, showProfessional, compact, className } = this.props;
    
    const cardClasses = [
      'service-card',
      compact ? 'service-card-compact' : '',
      className
    ].filter(Boolean).join(' ');

    return `
      <div class="${cardClasses}" data-component="service-card" data-service-id="${service.id}">
        <!-- Service Image -->
        <div class="service-card-image">
          <img
            src="${service.images[0] || '/images/placeholder-service.jpg'}"
            alt="${service.name}"
            class="service-image"
            loading="lazy"
          />
          
          <!-- Category Badge -->
          <div class="service-category-badge">
            ${this.getCategoryLabel(service.category)}
          </div>
          
          <!-- Favorite Button -->
          <button class="service-favorite-btn" aria-label="Agregar a favoritos">
            ${renderIcon('heart', { size: '20', className: 'favorite-icon' })}
          </button>
        </div>
        
        <!-- Service Content -->
        <div class="service-card-content">
          <!-- Service Info -->
          <div class="service-info">
            <h3 class="service-title">${service.name}</h3>
            ${!compact ? `<p class="service-description">${service.description}</p>` : ''}
            
            <!-- Service Details -->
            <div class="service-details">
              <div class="service-price">
                <span class="price-currency">Bs.</span>
                <span class="price-amount">${service.price}</span>
              </div>
              <div class="service-duration">
                ${renderIcon('clock', { size: '16', className: 'duration-icon' })}
                <span class="duration-text">${service.duration} min</span>
              </div>
            </div>
          </div>
          
          ${showProfessional ? this.renderProfessionalInfo() : ''}
          
          <!-- Actions -->
          <div class="service-actions">
            <button class="btn btn-ghost btn-sm view-details-btn">
              Ver detalles
            </button>
            <button class="btn btn-primary btn-sm book-now-btn">
              ${renderIcon('calendar', { size: '16' })}
              Reservar
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderProfessionalInfo() {
    const { professional } = this.props;
    
    return `
      <div class="service-professional">
        <div class="professional-avatar">
          <img 
            src="${professional.avatar || '/images/placeholder-avatar.jpg'}" 
            alt="${professional.name}"
            class="avatar-image"
          />
          ${professional.verified ? `
            <div class="verified-badge" title="Profesional verificado">
              ${renderIcon('check-circle', { size: '16', className: 'verified-icon' })}
            </div>
          ` : ''}
        </div>
        
        <div class="professional-info">
          <div class="professional-name">${professional.name}</div>
          <div class="professional-rating">
            <div class="rating-stars">
              ${this.renderStars(professional.rating)}
            </div>
            <span class="rating-text">
              ${professional.rating.toFixed(1)} (${professional.reviewCount})
            </span>
          </div>
        </div>
      </div>
    `;
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHtml += renderIcon('star', { size: '12', className: 'star-icon star-filled' });
    }
    
    // Half star
    if (hasHalfStar) {
      starsHtml += renderIcon('star', { size: '12', className: 'star-icon star-half' });
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += renderIcon('star', { size: '12', className: 'star-icon star-empty' });
    }
    
    return starsHtml;
  }

  getCategoryLabel(category) {
    const categories = {
      makeup: 'Maquillaje',
      hair: 'Cabello',
      nails: 'Uñas',
      skincare: 'Cuidado facial',
      massage: 'Masajes',
      eyebrows: 'Cejas',
      eyelashes: 'Pestañas'
    };
    return categories[category] || category;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="service-card"]';
  }

  bindEvents() {
    // View details button
    const viewDetailsBtn = this.element?.querySelector('.view-details-btn');
    if (viewDetailsBtn) {
      this.addEventListener(viewDetailsBtn, 'click', (e) => {
        e.stopPropagation();
        if (this.props.onClick) {
          this.props.onClick(this.props.service);
        }
      });
    }

    // Book now button
    const bookNowBtn = this.element?.querySelector('.book-now-btn');
    if (bookNowBtn) {
      this.addEventListener(bookNowBtn, 'click', (e) => {
        e.stopPropagation();
        if (this.props.onBookNow) {
          this.props.onBookNow(this.props.service);
        }
      });
    }

    // Favorite button
    const favoriteBtn = this.element?.querySelector('.service-favorite-btn');
    if (favoriteBtn) {
      this.addEventListener(favoriteBtn, 'click', (e) => {
        e.stopPropagation();
        favoriteBtn.classList.toggle('favorited');
        if (this.props.onFavorite) {
          this.props.onFavorite(this.props.service);
        }
      });
    }

    // Card click (for view details)
    if (this.props.onClick && this.element) {
      this.addEventListener(this.element, 'click', () => {
        this.props.onClick(this.props.service);
      });
    }
  }
}

// Professional Card Component
export class ProfessionalCard extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      professional: {
        id: '',
        name: '',
        avatar: '',
        bio: '',
        rating: 0,
        reviewCount: 0,
        servicesCount: 0,
        verified: false,
        location: '',
        categories: [],
        priceRange: { min: 0, max: 0 }
      },
      compact: false,
      showServices: true,
      onClick: null,
      onViewProfile: null,
      onContact: null,
      className: '',
      ...props
    };
  }

  render() {
    const { professional, compact, showServices, className } = this.props;
    
    const cardClasses = [
      'professional-card',
      compact ? 'professional-card-compact' : '',
      className
    ].filter(Boolean).join(' ');

    return `
      <div class="${cardClasses}" data-component="professional-card" data-professional-id="${professional.id}">
        <!-- Professional Header -->
        <div class="professional-header">
          <div class="professional-avatar-container">
            <img 
              src="${professional.avatar || '/images/placeholder-avatar.jpg'}" 
              alt="${professional.name}"
              class="professional-avatar"
            />
            ${professional.verified ? `
              <div class="verified-badge">
                ${renderIcon('check-circle', { size: '20', className: 'verified-icon' })}
              </div>
            ` : ''}
          </div>
          
          <div class="professional-info">
            <h3 class="professional-name">${professional.name}</h3>
            ${professional.location ? `
              <div class="professional-location">
                ${renderIcon('map-pin', { size: '16', className: 'location-icon' })}
                <span>${professional.location}</span>
              </div>
            ` : ''}
            
            <!-- Rating -->
            <div class="professional-rating">
              <div class="rating-stars">
                ${this.renderStars(professional.rating)}
              </div>
              <span class="rating-text">
                ${professional.rating.toFixed(1)} (${professional.reviewCount} reseñas)
              </span>
            </div>
          </div>
        </div>
        
        ${!compact ? `
          <!-- Professional Bio -->
          <div class="professional-bio">
            <p>${professional.bio || 'Profesional de la belleza comprometida con la excelencia.'}</p>
          </div>
        ` : ''}
        
        <!-- Professional Stats -->
        <div class="professional-stats">
          <div class="stat">
            <span class="stat-number">${professional.servicesCount}</span>
            <span class="stat-label">Servicios</span>
          </div>
          <div class="stat">
            <span class="stat-number">${professional.reviewCount}</span>
            <span class="stat-label">Reseñas</span>
          </div>
          <div class="stat">
            <span class="stat-number">Bs. ${professional.priceRange.min}-${professional.priceRange.max}</span>
            <span class="stat-label">Rango</span>
          </div>
        </div>
        
        <!-- Categories -->
        ${professional.categories.length > 0 ? `
          <div class="professional-categories">
            ${professional.categories.map(category => `
              <span class="category-tag">${this.getCategoryLabel(category)}</span>
            `).join('')}
          </div>
        ` : ''}
        
        ${showServices ? this.renderTopServices() : ''}
        
        <!-- Actions -->
        <div class="professional-actions">
          <button class="btn btn-ghost btn-sm view-profile-btn">
            Ver perfil
          </button>
          <button class="btn btn-primary btn-sm contact-btn">
            ${renderIcon('message-circle', { size: '16' })}
            Contactar
          </button>
        </div>
      </div>
    `;
  }

  renderTopServices() {
    // This would typically fetch from professional.services
    // For now, showing placeholder
    return `
      <div class="professional-services">
        <div class="services-header">
          <h4>Servicios destacados</h4>
        </div>
        <div class="services-list">
          <div class="service-item">
            <span class="service-name">Maquillaje social</span>
            <span class="service-price">Bs. 150</span>
          </div>
          <div class="service-item">
            <span class="service-name">Peinado para evento</span>
            <span class="service-price">Bs. 120</span>
          </div>
        </div>
      </div>
    `;
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
      starsHtml += renderIcon('star', { size: '14', className: 'star-icon star-filled' });
    }
    
    if (hasHalfStar) {
      starsHtml += renderIcon('star', { size: '14', className: 'star-icon star-half' });
    }
    
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += renderIcon('star', { size: '14', className: 'star-icon star-empty' });
    }
    
    return starsHtml;
  }

  getCategoryLabel(category) {
    const categories = {
      makeup: 'Maquillaje',
      hair: 'Cabello', 
      nails: 'Uñas',
      skincare: 'Cuidado facial',
      massage: 'Masajes',
      eyebrows: 'Cejas',
      eyelashes: 'Pestañas'
    };
    return categories[category] || category;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="professional-card"]';
  }

  bindEvents() {
    // View profile button
    const viewProfileBtn = this.element?.querySelector('.view-profile-btn');
    if (viewProfileBtn) {
      this.addEventListener(viewProfileBtn, 'click', (e) => {
        e.stopPropagation();
        if (this.props.onViewProfile) {
          this.props.onViewProfile(this.props.professional);
        }
      });
    }

    // Contact button
    const contactBtn = this.element?.querySelector('.contact-btn');
    if (contactBtn) {
      this.addEventListener(contactBtn, 'click', (e) => {
        e.stopPropagation();
        if (this.props.onContact) {
          this.props.onContact(this.props.professional);
        }
      });
    }

    // Card click
    if (this.props.onClick && this.element) {
      this.addEventListener(this.element, 'click', () => {
        this.props.onClick(this.props.professional);
      });
    }
  }
}

// Review Card Component
export class ReviewCard extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      review: {
        id: '',
        customerName: '',
        customerAvatar: '',
        rating: 0,
        comment: '',
        service: '',
        date: '',
        verified: false
      },
      showService: true,
      compact: false,
      className: '',
      ...props
    };
  }

  render() {
    const { review, showService, compact, className } = this.props;
    
    const cardClasses = [
      'review-card',
      compact ? 'review-card-compact' : '',
      className
    ].filter(Boolean).join(' ');

    return `
      <div class="${cardClasses}" data-component="review-card">
        <!-- Review Header -->
        <div class="review-header">
          <div class="customer-info">
            <img 
              src="${review.customerAvatar || '/images/placeholder-avatar.jpg'}" 
              alt="${review.customerName}"
              class="customer-avatar"
            />
            <div class="customer-details">
              <div class="customer-name">
                ${review.customerName}
                ${review.verified ? `
                  <span class="verified-badge">
                    ${renderIcon('check-circle', { size: '14', className: 'verified-icon' })}
                  </span>
                ` : ''}
              </div>
              <div class="review-date">${this.formatDate(review.date)}</div>
            </div>
          </div>
          
          <div class="review-rating">
            ${this.renderStars(review.rating)}
          </div>
        </div>
        
        <!-- Review Content -->
        <div class="review-content">
          <p class="review-comment">${review.comment}</p>
          
          ${showService && review.service ? `
            <div class="review-service">
              <span class="service-label">Servicio:</span>
              <span class="service-name">${review.service}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
      starsHtml += renderIcon('star', { size: '16', className: 'star-icon star-filled' });
    }
    
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += renderIcon('star', { size: '16', className: 'star-icon star-empty' });
    }
    
    return starsHtml;
  }

  formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="review-card"]';
  }
}

// Factory functions
export function createCard(props) {
  return new Card(props);
}

export function createServiceCard(props) {
  return new ServiceCard(props);
}

export function createProfessionalCard(props) {
  return new ProfessionalCard(props);
}

export function createReviewCard(props) {
  return new ReviewCard(props);
}