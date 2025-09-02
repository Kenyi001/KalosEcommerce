/**
 * Firebase Configuration for Kalos E-commerce
 * Loads configuration from environment variables and initializes Firebase services
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kalos-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kalos-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kalos-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Check if we're using emulator
const useEmulator = import.meta.env.VITE_ENABLE_EMULATORS === 'true';

// Connect to emulators if enabled (currently disabled due to Java PATH issues)
if (useEmulator && import.meta.env.DEV) {
  console.log('🔧 Using Firebase Emulator Suite');
  
  try {
    // Connect to Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    
    // Connect to Storage emulator
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    // Emulators might already be connected
    console.warn('Emulators already connected or not available:', error.message);
  }
} else {
  console.log('🔥 Using Firebase Production Services');
}

export default firebaseConfig;
export { useEmulator, app };