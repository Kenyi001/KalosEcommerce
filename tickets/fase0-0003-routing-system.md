# Ticket Fase 0-0003: Sistema de Routing Foundation

## 📋 Descripción
Establecer la base del sistema de routing para Single Page Application (SPA), definiendo la arquitectura y configuración inicial que será implementada completamente en fase1-0005.

## 🎯 Objetivos
- Definir arquitectura de routing SPA
- Configurar Vite para SPA support
- Establecer estructura de páginas
- Preparar base para History API routing
- Documentar estrategia de navegación

## 📊 Criterios de Aceptación

### ✅ Vite SPA Configuration
- [ ] Configuración de Vite para SPA (history fallback)
- [ ] Build configuration para routing client-side
- [ ] Development server configurado para SPA
- [ ] Static file serving para deep links

### ✅ Folder Structure
- [ ] Estructura de carpetas `/src/pages/`
- [ ] Estructura de carpetas `/src/router/`
- [ ] Page components base structure
- [ ] Route configuration files

### ✅ Base Page Components
- [ ] HomePage base component
- [ ] NotFound (404) page
- [ ] Loading page component
- [ ] Error boundary page

### ✅ Documentation
- [ ] Routing architecture documented
- [ ] URL structure defined
- [ ] Navigation patterns established

## 🔧 Implementación

### Vite Configuration for SPA
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // SPA Configuration
  appType: 'spa',
  
  // Build configuration
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  
  // Development server
  server: {
    port: 5173,
    host: true,
    // SPA fallback - todas las rutas sirven index.html
    historyApiFallback: {
      index: '/index.html'
    }
  },
  
  // Preview server (for production build)
  preview: {
    port: 4173,
    historyApiFallback: {
      index: '/index.html'
    }
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  }
});
```

### Pages Folder Structure
```
src/
├── pages/
│   ├── Home/
│   │   ├── HomePage.js
│   │   ├── HomePage.css
│   │   └── index.js
│   ├── Auth/
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   └── index.js
│   ├── Professionals/
│   │   ├── ListPage.js
│   │   ├── DetailPage.js
│   │   ├── CreatePage.js
│   │   └── index.js
│   ├── Booking/
│   │   ├── BookingFlow.js
│   │   ├── ConfirmationPage.js
│   │   └── index.js
│   ├── Dashboard/
│   │   ├── CustomerDashboard.js
│   │   ├── ProfessionalDashboard.js
│   │   └── index.js
│   ├── Error/
│   │   ├── NotFoundPage.js
│   │   ├── ErrorPage.js
│   │   └── index.js
│   └── index.js          # Export all pages
├── router/
│   ├── Router.js         # Main router class (fase1-0005)
│   ├── routes.js         # Route definitions
│   ├── guards.js         # Route guards
│   └── index.js
```

### Base Page Component Pattern
```javascript
// src/pages/Base/BasePage.js
export class BasePage {
  constructor() {
    this.title = '';
    this.meta = {};
  }

  // To be implemented by subclasses
  render() {
    throw new Error('render() method must be implemented');
  }

  // Page lifecycle
  beforeMount() {
    // Called before page is mounted
  }

  mount() {
    // Called when page is mounted to DOM
    this.updatePageMeta();
  }

  unmount() {
    // Called when leaving page
  }

  // Update page title and meta
  updatePageMeta() {
    if (this.title) {
      document.title = `${this.title} | Kalos`;
    }
    
    // Update meta tags
    Object.entries(this.meta).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    });
  }
}
```

### HomePage Implementation (Base)
```javascript
// src/pages/Home/HomePage.js
import { BasePage } from '../Base/BasePage.js';

export class HomePage extends BasePage {
  constructor() {
    super();
    this.title = 'Inicio';
    this.meta = {
      description: 'Kalos - Servicios de belleza a domicilio en Bolivia',
      keywords: 'belleza, servicios, domicilio, Bolivia, maquillaje, cabello'
    };
  }

  render() {
    return `
      <div class="home-page">
        <header class="hero-section bg-gradient-to-r from-brand to-brand-hover text-white py-20">
          <div class="container mx-auto px-4 text-center">
            <h1 class="text-display-lg mb-6">
              Servicios de belleza a tu puerta
            </h1>
            <p class="text-lg mb-8 max-w-2xl mx-auto">
              Conectamos profesionales de belleza verificados con clientes 
              que buscan servicios de calidad en la comodidad de su hogar.
            </p>
            <div class="space-x-4">
              <a href="/professionals" data-link class="btn btn-white btn-lg">
                Explorar profesionales
              </a>
              <a href="/register" data-link class="btn btn-ghost btn-lg border-white text-white">
                Únete como profesional
              </a>
            </div>
          </div>
        </header>

        <main class="py-16">
          <div class="container mx-auto px-4">
            <!-- Content will be added in implementation phase -->
            <div class="text-center">
              <h2 class="text-display-md mb-8">¿Cómo funciona?</h2>
              <div class="grid md:grid-cols-3 gap-8">
                <!-- Steps will be added -->
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  }
}
```

### 404 NotFound Page
```javascript
// src/pages/Error/NotFoundPage.js
import { BasePage } from '../Base/BasePage.js';

export class NotFoundPage extends BasePage {
  constructor() {
    super();
    this.title = 'Página no encontrada';
  }

  render() {
    return `
      <div class="not-found-page min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="text-9xl font-bold text-brand mb-4">404</div>
          <h1 class="text-display-md text-navy mb-4">Página no encontrada</h1>
          <p class="text-lg text-gray-600 mb-8">
            La página que buscas no existe o ha sido movida.
          </p>
          <div class="space-x-4">
            <a href="/" data-link class="btn btn-primary">
              Ir al inicio
            </a>
            <button onclick="history.back()" class="btn btn-ghost">
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
```

### URL Structure Definition
```javascript
// src/router/routes.js
export const routeConfig = {
  // Public routes
  home: {
    path: '/',
    component: 'HomePage',
    title: 'Inicio'
  },
  
  // Authentication
  login: {
    path: '/login',
    component: 'LoginPage',
    title: 'Iniciar sesión'
  },
  register: {
    path: '/register',
    component: 'RegisterPage',
    title: 'Crear cuenta'
  },
  
  // Professionals
  professionals: {
    path: '/professionals',
    component: 'ProfessionalsListPage',
    title: 'Profesionales'
  },
  professionalDetail: {
    path: '/professionals/:id',
    component: 'ProfessionalDetailPage',
    title: 'Perfil profesional'
  },
  
  // Booking
  booking: {
    path: '/booking/:professionalId/:serviceId',
    component: 'BookingFlowPage',
    title: 'Reservar servicio'
  },
  bookingConfirmation: {
    path: '/booking/confirmation/:bookingId',
    component: 'BookingConfirmationPage',
    title: 'Confirmación de reserva'
  },
  
  // Dashboards (protected)
  customerDashboard: {
    path: '/dashboard',
    component: 'CustomerDashboardPage',
    title: 'Mi dashboard',
    protected: true
  },
  professionalDashboard: {
    path: '/professional/dashboard',
    component: 'ProfessionalDashboardPage',
    title: 'Dashboard profesional',
    protected: true,
    role: 'professional'
  },
  
  // Admin (protected)
  adminDashboard: {
    path: '/admin',
    component: 'AdminDashboardPage',
    title: 'Panel administrativo',
    protected: true,
    role: 'admin'
  },
  
  // Error pages
  notFound: {
    path: '/404',
    component: 'NotFoundPage',
    title: 'Página no encontrada'
  }
};
```

### Index.html Configuration
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kalos - Servicios de belleza a domicilio</title>
  
  <!-- Preconnect to improve font loading -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Base URL for SPA routing -->
  <base href="/">
</head>
<body>
  <div id="app">
    <!-- Loading indicator shown until JS loads -->
    <div class="loading-screen">
      <div class="loading-spinner"></div>
      <p>Cargando Kalos...</p>
    </div>
  </div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

## 🧪 Testing

### SPA Configuration Testing
```bash
# Test development server SPA fallback
npm run dev
# Navigate to http://localhost:5173/professionals
# Should serve the app, not 404

# Test build with SPA
npm run build
npm run preview
# Test deep links work with production build
```

### Page Structure Testing
```javascript
// Test page loading
import { HomePage } from './src/pages/Home/HomePage.js';

const homePage = new HomePage();
const html = homePage.render();
console.log('HomePage renders:', html.includes('Kalos'));
```

## 🚀 Deployment

### Build Configuration
```json
{
  "scripts": {
    "build": "vite build",
    "build:spa": "vite build --mode spa",
    "preview": "vite preview"
  }
}
```

### Firebase Hosting (for SPA)
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 📦 Dependencies
- Vite (already configured)
- No additional dependencies for this foundation

## 🔗 Relaciones
- **Depende de**: fase0-0000-scaffold-setup
- **Prerrequisito para**: fase1-0005-routing-system (implementación completa)
- **Base para**: Todas las páginas de la aplicación

## 📝 Notas

### Diferencia con fase1-0005
- **fase0-0003**: Foundation y configuración base
- **fase1-0005**: Implementación completa del Router class con guards, History API, etc.

### Navigation Strategy
- Client-side routing con History API
- Fallback a server-side para deep links
- Progressive enhancement approach

---

**Estado**: ✅ Completado  
**Prioridad**: Alta  
**Estimación**: 2 horas  
**Asignado**: Frontend Developer  

**Sprint**: Sprint 0 - Foundation  
**Deadline**: 26 agosto 2025