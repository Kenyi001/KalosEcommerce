# Kalos E-commerce - Servicios de Belleza a Domicilio

**Marketplace de servicios de belleza a domicilio desarrollado con Vite + Tailwind + Firebase**

## 🚀 Características Principales

### Para Clientes
- Explorar profesionales por categorías de servicios
- Ver perfiles detallados con portafolios
- Reservar servicios a domicilio
- Calificar y reseñar profesionales
- Gestionar reservas y historial

### Para Profesionales
- Crear y personalizar perfil profesional
- Gestionar servicios y precios
- Calendario de disponibilidad
- Portafolio de trabajos
- Dashboard con estadísticas

## 🛠️ Stack Tecnológico

### Frontend
- **Vite**: Build tool y dev server ultra-rápido
- **Tailwind CSS**: Framework CSS utility-first
- **Vanilla JavaScript (ES6+)**: Lógica moderna sin frameworks
- **PostCSS**: Procesamiento de CSS

### Backend (Firebase)
- **Firebase Authentication**: Gestión de usuarios y autenticación
- **Firestore**: Base de datos NoSQL en tiempo real
- **Cloud Storage**: Almacenamiento de imágenes y archivos
- **Firebase Hosting**: Hosting de la aplicación web
- **Firebase Emulator Suite**: Desarrollo y testing local

### Herramientas de Desarrollo
- **ESLint**: Linting de código JavaScript
- **Prettier**: Formateo automático de código
- **Vite Bundle Analyzer**: Análisis de bundles
- **Vitest**: Testing unitario
- **Playwright**: Testing end-to-end

## 📁 Estructura del Proyecto

```
kalos-ecommerce/
├── index.html                    # Página principal
├── package.json                  # Configuración del proyecto
├── vite.config.js               # Configuración de Vite
├── tailwind.config.js           # Configuración de Tailwind
├── postcss.config.cjs           # Configuración de PostCSS
├── firebase.json                # Configuración de Firebase
├── .env.example                 # Template de variables de entorno
├── 
├── src/                         # Código fuente
│   ├── main.js                  # Entry point de la aplicación
│   ├── styles/                  # Archivos de estilos
│   │   └── tailwind.css        # CSS principal con Tailwind
│   ├── components/              # Componentes reutilizables
│   │   ├── ui/                 # Componentes de UI básicos
│   │   │   ├── Button.js       # Componente de botón
│   │   │   ├── Card.js         # Componente de tarjeta
│   │   │   └── Input.js        # Componente de input
│   │   └── layout/             # Componentes de layout
│   │       ├── Header.js       # Header/navegación
│   │       └── Footer.js       # Footer
│   ├── pages/                  # Páginas de la aplicación
│   │   └── auth/               # Páginas de autenticación
│   │       └── AuthPage.js     # Página de login/registro
│   ├── services/               # Servicios y lógica de negocio
│   │   ├── auth.js            # Servicio de autenticación
│   │   └── bookings.js        # Servicio de reservas
│   ├── utils/                  # Utilidades
│   │   ├── router.js          # Router SPA
│   │   ├── helpers.js         # Funciones auxiliares
│   │   └── ProtectedRouter.js # Router con protección de rutas
│   └── config/                 # Configuraciones
│       └── firebase-config.js  # Configuración de Firebase
├── 
├── public/                      # Archivos estáticos
│   └── favicon.svg             # Favicon del sitio
├── 
├── docs/                        # Documentación
│   └── specs/                  # Especificaciones técnicas
├── 
└── tickets/                     # Sistema de tickets/tareas
    └── 0000-index.md           # Índice de tickets
```

## 🎨 Design System

### Colores de Marca
- **Kalos Coral**: `#F74F4E` - Color primario de la marca
- **Deep Navy**: `#303F56` - Color secundario para textos y acentos  
- **Gold**: `#FCBE3C` - Color de acento para highlights
- **Beige**: `#F3E7DB` - Fondo cálido
- **White**: `#FAFAFA` - Fondo principal

### Tipografías
- **Fraunces**: Para títulos y headings (serif display)
- **Inter**: Para UI y texto del cuerpo (sans-serif)

### Componentes
- Sistema de design tokens en `tailwind.config.js`
- Componentes reutilizables con variantes
- Patterns mobile-first y responsive

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ (recomendado 18+)
- npm o yarn
- Cuenta de Firebase
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Kenyi001/KalosEcommerce.git
   cd KalosEcommerce
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus credenciales de Firebase
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

5. **Opcional: Iniciar emuladores de Firebase**
   ```bash
   npm run emulators:start
   ```
   Los emuladores estarán disponibles en `http://localhost:4000`

## 🔥 Configuración de Firebase

### 1. Crear Proyecto Firebase
- Ir a [Firebase Console](https://console.firebase.google.com/)
- Crear nuevo proyecto
- Habilitar Firebase Authentication, Firestore y Storage

### 2. Variables de Entorno
Configurar en `.env.local`:
```bash
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_ENABLE_EMULATORS=true
```

### 3. Estructura de Firestore
```
users/
  {userId}/
    - displayName: string
    - email: string
    - phone: string
    - role: "customer" | "professional" | "admin"
    - createdAt: timestamp

professionals/
  {userId}/
    profile/
      - displayName: string
      - bio: string
      - location: object
      - published: boolean
    services/
      {serviceId}/
        - title: string
        - price: number
        - duration: number
        - active: boolean

bookings/
  {bookingId}/
    - customerId: string
    - professionalId: string
    - serviceId: string
    - datetime: timestamp
    - status: "pending" | "confirmed" | "completed"
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build para producción
npm run preview          # Preview del build

# Testing
npm test                 # Tests unitarios
npm run test:e2e         # Tests end-to-end
npm run test:coverage    # Coverage de tests

# Linting y formato
npm run lint             # Linter ESLint
npm run lint:fix         # Arreglar problemas de lint
npm run format           # Formatear código con Prettier

# Firebase
npm run emulators:start  # Iniciar emuladores
npm run deploy           # Deploy a Firebase Hosting
```

## 🔒 Seguridad y Mejores Prácticas

- Variables de entorno para configuración sensible
- Reglas de seguridad en Firestore y Storage
- Validación client-side y server-side
- Sanitización de inputs de usuario
- Manejo seguro de imágenes y uploads

## 📱 Roadmap de Funcionalidades

### Sprint 0 - Scaffold Base ✅
- [x] Configuración Vite + Tailwind
- [x] Sistema de componentes base
- [x] Integración Firebase
- [x] Estructura de proyecto

### Sprint 1 - Autenticación 🔄
- [ ] Sistema de login/registro
- [ ] Gestión de roles (cliente/profesional)
- [ ] Protección de rutas
- [ ] Perfil de usuario

### Sprint 2 - Profesionales 📋
- [ ] Dashboard profesional
- [ ] CRUD de servicios
- [ ] Gestión de portfolio
- [ ] Configuración de perfil

### Sprint 3 - Reservas 📋
- [ ] Sistema de booking
- [ ] Calendario de disponibilidad
- [ ] Gestión de reservas
- [ ] Notificaciones

### Sprint 4+ - Mejoras 📋
- [ ] Sistema de reseñas
- [ ] Búsqueda avanzada
- [ ] Pagos integrados
- [ ] App móvil (PWA)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollo**: Kalos Team
- **Diseño**: Kalos Design
- **Producto**: Kalos Product

---

**¿Listo para construir el futuro de los servicios de belleza en Bolivia? ¡Empecemos! 💄✨**