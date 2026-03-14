/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dotFlashing: {
          '0%, 80%, 100%': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
          },
          '40%': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
        },
      },
      animation: {
        dotFlashing: 'dotFlashing 1.2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
