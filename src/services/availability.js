/**
 * Availability Service - Gestión de Disponibilidad para Profesionales
 * Maneja calendarios, horarios de trabajo y slots de tiempo
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

export class AvailabilityService {
  static collection = 'availability';

  /**
   * Generate availability for a professional for a date range
   */
  static async generateAvailability(professionalId, dateRange, baseSchedule) {
    try {
      console.log('📅 Generating availability:', { professionalId, dateRange, baseSchedule });

      const generated = [];

      for (const date of dateRange) {
        // Check if availability already exists for this date
        const existing = await this.getAvailabilityByDate(professionalId, date);
        
        if (existing) {
          console.log('⚠️ Availability already exists for:', date);
          continue;
        }

        // Generate time slots based on base schedule
        const timeSlots = this.generateTimeSlots(baseSchedule);
        
        // Check if it's a working day (customize based on professional's schedule)
        const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 1 = Monday...
        const isWorkingDay = this.isWorkingDay(dayOfWeek, baseSchedule);

        const availabilityDoc = {
          professionalId,
          date,
          dayOfWeek,
          
          // Base schedule
          baseSchedule: {
            start: baseSchedule.start || '09:00',
            end: baseSchedule.end || '18:00',
            lunchBreak: baseSchedule.lunchBreak || { start: '13:00', end: '14:00' }
          },
          
          // Available time slots
          timeSlots: isWorkingDay ? timeSlots : [],
          
          // Working day flag
          isWorkingDay,
          
          // Exceptions (vacations, holidays, etc.)
          exceptions: [],
          
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, this.collection), availabilityDoc);
        generated.push({ id: docRef.id, ...availabilityDoc });
        
        console.log('📅 Generated availability for:', date);
      }

      return {
        success: true,
        generated: generated.length,
        availabilities: generated
      };
    } catch (error) {
      console.error('Error generating availability:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get availability by professional and date
   */
  static async getAvailabilityByDate(professionalId, date) {
    try {
      const availabilityQuery = query(
        collection(db, this.collection),
        where('professionalId', '==', professionalId),
        where('date', '==', date)
      );

      const snapshot = await getDocs(availabilityQuery);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }

      return null;
    } catch (error) {
      console.error('Error getting availability by date:', error);
      return null;
    }
  }

  /**
   * Get availability by professional for a date range
   */
  static async getAvailabilityRange(professionalId, startDate, endDate) {
    try {
      console.log('📅 Getting availability range:', { professionalId, startDate, endDate });

      const availabilityQuery = query(
        collection(db, this.collection),
        where('professionalId', '==', professionalId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'asc')
      );

      const snapshot = await getDocs(availabilityQuery);
      const availabilities = [];
      
      snapshot.forEach(doc => {
        availabilities.push({ id: doc.id, ...doc.data() });
      });

      console.log('📅 Found availabilities:', availabilities.length);
      return availabilities;
    } catch (error) {
      console.error('Error getting availability range:', error);
      throw new Error('Error al cargar disponibilidad');
    }
  }

  /**
   * Update professional's base schedule
   */
  static async updateBaseSchedule(professionalId, newBaseSchedule) {
    try {
      console.log('⚙️ Updating base schedule:', { professionalId, newBaseSchedule });

      // Get all future availabilities for this professional
      const today = new Date().toISOString().split('T')[0];
      const futureAvailabilities = await this.getAvailabilityRange(professionalId, today, '2025-12-31');

      // Update each availability document
      for (const availability of futureAvailabilities) {
        const docRef = doc(db, this.collection, availability.id);
        
        // Regenerate time slots based on new schedule
        const newTimeSlots = this.generateTimeSlots(newBaseSchedule);
        const isWorkingDay = this.isWorkingDay(availability.dayOfWeek, newBaseSchedule);

        await updateDoc(docRef, {
          baseSchedule: newBaseSchedule,
          timeSlots: isWorkingDay ? newTimeSlots : [],
          isWorkingDay,
          updatedAt: serverTimestamp()
        });
      }

      console.log('⚙️ Base schedule updated for', futureAvailabilities.length, 'dates');
      return { success: true, updatedDates: futureAvailabilities.length };
    } catch (error) {
      console.error('Error updating base schedule:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add exception (vacation, holiday, etc.)
   */
  static async addException(professionalId, date, exception) {
    try {
      console.log('🚫 Adding exception:', { professionalId, date, exception });

      const availability = await this.getAvailabilityByDate(professionalId, date);
      
      if (!availability) {
        throw new Error('No hay disponibilidad para esa fecha');
      }

      const docRef = doc(db, this.collection, availability.id);
      const updatedExceptions = [...(availability.exceptions || []), exception];

      // If it's an all-day exception, mark as non-working day
      const updates = {
        exceptions: updatedExceptions,
        updatedAt: serverTimestamp()
      };

      if (exception.allDay) {
        updates.isWorkingDay = false;
        updates.timeSlots = []; // Clear all time slots
      }

      await updateDoc(docRef, updates);

      console.log('🚫 Exception added successfully');
      return { success: true };
    } catch (error) {
      console.error('Error adding exception:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove exception
   */
  static async removeException(professionalId, date, exceptionIndex) {
    try {
      console.log('✅ Removing exception:', { professionalId, date, exceptionIndex });

      const availability = await this.getAvailabilityByDate(professionalId, date);
      
      if (!availability) {
        throw new Error('No hay disponibilidad para esa fecha');
      }

      const docRef = doc(db, this.collection, availability.id);
      const updatedExceptions = availability.exceptions.filter((_, index) => index !== exceptionIndex);

      // If removing all-day exception, restore working day
      const removedException = availability.exceptions[exceptionIndex];
      const updates = {
        exceptions: updatedExceptions,
        updatedAt: serverTimestamp()
      };

      if (removedException?.allDay) {
        const dayOfWeek = new Date(date).getDay();
        const isWorkingDay = this.isWorkingDay(dayOfWeek, availability.baseSchedule);
        
        updates.isWorkingDay = isWorkingDay;
        if (isWorkingDay) {
          updates.timeSlots = this.generateTimeSlots(availability.baseSchedule);
        }
      }

      await updateDoc(docRef, updates);

      console.log('✅ Exception removed successfully');
      return { success: true };
    } catch (error) {
      console.error('Error removing exception:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get available time slots for a specific date
   */
  static async getAvailableSlots(professionalId, date, serviceDuration = 60) {
    try {
      console.log('🔍 Getting available slots:', { professionalId, date, serviceDuration });

      const availability = await this.getAvailabilityByDate(professionalId, date);
      
      if (!availability || !availability.isWorkingDay) {
        return [];
      }

      const availableSlots = [];

      // Filter available slots based on service duration
      for (const slot of availability.timeSlots) {
        if (slot.available && !slot.locked) {
          // Check if we can fit the service duration starting from this slot
          if (this.canFitService(availability.timeSlots, slot.start, serviceDuration)) {
            availableSlots.push({
              start: slot.start,
              end: this.calculateEndTime(slot.start, serviceDuration),
              duration: serviceDuration
            });
          }
        }
      }

      console.log('🔍 Found available slots:', availableSlots.length);
      return availableSlots;
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  }

  /**
   * Clean up expired locks (locks older than 5 minutes)
   */
  static async cleanupExpiredLocks() {
    try {
      console.log('🧹 Cleaning up expired locks...');

      const now = new Date();
      const availabilities = await getDocs(collection(db, this.collection));
      let cleaned = 0;

      for (const docSnap of availabilities.docs) {
        const availability = docSnap.data();
        let hasExpiredLocks = false;

        const updatedTimeSlots = availability.timeSlots.map(slot => {
          if (slot.locked && slot.lockedUntil) {
            const lockExpiration = slot.lockedUntil.toDate();
            if (lockExpiration < now) {
              hasExpiredLocks = true;
              return {
                ...slot,
                locked: false,
                lockedUntil: null
              };
            }
          }
          return slot;
        });

        if (hasExpiredLocks) {
          await updateDoc(docSnap.ref, {
            timeSlots: updatedTimeSlots,
            updatedAt: serverTimestamp()
          });
          cleaned++;
        }
      }

      console.log('🧹 Cleaned up expired locks in', cleaned, 'documents');
      return { success: true, cleaned };
    } catch (error) {
      console.error('Error cleaning up expired locks:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== HELPER METHODS =====

  /**
   * Generate time slots based on base schedule
   */
  static generateTimeSlots(baseSchedule) {
    const slots = [];
    const startTime = this.timeToMinutes(baseSchedule.start || '09:00');
    const endTime = this.timeToMinutes(baseSchedule.end || '18:00');
    const lunchStart = this.timeToMinutes(baseSchedule.lunchBreak?.start || '13:00');
    const lunchEnd = this.timeToMinutes(baseSchedule.lunchBreak?.end || '14:00');
    
    // Generate 1-hour slots
    for (let time = startTime; time < endTime; time += 60) {
      const slotEnd = time + 60;
      
      // Skip lunch break
      if (time >= lunchStart && time < lunchEnd) {
        continue;
      }
      
      slots.push({
        start: this.minutesToTime(time),
        end: this.minutesToTime(slotEnd),
        available: true,
        bookingId: null,
        locked: false,
        lockedUntil: null
      });
    }
    
    return slots;
  }

  /**
   * Check if a day is a working day
   */
  static isWorkingDay(dayOfWeek, baseSchedule) {
    // Default: Monday to Saturday are working days
    const workingDays = baseSchedule.workingDays || [1, 2, 3, 4, 5, 6];
    return workingDays.includes(dayOfWeek);
  }

  /**
   * Check if a service can fit starting from a specific time
   */
  static canFitService(timeSlots, startTime, serviceDuration) {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = startMinutes + serviceDuration;
    
    // Find all slots that would be needed
    const neededSlots = timeSlots.filter(slot => {
      const slotStart = this.timeToMinutes(slot.start);
      const slotEnd = this.timeToMinutes(slot.end);
      
      // Check if this slot overlaps with the service time
      return (slotStart >= startMinutes && slotStart < endMinutes) ||
             (slotEnd > startMinutes && slotEnd <= endMinutes) ||
             (slotStart <= startMinutes && slotEnd >= endMinutes);
    });
    
    // Check if all needed slots are available
    return neededSlots.every(slot => slot.available && !slot.locked);
  }

  /**
   * Calculate end time based on start time and duration
   */
  static calculateEndTime(startTime, duration) {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = startMinutes + duration;
    return this.minutesToTime(endMinutes);
  }

  /**
   * Convert time string to minutes
   */
  static timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Convert minutes to time string
   */
  static minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * Generate date range
   */
  static generateDateRange(startDate, days) {
    const dates = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  }

  /**
   * Get professional's default schedule
   */
  static getDefaultSchedule() {
    return {
      start: '09:00',
      end: '18:00',
      lunchBreak: {
        start: '13:00',
        end: '14:00'
      },
      workingDays: [1, 2, 3, 4, 5, 6] // Monday to Saturday
    };
  }
}

export default AvailabilityService;