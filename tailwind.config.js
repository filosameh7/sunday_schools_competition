/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['"Fredoka One"', 'cursive'],
        arabic: ['"Cairo"', 'sans-serif'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-12px)' },
          '30%': { transform: 'translateX(12px)' },
          '45%': { transform: 'translateX(-12px)' },
          '60%': { transform: 'translateX(12px)' },
          '75%': { transform: 'translateX(-6px)' },
          '90%': { transform: 'translateX(6px)' },
        },
        jumpBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-30px)' },
          '60%': { transform: 'translateY(-15px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #facc15, 0 0 20px #facc15' },
          '50%': { boxShadow: '0 0 20px #facc15, 0 0 60px #facc15' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(-40px)', opacity: 0 },
        },
        redFlash: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(220,38,38,0.35)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.3)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        jumpBounce: 'jumpBounce 0.6s ease-in-out',
        glow: 'glow 1.5s ease-in-out infinite',
        floatUp: 'floatUp 0.8s ease-out forwards',
        redFlash: 'redFlash 0.4s ease-in-out',
        sparkle: 'sparkle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
