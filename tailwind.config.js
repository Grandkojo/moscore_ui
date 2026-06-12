/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f8fafc',
        surfaceHover: '#f1f5f9',
        primary: '#0ea5e9', // Sky blue to match the logo
        primaryHover: '#0284c7',
        border: '#e2e8f0',
        text: '#0f172a',
        textMuted: '#64748b'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
