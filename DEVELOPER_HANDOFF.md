# Developer Handoff: GICC Homepage Staging

Use this document to continue the project in another chat/session.

## Project Summary

Client approved the homepage mockup for `giccmasjid.org`. The approved design has been rebuilt as a React Native Web app and deployed to a shareable staging URL through GitHub Pages.

The production plan is to host on Cloudflare Pages after client approval.

## Key Links

- Staging URL: https://smallworldmarketing.github.io/gicc-homepage-staging/
- GitHub repository: https://github.com/smallworldmarketing/gicc-homepage-staging
- Events calendar source: Google Calendar `ammar@giccmasjid.org`
- Prayer times source: https://www.awqat.net/masjid/masjid-guildford
- Community flyer source: current carousel images from https://giccmasjid.org/

## Current Local Workspace

Local path:

```txt
/root/Documents/Codex/2026-06-10/generate-a-new-website-home-page
```

Current branch:

```txt
main
```

GitHub owner/account:

```txt
smallworldmarketing
```

Repository:

```txt
smallworldmarketing/gicc-homepage-staging
```

## Tech Stack

- Vite
- React
- React Native Web
- `lucide-react` icons
- GitHub Pages staging
- Cloudflare Pages planned for production

Important implementation detail:

The app imports React Native primitives from `react-native`, with Vite aliasing `react-native` to `react-native-web` in `vite.config.js`.

## Important Files

- `src/App.jsx`: Main React Native Web page implementation.
- `src/main.jsx`: App entrypoint.
- `src/web.css`: Minimal global web reset.
- `vite.config.js`: Vite config and React Native Web alias.
- Events calendar: Google Calendar iframe embed for `ammar@giccmasjid.org`.
- `assets/gicc-logo-white.png`: GICC logo asset.
- `assets/new-masjid-building.jpg`: Hero background asset from existing GICC site.
- `assets/community-flyers/`: Local copies of the flyer carousel images from the existing GICC homepage.
- `.github/workflows/pages.yml`: GitHub Pages staging deployment workflow.
- `README.md`: Project links and Cloudflare deployment notes.
- `exports/gicc-homepage-mockup.png`: Original shareable PNG mockup export, ignored by git.

## Commands

Install dependencies:

```sh
npm install
```

Run local dev server:

```sh
npm run dev
```

Build production output:

```sh
npm run build
```

Preview production build locally:

```sh
npm run preview
```

Output directory:

```txt
dist
```

## Deployment State

GitHub Pages is live and deploys from pushes to `main`:

```txt
https://smallworldmarketing.github.io/gicc-homepage-staging/
```

The workflow includes:

```yaml
FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
```

This was added because GitHub emitted Node 20 action deprecation warnings.

Note:

A `gh-pages` branch was created as a fallback during staging setup. The GitHub Pages workflow is now green and the staging URL is live. Continue using `main` and the Actions workflow unless there is a specific reason to change deployment strategy.

## Cloudflare Pages Plan

When the client approves staging, connect the GitHub repo to Cloudflare Pages.

Cloudflare Pages settings:

```txt
Build command: npm run build
Build output directory: dist
Node version: 22
```

Production calendar target:

```txt
Google Calendar ID: ammar@giccmasjid.org
Embed URL: https://calendar.google.com/calendar/embed?src=ammar%40giccmasjid.org&ctz=America%2FVancouver
```

The app currently embeds the shared Google Calendar and provides actions to open the calendar, open the full embed view, and copy the calendar id.

Prayer times are fetched client-side from Awqat's public Supabase-backed data for Masjid Guildford. The current Awqat organization id is:

```txt
96ac3382-aef7-4710-a187-7002ba7f4323
```

## Current Features

- Responsive homepage for desktop and mobile.
- Fixed header with navigation.
- Hero section using GICC imagery and brand colors.
- Iqama time strip synced from Awqat.
- Welcome/mission section.
- Weekly programs section.
- Community Flyers section:
  - Uses local flyer assets copied from the original `giccmasjid.org` homepage carousel.
  - Includes a featured flyer viewer, previous/next controls, thumbnail rail, and original registration/detail links.
- Calendar section with:
  - Google Calendar iframe embed for `ammar@giccmasjid.org`.
  - Buttons to open the calendar, open the full embed view, and copy the calendar id.
  - Access notice for Google Calendar sharing/permissions.
- New Islamic Center project section.
- Footer with contact details.

## Known Caveats / Follow-Up Items

- Awqat sync depends on the public Awqat data source remaining available with the current Supabase API shape.
- Google Calendar visibility depends on the calendar sharing settings for `ammar@giccmasjid.org`; if the iframe shows a permissions prompt, the calendar owner needs to make the calendar public or explicitly share it with the intended viewer account.
- Flyer assets are local copies from the existing GICC website. If the client updates flyers on WordPress, copy the new images into `assets/community-flyers/` and update `COMMUNITY_FLYERS` in `src/App.jsx`.
- Cloudflare has not been connected yet because no Cloudflare credentials/tools were available in this session.
- The design is a single-page staging build, not yet integrated into the existing WordPress site.
- The repo is public for easy GitHub Pages staging. Reassess visibility if the client wants it private before production.

## Verification Already Completed

Local:

```sh
npm run build
```

Live staging:

- HTTP 200 check passed for the staging page.
- Desktop render verified with headless Chrome screenshot.
- Mobile render verified with headless Chrome screenshot.
- GitHub Actions deployment workflow passed.

## Suggested Prompt For Next Chat

Paste this into the next chat:

```txt
Continue work on the GICC homepage staging project.

Repo: https://github.com/smallworldmarketing/gicc-homepage-staging
Staging: https://smallworldmarketing.github.io/gicc-homepage-staging/
Local path used previously: /root/Documents/Codex/2026-06-10/generate-a-new-website-home-page

It is a Vite + React Native Web app. Main implementation is in src/App.jsx. Build output is dist. GitHub Pages staging is live and Cloudflare Pages is planned after client approval.

Please read DEVELOPER_HANDOFF.md and README.md first, then apply the checklist I provide.
```
