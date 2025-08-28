/**
 * Setup Demo User for Testing
 * Creates a demo customer user that can be used to test the booking system
 */

console.log('👤 Setting up demo user for testing...');

// Demo user data - this will be stored in localStorage for development
const demoUser = {
  uid: 'demo-customer-123',
  email: 'cliente.demo@kalos.com',
  displayName: 'Cliente Demo',
  emailVerified: true
};

const demoProfile = {
  userType: 'customer',
  email: 'cliente.demo@kalos.com',
  displayName: 'Cliente Demo',
  phone: '+591 70000000',
  location: {
    city: 'La Paz',
    zone: 'Zona Sur',
    address: 'Calle 21 #123, Zona Sur',
    coordinates: { lat: -16.5167, lng: -68.1333 }
  },
  
  customerProfile: {
    preferences: ['maquillaje', 'uñas'],
    favoriteServices: [],
    bookingHistory: []
  },
  
  availableRoles: ['customer'],
  activeRole: 'customer',
  verified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Store in localStorage (for development mode)
if (typeof localStorage !== 'undefined') {
  localStorage.setItem('demoUser', JSON.stringify(demoUser));
  localStorage.setItem('demoProfile', JSON.stringify(demoProfile));
  console.log('✅ Demo user stored in localStorage');
} else {
  console.log('📝 Demo user data prepared:');
  console.log('User:', demoUser);
  console.log('Profile:', demoProfile);
}

console.log(`
🎉 Demo user setup completed!

👤 Demo User Details:
- Email: ${demoUser.email}
- Name: ${demoUser.displayName}
- Role: Customer
- Location: La Paz, Zona Sur

📋 To use this demo user:
1. Open the browser console (F12)
2. Run: localStorage.setItem('demoUser', '${JSON.stringify(demoUser).replace(/'/g, "\\'")}')
3. Run: localStorage.setItem('demoProfile', '${JSON.stringify(demoProfile).replace(/'/g, "\\'")}')
4. Refresh the page
5. You'll be automatically logged in as the demo user

🚀 Then you can:
- Go to /marketplace 
- Click "✨ Nueva Reserva"
- Test the complete booking flow
`);

export { demoUser, demoProfile };