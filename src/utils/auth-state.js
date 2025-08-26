/**
 * Authentication State Management for Kalos E-commerce
 * Handles global auth state, user profile updates, and UI synchronization
 */

import { authService } from '../services/auth.js';

/**
 * Global authentication state manager
 */
class AuthStateManager {
  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
    this.currentProfile = null;
    this.subscribers = new Set();
    this.headerUpdateCallbacks = new Set();
    this.loadingState = true;
    
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state management
   */
  initializeAuthState() {
    // Subscribe to auth service changes
    authService.onAuthStateChange((user, profile) => {
      const previousUser = this.currentUser;
      const previousProfile = this.currentProfile;
      
      this.currentUser = user;
      this.currentProfile = profile;
      this.isInitialized = true;
      this.loadingState = false;
      
      // Notify all subscribers
      this.notifySubscribers({
        user,
        profile,
        previousUser,
        previousProfile,
        isAuthenticated: !!user
      });
      
      // Update UI elements
      this.updateHeaderAuthentication();
      this.updatePageAuthentication();
      
      // Debug logging
      if (import.meta.env.DEV) {
        console.log('🔐 Auth state changed:', {
          authenticated: !!user,
          role: profile?.role,
          email: user?.email
        });
      }
    });
  }

  /**
   * Subscribe to authentication state changes
   * @param {Function} callback - Callback function to execute on state change
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    
    // If already initialized, call immediately
    if (this.isInitialized) {
      callback({
        user: this.currentUser,
        profile: this.currentProfile,
        previousUser: null,
        previousProfile: null,
        isAuthenticated: !!this.currentUser
      });
    }
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Subscribe to header authentication updates
   * @param {Function} callback - Callback to update header
   * @returns {Function} Unsubscribe function
   */
  subscribeToHeaderUpdates(callback) {
    this.headerUpdateCallbacks.add(callback);
    
    // Call immediately if initialized
    if (this.isInitialized) {
      callback(this.currentUser, this.currentProfile);
    }
    
    return () => {
      this.headerUpdateCallbacks.delete(callback);
    };
  }

  /**
   * Notify all subscribers of state changes
   * @param {Object} authData - Authentication data object
   */
  notifySubscribers(authData) {
    this.subscribers.forEach(callback => {
      try {
        callback(authData);
      } catch (error) {
        console.error('Error in auth state subscriber:', error);
      }
    });
  }

  /**
   * Update header authentication elements
   */
  updateHeaderAuthentication() {
    this.headerUpdateCallbacks.forEach(callback => {
      try {
        callback(this.currentUser, this.currentProfile);
      } catch (error) {
        console.error('Error updating header authentication:', error);
      }
    });
  }

  /**
   * Update page-specific authentication elements
   */
  updatePageAuthentication() {
    // Update auth-dependent elements across the page
    this.updateAuthLinks();
    this.updateUserElements();
    this.updateRoleElements();
    this.updateLoadingStates();
  }

  /**
   * Update authentication-related links and navigation
   */
  updateAuthLinks() {
    const authLinks = document.querySelectorAll('[data-auth-link]');
    
    authLinks.forEach(element => {
      const authType = element.getAttribute('data-auth-link');
      const isAuthenticated = !!this.currentUser;
      
      switch (authType) {
        case 'login':
        case 'register':
          // Hide login/register links when authenticated
          element.style.display = isAuthenticated ? 'none' : '';
          break;
          
        case 'logout':
        case 'account':
          // Show logout/account links when authenticated
          element.style.display = isAuthenticated ? '' : 'none';
          break;
          
        case 'dashboard':
          if (isAuthenticated && this.currentProfile) {
            element.style.display = '';
            // Update href based on role
            if (this.currentProfile.role === 'professional') {
              element.setAttribute('href', '/pro/dashboard');
            } else {
              element.setAttribute('href', '/cuenta');
            }
          } else {
            element.style.display = 'none';
          }
          break;
      }
    });
  }

  /**
   * Update user-specific UI elements
   */
  updateUserElements() {
    // Update user name displays
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(element => {
      if (this.currentUser && this.currentProfile) {
        element.textContent = this.currentProfile.displayName || this.currentUser.email;
      } else {
        element.textContent = '';
      }
    });

    // Update user email displays
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    userEmailElements.forEach(element => {
      if (this.currentUser) {
        element.textContent = this.currentUser.email;
      } else {
        element.textContent = '';
      }
    });

    // Update user avatar/initials
    const userAvatarElements = document.querySelectorAll('[data-user-avatar]');
    userAvatarElements.forEach(element => {
      if (this.currentUser && this.currentProfile) {
        const initials = this.getUserInitials();
        element.textContent = initials;
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });
  }

  /**
   * Update role-based elements
   */
  updateRoleElements() {
    const roleElements = document.querySelectorAll('[data-role]');
    
    roleElements.forEach(element => {
      const requiredRoles = element.getAttribute('data-role').split(',').map(r => r.trim());
      const userRole = this.currentProfile?.role;
      
      if (userRole && requiredRoles.includes(userRole)) {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });

    // Update role-specific classes
    const bodyElement = document.body;
    if (this.currentProfile?.role) {
      bodyElement.setAttribute('data-user-role', this.currentProfile.role);
    } else {
      bodyElement.removeAttribute('data-user-role');
    }
  }

  /**
   * Update loading states for auth-dependent elements
   */
  updateLoadingStates() {
    const loadingElements = document.querySelectorAll('[data-auth-loading]');
    
    loadingElements.forEach(element => {
      if (this.loadingState) {
        element.classList.add('auth-loading');
      } else {
        element.classList.remove('auth-loading');
      }
    });
  }

  /**
   * Get user initials for avatar display
   * @returns {string} User initials
   */
  getUserInitials() {
    if (!this.currentProfile?.displayName) {
      return this.currentUser?.email?.charAt(0).toUpperCase() || '?';
    }
    
    const names = this.currentProfile.displayName.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    } else {
      return names[0].charAt(0).toUpperCase();
    }
  }

  /**
   * Get current authentication state
   * @returns {Object} Current auth state
   */
  getCurrentState() {
    return {
      user: this.currentUser,
      profile: this.currentProfile,
      isAuthenticated: !!this.currentUser,
      isInitialized: this.isInitialized,
      loadingState: this.loadingState
    };
  }

  /**
   * Check if current user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} Role check result
   */
  hasRole(role) {
    return this.currentProfile?.role === role;
  }

  /**
   * Check if current user has any of the specified roles
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean} Role check result
   */
  hasAnyRole(roles) {
    return roles.includes(this.currentProfile?.role);
  }

  /**
   * Wait for authentication initialization
   * @returns {Promise<Object>} Auth state when initialized
   */
  async waitForInitialization() {
    if (this.isInitialized) {
      return this.getCurrentState();
    }
    
    return new Promise((resolve) => {
      const unsubscribe = this.subscribe((authData) => {
        unsubscribe();
        resolve(this.getCurrentState());
      });
    });
  }

  /**
   * Handle user logout with cleanup
   * @returns {Promise<boolean>} Logout success
   */
  async logout() {
    try {
      const result = await authService.logout();
      
      if (result.success) {
        // Clear any stored auth data
        sessionStorage.removeItem('redirectAfterAuth');
        sessionStorage.removeItem('redirectAfterEmailVerification');
        
        // Show success message if notification system is available
        if (window.showNotification) {
          window.showNotification('success', 'Sesión cerrada exitosamente');
        }
        
        return true;
      } else {
        console.error('Logout failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Refresh current user profile from server
   * @returns {Promise<boolean>} Refresh success
   */
  async refreshProfile() {
    if (!this.currentUser) {
      return false;
    }
    
    try {
      const profile = await authService.getUserProfile(this.currentUser.uid);
      if (profile) {
        this.currentProfile = profile;
        this.updatePageAuthentication();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile refresh error:', error);
      return false;
    }
  }
}

// Create singleton instance
export const authState = new AuthStateManager();

/**
 * Hook for components to use authentication state
 * @returns {Object} Auth state and helper functions
 */
export function useAuthState() {
  return {
    // Current state
    ...authState.getCurrentState(),
    
    // Helper methods
    hasRole: (role) => authState.hasRole(role),
    hasAnyRole: (roles) => authState.hasAnyRole(roles),
    
    // State management
    subscribe: (callback) => authState.subscribe(callback),
    waitForInitialization: () => authState.waitForInitialization(),
    
    // Actions
    logout: () => authState.logout(),
    refreshProfile: () => authState.refreshProfile()
  };
}

/**
 * Initialize authentication state management
 * Should be called once when the app starts
 */
export function initializeAuthState() {
  // Auth state manager is already initialized in constructor
  // This function exists for explicit initialization if needed
  
  // Add global CSS for auth states
  if (!document.getElementById('auth-state-styles')) {
    const style = document.createElement('style');
    style.id = 'auth-state-styles';
    style.textContent = `
      .auth-loading {
        opacity: 0.6;
        pointer-events: none;
      }
      
      [data-auth-link] {
        transition: opacity 0.2s ease;
      }
      
      body[data-user-role="professional"] .customer-only {
        display: none !important;
      }
      
      body[data-user-role="customer"] .professional-only {
        display: none !important;
      }
      
      body:not([data-user-role]) .auth-required {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  return authState;
}

export default authState;