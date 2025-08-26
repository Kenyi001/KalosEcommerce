import { describe, it, expect } from 'vitest';
import { 
  createProfessionalProfile,
  createService,
  createPortfolioItem,
  validateProfessionalProfile,
  validateService,
  validatePortfolioItem,
  SERVICE_CATEGORIES,
  LOCATIONS
} from '../professional.js';

describe('Professional Models', () => {
  describe('createProfessionalProfile', () => {
    it('should create a professional profile with default values', () => {
      const userData = {
        uid: 'test-uid',
        email: 'test@example.com'
      };

      const profile = createProfessionalProfile(userData);

      expect(profile).toMatchObject({
        uid: 'test-uid',
        email: 'test@example.com',
        personalInfo: {
          firstName: '',
          lastName: '',
          phone: '',
          birthDate: '',
          gender: '',
          profileImage: ''
        },
        businessInfo: {
          businessName: '',
          description: '',
          categories: [],
          yearsExperience: 0,
          certifications: [],
          socialMedia: {
            instagram: '',
            facebook: '',
            whatsapp: ''
          }
        },
        location: {
          department: '',
          city: '',
          zone: '',
          address: '',
          coordinates: null,
          homeService: false,
          serviceRadius: 0
        },
        verification: {
          status: 'pending',
          submittedAt: expect.any(Date),
          verifiedAt: null,
          documents: {
            idCard: '',
            businessLicense: '',
            certifications: []
          }
        },
        status: 'inactive',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        stats: {
          totalServices: 0,
          totalReviews: 0,
          averageRating: 0,
          totalBookings: 0
        }
      });
    });

    it('should merge provided user data with defaults', () => {
      const userData = {
        uid: 'test-uid',
        email: 'test@example.com',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe'
        },
        businessInfo: {
          businessName: 'Hair Studio'
        }
      };

      const profile = createProfessionalProfile(userData);

      expect(profile.personalInfo.firstName).toBe('John');
      expect(profile.personalInfo.lastName).toBe('Doe');
      expect(profile.businessInfo.businessName).toBe('Hair Studio');
      expect(profile.personalInfo.phone).toBe(''); // Default value
    });
  });

  describe('createService', () => {
    it('should create a service with default values', () => {
      const professionalId = 'prof-123';

      const service = createService(professionalId);

      expect(service).toMatchObject({
        professionalId: 'prof-123',
        basicInfo: {
          name: '',
          category: '',
          description: '',
          duration: 60,
          price: 0,
          images: []
        },
        details: {
          whatIncludes: [],
          requirements: [],
          recommendations: []
        },
        availability: {
          workingHours: expect.any(Object),
          blockedDates: [],
          advanceBooking: 1
        },
        location: {
          inSalon: true,
          atHome: false,
          homeServiceFee: 0
        },
        status: 'draft',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });

    it('should merge provided data with defaults', () => {
      const professionalId = 'prof-123';
      const serviceData = {
        basicInfo: {
          name: 'Hair Cut',
          category: 'hair',
          price: 150
        }
      };

      const service = createService(professionalId, serviceData);

      expect(service.basicInfo.name).toBe('Hair Cut');
      expect(service.basicInfo.category).toBe('hair');
      expect(service.basicInfo.price).toBe(150);
      expect(service.basicInfo.duration).toBe(60); // Default value
    });
  });

  describe('createPortfolioItem', () => {
    it('should create a portfolio item with default values', () => {
      const professionalId = 'prof-123';

      const portfolioItem = createPortfolioItem(professionalId);

      expect(portfolioItem).toMatchObject({
        professionalId: 'prof-123',
        title: '',
        description: '',
        category: '',
        images: [],
        beforeAfter: {
          before: '',
          after: ''
        },
        tags: [],
        isPublic: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });

    it('should merge provided data with defaults', () => {
      const professionalId = 'prof-123';
      const portfolioData = {
        title: 'Beautiful Hair Style',
        description: 'Modern hair cut and styling',
        category: 'hair',
        isPublic: false
      };

      const portfolioItem = createPortfolioItem(professionalId, portfolioData);

      expect(portfolioItem.title).toBe('Beautiful Hair Style');
      expect(portfolioItem.description).toBe('Modern hair cut and styling');
      expect(portfolioItem.category).toBe('hair');
      expect(portfolioItem.isPublic).toBe(false);
      expect(portfolioItem.images).toEqual([]); // Default value
    });
  });

  describe('validateProfessionalProfile', () => {
    it('should validate a complete professional profile', () => {
      const validProfile = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '70123456',
          birthDate: '1990-01-01',
          gender: 'male'
        },
        businessInfo: {
          businessName: 'Hair Studio',
          description: 'Professional hair services',
          categories: ['hair'],
          yearsExperience: 5
        },
        location: {
          department: 'La Paz',
          city: 'La Paz',
          address: 'Av. 6 de Agosto #123'
        }
      };

      const validation = validateProfessionalProfile(validProfile);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual({});
    });

    it('should return errors for invalid profile data', () => {
      const invalidProfile = {
        personalInfo: {
          firstName: '', // Required field empty
          lastName: 'Doe',
          phone: '123', // Too short
          birthDate: 'invalid-date', // Invalid format
          gender: 'invalid' // Invalid value
        },
        businessInfo: {
          businessName: '', // Required field empty
          description: 'x'.repeat(1001), // Too long
          categories: [], // Empty array
          yearsExperience: -1 // Invalid value
        },
        location: {
          department: 'Invalid Department', // Not in LOCATIONS
          city: '',
          address: ''
        }
      };

      const validation = validateProfessionalProfile(invalidProfile);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toMatchObject({
        personalInfo: expect.any(Object),
        businessInfo: expect.any(Object),
        location: expect.any(Object)
      });
    });
  });

  describe('validateService', () => {
    it('should validate a complete service', () => {
      const validService = {
        name: 'Hair Cut',
        category: 'hair',
        description: 'Professional hair cutting service',
        duration: 60,
        price: 150
      };

      const validation = validateService(validService);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual({});
    });

    it('should return errors for invalid service data', () => {
      const invalidService = {
        name: '', // Required field empty
        category: 'invalid-category', // Invalid category
        description: 'x'.repeat(1001), // Too long
        duration: 0, // Invalid value
        price: -10 // Invalid value
      };

      const validation = validateService(invalidService);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toMatchObject({
        name: expect.any(String),
        category: expect.any(String),
        description: expect.any(String),
        duration: expect.any(String),
        price: expect.any(String)
      });
    });
  });

  describe('validatePortfolioItem', () => {
    it('should validate a complete portfolio item', () => {
      const validPortfolioItem = {
        title: 'Beautiful Hair Style',
        description: 'Modern hair cut and styling',
        category: 'hair'
      };

      const validation = validatePortfolioItem(validPortfolioItem);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual({});
    });

    it('should return errors for invalid portfolio item data', () => {
      const invalidPortfolioItem = {
        title: '', // Required field empty
        description: '', // Required field empty
        category: 'invalid-category' // Invalid category
      };

      const validation = validatePortfolioItem(invalidPortfolioItem);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        category: expect.any(String)
      });
    });
  });

  describe('Constants', () => {
    it('should have valid service categories', () => {
      expect(SERVICE_CATEGORIES).toMatchObject({
        hair: 'hair',
        nails: 'nails',
        makeup: 'makeup',
        skincare: 'skincare',
        massage: 'massage',
        eyebrows: 'eyebrows',
        eyelashes: 'eyelashes'
      });
    });

    it('should have valid location data for Bolivia', () => {
      expect(LOCATIONS.departments).toContain('La Paz');
      expect(LOCATIONS.departments).toContain('Santa Cruz');
      expect(LOCATIONS.departments).toContain('Cochabamba');
      
      expect(LOCATIONS.cities['La Paz']).toContain('La Paz');
      expect(LOCATIONS.cities['Santa Cruz']).toContain('Santa Cruz de la Sierra');
      expect(LOCATIONS.cities['Cochabamba']).toContain('Cochabamba');
    });
  });
});