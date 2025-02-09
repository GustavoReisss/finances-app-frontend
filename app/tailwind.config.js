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
      "background-base": "hsla(var(--background-base) / <alpha-value>)",
      "background-variant-dark-1": "hsla(var(--background-variant-dark-1) / <alpha-value>)",
      "background-variant-light-2": "hsla(var(--background-variant-light-2) / <alpha-value>)",
      "background-variant-light-1": "hsla(var(--background-variant-light-1) / <alpha-value>)",

      // Text
      "text-body-1": "hsla(var(--text-body-1) / <alpha-value>)",
      "text-body-2": "hsla(var(--text-body-2) / <alpha-value>)",

      // Primary
      "primary-base": "hsla(var(--primary-base) / <alpha-value>)",
      "primary-base-contrast": "hsla(var(--primary-base-contrast) / <alpha-value>)",
      "primary-variant-1": "hsla(var(--primary-variant-1) / <alpha-value>)",
      "primary-variant-1-contrast": "hsla(var(--primary-variant-1-contrast) / <alpha-value>)",
      
      // Secondary
      "secondary-base": "hsla(var(--secondary-base) / <alpha-value>)",
      "secondary-base-contrast": "hsla(var(--secondary-base-contrast) / <alpha-value>)",
      "secondary-variant-1": "hsla(var(--secondary-variant-1) / <alpha-value>)",
      "secondary-variant-1-contrast": "hsla(var(--secondary-variant-1-contrast) / <alpha-value>)",


      // Accent
      "accent-base": "hsla(var(--accent-base) / <alpha-value>)",
      "accent-base-contrast": "hsla(var(--accent-base-contrast) / <alpha-value>)",
      "accent-variant-1": "hsla(var(--accent-variant-1) / <alpha-value>)",
      "accent-variant-1-contrast": "hsla(var(--accent-variant-1-contrast) / <alpha-value>)",

      //Feedback
      "feedback-success": "hsla(var(--feedback-success) / <alpha-value>)",
      "feedback-success-contrast": "hsla(var(--feedback-success-contrast) / <alpha-value>)",

      "feedback-error": "hsla(var(--feedback-error) / <alpha-value>)",
      "feedback-error-contrast": "hsla(var(--feedback-error-contrast) / <alpha-value>)",

      "feedback-warning": "hsla(var(--feedback-warning) / <alpha-value>)",
      "feedback-warning-contrast": "hsla(var(--feedback-warning-contrast) / <alpha-value>)",

      "feedback-info": "hsla(var(--feedback-info) / <alpha-value>)",
      "feedback-info-contrast": "hsla(var(--feedback-info-contrast) / <alpha-value>)",
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

