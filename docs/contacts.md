# Operations and Ownership

| System | Purpose | Owner / value |
|---|---|---|
| GitHub | Source and pull requests | `smallworldmarketing/gicc-homepage-staging` (rename to `gicc-website` before launch) |
| Cloudflare Pages | Static site and Functions | `gicc-website` in SWM `admin@smallworld.ca` account |
| Cloudflare D1 | Space request records | `gicc-event-requests-prod` / `gicc-event-requests-preview`; binding: `BOOKINGS_DB` |
| Cloudflare R2 | Private certification files | `gicc-event-request-files-prod` / `gicc-event-request-files-preview`; binding: `BOOKING_FILES` |
| MailerSend | Booking request notification | `LEAD_RECIPIENT=secretary@giccmasjid.org` |
| Google Calendar | Public event schedule | `ammar@giccmasjid.org` |
| Awqat | Prayer times | Masjid Guildford organization ID in `.env.example` |
| GICC general contact | Client inbox | `info@giccmasjid.org` |

## Required Cloudflare values

| Name | Kind | Notes |
|---|---|---|
| `MAILERSEND_API_TOKEN` | Secret | Per-site token, never public |
| `LEAD_RECIPIENT` | Variable | `secretary@giccmasjid.org` |
| `MAIL_FROM` | Variable | `notify@smallworld.ca` |
| `MAIL_FROM_NAME` | Variable | `GICC Website` |
| `TURNSTILE_SECRET_KEY` | Secret | Optional until Turnstile widget is provisioned |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Build variable | Public widget key |
| `NEXT_PUBLIC_SITE_URL` | Build variable | Production origin; preview must use preview origin |
| `GOOGLE_CALENDAR_API_KEY` | Runtime variable | Calendar API key restricted to the Google Calendar API; the cached public ICS feed is the fallback |
| `NEXT_PUBLIC_AWQAT_SUPABASE_ANON_KEY` | Optional build variable | Overrides the public Awqat client key embedded in the site |

Do not place secrets in `NEXT_PUBLIC_*` variables or commit `.env.local`.

`wrangler.jsonc` is the source of truth for Pages variables and D1/R2 bindings. Preview deployments use `env.preview`; production uses the top-level configuration.
