# WordPress Migration Checklist Status

## Applied in this repo

- Next.js App Router, strict TypeScript, React 19, static export, trailing slashes, Node 22.
- Cloudflare Pages output, `_headers`, `_redirects`, and old service-worker tombstone.
- Isolated Cloudflare Pages preview plus separate production/preview D1 databases and private R2 buckets.
- Semantic navigation, skip link, keyboard focus, responsive layouts, reduced-motion handling, form labels and error states.
- Per-route titles, descriptions, canonicals, Open Graph metadata, Organization/Mosque JSON-LD, sitemap, robots, and `llms.txt`.
- Explicit AI crawler allow-list for production; previews are blocked through the `NEXT_PUBLIC_SITE_URL` gate.
- WordPress URL inventory and keep/redirect/retire decisions.
- Updated privacy and website terms aligned with the actual form pipeline.
- Secure server-side form validation, honeypot, optional Turnstile, D1 rate limiting, private file storage, MailerSend notification, and first-touch attribution.
- Existing-program booking removed; new program/one-time space requests moved to a dedicated page.
- CI quality workflow and dependency/runtime pinning.

## External gates before production cutover

- Export WordPress WXR, uploads, database, active plugins, redirects, header/footer snippets, and full static mirror.
- Export GSC/GA4/Ahrefs baseline and build the full URL metrics spreadsheet.
- Audit the complete DNS zone, all subdomains, email records, registrar lock, DNSSEC, CAA, third-party webhooks, and domain verifications.
- Connect the `gicc-website` Pages project to the renamed private GitHub repo and add the production deploy hook.
- Provision MailerSend and Turnstile values; perform success, upload, honeypot, rate-limit, and failure-path submissions.
- Update the Google Calendar browser-key referrer restrictions for the Pages preview and final GICC hostnames.
- Configure an authenticated staff request/calendar surface through Cloudflare Access or another approved identity layer.
- Provision GICC in the SWM Payload CMS, import retained content/media, test publish→rebuild, and invite the tenant-scoped client admin.
- Make the GitHub repo private, rename it to `gicc-website`, add branch protection, and connect Cloudflare preview checks.
- Run production Lighthouse, axe, Rich Results, HTML validation, crawl/link checks, multi-browser/mobile tests, redirect sampling, AI-bot user-agent tests, and tag/attribution QA.
- Complete stakeholder sign-off, DNS cutover, SSL/HSTS, GSC/Bing sitemap submission, email/subdomain smoke tests, DNSSEC re-enable, and 30-day WordPress fallback window.

## Preview infrastructure

- Preview: <https://codex-wordpress-migration.gicc-website.pages.dev/>
- Pages project: `gicc-website`; production branch: `main`
- Preview D1: `gicc-event-requests-preview`
- Production D1: `gicc-event-requests-prod`
- Preview R2: `gicc-event-request-files-preview` (private)
- Production R2: `gicc-event-request-files-prod` (private)
- Migration `0001_event_requests.sql` applied to both databases on 2026-07-14.
- Synthetic preview submission verified with HTTP 201 and a persisted D1 record. Notification was correctly marked `skipped` because the MailerSend secret is not provisioned yet.
