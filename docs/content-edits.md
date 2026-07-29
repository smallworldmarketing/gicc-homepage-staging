# Content Updates

## Current content homes

- Prayer and Jumu'ah times: Awqat public feed, surfaced on `/prayer-times/` and the homepage.
- Community calendar: Google Calendar `ammar@giccmasjid.org`, surfaced on `/programs/` and the homepage.
- Program registrations: `lib/site.ts` in this repo.
- Editorial and legal pages: route files under `app/`.
- Public space requests: Cloudflare D1 and private R2 after production bindings are configured.

## Updating a registration

Edit `REGISTRATIONS` in `lib/site.ts`. Add the flyer to `public/images/programs/`, include meaningful alt context in the title, verify the external URL, then open a pull request.

## Updating the weekly program list

Edit `WEEKLY_PROGRAMS` in `lib/site.ts`. Keep schedule information in Vancouver local time and confirm it against the public GICC calendar.

## Planned CMS handoff

Before client handoff, provision a `gicc` tenant and `giccmasjid` site in `cms.smallworld.ca`, import the retained WordPress pages, configure a Cloudflare Pages deploy hook, create a site-scoped build token, and invite the client’s main contact as `client_admin`.

The verified WordPress route inventory and migration handling live in [`content-inventory.md`](content-inventory.md).
