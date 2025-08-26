# Ticket Fase 5-0010: Sistema de Notificaciones

## 📋 Descripción
Implementar sistema integral de notificaciones para Kalos que cubra confirmaciones de reservas, recordatorios automáticos, actualizaciones de estado, marketing comunicacional y notificaciones push en tiempo real.

## 🎯 Objetivos
- Notificaciones push en tiempo real
- Email automático para confirmaciones
- SMS/WhatsApp para recordatorios críticos
- Notificaciones in-app personalizadas
- Sistema de preferencias granular
- Analytics de engagement
- Templates personalizables

## 📊 Criterios de Aceptación

### ✅ Tipos de Notificaciones
- [ ] Confirmación de reserva (inmediato)
- [ ] Recordatorio 24h antes de cita
- [ ] Recordatorio 2h antes de cita
- [ ] Cancelación/reprogramación de cita
- [ ] Nuevos mensajes en chat
- [ ] Promociones y ofertas
- [ ] Actualizaciones de perfil profesional

### ✅ Canales de Comunicación
- [ ] Push notifications (PWA)
- [ ] Notificaciones in-app
- [ ] Email transaccional
- [ ] SMS/WhatsApp Business API
- [ ] Notificaciones del navegador

### ✅ Configuración de Usuario
- [ ] Panel de preferencias granular
- [ ] Horarios de no molestar
- [ ] Frecuencia de notificaciones
- [ ] Opt-out por tipo de notificación
- [ ] Configuración por canal

### ✅ Automatización
- [ ] Triggers basados en eventos
- [ ] Colas de notificaciones programadas
- [ ] Retry logic para fallos
- [ ] Deduplicación de notificaciones
- [ ] Rate limiting

## 🔧 Implementación Técnica

### Notification System Architecture
```
src/
├── services/
│   └── notifications/
│       ├── NotificationService.js       # Servicio principal
│       ├── EmailService.js              # Emails transaccionales
│       ├── PushService.js               # Push notifications
│       ├── SMSService.js                # SMS y WhatsApp
│       ├── TemplateService.js           # Templates dinámicos
│       └── AnalyticsService.js          # Métricas
├── components/
│   └── notifications/
│       ├── NotificationCenter.js        # Centro de notificaciones
│       ├── NotificationPrefs.js         # Configuración usuario
│       ├── NotificationToast.js         # Toast notifications
│       └── NotificationBadge.js         # Badges de conteo
├── models/
│   ├── Notification.js                  # Modelo de notificación
│   ├── NotificationTemplate.js         # Templates
│   └── NotificationPreference.js       # Preferencias usuario
└── utils/
    ├── notificationHelpers.js           # Utilidades
    └── templateRenderer.js              # Renderizado dinámico
```

### Notification Model
```javascript
// src/models/Notification.js
export class Notification {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.type = data.type || null; // booking_confirmed, reminder_24h, message_received, etc.
    this.category = data.category || 'general'; // booking, message, promotion, system
    this.priority = data.priority || 'normal'; // low, normal, high, urgent
    
    // Content
    this.title = data.title || '';
    this.message = data.message || '';
    this.actionText = data.actionText || null;
    this.actionUrl = data.actionUrl || null;
    this.imageUrl = data.imageUrl || null;
    
    // Metadata
    this.data = data.data || {}; // Additional data for actions
    this.templateId = data.templateId || null;
    this.templateData = data.templateData || {};
    
    // Status
    this.status = data.status || 'pending'; // pending, sent, delivered, read, failed
    this.isRead = data.isRead || false;
    this.readAt = data.readAt || null;
    
    // Channels
    this.channels = data.channels || {
      push: true,
      email: false,
      sms: false,
      inApp: true
    };
    
    // Scheduling
    this.scheduledFor = data.scheduledFor || null; // Timestamp para envío programado
    this.sentAt = data.sentAt || null;
    this.deliveredAt = data.deliveredAt || null;
    
    // Retry logic
    this.retryCount = data.retryCount || 0;
    this.maxRetries = data.maxRetries || 3;
    this.lastRetryAt = data.lastRetryAt || null;
    
    // Analytics
    this.clickCount = data.clickCount || 0;
    this.lastClickedAt = data.lastClickedAt || null;
    
    this.createdAt = data.createdAt || Date.now();
    this.updatedAt = data.updatedAt || Date.now();
  }

  /**
   * Validar datos de la notificación
   */
  validate() {
    const errors = [];
    
    if (!this.userId) errors.push('Usuario requerido');
    if (!this.type) errors.push('Tipo de notificación requerido');
    if (!this.title && !this.templateId) errors.push('Título o template requerido');
    if (!this.message && !this.templateId) errors.push('Mensaje o template requerido');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Verificar si debe enviarse ahora
   */
  shouldSendNow() {
    if (this.status !== 'pending') return false;
    if (!this.scheduledFor) return true;
    return Date.now() >= this.scheduledFor;
  }

  /**
   * Verificar si puede reintentarse
   */
  canRetry() {
    return this.status === 'failed' && this.retryCount < this.maxRetries;
  }

  /**
   * Marcar como leída
   */
  markAsRead() {
    if (!this.isRead) {
      this.isRead = true;
      this.readAt = Date.now();
      this.updatedAt = Date.now();
    }
  }

  /**
   * Incrementar contador de clicks
   */
  incrementClick() {
    this.clickCount++;
    this.lastClickedAt = Date.now();
    this.updatedAt = Date.now();
  }

  /**
   * Convertir a formato para Firestore
   */
  toFirestore() {
    return {
      userId: this.userId,
      type: this.type,
      category: this.category,
      priority: this.priority,
      title: this.title,
      message: this.message,
      actionText: this.actionText,
      actionUrl: this.actionUrl,
      imageUrl: this.imageUrl,
      data: this.data,
      templateId: this.templateId,
      templateData: this.templateData,
      status: this.status,
      isRead: this.isRead,
      readAt: this.readAt,
      channels: this.channels,
      scheduledFor: this.scheduledFor,
      sentAt: this.sentAt,
      deliveredAt: this.deliveredAt,
      retryCount: this.retryCount,
      maxRetries: this.maxRetries,
      lastRetryAt: this.lastRetryAt,
      clickCount: this.clickCount,
      lastClickedAt: this.lastClickedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crear desde datos de Firestore
   */
  static fromFirestore(doc) {
    return new Notification({
      id: doc.id,
      ...doc.data()
    });
  }
}
```

### NotificationService Implementation
```javascript
// src/services/notifications/NotificationService.js
export class NotificationService {
  static notificationCache = new Map();
  static templates = new Map();
  static userPreferences = new Map();
  static listeners = [];

  /**
   * Enviar notificación
   */
  static async sendNotification(notificationData) {
    try {
      const notification = new Notification(notificationData);
      
      // Validar datos
      const validation = notification.validate();
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }

      // Verificar preferencias del usuario
      const userPrefs = await this.getUserPreferences(notification.userId);
      if (!this.shouldSendToUser(notification, userPrefs)) {
        return {
          success: false,
          reason: 'User preferences prevent sending'
        };
      }

      // Aplicar template si existe
      if (notification.templateId) {
        await this.applyTemplate(notification);
      }

      // Programar o enviar inmediatamente
      if (notification.scheduledFor && notification.scheduledFor > Date.now()) {
        return await this.scheduleNotification(notification);
      } else {
        return await this.sendImmediately(notification);
      }

    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enviar notificación inmediatamente
   */
  static async sendImmediately(notification) {
    try {
      // Guardar en Firestore
      const docRef = await db.collection('notifications').add(notification.toFirestore());
      notification.id = docRef.id;

      // Deduplicar notificaciones similares
      const isDuplicate = await this.checkForDuplicates(notification);
      if (isDuplicate) {
        await this.markAsDuplicate(notification.id);
        return {
          success: false,
          reason: 'Duplicate notification detected'
        };
      }

      const results = {};
      let overallSuccess = false;

      // Enviar por cada canal habilitado
      if (notification.channels.inApp) {
        results.inApp = await this.sendInAppNotification(notification);
        if (results.inApp.success) overallSuccess = true;
      }

      if (notification.channels.push) {
        results.push = await this.sendPushNotification(notification);
        if (results.push.success) overallSuccess = true;
      }

      if (notification.channels.email) {
        results.email = await this.sendEmailNotification(notification);
        if (results.email.success) overallSuccess = true;
      }

      if (notification.channels.sms) {
        results.sms = await this.sendSMSNotification(notification);
        if (results.sms.success) overallSuccess = true;
      }

      // Actualizar estado
      const status = overallSuccess ? 'sent' : 'failed';
      await this.updateNotificationStatus(notification.id, status, results);

      // Analytics
      await this.trackNotificationSent(notification, results);

      return {
        success: overallSuccess,
        notificationId: notification.id,
        results
      };

    } catch (error) {
      console.error('Error sending immediately:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Programar notificación para envío futuro
   */
  static async scheduleNotification(notification) {
    try {
      // Guardar como pendiente
      notification.status = 'scheduled';
      const docRef = await db.collection('notifications').add(notification.toFirestore());
      
      // Programar en job queue (usando Firebase Functions o similar)
      await this.scheduleJob(docRef.id, notification.scheduledFor);

      return {
        success: true,
        notificationId: docRef.id,
        scheduledFor: notification.scheduledFor
      };

    } catch (error) {
      console.error('Error scheduling notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enviar notificación in-app
   */
  static async sendInAppNotification(notification) {
    try {
      // Trigger real-time listener para UI
      await this.triggerRealTimeUpdate(notification.userId, notification);

      return { success: true, channel: 'inApp' };
    } catch (error) {
      console.error('Error sending in-app notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar push notification
   */
  static async sendPushNotification(notification) {
    try {
      const userTokens = await this.getUserPushTokens(notification.userId);
      if (!userTokens.length) {
        return { success: false, reason: 'No push tokens found' };
      }

      const pushPayload = {
        title: notification.title,
        body: notification.message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-icon.png',
        data: {
          notificationId: notification.id,
          actionUrl: notification.actionUrl,
          type: notification.type,
          ...notification.data
        },
        actions: notification.actionText ? [{
          action: 'view',
          title: notification.actionText
        }] : []
      };

      // Enviar a todos los dispositivos del usuario
      const results = await Promise.allSettled(
        userTokens.map(token => this.sendToDevice(token, pushPayload))
      );

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      return {
        success: successCount > 0,
        channel: 'push',
        sentToDevices: successCount,
        totalDevices: userTokens.length
      };

    } catch (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar notificación por email
   */
  static async sendEmailNotification(notification) {
    try {
      const user = await this.getUserData(notification.userId);
      if (!user?.email) {
        return { success: false, reason: 'No email address found' };
      }

      const emailData = {
        to: user.email,
        subject: notification.title,
        html: await this.generateEmailHTML(notification, user),
        text: notification.message
      };

      const result = await EmailService.sendTransactionalEmail(emailData);
      
      return {
        success: result.success,
        channel: 'email',
        messageId: result.messageId
      };

    } catch (error) {
      console.error('Error sending email notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar notificación por SMS
   */
  static async sendSMSNotification(notification) {
    try {
      const user = await this.getUserData(notification.userId);
      if (!user?.phone) {
        return { success: false, reason: 'No phone number found' };
      }

      const smsData = {
        to: user.phone,
        message: `${notification.title}\n\n${notification.message}`
      };

      const result = await SMSService.sendSMS(smsData);
      
      return {
        success: result.success,
        channel: 'sms',
        messageId: result.messageId
      };

    } catch (error) {
      console.error('Error sending SMS notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener notificaciones de un usuario
   */
  static async getUserNotifications(userId, options = {}) {
    try {
      let query = db.collection('notifications')
        .where('userId', '==', userId);

      // Filtros opcionales
      if (options.category) {
        query = query.where('category', '==', options.category);
      }

      if (options.unreadOnly) {
        query = query.where('isRead', '==', false);
      }

      if (options.since) {
        query = query.where('createdAt', '>=', options.since);
      }

      // Ordenamiento y límite
      query = query.orderBy('createdAt', 'desc');
      
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      const notifications = snapshot.docs.map(doc => 
        Notification.fromFirestore(doc)
      );

      return notifications;

    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  /**
   * Marcar notificación como leída
   */
  static async markAsRead(notificationId, userId) {
    try {
      await db.collection('notifications').doc(notificationId).update({
        isRead: true,
        readAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Trigger real-time update
      await this.triggerRealTimeUpdate(userId, { 
        type: 'notification_read', 
        notificationId 
      });

      return { success: true };

    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  static async markAllAsRead(userId) {
    try {
      const batch = db.batch();
      
      const unreadNotifications = await db.collection('notifications')
        .where('userId', '==', userId)
        .where('isRead', '==', false)
        .get();

      unreadNotifications.docs.forEach(doc => {
        batch.update(doc.ref, {
          isRead: true,
          readAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();

      // Trigger real-time update
      await this.triggerRealTimeUpdate(userId, { 
        type: 'all_notifications_read' 
      });

      return { 
        success: true, 
        updatedCount: unreadNotifications.docs.length 
      };

    } catch (error) {
      console.error('Error marking all as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener contador de notificaciones no leídas
   */
  static async getUnreadCount(userId) {
    try {
      // Usar cache si está disponible
      const cacheKey = `unread_count_${userId}`;
      if (this.notificationCache.has(cacheKey)) {
        const cached = this.notificationCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 60000) { // Cache por 1 minuto
          return cached.count;
        }
      }

      const snapshot = await db.collection('notifications')
        .where('userId', '==', userId)
        .where('isRead', '==', false)
        .get();

      const count = snapshot.size;

      // Guardar en cache
      this.notificationCache.set(cacheKey, {
        count,
        timestamp: Date.now()
      });

      return count;

    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Escuchar notificaciones en tiempo real
   */
  static listenToUserNotifications(userId, callback) {
    const unsubscribe = db.collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot(
        (snapshot) => {
          const notifications = snapshot.docs.map(doc => 
            Notification.fromFirestore(doc)
          );
          callback(notifications);
        },
        (error) => {
          console.error('Error listening to notifications:', error);
        }
      );

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Configurar preferencias de notificación
   */
  static async updateUserPreferences(userId, preferences) {
    try {
      await db.collection('notification_preferences').doc(userId).set({
        ...preferences,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Actualizar cache
      this.userPreferences.set(userId, preferences);

      return { success: true };

    } catch (error) {
      console.error('Error updating preferences:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener preferencias de usuario
   */
  static async getUserPreferences(userId) {
    try {
      // Verificar cache
      if (this.userPreferences.has(userId)) {
        return this.userPreferences.get(userId);
      }

      const doc = await db.collection('notification_preferences').doc(userId).get();
      
      const defaultPrefs = {
        enabled: true,
        channels: {
          push: true,
          email: true,
          sms: false,
          inApp: true
        },
        categories: {
          booking: true,
          messages: true,
          promotions: false,
          system: true
        },
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00'
        },
        frequency: {
          immediate: ['booking', 'messages'],
          daily: ['promotions'],
          weekly: []
        }
      };

      const preferences = doc.exists ? { ...defaultPrefs, ...doc.data() } : defaultPrefs;
      
      // Guardar en cache
      this.userPreferences.set(userId, preferences);
      
      return preferences;

    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  }

  /**
   * Verificar si debe enviarse la notificación según preferencias
   */
  static shouldSendToUser(notification, userPrefs) {
    // Verificar si las notificaciones están habilitadas
    if (!userPrefs.enabled) return false;

    // Verificar categoría
    if (userPrefs.categories && !userPrefs.categories[notification.category]) {
      return false;
    }

    // Verificar horarios de silencio
    if (userPrefs.quietHours?.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const { start, end } = userPrefs.quietHours;
      
      if (this.isInQuietHours(currentTime, start, end) && notification.priority !== 'urgent') {
        return false;
      }
    }

    return true;
  }

  /**
   * Aplicar template a notificación
   */
  static async applyTemplate(notification) {
    try {
      const template = await this.getTemplate(notification.templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Renderizar template con datos
      notification.title = this.renderTemplate(template.title, notification.templateData);
      notification.message = this.renderTemplate(template.message, notification.templateData);
      
      if (template.actionText) {
        notification.actionText = this.renderTemplate(template.actionText, notification.templateData);
      }

      if (template.actionUrl) {
        notification.actionUrl = this.renderTemplate(template.actionUrl, notification.templateData);
      }

    } catch (error) {
      console.error('Error applying template:', error);
    }
  }

  /**
   * Renderizar template con datos dinámicos
   */
  static renderTemplate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  // Métodos específicos para tipos de notificaciones

  /**
   * Notificación de confirmación de reserva
   */
  static async sendBookingConfirmation(booking) {
    return await this.sendNotification({
      userId: booking.clientId,
      type: 'booking_confirmed',
      category: 'booking',
      priority: 'high',
      templateId: 'booking_confirmation',
      templateData: {
        professionalName: booking.professionalName,
        serviceName: booking.service.name,
        date: booking.scheduledDate,
        time: booking.scheduledTime,
        total: booking.service.totalPrice
      },
      channels: {
        push: true,
        email: true,
        sms: false,
        inApp: true
      },
      actionText: 'Ver Reserva',
      actionUrl: `/bookings/${booking.id}`,
      data: {
        bookingId: booking.id
      }
    });
  }

  /**
   * Recordatorio de cita
   */
  static async sendBookingReminder(booking, hoursAhead = 24) {
    return await this.sendNotification({
      userId: booking.clientId,
      type: `reminder_${hoursAhead}h`,
      category: 'booking',
      priority: 'high',
      templateId: 'booking_reminder',
      templateData: {
        professionalName: booking.professionalName,
        serviceName: booking.service.name,
        time: booking.scheduledTime,
        hoursAhead
      },
      channels: {
        push: true,
        email: false,
        sms: hoursAhead <= 2, // SMS solo para recordatorios urgentes
        inApp: true
      },
      actionText: 'Ver Detalles',
      actionUrl: `/bookings/${booking.id}`,
      data: {
        bookingId: booking.id
      }
    });
  }

  /**
   * Notificación de nuevo mensaje
   */
  static async sendNewMessage(fromUserId, toUserId, message) {
    const fromUser = await this.getUserData(fromUserId);
    
    return await this.sendNotification({
      userId: toUserId,
      type: 'message_received',
      category: 'messages',
      priority: 'normal',
      title: `Nuevo mensaje de ${fromUser.name}`,
      message: message.length > 100 ? message.substring(0, 100) + '...' : message,
      channels: {
        push: true,
        email: false,
        sms: false,
        inApp: true
      },
      actionText: 'Responder',
      actionUrl: `/messages/${fromUserId}`,
      data: {
        fromUserId,
        messageId: message.id
      }
    });
  }

  // Métodos auxiliares privados
  static async getUserData(userId) {
    // Implementar obtención de datos de usuario
  }

  static async getUserPushTokens(userId) {
    // Implementar obtención de tokens push del usuario
  }

  static async sendToDevice(token, payload) {
    // Implementar envío a dispositivo específico
  }

  static async generateEmailHTML(notification, user) {
    // Implementar generación de HTML para emails
  }

  static async triggerRealTimeUpdate(userId, data) {
    // Implementar trigger de actualizaciones en tiempo real
  }

  static async trackNotificationSent(notification, results) {
    // Implementar analytics de envío
  }

  static isInQuietHours(currentTime, startTime, endTime) {
    // Implementar lógica de horarios de silencio
    return false;
  }
}
```

## 🧪 Testing

### Notification Delivery Tests
- [ ] Envío inmediato funciona correctamente
- [ ] Programación de notificaciones futuras
- [ ] Retry logic para fallos de envío
- [ ] Deduplicación de notificaciones
- [ ] Respeto a preferencias de usuario

### Channel Integration Tests
- [ ] Push notifications se entregan
- [ ] Emails llegan correctamente
- [ ] SMS se envían (en sandbox)
- [ ] Notificaciones in-app aparecen en tiempo real

### User Experience Tests
- [ ] Centro de notificaciones funciona
- [ ] Contadores de no leídas son precisos
- [ ] Configuración de preferencias se guarda
- [ ] Rate limiting previene spam

## 🚀 Deployment

### Firebase Configuration
- Configurar Firebase Cloud Messaging
- Setup de service worker para push notifications
- Configurar Firestore security rules para notificaciones

### External Services
- Integración con proveedor de email (SendGrid/Mailgun)
- Configuración de WhatsApp Business API
- Setup de SMS provider

## 📦 Dependencies
- Firebase Cloud Messaging para push
- Email service provider (SendGrid)
- SMS/WhatsApp Business API
- Service Worker para notifications offline

## 🔗 Relaciones
- **Integra con**: fase3-0007-booking-system (confirmaciones)
- **Usa**: fase5-0011-messaging-system (notificaciones de chat)
- **Mejora**: User experience de toda la plataforma

---

**Estado**: 🟡 Pendiente  
**Prioridad**: Alta  
**Estimación**: 16 horas  
**Asignado**: Full Stack Developer  

**Sprint**: Sprint 5 - Comunicación  
**Deadline**: 23 septiembre 2025