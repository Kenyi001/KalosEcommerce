# Ticket #0026: Admin Dashboard - Panel de Administración

**Estado:** 📋 Planificado  
**Prioridad:** Alta  
**Estimación:** 1-2 días  
**Fase:** 6 - Panel de Administración  
**Asignado a:** TBD  

---

## 📋 Descripción

Implementar el dashboard ejecutivo para administradores de la plataforma Kalos E-commerce, proporcionando métricas clave, visualizaciones y herramientas de gestión centralizadas.

## 🎯 Objetivos

### Funcionales
- Dashboard ejecutivo con métricas en tiempo real
- Visualizaciones de datos (charts y gráficos)
- Sistema de navegación admin optimizado
- Cards de métricas clave con tendencias
- Centro de actividad reciente

### Técnicos
- Integración con Firebase Analytics
- Consultas optimizadas a Firestore
- Componentes de visualización reutilizables
- Responsive design para tablets/desktop
- Cache inteligente de métricas

## 🔧 Tareas Técnicas

### Backend (Firebase)
- [ ] Crear colección `admin_metrics` con agregaciones diarias
- [ ] Implementar Cloud Functions para cálculo de métricas
- [ ] Configurar índices compuestos para queries optimizadas
- [ ] Crear security rules para acceso admin
- [ ] Agregar triggers para actualización automática de stats

### Frontend
- [ ] Crear layout base del panel administrativo
- [ ] Implementar sidebar de navegación con roles
- [ ] Desarrollar componente StatCard reutilizable
- [ ] Integrar library de charts (Chart.js o similar)
- [ ] Crear dashboard principal con grid de métricas
- [ ] Implementar centro de actividad en tiempo real
- [ ] Agregar filtros de período (hoy, semana, mes)

### Componentes Nuevos
```javascript
// Componentes requeridos
AdminLayout.js        // Layout base con sidebar
AdminSidebar.js       // Navegación principal
StatCard.js          // Card de métrica individual
ChartContainer.js    // Wrapper para gráficos
ActivityFeed.js      // Feed de actividad reciente
MetricsDashboard.js  // Dashboard principal
AdminHeader.js       // Header con notificaciones admin
```

## 📊 Métricas a Implementar

### Métricas de Usuarios
- Total de usuarios registrados
- Nuevos usuarios (día/semana/mes)
- Usuarios activos
- Distribución cliente vs profesional
- Tasa de retención

### Métricas de Profesionales
- Total profesionales verificados
- Profesionales pendientes de aprobación
- Tiempo promedio de aprobación
- Rating promedio de profesionales
- Profesionales más activos

### Métricas de Reservas
- Total reservas realizadas
- Reservas por estado
- Tasa de conversión (búsqueda → reserva)
- Valor promedio de reserva
- Categorías más populares

### Métricas de Contenido
- Servicios publicados
- Items de portfolio
- Contenido flaggeado pendiente
- Reportes por resolver

## 🎨 Mockups UI

### Dashboard Principal
```
┌─────────────────────────────────────────────────────┐
│ [🏠 Logo] Panel de Administración    [🔔][👤 Admin] │
├─────────────────────────────────────────────────────┤
│ Sidebar │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│ 📊 Dash │ │1,250│ │ 125 │ │ 456 │ │67,890│        │
│ 👥 Users│ │Users│ │ Pros│ │Books│ │ Bs. │        │
│ 👨‍🎨 Pros│ │+12% │ │ +8  │ │+23% │ │+15% │        │
│ 📅 Books│ └─────┘ └─────┘ └─────┘ └─────┘        │
│ 🛡️ Mod  │                                          │
│ 📈 Anal │ ┌─────────────┐ ┌─────────────┐        │
│ ⚙️ Config│ │Revenue Chart│ │User Growth  │        │
│         │ │             │ │             │        │
│         │ └─────────────┘ └─────────────┘        │
│         │                                          │
│         │ Recent Activity:                         │
│         │ • New professional registered - 5 min   │
│         │ • Booking completed - 15 min             │
│         │ • Content reported - 1 hour              │
└─────────────────────────────────────────────────────┘
```

## 🧪 Criterios de Aceptación

### Funcionalidad
- [ ] Dashboard carga métricas correctas en <3 segundos
- [ ] Todas las visualizaciones responden a filtros de período
- [ ] Activity feed se actualiza en tiempo real
- [ ] Navegación entre secciones es fluida
- [ ] Métricas coinciden con datos reales de Firestore

### UI/UX
- [ ] Design system Kalos aplicado consistentemente
- [ ] Responsive en tablet (768px+) y desktop
- [ ] Sidebar colapsable en pantallas pequeñas
- [ ] Tooltips informativos en métricas
- [ ] Loading states para todas las queries

### Performance
- [ ] First contentful paint <2 segundos
- [ ] Métricas cachean por 5 minutos
- [ ] Charts renderizan sin bloquear UI
- [ ] Memory usage optimizado en navegación

### Seguridad
- [ ] Solo admins pueden acceder a rutas `/admin/*`
- [ ] Validación de permisos en cada operación
- [ ] Logs de todas las acciones administrativas
- [ ] Session timeout configurado apropiadamente

## 📝 Notas de Implementación

### Estructura de Datos
```javascript
// admin_metrics/{date}
{
  date: "2025-08-22",
  period: "daily",
  users: { total: 1250, new: 12, active: 89 },
  professionals: { total: 145, verified: 132, pending: 8 },
  bookings: { total: 3450, today: 15, conversion: 0.68 },
  // ... más métricas
}
```

### Performance Considerations
- Usar Firebase Analytics para datos históricos
- Cache de métricas con TTL de 5 minutos
- Lazy loading de charts no visibles
- Virtual scrolling en listas largas

### Security Rules
```javascript
match /admin_metrics/{document} {
  allow read: if hasAdminRole(['super_admin', 'platform_admin']);
}
```

## 🔗 Dependencias

### Técnicas
- ✅ Sistema de autenticación con roles admin
- ✅ Firestore configurado y poblado con datos
- ⚠️ Chart.js o library de visualización
- ⚠️ Date manipulation library (date-fns)

### Funcionales
- ✅ Al menos datos básicos de usuarios y profesionales
- ⚠️ Sistema de notificaciones (para activity feed)
- ⚠️ Algunas reservas de ejemplo en el sistema

## 🚀 Criterios de Deploy

- [ ] Tests unitarios para cálculos de métricas
- [ ] Tests de integración con Firebase
- [ ] Performance testing con datos de volumen
- [ ] Validación de security rules
- [ ] Documentation de API admin actualizada

---

**Tags:** `admin` `dashboard` `metrics` `firebase` `charts`  
**Relacionado:** #0027, #0028, #0029
