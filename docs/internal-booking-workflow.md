# Internal Space Booking Workflow

## System boundaries

- Public users submit a proposed new recurring program or one-time rental at `/event-request/`.
- A successful submission creates a `pending` D1 record. It does not reserve space.
- Staff use the shared Google Calendar `ammar@giccmasjid.org` to check availability and record confirmed bookings.
- Google Calendar is the scheduling source of truth. D1 is the request and review record.

Staff can open the calendar directly in [Google Calendar week view](https://calendar.google.com/calendar/u/0/r/week?cid=YW1tYXJAZ2ljY21hc2ppZC5vcmc%3D). Access depends on the signed-in Google account having permission to the shared calendar.

All scheduling uses the `America/Vancouver` timezone. Store D1 audit timestamps in UTC.

## Review and approval

1. Open the protected `/staff/requests` queue and verify the proposed date, start time, duration, recurrence, attendance, qualifications, fees, terms acceptance, signature, and any certification upload.
2. Open the shared calendar in week view and inspect the requested time at the requested facility.
3. Check setup and teardown time as part of the occupied window. Do not rely on title search alone; compare the event time and location.
4. If the time works, create the confirmed event on `ammar@giccmasjid.org` using the conventions below.
5. Update the request to `approved`, set `reviewed_at` to a UTC timestamp, record the staff email in `reviewed_by`, and add only operational notes to `internal_notes`.
6. Send the applicant a written confirmation. The form submission acknowledgement is not approval.

If the time does not work, contact the applicant about an alternative before creating a calendar event. Set the request to `under_review` while alternatives are being discussed, or `declined` when the request is closed.

## Calendar event conventions

| Field | Required value |
| --- | --- |
| Calendar | `ammar@giccmasjid.org` |
| Title | Public-facing program or rental name |
| Location | Exactly `GICC Masjid` or `GICC YEC` |
| Availability | `Busy` / opaque |
| Timezone | `America/Vancouver` |
| Description | Request reference, organizer name, contact details, setup/teardown notes, and approval conditions |
| Recurrence | Create only after the complete recurring series is approved |

Use a single event that covers setup, program, and teardown when the room cannot be used by another group during those periods. If those windows differ by location, create clearly named setup/teardown holds.

## Protected request queue

The deployed Pages Function at `/staff/requests` lists requests and records status, reviewer identity, review time, and operational notes. It fails closed unless all of the following are configured:

- a Cloudflare Access self-hosted application protecting `https://<site-host>/staff/*`;
- an Access policy limited to approved staff Google accounts;
- `CF_ACCESS_TEAM_DOMAIN` set to the Access team domain;
- `CF_ACCESS_AUD` set to the Access application audience tag;
- `STAFF_EMAIL_ALLOWLIST` set to a comma-separated defence-in-depth list of staff emails.

The function verifies the Access JWT signature, issuer, audience, expiry, and optional email allowlist on every request. It also enforces same-origin updates and a session-bound CSRF token. Applicant data is never included in the static site.

## Future protected dashboard

A future calendar-aware dashboard remains optional convenience, not a second calendar. Before it reads calendar data directly, it must:

- show Google Calendar availability by canonical location;
- link staff into Google Calendar to create the confirmed event;
- fail closed when identity or calendar access is unavailable.
