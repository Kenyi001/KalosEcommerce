// Main application entry point for Kalos E-commerce
import './styles/main.css';
import { initializeApp } from './config/firebase-config.js';
import { authService } from './services/auth.js';
import { protectedRouter } from './utils/ProtectedRouter.js';

// Initialize Firebase and authentication
async function init() {
  try {
    // Initialize Firebase
    await initializeApp();
    console.log('Firebase initialized');
    
    // Initialize authentication
    await authService.init();
    console.log('Auth service initialized');
    
    // Initialize router
    protectedRouter.init();
    console.log('Protected Router initialized');
    
    // Add global auth listener for navigation protection
    authService.addAuthListener((user, profile) => {
      handleAuthStateChange(user, profile);
    });
    
    console.log('Kalos E-commerce app fully initialized');
    
  } catch (error) {
    console.error('Error initializing app:', error);
    showError('Error al inicializar la aplicación');
  }
}

// Handle authentication state changes
function handleAuthStateChange(user, profile) {
  const currentPath = window.location.pathname;
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/perfil', '/reservas', '/mensajes'];
  
  // Professional routes
  const professionalRoutes = ['/professional/dashboard', '/professional/servicios', '/professional/calendario'];
  
  // Admin routes
  const adminRoutes = ['/admin', '/admin/usuarios', '/admin/moderacion'];
  
  // Public routes that redirect if authenticated
  const publicOnlyRoutes = ['/login', '/registro'];
  
  if (user) {
    // User is authenticated
    console.log('User authenticated:', user.email, 'Type:', profile?.userType);
    
    // Redirect from public-only routes
    if (publicOnlyRoutes.includes(currentPath)) {
      const redirectTo = getRedirectRoute(profile);
      router.navigate(redirectTo, true);
      return;
    }
    
    // Check access to professional routes
    if (professionalRoutes.includes(currentPath) && profile?.userType !== 'professional') {
      router.navigate('/dashboard', true);
      return;
    }
    
    // Check access to admin routes
    if (adminRoutes.includes(currentPath) && profile?.userType !== 'admin') {
      router.navigate('/dashboard', true);
      return;
    }
    
  } else {
    // User is not authenticated
    console.log('User not authenticated');
    
    // Redirect from protected routes
    if (protectedRoutes.includes(currentPath) || 
        professionalRoutes.includes(currentPath) || 
        adminRoutes.includes(currentPath)) {
      router.navigate('/login', true);
      return;
    }
  }
}

// Get appropriate redirect route based on user profile
function getRedirectRoute(profile) {
  if (!profile) return '/dashboard';
  
  switch (profile.userType) {
    case 'admin':
      return '/admin';
    case 'professional':
      return '/professional/dashboard';
    case 'client':
    default:
      return '/dashboard';
  }
}

// Show error message
function showError(message) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-md mx-auto p-6">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 class="text-2xl font-fraunces font-bold text-navy-900 mb-4">Error</h1>
        <p class="text-navy-600 mb-6">${message}</p>
        <button onclick="window.location.reload()" class="btn-primary">
          Reintentar
        </button>
      </div>
    </div>
  `;
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export for global access if needed
window.KalosApp = {
  authService,
  router: protectedRouter,
  init
};
