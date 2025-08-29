# Ticket Fase 4-0011: Perfil Público del Profesional

## 📋 Descripción
Crear página pública del perfil del profesional (/pro/:handle) que muestre información completa, servicios, portfolio, reviews y permita solicitar reservas.

## 🎯 Objetivos
- Vista pública completa del profesional
- Galería de portfolio con lightbox
- Lista de servicios con precios
- Sistema de reviews y calificaciones
- CTA para solicitar reserva
- SEO optimizado con meta tags

## 📊 Criterios de Aceptación

### ✅ Información del Profesional
- [ ] Header con foto, nombre, especialidades
- [ ] Descripción/bio del profesional
- [ ] Ubicación y área de cobertura
- [ ] Rating promedio y número de reviews
- [ ] Badge de verificación si aplica

### ✅ Servicios y Precios
- [ ] Grid de servicios con ServiceCard
- [ ] Precios, duración y descripción
- [ ] Botón "Reservar" por cada servicio
- [ ] Filtros por categoría de servicio
- [ ] Disponibilidad básica mostrada

### ✅ Portfolio y Galería
- [ ] Galería de trabajos realizados
- [ ] Lightbox para ver imágenes en detalle
- [ ] Categorización de imágenes por tipo de servicio
- [ ] Upload desde Dashboard del profesional

### ✅ Reviews y Testimonios
- [ ] Lista de reviews con rating, comentario, fecha
- [ ] Paginación o lazy loading
- [ ] Promedio de calificaciones por categoría
- [ ] Solo reviews verificadas (de bookings completados)

### ✅ Call to Action
- [ ] Botón principal "Solicitar reserva"
- [ ] Si no está logueado → /auth/login con returnTo
- [ ] Si está logueado → /reservar?professional=:handle
- [ ] Botones de contacto secundarios

## 🔧 Implementación Técnica

### Route Structure
```
/pro/:handle → src/pages/ProfessionalProfile.js
```

### Professional Profile Implementation
```javascript
// src/pages/ProfessionalProfile.js
import { getProfessionalByHandle } from '../services/professionals.js';
import { getProfessionalReviews } from '../services/reviews.js';
import { authService } from '../services/auth.js';
import { ServiceCard } from '../components/ServiceCard.js';

export async function renderProfessionalProfile({ params }) {
  const { handle } = params;
  
  try {
    const [professional, reviews] = await Promise.all([
      getProfessionalByHandle(handle),
      getProfessionalReviews(handle, { limit: 10 })
    ]);

    if (!professional || !professional.published) {
      return renderNotFound();
    }

    return `
      <main class="professional-profile">
        ${renderProfessionalHeader(professional)}
        ${renderServicesSection(professional.services)}
        ${renderPortfolioSection(professional.portfolio)}
        ${renderReviewsSection(reviews)}
        ${renderContactSection(professional)}
      </main>
    `;
  } catch (error) {
    console.error('Error loading professional profile:', error);
    return renderErrorState();
  }
}

function renderProfessionalHeader(professional) {
  return `
    <section class="hero bg-gradient-to-r from-kalos-beige to-white py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row gap-8 items-center">
          <div class="flex-shrink-0">
            <img 
              src="${professional.avatar || '/default-avatar.png'}" 
              alt="${professional.displayName}"
              class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            >
            ${professional.verified ? '<div class="verified-badge">✓</div>' : ''}
          </div>
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-3xl md:text-4xl font-bold text-kalos-navy mb-2">
              ${professional.displayName}
            </h1>
            <p class="text-xl text-kalos-coral mb-4">
              ${professional.specialties?.join(' • ') || 'Profesional de belleza'}
            </p>
            <div class="flex items-center gap-4 justify-center md:justify-start mb-4">
              <div class="rating">
                ${renderStarRating(professional.averageRating)}
                <span class="ml-2 text-gray-600">
                  ${professional.averageRating?.toFixed(1) || 'Nuevo'} 
                  (${professional.totalReviews || 0} reviews)
                </span>
              </div>
            </div>
            <p class="text-gray-700 mb-6">${professional.bio || ''}</p>
            <div class="flex gap-4 justify-center md:justify-start">
              <button 
                id="book-service-btn" 
                class="btn-primary-large"
                data-professional="${professional.handle}"
              >
                Solicitar reserva
              </button>
              <button class="btn-outline-primary">
                Enviar mensaje
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderServicesSection(services) {
  return `
    <section class="services py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">
          Servicios disponibles
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${services?.map(service => ServiceCard.render(service, { showBookButton: true })).join('') || 
            '<p class="col-span-full text-center text-gray-600">No hay servicios disponibles</p>'}
        </div>
      </div>
    </section>
  `;
}

function renderPortfolioSection(portfolio) {
  if (!portfolio?.length) return '';
  
  return `
    <section class="portfolio py-12 px-4 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">
          Portfolio
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="portfolio-gallery">
          ${portfolio.map((item, index) => `
            <div class="portfolio-item cursor-pointer" data-index="${index}">
              <img 
                src="${item.thumbnail || item.url}" 
                alt="${item.alt || 'Trabajo realizado'}"
                class="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
              >
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderReviewsSection(reviews) {
  return `
    <section class="reviews py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">
          Reviews de clientes
        </h2>
        <div class="space-y-6" id="reviews-list">
          ${reviews?.map(review => renderReviewCard(review)).join('') ||
            '<p class="text-center text-gray-600">Aún no hay reviews</p>'}
        </div>
        ${reviews?.length >= 10 ? '<div class="text-center mt-8"><button class="btn-outline-primary" id="load-more-reviews">Ver más reviews</button></div>' : ''}
      </div>
    </section>
  `;
}

function renderReviewCard(review) {
  return `
    <div class="review-card bg-white p-6 rounded-lg shadow-sm border">
      <div class="flex items-start gap-4">
        <img 
          src="${review.user?.avatar || '/default-avatar.png'}" 
          alt="${review.user?.name}"
          class="w-12 h-12 rounded-full object-cover"
        >
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h4 class="font-semibold">${review.user?.name || 'Usuario'}</h4>
              <div class="flex items-center gap-2">
                ${renderStarRating(review.rating)}
                <span class="text-sm text-gray-500">
                  ${new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <p class="text-gray-700">${review.comment}</p>
          ${review.service ? `<p class="text-sm text-kalos-coral mt-2">Servicio: ${review.service.name}</p>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function initializeProfessionalProfile() {
  // Book service button
  const bookBtn = document.getElementById('book-service-btn');
  if (bookBtn) {
    bookBtn.addEventListener('click', async (e) => {
      const professionalHandle = e.target.dataset.professional;
      const user = await authService.getCurrentUser();
      
      if (!user) {
        // Redirect to login with returnTo
        const returnTo = encodeURIComponent(window.location.pathname);
        window.location.href = `/auth/login?returnTo=${returnTo}`;
        return;
      }
      
      // Redirect to booking flow
      window.location.href = `/reservar?professional=${professionalHandle}`;
    });
  }

  // Portfolio lightbox
  initializePortfolioLightbox();
  
  // Load more reviews
  const loadMoreBtn = document.getElementById('load-more-reviews');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreReviews);
  }
}

function renderStarRating(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push('<i class="star-filled text-yellow-400">★</i>');
    } else if (i - 0.5 <= rating) {
      stars.push('<i class="star-half text-yellow-400">⯨</i>');
    } else {
      stars.push('<i class="star-empty text-gray-300">☆</i>');
    }
  }
  return stars.join('');
}

function initializePortfolioLightbox() {
  // Simple lightbox implementation
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      openLightbox(index);
    });
  });
}

function openLightbox(index) {
  // Implementation for lightbox modal
  // This would show a modal with the full-size image
}

async function loadMoreReviews() {
  // Implementation for loading more reviews with pagination
}
```

### SEO Meta Tags
```javascript
// Add to page head
export function getMetaTags(professional) {
  return {
    title: `${professional.displayName} - Servicios de belleza | Kalos`,
    description: `${professional.bio || `Servicios de belleza con ${professional.displayName}`}. Rating: ${professional.averageRating}/5. Reserva ahora en Kalos.`,
    ogTitle: `${professional.displayName} - Profesional de belleza`,
    ogDescription: professional.bio,
    ogImage: professional.avatar,
    ogUrl: `https://kalos.bo/pro/${professional.handle}`
  };
}
```

## 🧪 Testing

### Unit Tests
- [ ] getProfessionalByHandle service
- [ ] Review rendering and pagination
- [ ] Auth state handling for booking CTA

### E2E Tests
- [ ] Load professional profile
- [ ] View services and portfolio
- [ ] Book service flow (logged in/out)
- [ ] Load more reviews

## 🚀 Deployment

### SEO Requirements
- Open Graph meta tags
- Schema.org Person/Service markup
- Canonical URLs
- Breadcrumb navigation

## 📦 Dependencies
- ProfessionalsService
- ReviewsService
- AuthService
- ServiceCard component

## 🔗 Relaciones
- **Alimenta**: Sistema de reservas
- **Conecta con**: /reservar, /auth/login
- **Usa**: ServicesService, ReviewsService

---

**Estado**: 📋 Planificado  
**Prioridad**: Alta  
**Estimación**: 12 horas  
**Asignado**: Frontend Developer  

**Sprint**: Sprint 4 - Frontend y UX  
**Deadline**: 6 septiembre 2025
