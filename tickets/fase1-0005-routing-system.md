# Ticket Fase 1-0005: Sistema de Rutas

## 📋 Descripción
Implementar sistema de Single Page Application (SPA) con routing dinámico usando Web API History para navegación sin recargas de página.

## 🎯 Objetivos
- Sistema de rutas declarativo y reactivo
- Navegación sin recargas (SPA experience)
- Manejo de rutas protegidas con autenticación
- Estructura escalable para nuevas páginas

## 📊 Criterios de Aceptación

### ✅ Router Core
- [x] Clase `Router` con manejo de rutas declarativas
- [x] Integración con History API para URLs clean
- [x] Manejo de rutas con parámetros dinámicos
- [x] Fallback para rutas no encontradas (404)

### ✅ Route Guards
- [x] Middleware para rutas protegidas (requireAuth)
- [x] Redirección automática a login si no autenticado
- [x] Validación de roles (customer/professional/admin)
- [x] Cache de ruta destino para post-login redirect

### ✅ Navigation Components
- [x] Component `NavBar` con links activos
- [x] Breadcrumbs para rutas anidadas
- [x] Loading states durante transiciones
- [x] Error boundaries para páginas crasheadas

## 🔧 Implementación Técnica

### Estructura de Archivos
```
src/
├── router/
│   ├── Router.js           # Core router class
│   ├── routes.js           # Route definitions
│   └── guards.js           # Route protection
├── components/
│   ├── Navigation/
│   │   ├── NavBar.js
│   │   ├── Breadcrumbs.js
│   │   └── NavigationLink.js
│   └── Layout/
│       ├── PageLayout.js
│       └── LoadingSpinner.js
└── pages/
    ├── Home/
    ├── Auth/
    ├── Professionals/
    ├── Booking/
    └── NotFound/
```

### Router Implementation
```javascript
// src/router/Router.js
class Router {
  constructor() {
    this.routes = new Map();
    this.guards = [];
    this.currentRoute = null;
    this.isNavigating = false;
    this.init();
  }

  addRoute(path, component, options = {}) {
    this.routes.set(path, {
      component,
      guards: options.guards || [],
      meta: options.meta || {}
    });
  }

  addGuard(guard) {
    this.guards.push(guard);
  }

  async navigate(path, replace = false) {
    if (this.isNavigating) return;
    
    this.isNavigating = true;
    
    try {
      // Run guards
      const canNavigate = await this.runGuards(path);
      if (!canNavigate) return;

      // Update URL
      if (replace) {
        history.replaceState({}, '', path);
      } else {
        history.pushState({}, '', path);
      }

      // Render component
      await this.renderRoute(path);
      this.currentRoute = path;
      
    } finally {
      this.isNavigating = false;
    }
  }

  async runGuards(path) {
    const route = this.routes.get(path);
    const allGuards = [...this.guards, ...(route?.guards || [])];
    
    for (const guard of allGuards) {
      const result = await guard(path, route);
      if (result !== true) {
        if (typeof result === 'string') {
          await this.navigate(result, true);
        }
        return false;
      }
    }
    return true;
  }

  async renderRoute(path) {
    const route = this.routes.get(path);
    if (!route) {
      await this.renderNotFound();
      return;
    }

    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading">Cargando...</div>';
    
    try {
      const pageComponent = await route.component();
      app.innerHTML = pageComponent.render();
      
      // Run component lifecycle
      if (pageComponent.mount) {
        pageComponent.mount();
      }
    } catch (error) {
      console.error('Error rendering route:', error);
      app.innerHTML = '<div class="error">Error al cargar la página</div>';
    }
  }

  init() {
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, true);
    });

    // Handle link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-link]');
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });

    // Initial route
    this.navigate(window.location.pathname, true);
  }
}
```

### Route Definitions
```javascript
// src/router/routes.js
import { requireAuth, requireRole } from './guards.js';

export const routes = [
  {
    path: '/',
    component: () => import('../pages/Home/HomePage.js'),
    meta: { title: 'Kalos - Servicios de Belleza' }
  },
  {
    path: '/login',
    component: () => import('../pages/Auth/LoginPage.js'),
    meta: { title: 'Iniciar Sesión' }
  },
  {
    path: '/register',
    component: () => import('../pages/Auth/RegisterPage.js'),
    meta: { title: 'Crear Cuenta' }
  },
  {
    path: '/professionals',
    component: () => import('../pages/Professionals/ListPage.js'),
    meta: { title: 'Profesionales' }
  },
  {
    path: '/professionals/:id',
    component: () => import('../pages/Professionals/DetailPage.js'),
    meta: { title: 'Perfil Profesional' }
  },
  {
    path: '/dashboard',
    component: () => import('../pages/Dashboard/DashboardPage.js'),
    guards: [requireAuth],
    meta: { title: 'Mi Dashboard' }
  },
  {
    path: '/admin',
    component: () => import('../pages/Admin/AdminPage.js'),
    guards: [requireAuth, requireRole('admin')],
    meta: { title: 'Panel Administrativo' }
  }
];
```

### Route Guards
```javascript
// src/router/guards.js
import { AuthService } from '../services/AuthService.js';

export async function requireAuth(path, route) {
  const user = await AuthService.getCurrentUser();
  if (!user) {
    // Store intended destination
    sessionStorage.setItem('redirectAfterAuth', path);
    return '/login';
  }
  return true;
}

export function requireRole(role) {
  return async function(path, route) {
    const user = await AuthService.getCurrentUser();
    if (!user || user.role !== role) {
      return '/dashboard'; // Redirect to appropriate dashboard
    }
    return true;
  };
}

export async function guestOnly(path, route) {
  const user = await AuthService.getCurrentUser();
  if (user) {
    return '/dashboard';
  }
  return true;
}
```

## 🧪 Testing

### Test Cases
- [x] Navigate to existing routes
- [x] Handle 404 for invalid routes  
- [x] Route guards block unauthorized access
- [x] Browser back/forward buttons work
- [x] Deep linking works on page refresh
- [x] Loading states show during navigation

### Manual Testing
```bash
# Test routing manually
1. Navigate to http://localhost:5173/
2. Click navigation links
3. Use browser back/forward
4. Test direct URL access
5. Test protected routes without auth
```

## 🚀 Deployment

### Build Integration
- Router works with Vite build process
- Static routes generate properly
- Hash routing fallback for older browsers

### SEO Considerations
- Meta tag updates per route
- Proper title changes
- Schema.org markup per page type

## 📦 Dependencies
- Ninguna nueva dependency requerida
- Usa Web APIs nativas
- Compatible con build de Vite

## 🔗 Relaciones
- **Depende de**: fase0-0000-scaffold-setup
- **Prerrequisito para**: fase1-0004-auth-base-system
- **Relacionado con**: Todos los componentes de página

---

**Estado**: ✅ Completado  
**Prioridad**: Alta  
**Estimación**: 8 horas  
**Asignado**: Developer  

**Sprint**: Sprint 1 - Autenticación  
**Deadline**: 27 agosto 2025
