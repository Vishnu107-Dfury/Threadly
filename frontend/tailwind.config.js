/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4338CA',        // Deep Indigo-Violet
          'primary-hover': '#3730A3', // Indigo 800
          'primary-light': '#EEF2FF', // Indigo 50
          'primary-subtle': '#E0E7FF',// Indigo 100
          'primary-dark': '#312E81',  // Indigo 900
          accent: '#F97316',         // Warm Coral (Strictly for Add to Cart, Place Order, Set Ratio)
          'accent-hover': '#EA580C',  // Orange 600
          'accent-light': '#FFF7ED',  // Orange 50
          'accent-subtle': '#FFEDD5', // Orange 100
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Capped headings (desktop max ~36px-40px)
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px max
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
      },
      boxShadow: {
        'glass-nav': '0 4px 20px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)',
        'glass-nav-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glass-modal': '0 25px 50px -12px rgba(15, 23, 42, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
        'glass-modal-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
        'glass-drawer': '-10px 0 30px -5px rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
        'glass-drawer-dark': '-10px 0 30px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        'glass': '1.25rem', // 20px
        'glass-lg': '1.5rem', // 24px
      }
    },
  },
  plugins: [],
}
