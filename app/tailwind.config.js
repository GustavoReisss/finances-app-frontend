/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
    colors: {
      // Background
      "background-300": "hsla(var(--background-300) / <alpha-value>)",
      "background-400": "hsla(var(--background-400) / <alpha-value>)",
      "background-500": "hsla(var(--background-500) / <alpha-value>)",
      "background-600": "hsla(var(--background-600) / <alpha-value>)",

      // Text
      "text-300": "hsla(var(--text-300) / <alpha-value>)",
      "text-400": "hsla(var(--text-400) / <alpha-value>)",
      "text-500": "hsla(var(--text-500) / <alpha-value>)",
      "text-600": "hsla(var(--text-600) / <alpha-value>)",
      "text-700": "hsla(var(--text-700) / <alpha-value>)",

      // Primary
      "primary-300": "hsla(var(--primary-300) / <alpha-value>)",
      "primary-400": "hsla(var(--primary-400) / <alpha-value>)",
      "primary-500": "hsla(var(--primary-500) / <alpha-value>)",
      "primary-600": "hsla(var(--primary-600) / <alpha-value>)",
      "primary-700": "hsla(var(--primary-700) / <alpha-value>)",
      
      // Secondary
      "secondary-300": "hsla(var(--secondary-300) / <alpha-value>)",
      "secondary-400": "hsla(var(--secondary-400) / <alpha-value>)",
      "secondary-500": "hsla(var(--secondary-500) / <alpha-value>)",
      "secondary-600": "hsla(var(--secondary-600) / <alpha-value>)",
      "secondary-700": "hsla(var(--secondary-700) / <alpha-value>)",

      // Accent
      "accent-300": "hsla(var(--accent-300) / <alpha-value>)",
      "accent-400": "hsla(var(--accent-400) / <alpha-value>)",
      "accent-500": "hsla(var(--accent-500) / <alpha-value>)",
      "accent-600": "hsla(var(--accent-600) / <alpha-value>)",
      "accent-700": "hsla(var(--accent-700) / <alpha-value>)",

      // Cancel
      "cancel-500": "hsla(var(--cancel-500) / <alpha-value>)",

      // White
      "white-500": "hsla(var(--white-500) / <alpha-value>)",
      "white-600": "hsla(var(--white-600) / <alpha-value>)",
      "white-700": "hsla(var(--white-700) / <alpha-value>)",

      // Danger
      "danger-500": "hsla(var(--danger-500) / <alpha-value>)"
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

