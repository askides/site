import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;
