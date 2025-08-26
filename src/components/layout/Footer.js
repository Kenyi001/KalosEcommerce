// Footer component for Kalos E-commerce
export class Footer {
  constructor(config = {}) {
    this.config = {
      showNewsletter: config.showNewsletter !== false,
      showSocial: config.showSocial !== false,
      className: config.className || '',
      ...config
    };
  }

  render() {
    const footer = document.createElement('footer');
    footer.className = `bg-navy-900 text-white ${this.config.className}`;
    
    footer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="md:col-span-1">
            <div class="flex items-center mb-4">
              <svg class="h-8 w-8 text-brand mr-2" viewBox="0 0 32 32" fill="currentColor">
                <rect width="32" height="32" rx="6" fill="#F74F4E"/>
                <path d="M8 24V8h3v6.5l6-6.5h4l-6 6 6 10h-4l-4-6.5-2 2V24H8z" fill="white"/>
                <circle cx="24" cy="12" r="2" fill="#FCBE3C" opacity="0.8"/>
                <circle cx="22" cy="20" r="1.5" fill="#FCBE3C" opacity="0.6"/>
              </svg>
              <span class="font-fraunces font-bold text-xl">Kalos</span>
            </div>
            <p class="text-sm text-gray-300 mb-4">
              Tu belleza en casa. Conectamos profesionales calificados contigo para servicios de belleza a domicilio en Bolivia.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-brand transition-colors">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-brand transition-colors">
                <span class="sr-only">Instagram</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348c1.297 0 2.348 1.051 2.348 2.348S9.746 16.988 8.449 16.988zM16.988 8.449c0 1.297-1.051 2.348-2.348 2.348s-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348S16.988 7.152 16.988 8.449z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-brand transition-colors">
                <span class="sr-only">WhatsApp</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.488"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Services Section -->
          <div>
            <h3 class="text-sm font-fraunces font-semibold text-white uppercase tracking-wider mb-4">
              Servicios
            </h3>
            <ul class="space-y-2">
              <li>
                <a href="/buscar?categoria=cabello" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Cabello y Peinados
                </a>
              </li>
              <li>
                <a href="/buscar?categoria=unas" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Manicure y Pedicure
                </a>
              </li>
              <li>
                <a href="/buscar?categoria=maquillaje" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Maquillaje
                </a>
              </li>
              <li>
                <a href="/buscar?categoria=masajes" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Masajes y Relajación
                </a>
              </li>
              <li>
                <a href="/buscar?categoria=cejas" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Cejas y Pestañas
                </a>
              </li>
            </ul>
          </div>

          <!-- Company Section -->
          <div>
            <h3 class="text-sm font-fraunces font-semibold text-white uppercase tracking-wider mb-4">
              Empresa
            </h3>
            <ul class="space-y-2">
              <li>
                <a href="/como-funciona" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Cómo Funciona
                </a>
              </li>
              <li>
                <a href="/profesionales" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Únete como Profesional
                </a>
              </li>
              <li>
                <a href="/seguridad" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Seguridad y Confianza
                </a>
              </li>
              <li>
                <a href="/blog" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Blog de Belleza
                </a>
              </li>
              <li>
                <a href="/ayuda" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Centro de Ayuda
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal Section -->
          <div>
            <h3 class="text-sm font-fraunces font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul class="space-y-2">
              <li>
                <a href="/legal/terminos" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a href="/legal/privacidad" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="/legal/cancelaciones" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Política de Cancelación
                </a>
              </li>
              <li>
                <a href="/contacto" class="text-sm text-gray-300 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Newsletter Section -->
        ${this.config.showNewsletter ? this.renderNewsletter() : ''}
        
        <!-- Bottom Section -->
        <div class="mt-8 pt-8 border-t border-gray-700">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="text-sm text-gray-400">
              <p>&copy; 2025 Kalos E-commerce. Todos los derechos reservados.</p>
            </div>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <span class="text-sm text-gray-400">Hecho con ❤️ en Bolivia</span>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-400">Disponible en:</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  La Paz
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Santa Cruz
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Cochabamba
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(footer);
    return footer;
  }

  renderNewsletter() {
    return `
      <div class="mt-8 pt-8 border-t border-gray-700">
        <div class="max-w-md mx-auto text-center">
          <h3 class="text-lg font-fraunces font-semibold text-white mb-2">
            Mantente al día
          </h3>
          <p class="text-sm text-gray-300 mb-4">
            Recibe tips de belleza, ofertas especiales y noticias de nuevos profesionales.
          </p>
          <form class="flex flex-col sm:flex-row gap-3" id="newsletter-form">
            <input
              type="email"
              id="newsletter-email"
              placeholder="tu@email.com"
              class="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              required
            />
            <button
              type="submit"
              class="px-6 py-2 bg-brand text-white font-medium rounded-md hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
            >
              Suscribirse
            </button>
          </form>
          <p class="text-xs text-gray-400 mt-2">
            No spam. Puedes cancelar en cualquier momento.
          </p>
        </div>
      </div>
    `;
  }

  attachEventListeners(footer) {
    // Newsletter form
    const newsletterForm = footer.querySelector('#newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = footer.querySelector('#newsletter-email').value;
        if (email) {
          this.handleNewsletterSubscription(email);
        }
      });
    }
  }

  handleNewsletterSubscription(email) {
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription for:', email);
    
    // Show success message (basic implementation)
    const form = document.querySelector('#newsletter-form');
    if (form) {
      form.innerHTML = `
        <div class="text-center">
          <div class="inline-flex items-center px-4 py-2 rounded-md bg-green-100 text-green-800">
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            ¡Suscripción exitosa!
          </div>
        </div>
      `;
    }
  }

  // Static method for quick footer creation
  static create(config) {
    const footer = new Footer(config);
    return footer.render();
  }
}

export default Footer;