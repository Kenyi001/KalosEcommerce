/**
 * Forgot Password Page for Kalos E-commerce
 * Handles password reset email sending
 */

import { renderWithLayout } from '../../components/Layout.js';
import { authService } from '../../services/auth.js';
import { navigateTo } from '../../utils/router.js';

/**
 * Render forgot password page
 * @returns {string} HTML content
 */
export function renderForgotPasswordPage() {
  const content = `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <h1 class="text-4xl font-display font-bold text-brand mb-2">Kalos</h1>
          <h2 class="text-2xl font-bold text-navy">Recuperar Contraseña</h2>
          <p class="mt-2 text-sm text-gray-600">
            ¿Recordaste tu contraseña? 
            <a href="/auth/login" data-router-link class="font-medium text-brand hover:text-brand-hover">
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <!-- Instructions -->
          <div class="mb-6">
            <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form id="forgotPasswordForm" class="space-y-6" novalidate>
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email registrado
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

            <!-- Error Message -->
            <div id="forgotPasswordError" class="hidden">
              <div class="bg-red-50 border border-red-200 rounded-md p-4">
                <div class="text-sm text-red-600" id="forgotPasswordErrorMessage"></div>
              </div>
            </div>

            <!-- Success Message -->
            <div id="forgotPasswordSuccess" class="hidden">
              <div class="bg-green-50 border border-green-200 rounded-md p-4">
                <div class="text-sm text-green-600" id="forgotPasswordSuccessMessage"></div>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                id="forgotPasswordButton"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span id="forgotPasswordButtonText">Enviar Email de Recuperación</span>
                <div id="forgotPasswordButtonSpinner" class="hidden ml-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              </button>
            </div>

            <!-- Back to Login -->
            <div class="text-center">
              <button
                type="button"
                data-router-link
                href="/auth/login"
                class="text-sm text-gray-600 hover:text-gray-900"
                id="backToLogin"
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          </form>

          <!-- Success State (Hidden initially) -->
          <div id="successState" class="hidden space-y-6">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Email Enviado</h3>
              <p class="mt-2 text-sm text-gray-600">
                Hemos enviado las instrucciones de recuperación a tu email.
              </p>
              <p class="mt-1 text-xs text-gray-500">
                Si no lo encuentras, revisa tu carpeta de spam.
              </p>
            </div>

            <div class="space-y-3">
              <button
                type="button"
                id="resendEmail"
                class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span id="resendEmailText">Reenviar Email</span>
                <div id="resendEmailSpinner" class="hidden ml-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                </div>
              </button>

              <button
                type="button"
                data-router-link
                href="/auth/login"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand bg-brand-subtle hover:bg-brand-hover hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
              >
                Volver al Inicio de Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return renderWithLayout(content, {
    title: 'Recuperar Contraseña - Kalos',
    showHeader: false,
    showFooter: false
  });
}

/**
 * Initialize forgot password page functionality
 */
export function initializeForgotPasswordPage() {
  const form = document.getElementById('forgotPasswordForm');
  const emailInput = document.getElementById('email');
  const submitButton = document.getElementById('forgotPasswordButton');
  const buttonText = document.getElementById('forgotPasswordButtonText');
  const buttonSpinner = document.getElementById('forgotPasswordButtonSpinner');
  const successState = document.getElementById('successState');
  const resendButton = document.getElementById('resendEmail');
  const resendButtonText = document.getElementById('resendEmailText');
  const resendButtonSpinner = document.getElementById('resendEmailSpinner');
  
  let lastEmailSent = '';
  let resendCooldown = 0;

  if (!form || !emailInput || !submitButton) {
    console.error('Forgot password form elements not found');
    return;
  }

  // Clear any existing listeners
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  // Get new references after clone
  const finalForm = document.getElementById('forgotPasswordForm');
  const finalEmailInput = document.getElementById('email');
  const finalSubmitButton = document.getElementById('forgotPasswordButton');
  const finalButtonText = document.getElementById('forgotPasswordButtonText');
  const finalButtonSpinner = document.getElementById('forgotPasswordButtonSpinner');
  const finalSuccessState = document.getElementById('successState');
  const finalResendButton = document.getElementById('resendEmail');
  const finalResendButtonText = document.getElementById('resendEmailText');
  const finalResendButtonSpinner = document.getElementById('resendEmailSpinner');

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
    const errorDiv = document.getElementById('forgotPasswordError');
    const successDiv = document.getElementById('forgotPasswordSuccess');
    const errorMessage = document.getElementById('forgotPasswordErrorMessage');
    const successMessage = document.getElementById('forgotPasswordSuccessMessage');

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
        finalButtonText.textContent = 'Enviando...';
        finalButtonSpinner.classList.remove('hidden');
      } else {
        finalButtonText.textContent = 'Enviar Email de Recuperación';
        finalButtonSpinner.classList.add('hidden');
      }
    }
  }

  function setResendLoading(loading) {
    if (finalResendButton && finalResendButtonText && finalResendButtonSpinner) {
      finalResendButton.disabled = loading || resendCooldown > 0;
      
      if (loading) {
        finalResendButtonText.textContent = 'Enviando...';
        finalResendButtonSpinner.classList.remove('hidden');
      } else if (resendCooldown > 0) {
        finalResendButtonText.textContent = `Reenviar en ${resendCooldown}s`;
        finalResendButtonSpinner.classList.add('hidden');
      } else {
        finalResendButtonText.textContent = 'Reenviar Email';
        finalResendButtonSpinner.classList.add('hidden');
      }
    }
  }

  function startResendCooldown() {
    resendCooldown = 30; // 30 seconds cooldown
    const interval = setInterval(() => {
      resendCooldown--;
      setResendLoading(false);
      
      if (resendCooldown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  function showSuccessState(email) {
    if (finalForm && finalSuccessState) {
      finalForm.classList.add('hidden');
      finalSuccessState.classList.remove('hidden');
      lastEmailSent = email;
      startResendCooldown();
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

  // Handle password reset
  async function handlePasswordReset(email) {
    try {
      const result = await authService.resetPassword(email);
      
      if (result.success) {
        showSuccessState(email);
      } else {
        showMessage('error', result.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      showMessage('error', 'Error inesperado. Por favor intenta nuevamente.');
      setLoading(false);
    }
  }

  // Form submission
  if (finalForm) {
    finalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous errors
      hideFieldError('email');
      showMessage('', '');

      const email = finalEmailInput.value.trim();

      // Validation
      if (!email) {
        showFieldError('email', 'El email es requerido');
        return;
      }

      if (!validateEmail(email)) {
        showFieldError('email', 'Por favor ingresa un email válido');
        return;
      }

      setLoading(true);
      await handlePasswordReset(email);
    });
  }

  // Resend email functionality
  if (finalResendButton) {
    finalResendButton.addEventListener('click', async () => {
      if (resendCooldown > 0 || !lastEmailSent) return;

      setResendLoading(true);
      await handlePasswordReset(lastEmailSent);
      setResendLoading(false);
    });
  }

  // Back to login button
  const backToLoginButton = document.getElementById('backToLogin');
  if (backToLoginButton) {
    backToLoginButton.addEventListener('click', () => {
      navigateTo('/auth/login');
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