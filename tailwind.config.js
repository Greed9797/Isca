/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      colors: {
        brand: {
          bg: '#000000',
          card: '#0a0a0a', // Fundo dos cards
          cardHover: '#111111',
          border: '#1f1f1f',
          accent: '#F55900', // Laranja W3
          accentHover: '#E05000',
          text: '#939393', // Cinza claro para textos
          textLight: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}
