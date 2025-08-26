import './styles/main.css';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from './config/firebase-config.js';

// Import router
import Router, { authMiddleware } from './utils/router.js';
import routes from './router/routes.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Router
function initializeRouter() {
  // Add authentication middleware
  window.router.use(authMiddleware);
  
  // Register all routes
  routes.forEach(route => {
    window.router.addRoute(route.path, route.handler, {
      requiresAuth: route.requiresAuth,
      allowedRoles: route.allowedRoles,
      title: route.title,
      meta: route.meta
    });
  });

  // Start the router
  window.router.start();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('< Initializing Kalos E-commerce...');
  
  // Initialize router
  initializeRouter();
  
  console.log(' Kalos E-commerce initialized successfully');
});