/**
 * Professional Service - CRUD operations for professional management
 * Handles all professional-related data operations with Firestore
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
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase-config.js';
import { 
  createProfessionalProfile, 
  validateProfessionalProfile,
  SERVICE_CATEGORIES 
} from '../models/professional.js';

class ProfessionalService {
  /**
   * Create or update professional profile
   * @param {string} uid - User UID
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(uid, profileData) {
    try {
      const professionalRef = doc(db, 'professionals', uid);
      
      // Validate data before saving
      const validation = validateProfessionalProfile(profileData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
      }
      
      const updatedData = {
        ...profileData,
        updatedAt: serverTimestamp()
      };
      
      // Check if it's a new profile
      const existingDoc = await getDoc(professionalRef);
      if (!existingDoc.exists()) {
        updatedData.createdAt = serverTimestamp();
        updatedData.verification = {
          status: 'pending',
          submittedAt: serverTimestamp(),
          documents: {}
        };
        updatedData.status = 'inactive'; // Inactive until verified
        updatedData.stats = {
          totalServices: 0,
          totalBookings: 0,
          averageRating: 0,
          totalReviews: 0,
          responseRate: 0,
          lastActiveAt: serverTimestamp()
        };
      }
      
      await setDoc(professionalRef, updatedData, { merge: true });
      
      // Return the updated profile
      const updatedDoc = await getDoc(professionalRef);
      return { id: updatedDoc.id, ...updatedDoc.data() };
      
    } catch (error) {
      console.error('Error updating professional profile:', error);
      throw new Error(`Failed to update professional profile: ${error.message}`);
    }
  }

  /**
   * Get professional profile by UID
   * @param {string} uid - User UID
   * @returns {Promise<Object|null>} Professional profile or null
   */
  async getProfile(uid) {
    try {
      const professionalDoc = await getDoc(doc(db, 'professionals', uid));
      
      if (professionalDoc.exists()) {
        return { id: professionalDoc.id, ...professionalDoc.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting professional profile:', error);
      throw new Error(`Failed to get professional profile: ${error.message}`);
    }
  }

  /**
   * Get professional profile by ID (public view)
   * @param {string} professionalId - Professional ID
   * @returns {Promise<Object|null>} Public professional profile
   */
  async getPublicProfile(professionalId) {
    try {
      const profile = await this.getProfile(professionalId);
      
      if (!profile || profile.status !== 'active' || profile.verification?.status !== 'approved') {
        return null;
      }

      // Return only public information
      return {
        id: profile.id,
        personalInfo: {
          firstName: profile.personalInfo?.firstName,
          profileImage: profile.personalInfo?.profileImage
        },
        businessInfo: profile.businessInfo,
        location: {
          department: profile.location?.department,
          city: profile.location?.city,
          zone: profile.location?.zone,
          serviceRadius: profile.location?.serviceRadius,
          homeService: profile.location?.homeService
        },
        stats: profile.stats,
        createdAt: profile.createdAt
      };
    } catch (error) {
      console.error('Error getting public professional profile:', error);
      throw new Error(`Failed to get public professional profile: ${error.message}`);
    }
  }

  /**
   * Search professionals with filters and pagination
   * @param {Object} filters - Search filters
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Search results with pagination info
   */
  async searchProfessionals(filters = {}, pagination = {}) {
    try {
      let professionalQuery = collection(db, 'professionals');
      
      // NOTE: Esta query requiere índice compuesto en Firestore
      // Para crear el índice, usa el link autogenerado que aparece en los logs de la consola:
      // https://console.firebase.google.com/project/[PROJECT]/firestore/indexes?create_composite=...
      // 
      // Campos del índice requerido para búsqueda básica:
      // - status (==)
      // - verification.status (==) 
      // - __name__ (asc) - agregado automáticamente
      //
      // Si se usa con filtros adicionales (categoría, ubicación, orderBy), requerirá índices adicionales
      
      // Base filters for active professionals (simplified to avoid index)
      const constraints = [
        where('status', '==', 'active')
      ];
      
      // Apply category filter
      if (filters.category && SERVICE_CATEGORIES[filters.category.toUpperCase()]) {
        constraints.push(where('businessInfo.categories', 'array-contains', filters.category));
      }
      
      // Apply location filters
      if (filters.department) {
        constraints.push(where('location.department', '==', filters.department));
      }
      
      if (filters.city) {
        constraints.push(where('location.city', '==', filters.city));
      }
      
      // Apply rating filter (temporarily disabled to avoid index requirements)
      // if (filters.minRating && filters.minRating > 0) {
      //   constraints.push(where('stats.averageRating', '>=', filters.minRating));
      // }
      
      // Apply sorting (temporarily disabled to avoid index requirements)
      // const sortBy = filters.sortBy || 'stats.averageRating';
      // const sortOrder = filters.sortOrder || 'desc';
      // constraints.push(orderBy(sortBy, sortOrder));
      
      // Apply pagination
      const pageSize = pagination.limit || 12;
      constraints.push(limit(pageSize));
      
      if (pagination.startAfterDoc) {
        constraints.push(startAfter(pagination.startAfterDoc));
      }
      
      professionalQuery = query(professionalQuery, ...constraints);
      
      const snapshot = await getDocs(professionalQuery);
      const professionals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...this._getPublicFields(doc.data())
      }));
      
      return {
        professionals,
        hasMore: snapshot.docs.length === pageSize,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        total: snapshot.docs.length
      };
    } catch (error) {
      console.error('Error searching professionals:', error);
      throw new Error(`Failed to search professionals: ${error.message}`);
    }
  }

  /**
   * Upload profile image
   * @param {string} uid - User UID
   * @param {File} imageFile - Image file
   * @returns {Promise<string>} Image URL
   */
  async uploadProfileImage(uid, imageFile) {
    try {
      // Validate file
      if (!imageFile || !imageFile.type.startsWith('image/')) {
        throw new Error('Invalid image file');
      }
      
      if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image file too large (max 5MB)');
      }
      
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}_${imageFile.name}`;
      const imageRef = ref(storage, `professionals/${uid}/profile/${filename}`);
      
      // Upload image
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update profile with new image URL
      await this.updateProfile(uid, {
        personalInfo: {
          profileImage: downloadURL
        }
      });
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new Error(`Failed to upload profile image: ${error.message}`);
    }
  }

  /**
   * Upload verification documents
   * @param {string} uid - User UID
   * @param {Object} documents - Document files
   * @returns {Promise<Object>} Document URLs
   */
  async uploadVerificationDocuments(uid, documents) {
    try {
      const uploadedUrls = {};
      
      for (const [docType, file] of Object.entries(documents)) {
        if (file) {
          const timestamp = Date.now();
          const filename = `${docType}_${timestamp}_${file.name}`;
          const docRef = ref(storage, `professionals/${uid}/documents/${filename}`);
          
          const snapshot = await uploadBytes(docRef, file);
          uploadedUrls[docType] = await getDownloadURL(snapshot.ref);
        }
      }
      
      // Update professional profile with document URLs
      const currentProfile = await this.getProfile(uid);
      const updatedDocuments = {
        ...currentProfile.verification?.documents,
        ...uploadedUrls
      };
      
      await this.updateProfile(uid, {
        verification: {
          ...currentProfile.verification,
          documents: updatedDocuments,
          submittedAt: serverTimestamp()
        }
      });
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading verification documents:', error);
      throw new Error(`Failed to upload verification documents: ${error.message}`);
    }
  }

  /**
   * Update professional verification status (Admin only)
   * @param {string} professionalId - Professional ID
   * @param {string} status - New status (approved, rejected)
   * @param {string} reviewedBy - Admin UID
   * @param {string} [notes] - Review notes
   * @returns {Promise<boolean>} Success status
   */
  async updateVerificationStatus(professionalId, status, reviewedBy, notes = '') {
    try {
      const professionalRef = doc(db, 'professionals', professionalId);
      
      const updateData = {
        'verification.status': status,
        'verification.reviewedAt': serverTimestamp(),
        'verification.reviewedBy': reviewedBy,
        'verification.notes': notes,
        updatedAt: serverTimestamp()
      };
      
      // If approved, activate the professional
      if (status === 'approved') {
        updateData.status = 'active';
      }
      
      await updateDoc(professionalRef, updateData);
      
      return true;
    } catch (error) {
      console.error('Error updating verification status:', error);
      throw new Error(`Failed to update verification status: ${error.message}`);
    }
  }

  /**
   * Get professionals pending verification (Admin only)
   * @returns {Promise<Array>} Pending professionals
   */
  async getPendingVerifications() {
    try {
      const pendingQuery = query(
        collection(db, 'professionals'),
        where('verification.status', '==', 'pending'),
        orderBy('verification.submittedAt', 'desc')
      );
      
      const snapshot = await getDocs(pendingQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting pending verifications:', error);
      throw new Error(`Failed to get pending verifications: ${error.message}`);
    }
  }

  /**
   * Update professional statistics
   * @param {string} professionalId - Professional ID
   * @param {Object} statsUpdate - Statistics to update
   * @returns {Promise<boolean>} Success status
   */
  async updateStats(professionalId, statsUpdate) {
    try {
      const professionalRef = doc(db, 'professionals', professionalId);
      const updateData = { updatedAt: serverTimestamp() };
      
      // Handle incremental updates
      if (statsUpdate.totalBookings) {
        updateData['stats.totalBookings'] = increment(statsUpdate.totalBookings);
      }
      
      if (statsUpdate.totalServices) {
        updateData['stats.totalServices'] = increment(statsUpdate.totalServices);
      }
      
      if (statsUpdate.totalReviews) {
        updateData['stats.totalReviews'] = increment(statsUpdate.totalReviews);
      }
      
      // Handle direct updates
      if (statsUpdate.averageRating !== undefined) {
        updateData['stats.averageRating'] = statsUpdate.averageRating;
      }
      
      if (statsUpdate.responseRate !== undefined) {
        updateData['stats.responseRate'] = statsUpdate.responseRate;
      }
      
      if (statsUpdate.lastActiveAt) {
        updateData['stats.lastActiveAt'] = serverTimestamp();
      }
      
      await updateDoc(professionalRef, updateData);
      
      return true;
    } catch (error) {
      console.error('Error updating professional stats:', error);
      throw new Error(`Failed to update professional stats: ${error.message}`);
    }
  }

  /**
   * Deactivate professional account
   * @param {string} uid - User UID
   * @param {string} reason - Deactivation reason
   * @returns {Promise<boolean>} Success status
   */
  async deactivateProfile(uid, reason = 'User requested') {
    try {
      const professionalRef = doc(db, 'professionals', uid);
      
      await updateDoc(professionalRef, {
        status: 'inactive',
        deactivatedAt: serverTimestamp(),
        deactivationReason: reason,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error deactivating professional profile:', error);
      throw new Error(`Failed to deactivate professional profile: ${error.message}`);
    }
  }

  /**
   * Get featured professionals for homepage
   * @param {number} limit - Number of professionals to return
   * @returns {Promise<Array>} Featured professionals
   */
  async getFeaturedProfessionals(limit = 8) {
    try {
      // NOTE: Esta query requiere índice compuesto en Firestore para profesionales destacados
      // Para crear el índice, usa el link autogenerado que aparece en los logs de la consola:
      // https://console.firebase.google.com/project/[PROJECT]/firestore/indexes?create_composite=...
      // 
      // Campos del índice requerido para profesionales destacados:
      // - status (==)
      // - verification.status (==)
      // - stats.averageRating (>=)  
      // - stats.averageRating (desc) - para orderBy
      // - stats.totalReviews (desc) - para orderBy secundario
      // - __name__ (asc) - agregado automáticamente
      
      const featuredQuery = query(
        collection(db, 'professionals'),
        where('status', '==', 'active'),
        where('verification.status', '==', 'approved'),
        where('stats.averageRating', '>=', 4.0),
        orderBy('stats.averageRating', 'desc'),
        orderBy('stats.totalReviews', 'desc'),
        limit(limit)
      );
      
      const snapshot = await getDocs(featuredQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...this._getPublicFields(doc.data())
      }));
    } catch (error) {
      console.error('Error getting featured professionals:', error);
      throw new Error(`Failed to get featured professionals: ${error.message}`);
    }
  }

  /**
   * Get public fields for professional profile
   * @private
   * @param {Object} profile - Full professional profile
   * @returns {Object} Public fields only
   */
  _getPublicFields(profile) {
    return {
      personalInfo: {
        firstName: profile.personalInfo?.firstName,
        profileImage: profile.personalInfo?.profileImage
      },
      businessInfo: profile.businessInfo,
      location: {
        department: profile.location?.department,
        city: profile.location?.city,
        zone: profile.location?.zone,
        serviceRadius: profile.location?.serviceRadius,
        homeService: profile.location?.homeService
      },
      stats: profile.stats,
      createdAt: profile.createdAt
    };
  }
}

export const professionalService = new ProfessionalService();