import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  // Matches the CSS above: follow the OS unless <html> pins a theme.
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not([data-theme="light"] *) }',
      '&:is([data-theme="dark"] *)',
    ],
  ],
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', ...defaultTheme.fontFamily.sans],
        mono: ['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        rule: 'rgb(var(--rule) / <alpha-value>)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
