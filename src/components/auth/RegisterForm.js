// Register form component
import { Input } from '../ui/Input.js';
import { Button } from '../ui/Button.js';
import { Card, CardHeader } from '../ui/Card.js';
import { authService } from '../../services/auth.js';

export class RegisterForm {
  constructor(config = {}) {
    this.config = {
      onSuccess: config.onSuccess || (() => {}),
      onError: config.onError || (() => {}),
      onSwitchToLogin: config.onSwitchToLogin || (() => {}),
      className: config.className || '',
      ...config
    };

    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'client', // client or professional
      phone: '',
      acceptTerms: false,
      errors: {},
      loading: false
    };

    this.elements = {};
  }

  validateForm() {
    const errors = {};

    // Name validation
    if (!this.state.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (this.state.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Email validation
    if (!this.state.email) {
      errors.email = 'El email es requerido';
    } else if (!this.isValidEmail(this.state.email)) {
      errors.email = 'Ingresa un email válido';
    }

    // Password validation
    if (!this.state.password) {
      errors.password = 'La contraseña es requerida';
    } else if (this.state.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Confirm password validation
    if (!this.state.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (this.state.password !== this.state.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Phone validation (optional but if provided should be valid)
    if (this.state.phone && !this.isValidPhone(this.state.phone)) {
      errors.phone = 'Ingresa un número de teléfono válido';
    }

    // Terms acceptance
    if (!this.state.acceptTerms) {
      errors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    this.state.errors = errors;
    return Object.keys(errors).length === 0;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    // Bolivia phone number validation (basic)
    const phoneRegex = /^(\+591|591)?\s?[67]\d{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      this.updateErrors();
      return;
    }

    this.setState({ loading: true });
    this.updateSubmitButton();

    try {
      const userData = {
        name: this.state.name.trim(),
        email: this.state.email,
        password: this.state.password,
        userType: this.state.userType,
        phone: this.state.phone
      };

      const result = await authService.register(userData);
      
      if (result.success) {
        this.config.onSuccess(result);
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.config.onError(error.message || 'Error al crear la cuenta');
      this.setState({ loading: false });
      this.updateSubmitButton();
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  updateErrors() {
    Object.keys(this.elements).forEach(key => {
      if (this.elements[key] && typeof this.elements[key].setError === 'function') {
        this.elements[key].setError(this.state.errors[key] || '');
      }
    });

    // Special handling for terms checkbox error
    if (this.state.errors.acceptTerms && this.elements.termsError) {
      this.elements.termsError.textContent = this.state.errors.acceptTerms;
      this.elements.termsError.classList.remove('hidden');
    } else if (this.elements.termsError) {
      this.elements.termsError.classList.add('hidden');
    }
  }

  updateSubmitButton() {
    if (this.elements.submitButton) {
      const button = this.elements.submitButton.querySelector('button');
      if (button) {
        button.disabled = this.state.loading;
        if (this.state.loading) {
          button.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creando cuenta...
          `;
        } else {
          button.textContent = 'Crear Cuenta';
        }
      }
    }
  }

  render() {
    const container = document.createElement('div');
    container.className = `w-full max-w-md mx-auto ${this.config.className}`.trim();

    // Create card
    const card = Card.create({
      padding: 'lg',
      shadow: 'medium',
      className: 'w-full'
    });

    // Card header
    const header = CardHeader.create({
      title: 'Crear Cuenta',
      subtitle: 'Únete a la comunidad de Kalos'
    });
    card.appendChild(header);

    // Create form
    const form = document.createElement('form');
    form.className = 'space-y-4';

    // User type selection
    const userTypeContainer = document.createElement('div');
    userTypeContainer.className = 'space-y-2';
    userTypeContainer.innerHTML = `
      <label class="block text-sm font-semibold text-navy-900 font-inter">
        ¿Cómo quieres usar Kalos? <span class="text-error">*</span>
      </label>
      <div class="grid grid-cols-2 gap-3">
        <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors user-type-option" data-type="client">
          <input type="radio" name="userType" value="client" class="sr-only user-type-radio" checked>
          <div class="flex flex-col items-center text-center w-full">
            <div class="w-8 h-8 mb-2 text-brand">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span class="text-sm font-medium">Cliente</span>
            <span class="text-xs text-gray-500 mt-1">Reservar servicios</span>
          </div>
        </label>
        <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors user-type-option" data-type="professional">
          <input type="radio" name="userType" value="professional" class="sr-only user-type-radio">
          <div class="flex flex-col items-center text-center w-full">
            <div class="w-8 h-8 mb-2 text-brand">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span class="text-sm font-medium">Profesional</span>
            <span class="text-xs text-gray-500 mt-1">Ofrecer servicios</span>
          </div>
        </label>
      </div>
    `;

    // Handle user type selection
    const userTypeOptions = userTypeContainer.querySelectorAll('.user-type-option');
    userTypeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const type = option.dataset.type;
        this.setState({ userType: type });
        
        // Update UI
        userTypeOptions.forEach(opt => opt.classList.remove('border-brand', 'bg-brand-subtle'));
        option.classList.add('border-brand', 'bg-brand-subtle');
        
        // Update radio button
        const radio = option.querySelector('.user-type-radio');
        radio.checked = true;
      });
    });

    form.appendChild(userTypeContainer);

    // Name input
    const nameInput = new Input({
      type: 'text',
      label: 'Nombre completo',
      placeholder: 'Tu nombre completo',
      required: true,
      value: this.state.name,
      onInput: (value) => {
        this.setState({ name: value });
        if (this.state.errors.name) {
          this.setState({ errors: { ...this.state.errors, name: '' } });
          this.updateErrors();
        }
      }
    });
    this.elements.nameInput = nameInput;
    form.appendChild(nameInput.render());

    // Email input
    const emailInput = new Input({
      type: 'email',
      label: 'Email',
      placeholder: 'tu@email.com',
      required: true,
      value: this.state.email,
      onInput: (value) => {
        this.setState({ email: value });
        if (this.state.errors.email) {
          this.setState({ errors: { ...this.state.errors, email: '' } });
          this.updateErrors();
        }
      }
    });
    this.elements.emailInput = emailInput;
    form.appendChild(emailInput.render());

    // Phone input (optional)
    const phoneInput = new Input({
      type: 'tel',
      label: 'Teléfono (opcional)',
      placeholder: '+591 70000000',
      value: this.state.phone,
      onInput: (value) => {
        this.setState({ phone: value });
        if (this.state.errors.phone) {
          this.setState({ errors: { ...this.state.errors, phone: '' } });
          this.updateErrors();
        }
      }
    });
    this.elements.phoneInput = phoneInput;
    form.appendChild(phoneInput.render());

    // Password inputs container
    const passwordContainer = document.createElement('div');
    passwordContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

    // Password input
    const passwordInput = new Input({
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Mín. 6 caracteres',
      required: true,
      value: this.state.password,
      onInput: (value) => {
        this.setState({ password: value });
        if (this.state.errors.password) {
          this.setState({ errors: { ...this.state.errors, password: '' } });
          this.updateErrors();
        }
      }
    });
    this.elements.passwordInput = passwordInput;
    passwordContainer.appendChild(passwordInput.render());

    // Confirm password input
    const confirmPasswordInput = new Input({
      type: 'password',
      label: 'Confirmar contraseña',
      placeholder: 'Repite tu contraseña',
      required: true,
      value: this.state.confirmPassword,
      onInput: (value) => {
        this.setState({ confirmPassword: value });
        if (this.state.errors.confirmPassword) {
          this.setState({ errors: { ...this.state.errors, confirmPassword: '' } });
          this.updateErrors();
        }
      }
    });
    this.elements.confirmPasswordInput = confirmPasswordInput;
    passwordContainer.appendChild(confirmPasswordInput.render());

    form.appendChild(passwordContainer);

    // Terms and conditions
    const termsContainer = document.createElement('div');
    termsContainer.className = 'space-y-2';
    termsContainer.innerHTML = `
      <div class="flex items-start space-x-2">
        <input 
          type="checkbox" 
          id="acceptTerms" 
          class="mt-1 h-4 w-4 text-brand border-gray-300 rounded focus:ring-brand focus:ring-2 terms-checkbox"
        >
        <label for="acceptTerms" class="text-sm text-gray-600 font-inter">
          Acepto los 
          <a href="/legal/terminos" class="text-brand hover:text-brand-hover underline">términos y condiciones</a>
          y la 
          <a href="/legal/privacidad" class="text-brand hover:text-brand-hover underline">política de privacidad</a>
        </label>
      </div>
      <p class="text-sm text-error font-inter hidden terms-error"></p>
    `;

    const termsCheckbox = termsContainer.querySelector('.terms-checkbox');
    this.elements.termsError = termsContainer.querySelector('.terms-error');
    
    termsCheckbox.addEventListener('change', (e) => {
      this.setState({ acceptTerms: e.target.checked });
      if (this.state.errors.acceptTerms) {
        this.setState({ errors: { ...this.state.errors, acceptTerms: '' } });
        this.updateErrors();
      }
    });

    form.appendChild(termsContainer);

    // Submit button
    const submitButton = Button.create({
      text: 'Crear Cuenta',
      type: 'submit',
      variant: 'primary',
      size: 'lg',
      fullWidth: true,
      loading: this.state.loading
    });
    this.elements.submitButton = submitButton.parentElement || submitButton;
    form.appendChild(submitButton);

    // Switch to login
    const switchToLogin = document.createElement('div');
    switchToLogin.className = 'text-center mt-6 pt-4 border-t border-gray-200';
    switchToLogin.innerHTML = `
      <p class="text-sm text-gray-600 font-inter">
        ¿Ya tienes cuenta? 
        <button type="button" class="text-brand hover:text-brand-hover font-semibold transition-colors switch-login">
          Inicia sesión aquí
        </button>
      </p>
    `;
    
    const loginButton = switchToLogin.querySelector('.switch-login');
    loginButton.addEventListener('click', () => {
      this.config.onSwitchToLogin();
    });
    
    form.appendChild(switchToLogin);

    // Form submit handler
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    card.appendChild(form);
    container.appendChild(card);

    return container;
  }

  // Static method
  static create(config) {
    const registerForm = new RegisterForm(config);
    return registerForm.render();
  }
}

export default RegisterForm;