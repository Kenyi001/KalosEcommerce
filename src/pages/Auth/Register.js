/**
 * Registration Page for Kalos E-commerce
 * Handles user registration for customers and professionals
 */

import { renderWithLayout } from '../../components/Layout.js';
import { authService } from '../../services/auth.js';
import { navigateTo } from '../../utils/router.js';

/**
 * Render registration page
 * @returns {string} HTML content
 */
export function renderRegisterPage() {
  const content = `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <h1 class="text-4xl font-display font-bold text-brand mb-2">Kalos</h1>
          <h2 class="text-2xl font-bold text-navy">Crear Cuenta</h2>
          <p class="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta? 
            <a href="/auth/login" data-router-link class="font-medium text-brand hover:text-brand-hover">
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form id="registerForm" class="space-y-6" novalidate>
            <!-- Role Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Tipo de cuenta
              </label>
              <div class="mt-1 grid grid-cols-2 gap-3">
                <div>
                  <input
                    id="roleCustomer"
                    name="role"
                    type="radio"
                    value="customer"
                    checked
                    class="sr-only"
                  />
                  <label
                    for="roleCustomer"
                    class="role-option cursor-pointer border border-gray-300 rounded-md p-3 flex items-center justify-center text-sm font-medium uppercase tracking-wide focus:outline-none"
                  >
                    <span>👤 Cliente</span>
                  </label>
                </div>
                <div>
                  <input
                    id="roleProfessional"
                    name="role"
                    type="radio"
                    value="professional"
                    class="sr-only"
                  />
                  <label
                    for="roleProfessional"
                    class="role-option cursor-pointer border border-gray-300 rounded-md p-3 flex items-center justify-center text-sm font-medium uppercase tracking-wide focus:outline-none"
                  >
                    <span>✨ Profesional</span>
                  </label>
                </div>
              </div>
              <div id="roleError" class="hidden mt-2 text-sm text-red-600"></div>
            </div>

            <!-- Full Name -->
            <div>
              <label for="displayName" class="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <div class="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autocomplete="name"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                  placeholder="Tu nombre completo"
                />
                <div id="displayNameError" class="hidden mt-2 text-sm text-red-600"></div>
              </div>
            </div>

            <!-- Email -->
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

            <!-- Phone (Optional) -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Teléfono <span class="text-gray-400 text-xs">(opcional)</span>
              </label>
              <div class="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autocomplete="tel"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                  placeholder="+591 12345678"
                />
                <div id="phoneError" class="hidden mt-2 text-sm text-red-600"></div>
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                  placeholder="Mínimo 6 caracteres"
                />
                <div id="passwordError" class="hidden mt-2 text-sm text-red-600"></div>
                <p class="mt-1 text-xs text-gray-500">
                  Mínimo 6 caracteres
                </p>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <div class="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                  placeholder="Repite tu contraseña"
                />
                <div id="confirmPasswordError" class="hidden mt-2 text-sm text-red-600"></div>
              </div>
            </div>

            <!-- Terms & Privacy -->
            <div>
              <div class="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  class="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded mt-1"
                  required
                />
                <label for="terms" class="ml-2 block text-sm text-gray-900">
                  Acepto los 
                  <a href="/legal/terminos" data-router-link class="text-brand hover:text-brand-hover">
                    términos y condiciones
                  </a>
                  y la 
                  <a href="/legal/privacidad" data-router-link class="text-brand hover:text-brand-hover">
                    política de privacidad
                  </a>
                </label>
              </div>
              <div id="termsError" class="hidden mt-2 text-sm text-red-600"></div>
            </div>

            <!-- Error Message -->
            <div id="registerError" class="hidden">
              <div class="bg-red-50 border border-red-200 rounded-md p-4">
                <div class="text-sm text-red-600" id="registerErrorMessage"></div>
              </div>
            </div>

            <!-- Success Message -->
            <div id="registerSuccess" class="hidden">
              <div class="bg-green-50 border border-green-200 rounded-md p-4">
                <div class="text-sm text-green-600" id="registerSuccessMessage"></div>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                id="registerButton"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span id="registerButtonText">Crear Cuenta</span>
                <div id="registerButtonSpinner" class="hidden ml-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  return renderWithLayout(content, {
    title: 'Crear Cuenta - Kalos',
    showHeader: false,
    showFooter: false
  });
}

/**
 * Initialize registration page functionality
 */
export function initializeRegisterPage() {
  const form = document.getElementById('registerForm');
  const roleInputs = document.querySelectorAll('input[name="role"]');
  const roleOptions = document.querySelectorAll('.role-option');
  const submitButton = document.getElementById('registerButton');
  const buttonText = document.getElementById('registerButtonText');
  const buttonSpinner = document.getElementById('registerButtonSpinner');

  if (!form || !submitButton) {
    console.error('Register form elements not found');
    return;
  }

  // Clear any existing listeners
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  // Get new references after clone
  const finalForm = document.getElementById('registerForm');
  const finalRoleInputs = document.querySelectorAll('input[name="role"]');
  const finalRoleOptions = document.querySelectorAll('.role-option');
  const finalSubmitButton = document.getElementById('registerButton');
  const finalButtonText = document.getElementById('registerButtonText');
  const finalButtonSpinner = document.getElementById('registerButtonSpinner');

  // Form validation functions
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    if (!phone) return true; // Optional field
    return /^[\+]?[0-9\s\-\(\)]+$/.test(phone.trim());
  }

  function showFieldError(fieldId, message) {
    const errorDiv = document.getElementById(`${fieldId}Error`);
    const input = document.getElementById(fieldId);
    
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
    }
    if (input) {
      input.classList.add('border-red-500');
    }
  }

  function hideFieldError(fieldId) {
    const errorDiv = document.getElementById(`${fieldId}Error`);
    const input = document.getElementById(fieldId);
    
    if (errorDiv) {
      errorDiv.classList.add('hidden');
    }
    if (input) {
      input.classList.remove('border-red-500');
    }
  }

  function showMessage(type, message) {
    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');
    const errorMessage = document.getElementById('registerErrorMessage');
    const successMessage = document.getElementById('registerSuccessMessage');

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
        finalButtonText.textContent = 'Creando cuenta...';
        finalButtonSpinner.classList.remove('hidden');
      } else {
        finalButtonText.textContent = 'Crear Cuenta';
        finalButtonSpinner.classList.add('hidden');
      }
    }
  }

  // Role selection handling
  function updateRoleSelection() {
    finalRoleOptions.forEach((option, index) => {
      const input = finalRoleInputs[index];
      if (input && input.checked) {
        option.classList.add('bg-brand', 'text-white', 'border-brand');
        option.classList.remove('bg-white', 'text-gray-900', 'border-gray-300');
      } else {
        option.classList.remove('bg-brand', 'text-white', 'border-brand');
        option.classList.add('bg-white', 'text-gray-900', 'border-gray-300');
      }
    });
  }

  finalRoleOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
      const input = finalRoleInputs[index];
      if (input) {
        input.checked = true;
        updateRoleSelection();
        hideFieldError('role');
      }
    });
  });

  // Initialize role selection
  updateRoleSelection();

  // Real-time validation
  const fields = ['displayName', 'email', 'phone', 'password', 'confirmPassword'];
  fields.forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener('blur', () => validateField(fieldId));
      input.addEventListener('input', () => hideFieldError(fieldId));
    }
  });

  function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return true;

    const value = input.value.trim();

    switch (fieldId) {
      case 'displayName':
        if (!value) {
          showFieldError(fieldId, 'El nombre es requerido');
          return false;
        }
        if (value.length < 2) {
          showFieldError(fieldId, 'El nombre debe tener al menos 2 caracteres');
          return false;
        }
        break;

      case 'email':
        if (!value) {
          showFieldError(fieldId, 'El email es requerido');
          return false;
        }
        if (!validateEmail(value)) {
          showFieldError(fieldId, 'Por favor ingresa un email válido');
          return false;
        }
        break;

      case 'phone':
        if (value && !validatePhone(value)) {
          showFieldError(fieldId, 'Por favor ingresa un teléfono válido');
          return false;
        }
        break;

      case 'password':
        if (!value) {
          showFieldError(fieldId, 'La contraseña es requerida');
          return false;
        }
        if (value.length < 6) {
          showFieldError(fieldId, 'La contraseña debe tener al menos 6 caracteres');
          return false;
        }
        // Also validate confirm password if it has a value
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput && confirmPasswordInput.value) {
          validateField('confirmPassword');
        }
        break;

      case 'confirmPassword':
        if (!value) {
          showFieldError(fieldId, 'Confirma tu contraseña');
          return false;
        }
        const passwordInput = document.getElementById('password');
        if (passwordInput && value !== passwordInput.value) {
          showFieldError(fieldId, 'Las contraseñas no coinciden');
          return false;
        }
        break;
    }

    hideFieldError(fieldId);
    return true;
  }

  // Terms checkbox validation
  const termsCheckbox = document.getElementById('terms');
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      hideFieldError('terms');
    });
  }

  // Form submission
  if (finalForm) {
    finalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous errors
      fields.forEach(field => hideFieldError(field));
      hideFieldError('role');
      hideFieldError('terms');
      showMessage('', '');

      // Get form data
      const formData = new FormData(finalForm);
      const data = {
        role: formData.get('role'),
        displayName: formData.get('displayName')?.trim(),
        email: formData.get('email')?.trim(),
        phone: formData.get('phone')?.trim(),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        terms: formData.has('terms')
      };

      // Validation
      let hasErrors = false;

      if (!data.role) {
        showFieldError('role', 'Selecciona un tipo de cuenta');
        hasErrors = true;
      }

      fields.forEach(field => {
        if (!validateField(field)) {
          hasErrors = true;
        }
      });

      if (!data.terms) {
        showFieldError('terms', 'Debes aceptar los términos y condiciones');
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }

      // Attempt registration
      setLoading(true);

      try {
        const result = await authService.register({
          email: data.email,
          password: data.password,
          displayName: data.displayName,
          role: data.role,
          phone: data.phone || undefined
        });

        if (result.success) {
          showMessage('success', result.message);
          
          // Redirect after success
          setTimeout(() => {
            if (data.role === 'professional') {
              navigateTo('/pro/dashboard');
            } else {
              navigateTo('/cuenta');
            }
          }, 2000);
        } else {
          showMessage('error', result.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Registration error:', error);
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

  // Focus on first input
  const firstInput = document.getElementById('displayName');
  if (firstInput) {
    firstInput.focus();
  }
}