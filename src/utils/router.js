/**
 * Simple SPA Router for Kalos E-commerce
 * Handles client-side routing with History API
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.middlewares = [];
    this.currentRoute = null;
    this.setupEventListeners();
  }

  /**
   * Add a route to the router
   */
  addRoute(path, handler, options = {}) {
    const route = {
      path: this.normalizePath(path),
      handler,
      requiresAuth: options.requiresAuth || false,
      allowedRoles: options.allowedRoles || [],
      title: options.title || 'Kalos E-commerce',
      meta: options.meta || {}
    };
    
    this.routes.set(route.path, route);
    return this;
  }

  /**
   * Add middleware
   */
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Navigate to a path
   */
  navigate(path, replace = false) {
    const normalizedPath = this.normalizePath(path);
    
    if (replace) {
      history.replaceState({}, '', normalizedPath);
    } else {
      history.pushState({}, '', normalizedPath);
    }
    
    this.handleRoute(normalizedPath);
  }

  /**
   * Get current path
   */
  getCurrentPath() {
    return this.normalizePath(window.location.pathname);
  }

  /**
   * Handle route change
   */
  async handleRoute(path = null) {
    const targetPath = path || this.getCurrentPath();
    const route = this.findRoute(targetPath);

    if (!route) {
      this.handle404();
      return;
    }

    // Run middlewares
    for (const middleware of this.middlewares) {
      const result = await middleware(route, targetPath);
      if (result === false) {
        return; // Middleware blocked navigation
      }
    }

    // Update document title
    document.title = route.title;

    // Store current route
    this.currentRoute = route;

    // Execute route handler
    try {
      await route.handler(targetPath, route);
    } catch (error) {
      console.error('Route handler error:', error);
      this.handleError(error);
    }
  }

  /**
   * Find matching route
   */
  findRoute(path) {
    // Exact match first
    if (this.routes.has(path)) {
      return this.routes.get(path);
    }

    // Pattern matching for dynamic routes (basic implementation)
    for (const [routePath, route] of this.routes) {
      if (this.matchRoute(routePath, path)) {
        return route;
      }
    }

    return null;
  }

  /**
   * Basic route matching with parameters
   */
  matchRoute(routePath, currentPath) {
    const routeParts = routePath.split('/');
    const pathParts = currentPath.split('/');

    if (routeParts.length !== pathParts.length) {
      return false;
    }

    return routeParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index];
    });
  }

  /**
   * Handle 404 errors
   */
  handle404() {
    const notFoundRoute = this.routes.get('/404') || {
      handler: () => {
        document.getElementById('app').innerHTML = `
          <div class="min-h-screen flex items-center justify-center bg-gray-50">
            <div class="text-center">
              <h1 class="text-6xl font-bold text-gray-900">404</h1>
              <p class="mt-2 text-lg text-gray-600">Página no encontrada</p>
              <button onclick="window.router.navigate('/')" 
                      class="mt-4 px-4 py-2 bg-brand text-white rounded">
                Volver al inicio
              </button>
            </div>
          </div>
        `;
      },
      title: '404 - Página no encontrada'
    };

    document.title = notFoundRoute.title;
    notFoundRoute.handler();
  }

  /**
   * Handle general errors
   */
  handleError(error) {
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <h1 class="text-xl font-bold text-red-600">Error</h1>
          <p class="mt-2 text-gray-600">Ha ocurrido un error inesperado</p>
          <button onclick="window.router.navigate('/')" 
                  class="mt-4 px-4 py-2 bg-brand text-white rounded">
            Volver al inicio
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Normalize path
   */
  normalizePath(path) {
    if (!path || path === '') return '/';
    if (!path.startsWith('/')) path = '/' + path;
    if (path.endsWith('/') && path.length > 1) path = path.slice(0, -1);
    return path;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });

    // Handle link clicks
    document.addEventListener('click', (event) => {
      if (event.target.matches('[data-router-link]')) {
        event.preventDefault();
        const href = event.target.getAttribute('href') || event.target.dataset.href;
        if (href) {
          this.navigate(href);
        }
      }
    });
  }

  /**
   * Start the router
   */
  start() {
    this.handleRoute();
  }
}

// Authentication middleware
export const authMiddleware = (route, path) => {
  if (route.requiresAuth) {
    // TODO: Check if user is authenticated
    const isAuthenticated = false; // Replace with actual auth check
    
    if (!isAuthenticated) {
      window.router.navigate('/auth/login');
      return false;
    }

    // TODO: Check user roles
    if (route.allowedRoles.length > 0) {
      const userRole = 'customer'; // Replace with actual user role
      if (!route.allowedRoles.includes(userRole)) {
        window.router.navigate('/403');
        return false;
      }
    }
  }
  return true;
};

// Create global router instance
window.router = new Router();

export default Router;