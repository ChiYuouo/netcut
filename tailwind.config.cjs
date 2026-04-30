/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/client/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080b0f',
        panel: '#10161d',
        line: '#24303c',
        mint: '#21d7a6',
        cyan: '#4cc9f0',
        amber: '#f6b44b',
      },
      boxShadow: {
        glow: '0 0 32px rgba(33, 215, 166, 0.18)',
      },
      spacing: {
        84: '21rem',
      },
    },
  },
  plugins: [],
};
