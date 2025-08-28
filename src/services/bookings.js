/**
 * Booking Service - Sistema de Reservas para Kalos E-commerce
 * Maneja creación, confirmación, cancelación y gestión de disponibilidad
 */

import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase-config.js';

export class BookingService {
  static collection = 'bookings';
  static availabilityCollection = 'availability';

  /**
   * Create a new booking
   */
  static async createBooking(bookingData) {
    try {
      console.log('📅 Creating booking:', bookingData);

      // 1. Validate availability
      const isAvailable = await this.checkAvailability(
        bookingData.professionalId,
        bookingData.scheduledDate,
        bookingData.scheduledTime,
        bookingData.service.totalDuration
      );

      if (!isAvailable) {
        throw new Error('Horario no disponible');
      }

      // 2. Lock time slot temporarily (5 minutes)
      await this.lockTimeSlot(
        bookingData.professionalId,
        bookingData.scheduledDate,
        bookingData.scheduledTime,
        bookingData.service.totalDuration
      );

      // 3. Calculate pricing
      const totalPrice = this.calculateTotalPrice(bookingData.service);
      const advancePayment = Math.round(totalPrice * 0.3); // 30% adelanto

      // 4. Create booking document
      const booking = {
        customerId: bookingData.customerId,
        professionalId: bookingData.professionalId,
        serviceId: bookingData.serviceId,
        
        // Scheduling
        scheduledDate: bookingData.scheduledDate,
        scheduledTime: bookingData.scheduledTime,
        duration: bookingData.service.totalDuration,
        endTime: this.calculateEndTime(bookingData.scheduledTime, bookingData.service.totalDuration),
        
        // Location
        location: {
          type: bookingData.location?.type || 'home',
          address: bookingData.location?.address || '',
          coordinates: bookingData.location?.coordinates || null,
          instructions: bookingData.location?.instructions || ''
        },
        
        // Service Details
        service: {
          name: bookingData.service.name,
          price: bookingData.service.price,
          addons: bookingData.service.addons || [],
          totalPrice: totalPrice,
          totalDuration: bookingData.service.totalDuration
        },
        
        // Status Management
        status: 'pending',
        statusHistory: [{
          status: 'pending',
          timestamp: new Date(),
          note: 'Reserva creada',
          actor: bookingData.customerId
        }],
        
        // Payment
        payment: {
          method: bookingData.payment?.method || 'QR',
          status: 'pending',
          amount: totalPrice,
          advancePayment: advancePayment,
          remainingPayment: totalPrice - advancePayment,
          transactionId: null,
          paidAt: null
        },
        
        // Communication
        notes: bookingData.notes || '',
        privateNotes: '', // Only professional sees this
        
        // Metadata
        confirmationRequired: true,
        autoConfirmMinutes: 60,
        remindersSent: [],
        
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // 5. Save to Firestore
      const docRef = await addDoc(collection(db, this.collection), booking);
      console.log('📅 Booking created with ID:', docRef.id);

      // 6. Update availability
      await this.updateAvailability(
        bookingData.professionalId,
        bookingData.scheduledDate,
        bookingData.scheduledTime,
        bookingData.service.totalDuration,
        docRef.id
      );

      // 7. Send notifications (placeholder)
      await this.sendBookingNotifications(docRef.id, 'created');

      return {
        success: true,
        id: docRef.id,
        booking: { id: docRef.id, ...booking }
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if a time slot is available
   */
  static async checkAvailability(professionalId, date, time, duration) {
    try {
      console.log('🔍 Checking availability:', { professionalId, date, time, duration });

      let availability = null;

      // In development mode, check localStorage first
      if (import.meta.env.DEV) {
        try {
          const demoAvailability = localStorage.getItem('demoAvailability');
          if (demoAvailability) {
            const availabilityData = JSON.parse(demoAvailability);
            availability = availabilityData[professionalId]?.[date];
            console.log('🔍 Using demo availability data');
          }
        } catch (error) {
          console.warn('⚠️ Error reading demo availability:', error);
        }
      }

      // Fallback to Firebase if no demo data
      if (!availability) {
        const availabilityQuery = query(
          collection(db, this.availabilityCollection),
          where('professionalId', '==', professionalId),
          where('date', '==', date)
        );

        const snapshot = await getDocs(availabilityQuery);
        
        if (snapshot.empty) {
          console.log('❌ No availability document found for this date');
          return false;
        }

        availability = snapshot.docs[0].data();
      }
      
      // Check if it's a working day
      if (!availability.isWorkingDay) {
        console.log('❌ Not a working day');
        return false;
      }

      // Calculate required slots
      const requiredSlots = this.calculateRequiredSlots(time, duration);
      console.log('📋 Required slots:', requiredSlots);

      // Check if all required slots are available
      const allSlotsAvailable = requiredSlots.every(requiredSlot => {
        const timeSlot = availability.timeSlots.find(slot => 
          slot.start === requiredSlot.start && slot.end === requiredSlot.end
        );
        
        if (!timeSlot) {
          console.log('❌ Time slot not found:', requiredSlot);
          return false;
        }
        
        if (!timeSlot.available || timeSlot.locked) {
          console.log('❌ Time slot not available or locked:', timeSlot);
          return false;
        }
        
        return true;
      });

      console.log('✅ All slots available:', allSlotsAvailable);
      return allSlotsAvailable;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }

  /**
   * Lock time slots temporarily during booking process
   */
  static async lockTimeSlot(professionalId, date, time, duration) {
    try {
      console.log('🔒 Locking time slots:', { professionalId, date, time, duration });

      const availabilityQuery = query(
        collection(db, this.availabilityCollection),
        where('professionalId', '==', professionalId),
        where('date', '==', date)
      );

      const snapshot = await getDocs(availabilityQuery);
      
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        const availability = snapshot.docs[0].data();
        
        const requiredSlots = this.calculateRequiredSlots(time, duration);
        const lockExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        
        const updatedTimeSlots = availability.timeSlots.map(slot => {
          const isRequiredSlot = requiredSlots.some(rs => 
            rs.start === slot.start && rs.end === slot.end
          );
          
          if (isRequiredSlot) {
            return {
              ...slot,
              locked: true,
              lockedUntil: Timestamp.fromDate(lockExpiration)
            };
          }
          return slot;
        });

        await updateDoc(docRef, {
          timeSlots: updatedTimeSlots,
          updatedAt: serverTimestamp()
        });

        console.log('🔒 Time slots locked successfully');
      }
    } catch (error) {
      console.error('Error locking time slot:', error);
      throw error;
    }
  }

  /**
   * Confirm a booking
   */
  static async confirmBooking(bookingId, confirmedBy = 'professional') {
    try {
      console.log('✅ Confirming booking:', bookingId);

      const bookingRef = doc(db, this.collection, bookingId);
      const bookingSnap = await getDoc(bookingRef);
      
      if (!bookingSnap.exists()) {
        throw new Error('Reserva no encontrada');
      }

      const bookingData = bookingSnap.data();
      
      if (bookingData.status !== 'pending') {
        throw new Error('La reserva no está en estado pendiente');
      }

      const newStatusEntry = {
        status: 'confirmed',
        timestamp: new Date(),
        note: `Confirmado por ${confirmedBy === 'professional' ? 'profesional' : confirmedBy}`,
        actor: confirmedBy,
        confirmedBy
      };

      await updateDoc(bookingRef, {
        status: 'confirmed',
        statusHistory: [...bookingData.statusHistory, newStatusEntry],
        updatedAt: serverTimestamp()
      });

      // Send confirmation notifications
      await this.sendBookingNotifications(bookingId, 'confirmed');

      console.log('✅ Booking confirmed successfully');
      return { success: true };
    } catch (error) {
      console.error('Error confirming booking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(bookingId, cancellationData) {
    try {
      console.log('❌ Cancelling booking:', bookingId);

      const bookingRef = doc(db, this.collection, bookingId);
      const bookingSnap = await getDoc(bookingRef);
      
      if (!bookingSnap.exists()) {
        throw new Error('Reserva no encontrada');
      }

      const bookingData = bookingSnap.data();
      
      // Calculate refund based on cancellation policy
      const refundAmount = this.calculateRefund(bookingData, cancellationData);
      
      const cancellation = {
        ...cancellationData,
        cancelledAt: new Date(),
        refundAmount,
        refundStatus: refundAmount > 0 ? 'pending' : 'not_applicable'
      };

      const newStatusEntry = {
        status: 'cancelled',
        timestamp: new Date(),
        note: `Cancelado: ${cancellationData.reason}`,
        actor: cancellationData.cancelledBy,
        cancelledBy: cancellationData.cancelledBy
      };

      await updateDoc(bookingRef, {
        status: 'cancelled',
        statusHistory: [...bookingData.statusHistory, newStatusEntry],
        cancellation,
        updatedAt: serverTimestamp()
      });

      // Free up the time slot
      await this.freeTimeSlot(
        bookingData.professionalId,
        bookingData.scheduledDate,
        bookingData.scheduledTime,
        bookingData.service.totalDuration
      );

      // Process refund if applicable
      if (refundAmount > 0) {
        await this.processRefund(bookingId, refundAmount);
      }

      // Send cancellation notifications
      await this.sendBookingNotifications(bookingId, 'cancelled');

      console.log('❌ Booking cancelled successfully');
      return { success: true, refundAmount };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get bookings by customer
   */
  static async getBookingsByCustomer(customerId, filters = {}) {
    try {
      console.log('📋 Getting customer bookings:', customerId);

      let q = query(
        collection(db, this.collection),
        where('customerId', '==', customerId)
      );

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.dateFrom) {
        q = query(q, where('scheduledDate', '>=', filters.dateFrom));
      }

      if (filters.dateTo) {
        q = query(q, where('scheduledDate', '<=', filters.dateTo));
      }

      q = query(q, orderBy('scheduledDate', 'desc'));

      const snapshot = await getDocs(q);
      const bookings = [];
      
      snapshot.forEach(doc => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      console.log('📋 Found bookings:', bookings.length);
      return bookings;
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      throw new Error('Error al cargar reservas');
    }
  }

  /**
   * Get bookings by professional
   */
  static async getBookingsByProfessional(professionalId, filters = {}) {
    try {
      console.log('📋 Getting professional bookings:', professionalId);

      let q = query(
        collection(db, this.collection),
        where('professionalId', '==', professionalId)
      );

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.date) {
        q = query(q, where('scheduledDate', '==', filters.date));
      }

      q = query(q, orderBy('scheduledTime', 'asc'));

      const snapshot = await getDocs(q);
      const bookings = [];
      
      snapshot.forEach(doc => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      console.log('📋 Found professional bookings:', bookings.length);
      return bookings;
    } catch (error) {
      console.error('Error fetching professional bookings:', error);
      throw new Error('Error al cargar reservas del profesional');
    }
  }

  /**
   * Calculate required time slots for a booking
   */
  static calculateRequiredSlots(startTime, duration) {
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    let currentTime = startHour * 60 + startMinute; // Convert to minutes
    const endTime = currentTime + duration;
    
    // Generate 1-hour slots
    while (currentTime < endTime) {
      const slotStartHour = Math.floor(currentTime / 60);
      const slotStartMinute = currentTime % 60;
      const nextHour = currentTime + 60;
      const slotEndHour = Math.floor(nextHour / 60);
      const slotEndMinute = nextHour % 60;
      
      const start = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMinute.toString().padStart(2, '0')}`;
      const end = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMinute.toString().padStart(2, '0')}`;
      
      slots.push({ start, end });
      currentTime = nextHour;
    }
    
    return slots;
  }

  /**
   * Calculate total price including addons
   */
  static calculateTotalPrice(service) {
    let total = service.price || 0;
    
    if (service.addons && service.addons.length > 0) {
      const addonsPrice = service.addons.reduce((sum, addon) => sum + (addon.price || 0), 0);
      total += addonsPrice;
    }
    
    return total;
  }

  /**
   * Calculate end time based on start time and duration
   */
  static calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    
    const endHours = Math.floor(endMinutes / 60);
    const remainingMinutes = endMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  }

  /**
   * Calculate refund based on cancellation policy
   */
  static calculateRefund(bookingData, cancellationData) {
    try {
      const now = new Date();
      const scheduledDateTime = new Date(`${bookingData.scheduledDate}T${bookingData.scheduledTime}`);
      const hoursUntilBooking = (scheduledDateTime - now) / (1000 * 60 * 60);

      // Refund policy
      if (hoursUntilBooking >= 24) {
        return bookingData.payment.advancePayment; // Full refund of advance
      } else if (hoursUntilBooking >= 2) {
        return Math.round(bookingData.payment.advancePayment * 0.5); // 50% refund
      } else {
        return 0; // No refund
      }
    } catch (error) {
      console.error('Error calculating refund:', error);
      return 0;
    }
  }

  /**
   * Update professional availability after booking
   */
  static async updateAvailability(professionalId, date, time, duration, bookingId) {
    try {
      console.log('📅 Updating availability:', { professionalId, date, time, duration, bookingId });

      const availabilityQuery = query(
        collection(db, this.availabilityCollection),
        where('professionalId', '==', professionalId),
        where('date', '==', date)
      );

      const snapshot = await getDocs(availabilityQuery);
      
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        const availability = snapshot.docs[0].data();
        
        const requiredSlots = this.calculateRequiredSlots(time, duration);
        
        const updatedTimeSlots = availability.timeSlots.map(slot => {
          const isRequiredSlot = requiredSlots.some(rs => 
            rs.start === slot.start && rs.end === slot.end
          );
          
          if (isRequiredSlot) {
            return {
              ...slot,
              available: false,
              bookingId: bookingId,
              locked: false,
              lockedUntil: null
            };
          }
          return slot;
        });

        await updateDoc(docRef, {
          timeSlots: updatedTimeSlots,
          updatedAt: serverTimestamp()
        });

        console.log('📅 Availability updated successfully');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  }

  /**
   * Free time slot after cancellation
   */
  static async freeTimeSlot(professionalId, date, time, duration) {
    try {
      console.log('🔓 Freeing time slot:', { professionalId, date, time, duration });

      const availabilityQuery = query(
        collection(db, this.availabilityCollection),
        where('professionalId', '==', professionalId),
        where('date', '==', date)
      );

      const snapshot = await getDocs(availabilityQuery);
      
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        const availability = snapshot.docs[0].data();
        
        const requiredSlots = this.calculateRequiredSlots(time, duration);
        
        const updatedTimeSlots = availability.timeSlots.map(slot => {
          const isRequiredSlot = requiredSlots.some(rs => 
            rs.start === slot.start && rs.end === slot.end
          );
          
          if (isRequiredSlot) {
            return {
              ...slot,
              available: true,
              bookingId: null,
              locked: false,
              lockedUntil: null
            };
          }
          return slot;
        });

        await updateDoc(docRef, {
          timeSlots: updatedTimeSlots,
          updatedAt: serverTimestamp()
        });

        console.log('🔓 Time slot freed successfully');
      }
    } catch (error) {
      console.error('Error freeing time slot:', error);
    }
  }

  /**
   * Get user bookings (customer or professional)
   * @param {string} userId - User ID
   * @param {string} role - 'customer' or 'professional'
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Success object with bookings array
   */
  static async getUserBookings(userId, role = 'customer', options = {}) {
    try {
      console.log('📋 Getting user bookings:', { userId, role, options });
      
      // In dev mode, try to get demo bookings from localStorage first
      if (import.meta.env.DEV) {
        const demoBookings = this.getDemoBookings(userId, role);
        if (demoBookings.length > 0) {
          console.log('📋 Found demo bookings:', demoBookings.length);
          return { success: true, bookings: demoBookings };
        }
      }
      
      // Query Firestore for real bookings
      const fieldName = role === 'professional' ? 'professionalId' : 'customerId';
      const bookingsQuery = query(
        collection(db, this.collection),
        where(fieldName, '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(bookingsQuery);
      const bookings = [];
      
      snapshot.forEach(doc => {
        bookings.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('📋 Found Firestore bookings:', bookings.length);
      return { success: true, bookings };
      
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return { success: false, error: error.message, bookings: [] };
    }
  }

  /**
   * Get demo bookings from localStorage (for development)
   */
  static getDemoBookings(userId, role) {
    try {
      // For demo purposes, create some sample bookings
      const now = new Date();
      const demoBookings = [];
      
      // Check if there are any bookings in localStorage from actual booking creation
      const existingBookings = JSON.parse(localStorage.getItem('demoUserBookings') || '[]');
      
      // Add any existing bookings for this user
      const userBookings = existingBookings.filter(booking => {
        return role === 'professional' ? 
          booking.professionalId === userId : 
          booking.customerId === userId;
      });
      
      demoBookings.push(...userBookings);
      
      // If no existing bookings, create some sample ones for demo
      if (demoBookings.length === 0 && role === 'customer') {
        const sampleBookings = [
          {
            id: 'demo_booking_1',
            customerId: userId,
            professionalId: 'prof_maria_123',
            serviceId: 'service_maria_1',
            status: 'confirmed',
            scheduledDate: '2025-09-05',
            scheduledTime: '14:00',
            service: {
              name: 'Maquillaje Social',
              price: 150,
              duration: 60,
              totalPrice: 150
            },
            professional: {
              id: 'prof_maria_123',
              name: 'María González',
              phone: '+591 70123456'
            },
            location: {
              type: 'home',
              address: 'Calle 21 #123, Zona Sur, La Paz',
              instructions: 'Portón azul, 2do piso'
            },
            statusHistory: [{
              status: 'confirmed',
              timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
              note: 'Reserva confirmada por profesional'
            }],
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000)
          },
          {
            id: 'demo_booking_2',
            customerId: userId,
            professionalId: 'prof_ana_456',
            serviceId: 'service_ana_2',
            status: 'pending',
            scheduledDate: '2025-09-08',
            scheduledTime: '10:00',
            service: {
              name: 'Uñas Decoradas',
              price: 120,
              duration: 90,
              totalPrice: 120
            },
            professional: {
              id: 'prof_ana_456',
              name: 'Ana Rodríguez',
              phone: '+591 71234567'
            },
            location: {
              type: 'home',
              address: 'Av. Ballivián #456, Zona Sur, La Paz',
              instructions: 'Casa de color crema'
            },
            statusHistory: [{
              status: 'pending',
              timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
              note: 'Reserva creada'
            }],
            createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
            updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
          }
        ];
        
        demoBookings.push(...sampleBookings);
      }
      
      return demoBookings;
      
    } catch (error) {
      console.error('Error getting demo bookings:', error);
      return [];
    }
  }

  /**
   * Send booking notifications (placeholder)
   */
  static async sendBookingNotifications(bookingId, eventType) {
    console.log(`📧 Sending ${eventType} notification for booking ${bookingId}`);
    // This will be implemented when notification system is ready
  }

  /**
   * Process refund (placeholder)
   */
  static async processRefund(bookingId, amount) {
    console.log(`💰 Processing refund of Bs.${amount} for booking ${bookingId}`);
    // This will be implemented when payment system is ready
  }
}

export default BookingService;