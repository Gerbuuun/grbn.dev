export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  future: { compatibilityVersion: 4 },
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxthub/core',
  ],
  hub: {},
  eslint: {
    config: {
      stylistic: {
        quotes: 'single'
      }
    }
  },
  devtools: { enabled: true }
});
