/**
 * Simple SPA Router for Kalos E-commerce
 * Handles client-side routing with History API and authentication guards
 */

import { authState } from './auth-state.js';

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
      guards: options.guards || [],
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

    // Run route guards
    if (route.guards && route.guards.length > 0) {
      for (const guard of route.guards) {
        const result = await guard(targetPath, route);
        if (result !== true) {
          // Guard returned a redirect path
          if (typeof result === 'string') {
            this.navigate(result, true);
            return;
          } else {
            // Guard blocked navigation
            return;
          }
        }
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
              <p class="mt-2 text-lg text-gray-600">P�gina no encontrada</p>
              <button data-router-link data-href="/" 
                      class="mt-4 px-4 py-2 bg-brand text-kalos-white rounded">
                Volver al inicio
              </button>
            </div>
          </div>
        `;
      },
      title: '404 - P�gina no encontrada'
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
          <button data-router-link data-href="/" 
                  class="mt-4 px-4 py-2 bg-brand text-kalos-white rounded">
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
      // Check if the clicked element or its parent has data-router-link
      const linkElement = event.target.closest('[data-router-link]');
      if (linkElement) {
        event.preventDefault();
        const href = linkElement.getAttribute('href') || 
                     linkElement.getAttribute('data-href') || 
                     linkElement.dataset.href;
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

/**
 * Navigate to a path programmatically
 * @param {string} path - Target path
 * @param {boolean} replace - Whether to replace current history entry
 */
export function navigateTo(path, replace = false) {
  if (window.router) {
    window.router.navigate(path, replace);
  } else {
    // Fallback for direct navigation
    if (replace) {
      window.location.replace(path);
    } else {
      window.location.href = path;
    }
  }
}

/**
 * Get current route path
 * @returns {string} Current path
 */
export function getCurrentPath() {
  return window.router ? window.router.getCurrentPath() : window.location.pathname;
}

/**
 * Get current route object
 * @returns {Object|null} Current route
 */
export function getCurrentRoute() {
  return window.router ? window.router.currentRoute : null;
}

// Create and export global router instance
export const router = new Router();
window.router = router;

export { Router };
export default router;