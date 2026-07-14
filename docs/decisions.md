# Decisions Log

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

**Consequences:** The internal management calendar still needs a protected staff surface. Do not ship an unprotected admin endpoint; configure Cloudflare Access or a separate authenticated staff app first.

## 2026-07-14 — Keep editorial content in-repo for the migration preview

**Context:** The SWM Payload CMS is the long-term default, but no GICC tenant, site record, deploy hook, or client account has been provisioned yet.

**Choice:** Keep the small set of migrated editorial pages in typed TSX for the preview and document Payload provisioning as a production handoff gate.

**Reasoning:** The preview can be verified without coupling launch readiness to incomplete CMS account setup. The route structure is compatible with later CMS-backed content.

**Consequences:** Program copy changes require a commit until the GICC tenant is provisioned and content is imported.

## 2026-07-14 — Retire expired and test WordPress URLs with HTTP 410

**Context:** The old sitemap contains test pages, duplicate templates, expired Eid announcements, author archives, and a Quran competition results page listing minors.

**Choice:** Return `410 Gone` with `noindex` for those URLs instead of copying outdated or privacy-sensitive content or blanket-redirecting it to the homepage.

**Consequences:** Search engines can remove retired URLs cleanly while retained pages preserve semantic redirects or equivalent content.
