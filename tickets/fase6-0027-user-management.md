# Ticket #0027: User Management - Gestión de Usuarios Admin

**Estado:** 📋 Planificado  
**Prioridad:** Alta  
**Estimación:** 1 día  
**Fase:** 6 - Panel de Administración  
**Asignado a:** TBD  

---

## 📋 Descripción

Implementar el sistema de gestión de usuarios para administradores, incluyendo CRUD completo de clientes y profesionales, suspensión de cuentas, y herramientas de moderación de usuarios.

## 🎯 Objetivos

### Funcionales
- Lista paginada de todos los usuarios
- Filtros avanzados (tipo, estado, fecha registro)
- Búsqueda por nombre, email, teléfono
- Acciones de moderación (suspender, reactivar, eliminar)
- Vista detallada de perfil de usuario
- Historial de actividad por usuario

### Técnicos
- Queries eficientes con paginación
- Índices optimizados para búsquedas
- Bulk operations para acciones masivas
- Logging de todas las acciones admin
- Cache inteligente de listas

## 🔧 Tareas Técnicas

### Backend (Firebase)
- [ ] Crear índices compuestos para queries de usuarios
- [ ] Implementar Cloud Function para búsqueda full-text
- [ ] Agregar campos de moderación a colección `users`
- [ ] Crear colección `user_actions` para logging admin
- [ ] Security rules para operaciones admin en usuarios
- [ ] Cloud Function para suspensión/reactivación

### Frontend
- [ ] Crear componente UsersList con paginación
- [ ] Implementar filtros y búsqueda en tiempo real
- [ ] Desarrollar modal de detalles de usuario
- [ ] Agregar acciones bulk (selección múltiple)
- [ ] Crear formulario de edición de usuario
- [ ] Implementar confirmaciones para acciones críticas
- [ ] Historial de actividad del usuario

### Componentes Nuevos
```javascript
// Componentes requeridos
UsersList.js         // Lista principal con filtros
UserCard.js          // Card de usuario en lista
UserDetailModal.js   // Modal de detalles completos
UserEditForm.js      // Formulario de edición
UserFilters.js       // Panel de filtros avanzados
UserSearch.js        // Búsqueda con autocompletado
UserActions.js       // Botones de acciones
BulkActions.js       // Acciones en masa
UserActivityLog.js   // Log de actividad
```

## 📊 Funcionalidades de Gestión

### Vista de Lista
- **Información básica**: Avatar, nombre, email, tipo, estado
- **Métricas**: Fecha registro, última actividad, reservas
- **Estados**: Activo, suspendido, pendiente verificación
- **Acciones rápidas**: Ver, editar, suspender, mensaje

### Filtros y Búsqueda
- **Por tipo**: Cliente, profesional, admin
- **Por estado**: Activo, suspendido, pendiente, eliminado
- **Por fecha**: Registro, última actividad
- **Por ubicación**: Ciudad, zona
- **Por actividad**: Con/sin reservas, verificados
- **Búsqueda**: Nombre, email, teléfono, ID

### Acciones de Moderación
- **Suspender**: Deshabilitar cuenta temporalmente
- **Reactivar**: Restaurar cuenta suspendida
- **Eliminar**: Soft delete con período de gracia
- **Verificar**: Marcar profesional como verificado
- **Enviar mensaje**: Comunicación directa
- **Ver actividad**: Historial completo

## 🎨 Mockups UI

### Lista de Usuarios
```
┌─────────────────────────────────────────────────────┐
│ Gestión de Usuarios              [+ Nuevo] [Export] │
├─────────────────────────────────────────────────────┤
│ 🔍 [Buscar usuarios...]    [Filtros ▼] [Bulk ▼]   │
├─────────────────────────────────────────────────────┤
│ ☐ [👤] Ana García               Cliente    🟢 Activo│
│    ana@example.com • +591 70000000 • Hace 2 días   │
│    📅 Registrado: 15 Aug • 🛒 3 reservas           │
│    [Ver] [Editar] [Suspender] [Mensaje]            │
├─────────────────────────────────────────────────────┤
│ ☐ [👨‍🎨] Sofia Estilista         Profesional 🟡 Pend.│
│    sofia@example.com • +591 70000001 • Hace 1 hora │
│    📅 Registrado: 20 Aug • ✅ Verificación pend.   │
│    [Ver] [Aprobar] [Rechazar] [Mensaje]            │
├─────────────────────────────────────────────────────┤
│ ☐ [👤] Carlos Rivera            Cliente    🔴 Susp. │
│    carlos@example.com • +591 70000002 • Hace 1 sem │
│    📅 Registrado: 10 Aug • ⚠️ Reportado            │
│    [Ver] [Reactivar] [Eliminar] [Historial]        │
├─────────────────────────────────────────────────────┤
│ [1] [2] [3] ... [10] →    Mostrando 1-20 de 1,250  │
└─────────────────────────────────────────────────────┘
```

### Modal de Detalles
```
┌─────────────────────────────────────────────────────┐
│ Detalles de Usuario                            [✕] │
├─────────────────────────────────────────────────────┤
│ [👤 Avatar]  Ana García                             │
│              ana@example.com                        │
│              +591 70000000                          │
│              🟢 Cliente Activo                      │
├─────────────────────────────────────────────────────┤
│ 📋 Información                                      │
│ • ID: usr_001                                       │
│ • Registrado: 15 Aug 2025 14:30                     │
│ • Última actividad: Hace 2 días                     │
│ • Ubicación: La Paz, Zona Sur                       │
│ • Verificado: ✅ Email, ❌ Teléfono                 │
├─────────────────────────────────────────────────────┤
│ 📊 Estadísticas                                     │
│ • Total reservas: 3                                 │
│ • Reservas completadas: 2                           │
│ • Reservas canceladas: 1                            │
│ • Gasto total: Bs. 375                              │
│ • Rating promedio dado: 4.5⭐                       │
├─────────────────────────────────────────────────────┤
│ 🕒 Actividad Reciente                               │
│ • Completó reserva "Corte femenino" - Hace 2 días  │
│ • Buscó "uñas gel" - Hace 3 días                    │
│ • Actualizó perfil - Hace 1 semana                  │
├─────────────────────────────────────────────────────┤
│ [Editar] [Suspender] [Enviar Mensaje] [Historial]  │
└─────────────────────────────────────────────────────┘
```

## 🧪 Criterios de Aceptación

### Funcionalidad
- [ ] Lista carga 50 usuarios en <2 segundos
- [ ] Búsqueda funciona con mínimo 2 caracteres
- [ ] Filtros se aplican correctamente y persisten
- [ ] Paginación maneja >1000 usuarios eficientemente
- [ ] Acciones de moderación ejecutan correctamente
- [ ] Bulk actions funcionan para selecciones múltiples

### UI/UX
- [ ] Tabla responsive con scroll horizontal en mobile
- [ ] Loading states durante búsquedas y acciones
- [ ] Confirmaciones para acciones destructivas
- [ ] Feedback visual para estados de usuario
- [ ] Acceso fácil a información más relevante

### Seguridad
- [ ] Solo admins pueden ver datos sensibles
- [ ] Logging completo de todas las acciones admin
- [ ] Validación de permisos para cada operación
- [ ] Rate limiting en búsquedas
- [ ] Protección contra modificaciones accidentales

### Performance
- [ ] Queries paginadas eficientemente
- [ ] Cache de resultados de búsqueda
- [ ] Debounce en búsqueda de texto
- [ ] Lazy loading de avatares e imágenes
- [ ] Optimistic updates en acciones comunes

## 📝 Notas de Implementación

### Estructura de Datos
```javascript
// users/{userId} - campos adicionales para admin
{
  // ... campos existentes del usuario
  admin: {
    status: "active", // active | suspended | deleted | pending
    suspendedAt: null,
    suspendedBy: null,
    suspensionReason: "",
    suspensionExpires: null,
    
    verification: {
      level: "basic", // basic | verified | premium
      verifiedAt: "2025-08-20T10:00:00-04:00",
      verifiedBy: "admin_001",
      documents: ["nationalId", "businessLicense"]
    },
    
    activity: {
      lastSeen: "2025-08-22T10:00:00-04:00",
      loginCount: 23,
      sessionDuration: 420, // seconds average
      deviceInfo: "Chrome 125 / Windows"
    },
    
    moderation: {
      warningsCount: 0,
      reportsReceived: 0,
      reportsMade: 1,
      notesFromAdmin: []
    }
  }
}

// admin_user_actions/{actionId}
{
  actionId: "action_001",
  adminId: "admin_001",
  targetUserId: "usr_001",
  action: "suspend", // view | edit | suspend | reactivate | delete | message
  reason: "Inappropriate behavior reported",
  details: { suspensionDays: 7 },
  timestamp: "2025-08-22T10:00:00-04:00",
  ipAddress: "192.168.1.100"
}
```

### Firestore Indexes
```javascript
// Índices requeridos para queries eficientes
users: [
  { fields: ["type", "admin.status"], order: "desc" },
  { fields: ["admin.status", "createdAt"], order: "desc" },
  { fields: ["type", "createdAt"], order: "desc" },
  { fields: ["admin.activity.lastSeen"], order: "desc" }
]
```

### Security Rules
```javascript
match /users/{userId} {
  allow read, write: if hasAdminRole(['super_admin', 'platform_admin']);
  allow read: if hasAdminRole(['support_agent', 'content_moderator']) 
              && resource.data.admin.status != 'deleted';
}

match /admin_user_actions/{actionId} {
  allow create: if hasAdminRole(['super_admin', 'platform_admin', 'support_agent']);
  allow read: if hasAdminRole(['super_admin', 'platform_admin']);
}
```

## 🔗 Dependencias

### Técnicas
- ✅ Sistema de autenticación admin (#0026)
- ✅ Firestore con colección users poblada
- ⚠️ Sistema de logging admin
- ⚠️ Email/SMS para notificaciones a usuarios

### Funcionales
- ✅ Usuarios registrados en el sistema
- ⚠️ Sistema de notificaciones (#0021)
- ⚠️ Dashboard admin (#0026) para navegación

## 🚀 Criterios de Deploy

- [ ] Tests de queries con datasets grandes (1000+ usuarios)
- [ ] Tests de security rules para diferentes roles admin
- [ ] Performance testing de búsquedas y filtros
- [ ] Validación de bulk operations
- [ ] Tests de logging y auditoría

---

**Tags:** `admin` `users` `moderation` `crud` `security`  
**Relacionado:** #0026, #0028, #0029
