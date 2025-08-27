/**
 * Booking Flow - Multi-step booking process for Kalos E-commerce
 * Handles complete booking flow from service selection to confirmation
 */

import { renderWithLayout, initializeLayout } from '../../components/Layout.js';
import { navigateTo } from '../../utils/router.js';
import { authService } from '../../services/auth.js';
import { servicesService } from '../../services/services.js';
import { BookingService } from '../../services/bookings.js';
import { AvailabilityService } from '../../services/availability.js';

export class BookingFlow {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.bookingData = {
      customerId: null,
      professionalId: null,
      serviceId: null,
      scheduledDate: null,
      scheduledTime: null,
      location: {
        type: 'home',
        address: '',
        coordinates: null,
        instructions: ''
      },
      service: {
        name: '',
        price: 0,
        duration: 60,
        addons: [],
        totalPrice: 0,
        totalDuration: 60
      },
      payment: {
        method: 'QR'
      },
      notes: ''
    };
    this.availableServices = [];
    this.availableProfessionals = [];
    this.availableSlots = [];
  }

  render() {
    return `
      <div class="booking-flow bg-gray-50 min-h-screen py-8">
        <div class="container mx-auto px-4">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-navy mb-2">Nueva Reserva</h1>
            <p class="text-gray-600">Agenda tu servicio de belleza en casa</p>
          </div>

          <!-- Progress Bar -->
          <div class="mb-8">
            <div class="flex justify-center">
              <div class="flex items-center space-x-4 bg-white rounded-lg shadow-sm p-4">
                ${this.renderProgressSteps()}
              </div>
            </div>
          </div>

          <!-- Step Content -->
          <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg p-8">
              ${this.renderStepContent()}
            </div>
          </div>

          <!-- Navigation -->
          <div class="max-w-4xl mx-auto mt-6 flex justify-between">
            <button
              id="prev-btn"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium ${this.currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
              ${this.currentStep === 1 ? 'disabled' : ''}
            >
              ← Anterior
            </button>
            
            <button
              id="next-btn"
              class="px-8 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors font-medium shadow-md"
            >
              ${this.currentStep === this.totalSteps ? 'Confirmar Reserva 🎉' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderProgressSteps() {
    const steps = [
      { name: 'Servicio', icon: '✨' },
      { name: 'Profesional', icon: '👩‍💼' }, 
      { name: 'Fecha y Hora', icon: '📅' },
      { name: 'Ubicación', icon: '📍' },
      { name: 'Confirmación', icon: '✅' }
    ];

    return steps.map((step, index) => {
      const stepNumber = index + 1;
      const isCompleted = stepNumber < this.currentStep;
      const isCurrent = stepNumber === this.currentStep;
      
      return `
        <div class="flex items-center">
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-300
              ${isCompleted ? 'bg-green-500 text-white' : 
                isCurrent ? 'bg-brand text-white shadow-lg' : 
                'bg-gray-200 text-gray-600'}">
              ${isCompleted ? '✓' : isCurrent ? step.icon : stepNumber}
            </div>
            <span class="mt-2 text-xs font-medium text-center
              ${isCurrent ? 'text-brand' : 'text-gray-600'}">${step.name}</span>
          </div>
          ${index < steps.length - 1 ? `
            <div class="w-16 h-1 mx-3 rounded transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}"></div>
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
      default: return '<div class="text-center text-red-500">Error: Paso no válido</div>';
    }
  }

  renderServiceSelection() {
    return `
      <div class="step-content">
        <h2 class="text-2xl font-bold text-navy mb-6 text-center">
          ¿Qué servicio necesitas?
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="services-grid">
          <!-- Services will be loaded here -->
          <div class="col-span-full flex justify-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          </div>
        </div>

        ${this.bookingData.serviceId ? `
          <div class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <span class="text-green-500 text-xl mr-3">✅</span>
              <div>
                <h3 class="font-semibold text-green-800">${this.bookingData.service.name}</h3>
                <p class="text-green-600 text-sm">Bs. ${this.bookingData.service.totalPrice} • ${this.bookingData.service.totalDuration} min</p>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderProfessionalSelection() {
    return `
      <div class="step-content">
        <h2 class="text-2xl font-bold text-navy mb-6 text-center">
          Selecciona tu profesional
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="professionals-grid">
          <!-- Professionals will be loaded here -->
          <div class="col-span-full flex justify-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          </div>
        </div>

        ${this.bookingData.professionalId ? `
          <div class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <span class="text-green-500 text-xl mr-3">✅</span>
              <div>
                <h3 class="font-semibold text-green-800">Profesional seleccionado</h3>
                <p class="text-green-600 text-sm">ID: ${this.bookingData.professionalId}</p>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderDateTimeSelection() {
    return `
      <div class="step-content">
        <h2 class="text-2xl font-bold text-navy mb-6 text-center">
          Selecciona fecha y hora
        </h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Calendar -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="font-semibold mb-4 text-center">📅 Calendario</h3>
            <div id="calendar-widget">
              <!-- Simple calendar will be rendered here -->
              ${this.renderSimpleCalendar()}
            </div>
          </div>
          
          <!-- Time Slots -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="font-semibold mb-4 text-center">🕐 Horarios disponibles</h3>
            <div id="time-slots">
              ${this.bookingData.scheduledDate ? 
                '<div class="flex justify-center py-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>' :
                '<div class="text-center text-gray-500 py-8">Selecciona una fecha</div>'
              }
            </div>
          </div>
        </div>

        ${this.bookingData.scheduledDate && this.bookingData.scheduledTime ? `
          <div class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <span class="text-green-500 text-xl mr-3">✅</span>
              <div>
                <h3 class="font-semibold text-green-800">Fecha y hora seleccionada</h3>
                <p class="text-green-600 text-sm">${this.bookingData.scheduledDate} a las ${this.bookingData.scheduledTime}</p>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderLocationSelection() {
    return `
      <div class="step-content">
        <h2 class="text-2xl font-bold text-navy mb-6 text-center">
          ¿Dónde será el servicio?
        </h2>
        
        <div class="space-y-6">
          <!-- Location Type -->
          <div>
            <label class="block font-semibold mb-3">Tipo de ubicación</label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${this.bookingData.location.type === 'home' ? 'border-brand bg-brand/5' : 'border-gray-200'}">
                <input type="radio" name="locationType" value="home" class="sr-only" ${this.bookingData.location.type === 'home' ? 'checked' : ''}>
                <div class="text-center w-full">
                  <span class="text-2xl block mb-2">🏠</span>
                  <span class="font-medium">En mi casa</span>
                </div>
              </label>
              
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${this.bookingData.location.type === 'office' ? 'border-brand bg-brand/5' : 'border-gray-200'}">
                <input type="radio" name="locationType" value="office" class="sr-only" ${this.bookingData.location.type === 'office' ? 'checked' : ''}>
                <div class="text-center w-full">
                  <span class="text-2xl block mb-2">🏢</span>
                  <span class="font-medium">En mi oficina</span>
                </div>
              </label>
              
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${this.bookingData.location.type === 'other' ? 'border-brand bg-brand/5' : 'border-gray-200'}">
                <input type="radio" name="locationType" value="other" class="sr-only" ${this.bookingData.location.type === 'other' ? 'checked' : ''}>
                <div class="text-center w-full">
                  <span class="text-2xl block mb-2">📍</span>
                  <span class="font-medium">Otro lugar</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="block font-semibold mb-2">Dirección completa</label>
            <textarea
              id="location-address"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
              placeholder="Ej: Calle 21 #123, Zona Sur, La Paz"
            >${this.bookingData.location.address}</textarea>
          </div>

          <!-- Instructions -->
          <div>
            <label class="block font-semibold mb-2">Instrucciones adicionales (opcional)</label>
            <textarea
              id="location-instructions"
              rows="2"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
              placeholder="Ej: Portón azul, 2do piso, timbre del lado derecho"
            >${this.bookingData.location.instructions}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  renderConfirmation() {
    const advancePayment = Math.round(this.bookingData.service.totalPrice * 0.3);
    
    return `
      <div class="step-content">
        <h2 class="text-2xl font-bold text-navy mb-8 text-center">
          Confirma tu reserva
        </h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Booking Summary -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="font-bold mb-6 text-lg text-center">📋 Resumen de la reserva</h3>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="text-gray-600">Servicio:</span>
                <span class="font-semibold text-right">${this.bookingData.service.name}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="text-gray-600">Profesional:</span>
                <span class="font-semibold">${this.bookingData.professionalName || 'Seleccionado'}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="text-gray-600">Fecha:</span>
                <span class="font-semibold">${this.formatDate(this.bookingData.scheduledDate)}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="text-gray-600">Hora:</span>
                <span class="font-semibold">${this.bookingData.scheduledTime}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="text-gray-600">Duración:</span>
                <span class="font-semibold">${this.bookingData.service.totalDuration} min</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="text-gray-600">Ubicación:</span>
                <span class="font-semibold text-right text-sm">${this.getLocationText()}</span>
              </div>
            </div>
          </div>

          <!-- Payment & Final Details -->
          <div class="space-y-6">
            <!-- Pricing -->
            <div class="bg-gradient-to-r from-brand/5 to-deep-coral/5 rounded-lg p-6">
              <h3 class="font-bold mb-4 text-lg text-center">💰 Pricing</h3>
              
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Precio del servicio:</span>
                  <span class="font-medium">Bs. ${this.bookingData.service.totalPrice}</span>
                </div>
                
                <hr class="border-gray-300">
                
                <div class="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span class="text-brand">Bs. ${this.bookingData.service.totalPrice}</span>
                </div>
                
                <div class="text-center text-sm text-gray-600 bg-white rounded p-3">
                  <strong>Adelanto requerido:</strong> Bs. ${advancePayment} (30%)<br>
                  <strong>Restante:</strong> Bs. ${this.bookingData.service.totalPrice - advancePayment} (Se paga al finalizar el servicio)
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div>
              <h3 class="font-bold mb-4">💳 Método de pago del adelanto</h3>
              <div class="space-y-3">
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${this.bookingData.payment.method === 'QR' ? 'border-brand bg-brand/5' : 'border-gray-200'}">
                  <input type="radio" name="payment" value="QR" class="mr-3" ${this.bookingData.payment.method === 'QR' ? 'checked' : ''}>
                  <span class="text-2xl mr-3">📱</span>
                  <div>
                    <div class="font-medium">QR Code (Banco Unión)</div>
                    <div class="text-sm text-gray-600">Pago inmediato con QR</div>
                  </div>
                </label>
                
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${this.bookingData.payment.method === 'transfer' ? 'border-brand bg-brand/5' : 'border-gray-200'}">
                  <input type="radio" name="payment" value="transfer" class="mr-3" ${this.bookingData.payment.method === 'transfer' ? 'checked' : ''}>
                  <span class="text-2xl mr-3">🏦</span>
                  <div>
                    <div class="font-medium">Transferencia bancaria</div>
                    <div class="text-sm text-gray-600">Envía comprobante por WhatsApp</div>
                  </div>
                </label>
              </div>
            </div>
            
            <!-- Notes -->
            <div>
              <label class="block font-bold mb-2">📝 Notas adicionales (opcional)</label>
              <textarea
                id="booking-notes"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                placeholder="Algún detalle especial, alergia, preferencia..."
              >${this.bookingData.notes}</textarea>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderSimpleCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Generate next 30 days
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return `
      <div class="calendar-grid grid grid-cols-7 gap-1">
        <div class="text-center font-medium text-xs text-gray-600 py-2">Dom</div>
        <div class="text-center font-medium text-xs text-gray-600 py-2">Lun</div>
        <div class="text-center font-medium text-xs text-gray-600 py-2">Mar</div>
        <div class="text-center font-medium text-xs text-gray-600 py-2">Mié</div>
        <div class="text-center font-medium text-xs text-gray-600 py-2">Jue</div>
        <div class="text-center font-medium text-xs text-gray-600 py-2">Vie</div>
        <div class="text-center font-medium text-xs text-gray-600 py-2">Sáb</div>
        
        ${dates.slice(0, 21).map(date => {
          const dateStr = date.toISOString().split('T')[0];
          const isSelected = dateStr === this.bookingData.scheduledDate;
          const isToday = dateStr === today.toISOString().split('T')[0];
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0; // Domingo no trabajamos
          
          return `
            <button
              class="calendar-date w-10 h-10 text-sm rounded-lg transition-colors ${
                isSelected ? 'bg-brand text-white' :
                isToday ? 'bg-blue-100 text-blue-800' :
                isWeekend ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                'hover:bg-gray-100'
              }"
              data-date="${dateStr}"
              ${isWeekend ? 'disabled' : ''}
            >
              ${date.getDate()}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getLocationText() {
    const types = {
      'home': '🏠 En casa',
      'office': '🏢 En oficina',
      'other': '📍 Otro lugar'
    };
    return types[this.bookingData.location.type] || '📍 No especificado';
  }

  async mount() {
    initializeLayout();
    
    // Check authentication
    const { user } = await authService.waitForAuth();
    if (!user) {
      navigateTo('/auth/login?redirect=/booking');
      return;
    }
    
    this.bookingData.customerId = user.uid;
    
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
    switch (this.currentStep) {
      case 1: 
        if (!this.bookingData.serviceId) {
          alert('Por favor selecciona un servicio');
          return false;
        }
        return true;
        
      case 2: 
        if (!this.bookingData.professionalId) {
          alert('Por favor selecciona un profesional');
          return false;
        }
        return true;
        
      case 3: 
        if (!this.bookingData.scheduledDate || !this.bookingData.scheduledTime) {
          alert('Por favor selecciona fecha y hora');
          return false;
        }
        return true;
        
      case 4: 
        const address = document.getElementById('location-address')?.value.trim();
        if (!address) {
          alert('Por favor ingresa la dirección');
          return false;
        }
        
        this.bookingData.location.address = address;
        this.bookingData.location.instructions = document.getElementById('location-instructions')?.value.trim() || '';
        return true;
        
      case 5: 
        // Update notes
        this.bookingData.notes = document.getElementById('booking-notes')?.value.trim() || '';
        return true;
        
      default: return false;
    }
  }

  async submitBooking() {
    try {
      const submitBtn = document.getElementById('next-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Creando reserva...';
      submitBtn.disabled = true;

      const result = await BookingService.createBooking(this.bookingData);
      
      if (result.success) {
        // Redirect to booking confirmation page
        navigateTo(`/booking/confirmation/${result.id}`);
      } else {
        alert('Error al crear la reserva: ' + result.error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Error al crear la reserva. Por favor intenta de nuevo.');
      
      const submitBtn = document.getElementById('next-btn');
      submitBtn.textContent = 'Confirmar Reserva 🎉';
      submitBtn.disabled = false;
    }
  }

  async loadStepData() {
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
      case 4:
        this.bindLocationEvents();
        break;
      case 5:
        this.bindConfirmationEvents();
        break;
    }
  }

  async loadServices() {
    try {
      console.log('📋 Loading services...');
      
      // For now, let's create some demo services
      this.availableServices = [
        {
          id: 'service_1',
          name: 'Maquillaje Social',
          price: 150,
          duration: 60,
          category: 'makeup',
          description: 'Maquillaje para eventos sociales'
        },
        {
          id: 'service_2',
          name: 'Maquillaje de Novia',
          price: 350,
          duration: 120,
          category: 'makeup',
          description: 'Maquillaje completo para novias'
        },
        {
          id: 'service_3',
          name: 'Peinado y Maquillaje',
          price: 280,
          duration: 90,
          category: 'hair_makeup',
          description: 'Peinado y maquillaje combinados'
        }
      ];

      this.renderServicesGrid();
    } catch (error) {
      console.error('Error loading services:', error);
      document.getElementById('services-grid').innerHTML = '<div class="col-span-full text-center text-red-500">Error al cargar servicios</div>';
    }
  }

  renderServicesGrid() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = this.availableServices.map(service => `
      <div class="service-card border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        this.bookingData.serviceId === service.id ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-gray-300'
      }" data-service-id="${service.id}">
        <div class="text-center">
          <div class="text-4xl mb-3">
            ${service.category === 'makeup' ? '💄' : 
              service.category === 'hair_makeup' ? '✨' : '💅'}
          </div>
          <h3 class="font-bold text-lg text-navy mb-2">${service.name}</h3>
          <p class="text-gray-600 text-sm mb-4">${service.description}</p>
          <div class="flex justify-between items-center text-sm">
            <span class="bg-gray-100 px-3 py-1 rounded-full">${service.duration} min</span>
            <span class="font-bold text-brand text-lg">Bs. ${service.price}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Add event listeners
    servicesGrid.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', () => {
        const serviceId = card.dataset.serviceId;
        const service = this.availableServices.find(s => s.id === serviceId);
        
        if (service) {
          this.bookingData.serviceId = serviceId;
          this.bookingData.service = {
            name: service.name,
            price: service.price,
            duration: service.duration,
            addons: [],
            totalPrice: service.price,
            totalDuration: service.duration
          };
          
          // Re-render to show selection
          this.renderServicesGrid();
          
          // Update step display
          document.querySelector('.step-content').innerHTML = this.renderServiceSelection();
          this.renderServicesGrid(); // Re-render again after updating
        }
      });
    });
  }

  async loadProfessionals() {
    try {
      console.log('👩‍💼 Loading professionals...');
      
      // For demo, create some professionals
      this.availableProfessionals = [
        {
          id: 'prof_1',
          name: 'María González',
          specialties: ['Maquillaje', 'Peinados'],
          rating: 4.9,
          completedBookings: 156,
          avatar: '👩‍💼'
        },
        {
          id: 'prof_2', 
          name: 'Ana Rodríguez',
          specialties: ['Maquillaje de Novias', 'Eventos'],
          rating: 4.8,
          completedBookings: 98,
          avatar: '💄'
        },
        {
          id: 'prof_3',
          name: 'Carmen Silva',
          specialties: ['Peinados', 'Tratamientos'],
          rating: 4.7,
          completedBookings: 203,
          avatar: '✨'
        }
      ];

      this.renderProfessionalsGrid();
    } catch (error) {
      console.error('Error loading professionals:', error);
      document.getElementById('professionals-grid').innerHTML = '<div class="col-span-full text-center text-red-500">Error al cargar profesionales</div>';
    }
  }

  renderProfessionalsGrid() {
    const professionalsGrid = document.getElementById('professionals-grid');
    if (!professionalsGrid) return;

    professionalsGrid.innerHTML = this.availableProfessionals.map(professional => `
      <div class="professional-card border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        this.bookingData.professionalId === professional.id ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-gray-300'
      }" data-professional-id="${professional.id}">
        <div class="flex items-start space-x-4">
          <div class="text-4xl">${professional.avatar}</div>
          <div class="flex-1">
            <h3 class="font-bold text-lg text-navy mb-1">${professional.name}</h3>
            <p class="text-gray-600 text-sm mb-2">${professional.specialties.join(', ')}</p>
            
            <div class="flex items-center space-x-4 text-sm">
              <div class="flex items-center">
                <span class="text-yellow-400">⭐</span>
                <span class="ml-1 font-medium">${professional.rating}</span>
              </div>
              <div class="text-gray-500">
                ${professional.completedBookings} servicios
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Add event listeners
    professionalsGrid.querySelectorAll('.professional-card').forEach(card => {
      card.addEventListener('click', () => {
        const professionalId = card.dataset.professionalId;
        const professional = this.availableProfessionals.find(p => p.id === professionalId);
        
        if (professional) {
          this.bookingData.professionalId = professionalId;
          this.bookingData.professionalName = professional.name;
          
          // Re-render to show selection
          this.renderProfessionalsGrid();
          
          // Update step display
          document.querySelector('.step-content').innerHTML = this.renderProfessionalSelection();
          this.renderProfessionalsGrid();
        }
      });
    });
  }

  async loadAvailability() {
    this.bindCalendarEvents();
    
    if (this.bookingData.scheduledDate) {
      await this.loadTimeSlots();
    }
  }

  bindCalendarEvents() {
    const calendarDates = document.querySelectorAll('.calendar-date:not([disabled])');
    
    calendarDates.forEach(dateBtn => {
      dateBtn.addEventListener('click', async () => {
        const selectedDate = dateBtn.dataset.date;
        this.bookingData.scheduledDate = selectedDate;
        this.bookingData.scheduledTime = null; // Reset time selection
        
        // Update calendar display
        calendarDates.forEach(btn => btn.classList.remove('bg-brand', 'text-white'));
        dateBtn.classList.add('bg-brand', 'text-white');
        
        // Load time slots for selected date
        await this.loadTimeSlots();
        
        // Update step display
        document.querySelector('.step-content').innerHTML = this.renderDateTimeSelection();
        this.bindCalendarEvents();
      });
    });
  }

  async loadTimeSlots() {
    try {
      console.log('🕐 Loading time slots for:', this.bookingData.scheduledDate);
      
      const timeSlotsContainer = document.getElementById('time-slots');
      if (!timeSlotsContainer) return;

      timeSlotsContainer.innerHTML = '<div class="flex justify-center py-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>';

      // For demo, create some available slots
      this.availableSlots = [
        { start: '09:00', end: '10:00', duration: 60 },
        { start: '10:00', end: '11:00', duration: 60 },
        { start: '11:00', end: '12:00', duration: 60 },
        { start: '14:00', end: '15:00', duration: 60 },
        { start: '15:00', end: '16:00', duration: 60 },
        { start: '16:00', end: '17:00', duration: 60 },
        { start: '17:00', end: '18:00', duration: 60 }
      ];

      this.renderTimeSlots();
    } catch (error) {
      console.error('Error loading time slots:', error);
      document.getElementById('time-slots').innerHTML = '<div class="text-center text-red-500 py-4">Error al cargar horarios</div>';
    }
  }

  renderTimeSlots() {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;

    timeSlotsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        ${this.availableSlots.map(slot => `
          <button
            class="time-slot px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
              this.bookingData.scheduledTime === slot.start 
                ? 'border-brand bg-brand text-white' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }"
            data-time="${slot.start}"
          >
            ${slot.start}
          </button>
        `).join('')}
      </div>
    `;

    // Add event listeners
    timeSlotsContainer.querySelectorAll('.time-slot').forEach(timeBtn => {
      timeBtn.addEventListener('click', () => {
        const selectedTime = timeBtn.dataset.time;
        this.bookingData.scheduledTime = selectedTime;
        
        // Update display
        this.renderTimeSlots();
        
        // Update step display to show confirmation
        document.querySelector('.step-content').innerHTML = this.renderDateTimeSelection();
        this.bindCalendarEvents();
      });
    });
  }

  bindLocationEvents() {
    // Location type radio buttons
    const locationRadios = document.querySelectorAll('input[name="locationType"]');
    locationRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.bookingData.location.type = radio.value;
          
          // Re-render to show selection
          document.querySelector('.step-content').innerHTML = this.renderLocationSelection();
          this.bindLocationEvents();
        }
      });
    });
  }

  bindConfirmationEvents() {
    // Payment method radio buttons
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.bookingData.payment.method = radio.value;
          
          // Re-render to show selection
          document.querySelector('.step-content').innerHTML = this.renderConfirmation();
          this.bindConfirmationEvents();
        }
      });
    });
  }

  rerender() {
    const app = document.getElementById('app');
    app.innerHTML = this.render();
    this.mount();
  }
}

// Page functions for router
export function renderBookingFlowPage() {
  const bookingFlow = new BookingFlow();
  return bookingFlow.render();
}

export function initializeBookingFlowPage() {
  const bookingFlow = new BookingFlow();
  bookingFlow.mount();
}

export default BookingFlow;