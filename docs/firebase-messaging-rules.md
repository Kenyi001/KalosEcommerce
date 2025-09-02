# Reglas de Firestore para Sistema de Mensajería Temporal

## Configuración de Reglas de Seguridad

Agregar estas reglas a Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para mensajes temporales
    match /kalos_messages/{messageId} {
      allow read, write: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.recipientId == request.auth.uid ||
         resource.data.professionalId == request.auth.uid);
      
      // Auto-eliminar mensajes expirados
      allow delete: if request.auth != null && 
        resource.data.expiresAt < request.time;
    }
    
    // Reglas para conversaciones
    match /kalos_conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        (resource.data.customerId == request.auth.uid || 
         resource.data.professionalId == request.auth.uid);
      
      // Auto-eliminar conversaciones expiradas
      allow delete: if request.auth != null && 
        resource.data.expiresAt < request.time;
    }
    
    // Mantener reglas existentes para otros documentos
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## TTL (Time To Live) - Eliminación Automática

Firebase Firestore no tiene TTL nativo, pero usamos:

1. **Campo `expiresAt`**: Timestamp calculado (+8 días)
2. **Cleanup Client-Side**: Función que ejecuta cada 24h
3. **Cloud Function** (opcional): Para limpieza server-side

### Cloud Function para Cleanup (Opcional)

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Ejecutar diariamente a las 02:00
exports.cleanupExpiredMessages = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('America/La_Paz')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    // Limpiar mensajes expirados
    const expiredMessages = await db.collection('kalos_messages')
      .where('expiresAt', '<=', now)
      .get();
    
    const batch = db.batch();
    expiredMessages.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Limpiar conversaciones expiradas
    const expiredConversations = await db.collection('kalos_conversations')
      .where('expiresAt', '<=', now)
      .get();
    
    expiredConversations.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`Cleaned up ${expiredMessages.size} messages and ${expiredConversations.size} conversations`);
    return null;
  });
```

## Estructura de Datos

### Colección: `kalos_messages`
```javascript
{
  id: "msg_123",
  conversationId: "conv_prof123_cust456",
  senderId: "user_789",
  senderEmail: "user@example.com",
  message: "Hola, quisiera agendar una cita...",
  recipientType: "professional", // or "customer"
  timestamp: Timestamp,
  read: false,
  createdAt: Timestamp,
  expiresAt: Timestamp // +8 días
}
```

### Colección: `kalos_conversations`
```javascript
{
  id: "conv_prof123_cust456",
  professionalId: "prof_123",
  customerId: "cust_456",
  lastMessage: "Hola, quisiera...",
  lastMessageAt: Timestamp,
  unreadCount: {
    professional: 2,
    customer: 0
  },
  participantNames: {
    professional: "María González",
    customer: "Juan Pérez"
  },
  createdAt: Timestamp,
  expiresAt: Timestamp // +8 días
}
```

## Configuración en Firebase Console

1. **Firebase Console** → **Firestore Database** → **Rules**
2. Copiar las reglas de arriba
3. **Publicar** las reglas
4. Verificar que funcionen correctamente

## Monitoreo y Analytics

- Crear índices compuestos para queries complejas
- Monitorear uso en Firebase Console
- Configurar alertas para costos si es necesario

## Costos Estimados

- **Lecturas**: ~100 por conversación activa/día
- **Escrituras**: ~50 por conversación activa/día  
- **Eliminaciones**: Automáticas cada 8 días
- **Storage**: Mínimo (solo texto + timestamps)

**Estimado mensual**: <$5 USD para 100 conversaciones activas
