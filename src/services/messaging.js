/**
 * Kalos Messaging Service - Firebase Implementation
 * Sistema temporal de mensajería (8 días de retención)
 */

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  deleteDoc,
  Timestamp,
  setDoc,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase-config.js';
import { authService } from './auth.js';

class MessagingService {
  constructor() {
    this.messagesCollection = 'kalos_messages';
    this.conversationsCollection = 'kalos_conversations';
    this.MESSAGE_RETENTION_DAYS = 8;
    this.listeners = new Map(); // Para manejar listeners activos
    
    // Auto-cleanup al inicializar
    this.scheduleCleanup();
  }

  /**
   * Crear nueva conversación o obtener existente
   */
  async getOrCreateConversation(professionalId, customerId) {
    try {
      const conversationId = this.generateConversationId(professionalId, customerId);
      
      // Buscar conversación existente
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      
      // Si no existe, crear nueva
      const conversationData = {
        id: conversationId,
        professionalId,
        customerId,
        lastMessageAt: serverTimestamp(),
        lastMessage: '',
        unreadCount: {
          professional: 0,
          customer: 0
        },
        participantNames: {
          professional: 'Profesional',
          customer: 'Cliente'
        },
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + (this.MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000)))
      };

      await updateDoc(conversationRef, conversationData).catch(async () => {
        // Si no existe, crear documento
        await setDoc(conversationRef, conversationData);
      });

      return conversationId;
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Enviar mensaje
   */
  async sendMessage(conversationId, message, recipientType = 'professional') {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      const messageData = {
        conversationId,
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        message: message.trim(),
        recipientType, // 'professional' | 'customer'
        timestamp: serverTimestamp(),
        read: false,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + (this.MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000)))
      };

      // Agregar mensaje
      const messageRef = await addDoc(collection(db, this.messagesCollection), messageData);

      // Actualizar conversación
      await this.updateConversationLastMessage(conversationId, message, recipientType);

      console.log('✅ Message sent:', messageRef.id);
      return messageRef.id;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      throw error;
    }
  }

  /**
   * Obtener mensajes de una conversación
   */
  getConversationMessages(conversationId, callback) {
    try {
      const messagesQuery = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));

        callback(messages);
      }, (error) => {
        console.error('❌ Error getting messages:', error);
        callback([]);
      });

      // Guardar listener para cleanup posterior
      this.listeners.set(conversationId, unsubscribe);
      
      return unsubscribe;
    } catch (error) {
      console.error('❌ Error setting up message listener:', error);
      callback([]);
      return () => {};
    }
  }

  /**
   * Marcar mensajes como leídos
   */
  async markMessagesAsRead(conversationId, userType) {
    try {
      const messagesQuery = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        where('recipientType', '==', userType),
        where('read', '==', false)
      );

      const snapshot = await getDocs(messagesQuery);
      const updatePromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );

      await Promise.all(updatePromises);
      console.log(`✅ Marked ${updatePromises.length} messages as read`);
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
    }
  }

  /**
   * Limpiar mensajes expirados
   */
  async cleanupExpiredMessages() {
    try {
      const now = new Date();
      
      // Limpiar mensajes expirados
      const messagesQuery = query(
        collection(db, this.messagesCollection),
        where('expiresAt', '<=', Timestamp.fromDate(now))
      );

      const messagesSnapshot = await getDocs(messagesQuery);
      const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Limpiar conversaciones expiradas
      const conversationsQuery = query(
        collection(db, this.conversationsCollection),
        where('expiresAt', '<=', Timestamp.fromDate(now))
      );

      const conversationsSnapshot = await getDocs(conversationsQuery);
      const deleteConvPromises = conversationsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteConvPromises);

      console.log(`🧹 Cleaned up ${deletePromises.length} expired messages and ${deleteConvPromises.length} conversations`);
    } catch (error) {
      console.error('❌ Error cleaning up expired messages:', error);
    }
  }

  /**
   * Programar limpieza automática
   */
  scheduleCleanup() {
    // Limpiar cada 24 horas
    setInterval(() => {
      this.cleanupExpiredMessages();
    }, 24 * 60 * 60 * 1000);

    // Limpiar al inicializar
    setTimeout(() => {
      this.cleanupExpiredMessages();
    }, 5000);
  }

  /**
   * Actualizar último mensaje de la conversación
   */
  async updateConversationLastMessage(conversationId, message, recipientType) {
    try {
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      
      await updateDoc(conversationRef, {
        lastMessage: message.substring(0, 100), // Truncar mensaje largo
        lastMessageAt: serverTimestamp()
      });
    } catch (error) {
      console.error('❌ Error updating conversation:', error);
    }
  }

  /**
   * Generar ID único para conversación
   */
  generateConversationId(professionalId, customerId) {
    // Crear ID consistente independiente del orden
    const ids = [professionalId, customerId].sort();
    return `conv_${ids[0]}_${ids[1]}`;
  }

  /**
   * Limpiar listeners activos
   */
  cleanup() {
    this.listeners.forEach((unsubscribe) => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.listeners.clear();
  }

  /**
   * Obtener conversaciones del usuario actual
   */
  getUserConversations(callback) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        callback([]);
        return () => {};
      }

      const conversationsQuery = query(
        collection(db, this.conversationsCollection),
        where('participants', 'array-contains', currentUser.uid),
        orderBy('lastMessageAt', 'desc')
      );

      const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
        const conversations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastMessageAt: doc.data().lastMessageAt?.toDate() || new Date()
        }));

        callback(conversations);
      }, (error) => {
        console.error('❌ Error getting conversations:', error);
        callback([]);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Error setting up conversations listener:', error);
      callback([]);
      return () => {};
    }
  }
}

// Singleton instance
export const messagingService = new MessagingService();

// Limpiar listeners al cerrar página
window.addEventListener('beforeunload', () => {
  messagingService.cleanup();
});
