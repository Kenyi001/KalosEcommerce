# Ticket Fase 6-0028: Moderación de Contenido

## 📋 Descripción
Implementar sistema completo de moderación de contenido para mantener la calidad y seguridad de la plataforma Kalos, incluyendo moderación automática, cola de revisión manual, herramientas de reporte y gestión de contenido inapropiado.

## 🎯 Objetivos
- Sistema de moderación automática con IA
- Cola de contenido reportado para revisión manual
- Herramientas de reporte para usuarios
- Gestión de contenido inapropiado
- Sistema de strikes y penalizaciones
- Filtros de contenido en tiempo real
- Analytics de moderación

## 📊 Criterios de Aceptación

### ✅ Moderación Automática
- [ ] Filtros de palabras prohibidas
- [ ] Detección de contenido sexual/violento
- [ ] Análisis de imágenes con IA
- [ ] Validación de información de contacto
- [ ] Detección de spam y contenido duplicado

### ✅ Sistema de Reportes
- [ ] Botón de reporte en perfiles y contenido
- [ ] Formulario de reporte con categorías
- [ ] Cola de reportes para moderadores
- [ ] Sistema de priorización automática
- [ ] Notificaciones de resolución

### ✅ Herramientas de Moderación
- [ ] Dashboard de moderación centralizado
- [ ] Revisión de contenido reportado
- [ ] Edición/eliminación de contenido
- [ ] Sistema de warnings y strikes
- [ ] Bloqueo temporal/permanente

### ✅ Analytics y Métricas
- [ ] Estadísticas de moderación
- [ ] Tendencias de contenido reportado
- [ ] Efectividad de filtros automáticos
- [ ] Tiempo de resolución promedio
- [ ] Métricas de calidad de plataforma

## 🔧 Implementación Técnica

### Content Moderation Architecture
```
src/
├── admin/
│   ├── components/
│   │   └── moderation/
│   │       ├── ModerationDashboard.js     # Dashboard principal
│   │       ├── ReportsQueue.js            # Cola de reportes
│   │       ├── ContentReviewer.js         # Revisor de contenido
│   │       ├── AutoModerationRules.js     # Config automática
│   │       ├── UserStrikesManager.js      # Gestión de strikes
│   │       └── ModerationAnalytics.js     # Analytics
│   └── services/
│       ├── ModerationService.js           # Servicio principal
│       ├── AutoModerationService.js       # Moderación automática
│       ├── ReportService.js               # Gestión reportes
│       └── ContentAnalysisService.js      # Análisis contenido
├── components/
│   └── common/
│       ├── ReportButton.js                # Botón reportar
│       └── ReportModal.js                 # Modal de reporte
└── services/
    └── ClientModerationService.js         # Cliente moderación
```

### ModerationService Implementation
```javascript
// src/admin/services/ModerationService.js
export class ModerationService {
  static reportQueue = [];
  static autoModerationRules = new Map();
  static moderationCache = new Map();

  /**
   * Obtener cola de reportes
   */
  static async getReportsQueue(filters = {}) {
    try {
      let query = db.collection('content_reports')
        .where('status', '==', 'pending');

      // Filtros
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }

      if (filters.priority) {
        query = query.where('priority', '==', filters.priority);
      }

      if (filters.contentType) {
        query = query.where('contentType', '==', filters.contentType);
      }

      // Ordenar por prioridad y fecha
      query = query
        .orderBy('priority', 'desc')
        .orderBy('createdAt', 'asc');

      const snapshot = await query.get();
      const reports = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const reportData = { id: doc.id, ...doc.data() };
          
          // Enriquecer con datos del contenido reportado
          reportData.content = await this.getReportedContent(
            reportData.contentType, 
            reportData.contentId
          );
          
          // Enriquecer con datos del reportero
          reportData.reporter = await this.getUserData(reportData.reporterId);
          
          // Calcular tiempo en cola
          reportData.queueTime = Date.now() - reportData.createdAt;
          
          return reportData;
        })
      );

      return reports;

    } catch (error) {
      console.error('Error getting reports queue:', error);
      return [];
    }
  }

  /**
   * Procesar reporte de contenido
   */
  static async processReport(reportId, decision) {
    try {
      const { action, moderatorId, reason, severity } = decision;
      
      const reportRef = db.collection('content_reports').doc(reportId);
      const report = await reportRef.get();
      
      if (!report.exists) {
        throw new Error('Reporte no encontrado');
      }

      const reportData = report.data();
      
      // Actualizar estado del reporte
      await reportRef.update({
        status: 'resolved',
        resolvedAt: Date.now(),
        resolvedBy: moderatorId,
        resolution: {
          action,
          reason,
          severity
        },
        updatedAt: Date.now()
      });

      // Ejecutar acción según decisión
      let actionResult = { success: true };
      
      switch (action) {
        case 'dismiss':
          // No hacer nada, solo cerrar reporte
          break;
          
        case 'warn':
          actionResult = await this.warnUser(
            reportData.contentOwnerId, 
            reason, 
            moderatorId
          );
          break;
          
        case 'remove_content':
          actionResult = await this.removeContent(
            reportData.contentType,
            reportData.contentId,
            reason,
            moderatorId
          );
          break;
          
        case 'suspend_user':
          actionResult = await this.suspendUser(
            reportData.contentOwnerId,
            severity,
            reason,
            moderatorId
          );
          break;
          
        case 'ban_user':
          actionResult = await this.banUser(
            reportData.contentOwnerId,
            reason,
            moderatorId
          );
          break;
      }

      // Registrar acción de moderación
      await this.logModerationAction({
        reportId,
        moderatorId,
        action,
        targetUserId: reportData.contentOwnerId,
        contentType: reportData.contentType,
        contentId: reportData.contentId,
        reason,
        severity,
        success: actionResult.success,
        timestamp: Date.now()
      });

      // Notificar al reportero sobre la resolución
      await this.notifyReportResolution(reportData.reporterId, reportId, action);

      // Si la acción afecta al contenido/usuario, notificar
      if (['warn', 'remove_content', 'suspend_user', 'ban_user'].includes(action)) {
        await this.notifyContentOwner(reportData.contentOwnerId, action, reason);
      }

      return { success: true, actionResult };

    } catch (error) {
      console.error('Error processing report:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear reporte de contenido
   */
  static async createReport(reportData) {
    try {
      const {
        reporterId,
        contentType, // 'profile', 'image', 'review', 'message'
        contentId,
        contentOwnerId,
        category, // 'inappropriate', 'spam', 'fake', 'harassment', 'other'
        description,
        evidence
      } = reportData;

      // Verificar si ya existe un reporte similar del mismo usuario
      const existingReport = await db.collection('content_reports')
        .where('reporterId', '==', reporterId)
        .where('contentId', '==', contentId)
        .where('status', '==', 'pending')
        .get();

      if (!existingReport.empty) {
        throw new Error('Ya has reportado este contenido');
      }

      // Calcular prioridad automática
      const priority = await this.calculateReportPriority(
        contentType, 
        category, 
        contentOwnerId
      );

      const report = {
        reporterId,
        contentType,
        contentId,
        contentOwnerId,
        category,
        description,
        evidence: evidence || [],
        priority, // 1-5, siendo 5 el más urgente
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const docRef = await db.collection('content_reports').add(report);

      // Si es alta prioridad, notificar inmediatamente a moderadores
      if (priority >= 4) {
        await this.notifyModerators(docRef.id, report);
      }

      // Ejecutar moderación automática inicial
      await this.runAutoModeration(report);

      return { success: true, reportId: docRef.id };

    } catch (error) {
      console.error('Error creating report:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Moderación automática de contenido
   */
  static async runAutoModeration(content) {
    try {
      const results = {
        flagged: false,
        reasons: [],
        confidence: 0,
        autoAction: null
      };

      // 1. Filtro de palabras prohibidas
      const profanityCheck = await this.checkProfanity(content);
      if (profanityCheck.flagged) {
        results.flagged = true;
        results.reasons.push('profanity');
        results.confidence = Math.max(results.confidence, profanityCheck.confidence);
      }

      // 2. Detección de spam
      const spamCheck = await this.checkSpam(content);
      if (spamCheck.flagged) {
        results.flagged = true;
        results.reasons.push('spam');
        results.confidence = Math.max(results.confidence, spamCheck.confidence);
      }

      // 3. Detección de información de contacto
      const contactCheck = await this.checkContactInfo(content);
      if (contactCheck.flagged) {
        results.flagged = true;
        results.reasons.push('contact_info');
        results.confidence = Math.max(results.confidence, contactCheck.confidence);
      }

      // 4. Análisis de imágenes (si aplica)
      if (content.images && content.images.length > 0) {
        const imageCheck = await this.checkImages(content.images);
        if (imageCheck.flagged) {
          results.flagged = true;
          results.reasons.push('inappropriate_image');
          results.confidence = Math.max(results.confidence, imageCheck.confidence);
        }
      }

      // Determinar acción automática
      if (results.confidence >= 0.9) {
        results.autoAction = 'hide'; // Ocultar automáticamente
      } else if (results.confidence >= 0.7) {
        results.autoAction = 'flag'; // Marcar para revisión
      }

      // Ejecutar acción automática si corresponde
      if (results.autoAction === 'hide') {
        await this.autoHideContent(content);
      }

      // Registrar resultado de moderación automática
      await this.logAutoModerationResult(content, results);

      return results;

    } catch (error) {
      console.error('Error in auto moderation:', error);
      return { flagged: false, reasons: [], confidence: 0 };
    }
  }

  /**
   * Gestionar sistema de strikes
   */
  static async manageUserStrike(userId, reason, severity = 'medium') {
    try {
      const userRef = db.collection('users').doc(userId);
      const user = await userRef.get();
      
      if (!user.exists) {
        throw new Error('Usuario no encontrado');
      }

      const userData = user.data();
      const currentStrikes = userData.moderation?.strikes || 0;
      const newStrikes = currentStrikes + this.getStrikeValue(severity);

      const updateData = {
        'moderation.strikes': newStrikes,
        'moderation.lastStrike': {
          reason,
          severity,
          timestamp: Date.now()
        },
        'moderation.strikeHistory': [
          ...(userData.moderation?.strikeHistory || []),
          {
            reason,
            severity,
            timestamp: Date.now()
          }
        ],
        updatedAt: Date.now()
      };

      // Determinar acción basada en número de strikes
      let action = null;
      if (newStrikes >= 5) {
        updateData.status = 'banned';
        updateData.bannedAt = Date.now();
        action = 'ban';
      } else if (newStrikes >= 3) {
        updateData.status = 'suspended';
        updateData.suspendedAt = Date.now();
        updateData.suspensionEnd = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 días
        action = 'suspend';
      }

      await userRef.update(updateData);

      // Notificar al usuario
      await this.notifyUserStrike(userId, reason, severity, newStrikes, action);

      return { success: true, strikes: newStrikes, action };

    } catch (error) {
      console.error('Error managing user strike:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener estadísticas de moderación
   */
  static async getModerationStats(period = 'week') {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
      }

      // Obtener reportes del período
      const reportsSnapshot = await db.collection('content_reports')
        .where('createdAt', '>=', startDate.getTime())
        .where('createdAt', '<=', endDate.getTime())
        .get();

      const reports = reportsSnapshot.docs.map(doc => doc.data());

      // Obtener acciones de moderación
      const actionsSnapshot = await db.collection('moderation_log')
        .where('timestamp', '>=', startDate.getTime())
        .where('timestamp', '<=', endDate.getTime())
        .get();

      const actions = actionsSnapshot.docs.map(doc => doc.data());

      const stats = {
        totalReports: reports.length,
        resolvedReports: reports.filter(r => r.status === 'resolved').length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        reportsByCategory: this.groupBy(reports, 'category'),
        reportsByContentType: this.groupBy(reports, 'contentType'),
        
        totalActions: actions.length,
        actionsByType: this.groupBy(actions, 'action'),
        
        averageResolutionTime: this.calculateAverageResolutionTime(reports),
        moderatorActivity: this.getModeratorsActivity(actions),
        
        autoModerationStats: await this.getAutoModerationStats(startDate, endDate),
        
        falsePositiveRate: this.calculateFalsePositiveRate(reports),
        userSatisfactionRate: await this.getUserSatisfactionRate(reports)
      };

      return stats;

    } catch (error) {
      console.error('Error getting moderation stats:', error);
      return {};
    }
  }

  /**
   * Configurar reglas de moderación automática
   */
  static async updateAutoModerationRules(rules) {
    try {
      await db.collection('moderation_config').doc('auto_rules').set({
        ...rules,
        updatedAt: Date.now()
      }, { merge: true });

      // Actualizar cache local
      this.autoModerationRules.clear();
      Object.entries(rules).forEach(([key, value]) => {
        this.autoModerationRules.set(key, value);
      });

      return { success: true };

    } catch (error) {
      console.error('Error updating auto moderation rules:', error);
      return { success: false, error: error.message };
    }
  }

  // Métodos de verificación específicos
  static async checkProfanity(content) {
    const profanityWords = [
      // Lista de palabras prohibidas
      'palabra1', 'palabra2', // Ejemplo
    ];

    const text = (content.description || '') + ' ' + (content.title || '');
    const foundWords = profanityWords.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );

    return {
      flagged: foundWords.length > 0,
      confidence: foundWords.length > 0 ? 0.8 : 0,
      details: foundWords
    };
  }

  static async checkSpam(content) {
    // Implementar detección de spam
    const spamIndicators = [
      /contáctame/gi,
      /whatsapp/gi,
      /llámame/gi,
      /precio especial/gi
    ];

    const text = (content.description || '') + ' ' + (content.title || '');
    const matches = spamIndicators.filter(pattern => pattern.test(text));

    return {
      flagged: matches.length >= 2,
      confidence: Math.min(matches.length * 0.3, 0.9),
      details: matches.length
    };
  }

  static async checkContactInfo(content) {
    // Detectar números de teléfono y emails
    const phonePattern = /\b\d{8,}\b/g;
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    const text = (content.description || '') + ' ' + (content.title || '');
    const phones = text.match(phonePattern) || [];
    const emails = text.match(emailPattern) || [];

    return {
      flagged: phones.length > 0 || emails.length > 0,
      confidence: (phones.length + emails.length) > 0 ? 0.6 : 0,
      details: { phones: phones.length, emails: emails.length }
    };
  }

  static async checkImages(images) {
    // Implementar análisis de imágenes con IA
    // Por ahora, retornar resultado simulado
    return {
      flagged: false,
      confidence: 0,
      details: 'Image analysis not implemented'
    };
  }

  // Métodos auxiliares
  static getStrikeValue(severity) {
    const values = {
      'low': 0.5,
      'medium': 1,
      'high': 2,
      'severe': 3
    };
    return values[severity] || 1;
  }

  static groupBy(array, key) {
    return array.reduce((groups, item) => {
      const value = item[key] || 'undefined';
      groups[value] = (groups[value] || 0) + 1;
      return groups;
    }, {});
  }

  static calculateAverageResolutionTime(reports) {
    const resolved = reports.filter(r => r.resolvedAt);
    if (resolved.length === 0) return 0;
    
    const totalTime = resolved.reduce((sum, r) => 
      sum + (r.resolvedAt - r.createdAt), 0
    );
    
    return totalTime / resolved.length;
  }

  // Métodos de acción
  static async warnUser(userId, reason, moderatorId) {
    // Implementar warning de usuario
    return { success: true };
  }

  static async removeContent(contentType, contentId, reason, moderatorId) {
    // Implementar eliminación de contenido
    return { success: true };
  }

  static async suspendUser(userId, severity, reason, moderatorId) {
    // Implementar suspensión de usuario
    return { success: true };
  }

  static async banUser(userId, reason, moderatorId) {
    // Implementar ban de usuario
    return { success: true };
  }

  static async autoHideContent(content) {
    // Implementar ocultación automática
    console.log('Auto-hiding content:', content.contentId);
  }

  static async logModerationAction(action) {
    try {
      await db.collection('moderation_log').add(action);
    } catch (error) {
      console.error('Error logging moderation action:', error);
    }
  }

  static async logAutoModerationResult(content, results) {
    try {
      await db.collection('auto_moderation_log').add({
        contentType: content.contentType,
        contentId: content.contentId,
        results,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error logging auto moderation result:', error);
    }
  }
}
```

### ReportButton Component
```javascript
// src/components/common/ReportButton.js
export class ReportButton {
  constructor(props) {
    this.props = {
      contentType: 'profile',
      contentId: null,
      contentOwnerId: null,
      size: 'small', // small, medium, large
      style: 'icon', // icon, button, link
      className: '',
      ...props
    };
  }

  render() {
    const { size, style, className } = this.props;
    
    const sizeClasses = {
      small: 'w-4 h-4',
      medium: 'w-5 h-5',
      large: 'w-6 h-6'
    };

    if (style === 'button') {
      return `
        <button 
          class="report-btn inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors ${className}"
          data-content-type="${this.props.contentType}"
          data-content-id="${this.props.contentId}"
          data-content-owner-id="${this.props.contentOwnerId}"
        >
          <svg class="${sizeClasses[size]} mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L4.27 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          Reportar
        </button>
      `;
    } else if (style === 'link') {
      return `
        <a 
          href="#" 
          class="report-btn text-sm text-gray-500 hover:text-red-600 transition-colors ${className}"
          data-content-type="${this.props.contentType}"
          data-content-id="${this.props.contentId}"
          data-content-owner-id="${this.props.contentOwnerId}"
        >
          Reportar contenido
        </a>
      `;
    } else {
      // Default: icon style
      return `
        <button 
          class="report-btn p-1 text-gray-400 hover:text-red-600 transition-colors ${className}"
          data-content-type="${this.props.contentType}"
          data-content-id="${this.props.contentId}"
          data-content-owner-id="${this.props.contentOwnerId}"
          title="Reportar contenido"
        >
          <svg class="${sizeClasses[size]}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L4.27 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </button>
      `;
    }
  }

  static bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.report-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.report-btn');
        
        const contentType = btn.dataset.contentType;
        const contentId = btn.dataset.contentId;
        const contentOwnerId = btn.dataset.contentOwnerId;
        
        ReportModal.show({
          contentType,
          contentId,
          contentOwnerId
        });
      }
    });
  }
}
```

## 🧪 Testing

### Moderation System Tests
- [ ] Reportes se crean y procesan correctamente
- [ ] Moderación automática detecta contenido inapropiado
- [ ] Sistema de strikes funciona adecuadamente
- [ ] Herramientas de moderación manual operan bien
- [ ] Analytics de moderación son precisos

### Content Detection Tests
- [ ] Filtros de profanidad funcionan
- [ ] Detección de spam es efectiva
- [ ] Detección de información de contacto
- [ ] Análisis de imágenes (cuando se implemente)

## 🚀 Deployment

### AI Services Setup
- Configurar servicio de análisis de imágenes
- Setup de filtros de texto avanzados
- Integración con servicios de moderación externa

### Performance Optimization
- Cache de reglas de moderación
- Procesamiento asíncrono de análisis
- Índices optimizados para consultas de reportes

## 📦 Dependencies
- Firebase Firestore para reportes y logs
- AI/ML services para análisis automático
- Image analysis APIs
- NotificationService para alertas

## 🔗 Relaciones
- **Depende de**: fase6-0026-admin-dashboard
- **Integra con**: fase6-0027-user-management
- **Usa**: fase5-0010-notification-system

---

**Estado**: 🟡 Pendiente  
**Prioridad**: Alta  
**Estimación**: 22 horas  
**Asignado**: Senior Full Stack Developer  

**Sprint**: Sprint 6 - Administración  
**Deadline**: 7 octubre 2025