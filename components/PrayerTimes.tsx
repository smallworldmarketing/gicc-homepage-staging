"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CloudSun,
  Moon,
  MoonStar,
  Sun,
  Sunrise,
  Sunset,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SITE } from "@/lib/site";

type PrayerTimesRecord = {
  prayer_date: string;
  fajr_azan: string | null;
  sunrise: string | null;
  dhuhr_azan: string | null;
  asr_azan: string | null;
  maghrib_azan: string | null;
  isha_azan: string | null;
  fajr_iqamah: string | null;
  dhuhr_iqamah: string | null;
  asr_iqamah: string | null;
  maghrib_iqamah: string | null;
  isha_iqamah: string | null;
  jumah_time_1: string | null;
  jumah_time_2: string | null;
  jumah_time_3: string | null;
};

type PrayerState =
  | { status: "loading"; data: null }
  | { status: "ready"; data: PrayerTimesRecord }
  | { status: "empty" | "error"; data: null };

const prayerIcons = [Sunrise, Sun, CloudSun, Sunset, Moon] as const;

function vancouverDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formatPrayerTime(value: string | null | undefined) {
  if (!value) return "—";
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;
  const hour = Number(match[1]);
  const minutes = match[2];
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${suffix}`;
}

function longDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function hijriDate() {
  try {
    return new Intl.DateTimeFormat("en-CA-u-ca-islamic-umalqura", {
      timeZone: "America/Vancouver",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  } catch {
    return null;
  }
}

async function loadPrayerTimes(signal: AbortSignal): Promise<PrayerTimesRecord | null> {
  const baseUrl = process.env.NEXT_PUBLIC_AWQAT_SUPABASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_AWQAT_SUPABASE_ANON_KEY;
  const organizationId = process.env.NEXT_PUBLIC_AWQAT_MASJID_ID;
  if (!baseUrl || !apiKey || !organizationId) return null;

  const params = new URLSearchParams({
    select:
      "prayer_date,fajr_azan,sunrise,dhuhr_azan,asr_azan,maghrib_azan,isha_azan,fajr_iqamah,dhuhr_iqamah,asr_iqamah,maghrib_iqamah,isha_iqamah,jumah_time_1,jumah_time_2,jumah_time_3",
    organization_id: `eq.${organizationId}`,
    prayer_date: `eq.${vancouverDateString()}`,
  });
  const response = await fetch(`${baseUrl}/rest/v1/daily_prayer_times?${params}`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    signal,
  });
  if (!response.ok) throw new Error(`Prayer time request failed with ${response.status}`);
  const records: unknown = await response.json();
  return Array.isArray(records) && records.length ? (records[0] as PrayerTimesRecord) : null;
}

export function PrayerTimes() {
  const [state, setState] = useState<PrayerState>({ status: "loading", data: null });
  const currentHijriDate = hijriDate();

  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const data = await loadPrayerTimes(controller.signal);
        setState(data ? { status: "ready", data } : { status: "empty", data: null });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Unable to load GICC prayer times", error);
        setState({ status: "error", data: null });
      }
    };
    void refresh();
    const interval = window.setInterval(refresh, 15 * 60 * 1000);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  const prayers = useMemo(() => {
    const data = state.data;
    return [
      { name: "Fajr", arabic: "الفجر", start: data?.fajr_azan, iqama: data?.fajr_iqamah },
      { name: "Dhuhr", arabic: "الظهر", start: data?.dhuhr_azan, iqama: data?.dhuhr_iqamah },
      { name: "Asr", arabic: "العصر", start: data?.asr_azan, iqama: data?.asr_iqamah },
      { name: "Maghrib", arabic: "المغرب", start: data?.maghrib_azan, iqama: data?.maghrib_iqamah },
      { name: "Isha", arabic: "العشاء", start: data?.isha_azan, iqama: data?.isha_iqamah },
    ];
  }, [state.data]);

  const jummahs = [
    { name: "Jumu’ah 1", audience: "Brothers only", time: state.data?.jumah_time_1 },
    { name: "Jumu’ah 2", audience: "Brothers & sisters", time: state.data?.jumah_time_2 },
    { name: "Jumu’ah 3", audience: "Brothers & sisters", time: state.data?.jumah_time_3 },
  ];

  return (
    <section id="prayer-times" className="prayer-section" aria-labelledby="prayer-heading">
      <div className="shell section-space">
        <div className="prayer-heading-row">
          <div>
            <p className="arabic-label" lang="ar">أوقات الصلاة</p>
            <h2 id="prayer-heading">Prayer times</h2>
            <a className="button button--gold" href={SITE.monthlyPrayerUrl} target="_blank" rel="noreferrer">
              <CalendarDays aria-hidden="true" /> Monthly prayer times
            </a>
          </div>
          <div className="date-stack">
            {currentHijriDate ? <p>{currentHijriDate}</p> : null}
            <p>{longDate()}</p>
          </div>
        </div>

        <div className="prayer-grid" aria-live="polite" aria-busy={state.status === "loading"}>
          {prayers.map((prayer, index) => {
            const Icon = prayerIcons[index];
            return (
              <article className="prayer-card" key={prayer.name}>
                <div className="prayer-card__top">
                  <span lang="ar">{prayer.arabic}</span>
                  <Icon aria-hidden="true" />
                </div>
                <h3>{prayer.name}</h3>
                <dl>
                  <div><dt>Start</dt><dd>{formatPrayerTime(prayer.start)}</dd></div>
                  <div><dt>Iqama</dt><dd>{formatPrayerTime(prayer.iqama)}</dd></div>
                </dl>
              </article>
            );
          })}
        </div>

        <div className="jummah-heading"><span /> <h3>Friday Jumu’ah</h3> <span /></div>
        <div className="jummah-grid">
          {jummahs.map((jummah) => (
            <article className="jummah-card" key={jummah.name}>
              <div>
                <MoonStar aria-hidden="true" />
                <h4>{jummah.name}</h4>
              </div>
              <p><UsersRound aria-hidden="true" /> {jummah.audience}</p>
              <strong>{formatPrayerTime(jummah.time)}</strong>
            </article>
          ))}
        </div>

        <a className="source-link" href={SITE.awqatUrl} target="_blank" rel="noreferrer">
          {state.status === "ready" ? "Times synced live from Awqat" : "Open current prayer times on Awqat"}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
