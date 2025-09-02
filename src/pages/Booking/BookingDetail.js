/**
 * Booking Detail Page - Shows individual booking information
 */

import { renderWithLayout, initializeLayout } from '../../components/Layout.js';

export function renderBookingDetailPage(bookingId) {
  console.log('📋 Rendering booking detail for:', bookingId);
  
  const content = `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        
        <!-- Page Header -->
        <div class="mb-8">
          <div class="flex items-center mb-4">
            <button onclick="history.back()" class="text-gray-600 hover:text-gray-800 mr-4">
              ← Volver
            </button>
            <h1 class="text-2xl font-bold text-navy">Detalles de Reserva</h1>
          </div>
          <p class="text-gray-600">Booking ID: <span class="font-mono text-sm">${bookingId}</span></p>
        </div>

        <!-- Booking Details Content -->
        <div id="booking-detail-content">
          <div class="flex justify-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
              <p class="text-gray-600">Cargando detalles de la reserva...</p>
            </div>
          </div>
        </div>

        <!-- Placeholder for when booking is loaded -->
        <div id="booking-actions" class="hidden mt-8">
          <div class="bg-white rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Acciones disponibles</h3>
            <div class="flex flex-wrap gap-3">
              <button class="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-hover">
                📞 Contactar profesional
              </button>
              <button class="border-2 border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white">
                ❌ Cancelar reserva
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: 'Detalles de Reserva - Kalos',
    showHeader: true,
    showFooter: true
  });
}

export function initializeBookingDetailPage(bookingId) {
  console.log('📋 Initializing booking detail page for:', bookingId);
  initializeLayout();
  
  // Load booking details
  loadBookingDetail(bookingId);
}

async function loadBookingDetail(bookingId) {
  console.log('📋 Loading booking detail for:', bookingId);
  
  const contentContainer = document.getElementById('booking-detail-content');
  if (!contentContainer) return;
  
  try {
    // For now, show a placeholder since we don't have the get booking service implemented
    setTimeout(() => {
      contentContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-center py-8">
            <div class="text-6xl mb-4">🚧</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Página en desarrollo</h3>
            <p class="text-gray-600 mb-4">
              Los detalles de la reserva se mostrarán aquí cuando esté implementado el servicio de consulta.
            </p>
            <p class="text-sm text-gray-500">Booking ID: <strong>${bookingId}</strong></p>
            
            <div class="mt-6 flex justify-center gap-4">
              <button onclick="location.href='/cuenta'" class="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-hover">
                Ver todas mis reservas
              </button>
              <button onclick="location.href='/marketplace'" class="border-2 border-brand text-brand px-6 py-2 rounded-lg hover:bg-brand hover:text-white">
                Hacer nueva reserva
              </button>
            </div>
          </div>
        </div>
      `;
    }, 1000);
    
  } catch (error) {
    console.error('Error loading booking detail:', error);
    contentContainer.innerHTML = `
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 class="text-lg font-semibold text-red-600 mb-2">Error</h3>
        <p class="text-gray-600">No se pudo cargar los detalles de la reserva</p>
      </div>
    `;
  }
}

export default renderBookingDetailPage;