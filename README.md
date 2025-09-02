# � Kalos E-commerce: Marketplace de Belleza a Domicilio
🏠 Servicios → � Reserva → � Agenda → ✨ Belleza en Casa

## 📋 Tabla de Contenidos
- [🎯 ¿Qué es Kalos?](#-qué-es-kalos)
- [✨ Características Principales](#-características-principales)
- [🏗️ Arquitectura Técnica](#️-arquitectura-técnica)
- [🗂️ Estructura del Proyecto](#️-estructura-del-proyecto)
- [⚙️ Configuración de Desarrollo](#️-configuración-de-desarrollo)
- [📚 Guía de Desarrollo](#-guía-de-desarrollo)
  - [Fase 0: Setup y Configuración](#fase-0-setup-y-configuración)
  - [Fase 1: Sistema de Autenticación](#fase-1-sistema-de-autenticación)
  - [Fase 2: Gestión de Profesionales](#fase-2-gestión-de-profesionales)
  - [Fase 3: Sistema de Reservas](#fase-3-sistema-de-reservas)
  - [Fase 4: Frontend y UX](#fase-4-frontend-y-ux)
  - [Fase 5: Colaboración y Notificaciones](#fase-5-colaboración-y-notificaciones)
  - [Fase 6: Testing y Despliegue](#fase-6-testing-y-despliegue)
- [💡 Mejores Prácticas](#-mejores-prácticas)
- [❓ Preguntas Frecuentes](#-preguntas-frecuentes)
- [🔧 Troubleshooting](#-troubleshooting)

---

## 🎯 ¿Qué es Kalos?

**Kalos E-commerce** es un marketplace simple, seguro y accesible que conecta clientes con profesionales de servicios de belleza a domicilio en Bolivia.

### 🎭 Roles del Sistema:
- **👩‍🦱 Cliente**: Buscar, filtrar, ver profesionales, reservar servicios y gestionar reservas
- **💄 Profesional**: Registrarse, publicar servicios, administrar perfil, galería y calendario
- **🔧 Admin**: Gestión y moderación de la plataforma

### 🎯 Objetivos del MVP:
- ✅ Autenticación con Email/Password + Google Sign-In (Firebase Auth)
- ✅ Sistema de roles diferenciados (Cliente/Profesional/Admin)
- ✅ CRUD completo para servicios profesionales + galería
- ✅ Buscador con filtros avanzados
- ✅ Sistema de reservas sin pasarela de pagos (coordinación directa)
- ✅ Deploy en Firebase Hosting + Firestore + Storage

---

## ✨ Características Principales

### 🏠 Para Clientes
- � **Búsqueda Avanzada**: Filtrar por categoría, ubicación, precio, disponibilidad
- 📱 **Mobile-First**: Experiencia optimizada para dispositivos móviles
- 👤 **Perfiles Detallados**: Ver portfolios, reseñas y información completa
- 📅 **Reserva Intuitiva**: Sistema simple de solicitud de citas
- 🔔 **Notificaciones**: Actualizaciones sobre estado de reservas

### 💄 Para Profesionales
- 🎨 **Gestión de Portafolio**: Galería de trabajos con categorización
- 📋 **Catálogo de Servicios**: CRUD completo con precios y descripciones
- 📅 **Calendario Inteligente**: Gestión de disponibilidad y bloqueos
- 💰 **Gestión de Reservas**: Aceptar/rechazar solicitudes con notas
- � **Dashboard**: Vista general de estadísticas y actividad

### 🔧 Para Administradores
- 👥 **Gestión de Usuarios**: Moderación y validación de profesionales
- 📈 **Analytics**: Métricas de uso y rendimiento
- 🛡️ **Seguridad**: Control de acceso y monitoreo

---

## 🏗️ Arquitectura Técnica

### 🎨 Frontend
- **Framework**: HTML5 + ES Modules + Vite + Tailwind CSS
- **Lenguaje**: Vanilla JavaScript (migración futura a React/Vue)
- **Design System**: Tokens personalizados + Componentes reutilizables
- **Tipografías**: Fraunces (títulos) + Inter (UI)

### ⚡ Backend
- **Plataforma**: Firebase (Plan Spark recomendado)
- **Auth**: Firebase Auth (Email/Password + Google)
- **Base de Datos**: Firestore (Native mode)
- **Storage**: Firebase Storage (imágenes y assets)
- **Hosting**: Firebase Hosting + Preview Channels

### 🛠️ Herramientas de Desarrollo
- **Emulator**: Firebase Emulator Suite (Auth + Firestore + Storage)
- **Build**: Vite + PostCSS + Autoprefixer
- **CI/CD**: GitHub Actions
- **Testing**: Emulator + Lighthouse + Manual E2E

---

## 🗂️ Estructura del Proyecto

```
kalos-ecommerce/
├── 📁 ejemplo/                  # Configuración Docker y ejemplos
│   ├── docker-compose.yml      # Stack de desarrollo
│   ├── backend/                # Backend Django (opcional)
│   └── frontend/               # Frontend React/Vue (opcional)
├── 📁 docs/                    # Documentación del proyecto
│   ├── plan.md                # Plan de desarrollo por fases
│   ├── ticket-template.md     # Plantilla para tickets
│   └── specs/                 # Especificaciones técnicas
│       ├── 01-auth-system.md  # Sistema de autenticación
│       ├── 02-project-management.md # Gestión de profesionales
│       ├── 03-task-management.md    # Sistema de reservas
│       ├── 04-collaboration.md      # Colaboración y roles
│       └── 05-notifications.md      # Sistema de notificaciones
├── 📁 tickets/                 # Gestión de tareas
│   ├── 0000-index.md          # Índice general de tickets
│   ├── fase0-XXXX-*.md        # Setup inicial
│   ├── fase1-XXXX-*.md        # Autenticación
│   ├── fase2-XXXX-*.md        # Gestión de profesionales
│   ├── fase3-XXXX-*.md        # Sistema de reservas
│   ├── fase4-XXXX-*.md        # Frontend y UX
│   ├── fase5-XXXX-*.md        # Colaboración
│   └── fase6-XXXX-*.md        # Testing y deploy
├── 📁 prompts/                 # Guías para desarrollo con IA
│   ├── instructions.md        # Instrucciones principales
│   ├── guidelines.md          # Guidelines de código
│   └── ticket-template.md     # Template de tickets
└── README.md                  # Esta guía
```

### 📁 Estructura del Código Fuente (cuando se implemente)

```
src/
├── components/                 # Componentes reutilizables
│   ├── ui/                    # Componentes básicos (Button, Input, etc.)
│   ├── auth/                  # Componentes de autenticación
│   ├── professional/          # Componentes de profesionales
│   └── booking/               # Componentes de reservas
├── pages/                     # Páginas principales
│   ├── landing/               # Página de inicio
│   ├── auth/                  # Login/Register
│   ├── search/                # Búsqueda de profesionales
│   ├── professional/          # Perfil y dashboard pro
│   └── booking/               # Sistema de reservas
├── config/                    # Configuración
│   └── firebase-config.js     # Configuración Firebase
├── utils/                     # Utilidades
│   ├── auth.js               # Helpers de autenticación
│   ├── firestore.js          # Helpers de Firestore
│   └── validation.js         # Validaciones
└── css/                       # Estilos
    └── tailwind.css          # Estilos principales
```

---

## ⚙️ Configuración de Desarrollo

### 📋 Requisitos Previos
- **Node.js** 18+ y npm
- **Firebase CLI**: `npm install -g firebase-tools`
- **Git** para control de versiones
- **Cuenta Firebase** (Plan Spark gratuito)

### 🚀 Setup Inicial

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd kalos-ecommerce
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   ```bash
   firebase login
   firebase init
   ```

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con las credenciales de Firebase
   ```

5. **Iniciar emuladores de desarrollo**
   ```bash
   npm run emulators
   ```

6. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

### 🎨 Configuración de Design System

> ⚠️ **IMPORTANTE**: Configurar los tokens de diseño antes de comenzar el desarrollo

#### Tokens de Diseño - Kalos Brand
- **🎨 Primary**: Kalos Coral `#F74F4E`
- **🏢 Secondary**: Deep Navy `#303F56`  
- **✨ Accent**: Gold `#FCBE3C`
- **📱 Neutral**: Gray scale para UI
- **🖼️ Backgrounds**: White `#FAFAFA`, Beige `#F3E7DB`

#### Tipografía
- **📝 Display**: Fraunces (títulos y nombres)
- **🔤 UI**: Inter (interfaz y texto general)

### 🔧 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build", 
    "preview": "vite preview",
    "emulators": "firebase emulators:start --only auth,firestore,storage",
    "deploy": "npm run build && firebase deploy",
    "deploy:preview": "firebase hosting:channel:deploy preview"
  }
}
```

---

## 📚 Guía de Desarrollo

### Fase 0: Setup y Configuración

> 🎯 **Objetivo**: Preparar el entorno de desarrollo y estructura base

#### ✅ Tareas Incluidas:
- **0001**: Inicializar repositorio Git con estructura
- **0002**: Configurar Docker para desarrollo (opcional)
- **0003**: Setup Django backend (si se requiere híbrido)
- **0004**: Setup React/Vue frontend (si se migra desde vanilla)
- **0005**: Configurar linters y herramientas de calidad

### Fase 1: Sistema de Autenticación

> 🔐 **Objetivo**: Implementar autenticación completa con roles

#### ✅ Funcionalidades:
- **0006**: Extender modelo de usuario con roles
- **0007**: Configurar Djoser + JWT (si backend Django)
- **0008**: Implementar endpoints de autenticación
- **0009**: Tests de autenticación

#### 🎭 Roles del Sistema:
- **Cliente**: Buscar y reservar servicios
- **Profesional**: Ofrecer y gestionar servicios
- **Admin**: Moderar y gestionar plataforma

### Fase 2: Gestión de Profesionales  

> 👩‍� **Objetivo**: CRUD completo para profesionales y servicios

#### ✅ Funcionalidades:
- **0010**: Modelos de profesionales y servicios
- **0011**: Serializers para APIs
- **0012**: Views y endpoints para profesionales
- **0013**: Tests de gestión de profesionales

#### 💼 Características:
- Perfil profesional con galería
- Catálogo de servicios con precios
- Gestión de disponibilidad
- Portfolio con antes/después

### Fase 3: Sistema de Reservas

> 📅 **Objetivo**: Sistema completo de reservas sin pagos

#### ✅ Funcionalidades:
- **0014**: Modelo de reservas (bookings)
- **0015**: Views para gestión de reservas
- **0016**: Tests del sistema de reservas

#### 🔄 Flujo de Reservas:
1. Cliente solicita reserva → `pending`
2. Profesional acepta/rechaza → `accepted`/`rejected`
3. Confirmación final → `confirmed`
4. Servicio completado → `done`

### Fase 4: Frontend y UX

> 🎨 **Objetivo**: Interfaz mobile-first con design system

#### ✅ Funcionalidades:
- **0017**: Setup de routing y state management
- **0018**: Vistas de autenticación
- **0019**: Vistas de profesionales y reservas

#### 📱 Páginas Principales:
- Landing con búsqueda
- Perfiles públicos de profesionales
- Dashboard de cliente/profesional
- Sistema de reservas

### Fase 5: Colaboración y Notificaciones

> � **Objetivo**: Sistema de comunicación y notificaciones

#### ✅ Funcionalidades:
- **0020**: Backend de colaboración
- **0021**: Sistema de notificaciones backend
- **0022**: Frontend de colaboración

#### 💬 Características:
- Notificaciones de estado de reservas
- Sistema de mensajería básico
- Alertas por email/push

### Fase 6: Testing y Despliegue

> 🚀 **Objetivo**: Preparar para producción

#### ✅ Funcionalidades:
- **0023**: Ampliar cobertura de tests
- **0024**: CI/CD pipeline
- **0025**: Preparación para producción

#### 🔧 Características:
- Tests E2E completos
- Pipeline de deploy automático
- Monitoreo y analytics

---

## 💡 Mejores Prácticas

### � Para Design System
- **🎯 Consistencia**: Usar siempre los tokens definidos en `tailwind.config.js`
- **📱 Mobile-First**: Diseñar primero para móvil, luego expandir
- **♿ Accesibilidad**: Contraste AA, áreas táctiles ≥44px
- **⚡ Performance**: Lazy loading, WEBP, CSS purgado

### 🏗️ Para Arquitectura
- **🔥 Firebase Rules**: Testear siempre en emulador antes de deploy
- **🔐 Seguridad**: Validar en cliente Y servidor
- **📊 Performance**: Índices optimizados en Firestore
- **💾 Storage**: Organizar assets por usuario/tipo

### � Para Testing
- **🔬 Unit Tests**: Funciones puras y validaciones
- **🧰 Integration**: Flujos completos con emulador
- **👥 E2E**: Casos de usuario principales
- **📱 Device Testing**: Probar en dispositivos reales

### 🚀 Para Deploy
- **🌲 Branching**: Feature branches + PR reviews
- **🔄 CI/CD**: Build automático + tests
- **📊 Monitoring**: Firebase Analytics + Error tracking
- **🔄 Rollback**: Mantener versiones de respaldo

---

## ❓ Preguntas Frecuentes

**P: ¿Por qué Firestore y no una base de datos tradicional?**
R: Firestore ofrece realtime updates, escalabilidad automática, y reglas de seguridad integradas, perfectas para un marketplace en tiempo real.

**P: ¿Por qué vanilla JS y no React/Vue desde el inicio?**
R: Permite un MVP más rápido y ligero. La migración a un framework está planificada para fases posteriores.

**P: ¿Cómo manejan los pagos si no hay pasarela?**
R: El MVP coordina servicios sin pagos. Los profesionales y clientes acuerdan pagos directamente. Pasarelas se añadirán en v2.

**P: ¿Qué pasa con las imágenes y el almacenamiento?**
R: Firebase Storage con organización por profesional: `/public/professionals/{uid}/services/` y `/portfolio/`.

**P: ¿Cómo garantizan la calidad de los profesionales?**
R: Sistema de reviews, validación de documentos en dashboard admin, y proceso de aprobación manual.

---

## 🔧 Troubleshooting

### 🔥 Problemas de Firebase

**Problema**: Emulators no inician
```bash
# Solución: Verificar puertos y reinstalar
firebase emulators:kill
npm install -g firebase-tools
firebase emulators:start --only auth,firestore,storage
```

**Problema**: Reglas de Firestore fallan
```bash
# Solución: Verificar sintaxis y probar en emulador
firebase emulators:start --only firestore
# Abrir http://localhost:4000 para testing
```

### 🎨 Problemas de Desarrollo

**Problema**: Tailwind no aplica estilos
```bash
# Solución: Verificar configuración y rebuild
npm run build:css
npm run dev
```

**Problema**: Cambios no se reflejan
```bash
# Solución: Limpiar cache
rm -rf node_modules/.vite
npm run dev
```

### 📱 Problemas de UX

**Problema**: Imágenes muy pesadas
- **Solución**: Implementar compresión automática y formatos modernos (WEBP)

**Problema**: App lenta en móvil
- **Solución**: Aplicar lazy loading, code splitting, y optimización de imágenes

---

## � ¡Empezar es Fácil!

1. **📥 Clona el repositorio** y configura tu entorno
2. **🔥 Configura Firebase** con emuladores para desarrollo seguro
3. **🎨 Revisa el Design System** y tokens en la documentación
4. **📋 Sigue los tickets** comenzando por Fase 0
5. **🧪 Testea continuamente** con emuladores y dispositivos reales
6. **🚀 Deploy frecuentemente** usando preview channels

> 💡 **Recuerda**: Kalos está diseñado para ser mobile-first, accesible, y enfocado en la experiencia del usuario. Cada decisión debe mejorar la conexión entre profesionales y clientes.

---

**¿Listo para revolucionar el mundo de la belleza a domicilio? ¡Empecemos! �✨**

