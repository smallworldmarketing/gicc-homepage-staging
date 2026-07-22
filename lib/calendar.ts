export type CalendarEvent = {
  summary?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  htmlLink?: string;
};

const CALENDAR_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID ?? "ammar@giccmasjid.org";

function validPayload(payload: unknown): CalendarEvent[] {
  if (!payload || typeof payload !== "object" || !("items" in payload)) {
    throw new Error("Calendar response was not valid");
  }

  const items = (payload as { items?: unknown }).items;
  if (!Array.isArray(items)) throw new Error("Calendar items were not valid");

  return items.filter(
    (item): item is CalendarEvent => Boolean(item && typeof item === "object"),
  );
}

export async function fetchCalendarEvents(
  signal: AbortSignal,
  maxResults = 12,
) {
  const fiveMinutes = 5 * 60 * 1000;
  const timeMin = new Date(
    Math.floor(Date.now() / fiveMinutes) * fiveMinutes,
  ).toISOString();
  const proxyParams = new URLSearchParams({
    calendarId: CALENDAR_ID,
    timeMin,
    maxResults: String(maxResults),
  });
  const response = await fetch(`/api/calendar?${proxyParams}`, { signal });

  if (!response.ok) {
    throw new Error(`Calendar request failed with status ${response.status}`);
  }

  return validPayload(await response.json());
}
