/**
 * Footer Component - Site footer with links and information
 */

export function renderFooter() {
  return `
    <footer class="bg-navy text-kalos-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <span class="text-2xl">💄</span>
              <h3 class="text-2xl font-display font-bold">Kalos</h3>
            </div>
            <p class="text-gray-300 text-base max-w-md">
              La plataforma líder en servicios de belleza a domicilio en Bolivia. 
              Conectamos profesionales de calidad con clientes que buscan lo mejor.
            </p>
            <div class="mt-4">
              <p class="text-sm text-gray-400">
                📍 Bolivia • 📞 +591 70000000 • ✉️ hola@kalos.bo
              </p>
            </div>
          </div>

          <!-- Services -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Servicios</h4>
            <ul class="space-y-2 text-gray-300">
              <li>
                <button data-router-link data-href="/marketplace?category=hair" 
                        class="hover:text-kalos-white transition-colors">
                  Peluquería
                </button>
              </li>
              <li>
                <button data-router-link data-href="/marketplace?category=nails" 
                        class="hover:text-kalos-white transition-colors">
                  Manicure & Pedicure
                </button>
              </li>
              <li>
                <button data-router-link data-href="/marketplace?category=makeup" 
                        class="hover:text-kalos-white transition-colors">
                  Maquillaje
                </button>
              </li>
              <li>
                <button data-router-link data-href="/marketplace?category=spa" 
                        class="hover:text-kalos-white transition-colors">
                  Tratamientos Spa
                </button>
              </li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Empresa</h4>
            <ul class="space-y-2 text-gray-300">
              <li>
                <button data-router-link data-href="/como-funciona" 
                        class="hover:text-kalos-white transition-colors">
                  ¿Cómo Funciona?
                </button>
              </li>
              <li>
                <button data-router-link data-href="/auth/register?role=professional" 
                        class="hover:text-kalos-white transition-colors">
                  Únete como Profesional
                </button>
              </li>
              <li>
                <button data-router-link data-href="/ayuda" 
                        class="hover:text-kalos-white transition-colors">
                  Centro de Ayuda
                </button>
              </li>
              <li>
                <button data-router-link data-href="/contacto" 
                        class="hover:text-kalos-white transition-colors">
                  Contacto
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="mt-12 pt-8 border-t border-gray-600">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="flex space-x-6 text-sm text-gray-400">
              <button data-router-link data-href="/legal/terminos" 
                      class="hover:text-kalos-white transition-colors">
                Términos y Condiciones
              </button>
              <button data-router-link data-href="/legal/privacidad" 
                      class="hover:text-kalos-white transition-colors">
                Política de Privacidad
              </button>
              <button data-router-link data-href="/legal/cancelaciones" 
                      class="hover:text-kalos-white transition-colors">
                Política de Cancelación
              </button>
            </div>
            <div class="mt-4 md:mt-0">
              <p class="text-sm text-gray-400">
                © ${new Date().getFullYear()} Kalos E-commerce. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export default renderFooter;