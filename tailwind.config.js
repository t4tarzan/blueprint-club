/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chalk': {
          DEFAULT: '#E0E0E0',
          dark: '#424242',
          light: '#F5F5F5',
        },
        'mango': {
          DEFAULT: '#FFC107',
          dark: '#FFB300',
        },
      },
    },
  },
  plugins: [],
}
