# grbn.dev

Personal website for [grbn.dev](https://grbn.dev), built with Nuxt and deployed to Cloudflare Workers through Alchemy.

## Setup

Install dependencies:

```bash
pnpm install
```

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

Authenticate Alchemy/Cloudflare if needed:

```bash
pnpm login
```

Preview the production deployment plan:

```bash
pnpm plan:prod
```

Deploy production:

```bash
pnpm deploy
```

Development-stage deploys are available with `pnpm plan:dev` and `pnpm deploy:dev`.
