# Ticket #0029: Platform Configuration - Configuración de Plataforma

**Estado:** 📋 Planificado  
**Prioridad:** Media  
**Estimación:** 1 día  
**Fase:** 6 - Panel de Administración  
**Asignado a:** TBD  

---

## 📋 Descripción

Implementar sistema de configuración centralizada para administradores, permitiendo gestionar settings globales de la plataforma, categorías de servicios, políticas, límites y parámetros operativos.

## 🎯 Objetivos

### Funcionales
- Panel de configuración global de la plataforma
- Gestión de categorías y subcategorías de servicios
- Configuración de políticas y límites operativos
- Settings de notificaciones y comunicaciones
- Configuración de precios y comisiones (futuro)
- Gestión de contenido legal (términos, privacidad)

### Técnicos
- Interface administrativa para Firebase Remote Config
- Validación de configuraciones antes de aplicar
- Historial de cambios de configuración
- Rollback de configuraciones problemáticas
- Sincronización automática con apps cliente

## 🔧 Tareas Técnicas

### Backend (Firebase)
- [ ] Configurar Firebase Remote Config
- [ ] Crear colección `admin_config` para settings
- [ ] Implementar Cloud Functions para validación de config
- [ ] Sistema de versionado de configuraciones
- [ ] Backup automático antes de cambios
- [ ] Notificaciones admin para cambios críticos

### Frontend
- [ ] Crear ConfigurationPanel principal
- [ ] Implementar CategoryManager para servicios
- [ ] Desarrollar SettingsForm con validación
- [ ] Agregar PolicyEditor para términos legales
- [ ] Sistema de preview antes de aplicar cambios
- [ ] ChangeHistory para auditoría
- [ ] Confirmaciones para cambios críticos

### Componentes Nuevos
```javascript
// Componentes requeridos
ConfigurationPanel.js    // Panel principal
CategoryManager.js       // Gestión de categorías
ServiceCategoryForm.js   // Formulario categorías
SettingsForm.js         // Configuraciones generales
PolicyEditor.js         // Editor de políticas
LimitsConfig.js         // Configuración de límites
NotificationSettings.js  // Settings de notificaciones
ChangeHistory.js        // Historial de cambios
ConfigPreview.js        // Preview de cambios
BackupRestore.js        // Backup y restore
ValidationPanel.js      // Validación de configs
```

## 📊 Configuraciones Disponibles

### Configuración General
- **Información básica**: Nombre, descripción, contacto
- **Estados operativos**: Modo mantenimiento, registros abiertos
- **Configuración regional**: Idioma, zona horaria, moneda
- **Branding**: Logo, colores, favicon

### Gestión de Servicios
- **Categorías principales**: Cabello, uñas, maquillaje, etc.
- **Subcategorías**: Por cada categoría principal
- **Límites de servicios**: Máximo por profesional
- **Precios**: Rangos mínimos y máximos
- **Zonas de servicio**: Ciudades y límites geográficos

### Políticas Operativas
- **Reservas**: Anticipación mínima, cancelaciones
- **Profesionales**: Requisitos, documentos, verificación
- **Contenido**: Moderación, límites de imágenes
- **Usuarios**: Límites de actividad, restricciones

### Configuración Técnica
- **APIs**: Límites de rate limiting
- **Storage**: Tamaños máximos de archivos
- **Notificaciones**: Proveedores, templates
- **Analytics**: Tracking, métricas habilitadas

## 🎨 Mockups UI

### Panel Principal
```
┌─────────────────────────────────────────────────────┐
│ Configuración de Plataforma                        │
├─────────────────────────────────────────────────────┤
│ [General] [Servicios] [Políticas] [Técnico] [Legal]│
├─────────────────────────────────────────────────────┤
│ 📋 CONFIGURACIÓN GENERAL                            │
│                                                     │
│ 🏢 Información de la Plataforma                     │
│ Nombre: [Kalos E-commerce                     ]    │
│ Descripción: [Marketplace de servicios...    ]    │
│ Email soporte: [soporte@kalos.com            ]    │
│ Teléfono: [+591 70000000                     ]    │
│                                                     │
│ ⚙️ Estados Operativos                               │
│ ☐ Modo mantenimiento                               │
│ ☑️ Registros de nuevos usuarios abiertos           │
│ ☑️ Navegación de invitados habilitada             │
│                                                     │
│ 🌍 Configuración Regional                           │
│ Idioma principal: [Español ▼]                      │
│ Zona horaria: [America/La_Paz ▼]                   │
│ Moneda: [BOB - Boliviano ▼]                        │
│                                                     │
│ [Guardar Cambios] [Previsualizar] [Historial]      │
└─────────────────────────────────────────────────────┘
```

### Gestión de Categorías
```
┌─────────────────────────────────────────────────────┐
│ Gestión de Categorías de Servicios        [+ Nueva] │
├─────────────────────────────────────────────────────┤
│ 💇‍♀️ Cabello                               ✅ Activa │
│    • Corte femenino • Corte masculino              │
│    • Coloración • Tratamientos • Peinados          │
│    [Editar] [Subcategorías] [Desactivar]           │
├─────────────────────────────────────────────────────┤
│ 💅 Uñas                                   ✅ Activa │
│    • Manicure • Pedicure • Uñas gel                │
│    • Nail art • Decoración                         │
│    [Editar] [Subcategorías] [Desactivar]           │
├─────────────────────────────────────────────────────┤
│ 💄 Maquillaje                             ✅ Activa │
│    • Maquillaje social • Maquillaje de novia       │
│    • Maquillaje profesional • Caracterización      │
│    [Editar] [Subcategorías] [Desactivar]           │
├─────────────────────────────────────────────────────┤
│ 🧖‍♀️ Cuidado facial                         ❌ Inactiva│
│    • Limpieza facial • Tratamientos anti-edad      │
│    [Editar] [Subcategorías] [Activar]              │
└─────────────────────────────────────────────────────┘
```

### Configuración de Límites
```
┌─────────────────────────────────────────────────────┐
│ Límites y Restricciones                            │
├─────────────────────────────────────────────────────┤
│ 👥 LÍMITES DE USUARIOS                              │
│ Máx. usuarios nuevos por día: [1000        ] pers. │
│ Máx. reservas por usuario: [10           ] reservas │
│ Máx. búsquedas por hora: [100          ] búsquedas │
│                                                     │
│ 👨‍🎨 LÍMITES DE PROFESIONALES                         │
│ Máx. servicios por profesional: [50      ] servs.  │
│ Máx. items en portfolio: [100         ] fotos      │
│ Precio mínimo servicio: [Bs. 10       ]            │
│ Precio máximo servicio: [Bs. 1000     ]            │
│ Radio máximo de servicio: [50         ] km         │
│                                                     │
│ 📁 LÍMITES DE CONTENIDO                             │
│ Tamaño máximo imagen: [5             ] MB          │
│ Tipos de archivo: [jpg, png, webp     ]            │
│ Máx. imágenes por servicio: [5        ] imágenes   │
│ Máx. upload diario: [50              ] MB          │
│                                                     │
│ [Restaurar Defaults] [Guardar] [Validar]           │
└─────────────────────────────────────────────────────┘
```

## 🧪 Criterios de Aceptación

### Funcionalidad
- [ ] Configuraciones se guardan y aplican correctamente
- [ ] Cambios se sincronizán en tiempo real con apps
- [ ] Validación previene configuraciones inválidas
- [ ] Rollback funciona para cambios problemáticos
- [ ] Historial registra todos los cambios

### Gestión de Categorías
- [ ] CRUD completo de categorías y subcategorías
- [ ] Reordenamiento drag-and-drop funciona
- [ ] Activar/desactivar categorías actualiza búsquedas
- [ ] Migración de servicios al cambiar categorías
- [ ] Validación de categorías vacías

### Validación y Seguridad
- [ ] Valores numéricos tienen rangos válidos
- [ ] Configuraciones críticas requieren confirmación
- [ ] Solo super admins pueden cambiar settings críticos
- [ ] Cambios quedan registrados con timestamp y admin
- [ ] Backup automático antes de aplicar cambios

### Performance y UX
- [ ] Panel carga configuraciones en <2 segundos
- [ ] Preview muestra efectos antes de aplicar
- [ ] Formularios tienen validación en tiempo real
- [ ] Loading states durante guardado/aplicación
- [ ] Feedback claro sobre éxito/error de cambios

## 📝 Notas de Implementación

### Estructura de Datos
```javascript
// admin_config (documento único)
{
  general: {
    platformName: "Kalos E-commerce",
    platformDescription: "Marketplace de servicios de belleza",
    supportEmail: "soporte@kalos.com",
    maintenanceMode: false,
    newRegistrations: true,
    guestBrowsing: true
  },
  
  services: {
    categories: [
      {
        id: "hair",
        name: "Cabello", 
        icon: "💇‍♀️",
        active: true,
        order: 1,
        subcategories: [
          { id: "hair-cut-women", name: "Corte femenino" },
          { id: "hair-cut-men", name: "Corte masculino" },
          { id: "hair-color", name: "Coloración" }
        ]
      }
    ],
    maxServicesPerProfessional: 50,
    minServicePrice: 10,
    maxServicePrice: 1000
  },
  
  bookings: {
    allowSameDayBooking: true,
    minAdvanceHours: 2,
    maxAdvanceDays: 60,
    cancellationPolicy: "24h_free_cancellation"
  },
  
  content: {
    maxImageSize: 5242880, // 5MB
    allowedImageTypes: ["jpg", "jpeg", "png", "webp"],
    maxImagesPerService: 5,
    requireModeration: true
  },
  
  limits: {
    maxUsersPerDay: 1000,
    maxBookingsPerUser: 10,
    maxSearchesPerHour: 100,
    maxUploadSizeMB: 50
  },
  
  // Metadata
  lastUpdated: "2025-08-22T10:00:00-04:00",
  updatedBy: "admin_001",
  version: "1.0"
}

// config_history/{changeId}
{
  changeId: "change_001",
  adminId: "admin_001",
  section: "limits", // general | services | bookings | content | limits
  changes: {
    before: { maxUsersPerDay: 500 },
    after: { maxUsersPerDay: 1000 }
  },
  reason: "Increasing capacity for beta launch",
  timestamp: "2025-08-22T10:00:00-04:00",
  applied: true,
  rolledBack: false
}
```

### Firebase Remote Config Integration
```javascript
// Sincronización con Remote Config
const syncRemoteConfig = async (configSection, newValues) => {
  const remoteConfig = getRemoteConfig();
  
  // Actualizar parámetros
  for (const [key, value] of Object.entries(newValues)) {
    await setParameter(remoteConfig, key, JSON.stringify(value));
  }
  
  // Publicar cambios
  await publishTemplate(remoteConfig);
  
  // Log del cambio
  await logConfigChange(configSection, newValues);
};
```

### Validación de Configuraciones
```javascript
const validateConfig = (section, values) => {
  const validators = {
    limits: {
      maxUsersPerDay: (val) => val > 0 && val <= 10000,
      maxBookingsPerUser: (val) => val > 0 && val <= 100,
      maxImageSize: (val) => val > 0 && val <= 10485760 // 10MB max
    },
    
    services: {
      minServicePrice: (val) => val >= 1,
      maxServicePrice: (val) => val <= 10000,
      maxServicesPerProfessional: (val) => val > 0 && val <= 200
    }
  };
  
  return Object.entries(values).every(([key, value]) => {
    const validator = validators[section]?.[key];
    return !validator || validator(value);
  });
};
```

### Backup y Rollback
```javascript
// Backup automático antes de cambios
const createConfigBackup = async () => {
  const currentConfig = await getAdminConfig();
  
  await setDoc(doc(db, 'config_backups', new Date().toISOString()), {
    config: currentConfig,
    timestamp: serverTimestamp(),
    autoBackup: true
  });
};

// Rollback a configuración anterior
const rollbackConfig = async (backupId) => {
  const backup = await getDoc(doc(db, 'config_backups', backupId));
  const backupConfig = backup.data().config;
  
  await setDoc(doc(db, 'admin_config', 'main'), backupConfig);
  await syncRemoteConfig('all', backupConfig);
  
  // Log rollback
  await logConfigChange('rollback', { backupId });
};
```

## 🔗 Dependencias

### Técnicas
- ✅ Dashboard admin (#0026) para navegación
- ✅ Firebase Remote Config configurado
- ⚠️ Sistema de validación robusto
- ⚠️ Backup automático configurado

### Funcionales
- ✅ Sistema de roles admin establecido
- ✅ Datos de servicios existentes para migración
- ⚠️ Categories en uso por profesionales
- ⚠️ Sistema de notificaciones para alertas

## 🚀 Criterios de Deploy

- [ ] Tests de validación de todas las configuraciones
- [ ] Tests de sincronización Remote Config
- [ ] Backup/restore funciona correctamente
- [ ] Migración de configuraciones existentes
- [ ] Performance testing con configuraciones complejas

---

**Tags:** `admin` `configuration` `remote-config` `categories` `limits`  
**Relacionado:** #0026, #0027, #0028
