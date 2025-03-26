/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', 'Open Sans', 'sans-serif'],
        heading: ['var(--font-abril)', 'Abril Fatface', 'serif'],
        subheading: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      colors: {
        background: '#FFFFFF',
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
          primary: '#1A1A2E',
          secondary: '#4A4A4A',
          dark: '#222222',
          muted: '#6B7280',
        },
        'primary-blue': '#00C4FF',
        'primary-gold': '#D4A017',
        'dark-blue': '#1A1A2E',
        'medium-blue': '#F0F0F0',
        'bbym-orange': '#F5A623',
        'bbym-orange-light': '#F7B84E',
        'bbym-black': '#1A1A2E',
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'rotate': 'rotate 120s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'ripple': {
          to: { transform: 'scale(30)', opacity: '0' },
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
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}