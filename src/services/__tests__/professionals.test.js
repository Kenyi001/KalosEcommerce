import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { professionalService } from '../professionals.js';
import { mockFirestore } from '../../__tests__/setup.js';

// Mock Firebase modules
vi.mock('firebase/firestore');
vi.mock('firebase/storage');
vi.mock('firebase/auth');

describe('ProfessionalService', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createProfessionalProfile', () => {
    it('should create a professional profile successfully', async () => {
      const mockUserData = {
        uid: 'test-uid',
        email: 'test@example.com'
      };

      const mockDocRef = { id: 'test-uid' };
      
      // Mock setDoc to resolve successfully
      const mockSetDoc = vi.fn().mockResolvedValue(undefined);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        setDoc: mockSetDoc,
        doc: vi.fn().mockReturnValue(mockDocRef)
      }));

      const result = await professionalService.createProfessionalProfile(mockUserData);

      expect(result).toEqual({
        success: true,
        professionalId: 'test-uid',
        message: 'Perfil profesional creado exitosamente'
      });
    });

    it('should handle creation errors', async () => {
      const mockUserData = {
        uid: 'test-uid',
        email: 'test@example.com'
      };

      // Mock setDoc to reject
      const mockSetDoc = vi.fn().mockRejectedValue(new Error('Firestore error'));
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        setDoc: mockSetDoc
      }));

      await expect(professionalService.createProfessionalProfile(mockUserData))
        .rejects.toThrow('Error creating professional profile: Firestore error');
    });
  });

  describe('getProfessionalProfile', () => {
    it('should return professional profile when it exists', async () => {
      const mockProfessionalId = 'test-uid';
      const mockProfessionalData = {
        uid: 'test-uid',
        email: 'test@example.com',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe'
        },
        status: 'active'
      };

      const mockDoc = {
        exists: () => true,
        data: () => mockProfessionalData,
        id: mockProfessionalId
      };

      const mockGetDoc = vi.fn().mockResolvedValue(mockDoc);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        getDoc: mockGetDoc
      }));

      const result = await professionalService.getProfessionalProfile(mockProfessionalId);

      expect(result).toEqual({
        id: mockProfessionalId,
        ...mockProfessionalData
      });
    });

    it('should return null when professional does not exist', async () => {
      const mockProfessionalId = 'nonexistent-uid';

      const mockDoc = {
        exists: () => false
      };

      const mockGetDoc = vi.fn().mockResolvedValue(mockDoc);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        getDoc: mockGetDoc
      }));

      const result = await professionalService.getProfessionalProfile(mockProfessionalId);

      expect(result).toBeNull();
    });
  });

  describe('updateProfessionalProfile', () => {
    it('should update professional profile successfully', async () => {
      const mockProfessionalId = 'test-uid';
      const mockUpdateData = {
        personalInfo: {
          firstName: 'Updated Name'
        }
      };

      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        updateDoc: mockUpdateDoc
      }));

      const result = await professionalService.updateProfessionalProfile(
        mockProfessionalId, 
        mockUpdateData
      );

      expect(result).toEqual({
        success: true,
        message: 'Perfil actualizado exitosamente'
      });
    });

    it('should handle update errors', async () => {
      const mockProfessionalId = 'test-uid';
      const mockUpdateData = {
        personalInfo: {
          firstName: 'Updated Name'
        }
      };

      const mockUpdateDoc = vi.fn().mockRejectedValue(new Error('Update failed'));
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        updateDoc: mockUpdateDoc
      }));

      await expect(professionalService.updateProfessionalProfile(
        mockProfessionalId, 
        mockUpdateData
      )).rejects.toThrow('Error updating professional profile: Update failed');
    });
  });

  describe('searchProfessionals', () => {
    it('should return paginated search results', async () => {
      const mockFilters = {
        category: 'hair',
        department: 'La Paz',
        minRating: 4
      };

      const mockPagination = {
        limit: 10
      };

      const mockProfessionals = [
        {
          id: 'prof1',
          personalInfo: { firstName: 'John' },
          businessInfo: { businessName: 'Hair Studio' },
          stats: { averageRating: 4.5 }
        },
        {
          id: 'prof2', 
          personalInfo: { firstName: 'Jane' },
          businessInfo: { businessName: 'Beauty Salon' },
          stats: { averageRating: 4.2 }
        }
      ];

      const mockQuerySnapshot = {
        docs: mockProfessionals.map(prof => ({
          id: prof.id,
          data: () => ({ ...prof }),
          exists: () => true
        })),
        empty: false,
        size: 2
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

      const result = await professionalService.searchProfessionals(mockFilters, mockPagination);

      expect(result).toEqual({
        professionals: mockProfessionals.map(prof => ({ id: prof.id, ...prof })),
        hasMore: false,
        lastDoc: null,
        total: 2
      });
    });

    it('should handle empty search results', async () => {
      const mockQuerySnapshot = {
        docs: [],
        empty: true,
        size: 0
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

      const result = await professionalService.searchProfessionals({}, {});

      expect(result).toEqual({
        professionals: [],
        hasMore: false,
        lastDoc: null,
        total: 0
      });
    });
  });

  describe('uploadProfileImage', () => {
    it('should upload image and return download URL', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockProfessionalId = 'test-uid';
      const mockDownloadUrl = 'https://example.com/image.jpg';

      const mockUploadBytes = vi.fn().mockResolvedValue({
        ref: { fullPath: 'professionals/test-uid/profile.jpg' }
      });
      const mockGetDownloadURL = vi.fn().mockResolvedValue(mockDownloadUrl);

      vi.doMock('firebase/storage', async () => ({
        ...(await vi.importActual('firebase/storage')),
        uploadBytes: mockUploadBytes,
        getDownloadURL: mockGetDownloadURL,
        ref: vi.fn().mockReturnValue({})
      }));

      const result = await professionalService.uploadProfileImage(mockProfessionalId, mockFile);

      expect(result).toEqual({
        success: true,
        url: mockDownloadUrl,
        message: 'Imagen subida exitosamente'
      });
    });

    it('should validate file type', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockProfessionalId = 'test-uid';

      await expect(professionalService.uploadProfileImage(mockProfessionalId, mockFile))
        .rejects.toThrow('Tipo de archivo no válido. Solo se permiten imágenes.');
    });

    it('should validate file size', async () => {
      // Create a mock file that's too large (>5MB)
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      const mockProfessionalId = 'test-uid';

      await expect(professionalService.uploadProfileImage(mockProfessionalId, largeFile))
        .rejects.toThrow('El archivo es muy grande. Tamaño máximo: 5MB.');
    });
  });

  describe('deleteProfessionalProfile', () => {
    it('should delete professional profile successfully', async () => {
      const mockProfessionalId = 'test-uid';

      const mockDeleteDoc = vi.fn().mockResolvedValue(undefined);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        deleteDoc: mockDeleteDoc
      }));

      const result = await professionalService.deleteProfessionalProfile(mockProfessionalId);

      expect(result).toEqual({
        success: true,
        message: 'Perfil profesional eliminado exitosamente'
      });
    });
  });

  describe('updateProfessionalStats', () => {
    it('should update professional statistics', async () => {
      const mockProfessionalId = 'test-uid';
      const mockStats = {
        averageRating: 4.5,
        totalReviews: 10,
        totalServices: 5
      };

      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        updateDoc: mockUpdateDoc
      }));

      const result = await professionalService.updateProfessionalStats(mockProfessionalId, mockStats);

      expect(result).toEqual({
        success: true,
        message: 'Estadísticas actualizadas exitosamente'
      });
    });
  });

  describe('verifyProfessional', () => {
    it('should approve professional verification', async () => {
      const mockProfessionalId = 'test-uid';
      const mockDecision = 'approve';
      const mockNotes = 'All documents verified';

      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        updateDoc: mockUpdateDoc
      }));

      const result = await professionalService.verifyProfessional(
        mockProfessionalId, 
        mockDecision, 
        mockNotes
      );

      expect(result).toEqual({
        success: true,
        message: 'Profesional verificado exitosamente'
      });
    });

    it('should reject professional verification', async () => {
      const mockProfessionalId = 'test-uid';
      const mockDecision = 'reject';
      const mockNotes = 'Documents incomplete';

      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
      vi.doMock('firebase/firestore', async () => ({
        ...(await vi.importActual('firebase/firestore')),
        updateDoc: mockUpdateDoc
      }));

      const result = await professionalService.verifyProfessional(
        mockProfessionalId, 
        mockDecision, 
        mockNotes
      );

      expect(result).toEqual({
        success: true,
        message: 'Decisión de verificación guardada exitosamente'
      });
    });
  });
});