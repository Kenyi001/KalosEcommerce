// Enhanced router with authentication and role-based guards
import { authService } from '../services/auth.js';
import { AuthPage } from '../pages/auth/AuthPage.js';

class ProtectedRouter {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.defaultRoute = '/';
    this.authRoutes = new Set(['/login', '/registro', '/auth']);
    this.publicRoutes = new Set(['/', '/buscar', '/profesional', '/legal', '/ayuda', '/404']);
    this.protectedRoutes = new Map();
    this.roleRoutes = new Map();
  }

  // Initialize router with auth integration
  init() {
    this.defineRoutes();
    
    // Handle browser navigation
    window.addEventListener('popstate', (event) => {
      this.handleRoute(window.location.pathname);
    });
    
    // Handle initial route
    this.handleRoute(window.location.pathname);
    
    // Intercept navigation links
    this.interceptLinks();
    
    // Listen to auth state changes
    authService.addAuthListener((user, profile) => {
      this.handleAuthStateChange(user, profile);
    });
  }

  // Define all application routes with guards
  defineRoutes() {
    // Public routes (no authentication required)
    this.addPublicRoute('/', 'Landing');
    this.addPublicRoute('/buscar', 'Search');
    this.addPublicRoute('/profesional/:id', 'ProfessionalProfile');
    this.addPublicRoute('/legal/terminos', 'Terms');
    this.addPublicRoute('/legal/privacidad', 'Privacy');
    this.addPublicRoute('/ayuda', 'Help');
    this.addPublicRoute('/404', 'NotFound');

    // Auth routes (redirect to dashboard if authenticated)
    this.addAuthRoute('/login', 'Login');
    this.addAuthRoute('/registro', 'Register');
    this.addAuthRoute('/auth', 'Auth');

    // Protected routes (require authentication)
    this.addProtectedRoute('/dashboard', 'Dashboard');
    this.addProtectedRoute('/perfil', 'Profile');
    this.addProtectedRoute('/reservas', 'CustomerBookings');
    this.addProtectedRoute('/reserva/nueva', 'NewBooking');
    this.addProtectedRoute('/reserva/:id', 'BookingDetail');
    this.addProtectedRoute('/mensajes', 'Messages');
    this.addProtectedRoute('/configuracion', 'Settings');

    // Professional routes (require professional role)
    this.addRoleRoute('/professional/dashboard', 'ProfessionalDashboard', ['professional']);
    this.addRoleRoute('/professional/servicios', 'ProfessionalServices', ['professional']);
    this.addRoleRoute('/professional/calendario', 'ProfessionalCalendar', ['professional']);
    this.addRoleRoute('/professional/reservas', 'ProfessionalBookings', ['professional']);
    this.addRoleRoute('/professional/perfil', 'ProfessionalProfile', ['professional']);
    this.addRoleRoute('/professional/estadisticas', 'ProfessionalStats', ['professional']);

    // Admin routes (require admin role)
    this.addRoleRoute('/admin', 'AdminDashboard', ['admin']);
    this.addRoleRoute('/admin/usuarios', 'AdminUsers', ['admin']);
    this.addRoleRoute('/admin/profesionales', 'AdminProfessionals', ['admin']);
    this.addRoleRoute('/admin/reservas', 'AdminBookings', ['admin']);
    this.addRoleRoute('/admin/moderacion', 'AdminModeration', ['admin']);
    this.addRoleRoute('/admin/configuracion', 'AdminSettings', ['admin']);
  }

  // Add public route
  addPublicRoute(path, componentName) {
    this.addRoute(path, componentName, { type: 'public' });
  }

  // Add auth route (redirect if authenticated)
  addAuthRoute(path, componentName) {
    this.addRoute(path, componentName, { type: 'auth' });
  }

  // Add protected route (require authentication)
  addProtectedRoute(path, componentName) {
    this.addRoute(path, componentName, { type: 'protected' });
  }

  // Add role-based route
  addRoleRoute(path, componentName, allowedRoles) {
    this.addRoute(path, componentName, { 
      type: 'role',
      allowedRoles: allowedRoles || []
    });
  }

  // Generic route addition
  addRoute(path, componentName, options = {}) {
    const paramPattern = path.replace(/:([^/]+)/g, '([^/]+)');
    const regex = new RegExp(`^${paramPattern}$`);
    
    this.routes.set(path, {
      pattern: regex,
      componentName,
      path,
      options
    });
  }

  // Handle route navigation with guards
  async handleRoute(path) {
    const route = this.findRoute(path);
    
    if (!route) {
      this.navigate('/404', true);
      return;
    }

    // Extract parameters
    const params = this.extractParams(route, path);

    // Check route guards
    const guardResult = await this.checkRouteGuards(route, path);
    
    if (guardResult.redirect) {
      this.navigate(guardResult.redirect, true);
      return;
    }

    if (!guardResult.allowed) {
      this.navigate('/login', true);
      return;
    }

    // Update current route
    this.currentRoute = path;

    // Load and render component
    try {
      await this.loadComponent(route.componentName, params, route.options);
    } catch (error) {
      console.error(`Error loading route ${path}:`, error);
      this.showErrorPage();
    }
  }

  // Check route access guards
  async checkRouteGuards(route, path) {
    const { type, allowedRoles } = route.options;
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();

    switch (type) {
      case 'public':
        return { allowed: true };

      case 'auth':
        // Redirect authenticated users to dashboard
        if (isAuthenticated) {
          const redirectRoute = this.getRedirectRouteForUser(user.profile);
          return { allowed: false, redirect: redirectRoute };
        }
        return { allowed: true };

      case 'protected':
        return { allowed: isAuthenticated };

      case 'role':
        if (!isAuthenticated) {
          return { allowed: false };
        }
        
        if (!user.profile || !allowedRoles.includes(user.profile.userType)) {
          const redirectRoute = this.getRedirectRouteForUser(user.profile);
          return { allowed: false, redirect: redirectRoute };
        }
        
        return { allowed: true };

      default:
        return { allowed: true };
    }
  }

  // Get appropriate redirect route based on user type
  getRedirectRouteForUser(profile) {
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

  // Handle authentication state changes
  handleAuthStateChange(user, profile) {
    const currentPath = window.location.pathname;
    
    // If on auth routes and user is authenticated, redirect
    if (user && this.isAuthRoute(currentPath)) {
      const redirectRoute = this.getRedirectRouteForUser(profile);
      this.navigate(redirectRoute, true);
      return;
    }

    // If on protected routes and user is not authenticated, redirect to login
    if (!user && this.isProtectedRoute(currentPath)) {
      this.navigate('/login', true);
      return;
    }

    // If on role-restricted routes and user doesn't have permission
    if (user && !this.hasRoutePermission(currentPath, profile)) {
      const redirectRoute = this.getRedirectRouteForUser(profile);
      this.navigate(redirectRoute, true);
      return;
    }
  }

  // Check if route is auth route
  isAuthRoute(path) {
    return this.authRoutes.has(path) || path.startsWith('/auth');
  }

  // Check if route is protected
  isProtectedRoute(path) {
    const route = this.findRoute(path);
    if (!route) return false;
    
    const { type } = route.options;
    return type === 'protected' || type === 'role';
  }

  // Check if user has permission for route
  hasRoutePermission(path, profile) {
    const route = this.findRoute(path);
    if (!route || !profile) return false;
    
    const { type, allowedRoles } = route.options;
    
    if (type === 'role') {
      return allowedRoles && allowedRoles.includes(profile.userType);
    }
    
    return true;
  }

  // Find matching route
  findRoute(path) {
    for (const [routePath, route] of this.routes) {
      if (route.pattern.test(path)) {
        return route;
      }
    }
    return null;
  }

  // Extract parameters from path
  extractParams(route, path) {
    const matches = path.match(route.pattern);
    if (!matches) return {};
    
    const paramNames = (route.path.match(/:([^/]+)/g) || [])
      .map(param => param.substring(1));
    
    const params = {};
    paramNames.forEach((name, index) => {
      params[name] = matches[index + 1];
    });
    
    return params;
  }

  // Navigate to new route
  navigate(path, replace = false) {
    if (path === this.currentRoute) return;
    
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    
    this.handleRoute(path);
  }

  // Load component
  async loadComponent(componentName, params = {}, options = {}) {
    const app = document.getElementById('app');
    
    // Show loading state
    this.showLoadingState(componentName);

    try {
      let component;

      // Special handling for auth routes
      if (options.type === 'auth' || componentName === 'Auth') {
        component = this.createAuthComponent();
      } else {
        // Load regular component
        component = await this.loadComponentModule(componentName);
      }
      
      if (component) {
        const element = typeof component.render === 'function' 
          ? component.render(params) 
          : component;
        
        // Clear loading and render component
        app.innerHTML = '';
        if (element instanceof HTMLElement) {
          app.appendChild(element);
        } else {
          app.innerHTML = element;
        }
        
        // Initialize component if it has an init method
        if (component.init && typeof component.init === 'function') {
          component.init(params);
        }
      } else {
        throw new Error(`Component ${componentName} not found`);
      }
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
      this.showErrorPage();
    }
  }

  // Create auth component
  createAuthComponent() {
    return AuthPage.create({
      onSuccess: (result) => {
        const redirectRoute = this.getRedirectRouteForUser(result.profile);
        this.navigate(redirectRoute);
      }
    });
  }

  // Load component module (placeholder for dynamic imports)
  async loadComponentModule(componentName) {
    // For now, return simple components
    return this.getSimpleComponent(componentName);
  }

  // Show loading state
  showLoadingState(componentName) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="w-8 h-8 border-4 border-brand-200 border-t-brand animate-spin rounded-full mx-auto mb-4"></div>
          <p class="text-navy-600">Cargando ${componentName}...</p>
        </div>
      </div>
    `;
  }

  // Simple component factory
  getSimpleComponent(name) {
    const components = {
      Landing: {
        render: () => this.createLandingPage()
      },
      
      Dashboard: {
        render: () => this.createDashboardPage()
      },
      
      ProfessionalDashboard: {
        render: () => this.createProfessionalDashboard()
      },
      
      AdminDashboard: {
        render: () => this.createAdminDashboard()
      },
      
      NotFound: {
        render: () => `
          <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
              <h1 class="text-6xl font-fraunces font-bold text-navy-900 mb-4">404</h1>
              <p class="text-xl text-navy-600 mb-8">Página no encontrada</p>
              <a href="/" class="btn-primary">Volver al Inicio</a>
            </div>
          </div>
        `
      }
    };
    
    return components[name] || components.NotFound;
  }

  // Create landing page
  createLandingPage() {
    return `
      <div class="min-h-screen bg-gradient-to-br from-brand-subtle to-beige">
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
              <h1 class="text-2xl font-fraunces font-bold text-brand">Kalos</h1>
              <div class="flex items-center space-x-4">
                <a href="/auth" class="text-navy-600 hover:text-brand transition-colors">Iniciar Sesión</a>
                <a href="/auth" class="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-hover transition-colors">Registrarse</a>
              </div>
            </div>
          </div>
        </header>
        
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="text-center">
            <h1 class="text-4xl font-fraunces font-bold text-navy-900 mb-6">
              Servicios de Belleza a Domicilio
            </h1>
            <p class="text-xl text-navy-600 mb-8 max-w-2xl mx-auto">
              Encuentra profesionales de belleza verificados en Bolivia
            </p>
            <a href="/auth" class="bg-brand text-white px-8 py-3 rounded-lg hover:bg-brand-hover transition-colors text-lg">
              Comenzar Ahora
            </a>
          </div>
        </main>
      </div>
    `;
  }

  // Create dashboard page
  createDashboardPage() {
    const user = authService.getCurrentUser();
    return `
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
              <h1 class="text-2xl font-fraunces font-bold text-navy-900">Dashboard</h1>
              <div class="flex items-center space-x-4">
                <span class="text-navy-600">Hola, ${user.profile?.name || 'Usuario'}</span>
                <button onclick="window.KalosApp.authService.logout()" class="text-brand hover:text-brand-hover">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="font-semibold text-lg mb-4">Mis Reservas</h3>
              <p class="text-gray-600">Gestiona tus servicios reservados</p>
              <a href="/reservas" class="text-brand hover:text-brand-hover mt-4 inline-block">Ver reservas →</a>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="font-semibold text-lg mb-4">Buscar Servicios</h3>
              <p class="text-gray-600">Encuentra profesionales cerca de ti</p>
              <a href="/buscar" class="text-brand hover:text-brand-hover mt-4 inline-block">Explorar →</a>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="font-semibold text-lg mb-4">Mi Perfil</h3>
              <p class="text-gray-600">Actualiza tu información personal</p>
              <a href="/perfil" class="text-brand hover:text-brand-hover mt-4 inline-block">Editar →</a>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  // Create professional dashboard
  createProfessionalDashboard() {
    const user = authService.getCurrentUser();
    return `
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
              <h1 class="text-2xl font-fraunces font-bold text-navy-900">Panel Profesional</h1>
              <div class="flex items-center space-x-4">
                <span class="text-navy-600">Hola, ${user.profile?.name || 'Profesional'}</span>
                <button onclick="window.KalosApp.authService.logout()" class="text-brand hover:text-brand-hover">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="font-semibold text-lg mb-4">Reservas Pendientes</h3>
              <p class="text-gray-600">Gestiona las solicitudes de clientes</p>
              <a href="/professional/reservas" class="text-brand hover:text-brand-hover mt-4 inline-block">Ver reservas →</a>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="font-semibold text-lg mb-4">Mis Servicios</h3>
              <p class="text-gray-600">Administra tu catálogo de servicios</p>
              <a href="/professional/servicios" class="text-brand hover:text-brand-hover mt-4 inline-block">Gestionar →</a>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="font-semibold text-lg mb-4">Calendario</h3>
              <p class="text-gray-600">Configura tu disponibilidad</p>
              <a href="/professional/calendario" class="text-brand hover:text-brand-hover mt-4 inline-block">Configurar →</a>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  // Create admin dashboard
  createAdminDashboard() {
    const user = authService.getCurrentUser();
    return `
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
              <h1 class="text-2xl font-fraunces font-bold text-navy-900">Panel de Administración</h1>
              <div class="flex items-center space-x-4">
                <span class="text-navy-600">Admin: ${user.profile?.name || 'Administrator'}</span>
                <button onclick="window.KalosApp.authService.logout()" class="text-brand hover:text-brand-hover">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="font-semibold text-lg mb-4">Usuarios</h3>
              <p class="text-gray-600">Gestiona usuarios del sistema</p>
              <a href="/admin/usuarios" class="text-brand hover:text-brand-hover mt-4 inline-block">Administrar →</a>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="font-semibold text-lg mb-4">Profesionales</h3>
              <p class="text-gray-600">Verifica y modera profesionales</p>
              <a href="/admin/profesionales" class="text-brand hover:text-brand-hover mt-4 inline-block">Moderar →</a>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="font-semibold text-lg mb-4">Reservas</h3>
              <p class="text-gray-600">Monitor de todas las reservas</p>
              <a href="/admin/reservas" class="text-brand hover:text-brand-hover mt-4 inline-block">Ver todas →</a>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="font-semibold text-lg mb-4">Configuración</h3>
              <p class="text-gray-600">Configuraciones del sistema</p>
              <a href="/admin/configuracion" class="text-brand hover:text-brand-hover mt-4 inline-block">Configurar →</a>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  // Intercept navigation links
  interceptLinks() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      
      if (link && this.isInternalLink(link)) {
        event.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });
  }

  // Check if link is internal
  isInternalLink(link) {
    const href = link.getAttribute('href');
    return href && 
           href.startsWith('/') && 
           !href.startsWith('//') &&
           !link.hasAttribute('target');
  }

  // Show error page
  showErrorPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-2xl font-fraunces font-bold text-navy-900 mb-4">Error</h1>
          <p class="text-navy-600 mb-8">No se pudo cargar la página</p>
          <a href="/" class="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-hover transition-colors">
            Volver al Inicio
          </a>
        </div>
      </div>
    `;
  }
}

// Export router instance
export const protectedRouter = new ProtectedRouter();
export default protectedRouter;