import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
