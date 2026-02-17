/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff00ff',
        'neon-cyan': '#00ffff',
        'neon-purple': '#bf00ff',
        'neon-green': '#39ff14',
        'cyber-black': '#050505',
        'cyber-gray': '#121212',
      },
      boxShadow: {
        'glow-pink': '0 0 10px rgba(255, 0, 255, 0.7)',
        'glow-cyan': '0 0 10px rgba(0, 255, 255, 0.7)',
      }
    },
  },
  plugins: [],
}
