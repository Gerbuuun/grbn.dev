import { defineCollection, defineContentConfig, z } from '@nuxt/content';
import {
  defineOgImageSchema,
  defineRobotsSchema,
  defineSchemaOrgSchema,
  defineSitemapSchema,
} from '@nuxtjs/seo/content';

const linkSchema = z.object({
  label: z.string(),
  icon: z.string(),
  to: z.string(),
});

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      source: 'blog/*.md',
      type: 'page',
      schema: z.object({
        date: z.date(),
        tags: z.array(z.string()),
        readingTime: z.number(),
        links: z.array(linkSchema),
        references: z.array(linkSchema),
        other: z.array(linkSchema),
        ogImage: defineOgImageSchema(),
        robots: defineRobotsSchema(),
        schemaOrg: defineSchemaOrgSchema(),
        sitemap: defineSitemapSchema(),
      }),
    }),
  },
});
