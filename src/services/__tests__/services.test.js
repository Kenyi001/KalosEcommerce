import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { serviceService } from '../services.js';
import { mockFirestore } from '../../__tests__/setup.js';

// Mock Firebase modules
vi.mock('firebase/firestore');
vi.mock('firebase/storage');

describe('ServiceService', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createService', () => {
    it('should create a service successfully', async () => {
      const mockProfessionalId = 'prof-123';
      const mockServiceData = {
        basicInfo: {
          name: 'Corte de cabello',
          category: 'hair',
          description: 'Corte profesional',
          duration: 60,
          price: 150
        },
        availability: {
          workingHours: {
            monday: { start: '09:00', end: '18:00', available: true }
          }
        }
      };

      const mockDocRef = { id: 'service-123' };
      const mockAddDoc = vi.fn().mockResolvedValue(mockDocRef);

      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        addDoc: mockAddDoc,
        collection: vi.fn().mockReturnValue({})
      }));

      const result = await serviceService.createService(mockProfessionalId, mockServiceData);

      expect(result).toEqual({
        success: true,
        serviceId: 'service-123',
        message: 'Servicio creado exitosamente'
      });
    });

    it('should validate service data before creation', async () => {
      const mockProfessionalId = 'prof-123';
      const mockInvalidServiceData = {
        basicInfo: {
          name: '', // Invalid: empty name
          category: 'hair',
          description: 'Test',
          duration: 60,
          price: 150
        }
      };

      await expect(serviceService.createService(mockProfessionalId, mockInvalidServiceData))
        .rejects.toThrow('Service validation failed');
    });

    it('should handle creation errors', async () => {
      const mockProfessionalId = 'prof-123';
      const mockServiceData = {
        basicInfo: {
          name: 'Test Service',
          category: 'hair',
          description: 'Test',
          duration: 60,
          price: 150
        }
      };

      const mockAddDoc = vi.fn().mockRejectedValue(new Error('Firestore error'));
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        addDoc: mockAddDoc
      }));

      await expect(serviceService.createService(mockProfessionalId, mockServiceData))
        .rejects.toThrow('Error creating service: Firestore error');
    });
  });

  describe('getService', () => {
    it('should return service when it exists', async () => {
      const mockServiceId = 'service-123';
      const mockServiceData = {
        professionalId: 'prof-123',
        basicInfo: {
          name: 'Test Service',
          category: 'hair'
        },
        status: 'active'
      };

      const mockDoc = {
        exists: () => true,
        data: () => mockServiceData,
        id: mockServiceId
      };

      const mockGetDoc = vi.fn().mockResolvedValue(mockDoc);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        getDoc: mockGetDoc
      }));

      const result = await serviceService.getService(mockServiceId);

      expect(result).toEqual({
        id: mockServiceId,
        ...mockServiceData
      });
    });

    it('should return null when service does not exist', async () => {
      const mockServiceId = 'nonexistent-service';

      const mockDoc = {
        exists: () => false
      };

      const mockGetDoc = vi.fn().mockResolvedValue(mockDoc);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        getDoc: mockGetDoc
      }));

      const result = await serviceService.getService(mockServiceId);

      expect(result).toBeNull();
    });
  });

  describe('updateService', () => {
    it('should update service successfully', async () => {
      const mockServiceId = 'service-123';
      const mockUpdateData = {
        basicInfo: {
          name: 'Updated Service Name',
          price: 200
        }
      };

      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        updateDoc: mockUpdateDoc
      }));

      const result = await serviceService.updateService(mockServiceId, mockUpdateData);

      expect(result).toEqual({
        success: true,
        message: 'Servicio actualizado exitosamente'
      });
    });
  });

  describe('deleteService', () => {
    it('should delete service successfully', async () => {
      const mockServiceId = 'service-123';

      const mockDeleteDoc = vi.fn().mockResolvedValue(undefined);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        deleteDoc: mockDeleteDoc
      }));

      const result = await serviceService.deleteService(mockServiceId);

      expect(result).toEqual({
        success: true,
        message: 'Servicio eliminado exitosamente'
      });
    });
  });

  describe('getProfessionalServices', () => {
    it('should return professional services', async () => {
      const mockProfessionalId = 'prof-123';
      const mockServices = [
        {
          id: 'service1',
          basicInfo: { name: 'Service 1', category: 'hair' },
          status: 'active'
        },
        {
          id: 'service2',
          basicInfo: { name: 'Service 2', category: 'nails' },
          status: 'active'
        }
      ];

      const mockQuerySnapshot = {
        docs: mockServices.map(service => ({
          id: service.id,
          data: () => ({ ...service }),
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
        orderBy: vi.fn().mockReturnValue({})
      }));

      const result = await serviceService.getProfessionalServices(mockProfessionalId);

      expect(result).toEqual(
        mockServices.map(service => ({ id: service.id, ...service }))
      );
    });
  });

  describe('searchServices', () => {
    it('should return filtered services', async () => {
      const mockFilters = {
        category: 'hair',
        minPrice: 100,
        maxPrice: 300
      };

      const mockServices = [
        {
          id: 'service1',
          basicInfo: { 
            name: 'Hair Cut', 
            category: 'hair',
            price: 150
          },
          professionalId: 'prof1',
          status: 'active'
        }
      ];

      const mockQuerySnapshot = {
        docs: mockServices.map(service => ({
          id: service.id,
          data: () => ({ ...service }),
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

      const result = await serviceService.searchServices(mockFilters);

      expect(result).toEqual({
        services: mockServices.map(service => ({ id: service.id, ...service })),
        hasMore: false,
        lastDoc: null,
        total: 1
      });
    });
  });

  describe('Portfolio Management', () => {
    describe('createPortfolioItem', () => {
      it('should create portfolio item successfully', async () => {
        const mockProfessionalId = 'prof-123';
        const mockPortfolioData = {
          title: 'Hair Style Example',
          description: 'Beautiful hair styling',
          category: 'hair',
          isPublic: true
        };

        const mockDocRef = { id: 'portfolio-123' };
        const mockAddDoc = vi.fn().mockResolvedValue(mockDocRef);

        vi.doMock('firebase/firestore', async () => ({
          ...(await vi.importActual('firebase/firestore')),
          addDoc: mockAddDoc,
          collection: vi.fn().mockReturnValue({})
        }));

        const result = await serviceService.createPortfolioItem(mockProfessionalId, mockPortfolioData);

        expect(result).toEqual({
          success: true,
          portfolioId: 'portfolio-123',
          message: 'Elemento de portafolio creado exitosamente'
        });
      });
    });

    describe('getProfessionalPortfolio', () => {
      it('should return professional portfolio items', async () => {
        const mockProfessionalId = 'prof-123';
        const mockPortfolioItems = [
          {
            id: 'item1',
            title: 'Hair Cut Example',
            category: 'hair',
            isPublic: true
          },
          {
            id: 'item2',
            title: 'Nail Art Example',
            category: 'nails',
            isPublic: true
          }
        ];

        const mockQuerySnapshot = {
          docs: mockPortfolioItems.map(item => ({
            id: item.id,
            data: () => ({ ...item }),
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
          orderBy: vi.fn().mockReturnValue({})
        }));

        const result = await serviceService.getProfessionalPortfolio(mockProfessionalId);

        expect(result).toEqual(
          mockPortfolioItems.map(item => ({ id: item.id, ...item }))
        );
      });
    });

    describe('uploadPortfolioImage', () => {
      it('should upload portfolio image successfully', async () => {
        const mockProfessionalId = 'prof-123';
        const mockFile = new File(['test'], 'portfolio.jpg', { type: 'image/jpeg' });
        const mockDownloadUrl = 'https://example.com/portfolio.jpg';

        const mockUploadBytes = vi.fn().mockResolvedValue({
          ref: { fullPath: 'portfolio/prof-123/image.jpg' }
        });
        const mockGetDownloadURL = vi.fn().mockResolvedValue(mockDownloadUrl);

        vi.doMock('firebase/storage', async () => ({
          ...(await vi.importActual('firebase/storage')),
          uploadBytes: mockUploadBytes,
          getDownloadURL: mockGetDownloadURL,
          ref: vi.fn().mockReturnValue({})
        }));

        const result = await serviceService.uploadPortfolioImage(mockProfessionalId, mockFile);

        expect(result).toEqual({
          success: true,
          url: mockDownloadUrl,
          message: 'Imagen de portafolio subida exitosamente'
        });
      });

      it('should validate image file type', async () => {
        const mockProfessionalId = 'prof-123';
        const mockFile = new File(['test'], 'document.pdf', { type: 'application/pdf' });

        await expect(serviceService.uploadPortfolioImage(mockProfessionalId, mockFile))
          .rejects.toThrow('Tipo de archivo no válido. Solo se permiten imágenes.');
      });
    });
  });
});