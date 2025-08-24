// Authentication service tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from './auth.js';

// Mock Firebase modules
vi.mock('../config/firebase-config.js', () => ({
  auth: {
    currentUser: null
  },
  db: {}
}));

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  updateProfile: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  sendEmailVerification: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn()
}));

describe('AuthService', () => {
  beforeEach(() => {
    // Reset auth service state
    authService.currentUser = null;
    authService.userProfile = null;
    authService.authListeners = [];
    authService.initialized = false;
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('Authentication State Management', () => {
    it('should initialize with null user and profile', () => {
      expect(authService.currentUser).toBeNull();
      expect(authService.userProfile).toBeNull();
      expect(authService.initialized).toBe(false);
    });

    it('should check authentication status correctly', () => {
      // Not authenticated initially
      expect(authService.isAuthenticated()).toBe(false);
      
      // Mock authenticated user
      authService.currentUser = { uid: 'test-uid', email: 'test@test.com' };
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('User Roles and Permissions', () => {
    beforeEach(() => {
      authService.currentUser = { uid: 'test-uid', email: 'test@test.com' };
    });

    it('should check client role correctly', () => {
      authService.userProfile = { userType: 'client' };
      expect(authService.hasRole('client')).toBe(true);
      expect(authService.hasRole('professional')).toBe(false);
      expect(authService.hasRole('admin')).toBe(false);
    });

    it('should check professional role correctly', () => {
      authService.userProfile = { userType: 'professional' };
      expect(authService.hasRole('professional')).toBe(true);
      expect(authService.hasRole('client')).toBe(false);
      expect(authService.hasRole('admin')).toBe(false);
    });

    it('should check admin role correctly', () => {
      authService.userProfile = { userType: 'admin' };
      expect(authService.hasRole('admin')).toBe(true);
      expect(authService.hasRole('client')).toBe(false);
      expect(authService.hasRole('professional')).toBe(false);
    });

    it('should check professional verification status', () => {
      // Unverified professional
      authService.userProfile = { 
        userType: 'professional',
        professional: { verified: false }
      };
      expect(authService.isProfessionalVerified()).toBe(false);

      // Verified professional
      authService.userProfile.professional.verified = true;
      expect(authService.isProfessionalVerified()).toBe(true);

      // Not a professional
      authService.userProfile = { userType: 'client' };
      expect(authService.isProfessionalVerified()).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle Firebase auth errors correctly', () => {
      const testCases = [
        {
          code: 'auth/email-already-in-use',
          expected: 'Este email ya está registrado'
        },
        {
          code: 'auth/weak-password',
          expected: 'La contraseña debe tener al menos 6 caracteres'
        },
        {
          code: 'auth/invalid-email',
          expected: 'Email inválido'
        },
        {
          code: 'auth/user-not-found',
          expected: 'Usuario no encontrado'
        },
        {
          code: 'auth/wrong-password',
          expected: 'Contraseña incorrecta'
        }
      ];

      testCases.forEach(({ code, expected }) => {
        const mockError = { code };
        const result = authService.handleAuthError(mockError);
        expect(result.message).toBe(expected);
      });
    });

    it('should handle unknown Firebase errors', () => {
      const mockError = { 
        code: 'auth/unknown-error',
        message: 'Unknown error occurred'
      };
      const result = authService.handleAuthError(mockError);
      expect(result.message).toBe('Unknown error occurred');
    });

    it('should handle errors without code', () => {
      const mockError = { message: 'Generic error' };
      const result = authService.handleAuthError(mockError);
      expect(result.message).toBe('Generic error');
    });
  });

  describe('Auth Listeners', () => {
    it('should add and remove auth listeners correctly', () => {
      const mockCallback = vi.fn();
      
      // Add listener
      const removeListener = authService.addAuthListener(mockCallback);
      expect(authService.authListeners).toContain(mockCallback);
      
      // Remove listener
      removeListener();
      expect(authService.authListeners).not.toContain(mockCallback);
    });

    it('should notify listeners on auth state change', () => {
      const mockCallback1 = vi.fn();
      const mockCallback2 = vi.fn();
      
      authService.addAuthListener(mockCallback1);
      authService.addAuthListener(mockCallback2);
      
      // Mock auth state
      authService.currentUser = { uid: 'test-uid' };
      authService.userProfile = { userType: 'client' };
      
      // Trigger notification
      authService.notifyListeners();
      
      expect(mockCallback1).toHaveBeenCalledWith(
        authService.currentUser,
        authService.userProfile
      );
      expect(mockCallback2).toHaveBeenCalledWith(
        authService.currentUser,
        authService.userProfile
      );
    });
  });

  describe('Current User Data', () => {
    it('should return current user data correctly', () => {
      const mockUser = { uid: 'test-uid', email: 'test@test.com' };
      const mockProfile = { userType: 'client', name: 'Test User' };
      
      authService.currentUser = mockUser;
      authService.userProfile = mockProfile;
      
      const result = authService.getCurrentUser();
      
      expect(result.user).toBe(mockUser);
      expect(result.profile).toBe(mockProfile);
    });

    it('should return null values when not authenticated', () => {
      const result = authService.getCurrentUser();
      
      expect(result.user).toBeNull();
      expect(result.profile).toBeNull();
    });
  });
});