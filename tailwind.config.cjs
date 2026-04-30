/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/client/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0058be',
        background: '#f9f9ff',
        surface: '#ffffff',
        outline: '#727785',
        ink: '#080b0f',
        panel: '#10161d',
        line: '#24303c',
        mint: '#21d7a6',
        cyan: '#4cc9f0',
        amber: '#f6b44b',
      },
      fontFamily: {
        heading: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 32px rgba(33, 215, 166, 0.18)',
        glass: '0 8px 32px rgba(31, 38, 135, 0.06)',
      },
      spacing: {
        84: '21rem',
      },
    },
  },
  plugins: [],
};
