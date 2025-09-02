/**
 * Professional Services Management Page
 * CRUD interface for managing professional services
 */

import { renderWithLayout, initializeLayout } from '../../components/Layout.js';
import { servicesService } from '../../services/services.js';
import { authService } from '../../services/auth.js';
import { navigateTo } from '../../utils/router.js';
import { SERVICE_CATEGORIES } from '../../models/professional.js';

export function renderProfessionalServicesPage() {
  const content = `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <nav class="flex items-center text-sm text-gray-500 mb-2">
                <a href="/pro/dashboard" class="hover:text-brand">Dashboard</a>
                <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <span class="text-gray-900">Servicios</span>
              </nav>
              <h1 class="text-3xl font-bold text-navy">Mis Servicios</h1>
              <p class="text-gray-600 mt-1">Gestiona los servicios que ofreces a tus clientes</p>
            </div>
            
            <div class="mt-4 lg:mt-0">
              <button id="addServiceBtn" class="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-hover transition-colors font-semibold flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Nuevo Servicio
              </button>
            </div>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Buscar servicios..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
            
            <div class="flex gap-3">
              <select id="categoryFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent">
                <option value="">Todas las categorías</option>
                <!-- Categories will be populated by JavaScript -->
              </select>
              
              <select id="statusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent">
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Services Grid -->
        <div id="servicesContainer">
          <!-- Loading State -->
          <div id="loadingState" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="animate-pulse">
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div class="animate-pulse">
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div class="animate-pulse">
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div id="emptyState" class="hidden text-center py-16">
            <div class="bg-white rounded-lg shadow-sm p-12">
              <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2"/>
              </svg>
              <h3 class="text-xl font-semibold text-gray-600 mb-4">No tienes servicios aún</h3>
              <p class="text-gray-500 mb-6">Crea tu primer servicio para empezar a recibir reservas</p>
              <button onclick="document.getElementById('addServiceBtn').click()" class="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-hover transition-colors font-semibold">
                Crear Mi Primer Servicio
              </button>
            </div>
          </div>

          <!-- Services List -->
          <div id="servicesList" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Services will be populated here -->
          </div>
        </div>

        <!-- No Results -->
        <div id="noResults" class="hidden text-center py-16">
          <div class="bg-white rounded-lg shadow-sm p-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <h3 class="text-lg font-semibold text-gray-600 mb-2">No se encontraron servicios</h3>
            <p class="text-gray-500">Intenta cambiar los filtros o el término de búsqueda</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900">Eliminar Servicio</h3>
          </div>
          <p class="text-gray-600 mb-6">¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.</p>
          <div class="flex justify-end space-x-3">
            <button id="cancelDeleteBtn" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancelar
            </button>
            <button id="confirmDeleteBtn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: 'Mis Servicios - Kalos',
    showHeader: true,
    showFooter: false
  });
}

export function initializeProfessionalServicesPage() {
  initializeLayout();
  
  let services = [];
  let filteredServices = [];
  let currentUser = null;
  let serviceToDelete = null;
  
  // Initialize page
  loadServices();
  setupEventListeners();
  populateFilters();

  async function loadServices() {
    try {
      showLoadingState();
      
      // Get current user
      const authResult = await authService.waitForAuth();
      currentUser = authResult.user;
      
      if (!currentUser) {
        navigateTo('/auth/login');
        return;
      }
      
      // Load services
      const result = await servicesService.getServicesByProfessional(currentUser.uid);
      
      if (result.success) {
        services = result.data;
        filteredServices = [...services];
        renderServices();
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('Error loading services:', error);
      showError('Error al cargar los servicios');
    } finally {
      hideLoadingState();
    }
  }

  function setupEventListeners() {
    // Add service button
    document.getElementById('addServiceBtn').addEventListener('click', () => {
      navigateTo('/pro/services/new');
    });
    
    // Search input
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Filter selects
    document.getElementById('categoryFilter').addEventListener('change', handleFilter);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);
    
    // Delete modal
    document.getElementById('cancelDeleteBtn').addEventListener('click', hideDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    // Close modal on backdrop click
    document.getElementById('deleteModal').addEventListener('click', (e) => {
      if (e.target.id === 'deleteModal') {
        hideDeleteModal();
      }
    });
  }

  function populateFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    Object.entries(SERVICE_CATEGORIES).forEach(([key, category]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = category.name;
      categoryFilter.appendChild(option);
    });
  }

  function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
      filteredServices = [...services];
    } else {
      filteredServices = services.filter(service => 
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    renderServices();
  }

  function handleFilter() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    filteredServices = services.filter(service => {
      let matchesSearch = !searchTerm || 
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
      
      let matchesCategory = !categoryFilter || service.category === categoryFilter;
      
      let matchesStatus = !statusFilter || 
        (statusFilter === 'active' && service.active) ||
        (statusFilter === 'inactive' && !service.active);
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    renderServices();
  }

  function renderServices() {
    const servicesList = document.getElementById('servicesList');
    const emptyState = document.getElementById('emptyState');
    const noResults = document.getElementById('noResults');
    
    // Hide all states first
    servicesList.classList.add('hidden');
    emptyState.classList.add('hidden');
    noResults.classList.add('hidden');
    
    if (services.length === 0) {
      // No services at all
      emptyState.classList.remove('hidden');
      return;
    }
    
    if (filteredServices.length === 0) {
      // No results for current filter/search
      noResults.classList.remove('hidden');
      return;
    }
    
    // Render services
    servicesList.classList.remove('hidden');
    servicesList.innerHTML = '';
    
    filteredServices.forEach(service => {
      const serviceCard = createServiceCard(service);
      servicesList.appendChild(serviceCard);
    });
  }

  function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden';
    
    const statusBadge = service.active ? 
      '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>' :
      '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Inactivo</span>';
    
    const categoryName = SERVICE_CATEGORIES[service.category]?.name || service.category;
    
    const imageUrl = service.images && service.images.length > 0 ? service.images[0] : null;
    const imageSection = imageUrl ? 
      `<div class="h-48 bg-gray-100 overflow-hidden">
         <img src="${imageUrl}" alt="${service.name}" class="w-full h-full object-cover">
       </div>` :
      `<div class="h-48 bg-gradient-to-br from-brand/20 to-deep-coral/20 flex items-center justify-center">
         <svg class="w-16 h-16 text-brand/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
         </svg>
       </div>`;
    
    card.innerHTML = `
      ${imageSection}
      <div class="p-6">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-navy mb-1">${service.name}</h3>
            <p class="text-sm text-gray-500">${categoryName}</p>
          </div>
          ${statusBadge}
        </div>
        
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">${service.description}</p>
        
        <div class="flex items-center justify-between mb-4 text-sm">
          <div class="flex items-center space-x-4">
            <span class="font-semibold text-brand text-lg">${service.price} BOB</span>
            <span class="text-gray-500">${service.duration} min</span>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex flex-wrap gap-1">
            ${service.tags?.slice(0, 2).map(tag => 
              `<span class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">${tag}</span>`
            ).join('') || ''}
            ${service.tags?.length > 2 ? `<span class="text-xs text-gray-500">+${service.tags.length - 2}</span>` : ''}
          </div>
          
          <div class="flex items-center space-x-2">
            <button onclick="toggleServiceStatus('${service.id}', ${!service.active})" 
              class="p-2 text-gray-400 hover:text-brand transition-colors" title="${service.active ? 'Desactivar' : 'Activar'}">
              ${service.active ? 
                '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L11 11m2.5 2.5l1.414-1.414m0 0l1.414-1.414M14 17a3 3 0 01-3-3"></path></svg>' :
                '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>'
              }
            </button>
            <button onclick="editService('${service.id}')" 
              class="p-2 text-gray-400 hover:text-brand transition-colors" title="Editar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button onclick="deleteService('${service.id}', '${service.name}')" 
              class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3m-2 0h12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    
    return card;
  }

  function showLoadingState() {
    document.getElementById('loadingState').classList.remove('hidden');
  }

  function hideLoadingState() {
    document.getElementById('loadingState').classList.add('hidden');
  }

  function showDeleteModal(serviceId, serviceName) {
    serviceToDelete = { id: serviceId, name: serviceName };
    document.getElementById('deleteModal').classList.remove('hidden');
  }

  function hideDeleteModal() {
    serviceToDelete = null;
    document.getElementById('deleteModal').classList.add('hidden');
  }

  async function confirmDelete() {
    if (!serviceToDelete) return;
    
    try {
      const result = await servicesService.deleteService(serviceToDelete.id);
      
      if (result.success) {
        // Remove from local state
        services = services.filter(service => service.id !== serviceToDelete.id);
        filteredServices = filteredServices.filter(service => service.id !== serviceToDelete.id);
        
        // Re-render
        renderServices();
        
        showSuccess('Servicio eliminado exitosamente');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      showError('Error al eliminar el servicio');
    } finally {
      hideDeleteModal();
    }
  }

  async function toggleServiceStatus(serviceId, newStatus) {
    try {
      const result = await servicesService.updateService(serviceId, { active: newStatus });
      
      if (result.success) {
        // Update local state
        const serviceIndex = services.findIndex(service => service.id === serviceId);
        if (serviceIndex !== -1) {
          services[serviceIndex].active = newStatus;
        }
        
        const filteredIndex = filteredServices.findIndex(service => service.id === serviceId);
        if (filteredIndex !== -1) {
          filteredServices[filteredIndex].active = newStatus;
        }
        
        // Re-render
        renderServices();
        
        showSuccess(`Servicio ${newStatus ? 'activado' : 'desactivado'} exitosamente`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating service status:', error);
      showError('Error al actualizar el estado del servicio');
    }
  }

  // Global functions for card actions
  window.editService = function(serviceId) {
    navigateTo(`/pro/services/edit/${serviceId}`);
  };

  window.deleteService = function(serviceId, serviceName) {
    showDeleteModal(serviceId, serviceName);
  };

  window.toggleServiceStatus = toggleServiceStatus;

  function showSuccess(message) {
    // You could implement a toast notification here
    console.log('Success:', message);
  }

  function showError(message) {
    // You could implement a toast notification here
    console.error('Error:', message);
  }
}

export default renderProfessionalServicesPage;