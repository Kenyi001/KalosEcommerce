# Design Guide - Kalos E-commerce

## Brand Identity

### Logo y Marca
- **Kalos**: Palabra griega que significa "belleza"
- **Enfoque**: Servicios de belleza a domicilio en Bolivia
- **Personalidad**: Profesional, accesible, confiable, moderno

### Paleta de Colores

#### Colores Primarios
- **Kalos Coral**: #F74F4E
  - Uso: CTAs principales, enlaces activos, highlights
  - Hover: #E94445
  - Pressed: #D13C3B
  - Subtle: #FDEBEC

- **Deep Navy**: #303F56  
  - Uso: Headers, textos importantes, navegación
  - Hover: #2A394E
  - Pressed: #233141
  - Subtle: #E8EDF3

#### Colores Secundarios
- **Gold**: #FCBE3C - Ratings, premium features, destacados
- **Beige**: #F3E7DB - Backgrounds suaves, cards
- **Kalos White**: #FAFAFA - Backgrounds principales
- **Kalos Black**: #261B15 - Textos principales, iconos

### Tipografía

#### Fraunces (Display)
- **Uso**: Títulos, headers, elementos destacados
- **Pesos**: 400 (Regular), 600 (Semibold)
- **Características**: Serif moderna, elegante, profesional

#### Inter (Sans-serif)
- **Uso**: Cuerpo de texto, UI components, navegación
- **Pesos**: 400 (Regular), 600 (Semibold), 700 (Bold)
- **Características**: Sans-serif legible, optimizada para web

### Escala Tipográfica
```css
/* Desktop */
.text-display-lg { font-size: 2rem; line-height: 1.25; }      /* 32px H1 */
.text-display-md { font-size: 1.5rem; line-height: 1.35; }    /* 24px H2 */
.text-lg { font-size: 1.125rem; line-height: 1.5; }           /* 18px */
.text-base { font-size: 1rem; line-height: 1.5; }             /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.4; }           /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1.4; }            /* 12px */

/* Mobile */
.text-display-sm { font-size: 1.5rem; line-height: 1.25; }    /* 24px H1 mobile */
.text-display-xs { font-size: 1.125rem; line-height: 1.35; }  /* 18px H2 mobile */
```

### Component Patterns

#### Button Variations
- **Primary**: Acciones principales (reservar, confirmar) - Coral
- **Secondary**: Acciones secundarias (cancelar, atrás) - Navy
- **Ghost**: Acciones sutiles (editar, opciones) - Transparente
- **Danger**: Acciones destructivas (eliminar, cancelar reserva) - Rojo

#### Card Patterns
- **Service Card**: Servicios en listings
- **Professional Card**: Perfiles de profesionales
- **Booking Card**: Reservas en dashboard
- **Review Card**: Testimonios y reseñas

## Responsive Design

### Breakpoints Mobile-First
```css
/* Mobile first approach */
/* Default: 320px+ (mobile) */

@media (min-width: 640px) { /* sm: tablet portrait */ }
@media (min-width: 768px) { /* md: tablet landscape */ }
@media (min-width: 1024px) { /* lg: laptop */ }
@media (min-width: 1280px) { /* xl: desktop */ }
```

### Spacing System
```css
/* Basado en escala de 4px */
.space-1 { 0.25rem; }  /* 4px */
.space-2 { 0.5rem; }   /* 8px */
.space-3 { 0.75rem; }  /* 12px */
.space-4 { 1rem; }     /* 16px */
.space-6 { 1.5rem; }   /* 24px */
.space-8 { 2rem; }     /* 32px */
.space-12 { 3rem; }    /* 48px */
.space-16 { 4rem; }    /* 64px */
```

## Implementación Tailwind

### Configuración en tailwind.config.js
```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F74F4E",
          hover: "#E94445",
          pressed: "#D13C3B",
          subtle: "#FDEBEC"
        },
        navy: {
          DEFAULT: "#303F56",
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
  }
}
```

---

*Última actualización: 26 agosto 2025*
