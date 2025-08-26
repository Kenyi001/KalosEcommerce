import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { professionalService } from '../../services/professionals.js';
import { serviceService } from '../../services/services.js';
import { createProfessionalProfile, createService } from '../../models/professional.js';

// Mock Firebase modules
vi.mock('firebase/firestore');
vi.mock('firebase/storage');
vi.mock('firebase/auth');

describe('Professional Management Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Professional Profile Lifecycle', () => {
    it('should handle complete professional registration flow', async () => {
      // Mock successful creation
      const mockSetDoc = vi.fn().mockResolvedValue(undefined);
      const mockGetDoc = vi.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({
          uid: 'test-uid',
          email: 'test@example.com',
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe'
          },
          status: 'inactive'
        }),
        id: 'test-uid'
      });

      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        setDoc: mockSetDoc,
        getDoc: mockGetDoc,
        doc: vi.fn().mockReturnValue({ id: 'test-uid' })
      }));

      // Step 1: Create professional profile
      const userData = {
        uid: 'test-uid',
        email: 'test@example.com'
      };

      const createResult = await professionalService.createProfessionalProfile(userData);
      expect(createResult.success).toBe(true);
      expect(createResult.professionalId).toBe('test-uid');

      // Step 2: Retrieve created profile
      const profile = await professionalService.getProfessionalProfile('test-uid');
      expect(profile).toBeTruthy();
      expect(profile.uid).toBe('test-uid');
      expect(profile.email).toBe('test@example.com');
    });

    it('should handle profile update flow', async () => {
      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
      
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        updateDoc: mockUpdateDoc,
        doc: vi.fn().mockReturnValue({})
      }));

      const updateData = {
        personalInfo: {
          firstName: 'John Updated',
          phone: '70123456'
        },
        businessInfo: {
          businessName: 'Updated Hair Studio',
          categories: ['hair', 'makeup']
        }
      };

      const updateResult = await professionalService.updateProfessionalProfile('test-uid', updateData);
      
      expect(updateResult.success).toBe(true);
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...updateData,
          updatedAt: expect.any(Date)
        })
      );
    });
  });

  describe('Service Management Lifecycle', () => {
    it('should handle complete service creation and management flow', async () => {
      // Mock service creation
      const mockAddDoc = vi.fn().mockResolvedValue({ id: 'service-123' });
      const mockGetDoc = vi.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({
          professionalId: 'prof-123',
          basicInfo: {
            name: 'Hair Cut',
            category: 'hair',
            price: 150
          },
          status: 'active'
        }),
        id: 'service-123'
      });

      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        addDoc: mockAddDoc,
        getDoc: mockGetDoc,
        collection: vi.fn().mockReturnValue({})
      }));

      // Step 1: Create service
      const serviceData = {
        basicInfo: {
          name: 'Hair Cut',
          category: 'hair',
          description: 'Professional hair cutting',
          duration: 60,
          price: 150
        }
      };

      const createResult = await serviceService.createService('prof-123', serviceData);
      expect(createResult.success).toBe(true);
      expect(createResult.serviceId).toBe('service-123');

      // Step 2: Retrieve created service
      const service = await serviceService.getService('service-123');
      expect(service).toBeTruthy();
      expect(service.basicInfo.name).toBe('Hair Cut');
      expect(service.professionalId).toBe('prof-123');
    });

    it('should handle service search and filtering', async () => {
      const mockServices = [
        {
          id: 'service1',
          professionalId: 'prof1',
          basicInfo: {
            name: 'Hair Cut',
            category: 'hair',
            price: 150
          },
          status: 'active'
        },
        {
          id: 'service2',
          professionalId: 'prof2',
          basicInfo: {
            name: 'Manicure',
            category: 'nails',
            price: 80
          },
          status: 'active'
        }
      ];

      const mockQuerySnapshot = {
        docs: mockServices.map(service => ({
          id: service.id,
          data: () => service,
          exists: () => true
        })),
        empty: false
      };

      const mockGetDocs = vi.fn().mockResolvedValue(mockQuerySnapshot);
      
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        getDocs: mockGetDocs,
        query: vi.fn().mockReturnValue({}),
        where: vi.fn().mockReturnValue({}),
        orderBy: vi.fn().mockReturnValue({}),
        limit: vi.fn().mockReturnValue({})
      }));

      const filters = {
        category: 'hair',
        minPrice: 100,
        maxPrice: 200
      };

      const searchResult = await serviceService.searchServices(filters);
      
      expect(searchResult.services).toBeTruthy();
      expect(searchResult.total).toBeGreaterThan(0);
      expect(mockGetDocs).toHaveBeenCalled();
    });
  });

  describe('Professional Search and Discovery', () => {
    it('should handle professional search with complex filters', async () => {
      const mockProfessionals = [
        {
          id: 'prof1',
          personalInfo: { firstName: 'John' },
          businessInfo: { 
            businessName: 'Hair Studio',
            categories: ['hair'] 
          },
          location: { 
            department: 'La Paz',
            city: 'La Paz' 
          },
          stats: { averageRating: 4.5, totalReviews: 25 },
          status: 'active',
          verification: { status: 'approved' }
        }
      ];

      const mockQuerySnapshot = {
        docs: mockProfessionals.map(prof => ({
          id: prof.id,
          data: () => prof,
          exists: () => true
        })),
        empty: false,
        size: 1
      };

      const mockGetDocs = vi.fn().mockResolvedValue(mockQuerySnapshot);
      
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        getDocs: mockGetDocs,
        query: vi.fn().mockReturnValue({}),
        where: vi.fn().mockReturnValue({}),
        orderBy: vi.fn().mockReturnValue({}),
        limit: vi.fn().mockReturnValue({})
      }));

      const filters = {
        category: 'hair',
        department: 'La Paz',
        minRating: 4,
        sortBy: 'stats.averageRating',
        sortOrder: 'desc'
      };

      const pagination = {
        limit: 12
      };

      const searchResult = await professionalService.searchProfessionals(filters, pagination);

      expect(searchResult.professionals).toHaveLength(1);
      expect(searchResult.professionals[0].id).toBe('prof1');
      expect(searchResult.total).toBe(1);
      expect(searchResult.hasMore).toBe(false);
    });
  });

  describe('Portfolio Management', () => {
    it('should handle portfolio item creation and management', async () => {
      const mockAddDoc = vi.fn().mockResolvedValue({ id: 'portfolio-123' });
      const mockGetDocs = vi.fn().mockResolvedValue({
        docs: [{
          id: 'portfolio-123',
          data: () => ({
            professionalId: 'prof-123',
            title: 'Beautiful Hair Style',
            description: 'Modern cut and styling',
            category: 'hair',
            isPublic: true
          }),
          exists: () => true
        }],
        empty: false
      });

      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        addDoc: mockAddDoc,
        getDocs: mockGetDocs,
        collection: vi.fn().mockReturnValue({}),
        query: vi.fn().mockReturnValue({}),
        where: vi.fn().mockReturnValue({}),
        orderBy: vi.fn().mockReturnValue({})
      }));

      // Create portfolio item
      const portfolioData = {
        title: 'Beautiful Hair Style',
        description: 'Modern cut and styling',
        category: 'hair',
        isPublic: true
      };

      const createResult = await serviceService.createPortfolioItem('prof-123', portfolioData);
      expect(createResult.success).toBe(true);

      // Get professional portfolio
      const portfolio = await serviceService.getProfessionalPortfolio('prof-123');
      expect(portfolio).toHaveLength(1);
      expect(portfolio[0].title).toBe('Beautiful Hair Style');
    });
  });

  describe('Image Upload Management', () => {
    it('should handle profile image upload', async () => {
      const mockFile = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });
      const mockDownloadUrl = 'https://example.com/profile.jpg';

      const mockUploadBytes = vi.fn().mockResolvedValue({
        ref: { fullPath: 'professionals/prof-123/profile.jpg' }
      });
      const mockGetDownloadURL = vi.fn().mockResolvedValue(mockDownloadUrl);

      vi.doMock('firebase/storage', async () => ({
        ...(await vi.importActual('firebase/storage')),
        uploadBytes: mockUploadBytes,
        getDownloadURL: mockGetDownloadURL,
        ref: vi.fn().mockReturnValue({})
      }));

      const uploadResult = await professionalService.uploadProfileImage('prof-123', mockFile);
      
      expect(uploadResult.success).toBe(true);
      expect(uploadResult.url).toBe(mockDownloadUrl);
      expect(mockUploadBytes).toHaveBeenCalled();
      expect(mockGetDownloadURL).toHaveBeenCalled();
    });

    it('should validate file types for image uploads', async () => {
      const invalidFile = new File(['test'], 'document.pdf', { type: 'application/pdf' });

      await expect(professionalService.uploadProfileImage('prof-123', invalidFile))
        .rejects.toThrow('Tipo de archivo no válido. Solo se permiten imágenes.');
    });

    it('should validate file sizes for image uploads', async () => {
      // Create a large file (>5MB)
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });

      await expect(professionalService.uploadProfileImage('prof-123', largeFile))
        .rejects.toThrow('El archivo es muy grande. Tamaño máximo: 5MB.');
    });
  });

  describe('Verification Workflow', () => {
    it('should handle professional verification process', async () => {
      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
      
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        updateDoc: mockUpdateDoc,
        doc: vi.fn().mockReturnValue({})
      }));

      // Approve verification
      const approveResult = await professionalService.verifyProfessional(
        'prof-123', 
        'approve', 
        'All documents verified'
      );

      expect(approveResult.success).toBe(true);
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          'verification.status': 'approved',
          'verification.verifiedAt': expect.any(Date),
          'verification.notes': 'All documents verified',
          'status': 'active',
          'updatedAt': expect.any(Date)
        })
      );
    });
  });

  describe('Data Model Integration', () => {
    it('should create valid professional profile from model', () => {
      const userData = {
        uid: 'test-uid',
        email: 'test@example.com'
      };

      const profile = createProfessionalProfile(userData);

      expect(profile.uid).toBe('test-uid');
      expect(profile.email).toBe('test@example.com');
      expect(profile.status).toBe('inactive');
      expect(profile.verification.status).toBe('pending');
      expect(profile.createdAt).toBeInstanceOf(Date);
      expect(profile.stats).toMatchObject({
        totalServices: 0,
        totalReviews: 0,
        averageRating: 0,
        totalBookings: 0
      });
    });

    it('should create valid service from model', () => {
      const service = createService('prof-123');

      expect(service.professionalId).toBe('prof-123');
      expect(service.status).toBe('draft');
      expect(service.createdAt).toBeInstanceOf(Date);
      expect(service.basicInfo.duration).toBe(60);
      expect(service.availability.workingHours).toBeDefined();
    });
  });
});