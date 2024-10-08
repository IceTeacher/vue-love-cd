/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      poppins: 'Poppins',
    },
    screens: {
      ss: '480px',
      sm: '600px',
      md: '768px',
      lg: '976px',
      xl: '1200px',
    },
    extend: {
      colors: {
        back: '#f1edee',
        glass: 'rgba(255,255,255,0.15)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
