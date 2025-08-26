/**
 * NotFound Page (404) - Error page for invalid routes
 */

import { renderWithLayout, initializeLayout } from '../components/Layout.js';

export function renderNotFoundPage() {
  const content = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-brand mb-4">404</h1>
          <h2 class="text-2xl font-display font-semibold text-navy mb-2">
            Página no encontrada
          </h2>
          <p class="text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <div class="space-y-4">
          <button 
            data-router-link 
            data-href="/"
            class="w-full bg-brand hover:bg-brand-hover text-kalos-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Volver al Inicio
          </button>
          
          <button 
            data-router-link 
            data-href="/buscar"
            class="w-full border border-brand text-brand hover:bg-brand hover:text-kalos-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Buscar Profesionales
          </button>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            ¿Necesitas ayuda? 
            <button 
              data-router-link 
              data-href="/contacto"
              class="text-brand hover:underline">
              Contáctanos
            </button>
          </p>
        </div>
      </div>
    </div>
  `;
  
  return renderWithLayout(content);
}

export function initializeNotFoundPage() {
  initializeLayout();
}

export default renderNotFoundPage;