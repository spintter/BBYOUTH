/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', 'Open Sans', 'sans-serif'],
        heading: ['var(--font-abril)', 'Abril Fatface', 'serif'],
        subheading: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      colors: {
        background: '#1A1A1A',
        primary: {
          DEFAULT: '#4A2C2A',
          dark: '#3A1C1A',
          light: '#5A3C3A',
        },
        secondary: {
          DEFAULT: '#F5E6CC',
          dark: '#E5D6BC',
          light: '#FFF6DC',
        },
        accent: {
          DEFAULT: '#D4AF37',
          dark: '#B49027',
          light: '#E4BF47',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#F5E6CC',
          dark: '#222222',
          muted: '#6B7280',
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 10s infinite ease-in-out',
        'rotate': 'rotate 120s linear infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 15px 40px rgba(212, 175, 55, 0.6)' },
        },
        'float': {
          '0%': { transform: 'translate(0, 0)', opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'translate(30px, 30px)', opacity: '0' },
        },
        'rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}