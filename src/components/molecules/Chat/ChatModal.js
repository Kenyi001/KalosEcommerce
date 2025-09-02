/**
 * Chat Modal Component - Kalos Design System
 * Modal de mensajería temporal con Firebase
 */

import { BaseComponent } from '../../BaseComponent.js';
import { renderIcon } from '../../atoms/Icon/Icon.js';
import { messagingService } from '../../../services/messaging.js';
import { authService } from '../../../services/auth.js';

export class ChatModal extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      professionalId: '',
      professionalName: 'Profesional',
      professionalAvatar: '',
      isOpen: false,
      onClose: null,
      ...props
    };

    this.state = {
      messages: [],
      newMessage: '',
      loading: false,
      conversationId: null,
      isTyping: false
    };

    this.messageListener = null;
    this.typingTimeout = null;
  }

  render() {
    if (!this.props.isOpen) return '';

    const { professionalName, professionalAvatar } = this.props;
    const { messages, loading } = this.state;

    return `
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-component="chat-modal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-brand to-navy p-4 flex items-center justify-between text-white">
            <div class="flex items-center gap-3">
              <img 
                src="${professionalAvatar || '/images/placeholder-avatar.jpg'}" 
                alt="${professionalName}"
                class="w-10 h-10 rounded-full object-cover border-2 border-white/30"
              />
              <div>
                <h3 class="font-semibold">${professionalName}</h3>
                <div class="flex items-center gap-1 text-white/80 text-sm">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>En línea</span>
                </div>
              </div>
            </div>
            <button 
              class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              id="close-chat-btn"
              aria-label="Cerrar chat"
            >
              ${renderIcon('x', { size: '20' })}
            </button>
          </div>

          <!-- Messages Container -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3" id="messages-container">
            ${loading ? this.renderLoadingSkeleton() : this.renderMessages()}
          </div>

          <!-- Auto-delete Notice -->
          <div class="px-4 py-2 bg-amber-50 border-t border-amber-100">
            <div class="flex items-center gap-2 text-amber-700 text-xs">
              ${renderIcon('clock', { size: '14' })}
              <span>Los mensajes se eliminan automáticamente después de 8 días</span>
            </div>
          </div>

          <!-- Message Input -->
          <div class="p-4 border-t border-gray-100 bg-gray-50">
            <div class="flex gap-3">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                class="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                id="message-input"
                maxlength="500"
              />
              <button
                class="w-12 h-12 bg-brand hover:bg-brand-hover text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                id="send-message-btn"
                aria-label="Enviar mensaje"
              >
                ${renderIcon('send', { size: '20' })}
              </button>
            </div>
            <div class="text-xs text-gray-500 mt-2 text-center">
              Presiona Enter para enviar
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMessages() {
    if (this.state.messages.length === 0) {
      return `
        <div class="text-center text-gray-500 mt-8">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            ${renderIcon('message-circle', { size: '32' })}
          </div>
          <p class="font-medium">¡Inicia la conversación!</p>
          <p class="text-sm mt-1">Envía un mensaje para comenzar a chatear</p>
        </div>
      `;
    }

    return this.state.messages.map(message => {
      const isOwn = message.senderId === authService.getCurrentUser()?.uid;
      const time = this.formatTime(message.timestamp);
      
      return `
        <div class="flex ${isOwn ? 'justify-end' : 'justify-start'}">
          <div class="max-w-xs lg:max-w-md">
            <div class="${isOwn 
              ? 'bg-brand text-white' 
              : 'bg-gray-100 text-gray-900'
            } rounded-2xl px-4 py-2 ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'}">
              <p class="text-sm">${this.escapeHtml(message.message)}</p>
            </div>
            <div class="text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}">
              ${time} ${message.read ? '' : '•'}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderLoadingSkeleton() {
    return `
      <div class="space-y-3">
        ${Array.from({ length: 3 }, (_, i) => `
          <div class="flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}">
            <div class="max-w-xs">
              <div class="h-8 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div class="h-3 w-12 bg-gray-200 rounded mt-1 animate-pulse"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.initializeChat();
    this.bindEvents();
  }

  async initializeChat() {
    try {
      this.setState({ loading: true });

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        console.error('❌ Usuario no autenticado');
        return;
      }

      // Crear o obtener conversación
      const conversationId = await messagingService.getOrCreateConversation(
        this.props.professionalId,
        currentUser.uid
      );

      this.setState({ conversationId });

      // Escuchar mensajes en tiempo real
      this.messageListener = messagingService.getConversationMessages(
        conversationId,
        (messages) => {
          this.setState({ 
            messages,
            loading: false 
          });
          this.scrollToBottom();
          
          // Marcar mensajes como leídos
          messagingService.markMessagesAsRead(conversationId, 'customer');
        }
      );

    } catch (error) {
      console.error('❌ Error initializing chat:', error);
      this.setState({ loading: false });
    }
  }

  bindEvents() {
    const messageInput = this.element?.querySelector('#message-input');
    const sendBtn = this.element?.querySelector('#send-message-btn');
    const closeBtn = this.element?.querySelector('#close-chat-btn');

    // Enviar mensaje
    const sendMessage = async () => {
      const message = messageInput?.value?.trim();
      if (!message || !this.state.conversationId) return;

      try {
        sendBtn.disabled = true;
        messageInput.value = '';
        
        await messagingService.sendMessage(
          this.state.conversationId,
          message,
          'professional'
        );
        
      } catch (error) {
        console.error('❌ Error sending message:', error);
        messageInput.value = message; // Restaurar mensaje en caso de error
      } finally {
        sendBtn.disabled = false;
        messageInput.focus();
      }
    };

    // Event listeners
    if (sendBtn) {
      this.addEventListener(sendBtn, 'click', sendMessage);
    }

    if (messageInput) {
      this.addEventListener(messageInput, 'keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage();
        }
      });

      // Auto-focus al abrir
      setTimeout(() => messageInput.focus(), 100);
    }

    if (closeBtn) {
      this.addEventListener(closeBtn, 'click', () => {
        this.close();
      });
    }

    // Cerrar con clic en backdrop
    this.addEventListener(this.element, 'click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });

    // Cerrar con Escape
    this.addEventListener(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.props.isOpen) {
        this.close();
      }
    });
  }

  close() {
    if (this.messageListener) {
      this.messageListener();
      this.messageListener = null;
    }

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  scrollToBottom() {
    const container = this.element?.querySelector('#messages-container');
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 100);
    }
  }

  formatTime(date) {
    if (!date) return '';
    
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return messageDate.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  cleanup() {
    if (this.messageListener) {
      this.messageListener();
      this.messageListener = null;
    }
    
    // Cleanup parent class if it exists
    if (super.cleanup) {
      super.cleanup();
    }
  }
}
