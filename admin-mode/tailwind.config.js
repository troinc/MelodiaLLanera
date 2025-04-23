/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-light': '#2a2929',
        'custom-blue': '#ff9966',
        'custom-light-blue': '#ff9966',
        'custom-grey': '#1d1c1c',
        'custom-dark-grey': '#808080',
        'custom-dark': '#FFFFFF',
        'custom-red': '#DB504A',
        'custom-yellow': '#ff9966',
        'custom-light-yellow': '#ff9966',
        'custom-orange': '#ff9966',
        'custom-light-orange': '#ff9966',
        // Dark mode colors (optional, prefixed)
        'dark-custom-light': '#0C0C1E',
        'dark-custom-grey': '#060714',
        'dark-custom-dark': '#FBFBFB',
      },
    },
  },
  plugins: [],
}
