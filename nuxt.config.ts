export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/content'],
  devtools: { enabled: true },
  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
  },
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-12-30',
  nitro: {
    preset: 'cloudflare-module',
    cloudflare: {
      nodeCompat: true,
    },
    routeRules: {
      '/blog/**': {
        prerender: true,
        ssr: false,
      },
    },
  },
});
