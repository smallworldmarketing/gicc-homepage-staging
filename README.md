# GICC Website

Production website for the Guildford Islamic Cultural Center in Surrey, BC.

## Stack

- Next.js 16 App Router, TypeScript strict, React 19
- Static export for Cloudflare Pages
- Tailwind CSS v4 plus GICC semantic design tokens
- Cloudflare Pages Function for public space requests
- Cloudflare D1 for request tracking and private R2 for certification files
- MailerSend notification to `info@giccmasjid.org`
- Awqat prayer-time feed and Google Calendar events

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Validation

```bash
npm run check
```

The static site is emitted to `out/`.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `out`
- Node version: `22`
- Production branch: `main`

Cloudflare configuration, including isolated preview/production D1 and R2 bindings,
lives in `wrangler.jsonc`. Regenerate binding types after configuration changes:

```bash
npm run cf:types
```

Required Pages bindings and runtime values are documented in
[`docs/contacts.md`](docs/contacts.md) and [`docs/decisions.md`](docs/decisions.md).

## Content updates

Prayer times and calendar events are external feeds. Editorial pages and program
registrations currently live in the repo; see [`docs/content-edits.md`](docs/content-edits.md).
The SWM Payload CMS migration remains a production handoff item so client editors
can publish without a code change.
