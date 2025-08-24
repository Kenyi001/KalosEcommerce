# Ticket #0030: Expand Test Coverage - Ampliar Cobertura de Tests

**Estado:** 📋 Planificado  
**Prioridad:** Alta  
**Estimación:** 1-2 días  
**Fase:** 7 - Testing y Despliegue  
**Asignado a:** TBD  

---

## 📋 Descripción

Ampliar significativamente la cobertura de testing del marketplace Kalos E-commerce, implementando tests end-to-end, tests de performance, tests de carga y validación completa de todas las funcionalidades críticas.

## 🎯 Objetivos

### Funcionales
- Test coverage >90% en funciones críticas
- Tests end-to-end para flujos principales
- Tests de performance y carga
- Tests de integración con Firebase
- Tests de accesibilidad y usabilidad
- Tests del panel de administración

### Técnicos
- Setup completo de testing framework
- Configuración de Firebase Emulator para tests
- Automatización de tests en CI/CD
- Reportes de cobertura automatizados
- Tests en múltiples dispositivos y navegadores

## 🔧 Tareas Técnicas

### Framework de Testing
- [ ] Configurar Vitest para unit tests
- [ ] Setup Playwright para E2E tests
- [ ] Configurar Firebase Emulator Suite para integration tests
- [ ] Setup Lighthouse CI para performance tests
- [ ] Configurar axe-core para accessibility tests

### Unit Tests
- [ ] Tests de utilidades y helpers
- [ ] Tests de componentes UI críticos
- [ ] Tests de lógica de negocio
- [ ] Tests de validaciones de formularios
- [ ] Tests de cálculos de precios y distancias

### Integration Tests
- [ ] Tests de autenticación completa
- [ ] Tests de CRUD de profesionales
- [ ] Tests de sistema de reservas
- [ ] Tests de notificaciones
- [ ] Tests de búsqueda y filtros

### End-to-End Tests
- [ ] Flujo completo de registro de cliente
- [ ] Flujo completo de registro de profesional
- [ ] Flujo completo de búsqueda y reserva
- [ ] Flujo de aprobación de profesionales (admin)
- [ ] Flujo de moderación de contenido

## 🧪 Test Scenarios Críticos

### Flujos de Usuario Principal
```javascript
// E2E Test Examples
describe('Customer Journey', () => {
  test('Complete booking flow', async () => {
    // 1. Customer registers
    await page.goto('/registro');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="register-btn"]');
    
    // 2. Search for service
    await page.goto('/buscar');
    await page.fill('[data-testid="search"]', 'corte cabello');
    await page.click('[data-testid="search-btn"]');
    
    // 3. Select professional
    await page.click('[data-testid="professional-card"]:first-child');
    
    // 4. Make booking
    await page.click('[data-testid="book-service"]');
    await page.selectOption('[data-testid="date"]', '2025-08-25');
    await page.selectOption('[data-testid="time"]', '10:00');
    await page.click('[data-testid="confirm-booking"]');
    
    // 5. Verify booking created
    await expect(page.locator('[data-testid="booking-success"]')).toBeVisible();
  });
});

describe('Professional Journey', () => {
  test('Professional registration and approval', async () => {
    // Registration flow
    await registerProfessional();
    
    // Upload documents
    await uploadDocuments();
    
    // Admin approval (separate test)
    await adminApproval();
    
    // Verify professional is active
    await verifyProfessionalActive();
  });
});
```

### Performance Tests
```javascript
describe('Performance Tests', () => {
  test('Homepage loads under 2 seconds', async () => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });
  
  test('Search results load quickly', async () => {
    await page.goto('/buscar');
    const startTime = Date.now();
    await page.fill('[data-testid="search"]', 'cabello');
    await page.waitForSelector('[data-testid="search-results"]');
    const searchTime = Date.now() - startTime;
    
    expect(searchTime).toBeLessThan(1000);
  });
});
```

### Accessibility Tests
```javascript
describe('Accessibility Tests', () => {
  test('Homepage is accessible', async () => {
    await page.goto('/');
    const results = await axe.run();
    expect(results.violations).toHaveLength(0);
  });
  
  test('Forms have proper labels', async () => {
    await page.goto('/registro');
    const emailInput = page.locator('[data-testid="email"]');
    const label = await emailInput.getAttribute('aria-label');
    expect(label).toBeTruthy();
  });
});
```

## 📊 Métricas de Testing

### Coverage Targets
- **Unit Tests**: >95% para utils y business logic
- **Integration Tests**: >85% para APIs críticas  
- **E2E Tests**: 100% de user journeys principales
- **Performance**: <2s load time en 3G
- **Accessibility**: WCAG 2.1 AA compliance

### Test Categories
```javascript
const testMetrics = {
  unit: {
    target: 200,
    critical: ['auth', 'booking', 'search', 'payment'],
    current: 0
  },
  
  integration: {
    target: 50,
    critical: ['firebase-auth', 'firestore-crud', 'storage'],
    current: 0
  },
  
  e2e: {
    target: 15,
    critical: ['customer-flow', 'professional-flow', 'admin-flow'],
    current: 0
  },
  
  performance: {
    target: 10,
    critical: ['lighthouse-scores', 'core-web-vitals'],
    current: 0
  }
};
```

## 🧪 Criterios de Aceptación

### Code Coverage
- [ ] >90% line coverage en funciones críticas
- [ ] >85% branch coverage en lógica de negocio
- [ ] >80% function coverage en componentes
- [ ] 100% coverage en utilidades críticas
- [ ] Reportes de coverage automáticos en CI

### E2E Coverage
- [ ] Todos los user journeys principales cubiertos
- [ ] Tests en Chrome, Firefox y Safari
- [ ] Tests en desktop y mobile viewports
- [ ] Tests con y sin JavaScript habilitado
- [ ] Tests de error scenarios y edge cases

### Performance Standards
- [ ] Lighthouse Performance >90
- [ ] First Contentful Paint <1.5s
- [ ] Largest Contentful Paint <2.5s
- [ ] Cumulative Layout Shift <0.1
- [ ] Time to Interactive <3s

### Accessibility Compliance
- [ ] WCAG 2.1 AA compliance verificado
- [ ] Navegación por teclado funcional
- [ ] Screen reader compatibility
- [ ] Color contrast ratios apropiados
- [ ] Focus indicators visibles

## 📝 Notas de Implementación

### Test Environment Setup
```javascript
// vitest.config.js
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        global: {
          lines: 90,
          functions: 85,
          branches: 85,
          statements: 90
        }
      }
    }
  }
});

// playwright.config.js
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } }
  ]
});
```

### Firebase Emulator Setup
```javascript
// test/firebase-setup.js
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';

const setupFirebaseEmulators = () => {
  const app = initializeApp(testConfig);
  
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
  
  if (!db.emulatorConfig) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
  
  if (!storage.emulatorConfig) {
    connectStorageEmulator(storage, 'localhost', 9199);
  }
};
```

### Test Data Management
```javascript
// test/fixtures.js
export const testData = {
  users: {
    customer: {
      email: 'customer@test.com',
      password: 'test123',
      profile: { name: 'Test Customer', phone: '+59170000000' }
    },
    
    professional: {
      email: 'pro@test.com', 
      password: 'test123',
      profile: { 
        businessName: 'Test Salon',
        categories: ['hair'],
        location: { city: 'La Paz', zone: 'Zona Sur' }
      }
    },
    
    admin: {
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      permissions: ['super_admin']
    }
  },
  
  services: {
    haircut: {
      name: 'Corte femenino',
      category: 'hair',
      price: 80,
      duration: 60,
      description: 'Corte de cabello profesional'
    }
  }
};
```

## 🔗 Dependencias

### Técnicas
- ✅ Vite configurado con testing
- ⚠️ Firebase Emulator Suite setup
- ⚠️ Playwright instalado y configurado
- ⚠️ Coverage tools configurados

### Funcionales
- ✅ Todas las funcionalidades principales implementadas
- ✅ Panel de administración funcional
- ⚠️ Test data y fixtures preparados
- ⚠️ CI/CD pipeline básico

## 🚀 Criterios de Deploy

- [ ] Todos los tests pasan en múltiples navegadores
- [ ] Coverage mínimo alcanzado (90%+)
- [ ] Performance benchmarks cumplidos
- [ ] Accessibility audit sin violations críticas
- [ ] Tests integrados en CI/CD pipeline

---

**Tags:** `testing` `e2e` `performance` `accessibility` `quality`  
**Relacionado:** #0031, #0032
