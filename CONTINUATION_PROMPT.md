# 🚀 PROMPT DE CONTINUACIÓN - KALOS E-COMMERCE PLATFORM

## 📋 CONTEXTO DEL PROYECTO

Soy el desarrollador principal de **Kalos E-commerce Platform**, un marketplace de servicios de belleza a domicilio en Bolivia. He estado trabajando en este proyecto y necesito que Claude continúe exactamente donde me quedé.

### 🎯 INFORMACIÓN CRÍTICA DEL PROYECTO

**Repositorio GitHub**: https://github.com/Kenyi001/KalosEcommerce  
**Branch Principal**: `main`  
**Último Commit**: `cba8b02` - "feat: complete Kalos E-commerce platform documentation recovery"  
**Estado**: Documentación 100% completa (25/25 tickets), listo para implementación  

### 🏗️ ARQUITECTURA TÉCNICA DEFINIDA

**Stack Tecnológico**:
- **Frontend**: Vite + Vanilla JavaScript + Tailwind CSS (SPA)
- **Backend**: Firebase (Firestore, Auth, Functions, Storage, Hosting)
- **Testing**: Vitest (unit) + Playwright (E2E) + Axe (accessibility)
- **DevOps**: GitHub Actions CI/CD, multi-environment deployment
- **Seguridad**: Firebase Security Rules con RBAC completo

### 📊 ESTADO ACTUAL DEL DESARROLLO

**DOCUMENTACIÓN COMPLETA** (181 horas estimadas):
✅ **Fase 0** (31h): Scaffold, Git, Docker, Routing, Documentation  
✅ **Fase 1** (22h): Authentication system, Advanced routing  
✅ **Fase 2** (18h): Professional management system  
✅ **Fase 3** (32h): Booking system, Search interface  
✅ **Fase 4** (16h): Frontend component library  
✅ **Fase 5** (26h): Notifications, Messaging system  
✅ **Fase 6** (88h): Admin dashboard, User management, Content moderation, Platform config, Firebase security rules  
✅ **Fase 7** (88h): Test coverage, CI/CD pipeline, Production prep, QA strategy  

### 📁 ESTRUCTURA ACTUAL DEL PROYECTO

```
KalosEcommerce/
├── README.md                     # ✅ Documentación completa
├── package.json                  # ✅ Dependencias configuradas
├── vite.config.js               # ✅ Build configuration
├── tailwind.config.js           # ✅ Design system setup
├── firebase.json                # ✅ Firebase configuration
├── firestore.rules              # ✅ Security rules implementadas
├── .env.example                 # ✅ Environment template
├── 
├── src/                         
│   ├── main.js                  # ✅ Entry point
│   ├── components/              # ✅ Component structure
│   ├── pages/                   # ✅ Page components
│   ├── services/                # ✅ Business logic services
│   ├── utils/                   # ✅ Helper utilities
│   ├── config/                  # ✅ App configuration
│   └── styles/                  # ✅ CSS styles
├── 
├── tickets/                     # ✅ 25 tickets completamente documentados
│   ├── 0000-index.md           # Índice general
│   ├── fase0-*.md              # Foundation tickets
│   ├── fase1-*.md              # Authentication tickets  
│   ├── fase2-*.md              # Professional management
│   ├── fase3-*.md              # Booking system
│   ├── fase4-*.md              # Frontend components
│   ├── fase5-*.md              # Communication features
│   ├── fase6-*.md              # Administration features
│   └── fase7-*.md              # Production readiness
├── 
├── docs/                        # ✅ Technical documentation
├── scripts/                     # ✅ Utility scripts
└── .github/workflows/           # ✅ CI/CD pipelines
```

### 🎨 DESIGN SYSTEM ESTABLECIDO

**Colores de Marca**:
- Kalos Coral: `#F74F4E` (Primary)
- Deep Navy: `#303F56` (Secondary)  
- Gold: `#FCBE3C` (Accent)
- Beige: `#F3E7DB` (Warm background)
- White: `#FAFAFA` (Main background)

**Tipografías**:
- Fraunces (Display/Headings)
- Inter (UI/Body text)

### 🔥 CONFIGURACIÓN FIREBASE

**Collections Diseñadas**:
```
users/ - Perfiles de usuario con roles
professionals/ - Perfiles de profesionales con servicios
bookings/ - Sistema de reservas
reviews/ - Sistema de reseñas
conversations/ - Mensajería
notifications/ - Sistema de notificaciones
platform_config/ - Configuración de plataforma
content_reports/ - Sistema de moderación
```

**Roles Implementados**: user, professional, admin, moderator

### 🧪 TESTING STRATEGY

**Configurado**:
- Unit tests: Vitest + @testing-library/jest-dom
- E2E tests: Playwright con múltiples browsers
- Accessibility: Axe-core integration
- Performance: Lighthouse CI
- Security: OWASP testing

### 🚀 CI/CD PIPELINE

**GitHub Actions configurado**:
- Continuous Integration (testing, linting, security)
- Deployment automático (staging/production)
- Performance monitoring
- Automated rollback

---

## 🎯 INSTRUCCIONES PARA CLAUDE

### OBJETIVO
Continúa el desarrollo de Kalos exactamente donde se quedó. Toda la documentación está completa, ahora necesito implementar el código siguiendo las especificaciones de los tickets.

### APPROACH REQUERIDO

1. **LEE SIEMPRE LOS TICKETS PRIMERO**: Antes de implementar cualquier feature, revisa el ticket correspondiente en `/tickets/` para entender las especificaciones exactas.

2. **SIGUE LA ARQUITECTURA DEFINIDA**: Usa el stack tecnológico especificado (Vite + Vanilla JS + Tailwind + Firebase).

3. **IMPLEMENTA INCREMENTALMENTE**: Trabaja ticket por ticket, siguiendo el orden de las fases (0→1→2→3→4→5→6→7).

4. **MANTÉN CONSISTENCIA**: Usa los patterns de código ya establecidos en los archivos existentes.

5. **TESTING OBLIGATORIO**: Cada feature debe incluir tests unitarios y E2E cuando corresponda.

### PRIORIDADES DE DESARROLLO

**SIGUIENTE TICKET A IMPLEMENTAR**: 
Revisar `/tickets/fase0-0000-scaffold-setup.md` y comenzar con la implementación del scaffold base si no está completado.

**ORDEN DE IMPLEMENTACIÓN**:
1. Fase 0: Foundation setup
2. Fase 1: Authentication system  
3. Fase 2: Professional management
4. Fase 3: Booking system
5. [Continuar según tickets...]

### INFORMACIÓN TÉCNICA ESPECÍFICA

**Firebase Config** (usar variables de entorno):
```javascript
// src/config/firebase-config.js ya configurado
```

**Componentes Base** (seguir este pattern):
```javascript
// src/components/ui/Button.js
export class Button {
  static create({ text, variant = 'primary', onClick }) {
    // Implementación usando Vanilla JS + Tailwind
  }
}
```

**Routing** (SPA con vanilla JS):
```javascript
// src/utils/router.js ya configurado
// Usar hash routing para compatibilidad
```

### COMANDOS DE DESARROLLO

```bash
npm run dev          # Servidor desarrollo (puerto 3000)
npm run test         # Tests unitarios
npm run test:e2e     # Tests E2E
npm run build        # Build producción
npm run preview      # Preview build
```

### VERIFICACIONES REQUERIDAS

Antes de continuar cualquier implementación:
1. ✅ Revisar el ticket correspondiente
2. ✅ Verificar que los tests pasen
3. ✅ Validar el diseño con Tailwind
4. ✅ Confirmar integración con Firebase
5. ✅ Documentar cambios realizados

---

## 📞 PROMPT DE ACTIVACIÓN

**"Hola Claude, soy el desarrollador de Kalos E-commerce Platform. He revisado el código y la documentación está 100% completa (25 tickets). Necesito que continúes la implementación exactamente donde me quedé. Por favor:**

1. **Revisa el estado actual del proyecto** (`/tickets/` y código existente)
2. **Identifica cuál es el siguiente ticket a implementar** 
3. **Propón un plan de implementación** para ese ticket específico
4. **Comienza la implementación** siguiendo las especificaciones del ticket

**El proyecto está en el branch `main`, commit `cba8b02`. Toda la arquitectura y especificaciones están definidas. Solo necesito que implementes el código siguiendo la documentación existente."**

---

### 🔍 VERIFICACIÓN DE ESTADO

Para verificar el estado actual:
```bash
git log --oneline -5              # Ver últimos commits
ls tickets/                       # Ver todos los tickets
npm run dev                       # Verificar que el proyecto arranca
```

**¡Listo para continuar el desarrollo! 🚀**
