import { definePerson } from 'nuxt-schema-org/schema';

export default defineNuxtConfig({
  modules: ['@nuxtjs/seo', '@nuxt/ui', '@nuxt/content'],
  devtools: { enabled: true },
  site: {
    url: 'https://grbn.dev',
    name: 'Gerben Mulder',
    description:
      'Personal website of Gerben Mulder, a software engineer building with Nuxt, Cloudflare, and TypeScript.',
    defaultLocale: 'en',
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      titleTemplate: '%s · Gerben Mulder',
      templateParams: {
        separator: '·',
      },
    },
  },
  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-12-30',
  robots: {
    credits: false,
  },
  sitemap: {
    autoLastmod: true,
    credits: false,
    zeroRuntime: true,
  },
  schemaOrg: {
    identity: definePerson({
      type: 'Person',
      name: 'Gerben Mulder',
      url: 'https://grbn.dev',
      sameAs: ['https://github.com/gerbuuun', 'https://bsky.app/profile/grbn.dev', 'https://x.com/gerbuuun'],
    }),
  },
  seo: {
    redirectToCanonicalSiteUrl: true,
    meta: {
      ogSiteName: 'Gerben Mulder',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterCreator: '@gerbuuun',
    },
  },
  ogImage: {
    buildCache: true,
    defaults: {
      cacheMaxAgeSeconds: 60 * 60 * 24 * 30,
    },
  },
  nitro: {
    preset: 'cloudflare-module',
    cloudflare: {
      nodeCompat: true,
    },
    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog', '/robots.txt', '/sitemap.xml'],
    },
    routeRules: {
      '/blog/**': {
        prerender: true,
      },
    },
  },
});
