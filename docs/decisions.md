# Decisions Log

## 2026-07-15 — Revalidate Next.js static chunks instead of treating them as immutable

**Context:** Next.js 16/Turbopack reused the same generated CSS chunk URL after a stylesheet-only production build. The previous one-year `immutable` browser policy therefore allowed returning visitors to keep stale styles after a deployment.

**Choice:** Serve `/_next/static/*` with `max-age=0, must-revalidate`. Keep Cloudflare at the edge, but require browsers to validate cached chunks before reuse. A separate global heading-case stylesheet also gives this rollout a new asset URL so clients that already cached the old immutable stylesheet receive the uppercase H1 treatment immediately.

**Consequences:** CSS and JavaScript changes propagate reliably across direct-upload deployments. Repeat visits may perform lightweight conditional requests instead of blindly reusing year-old chunks.

## 2026-07-14 — Use the published GitHub Pages build as the visual and editorial baseline

**Context:** The client preferred the typography, spacing, copy, icons, flyer coverflow, Awqat prayer experience, and Google Calendar presentation in the last published staging build.

**Choice:** Treat `origin/main@3fd5a56` and the matching published GitHub Pages site as the canonical homepage reference. Preserve its Cormorant/Poppins typography, colour layers, responsive geometry, copy, eight-slide flyer order, Awqat prayer-time experience, and community calendar presentation in the semantic Next.js migration.

**Exceptions:** Keep the client-approved space-request flow at `/event-request/` instead of restoring the obsolete existing-program booking form. Keep the removed Young Champs flyer out of the carousel; the current GICC United 2026 flyer remains in its place.

**Consequences:** Future visual or copy changes should be compared against the published reference unless the client explicitly approves a new direction. The migration may change implementation details for accessibility, security, and reliability without changing the approved surface.

## 2026-07-14 — Proxy the public community calendar through Cloudflare

**Context:** The reference site called the Google Calendar API directly from the browser. That required a public browser key and failed completely when the API was unavailable. Google’s public ICS feed also contains an outdated fixed Vancouver offset, which makes winter recurring events one hour early unless corrected.

**Choice:** Load calendar events through the same-origin `/api/calendar` Pages Function. Use an optional server-runtime Calendar API key first, then a cached public ICS fallback that expands recurrences with the `America/Vancouver` IANA timezone and serves stale data during temporary upstream failures.

**Consequences:** The homepage keeps the reference calendar UI and event links without exposing a browser key. Production may optionally provision a server-only Google Calendar API key restricted to the Calendar API; the verified public-calendar feed remains operational without it.

## 2026-07-14 — Convert the approved staging site to the SWM migration stack

**Context:** The staging homepage was a Vite/React Native Web prototype on GitHub Pages. The SWM WordPress migration playbook locks production sites to Next.js static export, TypeScript, Cloudflare Pages, semantic SEO, and documented operations.

**Options considered:** Keep Vite; wrap the existing React Native Web app in Next.js; rewrite the approved surface as semantic Next.js components.

**Choice:** Rewrite in Next.js 16 with strict TypeScript and preserve the approved GICC visual direction and source assets.

**Reasoning:** This removes the prototype-only architecture, improves crawlability and accessibility, and avoids carrying React Native Web into a content-first website.

**Consequences:** Build output changes from `dist/` to `out/`. GitHub Pages is retired in favour of Cloudflare Pages.

## 2026-07-14 — Treat space submissions as requests, not bookings

**Context:** The client clarified that the booking system is for proposed new recurring programs and one-time rentals, not seats in existing programs.

**Choice:** Remove the existing-program booking form. Link the homepage to `/event-request/`, where the original PDF is represented as a guided form with facility terms, typed signature, and certification upload.

**Consequences:** A submission has `pending` status until staff approval. The interface never claims the space is reserved.

## 2026-07-14 — Store requests in Cloudflare D1 and files in private R2

**Context:** The Supabase project referenced by the prototype is not accessible through the connected account. The migration playbook standardizes hosting and form execution on Cloudflare.

**Options considered:** Continue posting anonymously to the inaccessible Supabase table; create a new paid Supabase project; use Cloudflare D1/R2 beside the Pages Function.

**Choice:** Use D1 for structured request tracking and private R2 for certification files. Send notifications through the standard MailerSend Pages Function pattern.

**Reasoning:** This keeps the public form server-side, avoids exposing privileged database credentials, and removes the additional $10/month Supabase project dependency.

**Consequences:** The public form writes a pending request to D1; it does not create a Google Calendar event or reserve either facility. Request review stays private.

## 2026-07-14 — Use the existing GICC calendar for internal space management

**Context:** Staff need a quick way to see open times and reserve a location for approved public requests or internally planned programs. The shared calendar `ammar@giccmasjid.org` already records events with the location values `GICC Masjid` and `GICC YEC`.

**Options considered:** Expose an admin calendar on the public site; build a second scheduling database; use the existing shared Google Calendar as the internal source of truth.

**Choice:** Use the existing shared Google Calendar for staff availability and confirmed bookings. Keep public submissions in D1 as pending requests until a staff member approves one and creates an opaque calendar event for the correct location.

**Reasoning:** Google Calendar already provides staff access control, recurring events, conflict visibility, notifications, and mobile support. A second booking calendar would create sync and double-booking risk without improving the public request flow.

**Consequences:** Staff must use the exact location value `GICC Masjid` or `GICC YEC` and leave confirmed events opaque so they block time. A future request-review dashboard must be protected before deployment; it should read from D1 and link into Google Calendar rather than becoming another scheduling source of truth.

## 2026-07-14 — Keep editorial content in-repo for the migration preview

**Context:** The SWM Payload CMS is the long-term default, but no GICC tenant, site record, deploy hook, or client account has been provisioned yet.

**Choice:** Keep the small set of migrated editorial pages in typed TSX for the preview and document Payload provisioning as a production handoff gate.

**Reasoning:** The preview can be verified without coupling launch readiness to incomplete CMS account setup. The route structure is compatible with later CMS-backed content.

**Consequences:** Program copy changes require a commit until the GICC tenant is provisioned and content is imported.

## 2026-07-14 — Retire expired and test WordPress URLs with HTTP 410

**Context:** The old sitemap contains test pages, duplicate templates, expired Eid announcements, author archives, and a Quran competition results page listing minors.

**Choice:** Return `410 Gone` with `noindex` for those URLs instead of copying outdated or privacy-sensitive content or blanket-redirecting it to the homepage.

**Consequences:** Search engines can remove retired URLs cleanly while retained pages preserve semantic redirects or equivalent content.
