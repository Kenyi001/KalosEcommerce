// Test setup file for Vitest
import { vi } from 'vitest';

// Mock environment variables for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_FIREBASE_API_KEY: 'test-api-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'test-project.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: 'test-project',
    VITE_FIREBASE_STORAGE_BUCKET: 'test-project.appspot.com',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
    VITE_FIREBASE_APP_ID: '1:123456789:web:testappid',
    VITE_GA_MEASUREMENT_ID: 'G-TESTID',
    VITE_ENVIRONMENT: 'test',
    VITE_API_BASE_URL: 'http://localhost:5173',
    VITE_ENABLE_EMULATORS: 'false',
    VITE_ENABLE_ANALYTICS: 'false',
    VITE_ENABLE_PERFORMANCE_MONITORING: 'false',
    DEV: false,
    PROD: false
  },
  writable: true
});

// Mock console methods in test environment
global.console = {
  ...console,
  // Uncomment below if you want to silence console logs in tests
  // log: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
};

// Mock DOM methods that might be used
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/',
    href: 'http://localhost:5173/',
    reload: vi.fn()
  },
  writable: true
});

// Global test utilities
global.mockUser = {
  uid: 'test-user-uid',
  email: 'test@example.com',
  displayName: 'Test User'
};

global.mockProfile = {
  uid: 'test-user-uid',
  email: 'test@example.com',
  name: 'Test User',
  userType: 'client',
  verified: false,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date()
};