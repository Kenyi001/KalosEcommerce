# Ticket #0000: Setup de Scaffold y Estructura Base

**Estado:** 📋 Planificado  
**Prioridad:** Alta  
**Estimación:** 4-6 horas  
**Fase:** 0 - Setup y Configuración  
**Asignado a:** DevOps/Frontend Team  

---

## 📋 Descripción

Crear el scaffold completo del proyecto Kalos desde cero usando Vite + Tailwind + Firebase, implementando la estructura base de componentes, configuraciones y herramientas de desarrollo según las especificaciones del Project Chapter.

## 🎯 Objetivos

### Funcionales
- Estructura de proyecto consistente y escalable
- Design System implementado con tokens
- Configuración de desarrollo optimizada
- Firebase Emulator Suite integrado
- Librería base de componentes UI

### Técnicos
- Vite + Tailwind CSS configurado
- Firebase Emulator Suite setup
- Scripts de desarrollo y build
- Estructura modular de componentes
- Configuration files optimizados

## 🔧 Tareas Técnicas

### Scaffold Base (2h)
- [x] Crear proyecto base con Vite (vanilla template)
- [x] Configurar Tailwind CSS + PostCSS + Autoprefixer
- [x] Setup Firebase tools y emuladores
- [x] Estructura de directorios `/src/{components,pages,config,utils}`
- [x] Package.json con scripts optimizados

### Design System Implementation (1-2h)
- [ ] Mapear tokens en `tailwind.config.js`
- [ ] Crear CSS base con utilidades custom
- [ ] Implementar paleta de colores Kalos
- [ ] Configurar tipografías (Fraunces + Inter)
- [ ] Variables de spacing y componentes

### Component Library Base (1-2h)
- [ ] Button component (variantes, estados)
- [ ] Input/Form components
- [ ] Card component
- [ ] Header/Footer layouts
- [ ] Modal/Overlay components
- [ ] Avatar component

### Firebase Configuration (1h)
- [x] Firebase config con variables de entorno
- [x] Emulator Suite configuration
- [ ] Rules básicas (firestore.rules, storage.rules)
- [ ] Seeds de desarrollo
- [ ] Documentation del setup

## 📁 Estructura de Scaffold Propuesta

```
kalos-ecommerce/
├── index.html                  # Entry point
├── package.json               # Scripts y dependencias
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Design tokens mapeados
├── postcss.config.cjs        # PostCSS + Tailwind
├── firebase.json             # Firebase emulator config
├── firestore.rules           # Reglas de seguridad base
├── .env.example              # Template variables
├── .gitignore                # Git excludes
│
├── src/
│   ├── components/           # Librería de componentes
│   │   ├── ui/              # Componentes UI base
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   ├── Modal.js
│   │   │   └── Avatar.js
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── Navigation.js
│   │   └── README.md        # Component documentation
│   │
│   ├── pages/               # Page components
│   │   ├── Landing.js
│   │   ├── Auth.js
│   │   └── Dashboard.js
│   │
│   ├── config/              # Configuration
│   │   ├── firebase-config.js
│   │   └── constants.js
│   │
│   ├── utils/               # Utilities
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── api.js
│   │
│   └── styles/              # Additional styles
│       └── components.css
│
└── docs/                    # Documentation
    ├── DESIGN_GUIDE.md      # Design system guide
    ├── COMPONENTS.md        # Component library docs
    └── FIREBASE_SPEC.md     # Firebase setup guide
```

## 🎨 Design System Configuration

### Tokens en `tailwind.config.js`
```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F74F4E",      // Kalos Coral
          hover: "#E94445",
          pressed: "#D13C3B",
          subtle: "#FDEBEC"
        },
        navy: {
          DEFAULT: "#303F56",      // Deep Navy
          hover: "#2A394E",
          pressed: "#233141",
          subtle: "#E8EDF3"
        },
        gold: "#FCBE3C",
        beige: "#F3E7DB",
        "kalos-white": "#FAFAFA",
        "kalos-black": "#261B15"
      },
      fontFamily: {
        'display': ['Fraunces', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

## 🧪 Criterios de Aceptación

### Setup Infrastructure
- [x] Vite dev server running en localhost:5173
- [x] Tailwind CSS funcionando con hot reload
- [x] Firebase Emulator Suite ejecutándose
- [x] Build process genera dist/ optimizado
- [x] Scripts npm funcionan correctamente

### Design System
- [ ] Tokens de colores implementados
- [ ] Tipografías Fraunces/Inter cargando
- [ ] Componentes base renderizando
- [ ] Estados hover/active funcionando
- [ ] Responsive design working

### Component Library
- [ ] Button component con variantes
- [ ] Input/Form components basic
- [ ] Card component implementado
- [ ] Modal overlay funcional
- [ ] Navigation components básicos

### Firebase Integration
- [x] Emulators conectando correctamente
- [x] Auth emulator funcional
- [ ] Firestore emulator con seeds
- [ ] Storage emulator funcionando
- [x] Environment variables configuradas

## 🔗 Dependencias

### Externas
- Node.js 18+ instalado
- Firebase CLI global
- Git configurado
- Editor con Tailwind IntelliSense

### Internas
- Este ticket es foundational - no depende de otros
- Habilita todos los tickets subsiguientes
- Establece arquitectura base del proyecto

---

**Tags:** `scaffold` `setup` `vite` `tailwind` `firebase` `design-system`  
**Relacionado:** Foundational - habilita todas las fases subsiguientes
