# GICC Homepage Staging

React Native Web implementation of the approved Guildford Islamic Cultural Center homepage mockup.

## Links

- Staging: https://smallworldmarketing.github.io/gicc-homepage-staging/
- Repository: https://github.com/smallworldmarketing/gicc-homepage-staging
- Events calendar: Google Calendar `ammar@giccmasjid.org`
- Prayer times: https://www.awqat.net/masjid/masjid-guildford

## Local Development

```sh
npm install
npm run dev
```

## Production Build

```sh
npm run build
```

The static production build is emitted to `dist/`.

## Staging

This repo is set up for GitHub Pages staging. The staging build uses the same static output that Cloudflare Pages will use later.

## Cloudflare Pages Plan

When the client approves staging, connect this GitHub repository to Cloudflare Pages with:

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22`

Community events are embedded from the Google Calendar shared by `ammar@giccmasjid.org`.

Prayer times are fetched from Awqat's public data source for Masjid Guildford.
