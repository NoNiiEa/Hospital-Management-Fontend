// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/ui'],
  runtimeConfig: {
    public: {
      tailwindcss: {
        exposeConfig: true,
        viewer: true,
      }
    }
  },
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  }
})
