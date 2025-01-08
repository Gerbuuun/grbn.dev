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
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-12-30',
  nitro: {
    routeRules: {
      '/blog/**': {
        prerender: true,
        ssr: false,
      },
    },
  },
  hub: {
    database: true,
    cache: true,
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
