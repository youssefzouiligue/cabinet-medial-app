/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#eef3f1',
          100: '#d6e3df',
          400: '#3f6b60',
          500: '#2b5048',
          600: '#1f3a35',
          700: '#162a26',
          900: '#0d1917',
        },
        linen: {
          50: '#fbf9f5',
          100: '#f3eee3',
          200: '#e8dfcc',
        },
        clay: {
          500: '#c1492f',
          600: '#a23a24',
        },
        honey: {
          400: '#e2a33d',
          500: '#cf8f29',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
