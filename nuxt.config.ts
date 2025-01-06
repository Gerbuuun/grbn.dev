export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    '@nuxthub/core',
  ],
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  content: {
    database: {
      type: 'd1',
      binding: 'DB',
    },
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-12-30',
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
