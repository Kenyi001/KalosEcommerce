/**
 * Service Details Modal Component - Kalos Design System
 * Modal para mostrar detalles completos de un servicio
 */

import { BaseComponent } from '../../BaseComponent.js';
import { renderIcon } from '../../atoms/Icon/Icon.js';
import { Button } from '../../atoms/Button/Button.js';

export class ServiceDetailsModal extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      service: null,
      professional: null,
      isOpen: false,
      onClose: null,
      onBookService: null,
      ...props
    };
  }

  render() {
    if (!this.props.isOpen || !this.props.service) return '';

    const { service, professional } = this.props;
    
    return `
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-component="service-details-modal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="relative">
            <div class="aspect-video bg-gray-100 overflow-hidden">
              <img 
                src="${service.images?.[0] || '/images/placeholder-service.jpg'}" 
                alt="${service.name}"
                class="w-full h-full object-cover"
              />
              <!-- Close Button -->
              <button 
                class="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors"
                id="close-modal-btn"
                aria-label="Cerrar modal"
              >
                ${renderIcon('x', { size: '20' })}
              </button>
              
              <!-- Category Badge -->
              <div class="absolute top-4 left-4 bg-brand text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                ${this.getCategoryLabel(service.category)}
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 max-h-96 overflow-y-auto">
            <!-- Service Header -->
            <div class="mb-6">
              <h2 class="text-2xl font-display font-bold text-gray-900 mb-2">${service.name}</h2>
              <p class="text-gray-600 leading-relaxed">${service.description}</p>
            </div>

            <!-- Price and Duration -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center gap-2 text-gray-600 mb-1">
                  ${renderIcon('dollar-sign', { size: '16' })}
                  <span class="text-sm font-medium">Precio</span>
                </div>
                <div class="text-xl font-bold text-gray-900">Bs. ${service.price}</div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center gap-2 text-gray-600 mb-1">
                  ${renderIcon('clock', { size: '16' })}
                  <span class="text-sm font-medium">Duración</span>
                </div>
                <div class="text-xl font-bold text-gray-900">${service.duration} min</div>
              </div>
            </div>

            <!-- Professional Info -->
            ${professional ? this.renderProfessionalInfo(professional) : ''}

            <!-- Service Details -->
            <div class="space-y-4 mb-6">
              <h3 class="text-lg font-semibold text-gray-900">¿Qué incluye?</h3>
              <div class="space-y-2">
                ${this.renderServiceIncludes(service)}
              </div>
            </div>

            <!-- Additional Info -->
            <div class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    ${renderIcon('info', { size: '16', className: 'text-blue-600' })}
                  </div>
                  <div>
                    <h4 class="font-semibold text-blue-900 mb-1">Servicio a domicilio</h4>
                    <p class="text-blue-700 text-sm">El profesional se traslada hasta tu ubicación con todos los materiales necesarios.</p>
                  </div>
                </div>
              </div>

              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    ${renderIcon('shield-check', { size: '16', className: 'text-green-600' })}
                  </div>
                  <div>
                    <h4 class="font-semibold text-green-900 mb-1">Satisfacción garantizada</h4>
                    <p class="text-green-700 text-sm">Si no estás satisfecho, te devolvemos tu dinero.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="border-t border-gray-100 p-6 bg-gray-50">
            <div class="flex flex-col sm:flex-row gap-3">
              <button 
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                id="contact-professional-btn"
              >
                ${renderIcon('message-circle', { size: '20' })}
                Consultar
              </button>
              <button 
                class="flex-1 bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                id="book-service-btn"
              >
                ${renderIcon('calendar', { size: '20' })}
                Reservar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderProfessionalInfo(professional) {
    return `
      <div class="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Tu profesional</h3>
        <div class="flex items-center gap-3">
          <img 
            src="${professional.avatar || '/images/placeholder-avatar.jpg'}" 
            alt="${professional.name}"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h4 class="font-semibold text-gray-900">${professional.name}</h4>
              ${professional.verified ? `
                <span class="text-success">
                  ${renderIcon('check-circle', { size: '16' })}
                </span>
              ` : ''}
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                ${this.renderStars(professional.rating || 4.8)}
                <span class="font-medium">${professional.rating || 4.8}</span>
              </div>
              <span>•</span>
              <span>${professional.reviewCount || 127} reseñas</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderServiceIncludes(service) {
    const defaultIncludes = [
      'Consulta previa para definir estilo',
      'Productos profesionales de alta calidad',
      'Aplicación personalizada según tu tipo de rostro',
      'Retoques durante el evento (si aplica)',
      'Consejos para mantener el look'
    ];

    const includes = service.includes || defaultIncludes;
    
    return includes.map(item => `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
          ${renderIcon('check', { size: '12', className: 'text-green-600' })}
        </div>
        <span class="text-gray-700">${item}</span>
      </div>
    `).join('');
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars += `<span class="text-gold">${renderIcon('star', { size: '14' })}</span>`;
    }
    
    // Half star
    if (hasHalfStar) {
      stars += `<span class="text-gold">${renderIcon('star', { size: '14' })}</span>`;
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars += `<span class="text-gray-300">${renderIcon('star', { size: '14' })}</span>`;
    }
    
    return stars;
  }

  getCategoryLabel(category) {
    const categories = {
      makeup: 'Maquillaje',
      hair: 'Cabello',
      nails: 'Uñas',
      skincare: 'Cuidado facial',
      massage: 'Masajes',
      eyebrows: 'Cejas'
    };
    
    return categories[category] || 'Servicio';
  }

  afterMount() {
    super.afterMount();
    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = this.element?.querySelector('#close-modal-btn');
    const contactBtn = this.element?.querySelector('#contact-professional-btn');
    const bookBtn = this.element?.querySelector('#book-service-btn');

    // Close modal
    if (closeBtn) {
      this.addEventListener(closeBtn, 'click', () => {
        this.close();
      });
    }

    // Contact professional
    if (contactBtn) {
      this.addEventListener(contactBtn, 'click', () => {
        this.close();
        // Open chat or contact modal
        if (window.openChat) {
          window.openChat();
        }
      });
    }

    // Book service
    if (bookBtn) {
      this.addEventListener(bookBtn, 'click', () => {
        if (this.props.onBookService) {
          this.props.onBookService(this.props.service);
        }
        this.close();
      });
    }

    // Close with backdrop click
    this.addEventListener(this.element, 'click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });

    // Close with Escape key
    this.addEventListener(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.props.isOpen) {
        this.close();
      }
    });
  }

  close() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}
