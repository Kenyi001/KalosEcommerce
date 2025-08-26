/**
 * Login Page for Kalos E-commerce
 * Handles user authentication with email/password
 */

import { renderWithLayout } from '../../components/Layout.js';
import { authService } from '../../services/auth.js';
import { navigateTo } from '../../utils/router.js';

/**
 * Render login page
 * @returns {string} HTML content
 */
export function renderLoginPage() {
  const content = `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <h1 class="text-4xl font-display font-bold text-brand mb-2">Kalos</h1>
          <h2 class="text-2xl font-bold text-navy">Iniciar Sesión</h2>
          <p class="mt-2 text-sm text-gray-600">
            ¿No tienes cuenta? 
            <a href="/auth/signup" data-router-link class="font-medium text-brand hover:text-brand-hover">
              Crear cuenta
            </a>
          </p>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form id="loginForm" class="space-y-6" novalidate>
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                  placeholder="tu@email.com"
                />
                <div id="emailError" class="hidden mt-2 text-sm text-red-600"></div>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                  placeholder="Tu contraseña"
                />
                <div id="passwordError" class="hidden mt-2 text-sm text-red-600"></div>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  class="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                />
                <label for="remember" class="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div class="text-sm">
                <a href="/auth/forgot-password" data-router-link class="font-medium text-brand hover:text-brand-hover">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <!-- Error Message -->
            <div id="loginError" class="hidden">
              <div class="bg-red-50 border border-red-200 rounded-md p-4">
                <div class="text-sm text-red-600" id="loginErrorMessage"></div>
              </div>
            </div>

            <!-- Success Message -->
            <div id="loginSuccess" class="hidden">
              <div class="bg-green-50 border border-green-200 rounded-md p-4">
                <div class="text-sm text-green-600" id="loginSuccessMessage"></div>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                id="loginButton"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span id="loginButtonText">Iniciar Sesión</span>
                <div id="loginButtonSpinner" class="hidden ml-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              </button>
            </div>
          </form>

          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            <!-- Social Login (Future) -->
            <div class="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-not-allowed opacity-50"
                disabled
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span class="ml-2">Google (Próximamente)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return renderWithLayout(content, {
    title: 'Iniciar Sesión - Kalos',
    showHeader: false,
    showFooter: false
  });
}

/**
 * Initialize login page functionality
 */
export function initializeLoginPage() {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('loginButton');
  const buttonText = document.getElementById('loginButtonText');
  const buttonSpinner = document.getElementById('loginButtonSpinner');

  if (!form || !emailInput || !passwordInput || !submitButton) {
    console.error('Login form elements not found');
    return;
  }

  // Clear any existing listeners
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  // Get new references after clone
  const finalForm = document.getElementById('loginForm');
  const finalEmailInput = document.getElementById('email');
  const finalPasswordInput = document.getElementById('password');
  const finalSubmitButton = document.getElementById('loginButton');
  const finalButtonText = document.getElementById('loginButtonText');
  const finalButtonSpinner = document.getElementById('loginButtonSpinner');

  // Form validation
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(fieldId, message) {
    const errorDiv = document.getElementById(`${fieldId}Error`);
    const input = document.getElementById(fieldId);
    
    if (errorDiv && input) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
      input.classList.add('border-red-500');
    }
  }

  function hideFieldError(fieldId) {
    const errorDiv = document.getElementById(`${fieldId}Error`);
    const input = document.getElementById(fieldId);
    
    if (errorDiv && input) {
      errorDiv.classList.add('hidden');
      input.classList.remove('border-red-500');
    }
  }

  function showMessage(type, message) {
    const errorDiv = document.getElementById('loginError');
    const successDiv = document.getElementById('loginSuccess');
    const errorMessage = document.getElementById('loginErrorMessage');
    const successMessage = document.getElementById('loginSuccessMessage');

    // Hide both first
    if (errorDiv) errorDiv.classList.add('hidden');
    if (successDiv) successDiv.classList.add('hidden');

    if (type === 'error' && errorDiv && errorMessage) {
      errorMessage.textContent = message;
      errorDiv.classList.remove('hidden');
    } else if (type === 'success' && successDiv && successMessage) {
      successMessage.textContent = message;
      successDiv.classList.remove('hidden');
    }
  }

  function setLoading(loading) {
    if (finalSubmitButton && finalButtonText && finalButtonSpinner) {
      finalSubmitButton.disabled = loading;
      
      if (loading) {
        finalButtonText.textContent = 'Iniciando sesión...';
        finalButtonSpinner.classList.remove('hidden');
      } else {
        finalButtonText.textContent = 'Iniciar Sesión';
        finalButtonSpinner.classList.add('hidden');
      }
    }
  }

  // Real-time validation
  if (finalEmailInput) {
    finalEmailInput.addEventListener('blur', () => {
      const email = finalEmailInput.value.trim();
      if (email && !validateEmail(email)) {
        showFieldError('email', 'Por favor ingresa un email válido');
      } else {
        hideFieldError('email');
      }
    });

    finalEmailInput.addEventListener('input', () => {
      hideFieldError('email');
    });
  }

  if (finalPasswordInput) {
    finalPasswordInput.addEventListener('input', () => {
      hideFieldError('password');
    });
  }

  // Form submission
  if (finalForm) {
    finalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous errors
      hideFieldError('email');
      hideFieldError('password');
      showMessage('', '');

      const email = finalEmailInput.value.trim();
      const password = finalPasswordInput.value;

      // Validation
      let hasErrors = false;

      if (!email) {
        showFieldError('email', 'El email es requerido');
        hasErrors = true;
      } else if (!validateEmail(email)) {
        showFieldError('email', 'Por favor ingresa un email válido');
        hasErrors = true;
      }

      if (!password) {
        showFieldError('password', 'La contraseña es requerida');
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }

      // Attempt login
      setLoading(true);

      try {
        const result = await authService.login(email, password);

        if (result.success) {
          showMessage('success', result.message);
          
          // Check for redirect destination
          const redirectPath = sessionStorage.getItem('redirectAfterAuth');
          if (redirectPath) {
            sessionStorage.removeItem('redirectAfterAuth');
            setTimeout(() => navigateTo(redirectPath), 1000);
          } else {
            // Redirect based on user role
            const userRole = result.profile?.role;
            if (userRole === 'professional') {
              setTimeout(() => navigateTo('/pro/dashboard'), 1000);
            } else {
              setTimeout(() => navigateTo('/cuenta'), 1000);
            }
          }
        } else {
          showMessage('error', result.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Login error:', error);
        showMessage('error', 'Error inesperado. Por favor intenta nuevamente.');
        setLoading(false);
      }
    });
  }

  // Check if already logged in
  authService.waitForAuth().then(({ user }) => {
    if (user) {
      // Redirect if already logged in
      const userRole = authService.getUserRole();
      if (userRole === 'professional') {
        navigateTo('/pro/dashboard');
      } else {
        navigateTo('/cuenta');
      }
    }
  });

  // Focus on email field
  if (finalEmailInput) {
    finalEmailInput.focus();
  }
}