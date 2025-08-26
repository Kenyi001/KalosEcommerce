# Ticket Fase 5-0011: Sistema de Mensajería

## 📋 Descripción
Implementar sistema de mensajería en tiempo real para facilitar comunicación directa entre clientes y profesionales de belleza, incluyendo chat, intercambio de imágenes, confirmaciones de servicio y coordinación de citas.

## 🎯 Objetivos
- Chat en tiempo real entre usuarios
- Intercambio de archivos e imágenes
- Historial completo de conversaciones
- Estados de mensaje (enviado, entregado, leído)
- Notificaciones de mensajes nuevos
- Búsqueda en conversaciones
- Moderación y reportes

## 📊 Criterios de Aceptación

### ✅ Funcionalidades Core
- [ ] Envío de mensajes de texto en tiempo real
- [ ] Compartir imágenes (antes/después, referencias)
- [ ] Estados de mensaje (enviado/entregado/leído)
- [ ] Typing indicators
- [ ] Historial completo de conversaciones
- [ ] Búsqueda en mensajes

### ✅ Gestión de Conversaciones
- [ ] Lista de conversaciones activas
- [ ] Crear nueva conversación
- [ ] Archivar conversaciones
- [ ] Eliminar conversaciones
- [ ] Marcar como no leído

### ✅ Moderación y Seguridad
- [ ] Reportar conversaciones abusivas
- [ ] Bloquear usuarios
- [ ] Filtro de contenido inapropiado
- [ ] Backup de conversaciones importantes

### ✅ Integración con Reservas
- [ ] Mensajes automáticos de confirmación
- [ ] Coordinación de detalles de servicio
- [ ] Compartir ubicación para servicios a domicilio
- [ ] Follow-up post-servicio

## 🔧 Implementación Técnica

### Messaging System Architecture
```
src/
├── components/
│   └── messaging/
│       ├── ChatWindow.js               # Ventana principal de chat
│       ├── ConversationList.js         # Lista de conversaciones
│       ├── MessageComposer.js          # Composer de mensajes
│       ├── MessageBubble.js            # Burbuja individual de mensaje
│       ├── ImageViewer.js              # Visor de imágenes
│       ├── FileUploader.js             # Subida de archivos
│       └── TypingIndicator.js          # Indicador de escritura
├── services/
│   ├── MessagingService.js             # Servicio principal
│   ├── FileService.js                  # Gestión de archivos
│   ├── ModerationService.js            # Moderación automática
│   └── ConversationService.js          # Gestión de conversaciones
├── models/
│   ├── Message.js                      # Modelo de mensaje
│   ├── Conversation.js                 # Modelo de conversación
│   └── MessageAttachment.js            # Modelo de adjuntos
└── utils/
    ├── messageHelpers.js               # Utilidades de mensajes
    ├── encryptionHelpers.js            # Encriptación básica
    └── moderationHelpers.js            # Utilidades de moderación
```

### Message Model
```javascript
// src/models/Message.js
export class Message {
  constructor(data = {}) {
    this.id = data.id || null;
    this.conversationId = data.conversationId || null;
    this.senderId = data.senderId || null;
    this.receiverId = data.receiverId || null;
    
    // Content
    this.type = data.type || 'text'; // text, image, file, system, booking_update
    this.content = data.content || '';
    this.metadata = data.metadata || {};
    
    // Attachments
    this.attachments = data.attachments || []; // URLs, file info
    this.hasAttachments = data.hasAttachments || false;
    
    // Status
    this.status = data.status || 'sent'; // sent, delivered, read, failed
    this.deliveredAt = data.deliveredAt || null;
    this.readAt = data.readAt || null;
    
    // Reply/Thread
    this.replyToMessageId = data.replyToMessageId || null;
    this.replyToContent = data.replyToContent || null;
    
    // Moderation
    this.isEdited = data.isEdited || false;
    this.editedAt = data.editedAt || null;
    this.isDeleted = data.isDeleted || false;
    this.deletedAt = data.deletedAt || null;
    this.flagged = data.flagged || false;
    this.flagReason = data.flagReason || null;
    
    // Timestamps
    this.createdAt = data.createdAt || Date.now();
    this.updatedAt = data.updatedAt || Date.now();
    
    // Client-side temporary fields
    this.tempId = data.tempId || null; // Para optimistic updates
    this.sending = data.sending || false;
    this.failed = data.failed || false;
  }

  /**
   * Validar datos del mensaje
   */
  validate() {
    const errors = [];
    
    if (!this.conversationId) errors.push('ID de conversación requerido');
    if (!this.senderId) errors.push('ID de remitente requerido');
    if (!this.receiverId) errors.push('ID de destinatario requerido');
    if (!this.content && !this.hasAttachments) {
      errors.push('Contenido o adjuntos requeridos');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Verificar si el mensaje es del usuario actual
   */
  isFromCurrentUser(currentUserId) {
    return this.senderId === currentUserId;
  }

  /**
   * Verificar si el mensaje ha sido leído
   */
  isRead() {
    return this.status === 'read' && this.readAt !== null;
  }

  /**
   * Marcar como leído
   */
  markAsRead() {
    if (this.status !== 'read') {
      this.status = 'read';
      this.readAt = Date.now();
      this.updatedAt = Date.now();
    }
  }

  /**
   * Obtener preview del contenido
   */
  getPreview(maxLength = 50) {
    if (this.type === 'image') {
      return '📷 Imagen';
    } else if (this.type === 'file') {
      return '📎 Archivo';
    } else if (this.type === 'system') {
      return this.content;
    } else {
      return this.content.length > maxLength 
        ? this.content.substring(0, maxLength) + '...'
        : this.content;
    }
  }

  /**
   * Formatear timestamp para mostrar
   */
  getFormattedTime() {
    const date = new Date(this.createdAt);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      const minutes = Math.floor(diffMs / (1000 * 60));
      return minutes === 0 ? 'Ahora' : `${minutes}m`;
    } else if (diffDays < 1) {
      return date.toLocaleTimeString('es-BO', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('es-BO', { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  }

  /**
   * Convertir a formato para Firestore
   */
  toFirestore() {
    return {
      conversationId: this.conversationId,
      senderId: this.senderId,
      receiverId: this.receiverId,
      type: this.type,
      content: this.content,
      metadata: this.metadata,
      attachments: this.attachments,
      hasAttachments: this.hasAttachments,
      status: this.status,
      deliveredAt: this.deliveredAt,
      readAt: this.readAt,
      replyToMessageId: this.replyToMessageId,
      replyToContent: this.replyToContent,
      isEdited: this.isEdited,
      editedAt: this.editedAt,
      isDeleted: this.isDeleted,
      deletedAt: this.deletedAt,
      flagged: this.flagged,
      flagReason: this.flagReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crear desde datos de Firestore
   */
  static fromFirestore(doc) {
    return new Message({
      id: doc.id,
      ...doc.data()
    });
  }
}
```

### Conversation Model
```javascript
// src/models/Conversation.js
export class Conversation {
  constructor(data = {}) {
    this.id = data.id || null;
    this.participants = data.participants || []; // Array de user IDs
    this.type = data.type || 'direct'; // direct, group, support
    
    // Metadata
    this.title = data.title || null; // Para grupos
    this.avatar = data.avatar || null;
    this.description = data.description || null;
    
    // Last message info
    this.lastMessage = data.lastMessage || null;
    this.lastMessageAt = data.lastMessageAt || null;
    this.lastMessageBy = data.lastMessageBy || null;
    
    // Unread counts per participant
    this.unreadCounts = data.unreadCounts || {};
    
    // Status
    this.isActive = data.isActive || true;
    this.isArchived = data.isArchived || false;
    this.archivedBy = data.archivedBy || [];
    
    // Booking context (opcional)
    this.bookingId = data.bookingId || null;
    this.serviceContext = data.serviceContext || null;
    
    // Settings
    this.mutedBy = data.mutedBy || [];
    this.pinnedBy = data.pinnedBy || [];
    
    this.createdAt = data.createdAt || Date.now();
    this.updatedAt = data.updatedAt || Date.now();
  }

  /**
   * Obtener el otro participante (para conversaciones directas)
   */
  getOtherParticipant(currentUserId) {
    return this.participants.find(p => p !== currentUserId);
  }

  /**
   * Verificar si el usuario está en la conversación
   */
  hasParticipant(userId) {
    return this.participants.includes(userId);
  }

  /**
   * Obtener count de mensajes no leídos para un usuario
   */
  getUnreadCount(userId) {
    return this.unreadCounts[userId] || 0;
  }

  /**
   * Verificar si está archivada para un usuario
   */
  isArchivedFor(userId) {
    return this.archivedBy.includes(userId);
  }

  /**
   * Verificar si está silenciada para un usuario
   */
  isMutedFor(userId) {
    return this.mutedBy.includes(userId);
  }

  /**
   * Verificar si está fijada para un usuario
   */
  isPinnedFor(userId) {
    return this.pinnedBy.includes(userId);
  }

  /**
   * Generar ID único para conversación directa
   */
  static generateDirectConversationId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return `direct_${sortedIds[0]}_${sortedIds[1]}`;
  }

  /**
   * Convertir a formato para Firestore
   */
  toFirestore() {
    return {
      participants: this.participants,
      type: this.type,
      title: this.title,
      avatar: this.avatar,
      description: this.description,
      lastMessage: this.lastMessage,
      lastMessageAt: this.lastMessageAt,
      lastMessageBy: this.lastMessageBy,
      unreadCounts: this.unreadCounts,
      isActive: this.isActive,
      isArchived: this.isArchived,
      archivedBy: this.archivedBy,
      bookingId: this.bookingId,
      serviceContext: this.serviceContext,
      mutedBy: this.mutedBy,
      pinnedBy: this.pinnedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crear desde datos de Firestore
   */
  static fromFirestore(doc) {
    return new Conversation({
      id: doc.id,
      ...doc.data()
    });
  }
}
```

### MessagingService Implementation
```javascript
// src/services/MessagingService.js
export class MessagingService {
  static messageCache = new Map();
  static conversationCache = new Map();
  static listeners = [];
  static typingTimeouts = new Map();

  /**
   * Enviar mensaje
   */
  static async sendMessage(messageData) {
    try {
      const message = new Message(messageData);
      
      // Validar datos
      const validation = message.validate();
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }

      // Verificar si la conversación existe
      let conversation = await this.getOrCreateConversation(
        message.senderId, 
        message.receiverId,
        messageData.conversationId
      );

      message.conversationId = conversation.id;

      // Moderar contenido
      const moderationResult = await ModerationService.moderateContent(message.content);
      if (moderationResult.flagged) {
        message.flagged = true;
        message.flagReason = moderationResult.reason;
      }

      // Optimistic update (mostrar mensaje inmediatamente)
      message.tempId = `temp_${Date.now()}`;
      message.sending = true;
      
      // Trigger update inmediato en UI
      this.triggerOptimisticUpdate(message);

      // Enviar a Firestore
      const docRef = await db.collection('messages').add(message.toFirestore());
      message.id = docRef.id;
      message.sending = false;
      message.tempId = null;

      // Actualizar conversación
      await this.updateConversationLastMessage(conversation.id, message);

      // Incrementar contador de no leídos
      await this.incrementUnreadCount(conversation.id, message.receiverId);

      // Enviar notificación
      await NotificationService.sendNewMessage(
        message.senderId, 
        message.receiverId, 
        message
      );

      // Trigger update final
      this.triggerMessageUpdate(message);

      return {
        success: true,
        message,
        conversationId: conversation.id
      };

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Marcar mensaje como fallido
      if (messageData.tempId) {
        this.triggerMessageFailed(messageData.tempId);
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener o crear conversación
   */
  static async getOrCreateConversation(userId1, userId2, existingConversationId = null) {
    try {
      // Si ya existe ID de conversación, usarlo
      if (existingConversationId) {
        const conversation = await this.getConversationById(existingConversationId);
        if (conversation) return conversation;
      }

      // Buscar conversación directa existente
      const directConversationId = Conversation.generateDirectConversationId(userId1, userId2);
      let conversation = await this.getConversationById(directConversationId);
      
      if (conversation) {
        return conversation;
      }

      // Crear nueva conversación
      const newConversation = new Conversation({
        id: directConversationId,
        participants: [userId1, userId2],
        type: 'direct',
        unreadCounts: {
          [userId1]: 0,
          [userId2]: 0
        }
      });

      await db.collection('conversations').doc(directConversationId).set(
        newConversation.toFirestore()
      );

      return newConversation;

    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      throw error;
    }
  }

  /**
   * Obtener mensajes de una conversación
   */
  static async getMessages(conversationId, options = {}) {
    try {
      let query = db.collection('messages')
        .where('conversationId', '==', conversationId)
        .where('isDeleted', '==', false);

      // Filtros opcionales
      if (options.before) {
        query = query.where('createdAt', '<', options.before);
      }

      if (options.after) {
        query = query.where('createdAt', '>', options.after);
      }

      // Ordenamiento y límite
      query = query.orderBy('createdAt', 'desc');
      
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      const messages = snapshot.docs.map(doc => Message.fromFirestore(doc));

      // Ordenar cronológicamente
      return messages.reverse();

    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  /**
   * Obtener conversaciones de un usuario
   */
  static async getUserConversations(userId, options = {}) {
    try {
      let query = db.collection('conversations')
        .where('participants', 'array-contains', userId);

      if (!options.includeArchived) {
        query = query.where('archivedBy', 'not-in', [userId]);
      }

      query = query.orderBy('lastMessageAt', 'desc');

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      const conversations = snapshot.docs.map(doc => Conversation.fromFirestore(doc));

      // Enriquecer con datos de otros participantes
      for (const conversation of conversations) {
        if (conversation.type === 'direct') {
          const otherUserId = conversation.getOtherParticipant(userId);
          const otherUser = await this.getUserData(otherUserId);
          conversation.otherUser = otherUser;
        }
      }

      return conversations;

    } catch (error) {
      console.error('Error getting user conversations:', error);
      return [];
    }
  }

  /**
   * Marcar mensajes como leídos
   */
  static async markMessagesAsRead(conversationId, userId) {
    try {
      // Obtener mensajes no leídos
      const unreadMessages = await db.collection('messages')
        .where('conversationId', '==', conversationId)
        .where('receiverId', '==', userId)
        .where('status', '!=', 'read')
        .get();

      if (unreadMessages.empty) return { success: true, count: 0 };

      // Actualizar en lote
      const batch = db.batch();
      const now = Date.now();

      unreadMessages.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'read',
          readAt: now,
          updatedAt: now
        });
      });

      await batch.commit();

      // Resetear contador de no leídos
      await this.resetUnreadCount(conversationId, userId);

      // Trigger update en tiempo real
      this.triggerReadStatusUpdate(conversationId, userId, unreadMessages.docs.length);

      return { 
        success: true, 
        count: unreadMessages.docs.length 
      };

    } catch (error) {
      console.error('Error marking messages as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar en mensajes
   */
  static async searchMessages(userId, query, options = {}) {
    try {
      // Obtener conversaciones del usuario
      const conversations = await this.getUserConversations(userId);
      const conversationIds = conversations.map(c => c.id);

      if (!conversationIds.length) return [];

      // Buscar en el contenido de mensajes
      // Nota: Firestore no tiene full-text search nativo
      // Esto sería más eficiente con Algolia o similar
      const searchResults = [];
      
      for (const conversationId of conversationIds) {
        const messages = await db.collection('messages')
          .where('conversationId', '==', conversationId)
          .where('isDeleted', '==', false)
          .orderBy('createdAt', 'desc')
          .limit(100) // Buscar en los últimos 100 mensajes
          .get();

        messages.docs.forEach(doc => {
          const message = Message.fromFirestore(doc);
          if (message.content.toLowerCase().includes(query.toLowerCase())) {
            searchResults.push({
              message,
              conversationId: message.conversationId
            });
          }
        });
      }

      // Ordenar por relevancia/fecha
      return searchResults.sort((a, b) => b.message.createdAt - a.message.createdAt);

    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }

  /**
   * Subir archivo/imagen
   */
  static async uploadAttachment(file, conversationId) {
    try {
      // Validar archivo
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Archivo muy grande (máximo 10MB)');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no permitido');
      }

      // Subir a Firebase Storage
      const fileName = `messages/${conversationId}/${Date.now()}_${file.name}`;
      const storageRef = storage.ref(fileName);
      
      const uploadTask = storageRef.put(file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Progress callback
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload progress:', progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            // Success callback
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            
            const attachment = {
              id: `att_${Date.now()}`,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              url: downloadURL,
              uploadedAt: Date.now()
            };

            resolve(attachment);
          }
        );
      });

    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  }

  /**
   * Eliminar mensaje
   */
  static async deleteMessage(messageId, userId) {
    try {
      const messageRef = db.collection('messages').doc(messageId);
      const message = await messageRef.get();
      
      if (!message.exists) {
        throw new Error('Mensaje no encontrado');
      }

      const messageData = message.data();
      
      // Verificar permisos (solo el remitente puede eliminar)
      if (messageData.senderId !== userId) {
        throw new Error('No tienes permisos para eliminar este mensaje');
      }

      // Soft delete
      await messageRef.update({
        isDeleted: true,
        deletedAt: Date.now(),
        content: '', // Limpiar contenido
        attachments: [], // Limpiar adjuntos
        updatedAt: Date.now()
      });

      // Trigger update
      this.triggerMessageDeleted(messageId);

      return { success: true };

    } catch (error) {
      console.error('Error deleting message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reportar conversación
   */
  static async reportConversation(conversationId, reporterId, reason, details = '') {
    try {
      const report = {
        conversationId,
        reporterId,
        reason, // spam, harassment, inappropriate, other
        details,
        status: 'pending', // pending, reviewed, resolved
        createdAt: Date.now()
      };

      await db.collection('conversation_reports').add(report);

      return { success: true };

    } catch (error) {
      console.error('Error reporting conversation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Bloquear usuario
   */
  static async blockUser(blockerId, blockedUserId) {
    try {
      const blockRef = db.collection('user_blocks').doc(`${blockerId}_${blockedUserId}`);
      
      await blockRef.set({
        blockerId,
        blockedUserId,
        blockedAt: Date.now()
      });

      // Archivar conversación existente
      const conversationId = Conversation.generateDirectConversationId(blockerId, blockedUserId);
      await this.archiveConversation(conversationId, blockerId);

      return { success: true };

    } catch (error) {
      console.error('Error blocking user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verificar si un usuario está bloqueado
   */
  static async isUserBlocked(userId1, userId2) {
    try {
      const blockDoc1 = await db.collection('user_blocks').doc(`${userId1}_${userId2}`).get();
      const blockDoc2 = await db.collection('user_blocks').doc(`${userId2}_${userId1}`).get();
      
      return blockDoc1.exists || blockDoc2.exists;

    } catch (error) {
      console.error('Error checking if user is blocked:', error);
      return false;
    }
  }

  /**
   * Indicar que el usuario está escribiendo
   */
  static async sendTypingIndicator(conversationId, userId) {
    try {
      // Actualizar indicador de escritura
      await db.collection('typing_indicators').doc(conversationId).set({
        [userId]: Date.now()
      }, { merge: true });

      // Programar limpieza automática después de 3 segundos
      if (this.typingTimeouts.has(`${conversationId}_${userId}`)) {
        clearTimeout(this.typingTimeouts.get(`${conversationId}_${userId}`));
      }

      const timeout = setTimeout(async () => {
        await this.clearTypingIndicator(conversationId, userId);
      }, 3000);

      this.typingTimeouts.set(`${conversationId}_${userId}`, timeout);

    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }

  /**
   * Limpiar indicador de escritura
   */
  static async clearTypingIndicator(conversationId, userId) {
    try {
      await db.collection('typing_indicators').doc(conversationId).update({
        [userId]: null
      });

      // Limpiar timeout
      const timeoutKey = `${conversationId}_${userId}`;
      if (this.typingTimeouts.has(timeoutKey)) {
        clearTimeout(this.typingTimeouts.get(timeoutKey));
        this.typingTimeouts.delete(timeoutKey);
      }

    } catch (error) {
      console.error('Error clearing typing indicator:', error);
    }
  }

  /**
   * Escuchar mensajes en tiempo real
   */
  static listenToMessages(conversationId, callback) {
    const unsubscribe = db.collection('messages')
      .where('conversationId', '==', conversationId)
      .where('isDeleted', '==', false)
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        (snapshot) => {
          const messages = snapshot.docs.map(doc => Message.fromFirestore(doc));
          callback(messages);
        },
        (error) => {
          console.error('Error listening to messages:', error);
        }
      );

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Escuchar conversaciones en tiempo real
   */
  static listenToConversations(userId, callback) {
    const unsubscribe = db.collection('conversations')
      .where('participants', 'array-contains', userId)
      .orderBy('lastMessageAt', 'desc')
      .onSnapshot(
        async (snapshot) => {
          const conversations = snapshot.docs.map(doc => Conversation.fromFirestore(doc));
          
          // Enriquecer con datos de usuarios
          for (const conversation of conversations) {
            if (conversation.type === 'direct') {
              const otherUserId = conversation.getOtherParticipant(userId);
              const otherUser = await this.getUserData(otherUserId);
              conversation.otherUser = otherUser;
            }
          }
          
          callback(conversations);
        },
        (error) => {
          console.error('Error listening to conversations:', error);
        }
      );

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Escuchar indicadores de escritura
   */
  static listenToTypingIndicators(conversationId, callback) {
    const unsubscribe = db.collection('typing_indicators').doc(conversationId)
      .onSnapshot(
        (doc) => {
          const data = doc.data() || {};
          const activeTypers = [];
          const now = Date.now();
          
          Object.entries(data).forEach(([userId, timestamp]) => {
            if (timestamp && (now - timestamp) < 5000) { // 5 segundos de tolerancia
              activeTypers.push(userId);
            }
          });
          
          callback(activeTypers);
        },
        (error) => {
          console.error('Error listening to typing indicators:', error);
        }
      );

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  // Métodos auxiliares privados
  static async getConversationById(conversationId) {
    try {
      const doc = await db.collection('conversations').doc(conversationId).get();
      return doc.exists ? Conversation.fromFirestore(doc) : null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  static async updateConversationLastMessage(conversationId, message) {
    try {
      await db.collection('conversations').doc(conversationId).update({
        lastMessage: message.getPreview(100),
        lastMessageAt: message.createdAt,
        lastMessageBy: message.senderId,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating conversation last message:', error);
    }
  }

  static async incrementUnreadCount(conversationId, userId) {
    try {
      await db.collection('conversations').doc(conversationId).update({
        [`unreadCounts.${userId}`]: firebase.firestore.FieldValue.increment(1)
      });
    } catch (error) {
      console.error('Error incrementing unread count:', error);
    }
  }

  static async resetUnreadCount(conversationId, userId) {
    try {
      await db.collection('conversations').doc(conversationId).update({
        [`unreadCounts.${userId}`]: 0
      });
    } catch (error) {
      console.error('Error resetting unread count:', error);
    }
  }

  static async getUserData(userId) {
    // Implementar obtención de datos de usuario
    try {
      const doc = await db.collection('users').doc(userId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static triggerOptimisticUpdate(message) {
    // Implementar trigger para updates optimistas en UI
    window.dispatchEvent(new CustomEvent('message_sending', { detail: message }));
  }

  static triggerMessageUpdate(message) {
    // Implementar trigger para updates de mensajes
    window.dispatchEvent(new CustomEvent('message_sent', { detail: message }));
  }

  static triggerMessageFailed(tempId) {
    // Implementar trigger para mensajes fallidos
    window.dispatchEvent(new CustomEvent('message_failed', { detail: { tempId } }));
  }

  static triggerMessageDeleted(messageId) {
    // Implementar trigger para mensajes eliminados
    window.dispatchEvent(new CustomEvent('message_deleted', { detail: { messageId } }));
  }

  static triggerReadStatusUpdate(conversationId, userId, count) {
    // Implementar trigger para updates de estado de lectura
    window.dispatchEvent(new CustomEvent('messages_read', { 
      detail: { conversationId, userId, count } 
    }));
  }
}
```

## 🧪 Testing

### Messaging Functionality Tests
- [ ] Envío de mensajes en tiempo real
- [ ] Estados de mensaje se actualizan correctamente
- [ ] Subida de archivos funciona
- [ ] Indicadores de escritura se muestran
- [ ] Búsqueda encuentra mensajes relevantes

### Real-time Features Tests
- [ ] Mensajes aparecen inmediatamente en ambos lados
- [ ] Contadores de no leídos son precisos
- [ ] Typing indicators funcionan correctamente
- [ ] Optimistic updates no causan duplicados

### Security & Moderation Tests
- [ ] Contenido inapropiado es filtrado
- [ ] Usuarios bloqueados no pueden enviar mensajes
- [ ] Reportes se guardan correctamente
- [ ] Archivos maliciosos son rechazados

## 🚀 Deployment

### Firestore Security Rules
```javascript
// Messages collection
match /messages/{messageId} {
  allow read: if request.auth != null && 
    (request.auth.uid in resource.data.participants || 
     request.auth.uid == resource.data.senderId || 
     request.auth.uid == resource.data.receiverId);
  
  allow create: if request.auth != null && 
    request.auth.uid == request.resource.data.senderId;
  
  allow update: if request.auth != null && 
    (request.auth.uid == resource.data.senderId || 
     request.auth.uid == resource.data.receiverId);
}

// Conversations collection
match /conversations/{conversationId} {
  allow read, write: if request.auth != null && 
    request.auth.uid in resource.data.participants;
}
```

### Storage Rules
```javascript
// Storage rules for message attachments
match /messages/{conversationId}/{fileName} {
  allow read, write: if request.auth != null;
  allow write: if request.resource.size < 10 * 1024 * 1024 && // 10MB limit
    request.resource.contentType.matches('image/.*') || 
    request.resource.contentType == 'application/pdf';
}
```

## 📦 Dependencies
- Firebase Firestore para mensajes en tiempo real
- Firebase Storage para archivos e imágenes
- NotificationService para alertas de mensajes
- ModerationService para filtrado de contenido

## 🔗 Relaciones
- **Integra con**: fase5-0010-notification-system
- **Usa**: fase3-0007-booking-system (contexto de reservas)
- **Mejora**: Comunicación cliente-profesional

---

**Estado**: 🟡 Pendiente  
**Prioridad**: Alta  
**Estimación**: 18 horas  
**Asignado**: Full Stack Developer  

**Sprint**: Sprint 5 - Comunicación  
**Deadline**: 23 septiembre 2025