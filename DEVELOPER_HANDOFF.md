# GICC Website Handoff

## Purpose

This repo replaces the current WordPress site with the SWM migration stack. The
homepage preserves the approved navy/gold GICC direction while adding semantic
HTML, technical SEO, accessibility, static Cloudflare hosting, and a public
space-request workflow.

## Current architecture

- `app/`: static Next.js routes, metadata, sitemap, and robots policy
- `components/`: shared site chrome and interactive prayer/calendar/form surfaces
- `functions/api/event-request.ts`: validated public form endpoint
- `migrations/`: D1 schema for request tracking
- `public/_redirects`: WordPress URL redirects
- `docs/`: migration decisions, operations, and remaining external gates

## Booking scope

The website does not accept requests for spots in existing programs. The public
form is only for a proposed new recurring program or a one-time space rental.
Every submission is pending until GICC approves it.

## External dependencies

- Awqat public prayer-time API
- Google Calendar `ammar@giccmasjid.org`
- Cloudflare Pages, D1, R2, and Turnstile
- MailerSend notification to `info@giccmasjid.org`

Never commit runtime secrets. Public browser identifiers belong in Pages vars;
MailerSend and Turnstile secrets belong in Pages secrets.
