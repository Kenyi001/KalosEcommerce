import './styles/main.css';

// Import router and auth systems
import router from './utils/router.js';
import routes from './router/routes.js';
import { initializeAuthState } from './utils/auth-state.js';

// Firebase is initialized in the auth service to avoid conflicts

// Initialize Router
function initializeRouter() {
  // Register all routes
  routes.forEach(route => {
    router.addRoute(route.path, route.handler, {
      guards: route.guards,
      title: route.title,
      meta: route.meta
    });
  });

  // Start the router
  router.start();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Kalos E-commerce...');
  
  try {
    // Initialize authentication state management
    initializeAuthState();
    console.log('🔐 Auth state manager initialized');
    
    // Initialize router
    initializeRouter();
    console.log('🗺️ Router initialized');
    
    console.log('✅ Kalos E-commerce initialized successfully');
    
    // Development debug helpers
    if (import.meta.env.DEV) {
      console.log('🛠️  Debug helpers available:');
      console.log('   - debugSearch(): Check demo professionals data');
      console.log('   - forceHeaderUpdate(): Force header authentication update');
      console.log('   - initializeHeader(): Reinitialize header');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Kalos E-commerce:', error);
    
    // Show error message to user
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-red-600 mb-4">Error de Inicialización</h1>
          <p class="text-gray-600 mb-4">La aplicación no pudo inicializarse correctamente.</p>
          <button onclick="window.location.reload()" class="bg-brand text-white px-4 py-2 rounded hover:bg-brand-hover">
            Recargar Página
          </button>
        </div>
      </div>
    `;
  }
});

// Export router for global access
export { router };
export default router;