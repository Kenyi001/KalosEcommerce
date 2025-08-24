// Login form component
import { Input } from '../ui/Input.js';
import { Button } from '../ui/Button.js';
import { Card, CardHeader } from '../ui/Card.js';
import { authService } from '../../services/auth.js';

export class LoginForm {
  constructor(config = {}) {
    this.config = {
      onSuccess: config.onSuccess || (() => {}),
      onError: config.onError || (() => {}),
      onSwitchToRegister: config.onSwitchToRegister || (() => {}),
      className: config.className || '',
      ...config
    };

    this.state = {
      email: '',
      password: '',
      errors: {},
      loading: false
    };

    this.elements = {};
  }

  validateForm() {
    const errors = {};

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

    this.state.errors = errors;
    return Object.keys(errors).length === 0;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
      const result = await authService.login(this.state.email, this.state.password);
      
      if (result.success) {
        this.config.onSuccess(result);
      }
    } catch (error) {
      console.error('Login error:', error);
      this.config.onError(error.message || 'Error al iniciar sesión');
      this.setState({ loading: false });
      this.updateSubmitButton();
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  updateErrors() {
    if (this.elements.emailInput) {
      this.elements.emailInput.setError(this.state.errors.email || '');
    }
    if (this.elements.passwordInput) {
      this.elements.passwordInput.setError(this.state.errors.password || '');
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
            Iniciando sesión...
          `;
        } else {
          button.textContent = 'Iniciar Sesión';
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
      title: 'Iniciar Sesión',
      subtitle: 'Ingresa a tu cuenta de Kalos'
    });
    card.appendChild(header);

    // Create form
    const form = document.createElement('form');
    form.className = 'space-y-4';

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

    // Password input
    const passwordInput = new Input({
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Tu contraseña',
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
    form.appendChild(passwordInput.render());

    // Submit button
    const submitButton = Button.create({
      text: 'Iniciar Sesión',
      type: 'submit',
      variant: 'primary',
      size: 'lg',
      fullWidth: true,
      loading: this.state.loading
    });
    this.elements.submitButton = submitButton.parentElement || submitButton;
    form.appendChild(submitButton);

    // Forgot password link
    const forgotLink = document.createElement('div');
    forgotLink.className = 'text-center mt-4';
    forgotLink.innerHTML = `
      <a href="#" class="text-sm text-brand hover:text-brand-hover font-inter transition-colors">
        ¿Olvidaste tu contraseña?
      </a>
    `;
    form.appendChild(forgotLink);

    // Switch to register
    const switchToRegister = document.createElement('div');
    switchToRegister.className = 'text-center mt-6 pt-4 border-t border-gray-200';
    switchToRegister.innerHTML = `
      <p class="text-sm text-gray-600 font-inter">
        ¿No tienes cuenta? 
        <button type="button" class="text-brand hover:text-brand-hover font-semibold transition-colors switch-register">
          Regístrate aquí
        </button>
      </p>
    `;
    
    const registerButton = switchToRegister.querySelector('.switch-register');
    registerButton.addEventListener('click', () => {
      this.config.onSwitchToRegister();
    });
    
    form.appendChild(switchToRegister);

    // Form submit handler
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    card.appendChild(form);
    container.appendChild(card);

    return container;
  }

  // Static method
  static create(config) {
    const loginForm = new LoginForm(config);
    return loginForm.render();
  }
}

export default LoginForm;