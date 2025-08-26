/**
 * Firebase Authentication Service for Kalos E-commerce
 * Handles user authentication, registration, and profile management
 */

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import firebaseConfig, { useEmulator } from '../config/firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators if in development
if (useEmulator && !auth._delegate._config.emulator) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔧 Connected to Firebase emulators');
  } catch (error) {
    console.warn('⚠️ Could not connect to emulators:', error.message);
  }
}

/**
 * Authentication Service Class
 * Provides methods for user authentication and profile management
 */
export class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentUserProfile = null;
    this.authStateListeners = [];
    this.isInitialized = false;
    
    // Initialize auth state listener
    this.initAuthStateListener();
  }

  /**
   * Initialize authentication state listener
   */
  initAuthStateListener() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      
      if (user) {
        // Load user profile from Firestore
        this.currentUserProfile = await this.getUserProfile(user.uid);
      } else {
        this.currentUserProfile = null;
      }
      
      this.isInitialized = true;
      this.notifyListeners(user, this.currentUserProfile);
    });
  }

  /**
   * Login user with email and password
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await this.getUserProfile(userCredential.user.uid);
      
      return {
        success: true,
        user: userCredential.user,
        profile: userProfile,
        message: 'Inicio de sesión exitoso'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      const { email, password, displayName, role, phone } = userData;
      
      // Validate required fields
      if (!email || !password || !displayName || !role) {
        return {
          success: false,
          error: 'Todos los campos son requeridos'
        };
      }

      // Validate role
      if (!['customer', 'professional'].includes(role)) {
        return {
          success: false,
          error: 'Rol inválido'
        };
      }

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      const profileData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: role,
        phone: phone || null,
        emailVerified: user.emailVerified,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), profileData);

      // Send email verification
      try {
        await sendEmailVerification(user);
      } catch (emailError) {
        console.warn('Could not send verification email:', emailError);
      }

      return {
        success: true,
        user: user,
        profile: profileData,
        message: 'Usuario creado exitosamente. Por favor verifica tu email.'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  /**
   * Logout current user
   */
  async logout() {
    try {
      await signOut(auth);
      return { 
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Email de recuperación enviado. Revisa tu bandeja de entrada.'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.warn('User profile not found for uid:', uid);
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Subscribe to authentication state changes
   */
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    
    // If already initialized, call immediately
    if (this.isInitialized) {
      callback(this.currentUser, this.currentUserProfile);
    }
    
    // Return unsubscribe function
    return () => {
      this.authStateListeners = this.authStateListeners.filter(
        listener => listener !== callback
      );
    };
  }

  /**
   * Notify all auth state listeners
   */
  notifyListeners(user, profile) {
    this.authStateListeners.forEach(callback => callback(user, profile));
  }

  /**
   * Handle Firebase authentication errors
   */
  handleAuthError(error) {
    const errorMessages = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Este email ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
      'auth/timeout': 'La operación ha expirado. Intenta nuevamente.'
    };

    console.error('Auth Error:', error);
    return errorMessages[error.code] || error.message || 'Error desconocido';
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Get current user profile
   */
  getCurrentUserProfile() {
    return this.currentUserProfile;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.currentUser;
  }

  /**
   * Get current user role
   */
  getUserRole() {
    return this.currentUserProfile?.role || null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    return this.getUserRole() === role;
  }

  /**
   * Wait for auth initialization
   */
  async waitForAuth() {
    return new Promise((resolve) => {
      if (this.isInitialized) {
        resolve({ user: this.currentUser, profile: this.currentUserProfile });
        return;
      }

      const unsubscribe = this.onAuthStateChange((user, profile) => {
        unsubscribe();
        resolve({ user, profile });
      });
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;