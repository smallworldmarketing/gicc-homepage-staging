const FIRST_TOUCH_KEY = "gicc:first-touch";
const SESSION_KEY = "gicc:session-context";

const CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"] as const;
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

type FirstTouch = {
  landingUrl: string;
  referrer: string;
  firstSeenAt: string;
  userAgent: string;
  params: Record<string, string>;
};

type SessionContext = {
  startedAt: string;
  pages: string[];
};

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function captureFirstTouch() {
  if (typeof window === "undefined") return;
  try {
    if (!window.localStorage.getItem(FIRST_TOUCH_KEY)) {
      const search = new URL(window.location.href).searchParams;
      const params: Record<string, string> = {};
      [...UTM_FIELDS, ...CLICK_IDS].forEach((key) => {
        const value = search.get(key)?.trim();
        if (value) params[key] = value.slice(0, 500);
      });
      const firstTouch: FirstTouch = {
        landingUrl: window.location.href.slice(0, 2000),
        referrer: document.referrer.slice(0, 2000),
        firstSeenAt: new Date().toISOString(),
        userAgent: navigator.userAgent.slice(0, 1000),
        params,
      };
      window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
    }

    const existing = safeParse<SessionContext>(window.sessionStorage.getItem(SESSION_KEY));
    const path = `${window.location.pathname}${window.location.search}`.slice(0, 2000);
    const pages = existing?.pages ?? [];
    if (pages.at(-1) !== path) pages.push(path);
    window.sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        startedAt: existing?.startedAt ?? new Date().toISOString(),
        pages: pages.slice(-30),
      } satisfies SessionContext),
    );
  } catch {
    // Storage can be unavailable in private browsing. Submission falls back to live values.
  }
}

export function getAttributionPayload() {
  if (typeof window === "undefined") return {};
  let firstTouch: FirstTouch | null = null;
  let session: SessionContext | null = null;
  try {
    firstTouch = safeParse<FirstTouch>(window.localStorage.getItem(FIRST_TOUCH_KEY));
    session = safeParse<SessionContext>(window.sessionStorage.getItem(SESSION_KEY));
  } catch {
    // Use current page values below.
  }

  const startedAt = session?.startedAt ? Date.parse(session.startedAt) : Date.now();
  return {
    submittedOn: window.location.href.slice(0, 2000),
    landingUrl: firstTouch?.landingUrl ?? window.location.href.slice(0, 2000),
    referrer: firstTouch?.referrer ?? document.referrer.slice(0, 2000),
    firstSeenAt: firstTouch?.firstSeenAt ?? new Date().toISOString(),
    params: firstTouch?.params ?? {},
    pagesViewed: session?.pages ?? [window.location.pathname],
    timeOnSiteSeconds: Math.max(0, Math.round((Date.now() - startedAt) / 1000)),
    browserLanguage: navigator.language,
    browserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent.slice(0, 1000),
  };
}
