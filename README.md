# GICC Homepage Staging

React Native Web implementation of the approved Guildford Islamic Cultural Center homepage mockup.

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

The calendar feed file is copied to `/events.ics` during build, so a production Cloudflare deployment can expose:

```txt
https://giccmasjid.org/events.ics
webcal://giccmasjid.org/events.ics
```
