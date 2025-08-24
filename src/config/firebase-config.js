// Firebase configuration
import { initializeApp as initFirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase config object (will be populated from environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID
};

// Firebase app instance
let app;
let auth;
let db;
let storage;
let analytics;

// Initialize Firebase
export const initializeApp = () => {
  try {
    // Initialize Firebase app
    app = initFirebaseApp(firebaseConfig);
    
    // Initialize services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Initialize analytics in production
    if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
      analytics = getAnalytics(app);
    }
    
    // Connect to emulators in development
    if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_EMULATORS === 'true') {
      connectToEmulators();
    }
    
    console.log('✅ Firebase initialized successfully');
    return app;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

// Connect to Firebase emulators
const connectToEmulators = () => {
  try {
    // Check if already connected to avoid double connection
    const isEmulatorEnv = import.meta.env.VITE_ENABLE_EMULATORS === 'true';
    
    if (!isEmulatorEnv) {
      console.log('🔧 Emulators disabled in environment');
      return;
    }
    
    // Connect Auth emulator
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('🔧 Connected to Auth emulator (localhost:9099)');
    }
    
    // Connect Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔧 Connected to Firestore emulator (localhost:8080)');
    
    // Connect Storage emulator
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('🔧 Connected to Storage emulator (localhost:9199)');
    
  } catch (error) {
    console.warn('⚠️ Could not connect to emulators:', error.message);
    console.warn('Make sure Firebase emulators are running: npm run emulators:start');
  }
};

// Export service instances
export { auth, db, storage, analytics };

// Export Firebase app
export default app;
