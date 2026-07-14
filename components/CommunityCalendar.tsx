"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

type CalendarEvent = {
  id: string;
  summary: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

type CalendarState =
  | { status: "loading"; events: CalendarEvent[] }
  | { status: "ready"; events: CalendarEvent[] }
  | { status: "empty" | "error" | "unconfigured"; events: CalendarEvent[] };

const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
const CALENDAR_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;

function formatEventDate(event: CalendarEvent) {
  const raw = event.start?.dateTime ?? event.start?.date;
  if (!raw) return { day: "TBA", date: "", time: "Time to be announced" };
  const date = new Date(raw);
  const allDay = Boolean(event.start?.date && !event.start?.dateTime);
  return {
    day: new Intl.DateTimeFormat("en-CA", { weekday: "short", timeZone: "America/Vancouver" }).format(date),
    date: new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", timeZone: "America/Vancouver" }).format(date),
    time: allDay
      ? "All day"
      : new Intl.DateTimeFormat("en-CA", { hour: "numeric", minute: "2-digit", timeZone: "America/Vancouver" }).format(date),
  };
}

export function CommunityCalendar() {
  const [state, setState] = useState<CalendarState>(() =>
    CALENDAR_ID && CALENDAR_API_KEY
      ? { status: "loading", events: [] }
      : { status: "unconfigured", events: [] },
  );

  useEffect(() => {
    if (!CALENDAR_ID || !CALENDAR_API_KEY) return;

    const controller = new AbortController();
    const timeMin = new Date();
    const timeMax = new Date(timeMin.getTime() + 21 * 24 * 60 * 60 * 1000);
    const params = new URLSearchParams({
      key: CALENDAR_API_KEY,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "8",
    });

    fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Calendar request failed with ${response.status}`);
        const payload: unknown = await response.json();
        if (!payload || typeof payload !== "object" || !("items" in payload) || !Array.isArray(payload.items)) {
          throw new Error("Calendar response was not valid");
        }
        const events = payload.items.filter(
          (item): item is CalendarEvent =>
            Boolean(item && typeof item === "object" && "id" in item && "summary" in item),
        );
        setState({ status: events.length ? "ready" : "empty", events });
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Unable to load the GICC calendar", error);
        setState({ status: "error", events: [] });
      });

    return () => controller.abort();
  }, []);

  return (
    <section id="calendar" className="calendar-section" aria-labelledby="calendar-heading">
      <div className="shell section-space">
        <div className="calendar-heading-row">
          <div>
            <h2 id="calendar-heading">Community Calendar</h2>
            <p>Upcoming programs and events at GICC, synced live from our community calendar.</p>
          </div>
          <a className="button button--gold" href={SITE.calendarUrl} target="_blank" rel="noreferrer">
            Open Full Calendar <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="calendar-list" aria-live="polite" aria-busy={state.status === "loading"}>
          {state.status === "loading" ? <p className="calendar-message">Loading upcoming events…</p> : null}
          {state.events.map((event) => {
            const formatted = formatEventDate(event);
            return (
              <article className="calendar-event" key={event.id}>
                <time dateTime={event.start?.dateTime ?? event.start?.date}>
                  <strong>{formatted.day}</strong>
                  <span>{formatted.date}</span>
                </time>
                <div>
                  <h3>{event.summary}</h3>
                  {event.location ? <p><MapPin aria-hidden="true" /> {event.location}</p> : null}
                </div>
                <p className="calendar-event__time">{formatted.time}</p>
              </article>
            );
          })}
          {["empty", "error", "unconfigured"].includes(state.status) ? (
            <div className="calendar-message">
              <h3>See the complete GICC calendar</h3>
              <p>Open Google Calendar for the latest confirmed schedule.</p>
              <a className="button button--navy" href={SITE.calendarUrl} target="_blank" rel="noreferrer">
                View calendar <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
