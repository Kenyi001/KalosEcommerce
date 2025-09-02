# Guía de Configuración Firebase - Kalos E-commerce

## 1. Configuración del Proyecto Firebase

### 1.1 Crear Proyecto
```bash
# 1. Ir a Firebase Console: https://console.firebase.google.com
# 2. Crear nuevo proyecto: "kalos-ecommerce"
# 3. Habilitar Google Analytics (opcional)
# 4. Configurar región: southamerica-east1 (São Paulo)
```

### 1.2 Configurar Productos Firebase

#### Authentication
```bash
# En Firebase Console > Authentication > Sign-in method:
- Email/Password: ✅ Habilitado (con verificación de email)
- Google: ✅ Habilitado (opcional)
```

#### Firestore Database
```bash
# En Firebase Console > Firestore Database:
- Modo: Native
- Región: southamerica-east1
- Reglas: Ver sección 3
```

#### Storage
```bash
# En Firebase Console > Storage:
- Región: southamerica-east1  
- Reglas: Ver sección 3
```

## 2. Configuración Local

### 2.1 Variables de Entorno
```bash
# Crear archivo .env en la raíz del proyecto:
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=kalos-ecommerce.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kalos-ecommerce
VITE_FIREBASE_STORAGE_BUCKET=kalos-ecommerce.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Para desarrollo con emuladores:
VITE_USE_FIREBASE_EMULATOR=true
```

### 2.2 Estructura de Colecciones Firestore

#### Crear colecciones iniciales:
```javascript
// En Firebase Console > Firestore Database > Empezar colección:

// 1. Collection: "users"
// Document ID: "demo_user_1"
{
  "role": "customer",
  "displayName": "Cliente Demo",
  "photoURL": "",
  "phone": "+59170000000",
  "emailVerified": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}

// 2. Collection: "professionals" 
// Document ID: "maria-gonzalez"
{
  "id": "maria-gonzalez",
  "handle": "maria-gonzalez",
  "status": "active",
  "personalInfo": {
    "firstName": "María González",
    "lastName": "Rodríguez", 
    "profileImage": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    "phone": "+59177123456",
    "email": "maria.gonzalez@kalosecommerce.com"
  },
  "businessInfo": {
    "businessName": "María González Beauty Studio",
    "description": "Especialista en Maquillaje y Peinado Profesional",
    "bio": "Profesional certificada en maquillaje y peinado con más de 5 años de experiencia.",
    "categories": ["makeup", "hair", "bridal"],
    "experienceYears": 5,
    "socialMedia": {
      "instagram": "https://instagram.com/maria_makeup_bo",
      "facebook": "https://facebook.com/MariaGonzalezMakeup",
      "whatsapp": "https://wa.me/59177123456"
    }
  },
  "location": {
    "department": "Santa Cruz",
    "city": "Santa Cruz",
    "zone": "Plan 3000", 
    "serviceRadius": 15,
    "homeService": true
  },
  "verification": {
    "status": "approved",
    "verifiedAt": "timestamp"
  },
  "stats": {
    "totalServices": 6,
    "totalReviews": 127,
    "averageRating": 4.8,
    "completedBookings": 156
  },
  "published": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}

// 3. Collection: "services"
// Document ID: "service_001"
{
  "professionalId": "maria-gonzalez",
  "basicInfo": {
    "name": "Maquillaje de Novia",
    "description": "Maquillaje completo para el día más especial, incluye prueba previa",
    "category": "makeup",
    "duration": 120
  },
  "pricing": {
    "basePrice": 350,
    "currency": "BOB"
  },
  "media": {
    "images": ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=300&fit=crop"]
  },
  "status": "active",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}

// Repetir para más servicios...
```

## 3. Reglas de Seguridad

### 3.1 Firestore Rules
```javascript
// Archivo: firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     resource.data.role == 'professional' && 
                     resource.data.published == true;
    }
    
    // Professionals collection
    match /professionals/{professionalId} {
      // Lectura pública si está publicado y activo
      allow read: if resource.data.published == true && 
                     resource.data.status == 'active' &&
                     resource.data.verification.status == 'approved';
      
      // Escritura solo del propio profesional
      allow write: if request.auth != null && request.auth.uid == professionalId;
    }
    
    // Services collection
    match /services/{serviceId} {
      // Lectura pública si el servicio está activo y el profesional publicado
      allow read: if resource.data.status == 'active' &&
                     get(/databases/$(database)/documents/professionals/$(resource.data.professionalId)).data.published == true;
      
      // Escritura solo del profesional propietario
      allow write: if request.auth != null && 
                      request.auth.uid == resource.data.professionalId;
    }
    
    // Portfolio collection
    match /portfolio/{portfolioId} {
      // Lectura pública si es visible y el profesional está publicado
      allow read: if resource.data.visibility == 'public' &&
                     get(/databases/$(database)/documents/professionals/$(resource.data.professionalId)).data.published == true;
      
      // Escritura solo del profesional propietario
      allow write: if request.auth != null && 
                      request.auth.uid == resource.data.professionalId;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      // Solo pueden leer/escribir los involucrados
      allow read, write: if request.auth != null && 
                            (request.auth.uid == resource.data.customerId || 
                             request.auth.uid == resource.data.professionalId);
      
      // Los clientes pueden crear sus propias reservas
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.customerId;
    }
    
    // Messages collection (chat)
    match /kalos_messages/{messageId} {
      allow read, write: if request.auth != null;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.senderId;
    }
    
    // Public data
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
  }
}
```

### 3.2 Storage Rules
```javascript
// Archivo: storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public professional assets
    match /public/professionals/{professionalId}/{allPaths=**} {
      allow read: if true; // Lectura pública
      allow write: if request.auth != null && request.auth.uid == professionalId;
    }
    
    // Private professional assets
    match /private/professionals/{professionalId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == professionalId;
    }
    
    // User profile images
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 4. Índices Compuestos Requeridos

### 4.1 Crear Índices en Firestore
```javascript
// En Firebase Console > Firestore Database > Índices > Crear índice:

// 1. Collection: "services"
// Campos: professionalId (Ascending), status (Ascending), order (Ascending)

// 2. Collection: "bookings"  
// Campos: professionalId (Ascending), scheduledDate (Ascending)

// 3. Collection: "bookings"
// Campos: customerId (Ascending), scheduledDate (Ascending)

// 4. Collection: "professionals"
// Campos: published (Ascending), status (Ascending), location.city (Ascending)

// 5. Collection: "kalos_messages"
// Campos: conversationId (Ascending), timestamp (Ascending)
```

## 5. Datos de Prueba Completos

### 5.1 Script de Población de Datos
```javascript
// Ejecutar en Firebase Console > Firestore Database > Ejecutar consulta:

// Crear servicios completos para María González
const servicesToCreate = [
  {
    id: "service_001",
    professionalId: "maria-gonzalez",
    basicInfo: {
      name: "Maquillaje de Novia",
      description: "Maquillaje completo para el día más especial",
      category: "makeup",
      duration: 120
    },
    pricing: { basePrice: 350, currency: "BOB" },
    media: { images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=300&fit=crop"] },
    status: "active"
  },
  {
    id: "service_002", 
    professionalId: "maria-gonzalez",
    basicInfo: {
      name: "Peinado para Evento",
      description: "Peinado elegante y duradero para eventos especiales",
      category: "hair",
      duration: 90
    },
    pricing: { basePrice: 180, currency: "BOB" },
    media: { images: ["https://images.unsplash.com/photo-1560869713-bf165a7c7e8b?w=500&h=300&fit=crop"] },
    status: "active"
  },
  {
    id: "service_003",
    professionalId: "maria-gonzalez", 
    basicInfo: {
      name: "Maquillaje Social",
      description: "Maquillaje para fiestas, reuniones y eventos sociales",
      category: "makeup",
      duration: 60
    },
    pricing: { basePrice: 150, currency: "BOB" },
    media: { images: ["https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&h=300&fit=crop"] },
    status: "active"
  }
  // ... más servicios
];

// Crear items de portfolio
const portfolioToCreate = [
  {
    id: "portfolio_001",
    professionalId: "maria-gonzalez",
    title: "Maquillaje de Novia - Carolina",
    description: "Maquillaje natural y elegante para boda de día",
    category: "makeup",
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop"],
    visibility: "public",
    featured: true
  },
  {
    id: "portfolio_002",
    professionalId: "maria-gonzalez",
    title: "Sesión Fotográfica - Andrea", 
    description: "Maquillaje editorial para sesión de fotos",
    category: "photo",
    images: ["https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop"],
    visibility: "public",
    featured: true
  }
  // ... más portfolio
];
```

## 6. Verificación de Configuración

### 6.1 Tests de Conexión
```javascript
// En consola del browser (después de cargar la app):

// 1. Verificar conexión Firebase
console.log('Firebase App:', firebase.app());
console.log('Auth:', firebase.auth().currentUser);
console.log('Firestore:', firebase.firestore());

// 2. Test de lectura de profesionales
firebase.firestore().collection('professionals').get().then(snapshot => {
  console.log('Professionals count:', snapshot.size);
  snapshot.forEach(doc => console.log(doc.id, doc.data()));
});

// 3. Test de lectura de servicios
firebase.firestore().collection('services')
  .where('professionalId', '==', 'maria-gonzalez')
  .get().then(snapshot => {
    console.log('Services count:', snapshot.size);
    snapshot.forEach(doc => console.log(doc.data()));
  });
```

### 6.2 Verificación de Reglas
```javascript
// Test de reglas de seguridad:

// 1. Sin autenticación (debe fallar)
firebase.firestore().collection('users').get()
  .catch(error => console.log('Expected auth error:', error));

// 2. Con autenticación (debe funcionar)
firebase.auth().signInAnonymously().then(() => {
  return firebase.firestore().collection('professionals').get();
}).then(snapshot => {
  console.log('Public professionals accessible:', snapshot.size);
});
```

## 7. Comandos Firebase CLI

### 7.1 Instalación y Configuración
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login a Firebase
firebase login

# Inicializar proyecto en directorio actual
firebase init

# Seleccionar:
# - Firestore
# - Storage  
# - Hosting
# - Emulators
```

### 7.2 Emulators para Desarrollo
```bash
# Iniciar emulators
firebase emulators:start

# Con datos de prueba
firebase emulators:start --import ./firebase-data

# URL de emulators:
# - Auth: http://localhost:9099
# - Firestore: http://localhost:8080  
# - Storage: http://localhost:9199
```

### 7.3 Deploy a Producción
```bash
# Deploy reglas de seguridad
firebase deploy --only firestore:rules
firebase deploy --only storage

# Deploy hosting
firebase deploy --only hosting

# Deploy completo
firebase deploy
```

## 8. Troubleshooting

### 8.1 Problemas Comunes
```javascript
// Error: "Missing or insufficient permissions"
// Solución: Verificar reglas de seguridad en Firestore

// Error: "Firebase app not initialized"
// Solución: Verificar variables de entorno en .env

// Error: "Collection 'professionals' doesn't exist"  
// Solución: Crear colecciones según sección 2.2

// Error: "Index not found"
// Solución: Crear índices según sección 4.1
```

### 8.2 Logs de Debug
```javascript
// Habilitar logs de debug de Firebase
firebase.firestore().enableNetwork();
firebase.firestore().enableLogging(true);

// Ver requests a Firestore en Network tab del browser
// Verificar en Firebase Console > Usage tab
```

**Siguiendo esta guía tendrás Firebase configurado correctamente según las especificaciones del proyecto Kalos E-commerce.**
