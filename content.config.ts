import { defineCollection, defineContentConfig, z } from '@nuxt/content';
import {
  defineOgImageSchema,
  defineRobotsSchema,
  defineSchemaOrgSchema,
  defineSitemapSchema,
} from '@nuxtjs/seo/content';

const linkSchema = z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string(),
});

// Keep partial dates as strings: a year alone must not become an invented day.
const partialDate = z.string().regex(/^\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/);
const source = (folder: string, extension: string) => ({
  include: `${folder}/**/*.${extension}`,
  exclude: [`${folder}/**/_*.*`],
});

export default defineContentConfig({
  collections: {
    site: defineCollection({
      type: 'data',
      source: 'site.yml',
      schema: z.object({
        name: z.string(),
        description: z.string(),
        location: z.string().optional(),
        email: z.string().email().optional(),
        socialLinks: z.array(linkSchema).default([]),
        navigation: z.array(linkSchema).default([]),
      }),
    }),
    pages: defineCollection({
      type: 'page',
      source: { ...source('pages', 'md'), prefix: '/' },
      schema: z.object({
        timeline: z
          .object({
            title: z.string(),
            eyebrow: z.string().optional(),
            description: z.string().optional(),
            link: linkSchema.optional(),
          })
          .optional(),
        latestPostsTitle: z.string().optional(),
        emptyMessage: z.string().optional(),
      }),
    }),
    experience: defineCollection({
      type: 'data',
      source: source('experience', 'yml'),
      schema: z.object({
        title: z.string(),
        category: z.enum(['Experience', 'Education', 'Certification', 'Project', 'Writing']).default('Experience'),
        organization: z.string(),
        description: z.string(),
        start: partialDate,
        end: partialDate.optional(),
        current: z.boolean().default(false),
        skills: z.array(z.string()).default([]),
        link: linkSchema.optional(),
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: source('projects', 'md'),
      schema: z.object({
        organization: z.string().default(''),
        start: partialDate,
        end: partialDate.optional(),
        current: z.boolean().default(false),
        timeline: z.boolean().default(false),
        skills: z.array(z.string()).default([]),
        links: z.array(linkSchema).default([]),
      }),
    }),
    blog: defineCollection({
      source: source('blog', 'md'),
      type: 'page',
      schema: z.object({
        date: z.date(),
        tags: z.array(z.string()).default([]),
        readingTime: z.number().positive().optional(),
        timeline: z.boolean().default(false),
        links: z.array(linkSchema).default([]),
        references: z.array(linkSchema).default([]),
        other: z.array(linkSchema).default([]),
        ogImage: defineOgImageSchema(),
        robots: defineRobotsSchema(),
        schemaOrg: defineSchemaOrgSchema(),
        sitemap: defineSitemapSchema(),
      }),
    }),
  },
});
