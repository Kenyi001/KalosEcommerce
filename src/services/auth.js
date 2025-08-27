/**
 * Firebase Authentication Service for Kalos E-commerce
 * Handles user authentication, registration, and profile management
 */

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
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

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Connect to emulators if in development
if (useEmulator && !auth._delegate?._config?.emulator) {
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
    // In demo mode, don't use Firebase auth listener
    if (import.meta.env.DEV && firebaseConfig.projectId === 'kalos-demo') {
      console.log('🎭 Demo mode: Using local auth state management');
      this.isInitialized = true;
      this.restoreDemoUser();
      return;
    }

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
   * Login user with Google
   * @param {string} [defaultRole='customer'] - Default role for new users
   * @returns {Promise<{success: boolean, user?: Object, profile?: Object, isNewUser?: boolean, error?: string}>}
   */
  async loginWithGoogle(defaultRole = 'customer') {
    try {
      console.log('🔄 Starting Google Sign-In with role:', defaultRole);
      
      // Demo mode - simulate successful authentication
      if (import.meta.env.DEV && firebaseConfig.projectId === 'kalos-demo') {
        return await this.simulateDemoLogin(defaultRole);
      }

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isNewUser = result._tokenResponse?.isNewUser || false;

      console.log('✅ Google Sign-In successful:', { uid: user.uid, email: user.email, isNewUser });

      // Check if user profile exists
      let userProfile = await this.getUserProfile(user.uid);

      // If no profile exists, create one (new user)
      if (!userProfile || isNewUser) {
        console.log('📝 Creating new user profile...');
        
        const profileData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          photoURL: user.photoURL,
          availableRoles: [defaultRole],
          activeRole: defaultRole,
          emailVerified: user.emailVerified,
          isActive: true,
          authProvider: 'google',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Initialize role-specific profiles
        if (defaultRole === 'customer') {
          profileData.customerProfile = {
            preferences: [],
            location: null,
            favoriteServices: []
          };
        } else if (defaultRole === 'professional') {
          profileData.professionalProfile = {
            services: [],
            experience: '',
            verified: false,
            rating: 0,
            completedBookings: 0
          };
        }

        await setDoc(doc(db, 'users', user.uid), profileData);
        userProfile = profileData;
        console.log('✅ User profile created successfully');
      } else {
        console.log('✅ Existing user profile loaded');
        
        // Fix activeRole if it's undefined but user has availableRoles
        if (!userProfile.activeRole && userProfile.availableRoles && userProfile.availableRoles.length > 0) {
          console.log('🔧 Fixing missing activeRole for existing user');
          const firstAvailableRole = userProfile.availableRoles[0];
          
          // Update local profile object immediately
          userProfile.activeRole = firstAvailableRole;
          userProfile.updatedAt = new Date();
          
          // Update in Firestore
          try {
            await updateDoc(doc(db, 'users', user.uid), {
              activeRole: firstAvailableRole,
              updatedAt: new Date()
            });
            console.log('✅ ActiveRole fixed to:', firstAvailableRole);
            console.log('🔧 Updated profile object:', userProfile);
          } catch (error) {
            console.warn('Could not update activeRole in Firestore:', error);
          }
        }
      }
      
      // Update internal auth service state
      this.currentUser = user;
      this.currentUserProfile = userProfile;
      this.isInitialized = true;
      
      // Notify listeners with the corrected profile
      this.notifyListeners(user, userProfile);
      
      return {
        success: true,
        user: user,
        profile: userProfile,
        isNewUser: isNewUser || !userProfile,
        message: isNewUser ? 'Cuenta creada exitosamente con Google' : 'Inicio de sesión exitoso con Google'
      };
    } catch (error) {
      console.error('❌ Google Sign-In failed:', error);
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  /**
   * Simulate demo login for development
   */
  async simulateDemoLogin(defaultRole = 'customer') {
    console.log('🎭 Demo mode: Creating simulated Google authentication with role:', defaultRole);
    
    // Generate a demo user
    const mockUser = {
      uid: 'demo-google-user',
      email: 'demo@kalos.com',
      displayName: 'Usuario Demo',
      photoURL: null,
      emailVerified: true
    };

    const profileData = {
      uid: mockUser.uid,
      email: mockUser.email,
      displayName: mockUser.displayName,
      photoURL: mockUser.photoURL,
      availableRoles: [defaultRole],
      activeRole: defaultRole,
      emailVerified: true,
      isActive: true,
      authProvider: 'google',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Initialize role-specific profiles
    if (defaultRole === 'customer') {
      profileData.customerProfile = {
        preferences: [],
        location: null,
        favoriteServices: []
      };
    } else if (defaultRole === 'professional') {
      profileData.professionalProfile = {
        services: [],
        experience: '',
        verified: false,
        rating: 0,
        completedBookings: 0
      };
    }

    console.log('🎭 Demo user profile created:', profileData);

    // Store demo user in localStorage for persistence
    localStorage.setItem('demoUser', JSON.stringify(mockUser));
    localStorage.setItem('demoProfile', JSON.stringify(profileData));

    // Simulate auth state change
    this.currentUser = mockUser;
    this.currentUserProfile = profileData;
    this.isInitialized = true;
    
    console.log('🎭 Notifying listeners...');
    this.notifyListeners(mockUser, profileData);

    const result = {
      success: true,
      user: mockUser,
      profile: profileData,
      isNewUser: true,
      message: 'Demo: Cuenta creada exitosamente con Google'
    };

    console.log('🎭 Returning demo login result:', result);
    return result;
  }

  /**
   * Restore demo user from localStorage
   */
  restoreDemoUser() {
    try {
      const demoUser = localStorage.getItem('demoUser');
      const demoProfile = localStorage.getItem('demoProfile');
      
      if (demoUser && demoProfile) {
        this.currentUser = JSON.parse(demoUser);
        this.currentUserProfile = JSON.parse(demoProfile);
        console.log('🎭 Demo user restored from localStorage');
        this.notifyListeners(this.currentUser, this.currentUserProfile);
      } else {
        console.log('🎭 No demo user found in localStorage');
        this.notifyListeners(null, null);
      }
    } catch (error) {
      console.error('Error restoring demo user:', error);
      this.notifyListeners(null, null);
    }
  }

  /**
   * Register user with Google (alias for loginWithGoogle with professional default)
   * @param {string} role - User role (customer/professional)
   * @returns {Promise<{success: boolean, user?: Object, profile?: Object, isNewUser?: boolean, error?: string}>}
   */
  async registerWithGoogle(role = 'customer') {
    return await this.loginWithGoogle(role);
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

      // Create user profile in Firestore with dual-role support
      const profileData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        phone: phone || null,
        availableRoles: [role], // Start with selected role, can expand later
        activeRole: role,       // Currently active role
        emailVerified: user.emailVerified,
        isActive: true,
        authProvider: 'email',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Initialize role-specific profiles
      if (role === 'customer') {
        profileData.customerProfile = {
          preferences: [],
          location: null,
          favoriteServices: [],
          phone: phone || null
        };
      } else if (role === 'professional') {
        profileData.professionalProfile = {
          services: [],
          experience: '',
          verified: false,
          rating: 0,
          completedBookings: 0,
          phone: phone || null
        };
      }

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
      // Demo mode - clear localStorage
      if (import.meta.env.DEV && firebaseConfig.projectId === 'kalos-demo') {
        localStorage.removeItem('demoUser');
        localStorage.removeItem('demoProfile');
        this.currentUser = null;
        this.currentUserProfile = null;
        this.notifyListeners(null, null);
        return { 
          success: true,
          message: 'Demo: Sesión cerrada exitosamente'
        };
      }

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
    console.log(`🔔 Notifying ${this.authStateListeners.length} listeners`);
    console.log('🔔 Notifying with user:', user?.email);
    console.log('🔔 Notifying with profile roles:', profile?.availableRoles);
    console.log('🔔 Notifying with profile activeRole:', profile?.activeRole);
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
    return this.currentUserProfile?.activeRole || null;
  }

  /**
   * Wait for auth initialization
   */
  async waitForAuth() {
    // In demo mode, try to get from localStorage first
    if (import.meta.env.DEV && firebaseConfig.projectId === 'kalos-demo') {
      if (!this.currentUser || !this.currentUserProfile) {
        try {
          const demoUser = localStorage.getItem('demoUser');
          const demoProfile = localStorage.getItem('demoProfile');
          
          if (demoUser && demoProfile) {
            this.currentUser = JSON.parse(demoUser);
            this.currentUserProfile = JSON.parse(demoProfile);
            this.isInitialized = true;
            console.log('🎭 waitForAuth: Restored demo user from localStorage');
          }
        } catch (error) {
          console.error('Error restoring demo user in waitForAuth:', error);
        }
      }
    }

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


  /**
   * Get all available roles for current user
   */
  getAvailableRoles() {
    return this.currentUserProfile?.availableRoles || [];
  }

  /**
   * Check if user has specific role available
   */
  hasRole(role) {
    const availableRoles = this.getAvailableRoles();
    return availableRoles.includes(role);
  }

  /**
   * Check if user is currently acting as customer
   */
  isCustomer() {
    return this.getUserRole() === 'customer';
  }

  /**
   * Check if user is currently acting as professional
   */
  isProfessional() {
    return this.getUserRole() === 'professional';
  }

  /**
   * Switch user's active role
   */
  async switchRole(newRole) {
    if (!this.currentUser || !this.currentUserProfile) {
      return {
        success: false,
        error: 'Usuario no autenticado'
      };
    }

    const availableRoles = this.getAvailableRoles();
    if (!availableRoles.includes(newRole)) {
      return {
        success: false,
        error: `No tienes acceso al rol: ${newRole}`
      };
    }

    try {
      const updateData = {
        activeRole: newRole,
        updatedAt: new Date()
      };

      // Always save to Firestore first (for persistence), then localStorage for demo mode
      console.log('🎭 Saving role switch to Firestore...');
      try {
        const userRef = doc(db, 'users', this.currentUser.uid);
        await updateDoc(userRef, updateData);
        console.log('🎭 Successfully saved role switch to Firestore');
      } catch (firestoreError) {
        console.warn('⚠️ Failed to save role switch to Firestore, continuing with localStorage only:', firestoreError.message);
      }

      // Update local profile regardless of Firestore success
      this.currentUserProfile.activeRole = newRole;
      this.currentUserProfile.updatedAt = updateData.updatedAt;
      
      // Always update localStorage in development mode for immediate reflection
      if (import.meta.env.DEV) {
        localStorage.setItem('demoProfile', JSON.stringify(this.currentUserProfile));
        console.log('🎭 Role switch saved to localStorage');
      }
      
      // Notify listeners of role change
      this.notifyListeners(this.currentUser, this.currentUserProfile);

      return {
        success: true,
        newRole: newRole,
        message: `Cambiado a modo ${newRole === 'customer' ? 'cliente' : 'profesional'}`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al cambiar de rol: ' + error.message
      };
    }
  }

  /**
   * Add new role to user (become professional, etc.)
   */
  async addRole(newRole, additionalData = {}) {
    if (!this.currentUser || !this.currentUserProfile) {
      return {
        success: false,
        error: 'Usuario no autenticado'
      };
    }

    const availableRoles = this.getAvailableRoles();
    if (availableRoles.includes(newRole)) {
      return {
        success: false,
        error: 'Ya tienes acceso a este rol'
      };
    }

    try {
      const updateData = {
        availableRoles: [...availableRoles, newRole],
        updatedAt: new Date()
      };

      // Add role-specific profile data
      if (newRole === 'professional') {
        updateData.professionalProfile = {
          services: additionalData.services || [],
          experience: additionalData.experience || '',
          verified: false,
          rating: 0,
          completedBookings: 0,
          ...additionalData
        };
      } else if (newRole === 'customer') {
        updateData.customerProfile = {
          preferences: additionalData.preferences || [],
          location: additionalData.location || null,
          favoriteServices: additionalData.favoriteServices || [],
          ...additionalData
        };
      }

      // Always save to Firestore first (for persistence), then localStorage for demo mode
      console.log('💾 Saving role update to Firestore...');
      try {
        const userRef = doc(db, 'users', this.currentUser.uid);
        await updateDoc(userRef, updateData);
        console.log('💾 Successfully saved to Firestore');
      } catch (firestoreError) {
        console.warn('⚠️ Failed to save to Firestore, continuing with localStorage only:', firestoreError.message);
      }

      // Update local profile regardless of Firestore success
      console.log('🎭 Updating local profile...');
      console.log('🎭 Before update - availableRoles:', this.currentUserProfile.availableRoles);
      console.log('🎭 Before update - activeRole:', this.currentUserProfile.activeRole);
      
      this.currentUserProfile.availableRoles = updateData.availableRoles;
      if (updateData.professionalProfile) {
        this.currentUserProfile.professionalProfile = updateData.professionalProfile;
      }
      if (updateData.customerProfile) {
        this.currentUserProfile.customerProfile = updateData.customerProfile;
      }
      this.currentUserProfile.updatedAt = updateData.updatedAt;
      
      // If no activeRole set, set it to the first available role
      if (!this.currentUserProfile.activeRole && updateData.availableRoles.length > 0) {
        this.currentUserProfile.activeRole = updateData.availableRoles[0];
        console.log('🎭 Set activeRole to first available:', this.currentUserProfile.activeRole);
      }
      
      console.log('🎭 After update - availableRoles:', this.currentUserProfile.availableRoles);
      console.log('🎭 After update - activeRole:', this.currentUserProfile.activeRole);
      
      // Always update localStorage in development mode for immediate reflection
      if (import.meta.env.DEV) {
        localStorage.setItem('demoProfile', JSON.stringify(this.currentUserProfile));
        console.log('🎭 Updated profile saved to localStorage');
      }

      // Notify listeners
      console.log('🎭 Notifying listeners with updated profile...');
      this.notifyListeners(this.currentUser, this.currentUserProfile);

      return {
        success: true,
        newRole: newRole,
        message: `Rol ${newRole} agregado exitosamente`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al agregar rol: ' + error.message
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;