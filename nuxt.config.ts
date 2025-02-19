/** @format */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',  // Compatibility date for your Nuxt app
  devtools: { enabled: true },  // Enables Nuxt DevTools for development
  css: [
    'bootstrap/dist/css/bootstrap.css',  // Include Bootstrap CSS
    '@/assets/css/tailwind.css'  // Include custom Tailwind CSS
  ],
  build: {
    transpile: ['bootstrap'],  // Transpile Bootstrap (to ensure compatibility with Nuxt)
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss7-compat': {},  // Tailwind CSS PostCSS plugin for compatibility with PostCSS 7
      autoprefixer: {},  // Autoprefixer for cross-browser compatibility
    },
  },
});
