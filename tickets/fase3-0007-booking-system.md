# Ticket Fase 3-0007: Sistema de Reservas

## 📋 Descripción
Implementar sistema completo de reservas para servicios de belleza, permitiendo a clientes agendar citas con profesionales, gestionar disponibilidad, confirmaciones automáticas y notificaciones en tiempo real.

## 🎯 Objetivos
- Sistema de reservas en tiempo real
- Calendario de disponibilidad dinámico
- Gestión de estados de booking (pendiente, confirmado, completado, cancelado)
- Integración con sistema de pagos
- Notificaciones automáticas
- Dashboard para profesionales y clientes

## 📊 Criterios de Aceptación

### ✅ Data Models (Firestore)
- [ ] Collection `bookings` con estados y lifecycle completo
- [ ] Collection `availability` para horarios de profesionales
- [ ] Sub-collection `payments` para transacciones
- [ ] Sub-collection `notifications` para alertas
- [ ] Indexes optimizados para consultas en tiempo real

### ✅ Booking Service (Backend)
- [ ] `BookingService` para CRUD y estados
- [ ] Validación de disponibilidad en tiempo real
- [ ] Cálculo automático de precios con addons
- [ ] Sistema de confirmación automática/manual
- [ ] Manejo de cancelaciones y reembolsos

### ✅ Calendar & Scheduling
- [ ] Widget de calendario con disponibilidad
- [ ] Selección de tiempo slots disponibles
- [ ] Bloqueo temporal durante reserva (5 min)
- [ ] Sincronización en tiempo real entre usuarios
- [ ] Excepciones de horarios (feriados, vacaciones)

### ✅ Booking Flow UI
- [ ] Flujo completo de reserva (5 pasos)
- [ ] Selección de servicio y professional
- [ ] Calendario de disponibilidad
- [ ] Confirmación y resumen
- [ ] Dashboard de reservas

## 🔧 Implementación Técnica

### Firestore Data Structure
```javascript
// Collection: bookings
{
  id: "booking_123",
  customerId: "user_456",
  professionalId: "prof_789",
  serviceId: "service_101",
  
  // Scheduling
  scheduledDate: "2025-08-30",
  scheduledTime: "14:00",
  duration: 120, // minutes
  endTime: "16:00", // calculated
  
  // Location
  location: {
    type: "home", // home, shop, other
    address: "Calle 21 #123, Zona Sur, La Paz",
    coordinates: { lat: -16.5, lng: -68.15 },
    instructions: "Portón azul, 2do piso"
  },
  
  // Service Details
  service: {
    name: "Maquillaje de Novia",
    price: 350,
    addons: [
      { name: "Peinado", price: 150, duration: 60 }
    ],
    totalPrice: 500,
    totalDuration: 180
  },
  
  // Status Management
  status: "confirmed", // pending, confirmed, in_progress, completed, cancelled
  statusHistory: [
    { status: "pending", timestamp: "2025-08-26T10:00:00Z", note: "Reserva creada" },
    { status: "confirmed", timestamp: "2025-08-26T11:00:00Z", note: "Confirmado por professional" }
  ],
  
  // Payment
  payment: {
    method: "QR", // QR, transfer, cash
    status: "pending", // pending, paid, failed, refunded
    amount: 500,
    advancePayment: 150, // 30% adelanto
    remainingPayment: 350,
    transactionId: "txn_202",
    paidAt: null
  },
  
  // Communication
  notes: "Primera vez, necesita asesoría de colores",
  privateNotes: "Cliente con alergia al latex", // Only professional sees
  
  // Metadata
  confirmationRequired: true,
  autoConfirmMinutes: 60, // Auto-confirm if professional doesn't respond
  remindersSent: ["24h", "2h"],
  
  createdAt: "2025-08-26T10:00:00Z",
  updatedAt: "2025-08-26T11:00:00Z",
  
  // Cancellation
  cancellation: {
    cancelledBy: "customer", // customer, professional, system
    reason: "Conflicto de horario",
    cancelledAt: "2025-08-29T09:00:00Z",
    refundAmount: 150,
    refundStatus: "processed"
  }
}

// Collection: availability (per professional)
{
  id: "avail_123",
  professionalId: "prof_789",
  date: "2025-08-30",
  dayOfWeek: 5, // Friday
  
  // Base schedule
  baseSchedule: {
    start: "09:00",
    end: "18:00",
    lunchBreak: { start: "13:00", end: "14:00" }
  },
  
  // Available time slots
  timeSlots: [
    { 
      start: "09:00", 
      end: "11:00", 
      available: true,
      bookingId: null 
    },
    { 
      start: "11:00", 
      end: "13:00", 
      available: false,
      bookingId: "booking_456" 
    },
    { 
      start: "14:00", 
      end: "16:00", 
      available: false,
      bookingId: "booking_123",
      locked: true, // Temporarily locked during booking process
      lockedUntil: "2025-08-26T10:05:00Z"
    },
    { 
      start: "16:00", 
      end: "18:00", 
      available: true,
      bookingId: null 
    }
  ],
  
  // Exceptions
  isWorkingDay: true,
  exceptions: [
    { 
      type: "vacation", 
      reason: "Vacaciones familiares",
      allDay: true 
    }
  ],
  
  updatedAt: "2025-08-26T10:00:00Z"
}

// Sub-collection: bookings/{id}/timeline
{
  id: "timeline_1",
  type: "status_change", // status_change, payment, message, reminder
  description: "Reserva confirmada por el profesional",
  actor: "prof_789",
  actorName: "María González",
  data: {
    previousStatus: "pending",
    newStatus: "confirmed"
  },
  timestamp: "2025-08-26T11:00:00Z"
}
```

### Booking Service Implementation
```javascript
// src/services/BookingService.js
export class BookingService {
  static collection = 'bookings';
  static availabilityCollection = 'availability';

  static async createBooking(bookingData) {
    try {
      // 1. Validate availability
      const isAvailable = await this.checkAvailability(
        bookingData.professionalId,
        bookingData.scheduledDate,
        bookingData.scheduledTime,
        bookingData.service.totalDuration
      );

      if (!isAvailable) {
        throw new Error('Horario no disponible');
      }

      // 2. Lock time slot temporarily (5 minutes)
      await this.lockTimeSlot(
        bookingData.professionalId,
        bookingData.scheduledDate,
        bookingData.scheduledTime,
        bookingData.service.totalDuration
      );

      // 3. Create booking
      const booking = {
        ...bookingData,
        status: 'pending',
        statusHistory: [{
          status: 'pending',
          timestamp: serverTimestamp(),
          note: 'Reserva creada'
        }],
        payment: {
          ...bookingData.payment,
          status: 'pending'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await db.collection(this.collection).add(booking);
      
      // 4. Update availability
      await this.updateAvailability(
        bookingData.professionalId,
        bookingData.scheduledDate,
        bookingData.scheduledTime,
        bookingData.service.totalDuration,
        docRef.id
      );

      // 5. Send notifications
      await this.sendBookingNotifications(docRef.id, 'created');

      return { id: docRef.id, ...booking };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Error al crear la reserva');
    }
  }

  static async checkAvailability(professionalId, date, time, duration) {
    try {
      const availabilityDoc = await db.collection(this.availabilityCollection)
        .where('professionalId', '==', professionalId)
        .where('date', '==', date)
        .get();

      if (availabilityDoc.empty) {
        return false;
      }

      const availability = availabilityDoc.docs[0].data();
      const requestedSlots = this.calculateRequiredSlots(time, duration);
      
      return requestedSlots.every(slot => {
        const timeSlot = availability.timeSlots.find(ts => 
          ts.start === slot.start && ts.end === slot.end
        );
        return timeSlot && timeSlot.available && !timeSlot.locked;
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }

  static async lockTimeSlot(professionalId, date, time, duration) {
    try {
      const availabilityRef = db.collection(this.availabilityCollection)
        .where('professionalId', '==', professionalId)
        .where('date', '==', date);

      const doc = await availabilityRef.get();
      if (!doc.empty) {
        const docRef = doc.docs[0].ref;
        const availability = doc.docs[0].data();
        
        const updatedTimeSlots = availability.timeSlots.map(slot => {
          const requiredSlots = this.calculateRequiredSlots(time, duration);
          const isRequiredSlot = requiredSlots.some(rs => 
            rs.start === slot.start && rs.end === slot.end
          );
          
          if (isRequiredSlot) {
            return {
              ...slot,
              locked: true,
              lockedUntil: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
            };
          }
          return slot;
        });

        await docRef.update({
          timeSlots: updatedTimeSlots,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error locking time slot:', error);
      throw error;
    }
  }

  static async confirmBooking(bookingId, confirmedBy = 'professional') {
    try {
      const bookingRef = db.collection(this.collection).doc(bookingId);
      const booking = await bookingRef.get();
      
      if (!booking.exists) {
        throw new Error('Reserva no encontrada');
      }

      const bookingData = booking.data();
      
      if (bookingData.status !== 'pending') {
        throw new Error('La reserva no está en estado pendiente');
      }

      const newStatusEntry = {
        status: 'confirmed',
        timestamp: serverTimestamp(),
        note: `Confirmado por ${confirmedBy}`,
        confirmedBy
      };

      await bookingRef.update({
        status: 'confirmed',
        statusHistory: [...bookingData.statusHistory, newStatusEntry],
        updatedAt: serverTimestamp()
      });

      // Send confirmation notifications
      await this.sendBookingNotifications(bookingId, 'confirmed');

      return { success: true };
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw new Error('Error al confirmar la reserva');
    }
  }

  static async cancelBooking(bookingId, cancellationData) {
    try {
      const bookingRef = db.collection(this.collection).doc(bookingId);
      const booking = await bookingRef.get();
      
      if (!booking.exists) {
        throw new Error('Reserva no encontrada');
      }

      const bookingData = booking.data();
      
      // Calculate refund based on cancellation policy
      const refundAmount = this.calculateRefund(bookingData, cancellationData);
      
      const cancellation = {
        ...cancellationData,
        cancelledAt: serverTimestamp(),
        refundAmount,
        refundStatus: refundAmount > 0 ? 'pending' : 'not_applicable'
      };

      const newStatusEntry = {
        status: 'cancelled',
        timestamp: serverTimestamp(),
        note: `Cancelado: ${cancellationData.reason}`,
        cancelledBy: cancellationData.cancelledBy
      };

      await bookingRef.update({
        status: 'cancelled',
        statusHistory: [...bookingData.statusHistory, newStatusEntry],
        cancellation,
        updatedAt: serverTimestamp()
      });

      // Free up the time slot
      await this.freeTimeSlot(
        bookingData.professionalId,
        bookingData.scheduledDate,
        bookingData.scheduledTime,
        bookingData.service.totalDuration
      );

      // Process refund if applicable
      if (refundAmount > 0) {
        await this.processRefund(bookingId, refundAmount);
      }

      // Send cancellation notifications
      await this.sendBookingNotifications(bookingId, 'cancelled');

      return { success: true, refundAmount };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('Error al cancelar la reserva');
    }
  }

  static async getBookingsByUser(userId, filters = {}) {
    try {
      let query = db.collection(this.collection)
        .where('customerId', '==', userId);

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters.dateFrom) {
        query = query.where('scheduledDate', '>=', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.where('scheduledDate', '<=', filters.dateTo);
      }

      query = query.orderBy('scheduledDate', 'desc');

      const snapshot = await query.get();
      const bookings = [];
      
      snapshot.forEach(doc => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      return bookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw new Error('Error al cargar reservas');
    }
  }

  static async getBookingsByProfessional(professionalId, filters = {}) {
    try {
      let query = db.collection(this.collection)
        .where('professionalId', '==', professionalId);

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters.date) {
        query = query.where('scheduledDate', '==', filters.date);
      }

      query = query.orderBy('scheduledTime', 'asc');

      const snapshot = await query.get();
      const bookings = [];
      
      snapshot.forEach(doc => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      return bookings;
    } catch (error) {
      console.error('Error fetching professional bookings:', error);
      throw new Error('Error al cargar reservas del profesional');
    }
  }

  static calculateRequiredSlots(startTime, duration) {
    // Implementation to calculate which time slots are needed
    // based on start time and duration
    const slots = [];
    // ... slot calculation logic
    return slots;
  }

  static calculateRefund(bookingData, cancellationData) {
    // Implement cancellation policy
    const now = new Date();
    const scheduledDateTime = new Date(`${bookingData.scheduledDate}T${bookingData.scheduledTime}`);
    const hoursUntilBooking = (scheduledDateTime - now) / (1000 * 60 * 60);

    // Refund policy
    if (hoursUntilBooking >= 24) {
      return bookingData.payment.advancePayment; // Full refund of advance
    } else if (hoursUntilBooking >= 2) {
      return bookingData.payment.advancePayment * 0.5; // 50% refund
    } else {
      return 0; // No refund
    }
  }

  static async sendBookingNotifications(bookingId, eventType) {
    // Implementation for sending notifications
    // This will be handled by notification service
    console.log(`Sending ${eventType} notification for booking ${bookingId}`);
  }

  static async processRefund(bookingId, amount) {
    // Implementation for processing refunds
    // This will integrate with payment service
    console.log(`Processing refund of ${amount} for booking ${bookingId}`);
  }

  static async freeTimeSlot(professionalId, date, time, duration) {
    // Implementation to free up time slots
    // Mark availability slots as available again
  }
}
```

### Booking Flow UI Component
```javascript
// src/pages/Booking/BookingFlow.js
export class BookingFlowPage {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.bookingData = {
      professionalId: null,
      serviceId: null,
      scheduledDate: null,
      scheduledTime: null,
      location: {},
      service: {},
      notes: ''
    };
  }

  render() {
    return `
      <div class="booking-flow">
        <div class="container mx-auto px-4 py-8">
          <!-- Progress Bar -->
          <div class="mb-8">
            <div class="flex justify-center">
              <div class="flex items-center space-x-4">
                ${this.renderProgressSteps()}
              </div>
            </div>
          </div>

          <!-- Step Content -->
          <div class="max-w-2xl mx-auto">
            ${this.renderStepContent()}
          </div>

          <!-- Navigation -->
          <div class="max-w-2xl mx-auto mt-8 flex justify-between">
            <button
              id="prev-btn"
              class="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 ${this.currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
              ${this.currentStep === 1 ? 'disabled' : ''}
            >
              Anterior
            </button>
            
            <button
              id="next-btn"
              class="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand-hover"
            >
              ${this.currentStep === this.totalSteps ? 'Confirmar Reserva' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderProgressSteps() {
    const steps = [
      'Servicio',
      'Profesional', 
      'Fecha y Hora',
      'Ubicación',
      'Confirmación'
    ];

    return steps.map((step, index) => {
      const stepNumber = index + 1;
      const isCompleted = stepNumber < this.currentStep;
      const isCurrent = stepNumber === this.currentStep;
      
      return `
        <div class="flex items-center">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${isCompleted ? 'bg-green-500 text-white' : 
                isCurrent ? 'bg-brand text-white' : 
                'bg-gray-200 text-gray-600'}">
              ${isCompleted ? '✓' : stepNumber}
            </div>
            <span class="mt-1 text-xs text-gray-600">${step}</span>
          </div>
          ${index < steps.length - 1 ? `
            <div class="w-12 h-px mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}"></div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  renderStepContent() {
    switch (this.currentStep) {
      case 1: return this.renderServiceSelection();
      case 2: return this.renderProfessionalSelection();
      case 3: return this.renderDateTimeSelection();
      case 4: return this.renderLocationSelection();
      case 5: return this.renderConfirmation();
      default: return '<div>Error: Paso no válido</div>';
    }
  }

  renderServiceSelection() {
    return `
      <div class="step-content">
        <h2 class="text-2xl font-bold text-navy mb-6 text-center">
          ¿Qué servicio necesitas?
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Service categories will be loaded here -->
          <div id="services-grid">
            Loading services...
          </div>
        </div>
      </div>
    `;
  }

  renderDateTimeSelection() {
    return `
      <div class="step-content">
        <h2 class="text-2xl font-bold text-navy mb-6 text-center">
          Selecciona fecha y hora
        </h2>
        
        <div class="bg-white rounded-lg border p-6">
          <!-- Calendar Component -->
          <div id="calendar-widget" class="mb-6">
            <!-- Calendar will be rendered here -->
          </div>
          
          <!-- Time Slots -->
          <div id="time-slots">
            <h3 class="font-semibold mb-3">Horarios disponibles</h3>
            <div class="grid grid-cols-3 gap-2">
              <!-- Time slots will be loaded based on selected date -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderConfirmation() {
    return `
      <div class="step-content">
        <h2 class="text-2xl font-bold text-navy mb-6 text-center">
          Confirma tu reserva
        </h2>
        
        <div class="bg-white rounded-lg border p-6">
          <!-- Booking Summary -->
          <div class="booking-summary">
            <h3 class="font-semibold mb-4">Resumen de la reserva</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Servicio:</span>
                <span class="font-medium">${this.bookingData.service.name || ''}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Profesional:</span>
                <span class="font-medium">${this.bookingData.professionalName || ''}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Fecha:</span>
                <span class="font-medium">${this.bookingData.scheduledDate || ''}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Hora:</span>
                <span class="font-medium">${this.bookingData.scheduledTime || ''}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Duración:</span>
                <span class="font-medium">${this.bookingData.service.duration || 0} min</span>
              </div>
              
              <hr class="my-4">
              
              <div class="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span class="text-brand">Bs. ${this.bookingData.service.totalPrice || 0}</span>
              </div>
              
              <div class="text-sm text-gray-600">
                Adelanto requerido: Bs. ${(this.bookingData.service.totalPrice || 0) * 0.3}
              </div>
            </div>
          </div>
          
          <!-- Payment Method -->
          <div class="mt-6">
            <h3 class="font-semibold mb-4">Método de pago del adelanto</h3>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="radio" name="payment" value="QR" class="mr-2" checked>
                QR Code (Banco Unión)
              </label>
              <label class="flex items-center">
                <input type="radio" name="payment" value="transfer" class="mr-2">
                Transferencia bancaria
              </label>
            </div>
          </div>
          
          <!-- Notes -->
          <div class="mt-6">
            <label class="block font-semibold mb-2">
              Notas adicionales (opcional)
            </label>
            <textarea
              id="booking-notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Algún detalle especial, alergia, preferencia..."
            ></textarea>
          </div>
        </div>
      </div>
    `;
  }

  async mount() {
    this.bindEvents();
    await this.loadStepData();
  }

  bindEvents() {
    // Previous button
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStep > 1) {
          this.currentStep--;
          this.rerender();
        }
      });
    }

    // Next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', async () => {
        if (await this.validateCurrentStep()) {
          if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.rerender();
          } else {
            await this.submitBooking();
          }
        }
      });
    }
  }

  async validateCurrentStep() {
    // Validate current step data
    switch (this.currentStep) {
      case 1: return this.bookingData.serviceId !== null;
      case 2: return this.bookingData.professionalId !== null;
      case 3: return this.bookingData.scheduledDate && this.bookingData.scheduledTime;
      case 4: return true; // Location is optional for some services
      case 5: return true;
      default: return false;
    }
  }

  async submitBooking() {
    try {
      const result = await BookingService.createBooking(this.bookingData);
      
      if (result.success) {
        // Redirect to booking confirmation page
        window.router.navigate(`/booking/confirmation/${result.id}`);
      } else {
        alert('Error al crear la reserva: ' + result.error);
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Error al crear la reserva');
    }
  }

  async loadStepData() {
    // Load data needed for current step
    switch (this.currentStep) {
      case 1:
        await this.loadServices();
        break;
      case 2:
        await this.loadProfessionals();
        break;
      case 3:
        await this.loadAvailability();
        break;
    }
  }

  rerender() {
    // Re-render the current page
    const app = document.getElementById('app');
    app.innerHTML = this.render();
    this.mount();
  }
}
```

## 🧪 Testing

### Unit Tests
- [ ] BookingService CRUD operations
- [ ] Availability checking logic
- [ ] Price calculation with addons
- [ ] Cancellation and refund logic
- [ ] Time slot locking mechanism

### Integration Tests
- [ ] Complete booking flow
- [ ] Real-time availability sync
- [ ] Payment integration
- [ ] Notification delivery
- [ ] Calendar conflicts

### Manual Testing Checklist
- [ ] Create booking as customer
- [ ] Confirm booking as professional
- [ ] Cancel booking with refund
- [ ] Check availability conflicts
- [ ] Test time slot locking
- [ ] Verify notifications sent

## 🚀 Deployment

### Firestore Security Rules
```javascript
// bookings collection rules
match /bookings/{bookingId} {
  allow read: if request.auth != null && 
    (request.auth.uid == resource.data.customerId || 
     request.auth.uid == resource.data.professionalId || 
     hasRole('admin'));
  
  allow create: if request.auth != null;
  
  allow update: if request.auth != null && 
    (request.auth.uid == resource.data.customerId || 
     request.auth.uid == resource.data.professionalId || 
     hasRole('admin'));
}

// availability collection rules
match /availability/{availId} {
  allow read: if true; // Public read for availability checking
  allow write: if request.auth != null && 
    (request.auth.uid == resource.data.professionalId || 
     hasRole('admin'));
}
```

### Firestore Indexes
```javascript
// Required composite indexes for bookings
{
  "collectionGroup": "bookings",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "customerId", "order": "ASCENDING" },
    { "fieldPath": "scheduledDate", "order": "DESCENDING" }
  ]
},
{
  "collectionGroup": "bookings",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "professionalId", "order": "ASCENDING" },
    { "fieldPath": "scheduledDate", "order": "ASCENDING" },
    { "fieldPath": "scheduledTime", "order": "ASCENDING" }
  ]
}
```

## 📦 Dependencies
- Firebase Firestore para reservas
- Firebase Functions para lógica de negocio
- Payment gateway integration (QR, transfers)
- Calendar widget library
- Real-time listeners para sync

## 🔗 Relaciones
- **Depende de**: fase2-0006-professional-management, fase1-0004-auth-base-system
- **Prerrequisito para**: fase5-0010-notification-system, Payment integration
- **Relacionado con**: Calendar management, Professional dashboard

---

**Estado**: 🟡 Pendiente  
**Prioridad**: Alta  
**Estimación**: 20 horas  
**Asignado**: Full-stack Developer  

**Sprint**: Sprint 3 - Sistema de Reservas  
**Deadline**: 9 septiembre 2025
