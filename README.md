# grbn.dev

Personal website for [grbn.dev](https://grbn.dev), built with Nuxt and deployed to Cloudflare Workers through Alchemy.

## Setup

Install dependencies:

```bash
pnpm install
```

Use Node.js 24 or newer and the pnpm version pinned in `package.json` (via Corepack).
TypeScript stays on 6.0.3 until `vue-tsc` supports TypeScript 7's package exports.
The Nuxt DevTools patch uses `simple-git`'s named export so the patched 4.x release
can replace its vulnerable 3.x dependency. Remove it when DevTools supports 4.x upstream.

`pnpm audit` currently reports two upstream advisories without published fixes:
`node-forge` (local development HTTPS) and `braces` (build-time glob matching).

## Development

Start Nuxt locally:

```bash
pnpm dev
```

## Checks

Run the vite-plus checks:

```bash
pnpm lint
```

Type-check the Nuxt app:

```bash
pnpm typecheck
```

## Deployment

Connect Cloudflare to Alchemy's default profile on a new machine:

```bash
pnpm exec alchemy profile edit --profile default --add Cloudflare
```

Profiles are shared across projects under `~/.alchemy`. To configure the same
profile outside this checkout, use a normal interactive terminal:

```bash
TERM=xterm-256color npx --yes alchemy@2.0.0-beta.81 profile edit --profile default --add Cloudflare
```

If Cloudflare rejects OAuth, choose **API Token or API Key → API Token**. Create a
token in the Cloudflare dashboard scoped to your account and the `grbn.dev` zone:

- Account: Workers Scripts Edit, D1 Edit, Secrets Store Edit, Account Settings Read.
- Zone: Zone Read, DNS Edit, Workers Routes Edit.

Enter the token and account ID in Alchemy's terminal prompts. Secrets Store access
is used by Alchemy's remote state store. Keep credentials out of this repository.

To inspect or manage existing profiles:

```bash
pnpm login
```

Preview the production deployment plan:

```bash
pnpm plan:prod
```

Deploy production:

```bash
pnpm run deploy
```

Development-stage deploys are available with `pnpm plan:dev` and `pnpm deploy:dev`.

## Editing content

Content lives in `content/`. Edit these files directly; you do not need to change
Vue components or TypeScript to add entries. `pnpm dev` watches content edits.
Production is built from these files, so run the checks and `pnpm run deploy`
after editing to publish them. This is file-based editing, not an admin dashboard.

| File or folder              | What it controls                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `content/site.yml`          | Name, bio, location, email, social links, header/footer navigation                   |
| `content/pages/index.md`    | Home introduction, optional Markdown body, timeline heading and latest-posts heading |
| `content/pages/projects.md` | Projects page introduction and optional Markdown body                                |
| `content/pages/blog.md`     | Blog page introduction and optional Markdown body                                    |
| `content/pages/*.md`        | Other pages; `about.md` becomes `/about`                                             |
| `content/projects/*.md`     | Project cards and full project pages                                                 |
| `content/blog/*.md`         | Blog cards and full posts                                                            |
| `content/experience/*.yml`  | Experience, education, certifications, and other timeline entries                    |

Keep the three built-in page files and `site.yml`. Optional lists such as social
links, skills, and project links can be empty. If there are no projects/posts,
the listing shows its editable `emptyMessage` instead. Additional pages appear
at their file path; add a link in `site.yml` to put one in the navigation.
Use Markdown below the frontmatter for paragraphs, headings, images, and links.
For a custom search/social title, set `seo.title` and `seo.description`.

### Add a project

Create `content/projects/my-project.md`:

```md
---
title: My project
description: A short summary for the project card.
start: '2026-10'
current: true
timeline: true
skills: [Nuxt, TypeScript]
links:
  - label: Source code
    to: https://github.com/gerbuuun/my-project
---

## What I built

Describe the project here.
```

It appears at `/projects/my-project` and in the projects list. Set `timeline: true`
to also show it on the home timeline, without duplicating it in an experience file.
`organization`, `end`, `skills`, and `links` are optional. `current: true` places it
before completed projects; omit `end` for ongoing work.

### Add a blog post

Create `content/blog/my-post.md`:

```md
---
title: My new post
description: A short introduction.
date: 2026-10-09
tags: [Nuxt]
timeline: true
---

Write the post here.
```

It appears at `/blog/my-post`, in the blog list, and among the three latest posts
on the home page. `timeline: true` also adds a timeline entry. `tags`,
`readingTime` (minutes), `links`, `references`, and `other` are optional.

### Add experience, education, or a milestone

Create `content/experience/my-role.yml`:

```yaml
title: Software engineer
organization: Company name
category: Experience
start: '2026-01'
current: true
description: >-
  What I worked on and what I learned.
skills: [TypeScript, Vue]
link:
  label: Company website
  to: https://example.com
```

Every experience file appears on the timeline. Supported categories are
`Experience` (the default), `Education`, `Certification`, `Project`, and `Writing`.
`end`, `current`, `skills`, and `link` are optional. Quote `start` and `end`; accepted
formats are `YYYY`, `YYYY-MM`, and `YYYY-MM-DD`. Use only dates you actually know.
Ongoing entries come first, then entries are ordered newest to oldest.

### Add another page

Create `content/pages/about.md`:

```md
---
title: About
description: A little more about me.
---

Your Markdown content goes here.
```

Then add `{ label: About, to: /about }` to `navigation` in `content/site.yml`.
The routes `/`, `/blog`, and `/projects` retain their special lists and layouts;
other files in `pages/` use the general Markdown page layout.

### Drafts

Prefix a filename with `_` (for example `_my-draft.md` or `_my-role.yml`) to
exclude it from content collections, routes, lists, and sitemaps. Rename it to
publish. This applies to files in `pages`, `projects`, `blog`, and `experience`.
