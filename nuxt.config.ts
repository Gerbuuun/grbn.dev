export default defineNuxtConfig({
  modules: [
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxthub/core',
  ],
  devtools: { enabled: true },
  content: {
    database: {
      type: 'd1',
      binding: 'DB',
    },
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-12-30',
  nitro: {
    routeRules: {
      '/blog/**': { prerender: true },
    },
  },
  hub: {
    database: true,
  },
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        semi: true,
      },
    },
  },
});
