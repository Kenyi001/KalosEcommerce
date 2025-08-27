# Ticket #0006: Gestión de Profesionales - CRUD Completo

**Estado:** ✅ Completado  
**Prioridad:** Alta  
**Estimación:** 2-3 días  
**Fase:** 2 - Gestión de Profesionales  
**Asignado a:** Backend Team  

---

## 📋 Descripción

Implementar el sistema completo de gestión de profesionales de belleza, incluyendo registro, perfil, servicios ofrecidos, galería de trabajos y calendario de disponibilidad para el marketplace Kalos E-commerce.

## 🎯 Objetivos

### Funcionales
- Registro completo de profesionales
- Gestión de perfil y datos de negocio
- CRUD de servicios ofrecidos
- Galería de trabajos (portfolio)
- Calendario de disponibilidad
- Sistema de verificación y aprobación

### Técnicos
- Firestore collections estructuradas
- Storage para imágenes optimizado
- Security rules para profesionales
- API services para frontend
- Validación de datos robusta

## 🔧 Tareas Técnicas

### Firestore Data Models
- [x] Professional profiles collection
- [x] Services collection con referencia a professional
- [ ] Portfolio/gallery collection
- [ ] Availability/schedule collection
- [ ] Reviews and ratings collection

### Storage Structure
- [ ] Professional profile images
- [ ] Service images
- [ ] Portfolio images organizadas
- [ ] Document uploads (verification)
- [ ] Image optimization y thumbnails

### API Services
- [x] Professional registration service
- [x] Profile management CRUD
- [x] Services management CRUD
- [x] Portfolio management CRUD
- [ ] Availability management

### Frontend Pages
- [x] Professional List page (src/pages/Professionals/List.js)
- [x] Professional Create/Edit page (src/pages/Professionals/Create.js)
- [x] Professional Detail/Profile page (src/pages/Professionals/Detail.js)
- [x] Professional Dashboard (src/pages/Professionals/Dashboard.js)
- [x] Services management page (src/pages/Professionals/Services.js)
- [x] Service form page (src/pages/Professionals/ServiceForm.js)

## 📁 Estructura de Archivos

```
src/
├── services/
│   ├── professionals.js     # CRUD profesionales
│   ├── services.js          # CRUD servicios
│   └── portfolio.js         # CRUD portfolio
├── pages/
│   └── Professionals/
│       ├── List.js          # ✅ Implementado
│       ├── Create.js        # 🔄 En progreso
│       ├── Edit.js          # ⏳ Pendiente
│       ├── Detail.js        # ⏳ Pendiente
│       └── Dashboard.js     # ⏳ Pendiente
├── components/
│   └── professionals/
│       ├── ProfessionalCard.js
│       ├── ProfessionalForm.js
│       ├── ServicesList.js
│       └── PortfolioGallery.js
└── models/
    ├── Professional.js
    ├── Service.js
    └── Portfolio.js
```

## 💾 Modelos de Datos

### Professional Collection
```javascript
// /professionals/{professionalId}
{
  id: string,
  userId: string,              // Reference to auth user
  businessName: string,
  description: string,
  specialties: string[],       // ["corte", "color", "maquillaje"]
  location: {
    department: string,        // "La Paz", "Santa Cruz", etc.
    city: string,
    address: string,
    coordinates: {
      lat: number,
      lng: number
    }
  },
  contact: {
    phone: string,
    whatsapp: string,
    instagram: string,
    facebook: string
  },
  profileImage: string,        // Storage URL
  coverImage: string,          // Storage URL
  verified: boolean,           // Admin verification
  published: boolean,          // Professional can publish/unpublish
  stats: {
    totalServices: number,
    totalBookings: number,
    averageRating: number,
    reviewCount: number
  },
  workingHours: {
    monday: { start: "09:00", end: "18:00", available: true },
    tuesday: { start: "09:00", end: "18:00", available: true },
    // ... resto de días
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Service Collection
```javascript
// /services/{serviceId}
{
  id: string,
  professionalId: string,      // Reference to professional
  name: string,
  description: string,
  category: string,            // "corte", "color", "facial", etc.
  subcategory: string,         // "corte_hombre", "color_completo", etc.
  duration: number,            // Minutes
  price: number,               // BOB (Bolivianos)
  images: string[],            // Storage URLs
  addons: [{
    name: string,
    price: number,
    duration: number           // Additional minutes
  }],
  tags: string[],
  active: boolean,
  homeService: boolean,        // Service at client's home
  inShop: boolean,            // Service at professional's location
  order: number,              // Display order
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Portfolio Collection
```javascript
// /portfolio/{itemId}
{
  id: string,
  professionalId: string,
  title: string,
  description: string,
  images: [{
    url: string,              // Storage URL
    caption: string,
    order: number
  }],
  serviceId: string,          // Optional: link to service
  tags: string[],
  featured: boolean,
  createdAt: timestamp
}
```

## 🛠️ API Services Implementation

### Professional Service
```javascript
// src/services/professionals.js
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '../config/firebase-config.js';

export class ProfessionalsService {
  constructor() {
    this.collection = collection(db, 'professionals');
  }

  async getAllProfessionals(filters = {}, paginationOptions = {}) {
    try {
      let q = query(this.collection);

      // Apply filters
      if (filters.category) {
        q = query(q, where('specialties', 'array-contains', filters.category));
      }
      
      if (filters.department) {
        q = query(q, where('location.department', '==', filters.department));
      }
      
      if (filters.city) {
        q = query(q, where('location.city', '==', filters.city));
      }
      
      if (filters.verified !== undefined) {
        q = query(q, where('verified', '==', filters.verified));
      }
      
      if (filters.published !== undefined) {
        q = query(q, where('published', '==', filters.published));
      }

      // Apply sorting
      if (filters.sortBy) {
        const order = filters.sortOrder || 'desc';
        q = query(q, orderBy(filters.sortBy, order));
      }

      // Apply pagination
      if (paginationOptions.lastDoc) {
        q = query(q, startAfter(paginationOptions.lastDoc));
      }
      
      if (paginationOptions.limit) {
        q = query(q, limit(paginationOptions.limit));
      }

      const snapshot = await getDocs(q);
      const professionals = [];
      
      snapshot.forEach((doc) => {
        professionals.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        data: professionals,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === (paginationOptions.limit || 20)
      };
    } catch (error) {
      console.error('Error getting professionals:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProfessionalById(id) {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          success: true,
          data: {
            id: docSnap.id,
            ...docSnap.data()
          }
        };
      } else {
        return {
          success: false,
          error: 'Professional not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createProfessional(professionalData) {
    try {
      const docRef = await addDoc(this.collection, {
        ...professionalData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        success: true,
        data: {
          id: docRef.id,
          ...professionalData
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProfessional(id, updateData) {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });

      return {
        success: true,
        data: { id, ...updateData }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteProfessional(id) {
    try {
      const docRef = doc(this.collection, id);
      await deleteDoc(docRef);

      return {
        success: true,
        message: 'Professional deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const professionalsService = new ProfessionalsService();
export default professionalsService;
```

## 🎨 Frontend Pages Status

### List Page - ✅ Implementado
- Filtros por categoría, departamento, ciudad
- Paginación infinita
- Ordenamiento por rating, fecha, etc.
- Búsqueda por texto (TODO: implementar con Algolia)
- Responsive design mobile-first

### Próximas implementaciones:
1. **Create/Edit Page** - Formulario completo de professional
2. **Detail Page** - Vista pública del professional
3. **Dashboard Page** - Panel de control del professional
4. **Services Management** - CRUD de servicios
5. **Portfolio Management** - Galería de trabajos

## 🧪 Criterios de Aceptación

### Data Management
- [x] CRUD profesionales funcionando
- [x] Filtros y búsqueda implementados
- [x] Paginación optimizada
- [x] Validación de datos completa
- [x] Optimistic updates en UI

### File Upload & Storage
- [ ] Upload de imágenes de perfil
- [ ] Upload de portfolio/galería
- [ ] Optimización automática de imágenes
- [ ] Thumbnails generados
- [ ] Validación de tipos de archivo

### Business Logic
- [ ] Sistema de verificación
- [ ] Estados published/unpublished
- [ ] Cálculo automático de stats
- [ ] Geolocalización precisa
- [ ] Horarios de trabajo

### Performance & UX
- [x] Loading states implementados
- [x] Skeleton screens
- [x] Error boundaries
- [x] Responsive design implementado
- [x] Form validation y UX optimizada

## 🔗 Dependencias

### Internas
- **Ticket #0000** - Scaffold setup ✅ **COMPLETADO**
- **Ticket #0004** - Auth system ✅ **COMPLETADO**
- **Ticket #0003** - Routing ⚠️ **PARALELO**

### Externas
- Firebase Firestore configurado
- Firebase Storage configurado
- Image optimization library
- Geolocation services

## 📊 Estado Actual (26 agosto 2025)

### ✅ Completado
- Modelos de datos definidos y implementados
- Professional service CRUD completo
- List page con filtros y paginación
- Create/Edit professional page implementada
- Professional dashboard funcional
- Services management CRUD completo
- Service form para crear/editar servicios
- Professional detail page pública
- Routing completo para todas las páginas
- Validación de formularios y UX optimizada
- Firebase collections configuradas

### 🔄 Pendiente para futuras fases
- Image upload functionality
- Portfolio management
- Verification system
- Performance optimization

---

**Tags:** `professionals` `crud` `firestore` `images` `business-logic`  
**Relacionado:** Core del marketplace - profesionales son el centro del negocio
