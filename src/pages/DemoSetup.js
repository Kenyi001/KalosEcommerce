/**
 * Demo Setup Page - Initialize demo data for testing
 * Creates demo professionals, services, and user for testing booking system
 */

import { renderWithLayout, initializeLayout } from '../components/Layout.js';
import { navigateTo } from '../utils/router.js';

export function renderDemoSetupPage() {
  const content = `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-navy mb-4">🧪 Demo Data Setup</h1>
          <p class="text-gray-600">Configura datos de prueba para probar el sistema de reservas</p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Demo User Setup -->
            <div class="space-y-4">
              <h2 class="text-xl font-bold text-navy mb-4">👤 Usuario Demo</h2>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h3 class="font-semibold text-blue-800 mb-2">Cliente Demo</h3>
                <p class="text-sm text-blue-600 mb-2">cliente.demo@kalos.com</p>
                <p class="text-sm text-blue-600">Rol: Cliente (Customer)</p>
              </div>
              
              <button 
                id="setupDemoUser" 
                class="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                🔧 Configurar Usuario Demo
              </button>
              
              <div id="userSetupResult" class="hidden p-3 rounded-lg"></div>
            </div>

            <!-- Demo Professionals Setup -->
            <div class="space-y-4">
              <h2 class="text-xl font-bold text-navy mb-4">👩‍💼 Profesionales Demo</h2>
              <div class="space-y-2 text-sm">
                <div class="bg-purple-50 p-3 rounded">
                  <strong>María González</strong> - Maquilladora<br>
                  <span class="text-gray-600">Maquillaje social, novias, fiestas</span>
                </div>
                <div class="bg-pink-50 p-3 rounded">
                  <strong>Ana Rodríguez</strong> - Nail Artist<br>
                  <span class="text-gray-600">Manicure, uñas decoradas</span>
                </div>
                <div class="bg-green-50 p-3 rounded">
                  <strong>Carmen Silva</strong> - Estilista<br>
                  <span class="text-gray-600">Cortes, peinados, tratamientos</span>
                </div>
              </div>
              
              <button 
                id="setupDemoProfessionals" 
                class="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors font-medium">
                ✨ Configurar Profesionales Demo
              </button>
              
              <div id="professionalsSetupResult" class="hidden p-3 rounded-lg"></div>
            </div>
          </div>

          <!-- Quick Setup All -->
          <div class="mt-8 pt-8 border-t border-gray-200">
            <div class="text-center">
              <button 
                id="setupAll" 
                class="bg-brand text-white py-4 px-8 rounded-lg hover:bg-brand-hover transition-colors font-bold text-lg shadow-lg">
                🚀 Configurar Todo (Inicio Rápido)
              </button>
              
              <div id="allSetupResult" class="hidden mt-4 p-4 rounded-lg"></div>
              
              <p class="mt-4 text-sm text-gray-600">
                Esto configurará usuario demo + profesionales + servicios + disponibilidad<br>
                <strong>Perfecto para comenzar a probar el sistema inmediatamente</strong>
              </p>
            </div>
          </div>

          <!-- Test Instructions -->
          <div class="mt-8 pt-8 border-t border-gray-200">
            <h3 class="text-lg font-bold text-navy mb-4">📋 Instrucciones para Probar</h3>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <ol class="list-decimal list-inside space-y-2 text-sm">
                <li>Haz clic en <strong>"🚀 Configurar Todo"</strong></li>
                <li>Ve a <a href="/marketplace" class="text-brand font-medium hover:underline">Marketplace</a></li>
                <li>Verás profesionales disponibles y el botón <strong>"✨ Nueva Reserva"</strong></li>
                <li>Haz clic en <strong>"Nueva Reserva"</strong> para probar el flujo completo</li>
                <li>Sigue los 5 pasos: Servicio → Profesional → Fecha → Ubicación → Confirmación</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: 'Demo Setup - Kalos',
    showHeader: true,
    showFooter: false
  });
}

export function initializeDemoSetupPage() {
  initializeLayout();
  
  // Setup individual buttons
  document.getElementById('setupDemoUser').addEventListener('click', setupDemoUser);
  document.getElementById('setupDemoProfessionals').addEventListener('click', setupDemoProfessionals);
  document.getElementById('setupAll').addEventListener('click', setupAll);
}

function setupDemoUser() {
  console.log('👤 Setting up demo user...');
  
  const demoUser = {
    uid: 'demo-customer-123',
    email: 'cliente.demo@kalos.com',
    displayName: 'Cliente Demo',
    emailVerified: true
  };

  const demoProfile = {
    userType: 'customer',
    email: 'cliente.demo@kalos.com',
    displayName: 'Cliente Demo',
    phone: '+591 70000000',
    location: {
      city: 'La Paz',
      zone: 'Zona Sur',
      address: 'Calle 21 #123, Zona Sur',
      coordinates: { lat: -16.5167, lng: -68.1333 }
    },
    
    customerProfile: {
      preferences: ['maquillaje', 'uñas'],
      favoriteServices: [],
      bookingHistory: []
    },
    
    availableRoles: ['customer'],
    activeRole: 'customer',
    verified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Store in localStorage
  localStorage.setItem('demoUser', JSON.stringify(demoUser));
  localStorage.setItem('demoProfile', JSON.stringify(demoProfile));
  
  // Update UI
  const result = document.getElementById('userSetupResult');
  result.className = 'p-3 rounded-lg bg-green-50 border border-green-200';
  result.innerHTML = `
    <div class="flex items-center">
      <span class="text-green-500 text-xl mr-2">✅</span>
      <div>
        <div class="font-semibold text-green-800">Usuario demo configurado</div>
        <div class="text-sm text-green-600">Ya puedes navegar como cliente autenticado</div>
      </div>
    </div>
  `;
  result.classList.remove('hidden');
  
  console.log('✅ Demo user setup completed');
}

function setupDemoProfessionals() {
  console.log('👩‍💼 Setting up demo professionals...');
  
  const professionals = [
    {
      id: 'prof_maria_123',
      userId: 'user_maria_123',
      name: 'María González',
      email: 'maria.gonzalez@kalos.demo',
      phone: '+591 70123456',
      location: {
        city: 'La Paz',
        zone: 'Zona Sur',
        coordinates: { lat: -16.5167, lng: -68.1333 }
      },
      bio: 'Maquilladora profesional con 8 años de experiencia. Especializada en maquillaje de novias y eventos sociales.',
      specialties: ['Maquillaje', 'Peinados', 'Cejas'],
      experience: '8 años',
      rating: 4.9,
      completedBookings: 156,
      verified: true,
      featured: true,
      published: true,
      services: [
        { 
          id: 'service_maria_1',
          name: 'Maquillaje Social', 
          price: 150, 
          duration: 60, 
          description: 'Maquillaje para eventos sociales y citas especiales',
          category: 'makeup'
        },
        { 
          id: 'service_maria_2',
          name: 'Maquillaje de Novia', 
          price: 350, 
          duration: 120, 
          description: 'Maquillaje completo para el día más especial',
          category: 'makeup'
        },
        { 
          id: 'service_maria_3',
          name: 'Maquillaje de Fiesta', 
          price: 200, 
          duration: 90, 
          description: 'Maquillaje glamouroso para fiestas y celebraciones',
          category: 'makeup'
        }
      ]
    },
    
    {
      id: 'prof_ana_456',
      userId: 'user_ana_456',
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@kalos.demo',
      phone: '+591 71234567',
      location: {
        city: 'Santa Cruz',
        zone: 'Centro',
        coordinates: { lat: -17.7833, lng: -63.1821 }
      },
      bio: 'Nail artist especializada en diseños creativos y técnicas de última tendencia.',
      specialties: ['Uñas', 'Manicure', 'Pedicure'],
      experience: '5 años',
      rating: 4.8,
      completedBookings: 98,
      verified: true,
      featured: true,
      published: true,
      services: [
        { 
          id: 'service_ana_1',
          name: 'Manicure Clásico', 
          price: 80, 
          duration: 45, 
          description: 'Manicure tradicional con esmaltado',
          category: 'nails'
        },
        { 
          id: 'service_ana_2',
          name: 'Uñas Decoradas', 
          price: 120, 
          duration: 90, 
          description: 'Diseños artísticos y decoración personalizada',
          category: 'nails'
        },
        { 
          id: 'service_ana_3',
          name: 'Manicure y Pedicure', 
          price: 150, 
          duration: 120, 
          description: 'Servicio completo de manos y pies',
          category: 'nails'
        }
      ]
    },
    
    {
      id: 'prof_carmen_789',
      userId: 'user_carmen_789',
      name: 'Carmen Silva',
      email: 'carmen.silva@kalos.demo',
      phone: '+591 72345678',
      location: {
        city: 'Cochabamba',
        zone: 'Queru Queru',
        coordinates: { lat: -17.3895, lng: -66.1568 }
      },
      bio: 'Estilista profesional con formación internacional. Experta en cortes modernos y tratamientos capilares.',
      specialties: ['Cabello', 'Cortes', 'Peinados', 'Tratamientos'],
      experience: '10 años',
      rating: 4.7,
      completedBookings: 203,
      verified: true,
      featured: false,
      published: true,
      services: [
        { 
          id: 'service_carmen_1',
          name: 'Corte y Peinado', 
          price: 100, 
          duration: 75, 
          description: 'Corte moderno y peinado profesional',
          category: 'hair'
        },
        { 
          id: 'service_carmen_2',
          name: 'Peinado para Eventos', 
          price: 180, 
          duration: 90, 
          description: 'Peinado elegante para ocasiones especiales',
          category: 'hair'
        },
        { 
          id: 'service_carmen_3',
          name: 'Tratamiento Capilar', 
          price: 250, 
          duration: 120, 
          description: 'Tratamiento profundo para revitalizar el cabello',
          category: 'hair'
        }
      ]
    }
  ];
  
  // Store professionals data
  localStorage.setItem('demoProfessionals', JSON.stringify(professionals));
  
  // Create availability for next 30 days for each professional
  const availability = {};
  const today = new Date();
  
  professionals.forEach(prof => {
    availability[prof.id] = {};
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      // Skip Sundays
      if (dayOfWeek === 0) continue;
      
      availability[prof.id][dateStr] = {
        professionalId: prof.id,
        date: dateStr,
        dayOfWeek,
        isWorkingDay: true,
        timeSlots: [
          { start: '09:00', end: '10:00', available: true, bookingId: null },
          { start: '10:00', end: '11:00', available: true, bookingId: null },
          { start: '11:00', end: '12:00', available: true, bookingId: null },
          { start: '12:00', end: '13:00', available: true, bookingId: null },
          { start: '14:00', end: '15:00', available: true, bookingId: null },
          { start: '15:00', end: '16:00', available: true, bookingId: null },
          { start: '16:00', end: '17:00', available: true, bookingId: null },
          { start: '17:00', end: '18:00', available: true, bookingId: null }
        ]
      };
    }
  });
  
  localStorage.setItem('demoAvailability', JSON.stringify(availability));
  
  // Update UI
  const result = document.getElementById('professionalsSetupResult');
  result.className = 'p-3 rounded-lg bg-green-50 border border-green-200';
  result.innerHTML = `
    <div class="flex items-center">
      <span class="text-green-500 text-xl mr-2">✅</span>
      <div>
        <div class="font-semibold text-green-800">Profesionales configurados</div>
        <div class="text-sm text-green-600">${professionals.length} profesionales con servicios y disponibilidad</div>
      </div>
    </div>
  `;
  result.classList.remove('hidden');
  
  console.log('✅ Demo professionals setup completed');
}

function setupAll() {
  console.log('🚀 Setting up all demo data...');
  
  const btn = document.getElementById('setupAll');
  const result = document.getElementById('allSetupResult');
  
  btn.textContent = '⏳ Configurando...';
  btn.disabled = true;
  
  setTimeout(() => {
    setupDemoUser();
    setupDemoProfessionals();
    
    result.className = 'p-4 rounded-lg bg-green-50 border border-green-200';
    result.innerHTML = `
      <div class="text-center">
        <div class="text-green-500 text-3xl mb-2">🎉</div>
        <div class="font-bold text-green-800 text-lg mb-2">¡Todo configurado!</div>
        <div class="text-sm text-green-600 mb-4">
          Demo user + 3 profesionales + 9 servicios + 30 días de disponibilidad
        </div>
        <div class="flex justify-center space-x-4">
          <button onclick="location.href='/marketplace'" class="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-hover transition-colors">
            🏪 Ir al Marketplace
          </button>
          <button onclick="location.href='/booking/new'" class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors">
            ✨ Hacer Reserva
          </button>
        </div>
      </div>
    `;
    result.classList.remove('hidden');
    
    btn.textContent = '✅ Configurado';
    
    console.log('🎉 All demo data setup completed!');
  }, 1000);
}

export default renderDemoSetupPage;