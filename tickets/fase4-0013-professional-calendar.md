# Ticket Fase 4-0013: Calendar y Gestión de Reservas del Profesional

## 📋 Descripción
Crear interface de calendario para que el profesional visualice, gestione y configure sus reservas, disponibilidad y horarios de trabajo.

## 🎯 Objetivos
- Vista de calendario con reservas confirmadas
- Gestión de disponibilidad y horarios
- Aceptar/rechazar solicitudes pendientes
- Configuración de excepciones (vacaciones, días libres)
- Vista móvil optimizada para gestión diaria
- Sincronización en tiempo real

## 📊 Criterios de Aceptación

### ✅ Vista de Calendario
- [ ] Calendario mensual con reservas marcadas
- [ ] Vista semanal detallada
- [ ] Vista diaria para gestión específica
- [ ] Color coding por estado de reserva
- [ ] Navegación fluida entre vistas

### ✅ Gestión de Reservas
- [ ] Lista de solicitudes pendientes
- [ ] Aceptar reserva con confirmación
- [ ] Rechazar reserva con motivo
- [ ] Cancelar reserva existente
- [ ] Reprogramar reserva (drag & drop)
- [ ] Notificaciones automáticas al cliente

### ✅ Configuración de Disponibilidad
- [ ] Horarios de trabajo por día de semana
- [ ] Marcar días como no disponibles
- [ ] Configurar vacaciones/ausencias
- [ ] Tiempo de descanso entre citas
- [ ] Tipos de servicios por horario

### ✅ Detalles de Reserva
- [ ] Modal con información completa
- [ ] Datos del cliente y servicio
- [ ] Historial de comunicación
- [ ] Opción de agregar notas internas
- [ ] Enlaces de contacto directo

### ✅ Dashboard Metrics
- [ ] Reservas del día/semana
- [ ] Ingresos proyectados
- [ ] Tasa de ocupación
- [ ] Clientes recurrentes
- [ ] Reviews pendientes

## 🔧 Implementación Técnica

### Route Structure
```
/dashboard/calendar → src/pages/dashboard/Calendar.js
```

### Calendar Dashboard Implementation
```javascript
// src/pages/dashboard/Calendar.js
import { bookingService } from '../../services/bookings.js';
import { professionalService } from '../../services/professionals.js';
import { authService } from '../../services/auth.js';

export async function renderCalendar() {
  const user = await authService.getCurrentUser();
  if (!user || user.role !== 'professional') {
    return window.location.href = '/dashboard';
  }

  const today = new Date();
  const [bookings, pendingRequests, availability] = await Promise.all([
    bookingService.getProfessionalBookings(today.getFullYear(), today.getMonth()),
    bookingService.getPendingRequests(),
    professionalService.getAvailability()
  ]);

  return `
    <div class="calendar-dashboard max-w-7xl mx-auto p-6">
      ${renderHeader()}
      ${renderQuickStats(bookings, pendingRequests)}
      
      <div class="grid lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3">
          ${renderCalendarView(bookings, availability)}
        </div>
        <div class="lg:col-span-1">
          ${renderSidebar(pendingRequests)}
        </div>
      </div>
    </div>
  `;
}

function renderHeader() {
  return `
    <header class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-kalos-navy">
          Calendario y reservas
        </h1>
        <p class="text-gray-600 mt-2">
          Gestiona tus citas y disponibilidad
        </p>
      </div>
      <div class="flex gap-3 mt-4 md:mt-0">
        <button class="btn-outline-primary" id="config-availability">
          <i class="icon-settings mr-2"></i>
          Configurar horarios
        </button>
        <button class="btn-primary" id="add-block-time">
          <i class="icon-plus mr-2"></i>
          Bloquear tiempo
        </button>
      </div>
    </header>
  `;
}

function renderQuickStats(bookings, pendingRequests) {
  const today = new Date();
  const todayBookings = bookings.filter(b => 
    new Date(b.date).toDateString() === today.toDateString()
  );
  
  const weekRevenue = calculateWeekRevenue(bookings);
  const occupancyRate = calculateOccupancyRate(bookings);

  return `
    <div class="stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="stat-card bg-white p-4 rounded-lg border shadow-sm">
        <div class="flex items-center">
          <div class="icon-container bg-blue-100 p-2 rounded-lg mr-3">
            <i class="icon-calendar text-blue-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600">Hoy</p>
            <p class="text-2xl font-bold">${todayBookings.length}</p>
          </div>
        </div>
      </div>

      <div class="stat-card bg-white p-4 rounded-lg border shadow-sm">
        <div class="flex items-center">
          <div class="icon-container bg-yellow-100 p-2 rounded-lg mr-3">
            <i class="icon-clock text-yellow-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600">Pendientes</p>
            <p class="text-2xl font-bold">${pendingRequests.length}</p>
          </div>
        </div>
      </div>

      <div class="stat-card bg-white p-4 rounded-lg border shadow-sm">
        <div class="flex items-center">
          <div class="icon-container bg-green-100 p-2 rounded-lg mr-3">
            <i class="icon-dollar text-green-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600">Esta semana</p>
            <p class="text-2xl font-bold">Bs. ${weekRevenue}</p>
          </div>
        </div>
      </div>

      <div class="stat-card bg-white p-4 rounded-lg border shadow-sm">
        <div class="flex items-center">
          <div class="icon-container bg-purple-100 p-2 rounded-lg mr-3">
            <i class="icon-chart text-purple-600"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600">Ocupación</p>
            <p class="text-2xl font-bold">${occupancyRate}%</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCalendarView(bookings, availability) {
  return `
    <div class="calendar-container bg-white rounded-lg border shadow-sm">
      <div class="calendar-header p-4 border-b">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h2 class="text-lg font-semibold" id="current-month">
              ${getCurrentMonthYear()}
            </h2>
            <div class="calendar-nav flex gap-2">
              <button class="btn-icon" id="prev-month">
                <i class="icon-chevron-left"></i>
              </button>
              <button class="btn-icon" id="next-month">
                <i class="icon-chevron-right"></i>
              </button>
            </div>
          </div>
          <div class="view-toggle flex bg-gray-100 rounded-lg p-1">
            <button class="view-btn active" data-view="month">Mes</button>
            <button class="view-btn" data-view="week">Semana</button>
            <button class="view-btn" data-view="day">Día</button>
          </div>
        </div>
      </div>

      <div class="calendar-body">
        <div id="month-view" class="calendar-view active">
          ${renderMonthView(bookings, availability)}
        </div>
        <div id="week-view" class="calendar-view">
          ${renderWeekView(bookings, availability)}
        </div>
        <div id="day-view" class="calendar-view">
          ${renderDayView(bookings, availability)}
        </div>
      </div>
    </div>
  `;
}

function renderMonthView(bookings, availability) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  return `
    <div class="month-grid">
      <div class="weekdays grid grid-cols-7 bg-gray-50 border-b">
        ${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => 
          `<div class="weekday p-3 text-center text-sm font-medium text-gray-600">${day}</div>`
        ).join('')}
      </div>
      <div class="days grid grid-cols-7" id="calendar-days">
        ${generateCalendarDays(firstDay, lastDay, bookings, availability)}
      </div>
    </div>
  `;
}

function renderWeekView(bookings, availability) {
  return `
    <div class="week-view-container">
      <div class="time-grid">
        <div class="time-column">
          ${generateTimeSlots().map(time => `
            <div class="time-slot h-16 border-b flex items-center justify-center text-sm text-gray-500">
              ${time}
            </div>
          `).join('')}
        </div>
        <div class="days-grid grid grid-cols-7 gap-px bg-gray-200">
          ${generateWeekDays(bookings, availability)}
        </div>
      </div>
    </div>
  `;
}

function renderDayView(bookings, availability) {
  const today = new Date();
  const dayBookings = bookings.filter(b => 
    new Date(b.date).toDateString() === today.toDateString()
  );

  return `
    <div class="day-view-container p-4">
      <div class="day-header mb-6">
        <h3 class="text-xl font-semibold mb-2">
          ${today.toLocaleDateString('es-BO', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        <p class="text-gray-600">${dayBookings.length} citas programadas</p>
      </div>

      <div class="day-schedule">
        ${dayBookings.length === 0 ? `
          <div class="empty-day text-center py-12">
            <i class="icon-calendar-x text-4xl text-gray-400 mb-4"></i>
            <h4 class="text-lg font-semibold text-gray-600 mb-2">Sin citas programadas</h4>
            <p class="text-gray-500">No tienes citas para hoy</p>
          </div>
        ` : dayBookings.map(booking => renderDayBookingCard(booking)).join('')}
      </div>
    </div>
  `;
}

function renderSidebar(pendingRequests) {
  return `
    <div class="sidebar space-y-6">
      <div class="pending-requests bg-white rounded-lg border shadow-sm">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold">Solicitudes pendientes</h3>
          <p class="text-sm text-gray-600">${pendingRequests.length} esperando respuesta</p>
        </div>
        <div class="requests-list max-h-96 overflow-y-auto">
          ${pendingRequests.length === 0 ? `
            <div class="p-4 text-center text-gray-500">
              <i class="icon-check-circle text-2xl mb-2"></i>
              <p>No hay solicitudes pendientes</p>
            </div>
          ` : pendingRequests.map(request => renderRequestCard(request)).join('')}
        </div>
      </div>

      <div class="quick-actions bg-white rounded-lg border shadow-sm p-4">
        <h3 class="text-lg font-semibold mb-4">Acciones rápidas</h3>
        <div class="space-y-2">
          <button class="w-full btn-outline-primary text-left" id="view-reviews">
            <i class="icon-star mr-2"></i>
            Reviews pendientes
          </button>
          <button class="w-full btn-outline-primary text-left" id="export-calendar">
            <i class="icon-download mr-2"></i>
            Exportar calendario
          </button>
          <button class="w-full btn-outline-primary text-left" id="client-analytics">
            <i class="icon-chart mr-2"></i>
            Análisis de clientes
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderRequestCard(request) {
  return `
    <div class="request-card p-4 border-b hover:bg-gray-50" data-request-id="${request.id}">
      <div class="flex items-start justify-between mb-2">
        <div>
          <h4 class="font-medium">${request.client.name}</h4>
          <p class="text-sm text-gray-600">${request.service.name}</p>
        </div>
        <span class="text-xs text-gray-500">
          ${new Date(request.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <div class="text-sm text-gray-700 mb-3">
        <p><i class="icon-calendar mr-1"></i> ${formatDateTime(request.requestedDate)}</p>
        <p><i class="icon-clock mr-1"></i> ${request.service.duration} min</p>
        <p><i class="icon-dollar mr-1"></i> Bs. ${request.service.price}</p>
      </div>

      <div class="flex gap-2">
        <button class="btn-primary-sm flex-1" data-action="accept" data-request-id="${request.id}">
          Aceptar
        </button>
        <button class="btn-outline-primary-sm flex-1" data-action="reject" data-request-id="${request.id}">
          Rechazar
        </button>
      </div>
    </div>
  `;
}

function renderDayBookingCard(booking) {
  return `
    <div class="booking-card bg-white border rounded-lg p-4 mb-4" data-booking-id="${booking.id}">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
          <div class="time-indicator bg-kalos-coral text-white px-2 py-1 rounded text-sm font-medium">
            ${formatTime(booking.startTime)}
          </div>
          <div>
            <h4 class="font-semibold">${booking.client.name}</h4>
            <p class="text-sm text-gray-600">${booking.service.name}</p>
          </div>
        </div>
        <div class="booking-status">
          <span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span>
        </div>
      </div>
      
      <div class="booking-details text-sm text-gray-600 mb-3">
        <p><i class="icon-clock mr-1"></i> ${booking.service.duration} minutos</p>
        <p><i class="icon-dollar mr-1"></i> Bs. ${booking.service.price}</p>
        ${booking.notes ? `<p><i class="icon-note mr-1"></i> ${booking.notes}</p>` : ''}
      </div>

      <div class="booking-actions flex gap-2">
        <button class="btn-outline-primary-sm" data-action="details" data-booking-id="${booking.id}">
          Ver detalles
        </button>
        <button class="btn-outline-primary-sm" data-action="contact" data-client-id="${booking.client.id}">
          Contactar
        </button>
        ${booking.status === 'confirmed' ? `
          <button class="btn-outline-primary-sm text-red-600" data-action="cancel" data-booking-id="${booking.id}">
            Cancelar
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

export function initializeCalendar() {
  // Calendar navigation
  document.getElementById('prev-month')?.addEventListener('click', () => navigateMonth(-1));
  document.getElementById('next-month')?.addEventListener('click', () => navigateMonth(1));

  // View switching
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => switchCalendarView(e.target.dataset.view));
  });

  // Request handling
  document.addEventListener('click', handleRequestActions);

  // Booking actions
  document.addEventListener('click', handleBookingActions);

  // Configuration modals
  document.getElementById('config-availability')?.addEventListener('click', openAvailabilityConfig);
  document.getElementById('add-block-time')?.addEventListener('click', openBlockTimeModal);

  // Real-time updates
  setupRealtimeUpdates();
}

function handleRequestActions(event) {
  const action = event.target.dataset.action;
  const requestId = event.target.dataset.requestId;
  
  if (!action || !requestId) return;

  switch (action) {
    case 'accept':
      acceptBookingRequest(requestId);
      break;
    case 'reject':
      rejectBookingRequest(requestId);
      break;
  }
}

async function acceptBookingRequest(requestId) {
  try {
    await bookingService.acceptRequest(requestId);
    
    // Remove from pending list
    const requestCard = document.querySelector(`[data-request-id="${requestId}"]`);
    requestCard?.remove();
    
    // Refresh calendar
    refreshCalendarView();
    
    showSuccessMessage('Solicitud aceptada correctamente');
  } catch (error) {
    console.error('Error accepting request:', error);
    showErrorMessage('Error al aceptar la solicitud');
  }
}

async function rejectBookingRequest(requestId) {
  const reason = await promptRejectReason();
  if (!reason) return;

  try {
    await bookingService.rejectRequest(requestId, reason);
    
    // Remove from pending list
    const requestCard = document.querySelector(`[data-request-id="${requestId}"]`);
    requestCard?.remove();
    
    showSuccessMessage('Solicitud rechazada');
  } catch (error) {
    console.error('Error rejecting request:', error);
    showErrorMessage('Error al rechazar la solicitud');
  }
}

function setupRealtimeUpdates() {
  // WebSocket or polling for real-time updates
  // This would listen for new booking requests, cancellations, etc.
}
```

## 🧪 Testing

### Unit Tests
- [ ] Calendar date calculations
- [ ] Booking status management
- [ ] Request approval/rejection flow
- [ ] Availability configuration

### Integration Tests
- [ ] Real-time updates
- [ ] Calendar view switching
- [ ] Booking management workflow
- [ ] Professional dashboard integration

### E2E Tests
- [ ] Complete booking management flow
- [ ] Calendar navigation and views
- [ ] Request handling from start to finish
- [ ] Availability configuration

## 🚀 Deployment

### Performance
- Calendar virtualization for large date ranges
- Lazy loading for booking details
- Efficient date calculations

### Real-time Features
- WebSocket connections for live updates
- Push notifications for new requests
- Automatic calendar refresh

## 📦 Dependencies
- BookingService
- ProfessionalService
- NotificationService
- Date manipulation library

## 🔗 Relaciones
- **Conecta con**: Sistema de reservas, Dashboard principal
- **Usa**: BookingService, NotificationService
- **Alimenta**: Analytics del profesional

---

**Estado**: 📋 Planificado  
**Prioridad**: Alta  
**Estimación**: 20 horas  
**Asignado**: Frontend Developer  

**Sprint**: Sprint 4 - Frontend y UX  
**Deadline**: 10 septiembre 2025
