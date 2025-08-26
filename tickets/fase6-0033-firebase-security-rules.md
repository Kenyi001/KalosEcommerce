# Ticket Fase 6-0033: Reglas de Seguridad Firebase

## 📋 Descripción
Implementar reglas de seguridad robustas para Firebase Firestore y Storage de la plataforma Kalos, asegurando la protección de datos sensibles, control de acceso basado en roles, validación de datos y prevención de ataques comunes.

## 🎯 Objetivos
- Reglas de seguridad para Firestore
- Reglas de seguridad para Firebase Storage
- Control de acceso basado en roles (RBAC)
- Validación de estructura de datos
- Prevención de ataques y abuse
- Logging y monitoreo de seguridad
- Testing de reglas de seguridad

## 📊 Criterios de Aceptación

### ✅ Firestore Security Rules
- [ ] Autenticación requerida para operaciones sensibles
- [ ] Control de acceso basado en roles de usuario
- [ ] Validación de estructura y tipos de datos
- [ ] Límites de rate limiting y quotas
- [ ] Protección contra lectura/escritura masiva

### ✅ Storage Security Rules
- [ ] Control de acceso a archivos por propietario
- [ ] Validación de tipos y tamaños de archivo
- [ ] Organización segura de directorios
- [ ] Prevención de sobrescritura maliciosa
- [ ] Límites de upload y storage

### ✅ Role-Based Access Control
- [ ] Roles: user, professional, admin, moderator
- [ ] Permisos granulares por colección
- [ ] Herencia y jerarquía de permisos
- [ ] Validación de cambios de rol
- [ ] Auditoría de accesos privilegiados

### ✅ Data Validation
- [ ] Esquemas de validación por colección
- [ ] Validación de campos requeridos
- [ ] Sanitización de entrada de datos
- [ ] Prevención de inyección de código
- [ ] Límites de tamaño de documentos

## 🔧 Implementación Técnica

### Firestore Security Rules Structure
```
firestore.rules
├── // Authentication rules
├── // User management rules  
├── // Professional profiles rules
├── // Booking system rules
├── // Review and rating rules
├── // Messaging rules
├── // Admin operations rules
├── // Moderation rules
└── // Utility functions
```

### Firestore Security Rules Implementation
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ======================
    // UTILITY FUNCTIONS
    // ======================
    
    // Verificar si el usuario está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Verificar si es el propietario del documento
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Verificar rol del usuario
    function hasRole(role) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // Verificar múltiples roles
    function hasAnyRole(roles) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in roles;
    }
    
    // Verificar si el usuario está activo
    function isActiveUser() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.status == 'active';
    }
    
    // Verificar si es administrador
    function isAdmin() {
      return hasRole('admin');
    }
    
    // Verificar si es moderador o admin
    function isModerator() {
      return hasAnyRole(['admin', 'moderator']);
    }
    
    // Verificar si es profesional
    function isProfessional() {
      return hasRole('professional');
    }
    
    // Validar estructura de datos
    function hasValidStructure(requiredFields) {
      return request.resource.data.keys().hasAll(requiredFields);
    }
    
    // Verificar límites de texto
    function isValidTextLength(field, maxLength) {
      return field is string && field.size() <= maxLength;
    }
    
    // Verificar email válido
    function isValidEmail(email) {
      return email is string && email.matches('.*@.*\\..*');
    }
    
    // Verificar timestamp válido
    function isValidTimestamp(timestamp) {
      return timestamp is timestamp && 
        timestamp <= request.time + duration.value(1, 'h'); // Max 1 hora en el futuro
    }
    
    // ======================
    // USER DOCUMENTS
    // ======================
    
    match /users/{userId} {
      // Lectura: propio perfil o admin/moderador
      allow read: if isOwner(userId) || isModerator();
      
      // Creación: solo el propio usuario al registrarse
      allow create: if isOwner(userId) && 
        hasValidStructure(['email', 'name', 'role', 'status', 'createdAt']) &&
        isValidEmail(request.resource.data.email) &&
        isValidTextLength(request.resource.data.name, 100) &&
        request.resource.data.role in ['user', 'professional'] &&
        request.resource.data.status == 'pending' &&
        isValidTimestamp(request.resource.data.createdAt);
      
      // Actualización: propio usuario (campos limitados) o admin
      allow update: if (isOwner(userId) && 
        // Usuario puede actualizar solo ciertos campos
        request.resource.data.diff(resource.data).affectedKeys().hasOnly([
          'name', 'phone', 'avatar', 'preferences', 'updatedAt'
        ]) &&
        isValidTextLength(request.resource.data.name, 100)) ||
        // Admin puede actualizar cualquier campo
        (isAdmin() && 
          // Validar cambios críticos
          (request.resource.data.role == resource.data.role || 
           request.resource.data.role in ['user', 'professional', 'admin', 'moderator']) &&
          isValidTimestamp(request.resource.data.updatedAt));
      
      // Eliminación: solo admin
      allow delete: if isAdmin();
    }
    
    // ======================
    // PROFESSIONAL PROFILES
    // ======================
    
    match /professionals/{professionalId} {
      // Lectura: público para perfiles aprobados, propietario/admin para todos
      allow read: if resource.data.status == 'approved' || 
        isOwner(professionalId) || 
        isModerator();
      
      // Creación: solo profesionales pueden crear su perfil
      allow create: if isOwner(professionalId) && 
        isProfessional() &&
        hasValidStructure(['userId', 'businessName', 'description', 'services', 'location', 'status', 'createdAt']) &&
        request.resource.data.userId == professionalId &&
        isValidTextLength(request.resource.data.businessName, 200) &&
        isValidTextLength(request.resource.data.description, 1000) &&
        request.resource.data.services is list &&
        request.resource.data.services.size() <= 20 &&
        request.resource.data.status == 'pending' &&
        isValidTimestamp(request.resource.data.createdAt);
      
      // Actualización: propietario (campos limitados) o admin
      allow update: if (isOwner(professionalId) && 
        // Profesional puede actualizar ciertos campos
        request.resource.data.diff(resource.data).affectedKeys().hasOnly([
          'businessName', 'description', 'services', 'location', 'portfolio', 
          'workingHours', 'socialMedia', 'updatedAt'
        ]) &&
        isValidTextLength(request.resource.data.businessName, 200) &&
        isValidTextLength(request.resource.data.description, 1000)) ||
        // Admin/moderador puede aprobar/rechazar
        (isModerator() && 
          request.resource.data.diff(resource.data).affectedKeys().hasOnly([
            'status', 'verificationNotes', 'updatedAt'
          ]) &&
          request.resource.data.status in ['pending', 'approved', 'rejected', 'suspended']);
      
      // Eliminación: solo admin
      allow delete: if isAdmin();
    }
    
    // ======================
    // BOOKING SYSTEM
    // ======================
    
    match /bookings/{bookingId} {
      // Lectura: cliente, profesional involucrado o admin
      allow read: if isOwner(resource.data.clientId) || 
        isOwner(resource.data.professionalId) || 
        isModerator();
      
      // Creación: solo clientes autenticados
      allow create: if isAuthenticated() && 
        isActiveUser() &&
        request.resource.data.clientId == request.auth.uid &&
        hasValidStructure(['clientId', 'professionalId', 'serviceId', 'date', 'status', 'amount', 'createdAt']) &&
        request.resource.data.status == 'pending' &&
        request.resource.data.amount is number &&
        request.resource.data.amount > 0 &&
        isValidTimestamp(request.resource.data.date) &&
        request.resource.data.date > request.time &&
        isValidTimestamp(request.resource.data.createdAt);
      
      // Actualización: participantes pueden cambiar estado
      allow update: if (isOwner(resource.data.clientId) && 
        // Cliente puede cancelar
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt']) &&
        request.resource.data.status in ['cancelled'] &&
        resource.data.status in ['pending', 'confirmed']) ||
        (isOwner(resource.data.professionalId) && 
        // Profesional puede confirmar/completar/cancelar
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt']) &&
        request.resource.data.status in ['confirmed', 'completed', 'cancelled'] &&
        resource.data.status in ['pending', 'confirmed']) ||
        // Admin puede cualquier cambio
        isAdmin();
      
      // Eliminación: solo admin
      allow delete: if isAdmin();
    }
    
    // ======================
    // REVIEWS AND RATINGS
    // ======================
    
    match /reviews/{reviewId} {
      // Lectura: público para reviews aprobadas, propietario/profesional/admin para todas
      allow read: if resource.data.status == 'approved' || 
        isOwner(resource.data.clientId) || 
        isOwner(resource.data.professionalId) || 
        isModerator();
      
      // Creación: solo cliente que tuvo servicio completado
      allow create: if isAuthenticated() && 
        isActiveUser() &&
        request.resource.data.clientId == request.auth.uid &&
        hasValidStructure(['clientId', 'professionalId', 'bookingId', 'rating', 'comment', 'status', 'createdAt']) &&
        request.resource.data.rating is int &&
        request.resource.data.rating >= 1 &&
        request.resource.data.rating <= 5 &&
        isValidTextLength(request.resource.data.comment, 500) &&
        request.resource.data.status == 'pending' &&
        // Verificar que existe booking completado
        exists(/databases/$(database)/documents/bookings/$(request.resource.data.bookingId)) &&
        get(/databases/$(database)/documents/bookings/$(request.resource.data.bookingId)).data.status == 'completed' &&
        isValidTimestamp(request.resource.data.createdAt);
      
      // Actualización: solo moderadores pueden aprobar/rechazar
      allow update: if isModerator() && 
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'moderationNotes', 'updatedAt']) &&
        request.resource.data.status in ['approved', 'rejected'];
      
      // Eliminación: propietario o admin
      allow delete: if isOwner(resource.data.clientId) || isAdmin();
    }
    
    // ======================
    // MESSAGING SYSTEM
    // ======================
    
    match /conversations/{conversationId} {
      // Lectura: participantes de la conversación
      allow read: if isAuthenticated() && 
        request.auth.uid in resource.data.participants;
      
      // Creación: usuarios autenticados
      allow create: if isAuthenticated() && 
        isActiveUser() &&
        request.auth.uid in request.resource.data.participants &&
        hasValidStructure(['participants', 'type', 'createdAt', 'updatedAt']) &&
        request.resource.data.participants.size() == 2 &&
        request.resource.data.type in ['booking', 'support'] &&
        isValidTimestamp(request.resource.data.createdAt);
      
      // Actualización: participantes pueden actualizar lastMessage
      allow update: if isAuthenticated() && 
        request.auth.uid in resource.data.participants &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['lastMessage', 'updatedAt']);
    }
    
    match /conversations/{conversationId}/messages/{messageId} {
      // Lectura: participantes de la conversación
      allow read: if isAuthenticated() && 
        request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants;
      
      // Creación: participantes pueden enviar mensajes
      allow create: if isAuthenticated() && 
        isActiveUser() &&
        request.resource.data.senderId == request.auth.uid &&
        request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants &&
        hasValidStructure(['senderId', 'content', 'type', 'timestamp']) &&
        isValidTextLength(request.resource.data.content, 1000) &&
        request.resource.data.type in ['text', 'image', 'file'] &&
        isValidTimestamp(request.resource.data.timestamp);
      
      // Sin actualización ni eliminación de mensajes
      allow update, delete: if false;
    }
    
    // ======================
    // CONTENT REPORTS
    // ======================
    
    match /content_reports/{reportId} {
      // Lectura: reportero o moderadores
      allow read: if isOwner(resource.data.reporterId) || isModerator();
      
      // Creación: usuarios autenticados
      allow create: if isAuthenticated() && 
        isActiveUser() &&
        request.resource.data.reporterId == request.auth.uid &&
        hasValidStructure(['reporterId', 'contentType', 'contentId', 'category', 'description', 'status', 'createdAt']) &&
        request.resource.data.contentType in ['profile', 'review', 'message', 'image'] &&
        request.resource.data.category in ['inappropriate', 'spam', 'fake', 'harassment', 'other'] &&
        isValidTextLength(request.resource.data.description, 500) &&
        request.resource.data.status == 'pending' &&
        isValidTimestamp(request.resource.data.createdAt);
      
      // Actualización: solo moderadores
      allow update: if isModerator() && 
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'resolution', 'resolvedAt', 'resolvedBy']) &&
        request.resource.data.status in ['resolved', 'dismissed'];
      
      // Eliminación: solo admin
      allow delete: if isAdmin();
    }
    
    // ======================
    // ADMIN OPERATIONS
    // ======================
    
    match /platform_config/{configId} {
      // Lectura: solo admin
      allow read: if isAdmin();
      
      // Escritura: solo admin
      allow write: if isAdmin();
    }
    
    match /config_backups/{backupId} {
      // Lectura: solo admin
      allow read: if isAdmin();
      
      // Creación: solo admin
      allow create: if isAdmin();
      
      // Sin actualización ni eliminación
      allow update, delete: if false;
    }
    
    match /moderation_log/{logId} {
      // Lectura: solo moderadores
      allow read: if isModerator();
      
      // Creación: solo moderadores
      allow create: if isModerator();
      
      // Sin actualización ni eliminación
      allow update, delete: if false;
    }
    
    match /analytics/{analyticsId} {
      // Solo admin puede leer analytics
      allow read: if isAdmin();
      
      // Sistema puede escribir analytics
      allow write: if false; // Solo funciones del servidor
    }
    
    // ======================
    // NOTIFICATION SYSTEM
    // ======================
    
    match /notifications/{notificationId} {
      // Lectura: destinatario de la notificación
      allow read: if isOwner(resource.data.userId);
      
      // Creación: sistema (funciones) o admin
      allow create: if isAdmin(); // En producción, solo Cloud Functions
      
      // Actualización: destinatario puede marcar como leída
      allow update: if isOwner(resource.data.userId) && 
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read', 'readAt']) &&
        request.resource.data.read == true;
      
      // Eliminación: destinatario o admin
      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // ======================
    // FINANCIAL RECORDS
    // ======================
    
    match /transactions/{transactionId} {
      // Lectura: propietario de la transacción o admin
      allow read: if isOwner(resource.data.userId) || isAdmin();
      
      // Solo sistema puede crear/actualizar transacciones
      allow create, update: if isAdmin(); // En producción, solo Cloud Functions
      
      // Sin eliminación
      allow delete: if false;
    }
    
    match /payouts/{payoutId} {
      // Lectura: profesional propietario o admin
      allow read: if isOwner(resource.data.professionalId) || isAdmin();
      
      // Solo admin puede gestionar payouts
      allow write: if isAdmin();
    }
    
    // ======================
    // RATE LIMITING
    // ======================
    
    // Función para verificar rate limiting (simulado)
    function checkRateLimit(collection, maxOperations) {
      return true; // En producción, implementar con Cloud Functions
    }
    
    // ======================
    // GLOBAL RESTRICTIONS
    // ======================
    
    // Denegar acceso a cualquier otra colección no especificada
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Firebase Storage Security Rules
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // ======================
    // UTILITY FUNCTIONS
    // ======================
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return request.auth.token.role == role;
    }
    
    function isAdmin() {
      return hasRole('admin');
    }
    
    function isModerator() {
      return hasRole('admin') || hasRole('moderator');
    }
    
    function isValidImageType() {
      return resource.contentType.matches('image/.*');
    }
    
    function isValidFileSize(maxSizeBytes) {
      return resource.size <= maxSizeBytes;
    }
    
    function isValidFileName() {
      return resource.name.size() <= 100 && 
        !resource.name.matches('.*[<>:"/\\|?*].*'); // Sin caracteres especiales
    }
    
    // ======================
    // USER AVATARS
    // ======================
    
    match /avatars/{userId}/{fileName} {
      // Lectura: cualquier usuario autenticado puede ver avatars
      allow read: if isAuthenticated();
      
      // Escritura: solo el propietario
      allow write: if isOwner(userId) && 
        isValidImageType() &&
        isValidFileSize(5 * 1024 * 1024) && // 5MB máximo
        isValidFileName();
    }
    
    // ======================
    // PROFESSIONAL PORTFOLIOS
    // ======================
    
    match /portfolios/{professionalId}/{fileName} {
      // Lectura: público
      allow read: if true;
      
      // Escritura: solo el profesional propietario
      allow write: if isOwner(professionalId) && 
        isValidImageType() &&
        isValidFileSize(10 * 1024 * 1024) && // 10MB máximo
        isValidFileName();
    }
    
    // ======================
    // BUSINESS DOCUMENTS
    // ======================
    
    match /documents/{professionalId}/{fileName} {
      // Lectura: propietario y moderadores
      allow read: if isOwner(professionalId) || isModerator();
      
      // Escritura: solo el profesional propietario
      allow write: if isOwner(professionalId) && 
        (isValidImageType() || 
         resource.contentType == 'application/pdf') &&
        isValidFileSize(20 * 1024 * 1024) && // 20MB máximo
        isValidFileName();
    }
    
    // ======================
    // MESSAGE ATTACHMENTS
    // ======================
    
    match /messages/{conversationId}/{messageId}/{fileName} {
      // Lectura: participantes de la conversación
      allow read: if isAuthenticated(); // Verificar participación en reglas de aplicación
      
      // Escritura: participantes autenticados
      allow write: if isAuthenticated() && 
        (isValidImageType() || 
         resource.contentType.matches('application/.*') ||
         resource.contentType.matches('text/.*')) &&
        isValidFileSize(50 * 1024 * 1024) && // 50MB máximo
        isValidFileName();
    }
    
    // ======================
    // PLATFORM ASSETS
    // ======================
    
    match /platform/{assetType}/{fileName} {
      // Lectura: público para logos y assets de la plataforma
      allow read: if true;
      
      // Escritura: solo admin
      allow write: if isAdmin() && 
        isValidImageType() &&
        isValidFileSize(10 * 1024 * 1024) && // 10MB máximo
        isValidFileName();
    }
    
    // ======================
    // TEMPORARY UPLOADS
    // ======================
    
    match /temp/{userId}/{fileName} {
      // Lectura y escritura: solo el propietario, archivos temporales
      allow read, write: if isOwner(userId) && 
        isValidFileSize(100 * 1024 * 1024) && // 100MB máximo temporal
        isValidFileName();
    }
    
    // ======================
    // BACKUPS (Admin only)
    // ======================
    
    match /backups/{backupId}/{fileName} {
      // Solo admin puede gestionar backups
      allow read, write: if isAdmin();
    }
    
    // ======================
    // MODERATION EVIDENCE
    // ======================
    
    match /reports/{reportId}/{fileName} {
      // Lectura: moderadores
      allow read: if isModerator();
      
      // Escritura: usuarios reportando
      allow write: if isAuthenticated() && 
        isValidImageType() &&
        isValidFileSize(20 * 1024 * 1024) && // 20MB máximo
        isValidFileName();
    }
    
    // ======================
    // GLOBAL RESTRICTIONS
    // ======================
    
    // Denegar acceso a cualquier otro path
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### Security Rules Testing
```javascript
// test/security-rules.test.js
import { 
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} from '@firebase/rules-unit-testing';

describe('Firestore Security Rules', () => {
  let testEnv;
  let alice, bob, admin, moderator;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'kalos-test',
      firestore: {
        rules: `
          // Incluir reglas completas aquí
        `
      }
    });

    alice = testEnv.authenticatedContext('alice', { role: 'user' });
    bob = testEnv.authenticatedContext('bob', { role: 'professional' });
    admin = testEnv.authenticatedContext('admin', { role: 'admin' });
    moderator = testEnv.authenticatedContext('moderator', { role: 'moderator' });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  describe('User Document Security', () => {
    test('User can read their own profile', async () => {
      await assertSucceeds(
        alice.firestore().collection('users').doc('alice').get()
      );
    });

    test('User cannot read other user profiles', async () => {
      await assertFails(
        alice.firestore().collection('users').doc('bob').get()
      );
    });

    test('Admin can read any user profile', async () => {
      await assertSucceeds(
        admin.firestore().collection('users').doc('alice').get()
      );
    });

    test('User can update their own profile with valid data', async () => {
      await assertSucceeds(
        alice.firestore().collection('users').doc('alice').update({
          name: 'Alice Updated',
          updatedAt: new Date()
        })
      );
    });

    test('User cannot update critical fields', async () => {
      await assertFails(
        alice.firestore().collection('users').doc('alice').update({
          role: 'admin'
        })
      );
    });
  });

  describe('Professional Profile Security', () => {
    test('Anyone can read approved professional profiles', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('professionals').doc('bob').set({
          status: 'approved',
          businessName: 'Bob Salon'
        });
      });

      await assertSucceeds(
        alice.firestore().collection('professionals').doc('bob').get()
      );
    });

    test('Users cannot read pending professional profiles', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('professionals').doc('charlie').set({
          status: 'pending',
          businessName: 'Charlie Salon'
        });
      });

      await assertFails(
        alice.firestore().collection('professionals').doc('charlie').get()
      );
    });

    test('Professional can create their own profile', async () => {
      await assertSucceeds(
        bob.firestore().collection('professionals').doc('bob').set({
          userId: 'bob',
          businessName: 'Bob Beauty Salon',
          description: 'Professional hair stylist',
          services: ['haircut', 'coloring'],
          location: { city: 'La Paz' },
          status: 'pending',
          createdAt: new Date()
        })
      );
    });

    test('Moderator can approve professional profile', async () => {
      await assertSucceeds(
        moderator.firestore().collection('professionals').doc('bob').update({
          status: 'approved',
          updatedAt: new Date()
        })
      );
    });
  });

  describe('Booking Security', () => {
    test('Client can create booking', async () => {
      await assertSucceeds(
        alice.firestore().collection('bookings').add({
          clientId: 'alice',
          professionalId: 'bob',
          serviceId: 'haircut',
          date: new Date(Date.now() + 86400000), // Tomorrow
          status: 'pending',
          amount: 100,
          createdAt: new Date()
        })
      );
    });

    test('User cannot create booking for others', async () => {
      await assertFails(
        alice.firestore().collection('bookings').add({
          clientId: 'bob', // Different user
          professionalId: 'alice',
          serviceId: 'haircut',
          date: new Date(Date.now() + 86400000),
          status: 'pending',
          amount: 100,
          createdAt: new Date()
        })
      );
    });

    test('User cannot create booking in the past', async () => {
      await assertFails(
        alice.firestore().collection('bookings').add({
          clientId: 'alice',
          professionalId: 'bob',
          serviceId: 'haircut',
          date: new Date(Date.now() - 86400000), // Yesterday
          status: 'pending',
          amount: 100,
          createdAt: new Date()
        })
      );
    });
  });

  describe('Review Security', () => {
    beforeEach(async () => {
      // Setup completed booking
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('bookings').doc('booking1').set({
          clientId: 'alice',
          professionalId: 'bob',
          status: 'completed'
        });
      });
    });

    test('Client can create review for completed booking', async () => {
      await assertSucceeds(
        alice.firestore().collection('reviews').add({
          clientId: 'alice',
          professionalId: 'bob',
          bookingId: 'booking1',
          rating: 5,
          comment: 'Great service!',
          status: 'pending',
          createdAt: new Date()
        })
      );
    });

    test('User cannot create review with invalid rating', async () => {
      await assertFails(
        alice.firestore().collection('reviews').add({
          clientId: 'alice',
          professionalId: 'bob',
          bookingId: 'booking1',
          rating: 6, // Invalid rating
          comment: 'Great service!',
          status: 'pending',
          createdAt: new Date()
        })
      );
    });

    test('Moderator can approve review', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('reviews').doc('review1').set({
          clientId: 'alice',
          status: 'pending'
        });
      });

      await assertSucceeds(
        moderator.firestore().collection('reviews').doc('review1').update({
          status: 'approved',
          updatedAt: new Date()
        })
      );
    });
  });

  describe('Admin Operations Security', () => {
    test('Admin can read platform config', async () => {
      await assertSucceeds(
        admin.firestore().collection('platform_config').doc('settings').get()
      );
    });

    test('Non-admin cannot read platform config', async () => {
      await assertFails(
        alice.firestore().collection('platform_config').doc('settings').get()
      );
    });

    test('Admin can update platform config', async () => {
      await assertSucceeds(
        admin.firestore().collection('platform_config').doc('settings').set({
          general: {
            platform: { name: 'Kalos Updated' }
          },
          updatedAt: new Date()
        })
      );
    });

    test('Non-admin cannot update platform config', async () => {
      await assertFails(
        alice.firestore().collection('platform_config').doc('settings').update({
          general: { platform: { name: 'Hacked' } }
        })
      );
    });
  });

  describe('Rate Limiting Tests', () => {
    test('User cannot create too many documents rapidly', async () => {
      // Simular múltiples operaciones rápidas
      const promises = Array(10).fill().map((_, i) => 
        alice.firestore().collection('content_reports').add({
          reporterId: 'alice',
          contentType: 'profile',
          contentId: `content${i}`,
          category: 'spam',
          description: 'Spam content',
          status: 'pending',
          createdAt: new Date()
        })
      );

      // Algunas deberían fallar debido a rate limiting
      const results = await Promise.allSettled(promises);
      const failures = results.filter(r => r.status === 'rejected');
      expect(failures.length).toBeGreaterThan(0);
    });
  });
});
```

### Security Monitoring Setup
```javascript
// src/admin/services/SecurityMonitorService.js
export class SecurityMonitorService {
  static securityAlerts = [];
  static anomalyThresholds = new Map();

  /**
   * Monitorear eventos de seguridad
   */
  static async monitorSecurityEvents() {
    try {
      // Configurar listeners para eventos sospechosos
      this.setupSecurityListeners();
      
      // Analizar patrones de acceso
      await this.analyzeAccessPatterns();
      
      // Detectar anomalías
      await this.detectAnomalies();
      
      // Generar reportes de seguridad
      await this.generateSecurityReports();

    } catch (error) {
      console.error('Error monitoring security events:', error);
    }
  }

  static setupSecurityListeners() {
    // Listener para intentos de acceso no autorizado
    db.collection('security_log').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const logEntry = change.doc.data();
          this.processSecurityEvent(logEntry);
        }
      });
    });
  }

  static async processSecurityEvent(event) {
    // Analizar evento de seguridad
    const severity = this.calculateEventSeverity(event);
    
    if (severity >= 7) {
      // Evento crítico - alertar inmediatamente
      await this.triggerSecurityAlert(event, severity);
    }
    
    // Registrar en analytics
    await this.recordSecurityMetric(event, severity);
  }

  static calculateEventSeverity(event) {
    let severity = 1;
    
    // Factores que aumentan severidad
    if (event.type === 'unauthorized_access') severity += 3;
    if (event.type === 'data_breach_attempt') severity += 5;
    if (event.type === 'role_escalation') severity += 4;
    if (event.frequency > 10) severity += 2; // Múltiples intentos
    if (event.targetResource === 'admin') severity += 3;
    
    return Math.min(severity, 10);
  }

  static async triggerSecurityAlert(event, severity) {
    const alert = {
      type: 'security_incident',
      severity,
      event,
      timestamp: Date.now(),
      status: 'open'
    };

    // Guardar alerta
    await db.collection('security_alerts').add(alert);
    
    // Notificar administradores
    await this.notifyAdmins(alert);
    
    // Si es muy crítico, bloquear automáticamente
    if (severity >= 9) {
      await this.autoBlockThreat(event);
    }
  }

  static async generateSecurityReports() {
    const report = {
      generatedAt: Date.now(),
      period: 'daily',
      metrics: {
        totalSecurityEvents: await this.getSecurityEventCount(),
        highSeverityEvents: await this.getHighSeverityEventCount(),
        blockedAttacks: await this.getBlockedAttackCount(),
        vulnerabilitiesDetected: await this.getVulnerabilityCount()
      },
      recommendations: await this.generateSecurityRecommendations()
    };

    await db.collection('security_reports').add(report);
    return report;
  }
}
```

## 🧪 Testing

### Security Rules Testing
- [ ] Testing completo de reglas Firestore
- [ ] Testing de reglas Storage
- [ ] Testing de roles y permisos
- [ ] Testing de validación de datos
- [ ] Testing de rate limiting

### Penetration Testing
- [ ] Testing de autenticación bypass
- [ ] Testing de autorización bypass
- [ ] Testing de inyección de datos
- [ ] Testing de escalación de privilegios
- [ ] Testing de ataques de fuerza bruta

## 🚀 Deployment

### Security Rules Deployment
- Deploy de reglas a Firebase Production
- Validación en ambiente de staging
- Monitoreo post-deployment

### Security Monitoring Setup
- Configuración de alertas de seguridad
- Dashboard de métricas de seguridad
- Logs de auditoría automatizados

## 📦 Dependencies
- Firebase Firestore Security Rules
- Firebase Storage Security Rules
- Firebase Auth Custom Claims
- Security Monitoring Tools

## 🔗 Relaciones
- **Protege**: Toda la aplicación y datos
- **Depende de**: Firebase Auth roles
- **Integra con**: fase6-0028-content-moderation

---

**Estado**: 🟡 Pendiente  
**Prioridad**: Crítica  
**Estimación**: 16 horas  
**Asignado**: Senior DevOps/Security Engineer  

**Sprint**: Sprint 6 - Administración  
**Deadline**: 7 octubre 2025