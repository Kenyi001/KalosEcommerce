# Ticket #0028: Content Moderation - Sistema de Moderación

**Estado:** 📋 Planificado  
**Prioridad:** Alta  
**Estimación:** 1-2 días  
**Fase:** 6 - Panel de Administración  
**Asignado a:** TBD  

---

## 📋 Descripción

Implementar sistema completo de moderación de contenido para administradores, incluyendo cola de aprobación de profesionales, moderación de servicios/portfolio, gestión de reportes y herramientas de flagging automático.

## 🎯 Objetivos

### Funcionales
- Cola de aprobación de profesionales con workflow completo
- Sistema de reportes de contenido inapropiado
- Moderación de servicios, portfolio e imágenes
- Herramientas de flagging automático
- Gestión de appeals y escalaciones
- Dashboard de moderación con métricas

### Técnicos
- Análisis automático de contenido (texto e imágenes)
- Workflow de aprobación con estados
- Sistema de prioridades y escalación
- Logging completo de decisiones de moderación
- Templates de comunicación con usuarios

## 🔧 Tareas Técnicas

### Backend (Firebase)
- [ ] Crear colección `admin_approvals` para profesionales
- [ ] Crear colección `admin_moderation` para reportes
- [ ] Implementar Cloud Functions para análisis automático
- [ ] Cloud Function para procesamiento de documentos
- [ ] Sistema de notificaciones para moderadores
- [ ] Email templates para comunicación con usuarios
- [ ] Storage rules para documentos de verificación

### Frontend
- [ ] Crear ApprovalQueue para profesionales
- [ ] Implementar ModerationDashboard con métricas
- [ ] Desarrollar ProfessionalApprovalCard
- [ ] Crear ContentModerationCard para reportes
- [ ] Implementar DocumentViewer para verificación
- [ ] Agregar DecisionModal para aprobaciones/rechazos
- [ ] Sistema de notas y comentarios internos

### Componentes Nuevos
```javascript
// Componentes requeridos
ApprovalQueue.js           // Cola principal de aprobaciones
ProfessionalApprovalCard.js // Card de profesional pendiente
DocumentViewer.js          // Visor de documentos
DecisionModal.js           // Modal para aprobar/rechazar
ModerationDashboard.js     // Dashboard de moderación
ContentModerationCard.js   // Card de contenido reportado
ReportDetails.js           // Detalles de reporte
ModerationFilters.js       // Filtros para cola
ApprovalChecklist.js       // Checklist de verificación
CommunicationLog.js        // Log de comunicaciones
```

## 📊 Workflow de Aprobación

### Estados de Profesional
1. **Pending** - Documentos enviados, esperando revisión
2. **In Review** - Asignado a moderador, en proceso
3. **Need Info** - Requiere información adicional
4. **Approved** - Aprobado y activo en plataforma
5. **Rejected** - Rechazado con razón específica

### Checklist de Verificación
- ✅ **Documentos completos**: CI, licencia, certificaciones
- ✅ **Documentos válidos**: Verificación de autenticidad
- ✅ **Perfil completo**: Información básica y servicios
- ✅ **Portfolio adecuado**: Calidad y apropiedad de imágenes
- ✅ **Contacto verificado**: Email y teléfono confirmados

### Decisiones de Moderación
- **Aprobar**: Activar inmediatamente
- **Aprobar con condiciones**: Activar con limitaciones
- **Solicitar información**: Pedir documentos adicionales
- **Rechazar**: Denegar con razón específica
- **Escalar**: Enviar a supervisor para revisión

## 🎨 Mockups UI

### Cola de Aprobación
```
┌─────────────────────────────────────────────────────┐
│ Gestión de Profesionales              [Filtros ▼]  │
├─────────────────────────────────────────────────────┤
│ [Pendientes (8)] [En Revisión (3)] [Completados]   │
├─────────────────────────────────────────────────────┤
│ 📋 Sofia Estilista                   🟡 PENDIENTE  │
│    Sofia Hair Studio • Enviado hace 2 días         │
│    📍 La Paz, Zona Sur • 💄 Cabello               │
│                                                     │
│    📄 Estado de Documentos:                        │
│    ✅ Cédula de Identidad  🟡 Licencia  ✅ Certs   │
│                                                     │
│    📊 Resumen:                                      │
│    • 8 años experiencia • 8 servicios • 12 fotos   │
│                                                     │
│    [✅ Aprobar] [📝 Solicitar Info] [❌ Rechazar]  │
│    [👁️ Ver Detalles] [📧 Contactar]               │
├─────────────────────────────────────────────────────┤
│ 📋 Maria Nails                      🔵 EN REVISIÓN  │
│    Maria Nails Studio • Asignado a: Admin Juan     │
│    📍 Santa Cruz • 💅 Uñas                        │
│    [👀 Revisar] [📝 Notas] [🔄 Reasignar]         │
└─────────────────────────────────────────────────────┘
```

### Modal de Decisión
```
┌─────────────────────────────────────────────────────┐
│ Decisión: Sofia Estilista                     [✕] │
├─────────────────────────────────────────────────────┤
│ 📋 Checklist de Verificación                       │
│ ✅ Documentos completos                             │
│ ✅ Documentos válidos                               │
│ ✅ Perfil completo                                  │
│ ✅ Portfolio adecuado                               │
│ ❌ Contacto verificado (pendiente teléfono)        │
├─────────────────────────────────────────────────────┤
│ 📝 Decisión:                                        │
│ ○ Aprobar inmediatamente                            │
│ ● Aprobar con condiciones                           │
│ ○ Solicitar información adicional                   │
│ ○ Rechazar aplicación                               │
│ ○ Escalar a supervisor                              │
├─────────────────────────────────────────────────────┤
│ 📄 Condiciones/Notas:                              │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Aprobado condicionalmente. Debe verificar      │ │
│ │ número de teléfono en 48 horas.                │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ 📧 Enviar notificación al profesional              │
│ ☑️ Email automático   ☑️ SMS (si disponible)      │
├─────────────────────────────────────────────────────┤
│          [Cancelar] [Guardar Decisión]             │
└─────────────────────────────────────────────────────┘
```

### Moderación de Contenido
```
┌─────────────────────────────────────────────────────┐
│ Moderación de Contenido              🚨 3 urgentes │
├─────────────────────────────────────────────────────┤
│ ⚠️ ALTA PRIORIDAD                                   │
│ 🚨 Contenido Inapropiado - Servicio                │
│    Reportado por: Cliente Usuario • Hace 2 horas   │
│    Profesional: Sofia Estilista                    │
│                                                     │
│ 📋 Reporte:                                         │
│ • Motivo: Contenido inapropiado                     │
│ • Descripción: "Imágenes no apropiadas..."         │
│ • Análisis IA: 🔴 Flaggeado (92% confianza)        │
│                                                     │
│ 🖼️ Contenido: [Ver Imágenes] [Ver Servicio]        │
│                                                     │
│ [✅ Aprobar] [⚠️ Editar] [❌ Remover] [⬆️ Escalar] │
├─────────────────────────────────────────────────────┤
│ 🟡 MEDIA PRIORIDAD                                  │
│ 📝 Información Incorrecta - Perfil                 │
│    Auto-detectado • Hace 1 día                     │
│    [Revisar] [Ignorar] [Contactar]                 │
└─────────────────────────────────────────────────────┘
```

## 🧪 Criterios de Aceptación

### Aprobación de Profesionales
- [ ] Cola muestra profesionales ordenados por prioridad
- [ ] Checklist de verificación funciona correctamente
- [ ] Documentos se visualizan correctamente
- [ ] Decisiones se almacenan con timestamp y admin
- [ ] Notificaciones automáticas se envían
- [ ] SLA de 48-72 horas se cumple

### Moderación de Contenido
- [ ] Reportes se categorizan automáticamente
- [ ] Análisis de IA funciona con precisión >80%
- [ ] Decisiones de moderación son auditables
- [ ] Escalación a supervisores funciona
- [ ] Appeals de usuarios se procesan
- [ ] Time to resolution <24 horas para alta prioridad

### Seguridad y Auditabilidad
- [ ] Todas las decisiones quedan registradas
- [ ] Solo moderadores acceden a contenido flaggeado
- [ ] Documentos personales están protegidos
- [ ] Logs incluyen IP y metadata relevante
- [ ] Backup de decisiones importantes

### Performance
- [ ] Cola carga en <3 segundos
- [ ] Análisis de imágenes <10 segundos
- [ ] Búsqueda de casos funciona eficientemente
- [ ] Bulk actions procesan >100 items

## 📝 Notas de Implementación

### Estructura de Datos
```javascript
// admin_approvals/{approvalId}
{
  approvalId: "approval_001",
  professionalId: "pro_001",
  status: "pending", // pending | in_review | approved | rejected | needs_info
  priority: "normal", // low | normal | high | urgent
  assignedTo: null,
  
  checklist: {
    documentsComplete: false,
    documentsValid: false,
    profileComplete: true,
    portfolioQuality: true,
    contactVerified: false
  },
  
  decision: {
    approved: null,
    approvedAt: null,
    approvedBy: null,
    conditions: [],
    notes: ""
  },
  
  communication: [
    {
      type: "note",
      from: "admin_001", 
      message: "Documentos recibidos",
      timestamp: "2025-08-20T15:00:00-04:00",
      internal: true
    }
  ]
}

// admin_moderation/{moderationId}
{
  moderationId: "mod_001",
  type: "service", // service | portfolio | profile | review
  entityId: "service_001",
  reportedBy: "customer_001",
  reason: "inappropriate_content",
  
  autoAnalysis: {
    textAnalysis: { inappropriate: false, spam: false },
    imageAnalysis: { inappropriate: true, confidence: 0.92 }
  },
  
  review: {
    status: "pending", // pending | in_review | resolved | escalated
    assignedTo: null,
    decision: { action: null, reasoning: "" }
  }
}
```

### Cloud Functions
```javascript
// Análisis automático de contenido
exports.analyzeContent = functions.firestore
  .document('services/{serviceId}')
  .onCreate(async (snap, context) => {
    const service = snap.data();
    
    // Análisis de texto
    const textAnalysis = await analyzeText(service.description);
    
    // Análisis de imágenes  
    const imageAnalysis = await analyzeImages(service.images);
    
    // Si flaggeado, crear caso de moderación
    if (textAnalysis.inappropriate || imageAnalysis.inappropriate) {
      await createModerationCase(service, { textAnalysis, imageAnalysis });
    }
  });

// Notificaciones de decisión
exports.notifyDecision = functions.firestore
  .document('admin_approvals/{approvalId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    if (before.status !== after.status) {
      await sendDecisionNotification(after);
    }
  });
```

### Email Templates
```javascript
const emailTemplates = {
  professionalApproved: {
    subject: "¡Bienvenido a Kalos! Tu cuenta ha sido aprobada",
    template: "professional-approved.html"
  },
  
  professionalRejected: {
    subject: "Estado de tu aplicación en Kalos",
    template: "professional-rejected.html"
  },
  
  needMoreInfo: {
    subject: "Información adicional requerida - Kalos",
    template: "need-more-info.html"
  },
  
  contentRemoved: {
    subject: "Contenido moderado en tu perfil",
    template: "content-moderated.html"
  }
};
```

## 🔗 Dependencias

### Técnicas
- ✅ Dashboard admin (#0026) para navegación
- ✅ User management (#0027) para datos de profesionales
- ⚠️ Cloud Vision API para análisis de imágenes
- ⚠️ Cloud Natural Language API para análisis de texto
- ⚠️ SendGrid para emails automáticos

### Funcionales
- ✅ Profesionales registrados en el sistema
- ✅ Sistema de roles y permisos admin
- ⚠️ Sistema de notificaciones (#0021)
- ⚠️ Storage configurado para documentos

## 🚀 Criterios de Deploy

- [ ] Tests de workflow completo de aprobación
- [ ] Tests de análisis automático con datasets
- [ ] Validación de email templates
- [ ] Performance testing con volumen de casos
- [ ] Security audit de acceso a documentos

---

**Tags:** `admin` `moderation` `approval` `ai-analysis` `workflow`  
**Relacionado:** #0026, #0027, #0029
