/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#552A47',
          light: '#6d3459',
          dark: '#3d1e33',
        },
        secondary: {
          DEFAULT: '#97C646',
          light: '#a8d25c',
          dark: '#7ba338',
        },
      },
    },
  },
  plugins: [],
}
