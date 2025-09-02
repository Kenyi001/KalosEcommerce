# Especificación de Flujo de Datos y Funcionalidad - Kalos E-commerce

## 1. Arquitectura de Datos Firebase

### 1.1 Estructura de Colecciones Firestore

```
/users
  /{uid}
    - role: "customer" | "professional" | "admin"
    - displayName: string
    - photoURL: string
    - phone: string
    - emailVerified: boolean
    - createdAt: timestamp
    - updatedAt: timestamp

/professionals
  /{uid}
    /profile
      - displayName: string
      - tagline: string
      - status: "available" | "busy" | "inactive"
      - location: {city, lat, lng, radiusKm}
      - policies: {depositPercent, cancelHours, paymentMethods[]}
      - availability: {weekly, bufferMin, maxPerDay, offDays[]}
      - published: boolean
      - updatedAt: timestamp
    
    /services
      /{serviceId}
        - title: string
        - categoryId: string
        - shortDesc: string
        - longDesc: string
        - durationMin: number
        - priceBOB: number
        - atHome: boolean
        - active: boolean
        - images: string[]
        - addons: object[]
        - order: number
    
    /portfolio
      /{portfolioId}
        - url: string
        - thumbUrl: string
        - caption: string
        - visibility: "public" | "private" | "draft"
        - phase: string
        - order: number

/bookings
  /{bookingId}
    - professionalId: string
    - customerId: string
    - serviceId: string
    - date: string (YYYY-MM-DD)
    - start: string (HH:MM)
    - end: string (HH:MM)
    - priceBOB: number
    - status: "pending" | "confirmed" | "completed" | "cancelled"
    - location: {address, lat, lng, instructions}
    - createdAt: timestamp
    - updatedAt: timestamp

/public
  /featured
    - {professionalId}: {featured: boolean, order: number}
```

### 1.2 Índices Requeridos en Firestore

```javascript
// bookings
- professionalId + date (Ascending)
- customerId + date (Ascending)

// services  
- categoryId + active + order (Ascending)

// professionals/profile
- location.city + published (Ascending)
- status + published (Ascending)
```

## 2. Flujos Funcionales Principales

### 2.1 Flujo de Marketplace → Professional Profile

#### Paso 1: Carga del Marketplace
```javascript
// src/pages/Marketplace.js
async function loadProfessionals() {
  try {
    // Cargar profesionales publicados y verificados desde Firebase
    const result = await professionalService.searchProfessionals({
      published: true,
      verified: true
    }, {
      limit: 50
    });
    
    if (result.success) {
      // Transformar datos para UI
      const professionals = result.data.map(prof => ({
        id: prof.id,
        handle: prof.handle || prof.id,
        name: prof.personalInfo?.firstName || prof.name,
        businessInfo: prof.businessInfo,
        location: prof.location,
        stats: prof.stats,
        verified: prof.verification?.status === 'approved'
      }));
      
      renderProfessionals(professionals);
    }
  } catch (error) {
    // Fallback a datos locales solo en desarrollo
    handleMarketplaceError(error);
  }
}
```

#### Paso 2: Navegación a Perfil Profesional
```javascript
// Navegación desde marketplace
card.onclick = () => navigateTo(`/pro/${professional.handle}`);

// Router maneja la ruta
{
  path: '/pro/:handle',
  handler: (path) => {
    const handle = path.split('/')[2];
    document.getElementById('app').innerHTML = renderProfessionalProfilePage(handle);
    initializeProfessionalProfilePage(handle);
  }
}
```

#### Paso 3: Carga de Datos del Perfil
```javascript
// src/pages/ProfessionalProfile.js
async function loadProfessionalData(handle) {
  try {
    // 1. Cargar perfil público del profesional
    const profile = await professionalService.getPublicProfile(handle);
    
    // 2. Cargar servicios activos
    const services = await servicesService.getServicesByProfessional(handle, true);
    
    // 3. Cargar portfolio público
    const portfolio = await servicesService.getPortfolio(handle, true);
    
    // 4. Transformar y renderizar datos
    const professionalData = transformProfileData(profile, services, portfolio);
    populateProfessionalData(professionalData);
    
  } catch (error) {
    showErrorState('Profesional no encontrado');
  }
}
```

### 2.2 Flujo de Reserva (Professional Profile → Booking)

#### Paso 1: Apertura del Calendario
```javascript
// Usuario hace click en "Disponibilidad"
function openAvailabilityCalendar(professionalData) {
  // 1. Generar disponibilidad real desde Firebase
  const availability = await AvailabilityService.getProfessionalAvailability(
    professionalData.id, 
    30 // próximos 30 días
  );
  
  // 2. Renderizar calendario con datos reales
  renderCalendarWithAvailability(availability);
}
```

#### Paso 2: Selección de Servicio y Horario
```javascript
// Usuario selecciona fecha/hora → Modal de servicios
function openServiceSelectionForBooking(date, time, professionalData) {
  // 1. Mostrar servicios disponibles del profesional
  const availableServices = professionalData.services.filter(s => s.active);
  
  // 2. Usuario selecciona servicio
  // 3. Preparar datos para BookingFlow
  const bookingPreData = {
    professionalId: professionalData.id,
    serviceId: selectedService.id,
    scheduledDate: date,
    scheduledTime: time,
    // ... otros datos necesarios
  };
  
  // 4. Guardar en sessionStorage y redirigir
  sessionStorage.setItem('bookingPreData', JSON.stringify(bookingPreData));
  navigateTo('/booking/new');
}
```

#### Paso 3: BookingFlow Completo
```javascript
// src/pages/Booking/BookingFlow.js
class BookingFlow {
  async mount() {
    // 1. Verificar autenticación
    const user = await authService.waitForAuth();
    if (!user) {
      navigateTo('/auth/login?redirect=/booking');
      return;
    }
    
    // 2. Cargar datos pre-llenados del calendario
    this.loadPreFilledData();
    
    // 3. Saltar a paso de ubicación (paso 3)
    if (this.bookingData.fromCalendar) {
      this.currentStep = 3;
    }
  }
  
  async createBooking() {
    // Crear reserva real en Firebase
    const result = await BookingService.createBooking(this.bookingData);
    
    if (result.success) {
      navigateTo(`/booking/confirmation/${result.bookingId}`);
    }
  }
}
```

### 2.3 Flujo de Autenticación

#### Autenticación Unificada
```javascript
// src/services/auth.js
class AuthService {
  async signInWithEmailAndPassword(email, password) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Verificar que el email esté verificado
      if (!result.user.emailVerified) {
        throw new Error('Email no verificado');
      }
      
      // Cargar perfil del usuario
      const userProfile = await this.getCurrentUserProfile();
      
      return { user: result.user, profile: userProfile };
    } catch (error) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }
  
  async getCurrentUserProfile() {
    const user = this.getCurrentUser();
    if (!user) return null;
    
    // Buscar en colección users
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return userDoc.exists() ? userDoc.data() : null;
  }
}
```

## 3. Servicios de Datos (Data Layer)

### 3.1 Professional Service
```javascript
// src/services/professionals.js
class ProfessionalService {
  async getPublicProfile(professionalId) {
    try {
      const profile = await this.getProfile(professionalId);
      
      // Verificar que esté activo y aprobado
      if (!profile || profile.status !== 'active' || 
          profile.verification?.status !== 'approved') {
        return null;
      }
      
      // Retornar solo información pública
      return {
        id: profile.id,
        personalInfo: {
          firstName: profile.personalInfo?.firstName,
          profileImage: profile.personalInfo?.profileImage
        },
        businessInfo: profile.businessInfo,
        location: profile.location,
        stats: profile.stats
      };
    } catch (error) {
      console.error('Error getting public profile:', error);
      return null;
    }
  }
  
  async searchProfessionals(filters = {}, pagination = {}) {
    try {
      let q = query(collection(db, 'professionals'));
      
      // Aplicar filtros
      if (filters.published) {
        q = query(q, where('published', '==', true));
      }
      
      if (filters.verified) {
        q = query(q, where('verification.status', '==', 'approved'));
      }
      
      if (filters.city) {
        q = query(q, where('location.city', '==', filters.city));
      }
      
      // Paginación
      if (pagination.limit) {
        q = query(q, limit(pagination.limit));
      }
      
      const snapshot = await getDocs(q);
      const professionals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, data: professionals };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

### 3.2 Services Service
```javascript
// src/services/services.js  
class ServicesService {
  async getServicesByProfessional(professionalId, activeOnly = true) {
    try {
      let q = query(
        collection(db, 'services'),
        where('professionalId', '==', professionalId)
      );
      
      if (activeOnly) {
        q = query(q, where('status', '==', 'active'));
      }
      
      q = query(q, orderBy('order', 'asc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting services:', error);
      return [];
    }
  }
  
  async getPortfolio(professionalId, publicOnly = true) {
    try {
      let q = query(
        collection(db, 'portfolio'),
        where('professionalId', '==', professionalId)
      );
      
      if (publicOnly) {
        q = query(q, where('visibility', '==', 'public'));
      }
      
      q = query(q, orderBy('order', 'asc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting portfolio:', error);
      return [];
    }
  }
}
```

### 3.3 Booking Service
```javascript
// src/services/bookings.js
class BookingService {
  static async createBooking(bookingData) {
    try {
      // 1. Validar disponibilidad
      const isAvailable = await this.checkAvailability(
        bookingData.professionalId,
        bookingData.scheduledDate,
        bookingData.scheduledTime,
        bookingData.service.totalDuration
      );
      
      if (!isAvailable) {
        throw new Error('Horario no disponible');
      }
      
      // 2. Crear documento de reserva
      const bookingRef = doc(collection(db, 'bookings'));
      const booking = {
        id: bookingRef.id,
        professionalId: bookingData.professionalId,
        customerId: bookingData.customerId,
        serviceId: bookingData.serviceId,
        scheduledDate: bookingData.scheduledDate,
        scheduledTime: bookingData.scheduledTime,
        service: bookingData.service,
        location: bookingData.location,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(bookingRef, booking);
      
      // 3. Actualizar disponibilidad
      await this.lockTimeSlot(
        bookingData.professionalId,
        bookingData.scheduledDate,
        bookingData.scheduledTime,
        bookingData.service.totalDuration
      );
      
      return { success: true, bookingId: bookingRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

## 4. Reglas de Seguridad Firebase

### 4.1 Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - solo lectura propia
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     resource.data.role == 'professional' && 
                     resource.data.published == true;
    }
    
    // Professionals - lectura pública si published
    match /professionals/{professionalId} {
      allow read: if resource.data.published == true;
      allow read, write: if request.auth != null && request.auth.uid == professionalId;
      
      match /profile/{document=**} {
        allow read: if get(/databases/$(database)/documents/professionals/$(professionalId)).data.published == true;
        allow read, write: if request.auth != null && request.auth.uid == professionalId;
      }
      
      match /services/{serviceId} {
        allow read: if resource.data.active == true && 
                       get(/databases/$(database)/documents/professionals/$(professionalId)).data.published == true;
        allow read, write: if request.auth != null && request.auth.uid == professionalId;
      }
      
      match /portfolio/{portfolioId} {
        allow read: if resource.data.visibility == 'public' && 
                       get(/databases/$(database)/documents/professionals/$(professionalId)).data.published == true;
        allow read, write: if request.auth != null && request.auth.uid == professionalId;
      }
    }
    
    // Bookings - solo para involucrados
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && 
                            (request.auth.uid == resource.data.customerId || 
                             request.auth.uid == resource.data.professionalId);
      allow create: if request.auth != null && request.auth.uid == request.resource.data.customerId;
    }
    
    // Public data - lectura para todos
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 4.2 Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public professional assets
    match /public/professionals/{professionalId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == professionalId;
    }
    
    // Private professional drafts
    match /private/professionals/{professionalId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == professionalId;
    }
  }
}
```

## 5. Estado de la Aplicación

### 5.1 Gestión de Estado Global
```javascript
// src/utils/appState.js
class AppState {
  constructor() {
    this.currentUser = null;
    this.userProfile = null;
    this.currentProfessional = null;
    this.marketplace = {
      professionals: [],
      filters: {},
      pagination: {}
    };
  }
  
  setCurrentUser(user, profile) {
    this.currentUser = user;
    this.userProfile = profile;
    this.notifyAuthListeners();
  }
  
  setMarketplaceProfessionals(professionals) {
    this.marketplace.professionals = professionals;
    this.notifyMarketplaceListeners();
  }
}

// Instancia global
export const appState = new AppState();
```

### 5.2 Persistencia Local
```javascript
// Solo para datos no sensibles y temporales
const LOCAL_STORAGE_KEYS = {
  MARKETPLACE_FILTERS: 'kalos_marketplace_filters',
  BOOKING_DRAFT: 'kalos_booking_draft',
  UI_PREFERENCES: 'kalos_ui_preferences'
};

// Datos sensibles siempre desde Firebase
const FIREBASE_ONLY_DATA = [
  'user_profile',
  'professional_data', 
  'bookings',
  'services',
  'portfolio'
];
```

## 6. Manejo de Errores y Fallbacks

### 6.1 Estrategia de Fallbacks
```javascript
// Orden de prioridad para datos:
// 1. Firebase (producción)
// 2. Datos locales (solo desarrollo)
// 3. Datos básicos de fallback
// 4. Estado de error

async function loadWithFallback(primaryLoader, fallbackLoader, errorHandler) {
  try {
    return await primaryLoader();
  } catch (primaryError) {
    console.warn('Primary loader failed:', primaryError);
    
    if (import.meta.env.DEV && fallbackLoader) {
      try {
        return await fallbackLoader();
      } catch (fallbackError) {
        console.warn('Fallback loader failed:', fallbackError);
      }
    }
    
    return errorHandler(primaryError);
  }
}
```

### 6.2 Manejo de Estados de Carga
```javascript
// Estados estándar para todas las páginas
const UI_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success', 
  ERROR: 'error',
  EMPTY: 'empty'
};

function showUIState(state, message = '') {
  const loadingEl = document.getElementById('loading-state');
  const contentEl = document.getElementById('content-state');
  const errorEl = document.getElementById('error-state');
  const emptyEl = document.getElementById('empty-state');
  
  // Ocultar todos
  [loadingEl, contentEl, errorEl, emptyEl].forEach(el => {
    if (el) el.style.display = 'none';
  });
  
  // Mostrar el estado actual
  switch (state) {
    case UI_STATES.LOADING:
      if (loadingEl) loadingEl.style.display = 'block';
      break;
    case UI_STATES.SUCCESS:
      if (contentEl) contentEl.style.display = 'block';
      break;
    case UI_STATES.ERROR:
      if (errorEl) {
        errorEl.style.display = 'block';
        const messageEl = errorEl.querySelector('.error-message');
        if (messageEl) messageEl.textContent = message;
      }
      break;
    case UI_STATES.EMPTY:
      if (emptyEl) emptyEl.style.display = 'block';
      break;
  }
}
```

## 7. Performance y Optimización

### 7.1 Estrategias de Carga
```javascript
// Lazy loading de imágenes
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

// Paginación de datos
async function loadPaginatedData(collection, pageSize = 20, lastDoc = null) {
  let q = query(collection, limit(pageSize));
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  const snapshot = await getDocs(q);
  return {
    data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === pageSize
  };
}
```

### 7.2 Cache Strategy
```javascript
// Cache en memoria para datos frecuentemente accedidos
class DataCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutos
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
}

export const dataCache = new DataCache();
```

Este documento define completamente cómo funciona el manejo de datos y los flujos funcionales en la aplicación Kalos E-commerce, siguiendo las especificaciones de Firebase y la arquitectura definida en las instrucciones del proyecto.
