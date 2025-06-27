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
        // El Molino brand colors
        'sky-blue': '#b5e1e2',   // Soft desert sky
        'sandy-beige': '#debb95', // Warm desert sand
        
        // Functional UI colors
        'primary': '#debb95',      // Main brand color (sandy beige)
        'primary-dark': '#c9a883', // Darker version for hover states
        'secondary': '#b5e1e2',    // Secondary brand color (sky blue)
        'secondary-dark': '#95c5c6', // Darker version for hover states
        'background': '#FFFFFF',   // Background color
        'accent': '#e2515a',       // Complementary accent for call-to-actions
        'text-dark': '#2e353f',    // Main text color
        'text-light': '#6e7582',   // Secondary text color
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
