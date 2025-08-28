/**
 * Seed Demo Data for Booking System Testing
 * Creates demo professionals, services, and availability data
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "kalos-demo.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "kalos-demo",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "kalos-demo.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log('🌱 Starting demo data seeding...');

async function seedDemoData() {
  try {
    // 1. Create demo professionals
    console.log('👩‍💼 Creating demo professionals...');
    const professionals = await createDemoProfessionals();
    
    // 2. Create demo services for each professional
    console.log('✨ Creating demo services...');
    await createDemoServices(professionals);
    
    // 3. Create availability for next 30 days
    console.log('📅 Creating availability schedules...');
    await createDemoAvailability(professionals);
    
    console.log('✅ Demo data seeding completed successfully!');
    console.log(`
    🎉 Demo data created:
    - ${professionals.length} professionals
    - ${professionals.length * 3} services (3 per professional)
    - 30 days of availability for each professional
    
    📋 Next steps:
    1. Go to http://localhost:3000/marketplace
    2. Click "✨ Nueva Reserva" button  
    3. Follow the booking flow
    4. Test the complete reservation process
    `);
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  }
}

async function createDemoProfessionals() {
  const professionals = [
    {
      // User profile data
      userId: 'demo-professional-1',
      userType: 'professional',
      email: 'maria.gonzalez@kalos.demo',
      displayName: 'María González',
      phone: '+591 70123456',
      location: {
        city: 'La Paz',
        zone: 'Zona Sur',
        coordinates: { lat: -16.5167, lng: -68.1333 }
      },
      
      // Professional profile
      professionalProfile: {
        specialties: ['Maquillaje', 'Peinados', 'Cejas'],
        bio: 'Maquilladora profesional con 8 años de experiencia. Especializada en maquillaje de novias y eventos sociales. Certificada en técnicas internacionales.',
        experience: '8 años',
        certifications: ['Certificación Internacional en Maquillaje', 'Curso de Microblading'],
        portfolio: [
          {
            title: 'Maquillaje de Novia',
            description: 'Maquillaje completo para boda',
            imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
            category: 'makeup'
          }
        ],
        serviceAreas: ['home', 'office'],
        rating: 4.9,
        completedBookings: 156,
        verified: true,
        featured: true
      },
      
      // Role data
      availableRoles: ['professional'],
      activeRole: 'professional',
      
      // Metadata
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      published: true,
      verified: true
    },
    
    {
      userId: 'demo-professional-2',
      userType: 'professional', 
      email: 'ana.rodriguez@kalos.demo',
      displayName: 'Ana Rodríguez',
      phone: '+591 71234567',
      location: {
        city: 'Santa Cruz',
        zone: 'Centro',
        coordinates: { lat: -17.7833, lng: -63.1821 }
      },
      
      professionalProfile: {
        specialties: ['Uñas', 'Manicure', 'Pedicure'],
        bio: 'Nail artist especializada en diseños creativos y técnicas de última tendencia. Más de 5 años embelleciendo las uñas de mis clientas.',
        experience: '5 años',
        certifications: ['Certificación en Nail Art', 'Curso de Uñas Acrílicas'],
        portfolio: [
          {
            title: 'Diseño de Uñas Artísticas',
            description: 'Manicure con diseños personalizados',
            imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
            category: 'nails'
          }
        ],
        serviceAreas: ['home', 'shop'],
        rating: 4.8,
        completedBookings: 98,
        verified: true,
        featured: true
      },
      
      availableRoles: ['professional'],
      activeRole: 'professional',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      published: true,
      verified: true
    },
    
    {
      userId: 'demo-professional-3',
      userType: 'professional',
      email: 'carmen.silva@kalos.demo', 
      displayName: 'Carmen Silva',
      phone: '+591 72345678',
      location: {
        city: 'Cochabamba',
        zone: 'Queru Queru',
        coordinates: { lat: -17.3895, lng: -66.1568 }
      },
      
      professionalProfile: {
        specialties: ['Cabello', 'Cortes', 'Peinados', 'Tratamientos'],
        bio: 'Estilista profesional con formación internacional. Experta en cortes modernos, coloración y tratamientos capilares. Tu cabello en las mejores manos.',
        experience: '10 años',
        certifications: ['Certificación Internacional en Coloración', 'Curso de Cortes Modernos'],
        portfolio: [
          {
            title: 'Corte y Peinado Moderno',
            description: 'Transformación completa de look',
            imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
            category: 'hair'
          }
        ],
        serviceAreas: ['home'],
        rating: 4.7,
        completedBookings: 203,
        verified: true,
        featured: false
      },
      
      availableRoles: ['professional'],
      activeRole: 'professional',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      published: true,
      verified: true
    }
  ];

  const createdProfessionals = [];
  
  for (const professionalData of professionals) {
    try {
      // Create user document
      await setDoc(doc(db, 'users', professionalData.userId), {
        userType: professionalData.userType,
        email: professionalData.email,
        displayName: professionalData.displayName,
        phone: professionalData.phone,
        location: professionalData.location,
        professionalProfile: professionalData.professionalProfile,
        availableRoles: professionalData.availableRoles,
        activeRole: professionalData.activeRole,
        createdAt: professionalData.createdAt,
        updatedAt: professionalData.updatedAt,
        verified: professionalData.verified
      });
      
      // Create professional document
      const professionalRef = await addDoc(collection(db, 'professionals'), {
        userId: professionalData.userId,
        name: professionalData.displayName,
        email: professionalData.email,
        phone: professionalData.phone,
        location: professionalData.location,
        bio: professionalData.professionalProfile.bio,
        specialties: professionalData.professionalProfile.specialties,
        experience: professionalData.professionalProfile.experience,
        certifications: professionalData.professionalProfile.certifications,
        portfolio: professionalData.professionalProfile.portfolio,
        serviceAreas: professionalData.professionalProfile.serviceAreas,
        rating: professionalData.professionalProfile.rating,
        reviewCount: Math.floor(professionalData.professionalProfile.completedBookings * 0.7),
        completedBookings: professionalData.professionalProfile.completedBookings,
        verified: professionalData.professionalProfile.verified,
        featured: professionalData.professionalProfile.featured,
        published: professionalData.published,
        createdAt: professionalData.createdAt,
        updatedAt: professionalData.updatedAt
      });
      
      createdProfessionals.push({
        id: professionalRef.id,
        userId: professionalData.userId,
        name: professionalData.displayName,
        specialties: professionalData.professionalProfile.specialties
      });
      
      console.log(`✅ Created professional: ${professionalData.displayName} (${professionalRef.id})`);
      
    } catch (error) {
      console.error(`❌ Error creating professional ${professionalData.displayName}:`, error);
    }
  }
  
  return createdProfessionals;
}

async function createDemoServices(professionals) {
  const serviceTemplates = {
    makeup: [
      { name: 'Maquillaje Social', price: 150, duration: 60, description: 'Maquillaje para eventos sociales y citas especiales' },
      { name: 'Maquillaje de Novia', price: 350, duration: 120, description: 'Maquillaje completo para el día más especial' },
      { name: 'Maquillaje de Fiesta', price: 200, duration: 90, description: 'Maquillaje glamouroso para fiestas y celebraciones' }
    ],
    nails: [
      { name: 'Manicure Clásico', price: 80, duration: 45, description: 'Manicure tradicional con esmaltado' },
      { name: 'Uñas Decoradas', price: 120, duration: 90, description: 'Diseños artísticos y decoración personalizada' },
      { name: 'Manicure y Pedicure', price: 150, duration: 120, description: 'Servicio completo de manos y pies' }
    ],
    hair: [
      { name: 'Corte y Peinado', price: 100, duration: 75, description: 'Corte moderno y peinado profesional' },
      { name: 'Peinado para Eventos', price: 180, duration: 90, description: 'Peinado elegante para ocasiones especiales' },
      { name: 'Tratamiento Capilar', price: 250, duration: 120, description: 'Tratamiento profundo para revitalizar el cabello' }
    ]
  };

  for (const professional of professionals) {
    // Determine service category based on specialties
    let category = 'makeup'; // default
    if (professional.specialties.some(s => s.toLowerCase().includes('uña') || s.toLowerCase().includes('manicure'))) {
      category = 'nails';
    } else if (professional.specialties.some(s => s.toLowerCase().includes('cabello') || s.toLowerCase().includes('corte'))) {
      category = 'hair';
    }
    
    const services = serviceTemplates[category];
    
    for (const serviceTemplate of services) {
      try {
        await addDoc(collection(db, 'services'), {
          professionalId: professional.id,
          professionalUserId: professional.userId,
          professionalName: professional.name,
          
          name: serviceTemplate.name,
          description: serviceTemplate.description,
          category: category,
          subcategory: category === 'makeup' ? 'social' : category === 'nails' ? 'manicure' : 'styling',
          
          pricing: {
            basePrice: serviceTemplate.price,
            currency: 'BOB'
          },
          
          duration: serviceTemplate.duration,
          
          serviceType: {
            homeService: true,
            inShop: false
          },
          
          requirements: [],
          includes: [
            'Productos profesionales incluidos',
            'Asesoría personalizada',
            'Garantía de satisfacción'
          ],
          
          tags: professional.specialties,
          
          published: true,
          featured: Math.random() > 0.5,
          
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log(`  ✅ Created service: ${serviceTemplate.name} for ${professional.name}`);
        
      } catch (error) {
        console.error(`  ❌ Error creating service ${serviceTemplate.name}:`, error);
      }
    }
  }
}

async function createDemoAvailability(professionals) {
  // Generate availability for next 30 days
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 30);
  
  for (const professional of professionals) {
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay(); // 0 = Sunday
      
      // Skip Sundays (day 0) - professionals don't work on Sundays
      if (dayOfWeek === 0) continue;
      
      // Create time slots for working days
      const timeSlots = generateTimeSlots();
      
      try {
        await addDoc(collection(db, 'availability'), {
          professionalId: professional.id,
          professionalUserId: professional.userId,
          date: dateStr,
          dayOfWeek: dayOfWeek,
          
          baseSchedule: {
            start: '09:00',
            end: '18:00',
            lunchBreak: {
              start: '13:00',
              end: '14:00'
            }
          },
          
          timeSlots: timeSlots,
          isWorkingDay: true,
          exceptions: [],
          
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
      } catch (error) {
        console.error(`❌ Error creating availability for ${professional.name} on ${dateStr}:`, error);
      }
    }
    
    console.log(`✅ Created 30 days of availability for ${professional.name}`);
  }
}

function generateTimeSlots() {
  const slots = [];
  const workingHours = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    // Lunch break from 13:00 to 14:00
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' }
  ];
  
  for (const slot of workingHours) {
    slots.push({
      start: slot.start,
      end: slot.end,
      available: true,
      bookingId: null,
      locked: false,
      lockedUntil: null
    });
  }
  
  return slots;
}

// Run the seeding
seedDemoData().then(() => {
  console.log('🎉 Demo data seeding process completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Demo data seeding failed:', error);
  process.exit(1);
});