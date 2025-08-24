// Authentication page component
import { LoginForm } from '../../components/auth/LoginForm.js';
import { RegisterForm } from '../../components/auth/RegisterForm.js';

export class AuthPage {
  constructor(config = {}) {
    this.config = {
      initialMode: config.initialMode || 'login', // 'login' or 'register'
      onSuccess: config.onSuccess || (() => {}),
      className: config.className || '',
      ...config
    };

    this.state = {
      currentMode: this.config.initialMode,
      error: '',
      success: ''
    };
  }

  showError(message) {
    this.state.error = message;
    this.updateMessages();
  }

  showSuccess(message) {
    this.state.success = message;
    this.state.error = '';
    this.updateMessages();
  }

  clearMessages() {
    this.state.error = '';
    this.state.success = '';
    this.updateMessages();
  }

  updateMessages() {
    if (this.elements && this.elements.messageContainer) {
      const container = this.elements.messageContainer;
      container.innerHTML = '';

      if (this.state.error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mb-4 p-4 bg-error/10 border border-error/20 text-error rounded-lg text-center';
        errorDiv.innerHTML = `
          <div class="flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span class="font-inter text-sm">${this.state.error}</span>
          </div>
        `;
        container.appendChild(errorDiv);
      }

      if (this.state.success) {
        const successDiv = document.createElement('div');
        successDiv.className = 'mb-4 p-4 bg-success/10 border border-success/20 text-success rounded-lg text-center';
        successDiv.innerHTML = `
          <div class="flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span class="font-inter text-sm">${this.state.success}</span>
          </div>
        `;
        container.appendChild(successDiv);
      }
    }
  }

  switchMode(mode) {
    this.state.currentMode = mode;
    this.clearMessages();
    this.renderContent();
  }

  renderContent() {
    if (!this.elements || !this.elements.contentContainer) return;

    const container = this.elements.contentContainer;
    container.innerHTML = '';

    if (this.state.currentMode === 'login') {
      const loginForm = new LoginForm({
        onSuccess: (result) => {
          this.showSuccess('¡Bienvenido de vuelta!');
          setTimeout(() => {
            this.config.onSuccess(result);
          }, 1000);
        },
        onError: (error) => {
          this.showError(error);
        },
        onSwitchToRegister: () => {
          this.switchMode('register');
        }
      });
      container.appendChild(loginForm.render());
    } else {
      const registerForm = new RegisterForm({
        onSuccess: (result) => {
          this.showSuccess('¡Cuenta creada exitosamente! Por favor verifica tu email.');
          setTimeout(() => {
            this.config.onSuccess(result);
          }, 2000);
        },
        onError: (error) => {
          this.showError(error);
        },
        onSwitchToLogin: () => {
          this.switchMode('login');
        }
      });
      container.appendChild(registerForm.render());
    }
  }

  render() {
    const container = document.createElement('div');
    container.className = `min-h-screen bg-gradient-to-br from-brand-subtle to-beige flex items-center justify-center p-4 ${this.config.className}`.trim();

    // Main content
    const mainContent = document.createElement('div');
    mainContent.className = 'w-full max-w-md mx-auto';

    // Header with logo
    const header = document.createElement('div');
    header.className = 'text-center mb-8';
    header.innerHTML = `
      <div class="mb-4">
        <h1 class="text-3xl font-fraunces font-bold text-navy-900 mb-2">Kalos</h1>
        <p class="text-navy-600 font-inter">Servicios de belleza a domicilio</p>
      </div>
    `;
    mainContent.appendChild(header);

    // Message container
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    mainContent.appendChild(messageContainer);

    // Content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'content-container';
    mainContent.appendChild(contentContainer);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'text-center mt-8 text-sm text-gray-600 font-inter';
    footer.innerHTML = `
      <p>&copy; 2025 Kalos. Todos los derechos reservados.</p>
    `;
    mainContent.appendChild(footer);

    container.appendChild(mainContent);

    // Store elements for later reference
    this.elements = {
      container,
      messageContainer,
      contentContainer
    };

    // Initial render
    this.renderContent();

    return container;
  }

  // Static method
  static create(config) {
    const authPage = new AuthPage(config);
    return authPage.render();
  }
}

export default AuthPage;