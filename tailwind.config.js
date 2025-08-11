// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.js', './src/**/*.ts', './src/**/*.vue', './src/**/*.md'],
  options: {
    safelist: ['html', 'body']
  }
}
