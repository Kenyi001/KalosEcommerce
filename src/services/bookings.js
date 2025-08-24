// Bookings service for Kalos E-commerce
import { db } from '../config/firebase-config.js';
import { 
  collection,
  doc, 
  addDoc,
  getDoc,
  getDocs,
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  runTransaction
} from 'firebase/firestore';

class BookingsService {
  constructor() {
    this.collectionName = 'bookings';
  }

  // Create a new booking
  async createBooking(bookingData) {
    try {
      const { customerId, professionalId, serviceId, ...otherData } = bookingData;

      if (!customerId || !professionalId || !serviceId) {
        throw new Error('Customer ID, Professional ID and Service ID are required');
      }

      const booking = {
        customerId,
        professionalId,
        serviceId,
        ...otherData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.collectionName), booking);
      
      return {
        success: true,
        bookingId: docRef.id,
        booking: { ...booking, id: docRef.id }
      };

    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error(error.message || 'Error al crear la reserva');
    }
  }

  // Get booking by ID
  async getBooking(bookingId) {
    try {
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }

      const bookingDoc = await getDoc(doc(db, this.collectionName, bookingId));

      if (!bookingDoc.exists()) {
        throw new Error('Booking not found');
      }

      return {
        success: true,
        booking: { id: bookingDoc.id, ...bookingDoc.data() }
      };

    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error(error.message || 'Error al obtener la reserva');
    }
  }

  // Get bookings for a customer
  async getCustomerBookings(customerId, options = {}) {
    try {
      if (!customerId) {
        throw new Error('Customer ID is required');
      }

      const {
        status = null,
        limitCount = 50,
        orderByField = 'createdAt',
        orderDirection = 'desc'
      } = options;

      let q = query(
        collection(db, this.collectionName),
        where('customerId', '==', customerId),
        orderBy(orderByField, orderDirection)
      );

      if (status) {
        q = query(q, where('status', '==', status));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      const bookings = [];

      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        bookings
      };

    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      throw new Error(error.message || 'Error al obtener las reservas del cliente');
    }
  }

  // Get bookings for a professional
  async getProfessionalBookings(professionalId, options = {}) {
    try {
      if (!professionalId) {
        throw new Error('Professional ID is required');
      }

      const {
        status = null,
        limitCount = 50,
        orderByField = 'createdAt',
        orderDirection = 'desc'
      } = options;

      let q = query(
        collection(db, this.collectionName),
        where('professionalId', '==', professionalId),
        orderBy(orderByField, orderDirection)
      );

      if (status) {
        q = query(q, where('status', '==', status));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      const bookings = [];

      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        bookings
      };

    } catch (error) {
      console.error('Error fetching professional bookings:', error);
      throw new Error(error.message || 'Error al obtener las reservas del profesional');
    }
  }

  // Update booking status (for professionals)
  async updateBookingStatus(bookingId, status, professionalId, notes = '') {
    try {
      if (!bookingId || !status || !professionalId) {
        throw new Error('Booking ID, status and professional ID are required');
      }

      const validStatuses = ['pending', 'accepted', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }

      // Use transaction to ensure data consistency
      const result = await runTransaction(db, async (transaction) => {
        const bookingRef = doc(db, this.collectionName, bookingId);
        const bookingDoc = await transaction.get(bookingRef);

        if (!bookingDoc.exists()) {
          throw new Error('Booking not found');
        }

        const bookingData = bookingDoc.data();

        // Verify that only the professional can update their bookings
        if (bookingData.professionalId !== professionalId) {
          throw new Error('Unauthorized to update this booking');
        }

        const updateData = {
          status,
          updatedAt: serverTimestamp()
        };

        // Add professional confirmation data for status changes
        if (status === 'accepted' || status === 'cancelled') {
          updateData.professionalConfirmation = {
            status,
            confirmedAt: serverTimestamp(),
            notes: notes || '',
            confirmedBy: professionalId
          };
        }

        transaction.update(bookingRef, updateData);

        return { 
          success: true, 
          booking: { ...bookingData, ...updateData, id: bookingId }
        };
      });

      return result;

    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error(error.message || 'Error al actualizar el estado de la reserva');
    }
  }

  // Cancel booking (for customers)
  async cancelBooking(bookingId, customerId, reason = '') {
    try {
      if (!bookingId || !customerId) {
        throw new Error('Booking ID and customer ID are required');
      }

      // Use transaction to ensure data consistency
      const result = await runTransaction(db, async (transaction) => {
        const bookingRef = doc(db, this.collectionName, bookingId);
        const bookingDoc = await transaction.get(bookingRef);

        if (!bookingDoc.exists()) {
          throw new Error('Booking not found');
        }

        const bookingData = bookingDoc.data();

        // Verify that only the customer can cancel their bookings
        if (bookingData.customerId !== customerId) {
          throw new Error('Unauthorized to cancel this booking');
        }

        // Check if booking can be cancelled
        if (bookingData.status === 'completed' || bookingData.status === 'cancelled') {
          throw new Error('Cannot cancel booking in current status');
        }

        const updateData = {
          status: 'cancelled',
          updatedAt: serverTimestamp(),
          cancellation: {
            cancelledBy: 'customer',
            cancelledAt: serverTimestamp(),
            reason: reason || '',
            customerId
          }
        };

        transaction.update(bookingRef, updateData);

        return { 
          success: true, 
          booking: { ...bookingData, ...updateData, id: bookingId }
        };
      });

      return result;

    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error(error.message || 'Error al cancelar la reserva');
    }
  }

  // Get bookings statistics for professional dashboard
  async getProfessionalStats(professionalId, days = 30) {
    try {
      if (!professionalId) {
        throw new Error('Professional ID is required');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const q = query(
        collection(db, this.collectionName),
        where('professionalId', '==', professionalId),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate)
      );

      const querySnapshot = await getDocs(q);
      const bookings = [];

      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      // Calculate statistics
      const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        accepted: bookings.filter(b => b.status === 'accepted').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        totalRevenue: bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + (b.priceBOB || 0), 0)
      };

      return {
        success: true,
        stats,
        period: { startDate, endDate, days }
      };

    } catch (error) {
      console.error('Error fetching professional stats:', error);
      throw new Error(error.message || 'Error al obtener las estadísticas');
    }
  }

  // Search bookings (for admin or analytics)
  async searchBookings(searchCriteria = {}) {
    try {
      const {
        status = null,
        professionalId = null,
        customerId = null,
        dateFrom = null,
        dateTo = null,
        limitCount = 100
      } = searchCriteria;

      let q = collection(db, this.collectionName);

      // Apply filters
      const constraints = [];

      if (status) {
        constraints.push(where('status', '==', status));
      }

      if (professionalId) {
        constraints.push(where('professionalId', '==', professionalId));
      }

      if (customerId) {
        constraints.push(where('customerId', '==', customerId));
      }

      if (dateFrom) {
        constraints.push(where('createdAt', '>=', dateFrom));
      }

      if (dateTo) {
        constraints.push(where('createdAt', '<=', dateTo));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (limitCount) {
        constraints.push(limit(limitCount));
      }

      q = query(q, ...constraints);

      const querySnapshot = await getDocs(q);
      const bookings = [];

      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        bookings,
        count: bookings.length
      };

    } catch (error) {
      console.error('Error searching bookings:', error);
      throw new Error(error.message || 'Error al buscar reservas');
    }
  }
}

// Create and export bookings service instance
export const bookingsService = new BookingsService();

// Export class for testing
export { BookingsService };