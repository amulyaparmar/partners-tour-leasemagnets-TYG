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

<!-- vercel-deploy-timestamp --> Last updated: 2026-07-17T14:22:31.163Z

## Tour.report pilot gallery

The knowledgebase pilot gallery uses pre-sized WebP screenshots. After updating
its source PNGs, regenerate the assets with `node scripts/optimize-pilot-images.mjs`.
The full-size viewer only mounts its image when opened.

The report gate asks only for an email, then a six-digit notification code.
`/api/tour-report/access/start` and `/verify` call the dedicated Cloudflare service
in `workers/report-access`. Codes are HMAC-hashed, expire after ten minutes, permit
five attempts, and can only be used once. Durable Objects persist challenges and
rate limits across requests/restarts. Resending invalidates the previous code.
Verified lead email/domain and timestamp are retained per email in the service.

The sender is `notifications@tour.report`. The email wording follows the access
code message in `tour.video-TYG`. This report service also accepts personal email
addresses, including the requested Gmail test address, without changing Tour's
account sign-in policy. The page supports resending and changing the address.

Deployment settings:
- Worker secret: `SERVICE_TOKEN` (random, server-only).
- Vercel: `TOUR_REPORT_ACCESS_URL` and matching `TOUR_REPORT_ACCESS_TOKEN`.
- Optional `TOUR_REPORT_LEAD_EMAIL`: team inbox for verified lead notifications,
  using the existing transactional mail transport.

Deploy the worker with `npx wrangler deploy --config workers/report-access/wrangler.jsonc`.
The GitHub verification workflow checks the code-state transitions and builds the
site; pushing `main` triggers the existing Vercel production integration. Keep the
worker token stable: it signs codes and derives each email's storage identifier.
The blur is a lead-capture prompt, not access control for public screenshot assets.
