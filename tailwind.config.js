module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-900': '#121212',
        'gray-800': '#1E1E1E',
        'indigo-500': '#6366F1',
      },
      fontFamily: {
        sans: ["var(--font-poppins)", 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
