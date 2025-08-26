# Ticket Fase 6-0027: Gestión de Usuarios

## 📋 Descripción
Implementar sistema completo de gestión de usuarios para administradores, incluyendo verificación de profesionales, moderación de perfiles, gestión de roles, suspensiones y herramientas de soporte al cliente.

## 🎯 Objetivos
- Panel de gestión de usuarios con filtros avanzados
- Sistema de verificación de profesionales
- Herramientas de moderación y suspensión
- Gestión de roles y permisos
- Soporte y atención al cliente
- Auditoría de acciones de usuario
- Analytics de comportamiento

## 📊 Criterios de Aceptación

### ✅ Lista y Filtrado de Usuarios
- [ ] Lista paginada con búsqueda avanzada
- [ ] Filtros por tipo, estado, verificación
- [ ] Ordenamiento por múltiples criterios
- [ ] Exportación de listas de usuarios
- [ ] Vista detallada de perfil

### ✅ Verificación de Profesionales
- [ ] Cola de verificación pendiente
- [ ] Revisión de documentos subidos
- [ ] Aprobación/rechazo con comentarios
- [ ] Notificaciones automáticas de estado
- [ ] Historial de verificaciones

### ✅ Moderación de Contenido
- [ ] Revisión de perfiles reportados
- [ ] Edición de información de usuario
- [ ] Suspensión temporal o permanente
- [ ] Sistema de warnings y strikes
- [ ] Log de acciones de moderación

### ✅ Soporte al Cliente
- [ ] Sistema de tickets de soporte
- [ ] Chat directo con usuarios
- [ ] Base de conocimiento
- [ ] Escalamiento de problemas
- [ ] Métricas de satisfacción

## 🔧 Implementación Técnica

### User Management Architecture
```
src/
├── admin/
│   ├── components/
│   │   └── users/
│   │       ├── UsersList.js              # Lista principal de usuarios
│   │       ├── UserProfile.js            # Perfil detallado de usuario
│   │       ├── UserActions.js            # Acciones de moderación
│   │       ├── VerificationQueue.js      # Cola de verificación
│   │       ├── DocumentViewer.js         # Visor de documentos
│   │       ├── SupportTickets.js         # Tickets de soporte
│   │       └── UserAnalytics.js          # Analytics específico
│   ├── services/
│   │   ├── UserManagementService.js      # Servicio principal
│   │   ├── VerificationService.js        # Servicio verificación
│   │   ├── ModerationService.js          # Servicio moderación
│   │   └── SupportService.js             # Servicio soporte
│   └── modals/
│       ├── UserActionModal.js            # Modal acciones usuario
│       ├── VerificationModal.js          # Modal verificación
│       └── SupportChatModal.js           # Modal chat soporte
```

### UserManagementService Implementation
```javascript
// src/admin/services/UserManagementService.js
export class UserManagementService {
  static cache = new Map();
  static listeners = [];

  /**
   * Obtener lista de usuarios con filtros avanzados
   */
  static async getUsers(filters = {}, pagination = {}) {
    try {
      let query = db.collection('users');

      // Filtros básicos
      if (filters.type) {
        query = query.where('type', '==', filters.type);
      }

      if (filters.verified !== undefined) {
        query = query.where('verified', '==', filters.verified);
      }

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters.city) {
        query = query.where('location.city', '==', filters.city);
      }

      // Filtros de fecha
      if (filters.registeredAfter) {
        query = query.where('createdAt', '>=', filters.registeredAfter);
      }

      if (filters.registeredBefore) {
        query = query.where('createdAt', '<=', filters.registeredBefore);
      }

      // Filtros avanzados para profesionales
      if (filters.hasDocuments !== undefined) {
        query = query.where('documents.uploaded', '==', filters.hasDocuments);
      }

      if (filters.minRating) {
        query = query.where('stats.averageRating', '>=', filters.minRating);
      }

      // Búsqueda por texto (limitada en Firestore)
      if (filters.search) {
        // Para búsqueda más avanzada, considerar Algolia
        query = query
          .orderBy('name')
          .startAt(filters.search)
          .endAt(filters.search + '\uf8ff');
      }

      // Ordenamiento
      if (!filters.search) {
        const orderBy = pagination.orderBy || 'createdAt';
        const orderDirection = pagination.orderDirection || 'desc';
        query = query.orderBy(orderBy, orderDirection);
      }

      // Paginación
      if (pagination.startAfter) {
        query = query.startAfter(pagination.startAfter);
      }

      const limit = pagination.limit || 25;
      query = query.limit(limit);

      const snapshot = await query.get();
      const users = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const userData = { id: doc.id, ...doc.data(), _doc: doc };
          
          // Enriquecer con estadísticas adicionales
          if (userData.type === 'professional') {
            userData.stats = await this.getProfessionalStats(userData.id);
          } else {
            userData.stats = await this.getClientStats(userData.id);
          }
          
          return userData;
        })
      );

      return {
        users,
        hasMore: snapshot.docs.length === limit,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        total: await this.getUsersCount(filters)
      };

    } catch (error) {
      console.error('Error getting users:', error);
      return {
        users: [],
        hasMore: false,
        lastDoc: null,
        total: 0
      };
    }
  }

  /**
   * Obtener perfil completo de usuario
   */
  static async getUserProfile(userId) {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        throw new Error('Usuario no encontrado');
      }

      const userData = { id: userDoc.id, ...userDoc.data() };

      // Obtener datos adicionales en paralelo
      const [
        bookingStats,
        recentActivity,
        supportTickets,
        moderationHistory,
        deviceInfo
      ] = await Promise.all([
        this.getUserBookingStats(userId),
        this.getUserRecentActivity(userId),
        this.getUserSupportTickets(userId),
        this.getUserModerationHistory(userId),
        this.getUserDeviceInfo(userId)
      ]);

      return {
        profile: userData,
        stats: {
          bookings: bookingStats,
          activity: recentActivity
        },
        support: supportTickets,
        moderation: moderationHistory,
        devices: deviceInfo
      };

    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Verificar profesional
   */
  static async verifyProfessional(professionalId, verification) {
    try {
      const { adminId, approved, comments, documents } = verification;

      const updateData = {
        verified: approved,
        verificationStatus: approved ? 'approved' : 'rejected',
        verifiedAt: approved ? Date.now() : null,
        verifiedBy: adminId,
        verificationComments: comments,
        'verification.reviewedAt': Date.now(),
        'verification.reviewedBy': adminId,
        'verification.status': approved ? 'approved' : 'rejected',
        updatedAt: Date.now()
      };

      // Si se aprueba, actualizar documentos verificados
      if (approved && documents) {
        updateData['verification.verifiedDocuments'] = documents;
      }

      await db.collection('users').doc(professionalId).update(updateData);

      // Registrar acción en auditoría
      await this.logModerationAction({
        userId: professionalId,
        adminId,
        action: approved ? 'verify_professional' : 'reject_verification',
        details: { comments, documents },
        timestamp: Date.now()
      });

      // Enviar notificación al profesional
      await this.notifyVerificationResult(professionalId, approved, comments);

      return { success: true };

    } catch (error) {
      console.error('Error verifying professional:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Suspender usuario
   */
  static async suspendUser(userId, suspension) {
    try {
      const { adminId, reason, duration, type } = suspension;
      
      const suspensionEnd = duration ? Date.now() + (duration * 24 * 60 * 60 * 1000) : null;
      
      const updateData = {
        status: type === 'permanent' ? 'banned' : 'suspended',
        suspendedAt: Date.now(),
        suspendedBy: adminId,
        suspensionReason: reason,
        suspensionType: type,
        suspensionEnd,
        updatedAt: Date.now()
      };

      await db.collection('users').doc(userId).update(updateData);

      // Registrar en auditoría
      await this.logModerationAction({
        userId,
        adminId,
        action: type === 'permanent' ? 'ban_user' : 'suspend_user',
        details: { reason, duration, type },
        timestamp: Date.now()
      });

      // Enviar notificación
      await this.notifyUserSuspension(userId, suspension);

      // Si es profesional, cancelar reservas futuras
      if (type === 'permanent') {
        await this.cancelUserBookings(userId);
      }

      return { success: true };

    } catch (error) {
      console.error('Error suspending user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reactivar usuario
   */
  static async reactivateUser(userId, adminId, reason = '') {
    try {
      const updateData = {
        status: 'active',
        suspendedAt: null,
        suspendedBy: null,
        suspensionReason: null,
        suspensionType: null,
        suspensionEnd: null,
        reactivatedAt: Date.now(),
        reactivatedBy: adminId,
        reactivationReason: reason,
        updatedAt: Date.now()
      };

      await db.collection('users').doc(userId).update(updateData);

      // Registrar en auditoría
      await this.logModerationAction({
        userId,
        adminId,
        action: 'reactivate_user',
        details: { reason },
        timestamp: Date.now()
      });

      // Enviar notificación
      await this.notifyUserReactivation(userId, reason);

      return { success: true };

    } catch (error) {
      console.error('Error reactivating user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Editar perfil de usuario (admin)
   */
  static async editUserProfile(userId, changes, adminId) {
    try {
      const allowedFields = [
        'name', 'email', 'phone', 'location', 'bio', 
        'specialties', 'services', 'businessName'
      ];

      const updateData = {};
      
      Object.keys(changes).forEach(field => {
        if (allowedFields.includes(field)) {
          updateData[field] = changes[field];
        }
      });

      updateData.updatedAt = Date.now();
      updateData.lastEditedBy = adminId;

      await db.collection('users').doc(userId).update(updateData);

      // Registrar cambios en auditoría
      await this.logModerationAction({
        userId,
        adminId,
        action: 'edit_profile',
        details: { changes: updateData },
        timestamp: Date.now()
      });

      return { success: true };

    } catch (error) {
      console.error('Error editing user profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener cola de verificación
   */
  static async getVerificationQueue(filters = {}) {
    try {
      let query = db.collection('users')
        .where('type', '==', 'professional')
        .where('verified', '==', false)
        .where('verificationStatus', 'in', ['pending', 'documents_uploaded']);

      if (filters.priority) {
        query = query.where('verification.priority', '==', filters.priority);
      }

      if (filters.city) {
        query = query.where('location.city', '==', filters.city);
      }

      // Ordenar por fecha de subida de documentos
      query = query.orderBy('verification.documentsUploadedAt', 'asc');

      const snapshot = await query.get();
      const pendingVerifications = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const userData = { id: doc.id, ...doc.data() };
          
          // Calcular tiempo en cola
          const uploadedAt = userData.verification?.documentsUploadedAt;
          userData.queueTime = uploadedAt ? Date.now() - uploadedAt : 0;
          
          // Obtener información adicional
          userData.documentsCount = userData.verification?.documents?.length || 0;
          userData.hasAllRequiredDocs = await this.checkRequiredDocuments(userData);
          
          return userData;
        })
      );

      return pendingVerifications;

    } catch (error) {
      console.error('Error getting verification queue:', error);
      return [];
    }
  }

  /**
   * Crear ticket de soporte
   */
  static async createSupportTicket(ticketData) {
    try {
      const ticket = {
        userId: ticketData.userId,
        subject: ticketData.subject,
        description: ticketData.description,
        category: ticketData.category, // technical, account, billing, general
        priority: ticketData.priority || 'normal', // low, normal, high, urgent
        status: 'open', // open, in_progress, resolved, closed
        assignedTo: ticketData.assignedTo || null,
        tags: ticketData.tags || [],
        attachments: ticketData.attachments || [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const docRef = await db.collection('support_tickets').add(ticket);
      
      // Crear primera respuesta automática
      await this.addTicketMessage(docRef.id, {
        fromAdmin: true,
        adminId: 'system',
        message: 'Hemos recibido tu solicitud de soporte. Te responderemos en breve.',
        timestamp: Date.now()
      });

      // Notificar a equipo de soporte
      await this.notifySupportTeam(docRef.id, ticket);

      return { success: true, ticketId: docRef.id };

    } catch (error) {
      console.error('Error creating support ticket:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener estadísticas de usuario profesional
   */
  static async getProfessionalStats(professionalId) {
    try {
      // Obtener reservas
      const bookingsSnapshot = await db.collection('bookings')
        .where('professionalId', '==', professionalId)
        .get();

      const bookings = bookingsSnapshot.docs.map(doc => doc.data());
      
      const stats = {
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        totalEarnings: bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + (b.payment?.amount || 0), 0),
        averageBookingValue: 0,
        cancellationRate: 0,
        responseTime: await this.getAverageResponseTime(professionalId),
        lastActive: await this.getLastActiveTime(professionalId)
      };

      if (stats.completedBookings > 0) {
        stats.averageBookingValue = stats.totalEarnings / stats.completedBookings;
      }

      if (stats.totalBookings > 0) {
        stats.cancellationRate = (stats.cancelledBookings / stats.totalBookings) * 100;
      }

      return stats;

    } catch (error) {
      console.error('Error getting professional stats:', error);
      return {};
    }
  }

  /**
   * Obtener estadísticas de cliente
   */
  static async getClientStats(clientId) {
    try {
      // Obtener reservas del cliente
      const bookingsSnapshot = await db.collection('bookings')
        .where('clientId', '==', clientId)
        .get();

      const bookings = bookingsSnapshot.docs.map(doc => doc.data());
      
      const stats = {
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        totalSpent: bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + (b.payment?.amount || 0), 0),
        averageSpending: 0,
        favoriteServices: this.getFavoriteServices(bookings),
        loyaltyScore: this.calculateLoyaltyScore(bookings),
        lastBooking: bookings.length > 0 
          ? Math.max(...bookings.map(b => b.createdAt))
          : null
      };

      if (stats.completedBookings > 0) {
        stats.averageSpending = stats.totalSpent / stats.completedBookings;
      }

      return stats;

    } catch (error) {
      console.error('Error getting client stats:', error);
      return {};
    }
  }

  /**
   * Buscar usuarios por texto
   */
  static async searchUsers(searchTerm, filters = {}) {
    try {
      // Para búsqueda más avanzada, considerar Algolia
      // Esta es una implementación básica usando Firestore
      
      const searches = [];
      
      // Búsqueda por nombre
      searches.push(
        db.collection('users')
          .orderBy('name')
          .startAt(searchTerm)
          .endAt(searchTerm + '\uf8ff')
          .limit(10)
          .get()
      );
      
      // Búsqueda por email
      if (searchTerm.includes('@')) {
        searches.push(
          db.collection('users')
            .orderBy('email')
            .startAt(searchTerm)
            .endAt(searchTerm + '\uf8ff')
            .limit(10)
            .get()
        );
      }
      
      // Búsqueda por nombre de negocio (profesionales)
      if (filters.type === 'professional' || !filters.type) {
        searches.push(
          db.collection('users')
            .where('type', '==', 'professional')
            .orderBy('businessName')
            .startAt(searchTerm)
            .endAt(searchTerm + '\uf8ff')
            .limit(10)
            .get()
        );
      }

      const results = await Promise.all(searches);
      const users = new Map(); // Para evitar duplicados

      results.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
          users.set(doc.id, { id: doc.id, ...doc.data() });
        });
      });

      return Array.from(users.values());

    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  /**
   * Exportar usuarios a CSV
   */
  static async exportUsers(filters = {}, format = 'csv') {
    try {
      const allUsers = [];
      let lastDoc = null;
      
      // Obtener todos los usuarios (en lotes)
      while (true) {
        const result = await this.getUsers(filters, {
          limit: 1000,
          startAfter: lastDoc
        });
        
        allUsers.push(...result.users);
        
        if (!result.hasMore) break;
        lastDoc = result.lastDoc;
      }

      // Preparar datos para exportación
      const exportData = allUsers.map(user => ({
        ID: user.id,
        Nombre: user.name,
        Email: user.email,
        Teléfono: user.phone || '',
        Tipo: user.type,
        Verificado: user.verified ? 'Sí' : 'No',
        Estado: user.status || 'active',
        Ciudad: user.location?.city || '',
        'Fecha Registro': new Date(user.createdAt).toLocaleDateString('es-BO'),
        'Última Actividad': user.lastLoginAt 
          ? new Date(user.lastLoginAt).toLocaleDateString('es-BO')
          : 'Nunca'
      }));

      if (format === 'csv') {
        return this.generateCSV(exportData);
      } else {
        return this.generateExcel(exportData);
      }

    } catch (error) {
      console.error('Error exporting users:', error);
      throw error;
    }
  }

  // Métodos auxiliares privados
  static async getUsersCount(filters = {}) {
    try {
      let query = db.collection('users');
      
      // Aplicar los mismos filtros que en getUsers
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          switch (key) {
            case 'type':
              query = query.where('type', '==', filters[key]);
              break;
            case 'verified':
              query = query.where('verified', '==', filters[key]);
              break;
            case 'status':
              query = query.where('status', '==', filters[key]);
              break;
          }
        }
      });
      
      const snapshot = await query.get();
      return snapshot.size;
    } catch (error) {
      console.error('Error getting users count:', error);
      return 0;
    }
  }

  static async logModerationAction(action) {
    try {
      await db.collection('moderation_log').add(action);
    } catch (error) {
      console.error('Error logging moderation action:', error);
    }
  }

  static async notifyVerificationResult(professionalId, approved, comments) {
    // Implementar notificación de resultado de verificación
    console.log(`Notifying ${professionalId} of verification: ${approved ? 'approved' : 'rejected'}`);
  }

  static async notifyUserSuspension(userId, suspension) {
    // Implementar notificación de suspensión
    console.log(`Notifying ${userId} of suspension`);
  }

  static async cancelUserBookings(userId) {
    // Implementar cancelación de reservas futuras
    console.log(`Cancelling future bookings for ${userId}`);
  }

  static generateCSV(data) {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }
}
```

## 🧪 Testing

### User Management Tests
- [ ] Lista de usuarios carga correctamente con filtros
- [ ] Verificación de profesionales funciona
- [ ] Suspensiones y reactivaciones se procesan
- [ ] Búsqueda encuentra usuarios relevantes
- [ ] Exportación genera archivos válidos

### Security Tests
- [ ] Solo admins pueden acceder a gestión
- [ ] Todas las acciones se registran en auditoría
- [ ] Permisos se validan correctamente
- [ ] Datos sensibles están protegidos

## 🚀 Deployment

### Database Setup
- Configurar indexes para consultas de usuarios
- Setup de reglas de seguridad para admin
- Configurar triggers para auditoría

### Performance Optimization
- Paginación eficiente para listas grandes
- Caching de estadísticas frecuentes
- Optimización de consultas complejas

## 📦 Dependencies
- Firebase Firestore para datos
- Export libraries (CSV/Excel)
- NotificationService para alertas
- File storage para documentos

## 🔗 Relaciones
- **Depende de**: fase6-0026-admin-dashboard
- **Integra con**: fase1-0004-auth-base-system
- **Usa**: fase5-0010-notification-system

---

**Estado**: 🟡 Pendiente  
**Prioridad**: Alta  
**Estimación**: 20 horas  
**Asignado**: Senior Full Stack Developer  

**Sprint**: Sprint 6 - Administración  
**Deadline**: 7 octubre 2025