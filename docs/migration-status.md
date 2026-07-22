# WordPress Migration Checklist Status

## Applied in this repo

- Next.js App Router, strict TypeScript, React 19, static export, trailing slashes, Node 22.
- Cloudflare Pages output, `_headers`, `_redirects`, and old service-worker tombstone.
- Isolated Cloudflare Pages preview plus separate production/preview D1 databases and private R2 buckets.
- Semantic navigation, skip link, keyboard focus, responsive layouts, reduced-motion handling, form labels and error states.
- Per-route titles, descriptions, canonicals, Open Graph metadata, Organization/Mosque JSON-LD, sitemap, robots, and `llms.txt`.
- Explicit AI crawler allow-list for production; previews are blocked through the `NEXT_PUBLIC_SITE_URL` gate.
- WordPress URL inventory and keep/redirect/retire decisions.
- Live WordPress inventory reverified on 2026-07-15: 13 pages, 3 posts, 1 category archive, and 2 author archives. See [`content-inventory.md`](content-inventory.md).
- Standalone `/prayer-times/` and `/programs/` hubs, with retained editorial, project, support, donation, and contact pages exposed through site navigation.
- Updated privacy and website terms aligned with the actual form pipeline.
- Secure server-side form validation, honeypot, optional Turnstile, D1 rate limiting, private file storage, MailerSend notification, and first-touch attribution.
- Existing-program booking removed; new program/one-time space requests moved to a dedicated page.
- Internal availability and confirmed bookings remain in the existing private GICC Google Calendar, with `GICC Masjid` and `GICC YEC` as the canonical location values.
- CI quality workflow and dependency/runtime pinning.

## External gates before production cutover

- Export WordPress WXR, uploads, database, active plugins, redirects, header/footer snippets, and full static mirror.
- Export GSC/GA4/Ahrefs baseline and build the full URL metrics spreadsheet.
- Audit the complete DNS zone, all subdomains, email records, registrar lock, DNSSEC, CAA, third-party webhooks, and domain verifications.
- Connect the `gicc-website` Pages project to the renamed private GitHub repo and add the production deploy hook.
- Perform production success, upload, honeypot, rate-limit, and failure-path submissions. The dedicated MailerSend sending token and the Turnstile widget/secret were provisioned on 2026-07-22.
- Optionally provision `GOOGLE_CALENDAR_API_KEY` as a Cloudflare runtime variable restricted to the Google Calendar API. The same-origin calendar function remains live through its verified, cached public ICS feed when the key is absent.
- Create the Cloudflare Access `/staff/*` application and set `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`, and `STAFF_EMAIL_ALLOWLIST` so the implemented staff request queue can be enabled. Google Calendar remains the booking source of truth.
- Provision GICC in the SWM Payload CMS, import retained content/media, test publish→rebuild, and invite the tenant-scoped client admin.
- Confirm the youth mental-health intake owner, minimum data set, consent copy, response SLA, retention period, and staff access list before replacing the sensitive WordPress intake form.
- Make the GitHub repo private, rename it to `gicc-website`, add branch protection, and connect Cloudflare preview checks.
- Run production Lighthouse, axe, Rich Results, HTML validation, crawl/link checks, multi-browser/mobile tests, redirect sampling, AI-bot user-agent tests, and tag/attribution QA.
- Complete stakeholder sign-off, DNS cutover, SSL/HSTS, GSC/Bing sitemap submission, email/subdomain smoke tests, DNSSEC re-enable, and 30-day WordPress fallback window.

## Preview infrastructure

- Preview: <https://codex-wordpress-migration-l86b.gicc-website.pages.dev/>
- Pages project: `gicc-website`; production branch: `main`
- Preview D1: `gicc-event-requests-preview`
- Production D1: `gicc-event-requests-prod`
- Preview R2: `gicc-event-request-files-preview` (private)
- Production R2: `gicc-event-request-files-prod` (private)
- Migration `0001_event_requests.sql` applied to both databases on 2026-07-14.
- Synthetic preview submission verified with HTTP 201 and a persisted D1 record. Notification was correctly marked `skipped` because preview secrets are intentionally separate from production.
- `www.giccmasjid.org` is associated with the Pages project. Final cutover is limited to changing the existing `www` DNS record to `gicc-website.pages.dev`; apex and mail DNS remain on the current host.

## Internal booking verification

- Connected account access to `ammar@giccmasjid.org` was verified on 2026-07-14.
- A bounded check of July 20–26, 2026 returned 24 events: 13 at `GICC YEC` and 11 at `GICC Masjid`.
- All returned events were opaque and therefore correctly block busy time.
- Staff workflow and event conventions are documented in [`internal-booking-workflow.md`](internal-booking-workflow.md).
