/**
 * Utility to populate Firebase with test data
 * Run this from browser console to add test data
 */

import { db } from '../config/firebase-config.js';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function populateTestData() {
  try {
    console.log('🔥 Starting to populate Firebase with test data...');

    // 1. Create Maria Gonzalez professional profile
    const mariaProfile = {
      id: 'maria-gonzalez',
      handle: 'maria-gonzalez',
      status: 'active',
      personalInfo: {
        firstName: 'María González',
        lastName: 'Rodríguez',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        phone: '+59177123456',
        email: 'maria.gonzalez@kalosecommerce.com'
      },
      businessInfo: {
        businessName: 'María González Beauty Studio',
        description: 'Especialista en Maquillaje y Peinado Profesional',
        bio: 'Profesional certificada en maquillaje y peinado con más de 5 años de experiencia.',
        categories: ['makeup', 'hair', 'bridal'],
        experienceYears: 5,
        socialMedia: {
          instagram: 'https://instagram.com/maria_makeup_bo',
          facebook: 'https://facebook.com/MariaGonzalezMakeup',
          whatsapp: 'https://wa.me/59177123456'
        }
      },
      location: {
        department: 'Santa Cruz',
        city: 'Santa Cruz',
        zone: 'Plan 3000',
        serviceRadius: 15,
        homeService: true
      },
      verification: {
        status: 'approved',
        verifiedAt: serverTimestamp()
      },
      stats: {
        totalServices: 6,
        totalReviews: 127,
        averageRating: 4.8,
        completedBookings: 156
      },
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'professionals', 'maria-gonzalez'), mariaProfile);
    console.log('✅ María González profile created');

    // 2. Create services for María González
    const services = [
      {
        id: 'service-maquillaje-novia',
        professionalId: 'maria-gonzalez',
        basicInfo: {
          name: 'Maquillaje de Novia',
          description: 'Maquillaje completo para el día más especial, incluye prueba previa',
          category: 'makeup',
          duration: 120
        },
        pricing: {
          basePrice: 350,
          currency: 'BOB'
        },
        media: {
          images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=300&fit=crop']
        },
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'service-peinado-evento',
        professionalId: 'maria-gonzalez',
        basicInfo: {
          name: 'Peinado para Evento',
          description: 'Peinado elegante y duradero para eventos especiales',
          category: 'hair',
          duration: 90
        },
        pricing: {
          basePrice: 180,
          currency: 'BOB'
        },
        media: {
          images: ['https://images.unsplash.com/photo-1560869713-bf165a7c7e8b?w=500&h=300&fit=crop']
        },
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'service-maquillaje-social',
        professionalId: 'maria-gonzalez',
        basicInfo: {
          name: 'Maquillaje Social',
          description: 'Maquillaje para fiestas, reuniones y eventos sociales',
          category: 'makeup',
          duration: 60
        },
        pricing: {
          basePrice: 150,
          currency: 'BOB'
        },
        media: {
          images: ['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&h=300&fit=crop']
        },
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'service-corte-femenino',
        professionalId: 'maria-gonzalez',
        basicInfo: {
          name: 'Corte Femenino',
          description: 'Corte personalizado según tu estilo y tipo de rostro',
          category: 'hair',
          duration: 75
        },
        pricing: {
          basePrice: 120,
          currency: 'BOB'
        },
        media: {
          images: ['https://images.unsplash.com/photo-1522338242992-e1717c5718df?w=500&h=300&fit=crop']
        },
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'service-manicure-premium',
        professionalId: 'maria-gonzalez',
        basicInfo: {
          name: 'Manicure Premium',
          description: 'Manicure completo con productos de alta gama y nail art opcional',
          category: 'nails',
          duration: 90
        },
        pricing: {
          basePrice: 100,
          currency: 'BOB'
        },
        media: {
          images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=300&fit=crop']
        },
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'service-depilacion-facial',
        professionalId: 'maria-gonzalez',
        basicInfo: {
          name: 'Depilación Facial',
          description: 'Depilación con cera o pinzas para cejas y rostro',
          category: 'skincare',
          duration: 45
        },
        pricing: {
          basePrice: 80,
          currency: 'BOB'
        },
        media: {
          images: ['https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=300&fit=crop']
        },
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // Create all services
    for (const service of services) {
      await setDoc(doc(db, 'services', service.id), service);
      console.log(`✅ Service created: ${service.basicInfo.name}`);
    }

    // 3. Create some portfolio items
    const portfolioItems = [
      {
        id: 'portfolio-001',
        professionalId: 'maria-gonzalez',
        title: 'Maquillaje de Novia - Carolina',
        description: 'Maquillaje natural y elegante para boda de día',
        category: 'makeup',
        images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop'],
        visibility: 'public',
        featured: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'portfolio-002',
        professionalId: 'maria-gonzalez',
        title: 'Sesión Fotográfica - Andrea',
        description: 'Maquillaje editorial para sesión de fotos',
        category: 'photo',
        images: ['https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop'],
        visibility: 'public',
        featured: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'portfolio-003',
        professionalId: 'maria-gonzalez',
        title: 'Peinado de Graduación',
        description: 'Peinado elegante para ceremonia de graduación',
        category: 'hair',
        images: ['https://images.unsplash.com/photo-1560869713-bf165a7c7e8b?w=400&h=400&fit=crop'],
        visibility: 'public',
        featured: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // Create portfolio items
    for (const item of portfolioItems) {
      await setDoc(doc(db, 'portfolio', item.id), item);
      console.log(`✅ Portfolio item created: ${item.title}`);
    }

    console.log('🎉 Firebase test data population completed!');
    console.log('📊 Summary:');
    console.log('   - 1 Professional profile (María González)');
    console.log(`   - ${services.length} Services`);
    console.log(`   - ${portfolioItems.length} Portfolio items`);
    
    return {
      success: true,
      professional: mariaProfile,
      services: services.length,
      portfolio: portfolioItems.length
    };

  } catch (error) {
    console.error('🚨 Error populating Firebase:', error);
    throw error;
  }
}

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  window.populateFirebaseData = populateTestData;
}
