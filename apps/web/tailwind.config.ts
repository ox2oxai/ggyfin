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
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        bankGreen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#0e4b2f',
          950: '#062e1c',
        },
        royalGold: {
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        pearl: {
          50: '#ffffff',
          100: '#f8faf8',
          200: '#f1f5f2',
          300: '#e2e8e4',
          400: '#cbd5e1',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#15803d',
          800: '#0e4b2f',
          900: '#062e1c',
        },
        terracotta: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        sandstone: {
          50: '#ffffff',
          100: '#f8faf8',
          200: '#f1f5f2',
          300: '#e2e8e4',
        },
        clay: '#e2e8e4',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Kannada"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Noto Sans Kannada"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
