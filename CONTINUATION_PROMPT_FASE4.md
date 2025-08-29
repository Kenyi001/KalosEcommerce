# 🚀 PROMPT PARA CONTINUAR DESARROLLO - FASE 4

## 📍 ESTADO ACTUAL DEL PROYECTO

**Proyecto**: Kalos E-commerce - Marketplace de servicios de belleza a domicilio en Bolivia  
**Tecnologías**: Vite + Vanilla JavaScript + Tailwind CSS + Firebase  
**Fecha**: 29 agosto 2025  
**Última fase completada**: Fase 3 (Sistema de reservas y búsqueda)  
**Fase actual**: Fase 4 - Frontend y UX  
**Último ticket trabajado**: fase4-0009-frontend-components.md  

## 🎯 CONTEXT PARA CLAUDE

Estoy desarrollando **Kalos**, un marketplace de belleza para Bolivia donde:
- **Clientes** buscan y reservan servicios de belleza a domicilio
- **Profesionales** ofrecen sus servicios y gestionan reservas
- **Plataforma** conecta ambos con sistema de búsqueda, reservas y pagos

### ✅ FASES COMPLETADAS (0-3):
1. **Fase 0**: Setup completo (Vite + Firebase + Routing + Docker)
2. **Fase 1**: Sistema de autenticación con roles (cliente/profesional/admin)
3. **Fase 2**: Gestión completa de profesionales y servicios
4. **Fase 3**: Sistema de reservas y búsqueda con mapas

### 🔄 FASE 4 ACTUAL - Frontend y UX:
**Estado**: En desarrollo  
**Ticket actual**: fase4-0009-frontend-components.md (Sistema de componentes)  
**Tickets creados para Fase 4**:
- ✅ fase4-0009-frontend-components.md (Componentes base - EN DESARROLLO)
- 📋 fase4-0010-landing-page-improved.md (Landing page mejorada)
- 📋 fase4-0011-professional-profile.md (Perfil público profesional)
- 📋 fase4-0012-professional-edit-dashboard.md (Dashboard edición profesional)
- 📋 fase4-0013-professional-calendar.md (Calendar y gestión reservas)

## 📁 ESTRUCTURA ACTUAL DEL PROYECTO

```
d:\Projects\AIxDev\
├── src/
│   ├── main.js
│   ├── components/           # ← TRABAJANDO AQUÍ
│   │   ├── atoms/           # Componentes básicos (Button, Input, etc.)
│   │   ├── molecules/       # Componentes medios (FormField, Card, etc.)
│   │   ├── organisms/       # Componentes complejos
│   │   └── templates/       # Layouts y plantillas
│   ├── pages/
│   ├── services/
│   ├── router/
│   ├── styles/
│   └── utils/
├── tickets/                 # Documentación de desarrollo
├── docs/
└── [archivos de config]
```

## 🎯 PRÓXIMOS PASOS ESPECÍFICOS

### TICKET ACTUAL: fase4-0009-frontend-components.md
**Necesito continuar desarrollando el sistema de componentes UI:**

1. **Completar Atomic Components**:
   - ✅ Button (base implementado)
   - 🔄 Input Fields (text, email, password, number, textarea)
   - 🔄 Select y Dropdown components
   - 🔄 Icon system con iconos SVG
   - 🔄 Typography components
   - 🔄 Loading spinners y progress bars

2. **Implementar Molecular Components**:
   - 🔄 FormField (validación en tiempo real)
   - 🔄 Card components (ServiceCard, ProfessionalCard, ReviewCard)
   - 🔄 Navigation (NavBar, Breadcrumbs, Pagination)
   - 🔄 Modal y Dialog system
   - 🔄 Toast notifications
   - 🔄 Search bar con filtros

3. **Crear Organism Components**:
   - 🔄 Professional listing con filtros
   - 🔄 Booking calendar widget
   - 🔄 Review system con ratings
   - 🔄 Professional dashboard layout

## 🔍 CONTEXTO TÉCNICO IMPORTANTE

### Design System definido:
```css
:root {
  --color-brand: #F74F4E;      /* Coral principal */
  --color-navy: #303F56;       /* Azul oscuro */
  --color-gold: #FCBE3C;       /* Dorado */
  --color-beige: #F3E7DB;      /* Beige claro */
  --font-family-display: 'Fraunces', Georgia, serif;
  --font-family-sans: 'Inter', system-ui, sans-serif;
}
```

### Patrón de componentes establecido:
```javascript
// Base class para todos los componentes
export class BaseComponent {
  constructor(element = null, props = {}) {
    this.element = element;
    this.props = props;
    this.state = {};
  }
  
  render() { /* Template method */ }
  mount(container) { /* Mount to DOM */ }
  bindEvents() { /* Event handling */ }
  destroy() { /* Cleanup */ }
}
```

### Servicios existentes disponibles:
- `authService` - Autenticación con Firebase
- `professionalService` - CRUD profesionales
- `bookingService` - Sistema de reservas
- `searchService` - Búsqueda con filtros
- `uploadService` - Subida de archivos

## 📋 INSTRUCCIONES ESPECÍFICAS

**Por favor ayúdame a:**

1. **CONTINUAR con el desarrollo del ticket fase4-0009-frontend-components.md**
   - Implementar los Input Fields con validación
   - Crear el sistema de Icons con SVG
   - Desarrollar los Card components (ServiceCard, ProfessionalCard)
   - Implementar el Modal system con focus trap

2. **SEGUIR el patrón establecido**:
   - Usar la BaseComponent class como base
   - Aplicar Design System tokens
   - Implementar responsive mobile-first
   - Incluir accesibilidad (ARIA, keyboard navigation)

3. **PRIORIZAR estos componentes** (orden de necesidad):
   - FormField molecular component (para formularios)
   - ServiceCard (para mostrar servicios)
   - Modal system (para dialogs)
   - Navigation components (para header/sidebar)

4. **MANTENER consistencia** con:
   - Estructura de carpetas establecida
   - Naming conventions (kebab-case para CSS, PascalCase para JS)
   - Testing pattern definido
   - Documentación de componentes

## 💡 CONTEXTO DE NEGOCIO

**Kalos** es un marketplace B2C donde:
- Los **clientes** buscan servicios como: maquillaje, peinado, manicure, masajes, etc.
- Los **profesionales** crean perfiles, publican servicios con precios y gestionan reservas
- La **plataforma** maneja la intermediación, pagos y calificaciones

**Target**: Mujeres urbanas de Bolivia (La Paz, Cochabamba, Santa Cruz) que valoran comodidad y calidad.

## 🚨 IMPORTANTE

- **NO reinventes**: Usa los servicios y estructura existentes
- **SÍ documenta**: Cada componente necesita ejemplos de uso
- **SÍ optimiza**: Performance y accesibilidad son prioridad
- **SÍ mantén**: El patrón de BaseComponent establecido
- **NO uses librerías externas**: Todo vanilla JS con clases nativas

## 📄 ARCHIVOS CLAVE PARA CONSULTAR

1. `tickets/fase4-0009-frontend-components.md` - Especificaciones completas
2. `src/components/` - Estructura actual de componentes
3. `src/styles/design-system.css` - Tokens de diseño
4. `docs/DESIGN_GUIDE.md` - Guía de diseño completa
5. `tickets/0000-index.md` - Estado general del proyecto

---

**OBJETIVO INMEDIATO**: Completar el sistema de componentes base (atoms y molecules) para poder avanzar a los tickets de páginas específicas (landing, perfiles profesionales, calendar).

**TIEMPO ESTIMADO**: 16-20 horas de desarrollo restantes en Fase 4

**SIGUIENTE FASE**: Fase 5 - Sistema de notificaciones y mensajería
