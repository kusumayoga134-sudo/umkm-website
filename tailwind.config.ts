import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f4',
          100: '#f9eee3',
          200: '#f2dbc5',
          300: '#e8c09e',
          400: '#dc9f72',
          500: '#d0804e',
          600: '#b86238',
          700: '#944a2b',
          800: '#7a3c26',
          900: '#643323',
          950: '#37190f',
        },
        forest: {
          50: '#f2f8f5',
          100: '#dfefe7',
          500: '#2d7a5b',
          600: '#236349',
          700: '#1b4f3a',
          800: '#173f2f',
          900: '#133427',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
