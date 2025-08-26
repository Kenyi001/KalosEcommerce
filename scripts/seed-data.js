#!/usr/bin/env node

/**
 * Seed Data Script for Professional Management System
 * 
 * This script populates the Firestore database with sample data for:
 * - Professional profiles
 * - Services
 * - Portfolio items
 * - Reviews
 * 
 * Usage:
 * node scripts/seed-data.js
 * 
 * Environment Variables:
 * VITE_ENABLE_EMULATORS - Set to 'true' to use Firebase emulators
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_example_key",
  authDomain: "kalos-ecommerce.firebaseapp.com",
  projectId: "kalos-ecommerce",
  storageBucket: "kalos-ecommerce.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:example"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Connect to emulators if enabled
const useEmulators = process.env.VITE_ENABLE_EMULATORS === 'true';
if (useEmulators) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('🔧 Connected to Firebase emulators');
  } catch (error) {
    console.log('ℹ️ Emulators already connected or not available');
  }
}

// Sample data
const sampleProfessionals = [
  {
    uid: 'prof_001',
    email: 'maria.rodriguez@kalos.bo',
    personalInfo: {
      firstName: 'María',
      lastName: 'Rodríguez',
      phone: '70123456',
      birthDate: '1990-05-15',
      gender: 'female',
      profileImage: ''
    },
    businessInfo: {
      businessName: 'Estudio de Belleza María',
      description: 'Especialista en cortes de cabello modernos y tratamientos capilares. Con más de 8 años de experiencia en el rubro de la belleza.',
      categories: ['hair', 'makeup'],
      yearsExperience: 8,
      certifications: ['Certificación en Colorimetría Avanzada', 'Curso de Maquillaje Profesional'],
      socialMedia: {
        instagram: '@mariastudio',
        facebook: 'Estudio María',
        whatsapp: '70123456'
      }
    },
    location: {
      department: 'La Paz',
      city: 'La Paz',
      zone: 'Zona Sur',
      address: 'Av. Montenegro #2450',
      coordinates: { lat: -16.5000, lng: -68.1193 },
      homeService: true,
      serviceRadius: 15
    },
    verification: {
      status: 'approved',
      submittedAt: new Date('2024-01-15'),
      verifiedAt: new Date('2024-01-16'),
      documents: {
        idCard: 'verified',
        businessLicense: 'verified',
        certifications: ['cert1.pdf', 'cert2.pdf']
      },
      notes: 'Documentos completos y verificados'
    },
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    stats: {
      totalServices: 12,
      totalReviews: 45,
      averageRating: 4.8,
      totalBookings: 230
    }
  },
  {
    uid: 'prof_002', 
    email: 'carlos.mendoza@kalos.bo',
    personalInfo: {
      firstName: 'Carlos',
      lastName: 'Mendoza',
      phone: '70234567',
      birthDate: '1985-09-22',
      gender: 'male',
      profileImage: ''
    },
    businessInfo: {
      businessName: 'Barbería Mendoza',
      description: 'Barbería tradicional con servicios modernos. Especialistas en cortes masculinos clásicos y contemporáneos.',
      categories: ['hair', 'eyebrows'],
      yearsExperience: 12,
      certifications: ['Certificación en Barbería Clásica', 'Curso de Diseño de Cejas'],
      socialMedia: {
        instagram: '@barberiamendoza',
        facebook: 'Barbería Mendoza',
        whatsapp: '70234567'
      }
    },
    location: {
      department: 'Santa Cruz',
      city: 'Santa Cruz de la Sierra',
      zone: 'Centro',
      address: 'Calle Libertad #456',
      coordinates: { lat: -17.7834, lng: -63.1821 },
      homeService: false,
      serviceRadius: 0
    },
    verification: {
      status: 'approved',
      submittedAt: new Date('2024-01-20'),
      verifiedAt: new Date('2024-01-21'),
      documents: {
        idCard: 'verified',
        businessLicense: 'verified',
        certifications: ['barber_cert.pdf']
      },
      notes: 'Excelente trayectoria profesional'
    },
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21'),
    stats: {
      totalServices: 8,
      totalReviews: 32,
      averageRating: 4.6,
      totalBookings: 180
    }
  },
  {
    uid: 'prof_003',
    email: 'ana.silva@kalos.bo',
    personalInfo: {
      firstName: 'Ana',
      lastName: 'Silva',
      phone: '70345678',
      birthDate: '1992-03-10',
      gender: 'female',
      profileImage: ''
    },
    businessInfo: {
      businessName: 'Nail Art by Ana',
      description: 'Especialista en nail art, manicura y pedicura. Diseños únicos y personalizados para cada cliente.',
      categories: ['nails', 'skincare'],
      yearsExperience: 6,
      certifications: ['Certificación en Nail Art Avanzado', 'Curso de Cuidado de Piel'],
      socialMedia: {
        instagram: '@nailartana',
        facebook: 'Nail Art by Ana',
        whatsapp: '70345678'
      }
    },
    location: {
      department: 'Cochabamba',
      city: 'Cochabamba',
      zone: 'Norte',
      address: 'Av. América #789',
      coordinates: { lat: -17.3895, lng: -66.1568 },
      homeService: true,
      serviceRadius: 10
    },
    verification: {
      status: 'approved',
      submittedAt: new Date('2024-02-01'),
      verifiedAt: new Date('2024-02-02'),
      documents: {
        idCard: 'verified',
        businessLicense: 'verified',
        certifications: ['nails_cert.pdf']
      },
      notes: 'Portafolio impresionante'
    },
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-02'),
    stats: {
      totalServices: 15,
      totalReviews: 28,
      averageRating: 4.9,
      totalBookings: 150
    }
  },
  {
    uid: 'prof_004',
    email: 'lucia.morales@kalos.bo',
    personalInfo: {
      firstName: 'Lucía',
      lastName: 'Morales',
      phone: '70456789',
      birthDate: '1988-12-05',
      gender: 'female',
      profileImage: ''
    },
    businessInfo: {
      businessName: 'Lucía Spa & Beauty',
      description: 'Centro de belleza integral. Ofrecemos servicios de spa, masajes relajantes y tratamientos faciales.',
      categories: ['massage', 'skincare', 'makeup'],
      yearsExperience: 10,
      certifications: ['Certificación en Terapias de Spa', 'Curso de Cosmetología'],
      socialMedia: {
        instagram: '@luciaspabeauty',
        facebook: 'Lucía Spa & Beauty',
        whatsapp: '70456789'
      }
    },
    location: {
      department: 'La Paz',
      city: 'El Alto',
      zone: 'Villa Adela',
      address: 'Calle 16 de Julio #321',
      coordinates: { lat: -16.5000, lng: -68.1500 },
      homeService: true,
      serviceRadius: 20
    },
    verification: {
      status: 'approved',
      submittedAt: new Date('2024-02-10'),
      verifiedAt: new Date('2024-02-11'),
      documents: {
        idCard: 'verified',
        businessLicense: 'verified',
        certifications: ['spa_cert.pdf', 'cosm_cert.pdf']
      },
      notes: 'Instalaciones excelentes'
    },
    status: 'active',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-11'),
    stats: {
      totalServices: 20,
      totalReviews: 52,
      averageRating: 4.7,
      totalBookings: 280
    }
  }
];

const sampleServices = [
  // María's services
  {
    professionalId: 'prof_001',
    basicInfo: {
      name: 'Corte y Peinado Moderno',
      category: 'hair',
      description: 'Corte de cabello personalizado según tu tipo de rostro, incluye lavado, corte, secado y peinado.',
      duration: 90,
      price: 180,
      images: []
    },
    details: {
      whatIncludes: ['Consulta personalizada', 'Lavado con productos premium', 'Corte especializado', 'Secado y peinado'],
      requirements: ['Cabello limpio opcional', 'Comunicar alergias'],
      recommendations: ['Mantener corte cada 6-8 semanas', 'Usar productos recomendados']
    },
    availability: {
      workingHours: {
        monday: { start: '09:00', end: '18:00', available: true },
        tuesday: { start: '09:00', end: '18:00', available: true },
        wednesday: { start: '09:00', end: '18:00', available: true },
        thursday: { start: '09:00', end: '18:00', available: true },
        friday: { start: '09:00', end: '19:00', available: true },
        saturday: { start: '08:00', end: '17:00', available: true },
        sunday: { start: '10:00', end: '15:00', available: true }
      },
      blockedDates: [],
      advanceBooking: 2
    },
    location: {
      inSalon: true,
      atHome: true,
      homeServiceFee: 50
    },
    status: 'active',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    professionalId: 'prof_001',
    basicInfo: {
      name: 'Coloración y Mechas',
      category: 'hair',
      description: 'Servicio completo de coloración con técnicas avanzadas. Incluye decoloración, aplicación de color y tratamiento.',
      duration: 180,
      price: 350,
      images: []
    },
    details: {
      whatIncludes: ['Consulta de color', 'Prueba de mechón', 'Decoloración si es necesario', 'Aplicación de color', 'Tratamiento nutritivo'],
      requirements: ['Cabello sin tratamientos químicos recientes', 'Prueba de alergia 48h antes'],
      recommendations: ['Usar champú para cabello teñido', 'Tratamiento cada 15 días']
    },
    availability: {
      workingHours: {
        monday: { start: '09:00', end: '15:00', available: true },
        tuesday: { start: '09:00', end: '15:00', available: true },
        wednesday: { start: '09:00', end: '15:00', available: true },
        thursday: { start: '09:00', end: '15:00', available: true },
        friday: { start: '09:00', end: '16:00', available: true },
        saturday: { start: '08:00', end: '14:00', available: true },
        sunday: { start: '', end: '', available: false }
      },
      blockedDates: [],
      advanceBooking: 3
    },
    location: {
      inSalon: true,
      atHome: false,
      homeServiceFee: 0
    },
    status: 'active',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  // Carlos's services
  {
    professionalId: 'prof_002',
    basicInfo: {
      name: 'Corte Masculino Clásico',
      category: 'hair',
      description: 'Corte tradicional de barbería con acabado profesional. Incluye lavado, corte, arreglo de barba y bigote.',
      duration: 45,
      price: 80,
      images: []
    },
    details: {
      whatIncludes: ['Lavado', 'Corte tradicional', 'Arreglo de barba', 'Arreglo de bigote', 'Loción refrescante'],
      requirements: ['Ninguno específico'],
      recommendations: ['Corte cada 3-4 semanas', 'Cuidado diario de barba']
    },
    availability: {
      workingHours: {
        monday: { start: '08:00', end: '19:00', available: true },
        tuesday: { start: '08:00', end: '19:00', available: true },
        wednesday: { start: '08:00', end: '19:00', available: true },
        thursday: { start: '08:00', end: '19:00', available: true },
        friday: { start: '08:00', end: '20:00', available: true },
        saturday: { start: '07:00', end: '18:00', available: true },
        sunday: { start: '', end: '', available: false }
      },
      blockedDates: [],
      advanceBooking: 1
    },
    location: {
      inSalon: true,
      atHome: false,
      homeServiceFee: 0
    },
    status: 'active',
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  },
  // Ana's services
  {
    professionalId: 'prof_003',
    basicInfo: {
      name: 'Manicura Completa con Diseño',
      category: 'nails',
      description: 'Manicura profesional con diseño personalizado. Incluye limado, cutícula, base, color y arte.',
      duration: 120,
      price: 120,
      images: []
    },
    details: {
      whatIncludes: ['Limpieza y desinfección', 'Limado y forma', 'Cuidado de cutícula', 'Base protectora', 'Dos capas de color', 'Diseño personalizado', 'Top coat'],
      requirements: ['Uñas naturales o artificiales'],
      recommendations: ['Retoque cada 2-3 semanas', 'Usar aceite para cutícula']
    },
    availability: {
      workingHours: {
        monday: { start: '09:00', end: '18:00', available: true },
        tuesday: { start: '09:00', end: '18:00', available: true },
        wednesday: { start: '09:00', end: '18:00', available: true },
        thursday: { start: '09:00', end: '18:00', available: true },
        friday: { start: '09:00', end: '19:00', available: true },
        saturday: { start: '08:00', end: '17:00', available: true },
        sunday: { start: '10:00', end: '16:00', available: true }
      },
      blockedDates: [],
      advanceBooking: 2
    },
    location: {
      inSalon: true,
      atHome: true,
      homeServiceFee: 30
    },
    status: 'active',
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-02-02')
  },
  // Lucía's services
  {
    professionalId: 'prof_004',
    basicInfo: {
      name: 'Masaje Relajante Completo',
      category: 'massage',
      description: 'Masaje corporal completo con aceites esenciales para relajación profunda y alivio del estrés.',
      duration: 90,
      price: 200,
      images: []
    },
    details: {
      whatIncludes: ['Consulta inicial', 'Masaje corporal completo', 'Aceites esenciales premium', 'Ambiente relajante', 'Hidratación post-masaje'],
      requirements: ['Comunicar lesiones o condiciones médicas', 'Evitar comida pesada 2h antes'],
      recommendations: ['Hidratarse después del masaje', 'Descansar el resto del día']
    },
    availability: {
      workingHours: {
        monday: { start: '10:00', end: '18:00', available: true },
        tuesday: { start: '10:00', end: '18:00', available: true },
        wednesday: { start: '10:00', end: '18:00', available: true },
        thursday: { start: '10:00', end: '18:00', available: true },
        friday: { start: '10:00', end: '19:00', available: true },
        saturday: { start: '09:00', end: '17:00', available: true },
        sunday: { start: '11:00', end: '16:00', available: true }
      },
      blockedDates: [],
      advanceBooking: 1
    },
    location: {
      inSalon: true,
      atHome: true,
      homeServiceFee: 80
    },
    status: 'active',
    createdAt: new Date('2024-02-11'),
    updatedAt: new Date('2024-02-11')
  }
];

const samplePortfolio = [
  // María's portfolio
  {
    professionalId: 'prof_001',
    title: 'Corte Bob Moderno',
    description: 'Transformación completa con corte bob asimétrico y balayage sutil.',
    category: 'hair',
    images: [],
    beforeAfter: {
      before: '',
      after: ''
    },
    tags: ['corte', 'bob', 'moderno', 'balayage'],
    isPublic: true,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    professionalId: 'prof_001',
    title: 'Maquillaje Natural para Novias',
    description: 'Look natural y elegante perfecto para el día más especial.',
    category: 'makeup',
    images: [],
    beforeAfter: {
      before: '',
      after: ''
    },
    tags: ['maquillaje', 'novias', 'natural', 'elegante'],
    isPublic: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  // Carlos's portfolio
  {
    professionalId: 'prof_002',
    title: 'Corte Fade Clásico',
    description: 'Corte degradado clásico con acabado perfecto y barba bien definida.',
    category: 'hair',
    images: [],
    beforeAfter: {
      before: '',
      after: ''
    },
    tags: ['fade', 'masculino', 'clásico', 'barba'],
    isPublic: true,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  // Ana's portfolio
  {
    professionalId: 'prof_003',
    title: 'Nail Art Geométrico',
    description: 'Diseño geométrico moderno en tonos nude con detalles dorados.',
    category: 'nails',
    images: [],
    beforeAfter: {
      before: '',
      after: ''
    },
    tags: ['nailart', 'geometrico', 'nude', 'dorado'],
    isPublic: true,
    createdAt: new Date('2024-02-03'),
    updatedAt: new Date('2024-02-03')
  },
  {
    professionalId: 'prof_003',
    title: 'Manicura Francesa Moderna',
    description: 'Francesa reinventada con líneas coloridas y acabado brillante.',
    category: 'nails',
    images: [],
    beforeAfter: {
      before: '',
      after: ''
    },
    tags: ['francesa', 'moderno', 'colorido', 'brillante'],
    isPublic: true,
    createdAt: new Date('2024-02-04'),
    updatedAt: new Date('2024-02-04')
  }
];

const sampleReviews = [
  // Reviews for María
  {
    professionalId: 'prof_001',
    clientId: 'client_001',
    clientName: 'Sofia Martinez',
    serviceId: 'service_001',
    serviceName: 'Corte y Peinado Moderno',
    rating: 5,
    comment: 'Excelente servicio! María entendió perfectamente lo que quería y el resultado superó mis expectativas. El salón es muy acogedor y profesional.',
    images: [],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    professionalId: 'prof_001',
    clientId: 'client_002',
    clientName: 'Carmen López',
    serviceId: 'service_002',
    serviceName: 'Coloración y Mechas',
    rating: 5,
    comment: 'Increíble trabajo con el color. Las mechas quedaron naturales y el color es exactamente lo que pedí. Muy recomendada!',
    images: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  // Reviews for Carlos
  {
    professionalId: 'prof_002',
    clientId: 'client_003',
    clientName: 'Miguel Torres',
    serviceId: 'service_003',
    serviceName: 'Corte Masculino Clásico',
    rating: 5,
    comment: 'La mejor barbería de Santa Cruz. Carlos es un maestro en cortes clásicos y el ambiente es muy profesional.',
    images: [],
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  },
  // Reviews for Ana
  {
    professionalId: 'prof_003',
    clientId: 'client_004',
    clientName: 'Isabella Rojas',
    serviceId: 'service_004',
    serviceName: 'Manicura Completa con Diseño',
    rating: 5,
    comment: 'Ana es una artista! Mis uñas quedaron perfectas y el diseño era exactamente lo que tenía en mente. Muy recomendada.',
    images: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  // Reviews for Lucía
  {
    professionalId: 'prof_004',
    clientId: 'client_005',
    clientName: 'Patricia Vargas',
    serviceId: 'service_005',
    serviceName: 'Masaje Relajante Completo',
    rating: 5,
    comment: 'El mejor masaje que he tenido en mucho tiempo. Lucía tiene manos mágicas y el ambiente del spa es muy relajante.',
    images: [],
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12')
  }
];

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Seed professionals
    console.log('👥 Creating professional profiles...');
    for (const professional of sampleProfessionals) {
      const docRef = doc(db, 'professionals', professional.uid);
      await setDoc(docRef, {
        ...professional,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✓ Created professional: ${professional.businessInfo.businessName}`);
    }

    // Seed services
    console.log('💼 Creating services...');
    for (const service of sampleServices) {
      const docRef = await addDoc(collection(db, 'services'), {
        ...service,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✓ Created service: ${service.basicInfo.name}`);
    }

    // Seed portfolio items
    console.log('🎨 Creating portfolio items...');
    for (const portfolioItem of samplePortfolio) {
      const docRef = await addDoc(collection(db, 'portfolio'), {
        ...portfolioItem,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✓ Created portfolio item: ${portfolioItem.title}`);
    }

    // Seed reviews
    console.log('⭐ Creating reviews...');
    for (const review of sampleReviews) {
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...review,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✓ Created review for: ${review.serviceName}`);
    }

    // Create sample categories
    console.log('🏷️ Creating service categories...');
    const categories = [
      { id: 'hair', name: 'Cabello', description: 'Servicios de peluquería y estilismo', icon: 'hair' },
      { id: 'nails', name: 'Uñas', description: 'Manicura, pedicura y nail art', icon: 'nails' },
      { id: 'makeup', name: 'Maquillaje', description: 'Maquillaje profesional y artístico', icon: 'makeup' },
      { id: 'skincare', name: 'Cuidado de piel', description: 'Tratamientos faciales y cuidado de la piel', icon: 'skincare' },
      { id: 'massage', name: 'Masajes', description: 'Masajes terapéuticos y relajantes', icon: 'massage' },
      { id: 'eyebrows', name: 'Cejas', description: 'Diseño y arreglo de cejas', icon: 'eyebrows' },
      { id: 'eyelashes', name: 'Pestañas', description: 'Extensiones y tratamientos de pestañas', icon: 'eyelashes' }
    ];

    for (const category of categories) {
      const docRef = doc(db, 'categories', category.id);
      await setDoc(docRef, {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✓ Created category: ${category.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   • ${sampleProfessionals.length} professionals created`);
    console.log(`   • ${sampleServices.length} services created`);
    console.log(`   • ${samplePortfolio.length} portfolio items created`);
    console.log(`   • ${sampleReviews.length} reviews created`);
    console.log(`   • ${categories.length} categories created`);
    console.log('');
    console.log('🚀 Your Kalos E-commerce platform is now ready with sample data!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase, sampleProfessionals, sampleServices, samplePortfolio, sampleReviews };