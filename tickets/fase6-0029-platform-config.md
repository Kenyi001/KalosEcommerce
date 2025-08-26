# Ticket Fase 6-0029: Configuración de Plataforma

## 📋 Descripción
Implementar sistema completo de configuración de plataforma para Kalos, permitiendo gestionar parámetros globales, configuraciones de servicios, políticas de negocio, personalización de marca y configuraciones operativas desde el panel administrativo.

## 🎯 Objetivos
- Panel de configuración centralizado
- Gestión de parámetros de negocio
- Configuración de políticas y reglas
- Personalización de marca y apariencia
- Configuración de servicios externos
- Gestión de tarifas y comisiones
- Configuración de notificaciones
- Backup y restauración de configuraciones

## 📊 Criterios de Aceptación

### ✅ Configuración General
- [ ] Información básica de la plataforma
- [ ] Configuración de idiomas y locales
- [ ] Configuración de zonas horarias
- [ ] Políticas de términos y privacidad
- [ ] Configuración de contacto y soporte

### ✅ Configuración de Negocio
- [ ] Gestión de categorías de servicios
- [ ] Configuración de comisiones por servicio
- [ ] Políticas de cancelación y reembolso
- [ ] Configuración de horarios operativos
- [ ] Límites y restricciones del sistema

### ✅ Personalización de Marca
- [ ] Logo y colores de la plataforma
- [ ] Personalización de emails
- [ ] Configuración de redes sociales
- [ ] Mensajes personalizados
- [ ] Configuración de SEO

### ✅ Servicios Externos
- [ ] Configuración de pagos (Stripe, etc.)
- [ ] Servicios de notificaciones (SMS, email)
- [ ] APIs de mapas y geolocalización
- [ ] Servicios de almacenamiento
- [ ] Servicios de análisis y métricas

## 🔧 Implementación Técnica

### Platform Configuration Architecture
```
src/
├── admin/
│   ├── components/
│   │   └── configuration/
│   │       ├── ConfigurationDashboard.js    # Dashboard principal
│   │       ├── GeneralSettings.js           # Config general
│   │       ├── BusinessSettings.js          # Config negocio
│   │       ├── BrandingSettings.js          # Personalización
│   │       ├── ServiceSettings.js           # Servicios externos
│   │       ├── NotificationSettings.js      # Config notificaciones
│   │       ├── PaymentSettings.js           # Config pagos
│   │       └── BackupSettings.js            # Backup/restore
│   └── services/
│       ├── ConfigurationService.js          # Servicio principal
│       ├── SettingsValidationService.js     # Validación settings
│       └── ConfigBackupService.js           # Backup configuraciones
├── services/
│   ├── ConfigService.js                     # Cliente configuración
│   └── SettingsCache.js                     # Cache configuraciones
└── config/
    ├── defaultSettings.js                   # Config por defecto
    └── settingsSchema.js                    # Schema validación
```

### ConfigurationService Implementation
```javascript
// src/admin/services/ConfigurationService.js
export class ConfigurationService {
  static configCache = new Map();
  static validationRules = new Map();
  static backupHistory = [];

  /**
   * Obtener configuración completa de la plataforma
   */
  static async getPlatformConfiguration() {
    try {
      const configDoc = await db.collection('platform_config').doc('settings').get();
      
      if (!configDoc.exists) {
        // Inicializar con configuración por defecto
        return await this.initializeDefaultConfiguration();
      }

      const config = configDoc.data();
      
      // Validar integridad de la configuración
      const validationResult = await this.validateConfiguration(config);
      if (!validationResult.isValid) {
        console.warn('Configuration validation issues:', validationResult.errors);
      }

      // Actualizar cache
      this.updateConfigCache(config);

      return {
        ...config,
        lastUpdated: config.lastUpdated || Date.now(),
        version: config.version || '1.0.0'
      };

    } catch (error) {
      console.error('Error getting platform configuration:', error);
      return await this.getDefaultConfiguration();
    }
  }

  /**
   * Actualizar configuración de la plataforma
   */
  static async updatePlatformConfiguration(configSection, updates, adminId) {
    try {
      // Validar cambios
      const validationResult = await this.validateConfigUpdates(configSection, updates);
      if (!validationResult.isValid) {
        return { 
          success: false, 
          errors: validationResult.errors 
        };
      }

      // Crear backup antes de actualizar
      const currentConfig = await this.getPlatformConfiguration();
      await this.createConfigBackup(currentConfig, adminId);

      // Preparar actualización
      const updatePath = `configuration.${configSection}`;
      const updateData = {
        [updatePath]: {
          ...updates,
          lastUpdated: Date.now(),
          updatedBy: adminId
        },
        lastModified: Date.now(),
        modifiedBy: adminId,
        version: this.incrementVersion(currentConfig.version)
      };

      // Actualizar en Firestore
      await db.collection('platform_config').doc('settings').update(updateData);

      // Actualizar cache local
      this.updateConfigCache(updateData);

      // Registrar cambio en log de auditoría
      await this.logConfigurationChange({
        section: configSection,
        changes: updates,
        adminId,
        timestamp: Date.now(),
        version: updateData.version
      });

      // Propagar cambios a servicios afectados
      await this.propagateConfigChanges(configSection, updates);

      return { success: true, version: updateData.version };

    } catch (error) {
      console.error('Error updating platform configuration:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Configuraciones por sección
   */
  static async getGeneralSettings() {
    try {
      const config = await this.getPlatformConfiguration();
      return {
        platform: {
          name: config.configuration?.general?.platform?.name || 'Kalos',
          tagline: config.configuration?.general?.platform?.tagline || 'Tu plataforma de belleza',
          description: config.configuration?.general?.platform?.description || '',
          website: config.configuration?.general?.platform?.website || '',
          supportEmail: config.configuration?.general?.platform?.supportEmail || 'soporte@kalos.com'
        },
        localization: {
          defaultLanguage: config.configuration?.general?.localization?.defaultLanguage || 'es',
          supportedLanguages: config.configuration?.general?.localization?.supportedLanguages || ['es'],
          defaultTimezone: config.configuration?.general?.localization?.defaultTimezone || 'America/La_Paz',
          currency: config.configuration?.general?.localization?.currency || 'BOB',
          dateFormat: config.configuration?.general?.localization?.dateFormat || 'DD/MM/YYYY'
        },
        policies: {
          termsOfService: config.configuration?.general?.policies?.termsOfService || '',
          privacyPolicy: config.configuration?.general?.policies?.privacyPolicy || '',
          cookiePolicy: config.configuration?.general?.policies?.cookiePolicy || '',
          refundPolicy: config.configuration?.general?.policies?.refundPolicy || ''
        },
        contact: {
          phone: config.configuration?.general?.contact?.phone || '',
          whatsapp: config.configuration?.general?.contact?.whatsapp || '',
          address: config.configuration?.general?.contact?.address || '',
          city: config.configuration?.general?.contact?.city || 'La Paz',
          country: config.configuration?.general?.contact?.country || 'Bolivia'
        }
      };
    } catch (error) {
      console.error('Error getting general settings:', error);
      return this.getDefaultGeneralSettings();
    }
  }

  static async getBusinessSettings() {
    try {
      const config = await this.getPlatformConfiguration();
      return {
        services: {
          categories: config.configuration?.business?.services?.categories || [],
          commissionRates: config.configuration?.business?.services?.commissionRates || {
            default: 15,
            premium: 10
          },
          bookingLimits: config.configuration?.business?.services?.bookingLimits || {
            maxAdvanceBooking: 90, // días
            minAdvanceBooking: 2, // horas
            maxSimultaneousBookings: 5
          }
        },
        operations: {
          workingHours: config.configuration?.business?.operations?.workingHours || {
            monday: { start: '08:00', end: '20:00', active: true },
            tuesday: { start: '08:00', end: '20:00', active: true },
            wednesday: { start: '08:00', end: '20:00', active: true },
            thursday: { start: '08:00', end: '20:00', active: true },
            friday: { start: '08:00', end: '20:00', active: true },
            saturday: { start: '09:00', end: '18:00', active: true },
            sunday: { start: '09:00', end: '18:00', active: false }
          },
          holidays: config.configuration?.business?.operations?.holidays || [],
          maintenanceMode: config.configuration?.business?.operations?.maintenanceMode || false
        },
        policies: {
          cancellation: {
            userWindow: config.configuration?.business?.policies?.cancellation?.userWindow || 24, // horas
            professionalWindow: config.configuration?.business?.policies?.cancellation?.professionalWindow || 2, // horas
            penalties: config.configuration?.business?.policies?.cancellation?.penalties || {
              user: 0,
              professional: 10 // porcentaje
            }
          },
          refunds: {
            enabled: config.configuration?.business?.policies?.refunds?.enabled || true,
            autoApprovalLimit: config.configuration?.business?.policies?.refunds?.autoApprovalLimit || 24, // horas
            processingTime: config.configuration?.business?.policies?.refunds?.processingTime || 5 // días laborales
          }
        }
      };
    } catch (error) {
      console.error('Error getting business settings:', error);
      return this.getDefaultBusinessSettings();
    }
  }

  static async getBrandingSettings() {
    try {
      const config = await this.getPlatformConfiguration();
      return {
        brand: {
          logo: config.configuration?.branding?.brand?.logo || '',
          favicon: config.configuration?.branding?.brand?.favicon || '',
          colors: {
            primary: config.configuration?.branding?.brand?.colors?.primary || '#8B5CF6',
            secondary: config.configuration?.branding?.brand?.colors?.secondary || '#EC4899',
            accent: config.configuration?.branding?.brand?.colors?.accent || '#06B6D4',
            neutral: config.configuration?.branding?.brand?.colors?.neutral || '#6B7280'
          },
          fonts: {
            heading: config.configuration?.branding?.brand?.fonts?.heading || 'Inter',
            body: config.configuration?.branding?.brand?.fonts?.body || 'Inter'
          }
        },
        social: {
          facebook: config.configuration?.branding?.social?.facebook || '',
          instagram: config.configuration?.branding?.social?.instagram || '',
          twitter: config.configuration?.branding?.social?.twitter || '',
          linkedin: config.configuration?.branding?.social?.linkedin || '',
          youtube: config.configuration?.branding?.social?.youtube || ''
        },
        seo: {
          title: config.configuration?.branding?.seo?.title || 'Kalos - Plataforma de Belleza',
          description: config.configuration?.branding?.seo?.description || '',
          keywords: config.configuration?.branding?.seo?.keywords || [],
          ogImage: config.configuration?.branding?.seo?.ogImage || ''
        },
        messaging: {
          welcomeMessage: config.configuration?.branding?.messaging?.welcomeMessage || '',
          footerText: config.configuration?.branding?.messaging?.footerText || '',
          maintenanceMessage: config.configuration?.branding?.messaging?.maintenanceMessage || ''
        }
      };
    } catch (error) {
      console.error('Error getting branding settings:', error);
      return this.getDefaultBrandingSettings();
    }
  }

  static async getServiceSettings() {
    try {
      const config = await this.getPlatformConfiguration();
      return {
        payments: {
          stripe: {
            enabled: config.configuration?.services?.payments?.stripe?.enabled || false,
            publicKey: config.configuration?.services?.payments?.stripe?.publicKey || '',
            webhookSecret: config.configuration?.services?.payments?.stripe?.webhookSecret || '',
            currency: config.configuration?.services?.payments?.stripe?.currency || 'usd'
          },
          paypal: {
            enabled: config.configuration?.services?.payments?.paypal?.enabled || false,
            clientId: config.configuration?.services?.payments?.paypal?.clientId || '',
            environment: config.configuration?.services?.payments?.paypal?.environment || 'sandbox'
          }
        },
        notifications: {
          email: {
            provider: config.configuration?.services?.notifications?.email?.provider || 'firebase',
            templates: config.configuration?.services?.notifications?.email?.templates || {}
          },
          sms: {
            provider: config.configuration?.services?.notifications?.sms?.provider || '',
            apiKey: config.configuration?.services?.notifications?.sms?.apiKey || ''
          },
          push: {
            enabled: config.configuration?.services?.notifications?.push?.enabled || true,
            vapidKey: config.configuration?.services?.notifications?.push?.vapidKey || ''
          }
        },
        maps: {
          provider: config.configuration?.services?.maps?.provider || 'google',
          apiKey: config.configuration?.services?.maps?.apiKey || '',
          defaultCenter: config.configuration?.services?.maps?.defaultCenter || {
            lat: -16.5000,
            lng: -68.1500
          },
          defaultZoom: config.configuration?.services?.maps?.defaultZoom || 12
        },
        storage: {
          provider: config.configuration?.services?.storage?.provider || 'firebase',
          bucketName: config.configuration?.services?.storage?.bucketName || '',
          maxFileSize: config.configuration?.services?.storage?.maxFileSize || 5, // MB
          allowedTypes: config.configuration?.services?.storage?.allowedTypes || ['image/jpeg', 'image/png']
        },
        analytics: {
          google: {
            enabled: config.configuration?.services?.analytics?.google?.enabled || false,
            trackingId: config.configuration?.services?.analytics?.google?.trackingId || ''
          },
          facebook: {
            enabled: config.configuration?.services?.analytics?.facebook?.enabled || false,
            pixelId: config.configuration?.services?.analytics?.facebook?.pixelId || ''
          }
        }
      };
    } catch (error) {
      console.error('Error getting service settings:', error);
      return this.getDefaultServiceSettings();
    }
  }

  /**
   * Gestión de backups de configuración
   */
  static async createConfigBackup(config, adminId) {
    try {
      const backup = {
        configuration: config,
        createdAt: Date.now(),
        createdBy: adminId,
        version: config.version || '1.0.0',
        type: 'manual'
      };

      const backupRef = await db.collection('config_backups').add(backup);
      
      // Mantener solo los últimos 10 backups
      await this.cleanupOldBackups();

      return { success: true, backupId: backupRef.id };

    } catch (error) {
      console.error('Error creating config backup:', error);
      return { success: false, error: error.message };
    }
  }

  static async restoreConfigBackup(backupId, adminId) {
    try {
      const backupDoc = await db.collection('config_backups').doc(backupId).get();
      
      if (!backupDoc.exists) {
        throw new Error('Backup no encontrado');
      }

      const backup = backupDoc.data();
      
      // Crear backup del estado actual antes de restaurar
      const currentConfig = await this.getPlatformConfiguration();
      await this.createConfigBackup(currentConfig, adminId);

      // Restaurar configuración
      await db.collection('platform_config').doc('settings').set({
        ...backup.configuration,
        lastModified: Date.now(),
        modifiedBy: adminId,
        restoredFrom: backupId,
        restoredAt: Date.now()
      });

      // Registrar restauración
      await this.logConfigurationChange({
        section: 'all',
        changes: { action: 'restore', backupId },
        adminId,
        timestamp: Date.now(),
        type: 'restore'
      });

      return { success: true };

    } catch (error) {
      console.error('Error restoring config backup:', error);
      return { success: false, error: error.message };
    }
  }

  static async getConfigBackups() {
    try {
      const snapshot = await db.collection('config_backups')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        configuration: undefined // No incluir la config completa en la lista
      }));

    } catch (error) {
      console.error('Error getting config backups:', error);
      return [];
    }
  }

  /**
   * Validación de configuraciones
   */
  static async validateConfiguration(config) {
    const errors = [];
    const warnings = [];

    try {
      // Validar estructura básica
      if (!config.configuration) {
        errors.push('Estructura de configuración inválida');
        return { isValid: false, errors, warnings };
      }

      // Validar configuración general
      const general = config.configuration.general;
      if (general) {
        if (!general.platform?.name) {
          errors.push('Nombre de plataforma requerido');
        }
        if (general.platform?.supportEmail && !this.isValidEmail(general.platform.supportEmail)) {
          errors.push('Email de soporte inválido');
        }
      }

      // Validar configuración de negocio
      const business = config.configuration.business;
      if (business?.services?.commissionRates) {
        const rates = business.services.commissionRates;
        if (rates.default < 0 || rates.default > 50) {
          warnings.push('Tasa de comisión por defecto fuera del rango recomendado (0-50%)');
        }
      }

      // Validar configuración de servicios
      const services = config.configuration.services;
      if (services?.payments?.stripe?.enabled && !services.payments.stripe.publicKey) {
        errors.push('Clave pública de Stripe requerida si está habilitado');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };

    } catch (error) {
      return {
        isValid: false,
        errors: ['Error validando configuración: ' + error.message],
        warnings
      };
    }
  }

  static async validateConfigUpdates(section, updates) {
    const errors = [];

    try {
      switch (section) {
        case 'general':
          if (updates.platform?.supportEmail && !this.isValidEmail(updates.platform.supportEmail)) {
            errors.push('Email de soporte inválido');
          }
          break;

        case 'business':
          if (updates.services?.commissionRates) {
            const rates = updates.services.commissionRates;
            if (rates.default < 0 || rates.default > 100) {
              errors.push('Tasa de comisión debe estar entre 0% y 100%');
            }
          }
          break;

        case 'services':
          if (updates.payments?.stripe?.enabled && !updates.payments?.stripe?.publicKey) {
            errors.push('Clave pública de Stripe requerida');
          }
          break;
      }

      return { isValid: errors.length === 0, errors };

    } catch (error) {
      return { isValid: false, errors: [error.message] };
    }
  }

  /**
   * Propagación de cambios a servicios
   */
  static async propagateConfigChanges(section, updates) {
    try {
      // Notificar a servicios que dependan de la configuración
      switch (section) {
        case 'branding':
          // Actualizar tema visual
          await this.updateVisualTheme(updates);
          break;

        case 'services':
          // Reconfigurar servicios externos
          if (updates.payments) {
            await this.reconfigurePaymentServices(updates.payments);
          }
          if (updates.notifications) {
            await this.reconfigureNotificationServices(updates.notifications);
          }
          break;

        case 'business':
          // Actualizar políticas de negocio
          if (updates.policies) {
            await this.updateBusinessPolicies(updates.policies);
          }
          break;
      }

    } catch (error) {
      console.error('Error propagating config changes:', error);
    }
  }

  // Métodos auxiliares
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static incrementVersion(version) {
    const parts = version.split('.');
    const patch = parseInt(parts[2] || 0) + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
  }

  static updateConfigCache(config) {
    this.configCache.set('platform', config);
  }

  static async initializeDefaultConfiguration() {
    const defaultConfig = await this.getDefaultConfiguration();
    
    await db.collection('platform_config').doc('settings').set({
      ...defaultConfig,
      createdAt: Date.now(),
      version: '1.0.0'
    });

    return defaultConfig;
  }

  static async getDefaultConfiguration() {
    return {
      configuration: {
        general: await this.getDefaultGeneralSettings(),
        business: await this.getDefaultBusinessSettings(),
        branding: await this.getDefaultBrandingSettings(),
        services: await this.getDefaultServiceSettings()
      }
    };
  }

  static async logConfigurationChange(change) {
    try {
      await db.collection('config_audit_log').add(change);
    } catch (error) {
      console.error('Error logging configuration change:', error);
    }
  }

  static async cleanupOldBackups() {
    try {
      const snapshot = await db.collection('config_backups')
        .orderBy('createdAt', 'desc')
        .offset(10)
        .get();

      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }

  // Configuraciones por defecto
  static async getDefaultGeneralSettings() {
    return {
      platform: {
        name: 'Kalos',
        tagline: 'Tu plataforma de belleza en Bolivia',
        description: 'Conecta con los mejores profesionales de belleza',
        website: 'https://kalos.bo',
        supportEmail: 'soporte@kalos.bo'
      },
      localization: {
        defaultLanguage: 'es',
        supportedLanguages: ['es'],
        defaultTimezone: 'America/La_Paz',
        currency: 'BOB',
        dateFormat: 'DD/MM/YYYY'
      },
      policies: {
        termsOfService: '',
        privacyPolicy: '',
        cookiePolicy: '',
        refundPolicy: ''
      },
      contact: {
        phone: '+591 70000000',
        whatsapp: '+591 70000000',
        address: 'La Paz, Bolivia',
        city: 'La Paz',
        country: 'Bolivia'
      }
    };
  }

  static async getDefaultBusinessSettings() {
    return {
      services: {
        categories: [
          'Corte de cabello',
          'Coloración',
          'Manicure',
          'Pedicure',
          'Tratamientos faciales',
          'Maquillaje',
          'Depilación',
          'Masajes'
        ],
        commissionRates: {
          default: 15,
          premium: 10
        },
        bookingLimits: {
          maxAdvanceBooking: 90,
          minAdvanceBooking: 2,
          maxSimultaneousBookings: 5
        }
      },
      operations: {
        workingHours: {
          monday: { start: '08:00', end: '20:00', active: true },
          tuesday: { start: '08:00', end: '20:00', active: true },
          wednesday: { start: '08:00', end: '20:00', active: true },
          thursday: { start: '08:00', end: '20:00', active: true },
          friday: { start: '08:00', end: '20:00', active: true },
          saturday: { start: '09:00', end: '18:00', active: true },
          sunday: { start: '09:00', end: '18:00', active: false }
        },
        holidays: [],
        maintenanceMode: false
      },
      policies: {
        cancellation: {
          userWindow: 24,
          professionalWindow: 2,
          penalties: {
            user: 0,
            professional: 10
          }
        },
        refunds: {
          enabled: true,
          autoApprovalLimit: 24,
          processingTime: 5
        }
      }
    };
  }

  static async getDefaultBrandingSettings() {
    return {
      brand: {
        logo: '',
        favicon: '',
        colors: {
          primary: '#8B5CF6',
          secondary: '#EC4899',
          accent: '#06B6D4',
          neutral: '#6B7280'
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        }
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: ''
      },
      seo: {
        title: 'Kalos - Plataforma de Belleza en Bolivia',
        description: 'Conecta con los mejores profesionales de belleza en Bolivia',
        keywords: ['belleza', 'bolivia', 'servicios', 'profesionales'],
        ogImage: ''
      },
      messaging: {
        welcomeMessage: '¡Bienvenido a Kalos!',
        footerText: '© 2024 Kalos. Todos los derechos reservados.',
        maintenanceMessage: 'Estamos realizando mantenimiento. Volveremos pronto.'
      }
    };
  }

  static async getDefaultServiceSettings() {
    return {
      payments: {
        stripe: {
          enabled: false,
          publicKey: '',
          webhookSecret: '',
          currency: 'usd'
        },
        paypal: {
          enabled: false,
          clientId: '',
          environment: 'sandbox'
        }
      },
      notifications: {
        email: {
          provider: 'firebase',
          templates: {}
        },
        sms: {
          provider: '',
          apiKey: ''
        },
        push: {
          enabled: true,
          vapidKey: ''
        }
      },
      maps: {
        provider: 'google',
        apiKey: '',
        defaultCenter: {
          lat: -16.5000,
          lng: -68.1500
        },
        defaultZoom: 12
      },
      storage: {
        provider: 'firebase',
        bucketName: '',
        maxFileSize: 5,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
      },
      analytics: {
        google: {
          enabled: false,
          trackingId: ''
        },
        facebook: {
          enabled: false,
          pixelId: ''
        }
      }
    };
  }
}
```

### ConfigurationDashboard Component
```javascript
// src/admin/components/configuration/ConfigurationDashboard.js
export class ConfigurationDashboard {
  constructor() {
    this.currentSection = 'general';
    this.unsavedChanges = false;
    this.config = null;
  }

  async render() {
    this.config = await ConfigurationService.getPlatformConfiguration();
    
    return `
      <div class="configuration-dashboard">
        <div class="flex h-screen bg-gray-100">
          <!-- Sidebar -->
          <div class="w-64 bg-white shadow-sm">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900">Configuración</h2>
              <p class="text-sm text-gray-600 mt-1">Gestiona la plataforma</p>
            </div>
            
            <nav class="mt-6">
              ${this.renderSidebar()}
            </nav>
          </div>

          <!-- Main Content -->
          <div class="flex-1 overflow-hidden">
            <div class="h-full flex flex-col">
              <!-- Header -->
              <div class="bg-white shadow-sm px-6 py-4 border-b">
                <div class="flex items-center justify-between">
                  <h1 class="text-2xl font-semibold text-gray-900" id="section-title">
                    ${this.getSectionTitle()}
                  </h1>
                  <div class="flex items-center space-x-3">
                    <button 
                      id="backup-btn"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      Crear Backup
                    </button>
                    <button 
                      id="save-config-btn"
                      class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                      disabled
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 overflow-y-auto p-6">
                <div id="config-content">
                  ${await this.renderCurrentSection()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modals -->
        <div id="backup-modal" class="hidden">
          ${this.renderBackupModal()}
        </div>
      </div>
    `;
  }

  renderSidebar() {
    const sections = [
      { id: 'general', name: 'General', icon: 'cog' },
      { id: 'business', name: 'Negocio', icon: 'briefcase' },
      { id: 'branding', name: 'Marca', icon: 'color-swatch' },
      { id: 'services', name: 'Servicios', icon: 'puzzle' },
      { id: 'backups', name: 'Backups', icon: 'database' }
    ];

    return sections.map(section => `
      <a 
        href="#" 
        class="config-nav-item flex items-center px-6 py-3 text-sm font-medium transition-colors ${
          this.currentSection === section.id 
            ? 'text-indigo-600 bg-indigo-50 border-r-2 border-indigo-600' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }"
        data-section="${section.id}"
      >
        ${this.getIcon(section.icon)}
        <span class="ml-3">${section.name}</span>
      </a>
    `).join('');
  }

  async renderCurrentSection() {
    switch (this.currentSection) {
      case 'general':
        return await this.renderGeneralSettings();
      case 'business':
        return await this.renderBusinessSettings();
      case 'branding':
        return await this.renderBrandingSettings();
      case 'services':
        return await this.renderServiceSettings();
      case 'backups':
        return await this.renderBackupSettings();
      default:
        return '<div>Sección no encontrada</div>';
    }
  }

  async renderGeneralSettings() {
    const settings = await ConfigurationService.getGeneralSettings();
    
    return `
      <div class="space-y-8">
        <!-- Información de la Plataforma -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Información de la Plataforma</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <input 
                type="text" 
                id="platform-name"
                value="${settings.platform.name}"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tagline</label>
              <input 
                type="text" 
                id="platform-tagline"
                value="${settings.platform.tagline}"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea 
                id="platform-description"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >${settings.platform.description}</textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Sitio Web</label>
              <input 
                type="url" 
                id="platform-website"
                value="${settings.platform.website}"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email de Soporte</label>
              <input 
                type="email" 
                id="platform-support-email"
                value="${settings.platform.supportEmail}"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
          </div>
        </div>

        <!-- Localización -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Localización</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Idioma por Defecto</label>
              <select 
                id="default-language"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="es" ${settings.localization.defaultLanguage === 'es' ? 'selected' : ''}>Español</option>
                <option value="en" ${settings.localization.defaultLanguage === 'en' ? 'selected' : ''}>English</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Zona Horaria</label>
              <select 
                id="default-timezone"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="America/La_Paz" ${settings.localization.defaultTimezone === 'America/La_Paz' ? 'selected' : ''}>La Paz (UTC-4)</option>
                <option value="America/Santa_Cruz" ${settings.localization.defaultTimezone === 'America/Santa_Cruz' ? 'selected' : ''}>Santa Cruz (UTC-4)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Moneda</label>
              <select 
                id="currency"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="BOB" ${settings.localization.currency === 'BOB' ? 'selected' : ''}>Bolivianos (BOB)</option>
                <option value="USD" ${settings.localization.currency === 'USD' ? 'selected' : ''}>Dólares (USD)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Información de Contacto -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Teléfono</label>
              <input 
                type="tel" 
                id="contact-phone"
                value="${settings.contact.phone}"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">WhatsApp</label>
              <input 
                type="tel" 
                id="contact-whatsapp"
                value="${settings.contact.whatsapp}"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Dirección</label>
              <input 
                type="text" 
                id="contact-address"
                value="${settings.contact.address}"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ciudad</label>
              <input 
                type="text" 
                id="contact-city"
                value="${settings.contact.city}"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">País</label>
              <input 
                type="text" 
                id="contact-country"
                value="${settings.contact.country}"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Navigation
    document.addEventListener('click', (e) => {
      if (e.target.closest('.config-nav-item')) {
        e.preventDefault();
        const section = e.target.closest('.config-nav-item').dataset.section;
        this.switchSection(section);
      }
    });

    // Save button
    document.getElementById('save-config-btn')?.addEventListener('click', () => {
      this.saveCurrentSection();
    });

    // Backup button
    document.getElementById('backup-btn')?.addEventListener('click', () => {
      this.createBackup();
    });

    // Form changes detection
    document.addEventListener('input', (e) => {
      if (e.target.closest('#config-content')) {
        this.markUnsavedChanges();
      }
    });
  }

  async switchSection(section) {
    if (this.unsavedChanges) {
      if (!confirm('Tienes cambios sin guardar. ¿Continuar sin guardar?')) {
        return;
      }
    }

    this.currentSection = section;
    this.unsavedChanges = false;
    
    // Update UI
    document.querySelectorAll('.config-nav-item').forEach(item => {
      item.classList.remove('text-indigo-600', 'bg-indigo-50', 'border-r-2', 'border-indigo-600');
      item.classList.add('text-gray-600');
    });
    
    document.querySelector(`[data-section="${section}"]`).classList.add(
      'text-indigo-600', 'bg-indigo-50', 'border-r-2', 'border-indigo-600'
    );

    document.getElementById('section-title').textContent = this.getSectionTitle();
    document.getElementById('config-content').innerHTML = await this.renderCurrentSection();
    document.getElementById('save-config-btn').disabled = true;
  }

  markUnsavedChanges() {
    this.unsavedChanges = true;
    document.getElementById('save-config-btn').disabled = false;
  }

  async saveCurrentSection() {
    try {
      const updates = this.collectFormData();
      const result = await ConfigurationService.updatePlatformConfiguration(
        this.currentSection, 
        updates, 
        'admin-id' // TODO: Get real admin ID
      );

      if (result.success) {
        this.unsavedChanges = false;
        document.getElementById('save-config-btn').disabled = true;
        this.showSuccessMessage('Configuración guardada exitosamente');
      } else {
        this.showErrorMessage('Error guardando configuración: ' + (result.errors?.join(', ') || result.error));
      }

    } catch (error) {
      console.error('Error saving configuration:', error);
      this.showErrorMessage('Error guardando configuración');
    }
  }

  collectFormData() {
    const formData = {};
    const form = document.getElementById('config-content');
    
    // Collect all form inputs
    form.querySelectorAll('input, select, textarea').forEach(input => {
      const path = input.id.replace(/-/g, '.');
      this.setNestedValue(formData, path, input.value);
    });

    return formData;
  }

  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  getSectionTitle() {
    const titles = {
      general: 'Configuración General',
      business: 'Configuración de Negocio',
      branding: 'Personalización de Marca',
      services: 'Servicios Externos',
      backups: 'Gestión de Backups'
    };
    return titles[this.currentSection] || 'Configuración';
  }

  getIcon(iconName) {
    const icons = {
      cog: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
      briefcase: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>',
      'color-swatch': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z"></path></svg>',
      puzzle: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>',
      database: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>'
    };
    return icons[iconName] || '';
  }

  showSuccessMessage(message) {
    // Implementar notificación de éxito
    console.log('Success:', message);
  }

  showErrorMessage(message) {
    // Implementar notificación de error
    console.error('Error:', message);
  }
}
```

## 🧪 Testing

### Configuration System Tests
- [ ] Configuraciones se guardan y cargan correctamente
- [ ] Validación de configuraciones funciona
- [ ] Sistema de backup/restore opera bien
- [ ] Propagación de cambios es efectiva
- [ ] Cache de configuraciones funciona

### Settings Validation Tests
- [ ] Validación de emails, URLs y números
- [ ] Límites de valores son respetados
- [ ] Configuraciones inválidas son rechazadas
- [ ] Warnings se muestran apropiadamente

## 🚀 Deployment

### Configuration Management
- Setup de configuraciones por ambiente
- Sincronización de configuraciones entre instancias
- Monitoreo de cambios de configuración

### Performance Optimization
- Cache de configuraciones críticas
- Lazy loading de configuraciones no críticas
- Optimización de consultas de configuración

## 📦 Dependencies
- Firebase Firestore para persistencia
- ConfigService para cliente
- AdminService para gestión

## 🔗 Relaciones
- **Depende de**: fase6-0026-admin-dashboard
- **Integra con**: Todos los servicios de la plataforma
- **Configura**: fase6-0028-content-moderation

---

**Estado**: 🟡 Pendiente  
**Prioridad**: Alta  
**Estimación**: 18 horas  
**Asignado**: Senior Full Stack Developer  

**Sprint**: Sprint 6 - Administración  
**Deadline**: 7 octubre 2025