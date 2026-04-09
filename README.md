# Partners Tour LeaseMagnets

Fresh Next.js 16 starter for a LeaseMagnets-facing landing page that can grow
into client work management, custom tooling, AI subagents, quotes, and
invoices.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- App Router
- pnpm

## Routes

- `/` landing page and product direction
- `/tools` tooling roadmap
- `/clients` client-work model
- `/library` shared public assets copied from the source app

## Shared assets copied from

`/Users/kingdomkidtyg/Desktop/leasemagnetsTYG/tour.video-TYG/public`

Included here:

- `public/logos`
- `public/invoices-shared`
- `public/quotes-shared`
- `public/fonts`

## Development

```bash
pnpm dev
```

## Verification

```bash
pnpm lint
pnpm build
```

## GitHub Deploy Trigger

Use `/github/update` to create a small GitHub commit that updates the deploy
marker below. If Vercel is connected to this repository, that commit will start
another deploy.

Required environment variables:

- `GITHUB_TOKEN` with repository contents write access
- Optional overrides: `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`,
  `GITHUB_UPDATE_BRANCH`, `GITHUB_UPDATE_FILE_PATH`

<!-- vercel-deploy-timestamp --> Last updated: 2026-04-09T02:05:37.328Z
