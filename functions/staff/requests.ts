import { authenticateStaff, type StaffIdentity } from "../lib/cloudflare-access";

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  meta?: { changes?: number };
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  BOOKINGS_DB?: D1Database;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  STAFF_EMAIL_ALLOWLIST?: string;
}

type EventContext = {
  request: Request;
  env: Env;
};

interface EventRequestRow {
  id: string;
  reference: string;
  status: RequestStatus;
  request_type: string;
  event_details: string;
  requested_date: string;
  start_time: string;
  duration_minutes: number;
  location_preference: string;
  alternate_date: string | null;
  recurrence: string | null;
  attendees: string;
  expected_participants: number;
  fees_charged: number;
  fee_amount_cad: number | null;
  full_name: string;
  email: string;
  phone: string;
  request_date: string;
  qualifications: string;
  certification_filename: string | null;
  signature: string;
  terms_version: string;
  notification_status: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  internal_notes: string | null;
}

const STATUSES = ["pending", "under_review", "approved", "declined", "cancelled"] as const;
type RequestStatus = typeof STATUSES[number];
const PAGE_SIZE = 25;
const CALENDAR_ID = "ammar@giccmasjid.org";
const CALENDAR_CID = "YW1tYXJAZ2ljY21hc2ppZC5vcmc%3D";

const SECURITY_HEADERS = {
  "Cache-Control": "no-store, private",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;",
})[character] ?? character);

const humanize = (value: string) =>
  value.replace(/_/g, " ").replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const htmlResponse = (body: string, status = 200) => new Response(body, {
  status,
  headers: {
    ...SECURITY_HEADERS,
    "Content-Type": "text/html; charset=utf-8",
  },
});

const errorPage = (message: string, status: number) => htmlResponse(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Staff request queue | GICC</title><style>${pageStyles}</style></head>
<body><main class="shell narrow"><p class="eyebrow">GICC staff</p><h1>Request queue unavailable</h1><p>${escapeHtml(message)}</p><p><a class="button" href="/">Return to the website</a></p></main></body></html>`, status);

const parsePage = (value: string | null) => {
  const page = Number(value ?? "1");
  return Number.isInteger(page) && page > 0 && page <= 1000 ? page : 1;
};

const isStatus = (value: unknown): value is RequestStatus =>
  typeof value === "string" && (STATUSES as readonly string[]).includes(value);

const statusFilter = (value: string | null): RequestStatus | "all" =>
  value === "all" || isStatus(value) ? value : "pending";

const vancouverDateTime = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Vancouver",
  }).format(date);
};

const calendarWeekUrl = (date: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const week = match ? `${match[1]}/${Number(match[2])}/${Number(match[3])}` : "";
  return `https://calendar.google.com/calendar/u/0/r/week/${week}?cid=${CALENDAR_CID}`;
};

const locationLabel = (value: string) => ({
  masjid: "GICC Masjid",
  yec: "GICC YEC",
  "no-preference": "No preference",
})[value] ?? humanize(value);

const queryString = (status: RequestStatus | "all", page: number) =>
  new URLSearchParams({ status, page: String(page) }).toString();

const detail = (label: string, value: unknown) => `
  <div class="detail"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || "—")}</dd></div>`;

const requestCard = (row: EventRequestRow, identity: StaffIdentity, currentStatus: RequestStatus | "all", page: number) => {
  const fee = row.fees_charged ? `$${Number(row.fee_amount_cad ?? 0).toFixed(2)} CAD per participant` : "No participant fee";
  const statusOptions = STATUSES.map((status) =>
    `<option value="${status}"${row.status === status ? " selected" : ""}>${escapeHtml(humanize(status))}</option>`,
  ).join("");

  return `<article class="request-card">
    <header class="request-head">
      <div><p class="reference">${escapeHtml(row.reference)}</p><h2>${escapeHtml(humanize(row.request_type))}</h2></div>
      <span class="badge badge-${escapeHtml(row.status)}">${escapeHtml(humanize(row.status))}</span>
    </header>
    <div class="schedule">
      <strong>${escapeHtml(row.requested_date)} at ${escapeHtml(row.start_time)}</strong>
      <span>${escapeHtml(row.duration_minutes)} minutes · ${escapeHtml(locationLabel(row.location_preference))}</span>
      <a href="${escapeHtml(calendarWeekUrl(row.requested_date))}" target="_blank" rel="noreferrer">Check this week in ${escapeHtml(CALENDAR_ID)} ↗</a>
    </div>
    <p class="event-details">${escapeHtml(row.event_details)}</p>
    <details>
      <summary>Applicant and request details</summary>
      <dl class="details-grid">
        ${detail("Applicant", row.full_name)}
        ${detail("Email", row.email)}
        ${detail("Phone", row.phone)}
        ${detail("Participants", row.expected_participants)}
        ${detail("Attendees", humanize(row.attendees))}
        ${detail("Fee", fee)}
        ${detail("Alternate date", row.alternate_date)}
        ${detail("Recurrence", row.recurrence)}
        ${detail("Qualifications", row.qualifications)}
        ${detail("Certification", row.certification_filename ? `${row.certification_filename} (private storage)` : "Not supplied")}
        ${detail("Signed by", row.signature)}
        ${detail("Terms version", row.terms_version)}
        ${detail("Notification", humanize(row.notification_status))}
        ${detail("Submitted", vancouverDateTime(row.submitted_at))}
        ${detail("Last reviewed", row.reviewed_at ? `${vancouverDateTime(row.reviewed_at)} by ${row.reviewed_by ?? "unknown"}` : "Not reviewed")}
      </dl>
    </details>
    <form method="post" action="/staff/requests" class="review-form">
      <input type="hidden" name="csrf_token" value="${escapeHtml(identity.csrfToken)}">
      <input type="hidden" name="request_id" value="${escapeHtml(row.id)}">
      <input type="hidden" name="return_status" value="${escapeHtml(currentStatus)}">
      <input type="hidden" name="return_page" value="${page}">
      <label>Status<select name="status">${statusOptions}</select></label>
      <label>Internal notes<textarea name="internal_notes" maxlength="2000" rows="3" placeholder="Operational notes only">${escapeHtml(row.internal_notes ?? "")}</textarea></label>
      <label class="check"><input type="checkbox" name="calendar_confirmed" value="yes"> Calendar event has been created (required when approving)</label>
      <button type="submit">Save review</button>
    </form>
  </article>`;
};

const renderQueue = ({
  rows,
  identity,
  currentStatus,
  page,
  notice,
}: {
  rows: EventRequestRow[];
  identity: StaffIdentity;
  currentStatus: RequestStatus | "all";
  page: number;
  notice: string;
}) => {
  const filters = ["pending", "under_review", "approved", "declined", "cancelled", "all"] as const;
  const filterLinks = filters.map((status) =>
    `<a href="/staff/requests?${queryString(status, 1)}"${currentStatus === status ? ' aria-current="page"' : ""}>${escapeHtml(humanize(status))}</a>`,
  ).join("");
  const previous = page > 1 ? `<a href="/staff/requests?${queryString(currentStatus, page - 1)}">← Previous</a>` : "<span></span>";
  const next = rows.length === PAGE_SIZE ? `<a href="/staff/requests?${queryString(currentStatus, page + 1)}">Next →</a>` : "<span></span>";
  const cards = rows.length > 0
    ? rows.map((row) => requestCard(row, identity, currentStatus, page)).join("")
    : '<div class="empty"><h2>No requests in this view</h2><p>Choose another status or check again after a new submission arrives.</p></div>';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Staff request queue | GICC</title><style>${pageStyles}</style></head>
<body><main class="shell">
  <header class="page-head"><div><p class="eyebrow">GICC staff</p><h1>Space request queue</h1><p>Review public requests here. Check availability and create confirmed bookings in the shared Google Calendar.</p></div>
  <div class="staff"><span>Signed in as</span><strong>${escapeHtml(identity.email)}</strong><a class="button secondary" href="https://calendar.google.com/calendar/u/0/r/week?cid=${CALENDAR_CID}" target="_blank" rel="noreferrer">Open GICC calendar ↗</a></div></header>
  ${notice ? `<p class="notice" role="status">${escapeHtml(notice)}</p>` : ""}
  <nav class="filters" aria-label="Request status">${filterLinks}</nav>
  <section class="request-list" aria-label="Space requests">${cards}</section>
  <nav class="pagination" aria-label="Pagination">${previous}<span>Page ${page}</span>${next}</nav>
</main></body></html>`;
};

const pageStyles = `
:root{color-scheme:dark;--navy:#031d31;--panel:#0a2b43;--panel2:#0e3552;--gold:#f4ca7a;--cream:#f8f4e9;--muted:#b7c7d3;--line:rgba(244,202,122,.25);font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 15% 0,#174a69 0,transparent 32rem),linear-gradient(145deg,#021522,#062a43 70%,#031d31);color:var(--cream);min-height:100vh}.shell{width:min(1120px,calc(100% - 32px));margin:auto;padding:48px 0 80px}.narrow{max-width:700px}.eyebrow{color:var(--gold);font-size:.75rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;margin:0 0 8px}h1{font-family:Georgia,serif;font-size:clamp(2.1rem,5vw,4rem);font-weight:500;line-height:1;margin:0 0 14px}h2{font-family:Georgia,serif;font-size:1.45rem;font-weight:500;margin:3px 0 0}.page-head{display:flex;justify-content:space-between;gap:32px;align-items:flex-start;margin-bottom:32px}.page-head>div:first-child{max-width:680px}.page-head p{color:var(--muted);line-height:1.65}.staff{display:flex;flex-direction:column;align-items:flex-end;gap:5px;text-align:right;font-size:.85rem}.staff span{color:var(--muted)}a{color:var(--gold)}.button,button{display:inline-flex;justify-content:center;border:1px solid var(--gold);border-radius:10px;background:var(--gold);color:#062238;padding:11px 16px;font:inherit;font-weight:800;text-decoration:none;cursor:pointer}.button.secondary{background:transparent;color:var(--gold);margin-top:10px}.filters{display:flex;gap:8px;overflow:auto;padding:4px 0 16px}.filters a{white-space:nowrap;border:1px solid var(--line);border-radius:999px;padding:8px 13px;color:var(--muted);text-decoration:none;font-size:.85rem}.filters a[aria-current=page]{background:var(--gold);border-color:var(--gold);color:#062238;font-weight:800}.notice{background:#153f3b;border:1px solid #4a9d83;border-radius:10px;padding:12px 15px}.request-list{display:grid;gap:18px}.request-card,.empty{background:linear-gradient(145deg,rgba(14,53,82,.96),rgba(5,34,54,.96));border:1px solid var(--line);border-radius:18px;padding:22px;box-shadow:0 18px 45px rgba(0,0,0,.18)}.request-head{display:flex;justify-content:space-between;gap:16px}.reference{font-size:.75rem;letter-spacing:.08em;color:var(--gold);font-weight:800;margin:0}.badge{height:max-content;border-radius:999px;padding:6px 10px;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;background:#233e53}.badge-approved{background:#1e5d4d}.badge-declined,.badge-cancelled{background:#68383c}.badge-under_review{background:#695624}.schedule{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;border-block:1px solid var(--line);padding:14px 0;margin:17px 0;color:var(--muted);font-size:.9rem}.schedule strong{color:var(--cream)}.schedule a{margin-left:auto}.event-details{white-space:pre-wrap;line-height:1.6}details{margin:15px 0}summary{color:var(--gold);cursor:pointer;font-weight:700}.details-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-top:12px}.detail{background:var(--panel);padding:11px}.detail dt{color:var(--muted);font-size:.72rem;text-transform:uppercase;letter-spacing:.06em}.detail dd{margin:4px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}.review-form{display:grid;grid-template-columns:190px 1fr;gap:12px;border-top:1px solid var(--line);padding-top:17px;margin-top:15px}.review-form label{display:grid;gap:6px;color:var(--muted);font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em}.review-form select,.review-form textarea{width:100%;border:1px solid rgba(255,255,255,.2);border-radius:9px;background:#021b2c;color:var(--cream);padding:10px;font:inherit;text-transform:none;letter-spacing:normal}.review-form .check{grid-column:1/-1;display:flex;grid-template-columns:none;align-items:center;flex-direction:row;text-transform:none;letter-spacing:normal}.review-form .check input{width:18px;height:18px}.review-form button{grid-column:2;justify-self:end}.pagination{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;margin-top:24px}.pagination a:last-child{text-align:right}.pagination span{color:var(--muted)}.empty{text-align:center}.empty p{color:var(--muted)}@media(max-width:720px){.shell{width:min(100% - 20px,1120px);padding-top:28px}.page-head{display:block}.staff{align-items:flex-start;text-align:left;margin-top:20px}.details-grid{grid-template-columns:1fr}.review-form{grid-template-columns:1fr}.review-form button{grid-column:1;width:100%}.schedule a{width:100%;margin-left:0}.request-card{padding:17px}}
`;

const loadRequests = async (db: D1Database, status: RequestStatus | "all", page: number) => {
  const offset = (page - 1) * PAGE_SIZE;
  const fields = `id, reference, status, request_type, event_details, requested_date, start_time,
    duration_minutes, location_preference, alternate_date, recurrence, attendees, expected_participants,
    fees_charged, fee_amount_cad, full_name, email, phone, request_date, qualifications,
    certification_filename, signature, terms_version, notification_status, submitted_at,
    reviewed_at, reviewed_by, internal_notes`;
  const statement = status === "all"
    ? db.prepare(`SELECT ${fields} FROM event_requests ORDER BY submitted_at DESC LIMIT ? OFFSET ?`).bind(PAGE_SIZE, offset)
    : db.prepare(`SELECT ${fields} FROM event_requests WHERE status = ? ORDER BY submitted_at DESC LIMIT ? OFFSET ?`).bind(status, PAGE_SIZE, offset);
  const result = await statement.all<EventRequestRow>();
  if (!result.success) throw new Error("D1 request query was not successful.");
  return result.results ?? [];
};

export const onRequestGet = async ({ request, env }: EventContext) => {
  const auth = await authenticateStaff(request, env);
  if (!auth.ok) return errorPage(auth.message, auth.status);
  if (!env.BOOKINGS_DB) return errorPage("The request database is not configured.", 503);

  const url = new URL(request.url);
  const currentStatus = statusFilter(url.searchParams.get("status"));
  const page = parsePage(url.searchParams.get("page"));
  const notice = url.searchParams.get("updated") === "1" ? "Request review saved." : "";

  try {
    const rows = await loadRequests(env.BOOKINGS_DB, currentStatus, page);
    return htmlResponse(renderQueue({ rows, identity: auth.identity, currentStatus, page, notice }));
  } catch (error) {
    console.error("staff_request_queue_failed", { message: error instanceof Error ? error.message : "Unknown error" });
    return errorPage("The request queue could not be loaded. Try again shortly.", 500);
  }
};

export const onRequestPost = async ({ request, env }: EventContext) => {
  const auth = await authenticateStaff(request, env);
  if (!auth.ok) return errorPage(auth.message, auth.status);
  if (!env.BOOKINGS_DB) return errorPage("The request database is not configured.", 503);

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (!origin || origin !== requestUrl.origin) return errorPage("Cross-site updates are not allowed.", 403);
  const contentLength = Number(request.headers.get("Content-Length") ?? 0);
  if (contentLength > 32_768) return errorPage("The review update is too large.", 413);

  try {
    const form = await request.formData();
    const csrfToken = form.get("csrf_token");
    const requestId = form.get("request_id");
    const nextStatus = form.get("status");
    const internalNotes = form.get("internal_notes");
    const calendarConfirmed = form.get("calendar_confirmed");
    const returnStatus = statusFilter(typeof form.get("return_status") === "string" ? String(form.get("return_status")) : null);
    const returnPage = parsePage(typeof form.get("return_page") === "string" ? String(form.get("return_page")) : null);

    if (csrfToken !== auth.identity.csrfToken) return errorPage("The review form expired. Reload the queue and try again.", 403);
    if (typeof requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(requestId)) return errorPage("The request identifier is invalid.", 400);
    if (!isStatus(nextStatus)) return errorPage("Choose a valid request status.", 400);
    if (typeof internalNotes !== "string" || internalNotes.trim().length > 2000) return errorPage("Internal notes must be 2,000 characters or fewer.", 400);
    if (nextStatus === "approved" && calendarConfirmed !== "yes") return errorPage("Create the shared-calendar event and confirm it before marking a request approved.", 400);

    const result = await env.BOOKINGS_DB.prepare(
      `UPDATE event_requests
       SET status = ?, reviewed_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), reviewed_by = ?, internal_notes = ?
       WHERE id = ?`,
    ).bind(nextStatus, auth.identity.email, internalNotes.trim() || null, requestId).run();

    if (!result.success) throw new Error("D1 request update was not successful.");
    if ((result.meta?.changes ?? 0) !== 1) return errorPage("The request was not found or was not updated.", 404);

    console.info("staff_request_reviewed", { requestId, status: nextStatus, reviewer: auth.identity.email });
    const location = `/staff/requests?${queryString(returnStatus, returnPage)}&updated=1`;
    return new Response(null, { status: 303, headers: { ...SECURITY_HEADERS, Location: location } });
  } catch (error) {
    console.error("staff_request_update_failed", { message: error instanceof Error ? error.message : "Unknown error" });
    return errorPage("The review could not be saved. Reload the queue and try again.", 500);
  }
};
