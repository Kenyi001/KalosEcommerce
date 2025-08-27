/**
 * Services CRUD - Management for professional services and portfolio
 * Handles services offered by professionals and their portfolio items
 */
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase-config.js';
import { 
  createService, 
  createPortfolioItem, 
  validateService 
} from '../models/professional.js';
import { professionalService } from './professionals.js';

class ServicesService {
  /**
   * Create a new service
   * @param {string} professionalId - Professional ID
   * @param {Object} serviceData - Service data
   * @returns {Promise<Object>} Created service
   */
  async createService(professionalId, serviceData) {
    try {
      // Validate service data
      const validation = validateService(serviceData.basicInfo || serviceData);
      if (!validation.isValid) {
        throw new Error(`Service validation failed: ${JSON.stringify(validation.errors)}`);
      }

      // Verify professional exists and is active
      const professional = await professionalService.getProfile(professionalId);
      if (!professional || professional.status !== 'active') {
        throw new Error('Professional not found or inactive');
      }

      const serviceRef = doc(collection(db, 'services'));
      const newService = createService(professionalId, serviceData);
      newService.createdAt = serverTimestamp();
      newService.updatedAt = serverTimestamp();

      await setDoc(serviceRef, newService);

      // Update professional's total services count
      await professionalService.updateStats(professionalId, { totalServices: 1 });

      return { id: serviceRef.id, ...newService };
    } catch (error) {
      console.error('Error creating service:', error);
      throw new Error(`Failed to create service: ${error.message}`);
    }
  }

  /**
   * Get service by ID
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object|null>} Service data
   */
  async getService(serviceId) {
    try {
      const serviceDoc = await getDoc(doc(db, 'services', serviceId));
      
      if (serviceDoc.exists()) {
        return { id: serviceDoc.id, ...serviceDoc.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting service:', error);
      throw new Error(`Failed to get service: ${error.message}`);
    }
  }

  /**
   * Get services by professional ID
   * @param {string} professionalId - Professional ID
   * @param {boolean} activeOnly - Return only active services
   * @returns {Promise<Array>} Services list
   */
  async getServicesByProfessional(professionalId, activeOnly = true) {
    try {
      // Simplified query to avoid composite index requirement
      const servicesQuery = query(
        collection(db, 'services'),
        where('professionalId', '==', professionalId)
      );

      const snapshot = await getDocs(servicesQuery);
      let services = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter and sort locally to avoid index requirement
      if (activeOnly) {
        services = services.filter(service => service.status === 'active');
      }

      // Sort by createdAt locally
      services.sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return bDate - aDate; // Descending order
      });

      return services;
    } catch (error) {
      console.error('Error getting services by professional:', error);
      throw new Error(`Failed to get services: ${error.message}`);
    }
  }

  /**
   * Update service
   * @param {string} serviceId - Service ID
   * @param {Object} serviceData - Updated service data
   * @param {string} professionalId - Professional ID (for authorization)
   * @returns {Promise<Object>} Updated service
   */
  async updateService(serviceId, serviceData, professionalId) {
    try {
      const serviceRef = doc(db, 'services', serviceId);
      const currentService = await getDoc(serviceRef);

      if (!currentService.exists()) {
        throw new Error('Service not found');
      }

      // Verify ownership
      if (currentService.data().professionalId !== professionalId) {
        throw new Error('Unauthorized to update this service');
      }

      // Validate updated data
      if (serviceData.basicInfo) {
        const validation = validateService(serviceData.basicInfo);
        if (!validation.isValid) {
          throw new Error(`Service validation failed: ${JSON.stringify(validation.errors)}`);
        }
      }

      const updateData = {
        ...serviceData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(serviceRef, updateData);

      const updatedDoc = await getDoc(serviceRef);
      return { id: updatedDoc.id, ...updatedDoc.data() };
    } catch (error) {
      console.error('Error updating service:', error);
      throw new Error(`Failed to update service: ${error.message}`);
    }
  }

  /**
   * Delete service
   * @param {string} serviceId - Service ID
   * @param {string} professionalId - Professional ID (for authorization)
   * @returns {Promise<boolean>} Success status
   */
  async deleteService(serviceId, professionalId) {
    try {
      const serviceRef = doc(db, 'services', serviceId);
      const serviceDoc = await getDoc(serviceRef);

      if (!serviceDoc.exists()) {
        throw new Error('Service not found');
      }

      // Verify ownership
      if (serviceDoc.data().professionalId !== professionalId) {
        throw new Error('Unauthorized to delete this service');
      }

      await deleteDoc(serviceRef);

      // Update professional's total services count
      await professionalService.updateStats(professionalId, { totalServices: -1 });

      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw new Error(`Failed to delete service: ${error.message}`);
    }
  }

  /**
   * Upload service images
   * @param {string} serviceId - Service ID
   * @param {File[]} imageFiles - Image files
   * @param {string} professionalId - Professional ID
   * @returns {Promise<Array>} Image URLs
   */
  async uploadServiceImages(serviceId, imageFiles, professionalId) {
    try {
      const service = await this.getService(serviceId);
      if (!service || service.professionalId !== professionalId) {
        throw new Error('Service not found or unauthorized');
      }

      const uploadPromises = imageFiles.map(async (file, index) => {
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${index + 1} is not an image`);
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error(`Image ${index + 1} is too large (max 5MB)`);
        }

        const timestamp = Date.now();
        const filename = `${timestamp}_${index}_${file.name}`;
        const imageRef = ref(storage, `services/${serviceId}/${filename}`);

        const snapshot = await uploadBytes(imageRef, file);
        return await getDownloadURL(snapshot.ref);
      });

      const imageUrls = await Promise.all(uploadPromises);

      // Update service with new image URLs
      const currentImages = service.details?.images || [];
      const updatedImages = [...currentImages, ...imageUrls];

      await this.updateService(serviceId, {
        'details.images': updatedImages
      }, professionalId);

      return imageUrls;
    } catch (error) {
      console.error('Error uploading service images:', error);
      throw new Error(`Failed to upload service images: ${error.message}`);
    }
  }

  /**
   * Search services with filters
   * @param {Object} filters - Search filters
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Search results
   */
  async searchServices(filters = {}, pagination = {}) {
    try {
      let servicesQuery = collection(db, 'services');

      const constraints = [
        where('status', '==', 'active')
      ];

      // Category filter
      if (filters.category) {
        constraints.push(where('basicInfo.category', '==', filters.category));
      }

      // Price range filter
      if (filters.minPrice) {
        constraints.push(where('basicInfo.price', '>=', filters.minPrice));
      }

      if (filters.maxPrice) {
        constraints.push(where('basicInfo.price', '<=', filters.maxPrice));
      }

      // Duration filter
      if (filters.maxDuration) {
        constraints.push(where('basicInfo.duration', '<=', filters.maxDuration));
      }

      // Location filter (requires joining with professionals collection)
      if (filters.city || filters.department) {
        // This would require a more complex query or client-side filtering
        // For now, we'll handle this in the client after getting professional data
      }

      // Sorting
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder || 'desc';
      constraints.push(orderBy(sortBy, sortOrder));

      // Pagination
      const pageSize = pagination.limit || 12;
      constraints.push(limit(pageSize));

      if (pagination.startAfterDoc) {
        constraints.push(startAfter(pagination.startAfterDoc));
      }

      servicesQuery = query(servicesQuery, ...constraints);

      const snapshot = await getDocs(servicesQuery);
      const services = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If location filters are specified, filter by professional location
      let filteredServices = services;
      if (filters.city || filters.department) {
        const professionalIds = [...new Set(services.map(s => s.professionalId))];
        const professionals = await Promise.all(
          professionalIds.map(id => professionalService.getPublicProfile(id))
        );

        const professionalsMap = {};
        professionals.forEach(prof => {
          if (prof) professionalsMap[prof.id] = prof;
        });

        filteredServices = services.filter(service => {
          const prof = professionalsMap[service.professionalId];
          if (!prof) return false;

          if (filters.department && prof.location?.department !== filters.department) {
            return false;
          }

          if (filters.city && prof.location?.city !== filters.city) {
            return false;
          }

          return true;
        });
      }

      return {
        services: filteredServices,
        hasMore: snapshot.docs.length === pageSize,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        total: filteredServices.length
      };
    } catch (error) {
      console.error('Error searching services:', error);
      throw new Error(`Failed to search services: ${error.message}`);
    }
  }

  /**
   * Get popular services (most booked)
   * @param {number} limit - Number of services to return
   * @returns {Promise<Array>} Popular services
   */
  async getPopularServices(limit = 10) {
    try {
      const popularQuery = query(
        collection(db, 'services'),
        where('status', '==', 'active'),
        where('stats.totalBookings', '>', 0),
        orderBy('stats.totalBookings', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(popularQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting popular services:', error);
      throw new Error(`Failed to get popular services: ${error.message}`);
    }
  }

  /**
   * Update service statistics
   * @param {string} serviceId - Service ID
   * @param {Object} statsUpdate - Statistics to update
   * @returns {Promise<boolean>} Success status
   */
  async updateServiceStats(serviceId, statsUpdate) {
    try {
      const serviceRef = doc(db, 'services', serviceId);
      const updateData = { updatedAt: serverTimestamp() };

      if (statsUpdate.totalBookings) {
        updateData['stats.totalBookings'] = increment(statsUpdate.totalBookings);
      }

      if (statsUpdate.totalReviews) {
        updateData['stats.totalReviews'] = increment(statsUpdate.totalReviews);
      }

      if (statsUpdate.averageRating !== undefined) {
        updateData['stats.averageRating'] = statsUpdate.averageRating;
      }

      if (statsUpdate.lastBookedAt) {
        updateData['stats.lastBookedAt'] = serverTimestamp();
      }

      await updateDoc(serviceRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating service stats:', error);
      throw new Error(`Failed to update service stats: ${error.message}`);
    }
  }

  // Portfolio Management

  /**
   * Add portfolio item
   * @param {string} professionalId - Professional ID
   * @param {Object} portfolioData - Portfolio data
   * @param {Object} imageFiles - Image files
   * @returns {Promise<Object>} Created portfolio item
   */
  async addPortfolioItem(professionalId, portfolioData, imageFiles = {}) {
    try {
      // Verify professional exists
      const professional = await professionalService.getProfile(professionalId);
      if (!professional) {
        throw new Error('Professional not found');
      }

      // Upload images first
      const uploadedImages = {};

      for (const [key, file] of Object.entries(imageFiles)) {
        if (file) {
          if (!file.type.startsWith('image/')) {
            throw new Error(`${key} file is not an image`);
          }

          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error(`${key} image is too large (max 5MB)`);
          }

          const timestamp = Date.now();
          const filename = `${key}_${timestamp}_${file.name}`;
          const imageRef = ref(storage, `professionals/${professionalId}/portfolio/${filename}`);

          const snapshot = await uploadBytes(imageRef, file);
          uploadedImages[key] = await getDownloadURL(snapshot.ref);
        }
      }

      const portfolioRef = doc(collection(db, 'portfolio'));
      const newItem = createPortfolioItem(professionalId, {
        ...portfolioData,
        images: uploadedImages
      });
      newItem.createdAt = serverTimestamp();
      newItem.updatedAt = serverTimestamp();

      await setDoc(portfolioRef, newItem);

      return { id: portfolioRef.id, ...newItem };
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      throw new Error(`Failed to add portfolio item: ${error.message}`);
    }
  }

  /**
   * Get portfolio by professional ID
   * @param {string} professionalId - Professional ID
   * @param {boolean} publicOnly - Return only public items
   * @returns {Promise<Array>} Portfolio items
   */
  async getPortfolio(professionalId, publicOnly = true) {
    try {
      let portfolioQuery = query(
        collection(db, 'portfolio'),
        where('professionalId', '==', professionalId),
        orderBy('createdAt', 'desc')
      );

      if (publicOnly) {
        portfolioQuery = query(
          collection(db, 'portfolio'),
          where('professionalId', '==', professionalId),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc')
        );
      }

      const snapshot = await getDocs(portfolioQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting portfolio:', error);
      throw new Error(`Failed to get portfolio: ${error.message}`);
    }
  }

  /**
   * Update portfolio item
   * @param {string} itemId - Portfolio item ID
   * @param {Object} updateData - Update data
   * @param {string} professionalId - Professional ID (for authorization)
   * @returns {Promise<Object>} Updated item
   */
  async updatePortfolioItem(itemId, updateData, professionalId) {
    try {
      const itemRef = doc(db, 'portfolio', itemId);
      const currentItem = await getDoc(itemRef);

      if (!currentItem.exists()) {
        throw new Error('Portfolio item not found');
      }

      // Verify ownership
      if (currentItem.data().professionalId !== professionalId) {
        throw new Error('Unauthorized to update this portfolio item');
      }

      const updatedData = {
        ...updateData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(itemRef, updatedData);

      const updatedDoc = await getDoc(itemRef);
      return { id: updatedDoc.id, ...updatedDoc.data() };
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw new Error(`Failed to update portfolio item: ${error.message}`);
    }
  }

  /**
   * Delete portfolio item
   * @param {string} itemId - Portfolio item ID
   * @param {string} professionalId - Professional ID (for authorization)
   * @returns {Promise<boolean>} Success status
   */
  async deletePortfolioItem(itemId, professionalId) {
    try {
      const itemRef = doc(db, 'portfolio', itemId);
      const itemDoc = await getDoc(itemRef);

      if (!itemDoc.exists()) {
        throw new Error('Portfolio item not found');
      }

      // Verify ownership
      if (itemDoc.data().professionalId !== professionalId) {
        throw new Error('Unauthorized to delete this portfolio item');
      }

      // TODO: Delete associated images from Storage

      await deleteDoc(itemRef);
      return true;
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      throw new Error(`Failed to delete portfolio item: ${error.message}`);
    }
  }

  /**
   * Get featured portfolio items
   * @param {number} limit - Number of items to return
   * @returns {Promise<Array>} Featured portfolio items
   */
  async getFeaturedPortfolio(limit = 12) {
    try {
      const featuredQuery = query(
        collection(db, 'portfolio'),
        where('isPublic', '==', true),
        where('isFeatured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(featuredQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting featured portfolio:', error);
      throw new Error(`Failed to get featured portfolio: ${error.message}`);
    }
  }
}

// Export new booking and availability services
export { BookingService } from './bookings.js';
export { AvailabilityService } from './availability.js';

export const servicesService = new ServicesService();