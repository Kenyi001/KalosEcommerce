/**
 * Booking Confirmation Page - Shows booking success and details
 */

import { renderWithLayout, initializeLayout } from '../../components/Layout.js';
import { navigateTo } from '../../utils/router.js';

export function renderBookingConfirmationPage(bookingId) {
  console.log('🎉 Rendering booking confirmation for:', bookingId);
  
  const content = `
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div class="max-w-2xl mx-auto px-4">
        
        <!-- Success Header -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">✅</span>
          </div>
          <h1 class="text-3xl font-bold text-green-800 mb-2">¡Reserva Confirmada!</h1>
          <p class="text-lg text-green-600">Tu reserva se ha creado exitosamente</p>
        </div>

        <!-- Booking Details Card -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 class="text-xl font-bold text-navy mb-4">📋 Detalles de tu reserva</h2>
          
          <div class="space-y-4">
            <!-- Booking ID -->
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="font-medium text-gray-700">Número de reserva:</span>
              <span class="font-mono text-sm text-brand bg-brand/10 px-3 py-1 rounded">${bookingId}</span>
            </div>
            
            <!-- Placeholder for booking details -->
            <div id="booking-details-content">
              <div class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-bold text-blue-800 mb-3">📞 Próximos pasos</h3>
          <div class="space-y-2 text-blue-700">
            <p>✅ <strong>Reserva creada:</strong> Hemos registrado tu solicitud</p>
            <p>📱 <strong>Confirmación:</strong> El profesional confirmará tu reserva pronto</p>
            <p>💰 <strong>Pago:</strong> Recibirás instrucciones para el adelanto del 30%</p>
            <p>🔔 <strong>Recordatorios:</strong> Te enviaremos recordatorios por WhatsApp</p>
          </div>
        </div>

        <!-- Important Notice -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <span class="text-yellow-500 text-xl mr-3">⚠️</span>
            <div>
              <h4 class="font-semibold text-yellow-800 mb-1">Importante</h4>
              <p class="text-yellow-700 text-sm">
                Tu reserva está <strong>pendiente de confirmación</strong>. El profesional tiene hasta 1 hora para confirmar. 
                Si no confirma, tu reserva será cancelada automáticamente.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onclick="location.href='/cuenta'" 
            class="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-hover transition-colors font-medium">
            📋 Ver mis reservas
          </button>
          
          <button 
            onclick="location.href='/marketplace'" 
            class="border-2 border-brand text-brand px-6 py-3 rounded-lg hover:bg-brand hover:text-white transition-colors font-medium">
            🛍️ Hacer otra reserva
          </button>
          
          <button 
            onclick="location.href='/'" 
            class="text-gray-600 hover:text-gray-800 px-6 py-3 font-medium">
            🏠 Ir al inicio
          </button>
        </div>

        <!-- Support Info -->
        <div class="text-center mt-8 text-gray-600">
          <p class="mb-2">¿Necesitas ayuda?</p>
          <p class="text-sm">
            WhatsApp: <a href="tel:+59170000000" class="text-brand hover:underline">+591 70000000</a> | 
            Email: <a href="mailto:soporte@kalos.com" class="text-brand hover:underline">soporte@kalos.com</a>
          </p>
        </div>
      </div>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: 'Reserva Confirmada - Kalos',
    showHeader: true,
    showFooter: true
  });
}

export function initializeBookingConfirmationPage(bookingId) {
  console.log('🎉 Initializing booking confirmation page for:', bookingId);
  initializeLayout();
  
  // Load booking details if needed
  loadBookingDetails(bookingId);
}

async function loadBookingDetails(bookingId) {
  console.log('📋 Loading booking details for:', bookingId);
  
  const detailsContainer = document.getElementById('booking-details-content');
  if (!detailsContainer) return;
  
  try {
    // For now, show a basic message since we don't have the booking service get method implemented
    detailsContainer.innerHTML = `
      <div class="space-y-3 text-sm">
        <div class="text-center text-green-600 font-medium">
          ✅ Tu reserva ha sido creada exitosamente
        </div>
        <div class="text-center text-gray-600">
          <p>Booking ID: <strong>${bookingId}</strong></p>
          <p class="mt-2">Revisa tu cuenta para ver todos los detalles de la reserva</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading booking details:', error);
    detailsContainer.innerHTML = `
      <div class="text-center text-red-500 py-4">
        Error cargando detalles de la reserva
      </div>
    `;
  }
}

export default renderBookingConfirmationPage;