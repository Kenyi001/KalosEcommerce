/**
 * Professional Data Models for Kalos E-commerce
 * Defines the data structures for professionals, services, and portfolios
 */

/**
 * Professional Profile Model
 * @typedef {Object} ProfessionalProfile
 * @property {string} uid - Firebase Auth UID
 * @property {string} email - Professional email
 * @property {PersonalInfo} personalInfo - Personal information
 * @property {BusinessInfo} businessInfo - Business information
 * @property {Location} location - Location and service area
 * @property {Verification} verification - Verification status and documents
 * @property {('active'|'inactive'|'suspended')} status - Account status
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {ProfessionalStats} stats - Performance statistics
 */

/**
 * Personal Information
 * @typedef {Object} PersonalInfo
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} phone - Phone number
 * @property {string} ci - Cedula de identidad (ID document)
 * @property {string} [profileImage] - Profile image URL
 */

/**
 * Business Information
 * @typedef {Object} BusinessInfo
 * @property {string} businessName - Business or professional name
 * @property {string} description - Professional description
 * @property {string[]} categories - Service categories ['hair', 'nails', 'makeup', 'skincare']
 * @property {number} experience - Years of experience
 * @property {string[]} certifications - Professional certifications
 */

/**
 * Location Information
 * @typedef {Object} Location
 * @property {string} department - Department (La Paz, Santa Cruz, etc.)
 * @property {string} city - City (La Paz, El Alto, etc.)
 * @property {string} zone - Zone (Zona Sur, Centro, etc.)
 * @property {number} serviceRadius - Kilometers willing to travel
 * @property {boolean} homeService - Provides home service
 * @property {StudioAddress} [studioAddress] - Studio address if applicable
 */

/**
 * Studio Address
 * @typedef {Object} StudioAddress
 * @property {string} street - Street address
 * @property {string} references - Address references
 * @property {Coordinates} [coordinates] - GPS coordinates
 */

/**
 * GPS Coordinates
 * @typedef {Object} Coordinates
 * @property {number} lat - Latitude
 * @property {number} lng - Longitude
 */

/**
 * Verification Status
 * @typedef {Object} Verification
 * @property {('pending'|'approved'|'rejected')} status - Verification status
 * @property {Date} submittedAt - Submission timestamp
 * @property {Date} [reviewedAt] - Review timestamp
 * @property {string} [reviewedBy] - Admin who reviewed
 * @property {Documents} documents - Verification documents
 * @property {string} [notes] - Review notes
 */

/**
 * Verification Documents
 * @typedef {Object} Documents
 * @property {string} [ciImage] - ID document image URL
 * @property {string[]} [certificatesImages] - Certificates images URLs
 * @property {string} [businessLicense] - Business license URL
 */

/**
 * Professional Statistics
 * @typedef {Object} ProfessionalStats
 * @property {number} totalServices - Total number of services offered
 * @property {number} totalBookings - Total bookings received
 * @property {number} averageRating - Average rating (0-5)
 * @property {number} totalReviews - Total number of reviews
 * @property {number} responseRate - Response rate percentage (0-100)
 * @property {Date} lastActiveAt - Last activity timestamp
 */

/**
 * Service Model
 * @typedef {Object} Service
 * @property {string} id - Service ID
 * @property {string} professionalId - Reference to professional
 * @property {ServiceBasicInfo} basicInfo - Basic service information
 * @property {ServiceDetails} details - Detailed service information
 * @property {ServiceAvailability} availability - Service availability
 * @property {('active'|'inactive')} status - Service status
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {ServiceStats} stats - Service statistics
 */

/**
 * Service Basic Information
 * @typedef {Object} ServiceBasicInfo
 * @property {string} name - Service name
 * @property {string} category - Main category (hair, nails, makeup, etc.)
 * @property {string} [subcategory] - Subcategory (cut, color, manicure, etc.)
 * @property {string} description - Service description
 * @property {number} duration - Duration in minutes
 * @property {number} price - Price in Bolivianos
 * @property {string} currency - Currency code ('BOB')
 */

/**
 * Service Details
 * @typedef {Object} ServiceDetails
 * @property {string[]} included - What's included in service
 * @property {string[]} [excluded] - What's not included
 * @property {string[]} [requirements] - Client requirements
 * @property {string[]} [aftercare] - Post-service care instructions
 * @property {string[]} images - Service images URLs
 */

/**
 * Service Availability
 * @typedef {Object} ServiceAvailability
 * @property {number[]} daysOfWeek - Available days (0-6, Sunday-Saturday)
 * @property {TimeSlot} timeSlots - Available time slots
 * @property {number} advanceBooking - Days in advance required
 * @property {number} [maxBookingsPerDay] - Maximum bookings per day
 */

/**
 * Time Slot
 * @typedef {Object} TimeSlot
 * @property {string} start - Start time (HH:MM format)
 * @property {string} end - End time (HH:MM format)
 */

/**
 * Service Statistics
 * @typedef {Object} ServiceStats
 * @property {number} totalBookings - Total bookings for this service
 * @property {number} averageRating - Average rating for this service
 * @property {number} totalReviews - Total reviews for this service
 * @property {Date} [lastBookedAt] - Last booking timestamp
 */

/**
 * Portfolio Item Model
 * @typedef {Object} PortfolioItem
 * @property {string} id - Portfolio item ID
 * @property {string} professionalId - Reference to professional
 * @property {('before_after'|'finished_work'|'process')} type - Portfolio type
 * @property {string} title - Portfolio item title
 * @property {string} [description] - Optional description
 * @property {PortfolioImages} images - Portfolio images
 * @property {string} serviceCategory - Associated service category
 * @property {string[]} tags - Searchable tags
 * @property {boolean} isPublic - Public visibility
 * @property {boolean} isFeatured - Featured in profile
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * Portfolio Images
 * @typedef {Object} PortfolioImages
 * @property {string} [before] - Before image URL (for before_after type)
 * @property {string} [after] - After image URL (for before_after type)
 * @property {string} main - Main image URL
 * @property {string[]} [gallery] - Additional images URLs
 */

/**
 * Available service categories
 */
export const SERVICE_CATEGORIES = {
  HAIR: 'hair',
  NAILS: 'nails',
  MAKEUP: 'makeup',
  SKINCARE: 'skincare',
  MASSAGE: 'massage',
  EYEBROWS: 'eyebrows',
  EYELASHES: 'eyelashes'
};

/**
 * Available subcategories by main category
 */
export const SERVICE_SUBCATEGORIES = {
  hair: ['cut', 'color', 'styling', 'treatment', 'extensions'],
  nails: ['manicure', 'pedicure', 'gel', 'acrylic', 'nail_art'],
  makeup: ['event', 'bridal', 'photoshoot', 'everyday', 'lessons'],
  skincare: ['facial', 'cleaning', 'hydration', 'anti_aging', 'acne_treatment'],
  massage: ['relaxing', 'therapeutic', 'sports', 'prenatal'],
  eyebrows: ['shaping', 'tinting', 'microblading', 'threading'],
  eyelashes: ['extensions', 'lift', 'tinting', 'volume']
};

/**
 * Bolivian departments and major cities
 */
export const LOCATIONS = {
  departments: [
    'La Paz',
    'Santa Cruz',
    'Cochabamba', 
    'Potosí',
    'Tarija',
    'Chuquisaca',
    'Oruro',
    'Beni',
    'Pando'
  ],
  cities: {
    'La Paz': ['La Paz', 'El Alto', 'Viacha', 'Achocalla'],
    'Santa Cruz': ['Santa Cruz de la Sierra', 'Montero', 'Warnes', 'La Guardia'],
    'Cochabamba': ['Cochabamba', 'Quillacollo', 'Sacaba', 'Tiquipaya']
  }
};

/**
 * Professional validation rules
 */
export const VALIDATION_RULES = {
  personalInfo: {
    firstName: { required: true, minLength: 2, maxLength: 50 },
    lastName: { required: true, minLength: 2, maxLength: 50 },
    phone: { required: true, pattern: /^[67]\d{7}$/ },
    ci: { required: true, minLength: 7, maxLength: 10 }
  },
  businessInfo: {
    businessName: { required: true, minLength: 3, maxLength: 100 },
    description: { required: true, minLength: 50, maxLength: 1000 },
    categories: { required: true, minItems: 1, maxItems: 3 },
    experience: { required: true, min: 0, max: 50 }
  },
  service: {
    name: { required: true, minLength: 3, maxLength: 100 },
    description: { required: true, minLength: 20, maxLength: 500 },
    duration: { required: true, min: 15, max: 480 }, // 15 min to 8 hours
    price: { required: true, min: 10, max: 10000 } // 10 Bs to 10,000 Bs
  }
};

/**
 * Create a new professional profile with default values
 * @param {Object} userData - User data from auth
 * @returns {ProfessionalProfile} New professional profile
 */
export function createProfessionalProfile(userData) {
  return {
    uid: userData.uid,
    email: userData.email,
    personalInfo: {
      firstName: userData.displayName?.split(' ')[0] || '',
      lastName: userData.displayName?.split(' ').slice(1).join(' ') || '',
      phone: userData.phoneNumber || '',
      ci: '',
      profileImage: userData.photoURL || null
    },
    businessInfo: {
      businessName: '',
      description: '',
      categories: [],
      experience: 0,
      certifications: []
    },
    location: {
      department: '',
      city: '',
      zone: '',
      serviceRadius: 10, // 10km default
      homeService: true,
      studioAddress: null
    },
    verification: {
      status: 'pending',
      submittedAt: new Date(),
      documents: {}
    },
    status: 'inactive', // Inactive until verified
    createdAt: new Date(),
    updatedAt: new Date(),
    stats: {
      totalServices: 0,
      totalBookings: 0,
      averageRating: 0,
      totalReviews: 0,
      responseRate: 0,
      lastActiveAt: new Date()
    }
  };
}

/**
 * Create a new service with default values
 * @param {string} professionalId - Professional ID
 * @param {Object} serviceData - Service data
 * @returns {Service} New service
 */
export function createService(professionalId, serviceData) {
  return {
    id: null, // Will be set by Firestore
    professionalId,
    basicInfo: {
      name: serviceData.name || '',
      category: serviceData.category || '',
      subcategory: serviceData.subcategory || null,
      description: serviceData.description || '',
      duration: serviceData.duration || 60,
      price: serviceData.price || 0,
      currency: 'BOB'
    },
    details: {
      included: serviceData.included || [],
      excluded: serviceData.excluded || [],
      requirements: serviceData.requirements || [],
      aftercare: serviceData.aftercare || [],
      images: serviceData.images || []
    },
    availability: {
      daysOfWeek: serviceData.daysOfWeek || [1, 2, 3, 4, 5], // Mon-Fri default
      timeSlots: serviceData.timeSlots || { start: '09:00', end: '18:00' },
      advanceBooking: serviceData.advanceBooking || 1, // 1 day advance
      maxBookingsPerDay: serviceData.maxBookingsPerDay || null
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    stats: {
      totalBookings: 0,
      averageRating: 0,
      totalReviews: 0,
      lastBookedAt: null
    }
  };
}

/**
 * Create a new portfolio item with default values
 * @param {string} professionalId - Professional ID
 * @param {Object} portfolioData - Portfolio data
 * @returns {PortfolioItem} New portfolio item
 */
export function createPortfolioItem(professionalId, portfolioData) {
  return {
    id: null, // Will be set by Firestore
    professionalId,
    type: portfolioData.type || 'finished_work',
    title: portfolioData.title || '',
    description: portfolioData.description || null,
    images: {
      before: portfolioData.images?.before || null,
      after: portfolioData.images?.after || null,
      main: portfolioData.images?.main || '',
      gallery: portfolioData.images?.gallery || []
    },
    serviceCategory: portfolioData.serviceCategory || '',
    tags: portfolioData.tags || [],
    isPublic: portfolioData.isPublic !== false, // Default to true
    isFeatured: portfolioData.isFeatured || false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Validate professional profile data
 * @param {Object} profileData - Profile data to validate
 * @returns {Object} Validation result with errors
 */
export function validateProfessionalProfile(profileData) {
  const errors = {};
  
  // Validate personal info
  if (profileData.personalInfo) {
    const personalErrors = {};
    const { firstName, lastName, phone, ci } = profileData.personalInfo;
    
    if (!firstName || firstName.length < 2) {
      personalErrors.firstName = 'Nombre debe tener al menos 2 caracteres';
    }
    
    if (!lastName || lastName.length < 2) {
      personalErrors.lastName = 'Apellido debe tener al menos 2 caracteres';
    }
    
    if (!phone || !/^[67]\d{7}$/.test(phone)) {
      personalErrors.phone = 'Teléfono debe tener formato boliviano (7XXXXXXX o 6XXXXXXX)';
    }
    
    if (!ci || ci.length < 7) {
      personalErrors.ci = 'CI debe tener al menos 7 caracteres';
    }
    
    if (Object.keys(personalErrors).length > 0) {
      errors.personalInfo = personalErrors;
    }
  }
  
  // Validate business info
  if (profileData.businessInfo) {
    const businessErrors = {};
    const { businessName, description, categories, experience } = profileData.businessInfo;
    
    if (!businessName || businessName.length < 3) {
      businessErrors.businessName = 'Nombre del negocio debe tener al menos 3 caracteres';
    }
    
    if (!description || description.length < 50) {
      businessErrors.description = 'Descripción debe tener al menos 50 caracteres';
    }
    
    if (!categories || categories.length === 0) {
      businessErrors.categories = 'Debe seleccionar al menos una categoría';
    }
    
    if (experience === undefined || experience < 0) {
      businessErrors.experience = 'Experiencia debe ser un número positivo';
    }
    
    if (Object.keys(businessErrors).length > 0) {
      errors.businessInfo = businessErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate service data
 * @param {Object} serviceData - Service data to validate
 * @returns {Object} Validation result with errors
 */
export function validateService(serviceData) {
  const errors = {};
  
  if (!serviceData.name || serviceData.name.length < 3) {
    errors.name = 'Nombre del servicio debe tener al menos 3 caracteres';
  }
  
  if (!serviceData.description || serviceData.description.length < 20) {
    errors.description = 'Descripción debe tener al menos 20 caracteres';
  }
  
  if (!serviceData.category) {
    errors.category = 'Debe seleccionar una categoría';
  }
  
  if (!serviceData.duration || serviceData.duration < 15) {
    errors.duration = 'Duración debe ser al menos 15 minutos';
  }
  
  if (!serviceData.price || serviceData.price < 10) {
    errors.price = 'Precio debe ser al menos 10 Bs';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}