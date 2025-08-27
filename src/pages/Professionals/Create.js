/**
 * Professional Create/Edit Page
 * Comprehensive form for professional profile creation and editing
 */

import { renderWithLayout, initializeLayout } from '../../components/Layout.js';
import { professionalService } from '../../services/professionals.js';
import { authService } from '../../services/auth.js';
import { navigateTo } from '../../utils/router.js';
import { 
  SERVICE_CATEGORIES, 
  LOCATIONS, 
  createProfessionalProfile,
  validateProfessionalProfile 
} from '../../models/professional.js';

export function renderProfessionalCreatePage() {
  const content = `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-sm mb-8 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-navy">Crear Perfil Profesional</h1>
              <p class="text-gray-600 mt-2">Completa tu información para comenzar a recibir clientes</p>
            </div>
            <button id="backBtn" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Main Form -->
        <form id="professionalForm" class="space-y-8">
          <!-- Personal Information -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-navy mb-6 flex items-center">
              <span class="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center mr-3 text-brand font-bold">1</span>
              Información Personal
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                  Nombres <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Tu nombre"
                />
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Tus apellidos"
                />
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono/WhatsApp <span class="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="ej: 70123456"
                />
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div>
                <label for="ci" class="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ci"
                  name="ci"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="ej: 12345678 LP"
                />
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>
            </div>
          </div>

          <!-- Business Information -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-navy mb-6 flex items-center">
              <span class="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center mr-3 text-brand font-bold">2</span>
              Información Profesional
            </h2>
            
            <div class="space-y-6">
              <div>
                <label for="businessName" class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio/Profesional <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="ej: Salón Bella, María Estilista"
                />
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Profesional <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Describe tu experiencia, especialidades y qué te hace única..."
                ></textarea>
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <!-- Service Categories -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Servicios que Ofreces <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3" id="categoriesGrid">
                  <!-- Categories will be populated by JavaScript -->
                </div>
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">
                    Años de Experiencia <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  >
                    <option value="">Selecciona...</option>
                    <option value="0">Menos de 1 año</option>
                    <option value="1">1 año</option>
                    <option value="2">2 años</option>
                    <option value="3">3 años</option>
                    <option value="4">4 años</option>
                    <option value="5">5 años</option>
                    <option value="10">Más de 10 años</option>
                  </select>
                  <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
                </div>

                <div>
                  <label for="certifications" class="block text-sm font-medium text-gray-700 mb-2">
                    Certificaciones
                  </label>
                  <input
                    type="text"
                    id="certifications"
                    name="certifications"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    placeholder="ej: Cosmetología, Barbería Profesional"
                  />
                  <p class="text-gray-500 text-xs mt-1">Separa múltiples certificaciones con comas</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-navy mb-6 flex items-center">
              <span class="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center mr-3 text-brand font-bold">3</span>
              Ubicación y Área de Servicio
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="department" class="block text-sm font-medium text-gray-700 mb-2">
                  Departamento <span class="text-red-500">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="">Selecciona un departamento...</option>
                  <!-- Departments will be populated by JavaScript -->
                </select>
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad <span class="text-red-500">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  disabled
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="">Primero selecciona un departamento</option>
                </select>
                <div class="invalid-feedback text-red-500 text-sm mt-1 hidden"></div>
              </div>

              <div>
                <label for="zone" class="block text-sm font-medium text-gray-700 mb-2">
                  Zona/Área
                </label>
                <input
                  type="text"
                  id="zone"
                  name="zone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="ej: Zona Sur, Centro, Calacoto"
                />
              </div>

              <div>
                <label for="serviceRadius" class="block text-sm font-medium text-gray-700 mb-2">
                  Radio de Servicio (km)
                </label>
                <select
                  id="serviceRadius"
                  name="serviceRadius"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="5">5 km</option>
                  <option value="10" selected>10 km</option>
                  <option value="15">15 km</option>
                  <option value="20">20 km</option>
                  <option value="30">30 km</option>
                </select>
              </div>
            </div>

            <!-- Service Type -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Servicio <span class="text-red-500">*</span>
              </label>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    id="homeService"
                    name="homeService"
                    value="true"
                    class="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
                  />
                  <span class="ml-2 text-gray-700">Servicio a domicilio</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    id="inShop"
                    name="inShop"
                    value="true"
                    class="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
                  />
                  <span class="ml-2 text-gray-700">En mi local/salón</span>
                </label>
              </div>
              <div class="invalid-feedback text-red-500 text-sm mt-1 hidden" id="serviceTypeError"></div>
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
                  <span id="submitText">Crear Perfil</span>
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
              <h3 class="text-green-800 font-semibold">¡Perfil creado exitosamente!</h3>
              <p class="text-green-700 mt-1">Tu perfil profesional ha sido creado y está en proceso de verificación.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return renderWithLayout(content, {
    title: 'Crear Perfil Profesional - Kalos',
    showHeader: true,
    showFooter: false
  });
}

export function initializeProfessionalCreatePage() {
  initializeLayout();
  
  // Form state
  let formData = {};
  let isSubmitting = false;
  
  // DOM elements
  const form = document.getElementById('professionalForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitSpinner = document.getElementById('submitSpinner');
  const backBtn = document.getElementById('backBtn');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  
  // Initialize form
  populateCategories();
  populateLocations();
  setupEventListeners();

  /**
   * Populate service categories
   */
  function populateCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    
    Object.entries(SERVICE_CATEGORIES).forEach(([key, category]) => {
      const categoryElement = document.createElement('label');
      categoryElement.className = 'flex items-center p-3 border border-gray-200 rounded-lg hover:border-brand hover:bg-brand/5 cursor-pointer transition-colors';
      categoryElement.innerHTML = `
        <input
          type="checkbox"
          name="categories"
          value="${key}"
          class="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
        />
        <div class="ml-3">
          <div class="text-sm font-medium text-gray-900">${category.name}</div>
          <div class="text-xs text-gray-500">${category.description}</div>
        </div>
      `;
      categoriesGrid.appendChild(categoryElement);
    });
  }

  /**
   * Populate locations
   */
  function populateLocations() {
    const departmentSelect = document.getElementById('department');
    const citySelect = document.getElementById('city');
    
    // Populate departments
    Object.entries(LOCATIONS).forEach(([department, data]) => {
      const option = document.createElement('option');
      option.value = department;
      option.textContent = data.name;
      departmentSelect.appendChild(option);
    });
    
    // Handle department change
    departmentSelect.addEventListener('change', (e) => {
      const selectedDepartment = e.target.value;
      citySelect.innerHTML = '<option value="">Selecciona una ciudad...</option>';
      citySelect.disabled = !selectedDepartment;
      
      if (selectedDepartment && LOCATIONS[selectedDepartment]) {
        LOCATIONS[selectedDepartment].cities.forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
        });
        citySelect.disabled = false;
      }
    });
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Back button
    backBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres salir? Se perderán los cambios no guardados.')) {
        navigateTo('/cuenta');
      }
    });
    
    // Save draft
    saveDraftBtn.addEventListener('click', () => {
      saveDraft();
    });
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    isSubmitting = true;
    setSubmitButtonLoading(true);
    
    try {
      // Collect form data
      const data = collectFormData();
      
      // Validate data
      const validation = validateProfessionalProfile(data);
      if (!validation.isValid) {
        displayValidationErrors(validation.errors);
        return;
      }
      
      // Get current user
      const { user } = await authService.waitForAuth();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      
      // Create professional profile
      const result = await professionalService.createProfile(user.uid, data);
      
      if (result.success) {
        showSuccessMessage();
        setTimeout(() => {
          navigateTo('/pro/dashboard');
        }, 2000);
      } else {
        throw new Error(result.error || 'Error al crear el perfil');
      }
      
    } catch (error) {
      console.error('Error creating professional profile:', error);
      showError('Error al crear el perfil profesional: ' + error.message);
    } finally {
      isSubmitting = false;
      setSubmitButtonLoading(false);
    }
  }

  /**
   * Collect form data
   */
  function collectFormData() {
    const formData = new FormData(form);
    const data = {};
    
    // Basic fields
    for (let [key, value] of formData.entries()) {
      if (key === 'categories') {
        if (!data.categories) data.categories = [];
        data.categories.push(value);
      } else if (key === 'certifications') {
        data.certifications = value.split(',').map(cert => cert.trim()).filter(cert => cert);
      } else {
        data[key] = value;
      }
    }
    
    // Checkboxes
    data.homeService = document.getElementById('homeService').checked;
    data.inShop = document.getElementById('inShop').checked;
    
    // Structure according to professional model
    return createProfessionalProfile({
      personalInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        ci: data.ci
      },
      businessInfo: {
        businessName: data.businessName,
        description: data.description,
        categories: data.categories || [],
        experience: parseInt(data.experience),
        certifications: data.certifications || []
      },
      location: {
        department: data.department,
        city: data.city,
        zone: data.zone || '',
        serviceRadius: parseInt(data.serviceRadius),
        homeService: data.homeService,
        inShop: data.inShop
      }
    });
  }

  /**
   * Validate individual field
   */
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
      case 'phone':
        if (value && !/^\d{8}$/.test(value.replace(/\s/g, ''))) {
          showFieldError(input, 'El teléfono debe tener 8 dígitos');
          return false;
        }
        break;
        
      case 'ci':
        if (value && !/^\d{7,8}\s?(LP|SC|CB|OR|PT|TJ|CH|BN|PD)$/i.test(value)) {
          showFieldError(input, 'Formato de CI inválido (ej: 12345678 LP)');
          return false;
        }
        break;
    }
    
    // Service type validation
    if (input.name === 'homeService' || input.name === 'inShop') {
      const homeService = document.getElementById('homeService').checked;
      const inShop = document.getElementById('inShop').checked;
      
      if (!homeService && !inShop) {
        document.getElementById('serviceTypeError').textContent = 'Selecciona al menos un tipo de servicio';
        document.getElementById('serviceTypeError').classList.remove('hidden');
        return false;
      } else {
        document.getElementById('serviceTypeError').classList.add('hidden');
      }
    }
    
    return true;
  }

  /**
   * Display validation errors
   */
  function displayValidationErrors(errors) {
    // Clear all previous errors
    form.querySelectorAll('.invalid-feedback').forEach(el => {
      el.classList.add('hidden');
      el.textContent = '';
    });
    
    // Show new errors
    Object.entries(errors).forEach(([field, error]) => {
      const input = form.querySelector(`[name="${field}"]`);
      if (input) {
        showFieldError(input, error);
      }
    });
  }

  /**
   * Show field error
   */
  function showFieldError(input, message) {
    input.classList.add('border-red-300', 'focus:border-red-300', 'focus:ring-red-500');
    const errorEl = input.parentNode.querySelector('.invalid-feedback');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }

  /**
   * Clear field error
   */
  function clearFieldError(input) {
    input.classList.remove('border-red-300', 'focus:border-red-300', 'focus:ring-red-500');
    const errorEl = input.parentNode.querySelector('.invalid-feedback');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  /**
   * Set submit button loading state
   */
  function setSubmitButtonLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitText.textContent = 'Creando...';
      submitSpinner.classList.remove('hidden');
    } else {
      submitBtn.disabled = false;
      submitText.textContent = 'Crear Perfil';
      submitSpinner.classList.add('hidden');
    }
  }

  /**
   * Show success message
   */
  function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('hidden');
    successMessage.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Show error message
   */
  function showError(message) {
    // You could implement a toast notification here
    alert(message);
  }

  /**
   * Save draft functionality
   */
  function saveDraft() {
    const data = collectFormData();
    localStorage.setItem('professionalProfileDraft', JSON.stringify(data));
    
    // Show temporary confirmation
    const originalText = saveDraftBtn.textContent;
    saveDraftBtn.textContent = 'Guardado ✓';
    saveDraftBtn.classList.add('text-green-600');
    
    setTimeout(() => {
      saveDraftBtn.textContent = originalText;
      saveDraftBtn.classList.remove('text-green-600');
    }, 2000);
  }

  /**
   * Load draft on page load
   */
  function loadDraft() {
    const draft = localStorage.getItem('professionalProfileDraft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        // Populate form with draft data
        // This would be implemented based on the specific form structure
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }
  
  // Load draft when page initializes
  loadDraft();
}

export default renderProfessionalCreatePage;