/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}'
  ],
  
  theme: {
    extend: {
      // Kalos E-commerce Brand Colors
      colors: {
        // Primary brand colors
        brand: {
          DEFAULT: '#F74F4E',  // Kalos Coral
          50: '#FEF2F2',
          100: '#FEE2E2', 
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#F74F4E',  // Main brand
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D'
        },
        
        // Secondary colors
        navy: {
          DEFAULT: '#303F56',  // Deep Navy
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#303F56'   // Main navy
        },
        
        // Accent colors
        gold: {
          DEFAULT: '#FCBE3C',  // Gold accent
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FCBE3C',  // Main gold
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F'
        },
        
        // Semantic colors
        success: '#10B981',
        warning: '#F59E0B', 
        error: '#EF4444',
        info: '#3B82F6'
      },
      
      // Typography
      fontFamily: {
        'fraunces': ['Fraunces', 'serif'],     // Display/Titles
        'inter': ['Inter', 'sans-serif'],      // UI/Body text
        'sans': ['Inter', 'sans-serif']        // Default
      },
      
      // Spacing extensions
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      
      // Custom shadows
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      
      // Border radius extensions
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem'
      }
    }
  },
  
  plugins: [
    // Add plugins as needed when installed
  ]
}
