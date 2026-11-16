# Legal Aid Legal Services LLC — Website

A full-stack, responsive legal-services website built with React, Express, tRPC, Drizzle, and the managed Webdev database.

## Included

- Public firm, practice-area, attorney, insights, contact, and consultation pages.
- Administrator-only CMS for inquiries, appointments, content, site settings, opt-out, and deletion workflows.
- Server-validated, rate-limited contact and consultation forms with privacy disclosures.
- Optional SMS customer-care preference capture; the site records consent but does not send SMS until a messaging provider is configured.
- Search-indexing gate, route-aware metadata, sitemap, robots policy, and demo-content safeguards.

## Development

- `pnpm dev`: start the application on `PORT` (default `3000`).
- `pnpm build` / `pnpm start`: build and serve the application.
- `pnpm db:migrate`: apply checked-in migrations.
- `pnpm check` / `pnpm test`: run TypeScript checks and application tests.
- `pnpm seed:demo` and `pnpm seed:blog-demo`: explicitly seed demo CMS material when the guarded conditions permit; these commands are never run at startup.

The application uses managed platform authentication, database, and storage services. A plain local or third-party deployment must configure compatible runtime services before it can run end-to-end. Never commit runtime credentials or private environment files.

## Before public launch

All attorney, practice-area, and article content is provisional demo material until the firm verifies it. The website's supplied business name, telephone numbers, and email address must also be confirmed before publication. No general inquiry creates an attorney-client relationship; visitors should not submit highly sensitive information through public forms.

The SMS forms store optional consent with a timestamp and validate a mobile number plus mailing address when selected. Automated SMS and customer email are not active until their providers and sender settings are configured. Review the Privacy Policy and Terms & Conditions with the firm's counsel, set a documented retention process, complete the first administrator claim, verify the production domain, and explicitly enable search indexing only after content approval.

## Vercel deployment

The root `index.ts` exports the initialized Express application as a Vercel Function without binding a persistent port. `vercel.json` runs `pnpm run build:vercel`, publishes static assets from the generated root `public/` directory, and includes those files in the function bundle. The build script keeps the compiled HTML template available to Express at `public/__runtime/index.html` while omitting root `index.html`, `robots.txt`, `sitemap.xml`, and generated `/api/**` files from the static output. This leaves route-aware HTML/SEO, the admin-controlled indexing gate, OAuth configuration, and API routes with Express rather than letting Vercel's CDN shadow them. Demo/editorial images are bundled locally, and the existing managed-storage image paths redirect to the local copies.

For a Vercel deployment, configure the MySQL `DATABASE_URL`, OAuth/session settings, and single-use administrator bootstrap secret from the project's `.env.example`. Add any storage, email, or SMS provider credentials separately before claiming those integrations are operational. Run `pnpm run build:vercel`, `pnpm check`, and `pnpm test` before deployment. After deployment, verify `/`, a direct route such as `/about`, `/api/health`, `/robots.txt`, and `/assets/images/hero.webp`.

Official references: [Express on Vercel](https://vercel.com/docs/frameworks/backend/express), [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json), and [Ship an Express app on Vercel](https://vercel.com/kb/guide/ship-a-express-app-on-vercel).
