/**
 * Service Create/Edit Form Page
 * Form for creating and editing individual services
 */

import { renderWithLayout, initializeLayout } from '../../components/Layout.js';
import { servicesService } from '../../services/services.js';
import { authService } from '../../services/auth.js';
import { navigateTo } from '../../utils/router.js';
import { SERVICE_CATEGORIES } from '../../models/professional.js';

export function renderServiceFormPage(serviceId = null) {
  const isEdit = !!serviceId;
  const title = isEdit ? 'Editar Servicio' : 'Nuevo Servicio';
  
  const content = `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
          <nav class="flex items-center text-sm text-gray-500 mb-2">
            <a href="/pro/dashboard" class="hover:text-brand">Dashboard</a>
            <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            <a href="/pro/services" class="hover:text-brand">Servicios</a>
            <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            <span class="text-gray-900">${title}</span>
          </nav>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-navy">${title}</h1>
              <p class="text-gray-600 mt-1">${isEdit ? 'Actualiza la información de tu servicio' : 'Crea un nuevo servicio para ofrecer a tus clientes'}</p>
            </div>
            <button id="backBtn" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div id="loadingState" class="bg-white rounded-lg shadow-sm p-8 animate-pulse ${isEdit ? '' : 'hidden'}">
          <div class="space-y-6">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-24 bg-gray-200 rounded"></div>
            <div class="grid grid-cols-2 gap-4">
              <div class="h-10 bg-gray-200 rounded"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Main Form -->
        <form id="serviceForm" class="space-y-8 ${isEdit ? 'hidden' : ''}">
          <!-- Basic Information -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-navy mb-6">Información Básica</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="lg:col-span-2">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Servicio <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="ej: Corte de Cabello, Manicure Completa, Maquillaje de Novia"
                />
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                  Categoría <span class="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="">Selecciona una categoría...</option>
                  <!-- Categories will be populated by JavaScript -->
                </select>
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div>
                <label for="subcategory" class="block text-sm font-medium text-gray-700 mb-2">
                  Subcategoría
                </label>
                <input
                  type="text"
                  id="subcategory"
                  name="subcategory"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="ej: corte_hombre, color_completo"
                />
              </div>

              <div class="lg:col-span-2">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Descripción <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Describe detalladamente qué incluye el servicio, técnicas utilizadas, productos, etc."
                ></textarea>
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>
            </div>
          </div>

          <!-- Pricing and Duration -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-navy mb-6">Precio y Duración</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                  Precio (BOB) <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="1"
                    step="1"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent pr-12"
                    placeholder="150"
                  />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 text-sm">BOB</span>
                  </div>
                </div>
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div>
                <label for="duration" class="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos) <span class="text-red-500">*</span>
                </label>
                <select
                  id="duration"
                  name="duration"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="">Selecciona...</option>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1.5 horas</option>
                  <option value="120">2 horas</option>
                  <option value="150">2.5 horas</option>
                  <option value="180">3 horas</option>
                  <option value="240">4 horas</option>
                  <option value="custom">Personalizado</option>
                </select>
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div id="customDurationContainer" class="hidden">
                <label for="customDuration" class="block text-sm font-medium text-gray-700 mb-2">
                  Duración Personalizada (min)
                </label>
                <input
                  type="number"
                  id="customDuration"
                  name="customDuration"
                  min="5"
                  step="5"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="60"
                />
              </div>
            </div>
          </div>

          <!-- Service Location -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-navy mb-6">Ubicación del Servicio</h2>
            
            <div class="space-y-4">
              <div class="flex flex-col space-y-3">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    id="homeService"
                    name="homeService"
                    class="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
                  />
                  <div class="ml-3">
                    <span class="text-gray-900 font-medium">Servicio a domicilio</span>
                    <p class="text-gray-500 text-sm">Ofreces este servicio en casa del cliente</p>
                  </div>
                </label>
                
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    id="inShop"
                    name="inShop"
                    class="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
                  />
                  <div class="ml-3">
                    <span class="text-gray-900 font-medium">En mi local/salón</span>
                    <p class="text-gray-500 text-sm">El cliente viene a tu establecimiento</p>
                  </div>
                </label>
              </div>
              <div class="invalid-feedback text-red-500 text-sm mt-1 hidden" id="locationError"></div>
            </div>
          </div>

          <!-- Tags -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-navy mb-6">Etiquetas y Características</h2>
            
            <div class="space-y-4">
              <div>
                <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
                  Etiquetas
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="ej: rápido, tendencia, profesional"
                />
                <p class="text-gray-500 text-xs mt-1">Separa las etiquetas con comas. Ayudan a los clientes a encontrar tu servicio.</p>
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked
                    class="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
                  />
                  <span class="ml-2 text-gray-900 font-medium">Servicio activo</span>
                </label>
                <p class="text-gray-500 text-xs mt-1">Los servicios inactivos no aparecen en búsquedas pero se mantienen guardados</p>
              </div>
            </div>
          </div>

          <!-- Add-ons (Future Feature) -->
          <div class="bg-white rounded-lg shadow-sm p-6 opacity-50">
            <h2 class="text-xl font-semibold text-navy mb-2">Servicios Adicionales</h2>
            <p class="text-gray-500 text-sm mb-4">Funcionalidad próximamente disponible</p>
            <div class="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <p class="text-gray-500">Aquí podrás agregar servicios adicionales como:</p>
              <p class="text-gray-400 text-sm">• Tratamiento extra (+50 BOB, +30 min)</p>
              <p class="text-gray-400 text-sm">• Producto premium (+25 BOB)</p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">
                <span class="text-red-500">*</span> Campos obligatorios
              </div>
              <div class="flex space-x-4">
                <button
                  type="button"
                  id="saveDraftBtn"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Guardar Borrador
                </button>
                <button
                  type="submit"
                  id="submitBtn"
                  class="px-8 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors font-semibold flex items-center"
                >
                  <span id="submitText">${isEdit ? 'Actualizar Servicio' : 'Crear Servicio'}</span>
                  <svg id="submitSpinner" class="animate-spin -mr-1 ml-3 h-5 w-5 text-white hidden" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>

        <!-- Success Message -->
        <div id="successMessage" class="hidden bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <div>
              <h3 class="text-green-800 font-semibold" id="successTitle">¡Servicio creado exitosamente!</h3>
              <p class="text-green-700 mt-1" id="successMessage">Tu servicio ha sido creado y está disponible para reservas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: `${title} - Kalos`,
    showHeader: true,
    showFooter: false
  });
}

export function initializeServiceFormPage(serviceId = null) {
  initializeLayout();
  
  const isEdit = !!serviceId;
  let currentUser = null;
  let isSubmitting = false;
  let originalService = null;
  
  // DOM elements
  const form = document.getElementById('serviceForm');
  const loadingState = document.getElementById('loadingState');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitSpinner = document.getElementById('submitSpinner');
  const backBtn = document.getElementById('backBtn');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  
  // Initialize form
  populateCategories();
  setupEventListeners();
  
  if (isEdit) {
    loadService();
  } else {
    loadDraft();
  }

  async function loadService() {
    if (!serviceId) return;
    
    try {
      loadingState.classList.remove('hidden');
      form.classList.add('hidden');
      
      const result = await servicesService.getServiceById(serviceId);
      
      if (result.success) {
        originalService = result.data;
        populateForm(originalService);
      } else {
        throw new Error(result.error || 'Servicio no encontrado');
      }
      
    } catch (error) {
      console.error('Error loading service:', error);
      showError('Error al cargar el servicio: ' + error.message);
      navigateTo('/pro/services');
    } finally {
      loadingState.classList.add('hidden');
      form.classList.remove('hidden');
    }
  }

  function populateCategories() {
    const categorySelect = document.getElementById('category');
    
    Object.entries(SERVICE_CATEGORIES).forEach(([key, category]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  }

  function populateForm(service) {
    // Basic information
    document.getElementById('name').value = service.name || '';
    document.getElementById('category').value = service.category || '';
    document.getElementById('subcategory').value = service.subcategory || '';
    document.getElementById('description').value = service.description || '';
    
    // Pricing and duration
    document.getElementById('price').value = service.price || '';
    
    const standardDurations = [15, 30, 45, 60, 90, 120, 150, 180, 240];
    const durationSelect = document.getElementById('duration');
    
    if (standardDurations.includes(service.duration)) {
      durationSelect.value = service.duration;
    } else {
      durationSelect.value = 'custom';
      document.getElementById('customDurationContainer').classList.remove('hidden');
      document.getElementById('customDuration').value = service.duration;
    }
    
    // Location
    document.getElementById('homeService').checked = service.homeService || false;
    document.getElementById('inShop').checked = service.inShop || false;
    
    // Tags and status
    document.getElementById('tags').value = service.tags ? service.tags.join(', ') : '';
    document.getElementById('active').checked = service.active !== false;
  }

  function setupEventListeners() {
    // Back button
    backBtn.addEventListener('click', () => {
      if (hasUnsavedChanges()) {
        if (confirm('¿Estás seguro de que quieres salir? Se perderán los cambios no guardados.')) {
          navigateTo('/pro/services');
        }
      } else {
        navigateTo('/pro/services');
      }
    });
    
    // Duration select
    document.getElementById('duration').addEventListener('change', (e) => {
      const customContainer = document.getElementById('customDurationContainer');
      if (e.target.value === 'custom') {
        customContainer.classList.remove('hidden');
        document.getElementById('customDuration').required = true;
      } else {
        customContainer.classList.add('hidden');
        document.getElementById('customDuration').required = false;
      }
    });
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Save draft
    saveDraftBtn.addEventListener('click', saveDraft);
    
    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form
    if (!validateForm()) return;
    
    isSubmitting = true;
    setSubmitButtonLoading(true);
    
    try {
      // Get current user
      const authResult = await authService.waitForAuth();
      currentUser = authResult.user;
      
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      // Collect form data
      const serviceData = collectFormData();
      
      let result;
      if (isEdit) {
        result = await servicesService.updateService(serviceId, serviceData);
      } else {
        serviceData.professionalId = currentUser.uid;
        result = await servicesService.createService(serviceData);
      }
      
      if (result.success) {
        // Clear draft
        localStorage.removeItem('serviceDraft');
        
        // Show success message
        showSuccessMessage();
        
        // Redirect after delay
        setTimeout(() => {
          navigateTo('/pro/services');
        }, 2000);
      } else {
        throw new Error(result.error || 'Error al guardar el servicio');
      }
      
    } catch (error) {
      console.error('Error saving service:', error);
      showError('Error al guardar el servicio: ' + error.message);
    } finally {
      isSubmitting = false;
      setSubmitButtonLoading(false);
    }
  }

  function validateForm() {
    let isValid = true;
    
    // Clear all errors
    form.querySelectorAll('.invalid-feedback').forEach(el => {
      el.classList.add('hidden');
    });
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'description', 'price', 'duration'];
    requiredFields.forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (!validateField(field)) {
        isValid = false;
      }
    });
    
    // Validate custom duration
    const durationSelect = document.getElementById('duration');
    if (durationSelect.value === 'custom') {
      const customDuration = document.getElementById('customDuration');
      if (!customDuration.value || parseInt(customDuration.value) < 5) {
        showFieldError(customDuration, 'La duración debe ser al menos 5 minutos');
        isValid = false;
      }
    }
    
    // Validate service location
    const homeService = document.getElementById('homeService').checked;
    const inShop = document.getElementById('inShop').checked;
    
    if (!homeService && !inShop) {
      document.getElementById('locationError').textContent = 'Selecciona al menos un tipo de ubicación';
      document.getElementById('locationError').classList.remove('hidden');
      isValid = false;
    }
    
    return isValid;
  }

  function validateField(input) {
    clearFieldError(input);
    
    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');
    
    if (isRequired && !value) {
      showFieldError(input, 'Este campo es obligatorio');
      return false;
    }
    
    // Specific validations
    switch (input.name) {
      case 'price':
        if (value && (isNaN(value) || parseInt(value) < 1)) {
          showFieldError(input, 'El precio debe ser mayor a 0');
          return false;
        }
        break;
        
      case 'customDuration':
        if (value && (isNaN(value) || parseInt(value) < 5)) {
          showFieldError(input, 'La duración debe ser al menos 5 minutos');
          return false;
        }
        break;
    }
    
    return true;
  }

  function collectFormData() {
    const formData = new FormData(form);
    const data = {};
    
    // Basic fields
    data.name = formData.get('name').trim();
    data.category = formData.get('category');
    data.subcategory = formData.get('subcategory').trim();
    data.description = formData.get('description').trim();
    data.price = parseInt(formData.get('price'));
    
    // Duration
    const durationValue = formData.get('duration');
    if (durationValue === 'custom') {
      data.duration = parseInt(formData.get('customDuration'));
    } else {
      data.duration = parseInt(durationValue);
    }
    
    // Location
    data.homeService = document.getElementById('homeService').checked;
    data.inShop = document.getElementById('inShop').checked;
    
    // Tags
    const tagsValue = formData.get('tags');
    data.tags = tagsValue ? tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    // Status
    data.active = document.getElementById('active').checked;
    
    // Default values
    data.images = originalService?.images || [];
    data.addons = originalService?.addons || [];
    data.order = originalService?.order || 0;
    
    return data;
  }

  function showFieldError(input, message) {
    input.classList.add('border-red-300', 'focus:border-red-300', 'focus:ring-red-500');
    const errorEl = input.parentNode.querySelector('.invalid-feedback') || 
                    input.closest('.grid')?.querySelector('.invalid-feedback') ||
                    input.closest('div')?.querySelector('.invalid-feedback');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }

  function clearFieldError(input) {
    input.classList.remove('border-red-300', 'focus:border-red-300', 'focus:ring-red-500');
    const errorEl = input.parentNode.querySelector('.invalid-feedback') || 
                    input.closest('.grid')?.querySelector('.invalid-feedback') ||
                    input.closest('div')?.querySelector('.invalid-feedback');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  function setSubmitButtonLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitText.textContent = isEdit ? 'Actualizando...' : 'Creando...';
      submitSpinner.classList.remove('hidden');
    } else {
      submitBtn.disabled = false;
      submitText.textContent = isEdit ? 'Actualizar Servicio' : 'Crear Servicio';
      submitSpinner.classList.add('hidden');
    }
  }

  function showSuccessMessage() {
    const successContainer = document.getElementById('successMessage');
    const successTitle = document.getElementById('successTitle');
    const successMessage = document.getElementById('successMessage');
    
    if (isEdit) {
      successTitle.textContent = '¡Servicio actualizado exitosamente!';
      successMessage.textContent = 'Los cambios han sido guardados y el servicio está actualizado.';
    } else {
      successTitle.textContent = '¡Servicio creado exitosamente!';
      successMessage.textContent = 'Tu servicio ha sido creado y está disponible para reservas.';
    }
    
    successContainer.classList.remove('hidden');
    successContainer.scrollIntoView({ behavior: 'smooth' });
  }

  function saveDraft() {
    const data = collectFormData();
    localStorage.setItem('serviceDraft', JSON.stringify(data));
    
    // Show temporary confirmation
    const originalText = saveDraftBtn.textContent;
    saveDraftBtn.textContent = 'Guardado ✓';
    saveDraftBtn.classList.add('text-green-600');
    
    setTimeout(() => {
      saveDraftBtn.textContent = originalText;
      saveDraftBtn.classList.remove('text-green-600');
    }, 2000);
  }

  function loadDraft() {
    if (isEdit) return; // Don't load draft when editing
    
    const draft = localStorage.getItem('serviceDraft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        populateForm(data);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }

  function hasUnsavedChanges() {
    if (!isEdit || !originalService) return false;
    
    try {
      const currentData = collectFormData();
      return JSON.stringify(currentData) !== JSON.stringify(originalService);
    } catch {
      return false;
    }
  }

  function showError(message) {
    // You could implement a toast notification here
    alert(message);
  }
}

export default renderServiceFormPage;