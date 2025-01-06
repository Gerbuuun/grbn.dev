import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      source: 'blog/*.md',
      type: 'page',
      schema: z.object({
        date: z.date(),
        tags: z.array(z.string()),
        references: z.array(z.object({
          label: z.string(),
          to: z.string(),
        })),
        other: z.array(z.object({
          label: z.string(),
          to: z.string(),
        })),
      }),
    }),
  },
});