/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        // Kalos Brand Colors (Project Chapter specification)
        brand: {
          DEFAULT: "#F74F4E",    // Kalos Coral
          hover: "#E94445",
          pressed: "#D13C3B", 
          subtle: "#FDEBEC"
        },
        navy: {
          DEFAULT: "#303F56",    // Deep Navy
          hover: "#2A394E",
          pressed: "#233141",
          subtle: "#E8EDF3"
        },
        gold: "#FCBE3C",
        "deep-coral": "#CA472B",
        rosy: "#D6868D",
        beige: "#F3E7DB",
        "kalos-white": "#FAFAFA",
        "kalos-black": "#261B15",
        brown: "#8C6E64",
        
        // Semantic colors
        success: "#16A34A",
        error: "#DC2626",
        warning: "#FCBE3C",
        info: "#2563EB"
      },
      fontFamily: {
        'display': ['Fraunces', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'base': '0 4px 16px rgba(0, 0, 0, 0.12)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
};