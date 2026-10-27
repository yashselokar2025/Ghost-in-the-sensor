/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ghost: {
          dark: '#07090e',
          card: '#0d111a',
          border: '#1f293d',
          accent: '#10b981', // Ectoplasm green
          spooky: '#8b5cf6', // Phantom purple
          alert: '#ef4444', // Blood moon red
          warm: '#f59e0b', // Marigold Día de los Muertos orange
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 2s infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: 1 },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: 0.4 },
        }
      }
    },
  },
  plugins: [],
}
