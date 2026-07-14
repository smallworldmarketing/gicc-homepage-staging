import ICAL from "ical.js";

const CALENDAR_ID = "ammar@giccmasjid.org";
const CALENDAR_ICS_URL =
  "https://calendar.google.com/calendar/ical/ammar%40giccmasjid.org/public/basic.ics";
const CALENDAR_OPEN_URL =
  "https://calendar.google.com/calendar/u/0/r?cid=ammar%40giccmasjid.org";
const CALENDAR_TIME_ZONE = "America/Vancouver";
const MAX_RESULTS_LIMIT = 24;
const MAX_EXPANSIONS_PER_EVENT = 5000;
const REQUEST_TIME_TOLERANCE_MS = 60 * 60 * 1000;

type CalendarItem = {
  summary: string;
  location?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink: string;
};

type OrderedCalendarItem = {
  item: CalendarItem;
  sortId: string;
};

function json(payload: unknown, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": status === 200 ? "public, max-age=300, stale-while-revalidate=900" : "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function dateOnly(time: InstanceType<typeof ICAL.Time>) {
  return `${String(time.year).padStart(4, "0")}-${String(time.month).padStart(2, "0")}-${String(time.day).padStart(2, "0")}`;
}

function timeZoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]));
  const representedAsUtc = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second,
  );
  return representedAsUtc - date.getTime();
}

function calendarInstant(time: InstanceType<typeof ICAL.Time>, timeZone: string) {
  if (time.isDate) return new Date(`${dateOnly(time)}T00:00:00.000Z`);
  if (time.zone?.tzid === "UTC" || time.zone?.tzid === "Z") return time.toJSDate();

  const wallClock = Date.UTC(time.year, time.month - 1, time.day, time.hour, time.minute, time.second);
  let instant = wallClock;
  for (let iteration = 0; iteration < 3; iteration += 1) {
    instant = wallClock - timeZoneOffset(new Date(instant), timeZone);
  }
  return new Date(instant);
}

function calendarDate(time: InstanceType<typeof ICAL.Time>, timeZone: string) {
  return time.isDate ? { date: dateOnly(time) } : { dateTime: calendarInstant(time, timeZone).toISOString() };
}

function recurringEventId(
  uid: string,
  occurrence: InstanceType<typeof ICAL.Time> | null,
  timeZone: string,
) {
  const eventId = uid.replace(/@google\.com$/i, "");
  if (!occurrence) return eventId;

  const seriesId = eventId.replace(/_R\d{8}T\d{6}Z?$/i, "");
  const recurrenceSuffix = occurrence.isDate
    ? dateOnly(occurrence).replace(/-/g, "")
    : calendarInstant(occurrence, timeZone)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(".000", "");
  return `${seriesId}_${recurrenceSuffix}`;
}

function googleEventUrl(eventId: string) {
  if (!eventId || !/^[A-Za-z0-9_-]+$/.test(eventId)) return CALENDAR_OPEN_URL;
  const encoded = btoa(`${eventId} ${CALENDAR_ID}`).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return `https://www.google.com/calendar/event?eid=${encoded}`;
}

function isCancelled(event: InstanceType<typeof ICAL.Event>) {
  return String(event.component.getFirstPropertyValue("status") ?? "").toUpperCase() === "CANCELLED";
}

function toItem(
  event: InstanceType<typeof ICAL.Event>,
  start: InstanceType<typeof ICAL.Time>,
  end: InstanceType<typeof ICAL.Time>,
  timeZone: string,
  eventId: string,
): OrderedCalendarItem {
  const eventUrl = event.component.getFirstPropertyValue("url");
  return {
    sortId: eventId,
    item: {
      summary: event.summary || "Community event",
      ...(event.location ? { location: event.location } : {}),
      start: calendarDate(start, timeZone),
      end: calendarDate(end, timeZone),
      htmlLink:
        typeof eventUrl === "string" && eventUrl.startsWith("https://") ? eventUrl : googleEventUrl(eventId),
    },
  };
}

export function expandCalendar(ics: string, timeMin: Date, maxResults: number) {
  const parsed = ICAL.parse(ics);
  const calendar = new ICAL.Component(parsed);
  const declaredTimeZone = calendar.getFirstPropertyValue("x-wr-timezone");
  const timeZone = typeof declaredTimeZone === "string" ? declaredTimeZone : CALENDAR_TIME_ZONE;

  for (const zoneComponent of calendar.getAllSubcomponents("vtimezone")) {
    const tzid = zoneComponent.getFirstPropertyValue("tzid");
    if (typeof tzid === "string") {
      ICAL.TimezoneService.register(new ICAL.Timezone({ component: zoneComponent, tzid }), tzid);
    }
  }

  const events = calendar.getAllSubcomponents("vevent").map((component) => new ICAL.Event(component));
  const masters = new Map<string, InstanceType<typeof ICAL.Event>>();
  for (const event of events) {
    if (!event.isRecurrenceException()) masters.set(event.uid, event);
  }
  for (const event of events) {
    if (event.isRecurrenceException()) masters.get(event.uid)?.relateException(event);
  }

  const horizon = new Date(timeMin.getTime() + 366 * 24 * 60 * 60 * 1000);
  const items: OrderedCalendarItem[] = [];
  for (const event of masters.values()) {
    if (isCancelled(event)) continue;
    if (!event.isRecurring()) {
      if (
        calendarInstant(event.endDate, timeZone) > timeMin &&
        calendarInstant(event.startDate, timeZone) <= horizon
      ) {
        const eventId = recurringEventId(event.uid, null, timeZone);
        items.push(toItem(event, event.startDate, event.endDate, timeZone, eventId));
      }
      continue;
    }

    const iterator = event.iterator();
    let occurrence = iterator.next();
    let expansions = 0;
    while (occurrence && expansions < MAX_EXPANSIONS_PER_EVENT) {
      expansions += 1;
      const details = event.getOccurrenceDetails(occurrence);
      const start = calendarInstant(details.startDate, timeZone);
      const end = calendarInstant(details.endDate, timeZone);
      if (start > horizon) break;
      if (end > timeMin && !isCancelled(details.item)) {
        const eventId = recurringEventId(details.item.uid, occurrence, timeZone);
        items.push(toItem(details.item, details.startDate, details.endDate, timeZone, eventId));
      }
      occurrence = iterator.next();
    }
  }

  return items
    .sort((left, right) => {
      const leftStart = new Date(left.item.start.dateTime ?? `${left.item.start.date}T00:00:00Z`).getTime();
      const rightStart = new Date(right.item.start.dateTime ?? `${right.item.start.date}T00:00:00Z`).getTime();
      return leftStart - rightStart || left.sortId.localeCompare(right.sortId);
    })
    .slice(0, maxResults)
    .map(({ item }) => item);
}

const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function loadIcs(request: Request) {
  const cache = (caches as CacheStorage & { default: Cache }).default;
  const cacheKey = new Request(CALENDAR_ICS_URL, { method: "GET" });
  const staleUrl = new URL(CALENDAR_ICS_URL);
  staleUrl.searchParams.set("gicc-cache", "stale");
  const staleCacheKey = new Request(staleUrl, { method: "GET" });
  let stale: Response | undefined;
  try {
    const cached = await cache.match(cacheKey);
    if (cached) return await cached.text();
    stale = await cache.match(staleCacheKey);
  } catch (error) {
    console.warn("Unable to read the calendar cache; continuing with the upstream feed", error);
  }

  let lastStatus = 0;
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const upstream = await fetch(CALENDAR_ICS_URL, {
        headers: { Accept: "text/calendar, text/plain;q=0.9" },
        signal: request.signal,
      });
      lastStatus = upstream.status;
      if (upstream.ok) {
        const body = await upstream.text();
        const headers = { "Content-Type": "text/calendar; charset=utf-8" };
        const cacheWrites = await Promise.allSettled([
          cache.put(
            cacheKey,
            new Response(body, { headers: { ...headers, "Cache-Control": "public, max-age=900" } }),
          ),
          cache.put(
            staleCacheKey,
            new Response(body, { headers: { ...headers, "Cache-Control": "public, max-age=604800" } }),
          ),
        ]);
        if (cacheWrites.some((write) => write.status === "rejected")) {
          console.warn("Unable to update one or more calendar cache entries");
        }
        return body;
      }
      if (attempt === 0 && (upstream.status === 429 || upstream.status >= 500)) {
        await delay(200);
        continue;
      }
      break;
    } catch (error) {
      if (request.signal.aborted) throw error;
      lastError = error;
      if (attempt === 0) {
        await delay(200);
        continue;
      }
    }
  }

  if (stale) {
    try {
      return await stale.text();
    } catch (error) {
      console.warn("Unable to read the stale calendar cache entry", error);
    }
  }
  throw new Error(
    lastError instanceof Error
      ? `Google Calendar ICS was unavailable: ${lastError.message}`
      : `Google Calendar ICS returned ${lastStatus || "an unknown error"}`,
  );
}

type Env = { GOOGLE_CALENDAR_API_KEY?: string };
type EventContext = { request: Request; env: Env };

async function loadGoogleCalendarApi(apiKey: string, timeMin: Date, maxResults: number, signal: AbortSignal) {
  const params = new URLSearchParams({
    singleEvents: "true",
    orderBy: "startTime",
    timeMin: timeMin.toISOString(),
    maxResults: String(maxResults),
    fields: "items(summary,location,start,end,htmlLink)",
  });
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`,
    { headers: { "X-Goog-Api-Key": apiKey }, signal },
  );
  if (!response.ok) throw new Error(`Google Calendar API returned ${response.status}`);
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !("items" in payload)) throw new Error("Invalid Calendar API payload");
  const items = (payload as { items?: unknown }).items;
  if (!Array.isArray(items)) throw new Error("Invalid Calendar API items");
  return items.slice(0, maxResults) as CalendarItem[];
}

export const onRequestGet = async ({ request, env }: EventContext) => {
  const url = new URL(request.url);
  const calendarId = url.searchParams.get("calendarId") ?? CALENDAR_ID;
  if (calendarId !== CALENDAR_ID) return json({ error: "Unsupported calendar" }, 400);

  const rawTimeMin = url.searchParams.get("timeMin");
  const timeMin = rawTimeMin ? new Date(rawTimeMin) : new Date();
  if (Number.isNaN(timeMin.getTime())) return json({ error: "timeMin must be an ISO date" }, 400);
  if (Math.abs(timeMin.getTime() - Date.now()) > REQUEST_TIME_TOLERANCE_MS) {
    return json({ error: "timeMin must be within one hour of the current time" }, 400);
  }

  const rawMaxResults = Number(url.searchParams.get("maxResults") ?? "12");
  if (!Number.isInteger(rawMaxResults) || rawMaxResults < 1 || rawMaxResults > MAX_RESULTS_LIMIT) {
    return json({ error: `maxResults must be between 1 and ${MAX_RESULTS_LIMIT}` }, 400);
  }

  try {
    if (env.GOOGLE_CALENDAR_API_KEY) {
      try {
        return json({
          items: await loadGoogleCalendarApi(
            env.GOOGLE_CALENDAR_API_KEY,
            timeMin,
            rawMaxResults,
            request.signal,
          ),
        });
      } catch (error) {
        console.warn("Google Calendar API unavailable; using the public calendar feed", error);
      }
    }
    const ics = await loadIcs(request);
    return json({ items: expandCalendar(ics, timeMin, rawMaxResults) });
  } catch (error) {
    console.error("Unable to load the public GICC calendar feed", error);
    return json({ error: "Calendar feed is temporarily unavailable" }, 502);
  }
};
