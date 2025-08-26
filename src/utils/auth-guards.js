/**
 * Authentication Guards for Kalos E-commerce
 * Middleware functions for route protection and role-based access
 */

import { authService } from '../services/auth.js';

/**
 * Guard that requires user to be authenticated
 * Redirects to login if not authenticated
 * @param {string} path - Current route path
 * @param {Object} route - Route configuration object
 * @returns {Promise<boolean|string>} true if allowed, redirect path if not
 */
export async function requireAuth(path, route) {
  try {
    // Wait for auth initialization
    const { user } = await authService.waitForAuth();
    
    if (!user) {
      // Store intended destination for post-login redirect
      sessionStorage.setItem('redirectAfterAuth', path);
      return '/auth/login';
    }
    
    return true;
  } catch (error) {
    console.error('Auth guard error:', error);
    sessionStorage.setItem('redirectAfterAuth', path);
    return '/auth/login';
  }
}

/**
 * Guard that requires user to NOT be authenticated (guest only)
 * Redirects authenticated users to appropriate dashboard
 * @param {string} path - Current route path
 * @param {Object} route - Route configuration object
 * @returns {Promise<boolean|string>} true if allowed, redirect path if not
 */
export async function requireGuest(path, route) {
  try {
    // Wait for auth initialization
    const { user, profile } = await authService.waitForAuth();
    
    if (user && profile) {
      // Redirect based on user role
      if (profile.role === 'professional') {
        return '/pro/dashboard';
      } else {
        return '/cuenta';
      }
    }
    
    return true;
  } catch (error) {
    console.error('Guest guard error:', error);
    return true; // Allow access on error (fail open for public routes)
  }
}

/**
 * Factory function that creates a role-based guard
 * @param {string|string[]} allowedRoles - Role or array of roles allowed
 * @returns {Function} Guard function
 */
export function requireRole(allowedRoles) {
  // Normalize to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return async function(path, route) {
    try {
      // First check authentication
      const authResult = await requireAuth(path, route);
      if (authResult !== true) {
        return authResult; // Redirect to login
      }
      
      // Get current user profile
      const { profile } = await authService.waitForAuth();
      
      if (!profile || !profile.role) {
        console.warn('User profile or role not found');
        return '/auth/login';
      }
      
      // Check if user has allowed role
      if (!roles.includes(profile.role)) {
        console.warn(`Access denied. Required roles: ${roles.join(', ')}, user role: ${profile.role}`);
        
        // Redirect to appropriate dashboard based on actual role
        if (profile.role === 'professional') {
          return '/pro/dashboard';
        } else if (profile.role === 'customer') {
          return '/cuenta';
        } else {
          return '/';
        }
      }
      
      return true;
    } catch (error) {
      console.error('Role guard error:', error);
      return '/auth/login';
    }
  };
}

/**
 * Guard specifically for customer-only routes
 * @param {string} path - Current route path
 * @param {Object} route - Route configuration object
 * @returns {Promise<boolean|string>} true if allowed, redirect path if not
 */
export const requireCustomer = requireRole('customer');

/**
 * Guard specifically for professional-only routes
 * @param {string} path - Current route path
 * @param {Object} route - Route configuration object
 * @returns {Promise<boolean|string>} true if allowed, redirect path if not
 */
export const requireProfessional = requireRole('professional');

/**
 * Guard specifically for admin-only routes
 * @param {string} path - Current route path
 * @param {Object} route - Route configuration object
 * @returns {Promise<boolean|string>} true if allowed, redirect path if not
 */
export const requireAdmin = requireRole('admin');

/**
 * Guard that allows multiple roles
 * @param {string} path - Current route path
 * @param {Object} route - Route configuration object
 * @returns {Promise<boolean|string>} true if allowed, redirect path if not
 */
export const requireCustomerOrProfessional = requireRole(['customer', 'professional']);

/**
 * Guard for email verified users only
 * @param {string} path - Current route path
 * @param {Object} route - Route configuration object
 * @returns {Promise<boolean|string>} true if allowed, redirect path if not
 */
export async function requireEmailVerified(path, route) {
  try {
    // First check authentication
    const authResult = await requireAuth(path, route);
    if (authResult !== true) {
      return authResult;
    }
    
    // Check email verification
    const { user } = await authService.waitForAuth();
    
    if (!user.emailVerified) {
      // Store intended destination
      sessionStorage.setItem('redirectAfterEmailVerification', path);
      return '/auth/verify-email';
    }
    
    return true;
  } catch (error) {
    console.error('Email verification guard error:', error);
    return '/auth/login';
  }
}

/**
 * Guard for active users only (not suspended/disabled)
 * @param {string} path - Current route path  
 * @param {Object} route - Route configuration object
 * @returns {Promise<boolean|string>} true if allowed, redirect path if not
 */
export async function requireActiveUser(path, route) {
  try {
    // First check authentication
    const authResult = await requireAuth(path, route);
    if (authResult !== true) {
      return authResult;
    }
    
    // Check if user is active
    const { profile } = await authService.waitForAuth();
    
    if (!profile || profile.isActive === false) {
      return '/auth/suspended';
    }
    
    return true;
  } catch (error) {
    console.error('Active user guard error:', error);
    return '/auth/login';
  }
}

/**
 * Composite guard that combines authentication, role, and active status checks
 * Most commonly used guard for protected routes
 * @param {string|string[]} allowedRoles - Role or array of roles allowed
 * @returns {Function} Combined guard function
 */
export function requireAuthenticatedRole(allowedRoles) {
  const roleGuard = requireRole(allowedRoles);
  
  return async function(path, route) {
    try {
      // Check active status first
      const activeResult = await requireActiveUser(path, route);
      if (activeResult !== true) {
        return activeResult;
      }
      
      // Then check role
      const roleResult = await roleGuard(path, route);
      if (roleResult !== true) {
        return roleResult;
      }
      
      return true;
    } catch (error) {
      console.error('Authenticated role guard error:', error);
      return '/auth/login';
    }
  };
}

/**
 * Development guard - only allows access in development environment
 * @param {string} path - Current route path
 * @param {Object} route - Route configuration object
 * @returns {Promise<boolean|string>} true if allowed, redirect path if not
 */
export async function requireDevelopment(path, route) {
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) {
    console.warn('Access denied: Development-only route accessed in production');
    return '/404';
  }
  
  return true;
}

/**
 * Rate limiting guard (basic implementation)
 * Prevents too many rapid route accesses
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Rate limiting guard function
 */
export function requireRateLimit(maxAttempts = 10, windowMs = 60000) {
  const attempts = new Map();
  
  return async function(path, route) {
    const now = Date.now();
    const userKey = authService.getCurrentUser()?.uid || 'anonymous';
    const key = `${userKey}:${path}`;
    
    // Clean old attempts
    const userAttempts = attempts.get(key) || [];
    const validAttempts = userAttempts.filter(timestamp => now - timestamp < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      console.warn('Rate limit exceeded for path:', path);
      return '/rate-limited';
    }
    
    // Record this attempt
    validAttempts.push(now);
    attempts.set(key, validAttempts);
    
    return true;
  };
}

/**
 * Helper function to run multiple guards in sequence
 * @param {Function[]} guards - Array of guard functions
 * @returns {Function} Combined guard function
 */
export function combineGuards(guards) {
  return async function(path, route) {
    for (const guard of guards) {
      const result = await guard(path, route);
      if (result !== true) {
        return result; // Return first failing guard's redirect
      }
    }
    return true;
  };
}