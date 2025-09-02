# Ticket #0004: Sistema de Autenticación Base - Firebase Auth

**Estado:** ✅ Completado  
**Prioridad:** Alta  
**Estimación:** 1-2 días  
**Fase:** 1 - Autenticación  
**Asignado a:** Frontend Team  

---

## 📋 Descripción

Implementar el sistema de autenticación base usando Firebase Auth sobre la estructura de scaffold ya establecida, incluyendo registro, login, logout y manejo de sesiones para el marketplace Kalos E-commerce.

## 🎯 Objetivos

### Funcionales
- Registro de usuarios (cliente/profesional)
- Login con email/password
- Login con Google (opcional)
- Logout y manejo de sesión
- Recuperación de contraseña
- Verificación de email

### Técnicos
- Firebase Auth integrado al scaffold
- Servicio de autenticación encapsulado
- Estados de autenticación manejados
- Persistencia de sesión
- Manejo de errores robusto

## 🔧 Tareas Técnicas

### Firebase Configuration (usando scaffold base)
- [x] Extender firebase-config.js del scaffold
- [x] Habilitar Email/Password provider
- [x] Configurar Google Auth provider
- [x] Setup de email verification
- [x] Configurar password reset

### Authentication Service (aprovechando estructura scaffold)
- [x] Crear src/services/auth.js usando utils base
- [x] Implementar registro de usuarios
- [x] Implementar login/logout
- [x] Manejo de estado de autenticación
- [x] Funciones de recuperación de password

### User Profile Management
- [x] Crear perfil de usuario en Firestore
- [x] Diferenciación de tipos de usuario (client/professional)
- [x] Validación de datos de perfil usando validators del scaffold

### UI Components
- [x] LoginForm component
- [x] RegisterForm component
- [x] ForgotPasswordForm component
- [x] AuthLayout wrapper
- [x] Loading states y error handling

## 📁 Estructura de Archivos

```
src/
├── services/
│   └── auth.js              # Servicio principal de auth
├── pages/
│   └── Auth/
│       ├── Login.js
│       ├── Register.js
│       └── ForgotPassword.js
├── components/
│   └── auth/
│       ├── AuthForm.js
│       ├── SocialLogin.js
│       └── AuthLayout.js
├── utils/
│   ├── auth-guards.js       # Guards para rutas protegidas
│   └── auth-helpers.js      # Helpers de autenticación
└── config/
    └── firebase-config.js   # Ya existente, extender
```

## 🎨 Implementación Auth Service

```javascript
// src/services/auth.js
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase-config.js';

export class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    
    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.notifyListeners(user);
    });
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await this.getUserProfile(userCredential.user.uid);
      
      return {
        success: true,
        user: userCredential.user,
        profile: userProfile
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  async register(userData) {
    try {
      const { email, password, role, displayName } = userData;
      
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: role,
        emailVerified: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        success: true,
        user: user,
        message: 'Usuario creado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Email de recuperación enviado'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  async getUserProfile(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.authStateListeners = this.authStateListeners.filter(
        listener => listener !== callback
      );
    };
  }

  notifyListeners(user) {
    this.authStateListeners.forEach(callback => callback(user));
  }

  handleAuthError(error) {
    const errorMessages = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Email ya está en uso',
      'auth/weak-password': 'Contraseña muy débil',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Demasiados intentos, intenta más tarde'
    };

    return errorMessages[error.code] || error.message;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  async getUserRole() {
    if (!this.currentUser) return null;
    
    const profile = await this.getUserProfile(this.currentUser.uid);
    return profile?.role || null;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
```

## 🧪 Criterios de Aceptación

### Authentication Functionality
- [x] Login con email/password funcionando
- [x] Registro de usuarios con roles
- [x] Logout funcionando correctamente
- [x] Password reset funcionando
- [x] Email verification implementada
- [x] Estado de auth persistente

### User Profile Management
- [x] Perfil de usuario creado en Firestore
- [x] Roles diferenciados (customer/professional)
- [x] Validación de datos completa
- [x] Update profile funcionando
- [x] Profile picture upload

### Error Handling & UX
- [x] Mensajes de error localizados
- [x] Loading states en forms
- [x] Validación client-side
- [x] Success/error notifications
- [x] Responsive design mobile-first

### Security & Performance
- [x] Input sanitization
- [x] Rate limiting consideration
- [x] Secure password requirements
- [x] Session management
- [x] Auth state optimization

## 🔗 Dependencias

### Internas
- **Ticket #0000** - Scaffold setup ✅ **COMPLETADO**
- **Ticket #0003** - Routing system ⚠️ **PARALLEL**

### Técnicas (del Scaffold)
- ✅ Firebase configurado con scaffold
- ✅ Vite y Tailwind setup con Design System
- ✅ Component library base (Button, Input, Modal, Card)
- ✅ Utilities (validators, helpers, api base)
- ⚠️ Router implementation

### Firebase (usando configuración scaffold)
- ✅ Firebase Auth habilitado en emulator
- ✅ Firestore configurado con emulator
- ✅ Security rules básicas configuradas
- ✅ Environment variables template

## 📚 Testing

### Unit Tests
```javascript
// tests/auth.service.test.js
import { describe, it, expect, vi } from 'vitest';
import { authService } from '../src/services/auth.js';

describe('AuthService', () => {
  it('should login with valid credentials', async () => {
    const result = await authService.login('test@example.com', 'password123');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
  });

  it('should handle invalid credentials', async () => {
    const result = await authService.login('test@example.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should register new user', async () => {
    const userData = {
      email: 'newuser@example.com',
      password: 'password123',
      role: 'customer',
      displayName: 'New User'
    };
    
    const result = await authService.register(userData);
    expect(result.success).toBe(true);
  });
});
```

---

**Tags:** `auth` `firebase` `security` `users` `session`  
**Relacionado:** Foundation para todas las funcionalidades que requieren autenticación
