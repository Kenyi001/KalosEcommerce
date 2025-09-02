/**
 * Loading Page - Shows while content is loading
 */

export function renderLoadingPage() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-kalos-white">
      <div class="text-center">
        <!-- Kalos Logo Spinner -->
        <div class="relative">
          <div class="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-4"></div>
          <div class="absolute top-0 left-1/2 transform -translate-x-1/2">
            <div class="w-16 h-16 flex items-center justify-center">
              <span class="text-2xl">💄</span>
            </div>
          </div>
        </div>
        
        <h2 class="text-xl font-display text-navy mb-2">
          Cargando...
        </h2>
        
        <p class="text-gray-600 animate-pulse">
          Preparando la mejor experiencia de belleza
        </p>
      </div>
    </div>
  `;
}

// Utility to show loading with custom message
export function showLoading(message = 'Cargando...') {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-kalos-white">
        <div class="text-center">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-4"></div>
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2">
              <div class="w-16 h-16 flex items-center justify-center">
                <span class="text-2xl">💄</span>
              </div>
            </div>
          </div>
          <h2 class="text-xl font-display text-navy mb-2">${message}</h2>
          <p class="text-gray-600 animate-pulse">
            Preparando la mejor experiencia de belleza
          </p>
        </div>
      </div>
    `;
  }
}

export default renderLoadingPage;