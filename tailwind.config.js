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
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#000000',
        primary: {
          DEFAULT: '#8B0000',
          dark: '#700000',
          light: '#A31919',
        },
        secondary: {
          DEFAULT: '#006400',
          dark: '#004600',
          light: '#1A7A1A',
        },
        accent: {
          DEFAULT: '#FFD700',
          dark: '#D4B000',
          light: '#FFDF33',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#FFD700',
          dark: '#E0E0E0',
          muted: '#AAAAAA',
        },
        'primary-blue': '#00C4FF',
        'primary-gold': '#FFD700',
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
          '0%, 100%': { boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)' },
          '50%': { boxShadow: '0 15px 40px rgba(255, 215, 0, 0.6)' },
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