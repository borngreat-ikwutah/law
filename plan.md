# LEGAL AID LEGAL SERVICES LLC — Website Implementation Plan

## Scope and implementation approach

Build the full Legal Aid Legal Services LLC website in the initialized React, TypeScript, Tailwind, Express, tRPC, Drizzle and managed MySQL project. Keep the existing Manus OAuth/session implementation and its server-side `adminProcedure`; admin pages and records will never be exposed through client-only checks. Use an additive, committed Drizzle schema/migration for consultations, contact messages, attorney profiles, practice areas, article categories/posts and site settings. Public forms will validate at the server, apply request-size and rate limits, include a honeypot, persist inquiries and optional SMS opt-in consent with a timestamp, and return a clear status without exposing legal inquiry records publicly. SMS-only mailing addresses will be requested only after optional opt-in and protected like other inquiry data. Admin functions will list/search/filter records, update consultation status and internal notes, and manage attorney, practice-area, article and site-setting content. Keep database reads/writes in `server/db.ts` and typed tRPC procedures in `server/routers.ts`; validate and persist public forms in `server/_core/publicForms.ts`.

Implement the public experience as a mobile-first React SPA with Wouter page routes and shared editorial components. Include Home, About, Practice Areas, individual practice-area details, Attorney directory, individual attorney profiles, Insights listing, at least four complete demo articles and individual article pages, Contact, Consultation booking, Privacy, Terms, Disclaimer and a protected Admin area. Add a route manifest. Include search/category filtering, pagination or load-more behavior, related article links, share controls and social links; show a map only after the firm supplies a verified office address. Add route-aware document metadata, sitemap, robots and legal/local structured data only where the underlying facts are accurate. The starter is an SPA rather than an SSR framework; expose meaningful crawlable fallback metadata/body in server responses for known public paths and keep private pages out of indexing. Canonicals and absolute social URLs will be omitted until the actual public domain is configured. Search indexing is disabled by default; records still marked as demo/unverified remain noindex and are excluded from the sitemap, and administrators must explicitly enable indexing after firm and content verification.

Email is a separate provider integration: implement a server-only email adapter for customer submission confirmations and firm-admin alerts, with credentials configured only through protected secrets. The platform's included owner notification is owner-only and not a substitute for customer email. Until the firm supplies a sender identity, destination, and provider credential, the app will persist submissions and show on-screen confirmation, while displaying the email integration as not configured rather than claiming delivery. The supplied business name, three phone numbers and email are implemented; office address and business hours were not supplied. Jurisdiction-specific policy language, attorney identities/credentials, and practice offerings remain demo/unverified and must be reviewed before publication. No fabricated firm statistics or legal-success claims will be shown. Inquiry retention cannot be selected without the firm's jurisdiction; the admin dashboard flags that a retention/deletion schedule must be defined and implemented before accepting real inquiries.

## Project structure

- `client/src/App.tsx`: public, policy, dynamic-detail and protected-admin routes.
- `client/src/components/site/`: responsive header, mobile menu, footer, hero, editorial cards, forms and reusable content sections.
- `client/src/pages/`: public pages and admin dashboard views.
- `client/src/data/`: realistic, clearly disclosed demo content; `scripts/seed-demo-content.ts` is a manual all-or-nothing seed that skips if any CMS table already contains content, and `scripts/ensure-fourth-demo-article.ts` inserts only the requested missing fourth demo article by unique slug.
- `client/src/index.css`: brand tokens, typography, responsive styling, focus states, motion-reduction behavior.
- `server/_core/index.ts`: Express middleware, health check, rate limiting, public SEO documents, and tRPC/OAuth route integration.
- `server/routers.ts`: public form procedures and admin-only management procedures.
- `server/db.ts`: database access and authentication persistence; tRPC handlers in `server/routers.ts`.
- `server/_core/`: public-form validation/persistence, email/notification integration, OAuth, uploads and HTTP SEO endpoints.
- `drizzle/schema.ts`, `drizzle/*.sql`: additive content and inquiry schema/migrations.
- `client/public/manus-routes.json`, `client/public/robots.txt`, `client/public/sitemap.xml`, `client/public/legal-aid-logo.png`: route manifest, crawler documents and the supplied business logo/favicon.

## Design direction

Three distinct styles considered: **Modernist editorial law** (0.06), pairing strong serif typography with precise, restrained detail; **monastic heritage** (0.03), emphasizing archival textures and historic motifs; **glass-and-chrome corporate** (0.02), using reflective surfaces and high-tech gradients. Choose **Modernist editorial law**, closest to the PRD's premium, modern, minimalist direction.

- **Design Movement:** Modernist editorial law, with the calm authority of a high-end print journal translated into a contemporary responsive site.
- **Core Principles:** Quiet authority; clear, client-centered language; deliberate whitespace; functional accessibility and navigation.
- **Color Philosophy:** Deep navy `#10243A` establishes confidence; charcoal `#20262D` supports legibility; warm white `#F8F7F3` softens the page; muted gold `#B99A62` is reserved for emphasis and wayfinding; light grey `#E8E8E5` structures surfaces without heavy borders.
- **Layout Paradigm:** Asymmetric editorial columns, broad image-led openings, and staggered text/image pairings; use card grids only when they improve comparison or scanning.
- **Signature Elements:** Fine muted-gold rules; oversized serif section numbers/eyebrows; a restrained monogram seal motif in the wordmark and small section accents.
- **Interaction Philosophy:** Direct, predictable controls and immediate inline feedback; prioritize consultation/contact paths while keeping form privacy and status messages explicit.
- **Animation:** Short fades/vertical reveals and subtle hover transitions; no parallax or perpetual motion; respect reduced-motion preferences.
- **Typography System:** Playfair Display for display headlines and section titles; DM Sans for navigation, body, controls and metadata; responsive type scales, generous line height and readable measure.
- **Brand Essence:** A composed legal partner for people and organizations navigating complex decisions; **measured, principled, clear**.
- **Brand Voice:** Confident and humane, never absolute or boastful. Examples: “Committed to justice. Dedicated to your future.” “Clarity for consequential decisions.”
- **Wordmark & Logo:** Use the user-supplied lion-and-scales LEGAL AID logo as both the website mark and favicon; accompany it with the exact business name LEGAL AID LEGAL SERVICES LLC.
- **Signature Brand Color:** Muted gold `#B99A62`, used sparingly as a recognizable accent against navy and warm white.

## Known boundaries

- The Manus project is initialized with managed Server and MySQL Database; auto-publication is off.
- Manus OAuth is the platform's default secure identity provider. The admin role follows the existing owner mapping when configured; otherwise a single authenticated first administrator must claim the role with a protected one-time code. No demo account or development bypass is added.
- The requested phone numbers and email are now supplied, but the office address, business hours, public absolute canonical URL, verified legal credentials, jurisdiction-specific professional information, an enforceable inquiry retention policy, and SMS/email delivery-provider credentials still require firm-provided configuration/content. Public search indexing stays disabled until the administrator confirms these details and marks the relevant CMS entries as verified.
- Consultation requests are requests only, not approved appointments; the website will say so throughout the booking and confirmation flow.

## Configuration adjustment after review

The project runtime has no `OWNER_OPEN_ID`, so the starter's normal owner-to-admin mapping cannot authorize any administrator yet. To avoid promoting whichever account happens to sign in first, retain Manus OAuth and add a one-time, server-side bootstrap claim protected by a 32+ character `ADMIN_BOOTSTRAP_CODE` secret, an authenticated session, and a database-locked single-use claim record. The code is requested only through the protected project-secret input flow; it is never stored in source or sent in chat. After a successful claim, server-side role checks gate the dashboard as before. Email delivery remains implemented but inactive until the actual sender/provider/recipient are configured.

## Implementation structure adjustment

The starter already places data access in `server/db.ts` and the typed application API in `server/routers.ts`; form handlers and server-only email handling live under `server/_core/`, and the starter's existing storage helper remains in `server/storage.ts`. Public static files and the route manifest are located in `client/public/`. Where `OWNER_OPEN_ID` is not configured, authorized administrators use the authenticated, one-time bootstrap workflow described above. No account can self-promote by simply signing in.

## Branding and SMS policy update

Use the exact business name LEGAL AID LEGAL SERVICES LLC and the supplied image unchanged as the website logo, favicon, and project logo. Display phone numbers (866) 356-7238, (866) 838-0117, and (877) 217-9029 and email legaldocuments19803@yahoo.com; do not invent a street address or business hours. Replace policy placeholders with the supplied SMS terms and privacy disclosures. Add an optional, unchecked SMS customer-care opt-in to forms, link the full policy, request mailing address only when opted in, validate consent server-side, and persist consent plus timestamp in managed MySQL. Keep SMS consent and inquiry data administrator-only and provide deletion controls. No SMS sending provider is configured, so the site must clearly state that form opt-in is recorded but no automated SMS is sent until the business connects a provider.


## Vercel deployment adaptation

The external Vercel deployment needs a recognized root Express entrypoint while retaining the existing Manus/Docker server entry. Add root `index.ts` to export the configured Express app; on Vercel, register routes and export the app without binding a port. Use the Vercel build command to run the existing full build, copy Vite's `dist/public` output into Vercel's root `public` directory, and retain a server-readable copy of the built SPA template under `public/__runtime/index.html`. Keep `index.html`, `robots.txt`, and `sitemap.xml` out of the static root so page-aware server metadata and the administrator-controlled indexing gate reach Express; static hashed assets and the route manifest remain CDN-served. Copy the six existing generated site images into `client/public/assets/images`, point demo data to these portable assets, and redirect known legacy managed-storage image URLs to them for database records already using the old paths. Vercel deployments require the appropriate MySQL DSN, Manus OAuth/session values, and optional storage/email/admin-bootstrap settings to be configured in Vercel; these external secrets are not copied from the Manus project automatically.
