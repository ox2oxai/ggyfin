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
        forest: {
          50: '#f0f5f2',
          100: '#dce8e1',
          500: '#2b5242',
          800: '#1e3a2f',
          900: '#142720',
        },
        terracotta: {
          50: '#fbf3f0',
          100: '#f6e4de',
          500: '#c85a32',
          600: '#b14c27',
          700: '#923c1c',
        },
        sandstone: {
          50: '#ffffff',
          100: '#faf8f5',
          200: '#f3ece2',
          300: '#ebd9c3',
        },
        clay: '#e8dcce',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
