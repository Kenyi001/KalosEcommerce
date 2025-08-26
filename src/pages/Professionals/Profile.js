/**
 * Professional Profile Management Page
 * Allows professionals to create/edit their profiles
 */
import { authService } from '../../services/auth.js';
import { professionalService } from '../../services/professionals.js';
import { servicesService } from '../../services/services.js';
import { 
  createProfessionalProfile, 
  validateProfessionalProfile,
  SERVICE_CATEGORIES,
  SERVICE_SUBCATEGORIES,
  LOCATIONS 
} from '../../models/professional.js';

export class ProfessionalProfilePage {
  constructor() {
    this.state = {
      profile: null,
      services: [],
      portfolio: [],
      loading: false,
      saving: false,
      error: null,
      success: null,
      activeTab: 'profile', // profile, services, portfolio, verification
      editMode: false
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.switchTab = this.switchTab.bind(this);
  }

  async loadData() {
    try {
      this.setState({ loading: true, error: null });

      const user = authService.getCurrentUser();
      if (!user.user) {
        throw new Error('Usuario no autenticado');
      }

      // Load professional profile
      let profile = await professionalService.getProfile(user.user.uid);
      
      // If no profile exists, create a basic one
      if (!profile) {
        profile = createProfessionalProfile(user.user);
        this.setState({ editMode: true });
      }

      // Load services and portfolio
      const [services, portfolio] = await Promise.all([
        servicesService.getServicesByProfessional(user.user.uid, false),
        servicesService.getPortfolio(user.user.uid, false)
      ]);

      this.setState({
        profile,
        services,
        portfolio,
        loading: false
      });

    } catch (error) {
      console.error('Error loading professional data:', error);
      this.setState({
        error: 'Error al cargar los datos del perfil',
        loading: false
      });
    }
  }

  async handleSave(formData) {
    try {
      this.setState({ saving: true, error: null });

      const user = authService.getCurrentUser();
      const updatedProfile = await professionalService.updateProfile(user.user.uid, formData);

      this.setState({
        profile: updatedProfile,
        saving: false,
        editMode: false,
        success: 'Perfil actualizado correctamente'
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.setState({ success: null });
      }, 3000);

    } catch (error) {
      console.error('Error saving profile:', error);
      this.setState({
        error: error.message || 'Error al guardar el perfil',
        saving: false
      });
    }
  }

  async handleImageUpload(file, type = 'profile') {
    try {
      const user = authService.getCurrentUser();
      
      if (type === 'profile') {
        const imageUrl = await professionalService.uploadProfileImage(user.user.uid, file);
        this.setState({
          profile: {
            ...this.state.profile,
            personalInfo: {
              ...this.state.profile.personalInfo,
              profileImage: imageUrl
            }
          }
        });
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      this.setState({ error: 'Error al subir la imagen' });
    }
  }

  switchTab(tabName) {
    this.setState({ activeTab: tabName });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    const { profile, services, portfolio, loading, saving, error, success, activeTab, editMode } = this.state;

    if (loading) {
      return this.renderLoading();
    }

    return `
      <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between py-6">
              <div>
                <h1 class="text-3xl font-fraunces font-bold text-navy-900">Mi Perfil Profesional</h1>
                <p class="mt-1 text-gray-600">Gestiona tu información y servicios</p>
              </div>
              
              ${profile?.verification?.status === 'pending' ? `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                  <p class="text-yellow-800 text-sm font-medium">⏳ Verificación pendiente</p>
                </div>
              ` : profile?.verification?.status === 'approved' ? `
                <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <p class="text-green-800 text-sm font-medium">✅ Perfil verificado</p>
                </div>
              ` : profile?.verification?.status === 'rejected' ? `
                <div class="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  <p class="text-red-800 text-sm font-medium">❌ Verificación rechazada</p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="bg-white border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex space-x-8">
              ${this.renderTabButton('profile', 'Información Personal', 'user')}
              ${this.renderTabButton('services', 'Servicios', 'briefcase')}
              ${this.renderTabButton('portfolio', 'Portfolio', 'photograph')}
              ${this.renderTabButton('verification', 'Verificación', 'shield-check')}
            </nav>
          </div>
        </div>

        <!-- Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Messages -->
          ${success ? `
            <div class="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div class="flex">
                <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p class="ml-3 text-sm text-green-700">${success}</p>
              </div>
            </div>
          ` : ''}

          ${error ? `
            <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div class="flex">
                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p class="ml-3 text-sm text-red-700">${error}</p>
              </div>
            </div>
          ` : ''}

          <!-- Tab Content -->
          <div class="bg-white rounded-lg shadow-sm">
            ${this.renderTabContent(activeTab)}
          </div>
        </div>
      </div>
    `;
  }

  renderTabButton(tabKey, label, icon) {
    const isActive = this.state.activeTab === tabKey;
    return `
      <button 
        class="py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
          isActive 
            ? 'border-brand text-brand' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }"
        onclick="window.professionalProfile.switchTab('${tabKey}')">
        <div class="flex items-center space-x-2">
          ${this.renderIcon(icon)}
          <span>${label}</span>
        </div>
      </button>
    `;
  }

  renderIcon(iconName) {
    const icons = {
      user: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>',
      briefcase: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V8"/>',
      photograph: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>',
      'shield-check': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>'
    };

    return `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${icons[iconName] || ''}
      </svg>
    `;
  }

  renderTabContent(activeTab) {
    switch (activeTab) {
      case 'profile':
        return this.renderProfileTab();
      case 'services':
        return this.renderServicesTab();
      case 'portfolio':
        return this.renderPortfolioTab();
      case 'verification':
        return this.renderVerificationTab();
      default:
        return this.renderProfileTab();
    }
  }

  renderProfileTab() {
    const { profile, editMode, saving } = this.state;
    
    return `
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Información Personal</h2>
          <button 
            class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-600 transition-colors"
            onclick="window.professionalProfile.setState({ editMode: ${!editMode} })">
            ${editMode ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        ${editMode ? this.renderProfileForm() : this.renderProfileView()}
      </div>
    `;
  }

  renderProfileForm() {
    const { profile, saving } = this.state;
    
    return `
      <form id="profile-form" class="space-y-6">
        <!-- Profile Image -->
        <div class="flex items-center space-x-6">
          <div class="relative">
            <img 
              src="${profile?.personalInfo?.profileImage || '/assets/default-avatar.png'}" 
              alt="Profile" 
              class="w-24 h-24 rounded-full object-cover border-4 border-gray-200">
            <label for="profile-image" class="absolute bottom-0 right-0 bg-brand text-white rounded-full p-2 cursor-pointer hover:bg-brand-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </label>
            <input type="file" id="profile-image" class="hidden" accept="image/*">
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Foto de perfil</h3>
            <p class="text-sm text-gray-500">Sube una foto profesional para tu perfil</p>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label" for="firstName">Nombre *</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName"
              class="form-input" 
              value="${profile?.personalInfo?.firstName || ''}"
              required>
          </div>
          
          <div>
            <label class="form-label" for="lastName">Apellido *</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName"
              class="form-input" 
              value="${profile?.personalInfo?.lastName || ''}"
              required>
          </div>
          
          <div>
            <label class="form-label" for="phone">Teléfono *</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              class="form-input" 
              value="${profile?.personalInfo?.phone || ''}"
              placeholder="70123456"
              required>
          </div>
          
          <div>
            <label class="form-label" for="ci">CI *</label>
            <input 
              type="text" 
              id="ci" 
              name="ci"
              class="form-input" 
              value="${profile?.personalInfo?.ci || ''}"
              required>
          </div>
        </div>

        <!-- Business Information -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Información del Negocio</h3>
          
          <div class="space-y-6">
            <div>
              <label class="form-label" for="businessName">Nombre del negocio/marca *</label>
              <input 
                type="text" 
                id="businessName" 
                name="businessName"
                class="form-input" 
                value="${profile?.businessInfo?.businessName || ''}"
                required>
            </div>
            
            <div>
              <label class="form-label" for="description">Descripción *</label>
              <textarea 
                id="description" 
                name="description"
                rows="4" 
                class="form-input" 
                placeholder="Describe tus servicios y experiencia..."
                required>${profile?.businessInfo?.description || ''}</textarea>
              <p class="text-sm text-gray-500 mt-1">Mínimo 50 caracteres</p>
            </div>
            
            <div>
              <label class="form-label">Categorías de servicios *</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                ${Object.entries(SERVICE_CATEGORIES).map(([key, value]) => `
                  <label class="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="categories" 
                      value="${value}"
                      class="rounded border-gray-300 text-brand focus:ring-brand"
                      ${profile?.businessInfo?.categories?.includes(value) ? 'checked' : ''}>
                    <span class="text-sm">${this._formatCategoryName(value)}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="form-label" for="experience">Años de experiencia *</label>
                <input 
                  type="number" 
                  id="experience" 
                  name="experience"
                  class="form-input" 
                  value="${profile?.businessInfo?.experience || 0}"
                  min="0" 
                  max="50"
                  required>
              </div>
            </div>
          </div>
        </div>

        <!-- Location Information -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ubicación y Servicios</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label" for="department">Departamento *</label>
              <select id="department" name="department" class="form-input" required>
                <option value="">Seleccionar departamento</option>
                ${LOCATIONS.departments.map(dept => `
                  <option value="${dept}" ${profile?.location?.department === dept ? 'selected' : ''}>${dept}</option>
                `).join('')}
              </select>
            </div>
            
            <div>
              <label class="form-label" for="city">Ciudad *</label>
              <select id="city" name="city" class="form-input" required>
                <option value="">Seleccionar ciudad</option>
              </select>
            </div>
            
            <div>
              <label class="form-label" for="zone">Zona</label>
              <input 
                type="text" 
                id="zone" 
                name="zone"
                class="form-input" 
                value="${profile?.location?.zone || ''}"
                placeholder="Ej: Zona Sur, Centro">
            </div>
            
            <div>
              <label class="form-label" for="serviceRadius">Radio de servicio (km) *</label>
              <input 
                type="number" 
                id="serviceRadius" 
                name="serviceRadius"
                class="form-input" 
                value="${profile?.location?.serviceRadius || 10}"
                min="1" 
                max="50"
                required>
            </div>
          </div>
          
          <div class="mt-6">
            <label class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                name="homeService" 
                class="rounded border-gray-300 text-brand focus:ring-brand"
                ${profile?.location?.homeService ? 'checked' : ''}>
              <span class="text-sm">Ofrezco servicios a domicilio</span>
            </label>
          </div>
        </div>

        <!-- Save Button -->
        <div class="border-t pt-6">
          <button 
            type="submit" 
            class="w-full md:w-auto px-6 py-3 bg-brand text-white rounded-md hover:bg-brand-600 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}"
            ${saving ? 'disabled' : ''}>
            ${saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    `;
  }

  renderProfileView() {
    const { profile } = this.state;
    
    return `
      <div class="space-y-6">
        <!-- Profile Header -->
        <div class="flex items-center space-x-6">
          <img 
            src="${profile?.personalInfo?.profileImage || '/assets/default-avatar.png'}" 
            alt="Profile" 
            class="w-24 h-24 rounded-full object-cover border-4 border-gray-200">
          <div>
            <h3 class="text-2xl font-semibold text-gray-900">
              ${profile?.personalInfo?.firstName || ''} ${profile?.personalInfo?.lastName || ''}
            </h3>
            <p class="text-lg text-brand">${profile?.businessInfo?.businessName || ''}</p>
            <p class="text-gray-600">${profile?.businessInfo?.experience || 0} años de experiencia</p>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Información de Contacto</h4>
            <div class="space-y-2 text-sm">
              <p><span class="font-medium">Email:</span> ${profile?.email || ''}</p>
              <p><span class="font-medium">Teléfono:</span> ${profile?.personalInfo?.phone || ''}</p>
              <p><span class="font-medium">CI:</span> ${profile?.personalInfo?.ci || ''}</p>
            </div>
          </div>
          
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Ubicación</h4>
            <div class="space-y-2 text-sm">
              <p><span class="font-medium">Departamento:</span> ${profile?.location?.department || ''}</p>
              <p><span class="font-medium">Ciudad:</span> ${profile?.location?.city || ''}</p>
              <p><span class="font-medium">Zona:</span> ${profile?.location?.zone || 'No especificada'}</p>
              <p><span class="font-medium">Radio de servicio:</span> ${profile?.location?.serviceRadius || 10} km</p>
              <p><span class="font-medium">Servicio a domicilio:</span> ${profile?.location?.homeService ? 'Sí' : 'No'}</p>
            </div>
          </div>
        </div>

        <!-- Business Information -->
        <div class="pt-6 border-t">
          <h4 class="font-medium text-gray-900 mb-2">Sobre mi negocio</h4>
          <p class="text-gray-600 mb-4">${profile?.businessInfo?.description || ''}</p>
          
          <div class="mb-4">
            <h5 class="font-medium text-gray-700 mb-2">Categorías de servicios</h5>
            <div class="flex flex-wrap gap-2">
              ${profile?.businessInfo?.categories?.map(category => `
                <span class="px-3 py-1 bg-brand-100 text-brand-800 text-sm rounded-full">
                  ${this._formatCategoryName(category)}
                </span>
              `).join('') || '<span class="text-gray-500 text-sm">No especificadas</span>'}
            </div>
          </div>
          
          ${profile?.businessInfo?.certifications?.length > 0 ? `
            <div>
              <h5 class="font-medium text-gray-700 mb-2">Certificaciones</h5>
              <ul class="list-disc list-inside text-sm text-gray-600">
                ${profile.businessInfo.certifications.map(cert => `<li>${cert}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Statistics -->
        ${profile?.stats ? `
          <div class="pt-6 border-t">
            <h4 class="font-medium text-gray-900 mb-4">Estadísticas</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-brand">${profile.stats.totalServices || 0}</div>
                <div class="text-sm text-gray-600">Servicios</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-brand">${profile.stats.totalBookings || 0}</div>
                <div class="text-sm text-gray-600">Reservas</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-brand">${profile.stats.averageRating?.toFixed(1) || '0.0'}</div>
                <div class="text-sm text-gray-600">Calificación</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-brand">${profile.stats.totalReviews || 0}</div>
                <div class="text-sm text-gray-600">Reseñas</div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderServicesTab() {
    return `
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Mis Servicios</h2>
          <button class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-600 transition-colors">
            Agregar Servicio
          </button>
        </div>
        
        <div class="text-center py-12 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V8"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No tienes servicios aún</h3>
          <p class="mt-1 text-sm text-gray-500">Comienza agregando tus primeros servicios.</p>
        </div>
      </div>
    `;
  }

  renderPortfolioTab() {
    return `
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Mi Portfolio</h2>
          <button class="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-600 transition-colors">
            Agregar Trabajo
          </button>
        </div>
        
        <div class="text-center py-12 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No tienes trabajos en tu portfolio</h3>
          <p class="mt-1 text-sm text-gray-500">Muestra tus mejores trabajos a los clientes.</p>
        </div>
      </div>
    `;
  }

  renderVerificationTab() {
    const { profile } = this.state;
    const verification = profile?.verification;
    
    return `
      <div class="p-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Estado de Verificación</h2>
          <p class="mt-1 text-gray-600">Completa tu verificación para activar tu perfil</p>
        </div>
        
        ${this.renderVerificationStatus(verification)}
      </div>
    `;
  }

  renderVerificationStatus(verification) {
    if (!verification) return '';

    const status = verification.status;
    const statusConfig = {
      pending: {
        color: 'yellow',
        icon: '⏳',
        title: 'Verificación pendiente',
        description: 'Tu solicitud está siendo revisada por nuestro equipo'
      },
      approved: {
        color: 'green',
        icon: '✅',
        title: 'Perfil verificado',
        description: 'Tu perfil ha sido aprobado y está activo'
      },
      rejected: {
        color: 'red',
        icon: '❌',
        title: 'Verificación rechazada',
        description: 'Tu solicitud fue rechazada. Revisa los comentarios y vuelve a enviar'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return `
      <div class="bg-${config.color}-50 border border-${config.color}-200 rounded-lg p-6 mb-6">
        <div class="flex items-center">
          <span class="text-2xl mr-3">${config.icon}</span>
          <div>
            <h3 class="text-lg font-medium text-${config.color}-800">${config.title}</h3>
            <p class="text-${config.color}-700">${config.description}</p>
            ${verification.reviewedAt ? `
              <p class="text-sm text-${config.color}-600 mt-1">
                Revisado el ${new Date(verification.reviewedAt.toDate()).toLocaleDateString()}
              </p>
            ` : ''}
          </div>
        </div>
        
        ${verification.notes ? `
          <div class="mt-4 p-3 bg-${config.color}-100 rounded">
            <p class="text-sm text-${config.color}-800"><strong>Comentarios:</strong> ${verification.notes}</p>
          </div>
        ` : ''}
      </div>
      
      ${status !== 'approved' ? `
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Documentos requeridos</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 class="font-medium text-gray-900">Cédula de identidad</h4>
                  <p class="text-sm text-gray-600">Foto clara de tu CI por ambos lados</p>
                </div>
                ${verification.documents?.ciImage ? `
                  <span class="text-green-600">✓ Subido</span>
                ` : `
                  <button class="px-3 py-1 bg-brand text-white rounded text-sm">Subir</button>
                `}
              </div>
              
              <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 class="font-medium text-gray-900">Certificados (opcional)</h4>
                  <p class="text-sm text-gray-600">Certificados de capacitación o estudios</p>
                </div>
                ${verification.documents?.certificatesImages?.length > 0 ? `
                  <span class="text-green-600">✓ ${verification.documents.certificatesImages.length} archivo(s)</span>
                ` : `
                  <button class="px-3 py-1 bg-brand text-white rounded text-sm">Subir</button>
                `}
              </div>
            </div>
          </div>
          
          ${status === 'rejected' ? `
            <button class="w-full px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-600 transition-colors">
              Volver a enviar verificación
            </button>
          ` : ''}
        </div>
      ` : ''}
    `;
  }

  renderLoading() {
    return `
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    `;
  }

  _formatCategoryName(category) {
    const categoryNames = {
      hair: 'Cabello',
      nails: 'Uñas',
      makeup: 'Maquillaje',
      skincare: 'Cuidado de piel',
      massage: 'Masajes',
      eyebrows: 'Cejas',
      eyelashes: 'Pestañas'
    };
    
    return categoryNames[category] || category;
  }

  attachEvents() {
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', this.handleProfileFormSubmit.bind(this));
    }

    // Image upload
    const profileImageInput = document.getElementById('profile-image');
    if (profileImageInput) {
      profileImageInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
          this.handleImageUpload(e.target.files[0], 'profile');
        }
      });
    }

    // Department/city cascading
    const departmentSelect = document.getElementById('department');
    if (departmentSelect) {
      departmentSelect.addEventListener('change', this.handleDepartmentChange.bind(this));
      // Trigger change to populate cities
      if (departmentSelect.value) {
        this.handleDepartmentChange({ target: { value: departmentSelect.value } });
      }
    }
  }

  handleDepartmentChange(e) {
    const department = e.target.value;
    const citySelect = document.getElementById('city');
    
    if (citySelect) {
      citySelect.innerHTML = '<option value="">Seleccionar ciudad</option>';
      
      if (department && LOCATIONS.cities[department]) {
        LOCATIONS.cities[department].forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          if (this.state.profile?.location?.city === city) {
            option.selected = true;
          }
          citySelect.appendChild(option);
        });
      }
    }
  }

  async handleProfileFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const profileData = {
      personalInfo: {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        ci: formData.get('ci'),
        profileImage: this.state.profile?.personalInfo?.profileImage
      },
      businessInfo: {
        businessName: formData.get('businessName'),
        description: formData.get('description'),
        categories: formData.getAll('categories'),
        experience: parseInt(formData.get('experience')) || 0,
        certifications: this.state.profile?.businessInfo?.certifications || []
      },
      location: {
        department: formData.get('department'),
        city: formData.get('city'),
        zone: formData.get('zone'),
        serviceRadius: parseInt(formData.get('serviceRadius')) || 10,
        homeService: formData.has('homeService'),
        studioAddress: this.state.profile?.location?.studioAddress
      }
    };

    await this.handleSave(profileData);
  }

  mount(container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    
    container.innerHTML = this.render();
    this.attachEvents();

    // Make instance globally available for tab switching
    window.professionalProfile = this;

    // Load initial data
    this.loadData();
  }

  unmount() {
    delete window.professionalProfile;
  }

  static create() {
    return new ProfessionalProfilePage();
  }
}

export default ProfessionalProfilePage;