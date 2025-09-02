# Ticket Fase 4-0012: Dashboard de Edición del Profesional

## 📋 Descripción
Crear interface completa para que el profesional edite su perfil, gestione servicios, portfolio y configuración de disponibilidad.

## 🎯 Objetivos
- Interface de edición del perfil profesional
- Gestión de servicios (CRUD completo)
- Upload y gestión de portfolio
- Configuración de disponibilidad y horarios
- Preview del perfil público
- Validaciones y feedback en tiempo real

## 📊 Criterios de Aceptación

### ✅ Información Personal
- [ ] Edición de datos básicos (nombre, bio, especialidades)
- [ ] Upload de foto de perfil con crop
- [ ] Configuración de ubicación y cobertura
- [ ] Toggle de visibilidad del perfil
- [ ] Preview en tiempo real

### ✅ Gestión de Servicios
- [ ] Lista de servicios existentes
- [ ] Crear nuevo servicio (modal/drawer)
- [ ] Editar servicio existente
- [ ] Eliminar servicio (con confirmación)
- [ ] Ordenar servicios por drag & drop
- [ ] Validación de precios y duraciones

### ✅ Portfolio Management
- [ ] Galería actual con vista grid
- [ ] Upload múltiple de imágenes
- [ ] Edición de metadatos (alt text, categoría)
- [ ] Reordenamiento por drag & drop
- [ ] Eliminación con confirmación
- [ ] Compresión automática de imágenes

### ✅ Disponibilidad y Horarios
- [ ] Configuración de horarios por día
- [ ] Gestión de días no disponibles
- [ ] Configuración de tiempo entre citas
- [ ] Excepciones de calendario (vacaciones)
- [ ] Preview de disponibilidad

### ✅ Configuración Avanzada
- [ ] Configuración de notificaciones
- [ ] Políticas de cancelación
- [ ] Configuración de pagos
- [ ] Términos y condiciones personalizados

## 🔧 Implementación Técnica

### Route Structure
```
/dashboard/profile → src/pages/dashboard/ProfileEdit.js
```

### Dashboard Profile Edit Implementation
```javascript
// src/pages/dashboard/ProfileEdit.js
import { professionalService } from '../../services/professionals.js';
import { uploadService } from '../../services/upload.js';
import { authService } from '../../services/auth.js';

export async function renderProfileEdit() {
  const user = await authService.getCurrentUser();
  if (!user || user.role !== 'professional') {
    return window.location.href = '/dashboard';
  }

  const professional = await professionalService.getCurrentProfessional();
  
  return `
    <div class="profile-edit-container max-w-6xl mx-auto p-6">
      ${renderHeader(professional)}
      ${renderTabNavigation()}
      <div class="tab-content">
        ${renderPersonalInfoTab(professional)}
        ${renderServicesTab(professional)}
        ${renderPortfolioTab(professional)}
        ${renderAvailabilityTab(professional)}
        ${renderSettingsTab(professional)}
      </div>
    </div>
  `;
}

function renderHeader(professional) {
  return `
    <header class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-kalos-navy">
          Editar perfil profesional
        </h1>
        <p class="text-gray-600 mt-2">
          Gestiona tu información, servicios y disponibilidad
        </p>
      </div>
      <div class="flex gap-3">
        <button class="btn-outline-primary" id="preview-profile">
          <i class="icon-eye mr-2"></i>
          Vista previa
        </button>
        <button class="btn-primary" id="save-changes" disabled>
          <i class="icon-save mr-2"></i>
          Guardar cambios
        </button>
      </div>
    </header>
  `;
}

function renderTabNavigation() {
  return `
    <nav class="tab-nav mb-6">
      <div class="border-b border-gray-200">
        <ul class="flex space-x-8" role="tablist">
          <li>
            <button class="tab-button active" data-tab="personal">
              <i class="icon-user mr-2"></i>
              Información personal
            </button>
          </li>
          <li>
            <button class="tab-button" data-tab="services">
              <i class="icon-scissors mr-2"></i>
              Servicios
            </button>
          </li>
          <li>
            <button class="tab-button" data-tab="portfolio">
              <i class="icon-image mr-2"></i>
              Portfolio
            </button>
          </li>
          <li>
            <button class="tab-button" data-tab="availability">
              <i class="icon-calendar mr-2"></i>
              Disponibilidad
            </button>
          </li>
          <li>
            <button class="tab-button" data-tab="settings">
              <i class="icon-settings mr-2"></i>
              Configuración
            </button>
          </li>
        </ul>
      </div>
    </nav>
  `;
}

function renderPersonalInfoTab(professional) {
  return `
    <div class="tab-panel active" id="personal-tab">
      <div class="grid md:grid-cols-2 gap-8">
        <div class="profile-form">
          <h3 class="text-lg font-semibold mb-4">Información básica</h3>
          
          <div class="form-group mb-6">
            <label class="form-label">Foto de perfil</label>
            <div class="avatar-upload">
              <img 
                src="${professional.avatar || '/default-avatar.png'}" 
                alt="Avatar" 
                class="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                id="avatar-preview"
              >
              <input type="file" id="avatar-input" accept="image/*" class="hidden">
              <button class="btn-outline-primary mt-2" id="change-avatar">
                Cambiar foto
              </button>
            </div>
          </div>

          <div class="form-group mb-4">
            <label for="display-name" class="form-label">Nombre a mostrar *</label>
            <input 
              type="text" 
              id="display-name" 
              class="form-input" 
              value="${professional.displayName || ''}"
              required
              maxlength="100"
            >
            <span class="form-help">Este es el nombre que verán tus clientes</span>
          </div>

          <div class="form-group mb-4">
            <label for="bio" class="form-label">Descripción profesional</label>
            <textarea 
              id="bio" 
              class="form-textarea" 
              rows="4"
              maxlength="500"
              placeholder="Cuéntanos sobre tu experiencia y especialidades..."
            >${professional.bio || ''}</textarea>
            <div class="form-help flex justify-between">
              <span>Describe tu experiencia y enfoque profesional</span>
              <span id="bio-counter">0/500</span>
            </div>
          </div>

          <div class="form-group mb-4">
            <label for="specialties" class="form-label">Especialidades</label>
            <div class="specialty-tags">
              <input 
                type="text" 
                id="specialty-input" 
                class="form-input" 
                placeholder="Agregar especialidad..."
              >
              <div class="tags-container mt-2" id="specialties-list">
                ${(professional.specialties || []).map(specialty => `
                  <span class="tag">
                    ${specialty}
                    <button type="button" class="tag-remove" data-specialty="${specialty}">×</button>
                  </span>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="form-group mb-4">
            <label class="form-label">Ubicación</label>
            <div class="grid grid-cols-2 gap-4">
              <select id="city" class="form-select">
                <option value="">Seleccionar ciudad</option>
                <option value="la-paz" ${professional.location?.city === 'la-paz' ? 'selected' : ''}>La Paz</option>
                <option value="cochabamba" ${professional.location?.city === 'cochabamba' ? 'selected' : ''}>Cochabamba</option>
                <option value="santa-cruz" ${professional.location?.city === 'santa-cruz' ? 'selected' : ''}>Santa Cruz</option>
              </select>
              <input 
                type="text" 
                id="zone" 
                class="form-input" 
                placeholder="Zona/Barrio"
                value="${professional.location?.zone || ''}"
              >
            </div>
          </div>

          <div class="form-group mb-6">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="profile-visible" 
                class="form-checkbox"
                ${professional.published ? 'checked' : ''}
              >
              <label for="profile-visible" class="ml-2">
                Perfil visible para clientes
              </label>
            </div>
            <span class="form-help">
              Si está desactivado, los clientes no podrán encontrar tu perfil
            </span>
          </div>
        </div>

        <div class="profile-preview">
          <h3 class="text-lg font-semibold mb-4">Vista previa</h3>
          <div class="preview-card bg-white border rounded-lg p-6">
            ${renderProfilePreview(professional)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderServicesTab(professional) {
  return `
    <div class="tab-panel" id="services-tab">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold">Gestión de servicios</h3>
        <button class="btn-primary" id="add-service">
          <i class="icon-plus mr-2"></i>
          Agregar servicio
        </button>
      </div>

      <div class="services-list" id="services-container">
        ${(professional.services || []).map((service, index) => renderServiceCard(service, index)).join('')}
      </div>

      ${professional.services?.length === 0 ? `
        <div class="empty-state text-center py-12">
          <i class="icon-scissors text-4xl text-gray-400 mb-4"></i>
          <h4 class="text-lg font-semibold text-gray-600 mb-2">No tienes servicios registrados</h4>
          <p class="text-gray-500 mb-4">Agrega tu primer servicio para que los clientes puedan reservar contigo</p>
          <button class="btn-primary" id="add-first-service">
            Agregar primer servicio
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function renderServiceCard(service, index) {
  return `
    <div class="service-card bg-white border rounded-lg p-4 mb-4" data-service-id="${service.id}">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="drag-handle cursor-move">
            <i class="icon-drag-vertical text-gray-400"></i>
          </div>
          <div>
            <h4 class="font-semibold">${service.name}</h4>
            <p class="text-sm text-gray-600">${service.duration} min • Bs. ${service.price}</p>
            <p class="text-sm text-gray-500 mt-1">${service.description || 'Sin descripción'}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-icon" data-action="edit" data-service-id="${service.id}">
            <i class="icon-edit"></i>
          </button>
          <button class="btn-icon text-red-600" data-action="delete" data-service-id="${service.id}">
            <i class="icon-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initializeProfileEdit() {
  // Tab navigation
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => {
      switchTab(e.target.dataset.tab);
    });
  });

  // Avatar upload
  const avatarInput = document.getElementById('avatar-input');
  const changeAvatarBtn = document.getElementById('change-avatar');
  
  changeAvatarBtn?.addEventListener('click', () => avatarInput.click());
  avatarInput?.addEventListener('change', handleAvatarUpload);

  // Form validation and auto-save
  setupFormValidation();
  setupAutoSave();

  // Services management
  setupServicesManagement();

  // Portfolio management
  setupPortfolioManagement();

  // Availability configuration
  setupAvailabilityConfig();
}

function switchTab(tabName) {
  // Hide all tab panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  // Remove active class from all tab buttons
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  
  // Show selected tab panel
  document.getElementById(`${tabName}-tab`).classList.add('active');
  
  // Add active class to selected tab button
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

async function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    // Show loading state
    const preview = document.getElementById('avatar-preview');
    preview.style.opacity = '0.5';

    // Upload and get URL
    const avatarUrl = await uploadService.uploadAvatar(file);
    
    // Update preview
    preview.src = avatarUrl;
    preview.style.opacity = '1';
    
    // Mark as changed
    markFormAsChanged();
    
  } catch (error) {
    console.error('Error uploading avatar:', error);
    alert('Error al subir la imagen. Intenta nuevamente.');
  }
}

function setupFormValidation() {
  // Real-time validation for form fields
  const displayNameInput = document.getElementById('display-name');
  const bioTextarea = document.getElementById('bio');
  const bioCounter = document.getElementById('bio-counter');

  displayNameInput?.addEventListener('input', (e) => {
    validateDisplayName(e.target.value);
    markFormAsChanged();
  });

  bioTextarea?.addEventListener('input', (e) => {
    const length = e.target.value.length;
    bioCounter.textContent = `${length}/500`;
    markFormAsChanged();
  });
}

function setupAutoSave() {
  let autoSaveTimeout;
  
  function scheduleAutoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(saveChanges, 2000);
  }

  // Listen to form changes
  document.addEventListener('input', scheduleAutoSave);
  document.addEventListener('change', scheduleAutoSave);
}

function markFormAsChanged() {
  const saveBtn = document.getElementById('save-changes');
  saveBtn.disabled = false;
  saveBtn.classList.add('pulse');
}

async function saveChanges() {
  // Implementation for saving all form data
  try {
    const formData = collectFormData();
    await professionalService.updateProfile(formData);
    
    // Show success feedback
    showSuccessMessage('Cambios guardados correctamente');
    
    // Reset save button
    const saveBtn = document.getElementById('save-changes');
    saveBtn.disabled = true;
    saveBtn.classList.remove('pulse');
    
  } catch (error) {
    console.error('Error saving changes:', error);
    showErrorMessage('Error al guardar los cambios');
  }
}

function collectFormData() {
  return {
    displayName: document.getElementById('display-name')?.value,
    bio: document.getElementById('bio')?.value,
    specialties: collectSpecialties(),
    location: {
      city: document.getElementById('city')?.value,
      zone: document.getElementById('zone')?.value
    },
    published: document.getElementById('profile-visible')?.checked
  };
}
```

## 🧪 Testing

### Unit Tests
- [ ] Form validation functions
- [ ] Auto-save functionality
- [ ] Image upload handling
- [ ] Data collection and formatting

### Integration Tests
- [ ] Complete profile update flow
- [ ] Service CRUD operations
- [ ] Portfolio management
- [ ] Tab navigation and state

### E2E Tests
- [ ] Professional edits complete profile
- [ ] Add/edit/delete services
- [ ] Upload portfolio images
- [ ] Configure availability

## 🚀 Deployment

### Performance
- Image compression for uploads
- Auto-save debouncing
- Lazy loading for portfolio

### Security
- File type validation
- Image size limits
- Input sanitization

## 📦 Dependencies
- ProfessionalsService
- UploadService
- AuthService
- Image compression library

## 🔗 Relaciones
- **Conecta con**: /pro/:handle (preview)
- **Usa**: Professional profile data
- **Alimenta**: Public profile display

---

**Estado**: 📋 Planificado  
**Prioridad**: Alta  
**Estimación**: 16 horas  
**Asignado**: Frontend Developer  

**Sprint**: Sprint 4 - Frontend y UX  
**Deadline**: 8 septiembre 2025
