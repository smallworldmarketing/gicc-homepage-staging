import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  useWindowDimensions,
  View,
} from "react-native";
import {
  ArrowDown,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  CloudSun,
  Coffee,
  Copy,
  Download,
  ExternalLink,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  Moon,
  MoonStar,
  Phone,
  RefreshCw,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  UsersRound,
} from "lucide-react";
// Build-time derivatives via vite-imagetools: a medium WebP for the feature
// viewer and a small WebP for the thumbnail rail. Cuts the flyer payload from
// ~3.5 MB of full-res JPEGs to a few hundred KB of right-sized WebP.
import buildingImage from "../assets/new-masjid-building.jpg?w=1920&format=webp&quality=78";
import flyerGiccUnitedFull from "../assets/community-flyers/gicc-united-2026.jpeg?w=1000&format=webp&quality=80";
import flyerGiccUnitedThumb from "../assets/community-flyers/gicc-united-2026.jpeg?w=300&format=webp&quality=72";
import flyerIbnMasoodNewFull from "../assets/community-flyers/gicc-united-flyer-1.jpeg?w=1000&format=webp&quality=80";
import flyerIbnMasoodNewThumb from "../assets/community-flyers/gicc-united-flyer-1.jpeg?w=300&format=webp&quality=72";
import flyerWeekendArabicFull from "../assets/community-flyers/gicc-united-flyer-2.jpeg?w=1000&format=webp&quality=80";
import flyerWeekendArabicThumb from "../assets/community-flyers/gicc-united-flyer-2.jpeg?w=300&format=webp&quality=72";
import flyerIlmEssentialsFull from "../assets/community-flyers/gicc-united-flyer-3.jpeg?w=1000&format=webp&quality=80";
import flyerIlmEssentialsThumb from "../assets/community-flyers/gicc-united-flyer-3.jpeg?w=300&format=webp&quality=72";
import flyerHighSchoolMadrasahFull from "../assets/community-flyers/gicc-united-flyer-4.jpeg?w=1000&format=webp&quality=80";
import flyerHighSchoolMadrasahThumb from "../assets/community-flyers/gicc-united-flyer-4.jpeg?w=300&format=webp&quality=72";
import flyerMadrasahGradesOneSevenFull from "../assets/community-flyers/madrasah-grades-1-7.jpeg?w=1000&format=webp&quality=80";
import flyerMadrasahGradesOneSevenThumb from "../assets/community-flyers/madrasah-grades-1-7.jpeg?w=300&format=webp&quality=72";
import flyerMadrasahGradesEightTwelveFull from "../assets/community-flyers/madrasah-grades-8-12.jpeg?w=1000&format=webp&quality=80";
import flyerMadrasahGradesEightTwelveThumb from "../assets/community-flyers/madrasah-grades-8-12.jpeg?w=300&format=webp&quality=72";
import flyerHeartsHandsFull from "../assets/community-flyers/poster2.jpeg?w=1000&format=webp&quality=80";
import flyerHeartsHandsThumb from "../assets/community-flyers/poster2.jpeg?w=300&format=webp&quality=72";
import flyerYoungChampsFull from "../assets/community-flyers/poster3.jpeg?w=1000&format=webp&quality=80";
import flyerYoungChampsThumb from "../assets/community-flyers/poster3.jpeg?w=300&format=webp&quality=72";
import logoImage from "../assets/gicc-logo-white.png";

// GICC brand palette (client brand board, 2026-06): navy + gold.
const COLORS = {
  navy: "#002a48", // primary dark surface
  blueMid: "#2273ab", // mid blue accent (secondary button, on-dark)
  night: "#00182e", // deepest navy (footer)
  goldLight: "#fdd48d", // light gold: primary button + gold-on-dark text/accents
  goldInk: "#875b32", // gold TEXT / icons + active states on light (WCAG AA 5.9:1)
  ink: "#0a2236", // strong text on light
  muted: "#475a6b", // body text on light (AA 7.1:1, blue-tinted to match brand)
  line: "#dfe5ee",
  soft: "#f6f8fb",
  mist: "#f3f6fb", // calendar section bg
  white: "#ffffff",
};

const FONT_DISPLAY = 'Cormorant, "Cormorant Garamond", Georgia, serif';
const FONT_BODY =
  '"Poppins", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

// react-native-web's <Text> sets its own default font-family and does not
// inherit from ancestors, so wrap it to inject the brand body font as a base.
// Heading/label styles that set their own fontFamily (Cormorant) still win,
// since their style is composed after this base.
const baseTextStyle = { fontFamily: FONT_BODY };

function Text({ style, ...props }) {
  return <RNText style={style ? [baseTextStyle, style] : baseTextStyle} {...props} />;
}

const GOOGLE_CALENDAR_ID = "ammar@giccmasjid.org";
const GOOGLE_CALENDAR_EMBED_URL =
  "https://calendar.google.com/calendar/embed?src=ammar%40giccmasjid.org&ctz=America%2FVancouver&mode=AGENDA&showTitle=0&showPrint=0&showCalendars=0&showTabs=1";
const GOOGLE_CALENDAR_OPEN_URL = "https://calendar.google.com/calendar/u/0/r?cid=ammar%40giccmasjid.org";
const AWQAT_PAGE_URL = "https://www.awqat.net/masjid/masjid-guildford";
const AWQAT_SUPABASE_URL = "https://kjbutgbpddsadvnbgblg.supabase.co";
const AWQAT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYnV0Z2JwZGRzYWR2bmJnYmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NjQ1NjMsImV4cCI6MjA1MzM0MDU2M30.giaKfNM-hUj2UCrC_ZBUjamv9vFkhP7TORF5xkzyL4Y";
const MASJID_GUILDFORD_ID = "96ac3382-aef7-4710-a187-7002ba7f4323";
const COMMUNITY_FLYERS = [
  {
    title: "Hearts & Hands",
    meta: "Girls program",
    image: flyerHeartsHandsFull,
    thumb: flyerHeartsHandsThumb,
    href: "https://form.jotform.com/250506588302253",
  },
  {
    title: "GICC United Young Champs",
    meta: "Soccer registration",
    image: flyerYoungChampsFull,
    thumb: flyerYoungChampsThumb,
    href: "https://form.jotform.com/241621402102234",
  },
  {
    title: "Madrasah Grades 8-12",
    meta: "Ibn Masood Madrasah",
    image: flyerMadrasahGradesEightTwelveFull,
    thumb: flyerMadrasahGradesEightTwelveThumb,
    href: "https://giccmasjid.org/mfas/",
  },
  {
    title: "Madrasah Grades 1-7",
    meta: "Ibn Masood Madrasah",
    image: flyerMadrasahGradesOneSevenFull,
    thumb: flyerMadrasahGradesOneSevenThumb,
    href: "https://docs.google.com/forms/d/e/1FAIpQLScNVkR4Bhfh7dw_IIkpQpyNEkEododGvNDBDtOzytt4lbZpFw/viewform?vc=0&c=0&w=1&flr=0",
  },
  {
    title: "GICC United 2026",
    meta: "Soccer program",
    image: flyerGiccUnitedFull,
    thumb: flyerGiccUnitedThumb,
    href: "https://bit.ly/giccsoccer",
  },
  {
    title: "Ibn Masood New Timings",
    meta: "Madrasah registration",
    image: flyerIbnMasoodNewFull,
    thumb: flyerIbnMasoodNewThumb,
    href: "https://bit.ly/IbnMasood",
  },
  {
    title: "Weekend Arabic Program",
    meta: "Weekend classes",
    image: flyerWeekendArabicFull,
    thumb: flyerWeekendArabicThumb,
    href: "https://bit.ly/gicc-weekend",
  },
  {
    title: "Ilm Essentials",
    meta: "Foundations course",
    image: flyerIlmEssentialsFull,
    thumb: flyerIlmEssentialsThumb,
    href: "https://sites.google.com/view/ilm-essential-course/home",
  },
  {
    title: "High School Madrasah",
    meta: "Teen program",
    image: flyerHighSchoolMadrasahFull,
    thumb: flyerHighSchoolMadrasahThumb,
    href: "https://bit.ly/HS-Madrasah",
  },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Live reduced-motion preference: the coverflow and prayer reveals branch on
// this so motion degrades to a crossfade when the OS asks for less movement.
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => prefersReducedMotion());
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function openUrl(url, target = "_self") {
  if (typeof window !== "undefined") {
    if (target === "_blank") {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.href = url;
    return;
  }
  Linking.openURL(url);
}

function scrollToSection(id) {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

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

function vancouverLongDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Hijri date via the Islamic (Umm al-Qura) calendar. Falls back gracefully
// where the calendar isn't supported. Returns e.g. "Muharram 9, 1448 AH".
function hijriLongDate(date = new Date()) {
  try {
    const formatted = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
    return /AH|\d/.test(formatted) ? `${formatted.replace(/\s*AH$/, "")} AH` : null;
  } catch {
    return null;
  }
}

function formatPrayerTime(value) {
  const parsed = parsePrayerTime(value);
  if (!parsed) return "-";
  const period = parsed.hours >= 12 ? "PM" : "AM";
  const hour = parsed.hours % 12 || 12;
  return `${hour}:${String(parsed.minutes).padStart(2, "0")} ${period}`;
}

function parsePrayerTime(value) {
  const match = String(value || "").match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return {
    hours: Number(match[1]),
    minutes: Number(match[2]),
  };
}

function prayerMinutes(value) {
  const parsed = parsePrayerTime(value);
  return parsed ? parsed.hours * 60 + parsed.minutes : null;
}

function currentVancouverMinutes() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(values.hour) * 60 + Number(values.minute);
}

function getNextIqama(prayerTimes) {
  if (!prayerTimes) return "Loading...";
  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr_iqamah },
    { name: "Dhuhr", time: prayerTimes.dhuhr_iqamah },
    { name: "Asr", time: prayerTimes.asr_iqamah },
    { name: "Maghrib", time: prayerTimes.maghrib_iqamah },
    { name: "Isha", time: prayerTimes.isha_iqamah },
  ].filter((prayer) => prayerMinutes(prayer.time) !== null);

  const currentMinutes = currentVancouverMinutes();
  const next = prayers.find((prayer) => prayerMinutes(prayer.time) >= currentMinutes) ?? prayers[0];
  return next ? `${next.name} ${formatPrayerTime(next.time)}` : "Awqat";
}

async function fetchAwqatPrayerTimes() {
  const date = vancouverDateString();
  const params = new URLSearchParams({
    select:
      "prayer_date,fajr_azan,sunrise,dhuhr_azan,asr_azan,maghrib_azan,isha_azan,fajr_iqamah,dhuhr_iqamah,asr_iqamah,maghrib_iqamah,isha_iqamah,jumah_time_1,jumah_time_2,jumah_time_3",
    organization_id: `eq.${MASJID_GUILDFORD_ID}`,
    prayer_date: `eq.${date}`,
  });
  const response = await fetch(`${AWQAT_SUPABASE_URL}/rest/v1/daily_prayer_times?${params.toString()}`, {
    headers: {
      apikey: AWQAT_ANON_KEY,
      Authorization: `Bearer ${AWQAT_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Awqat request failed: ${response.status}`);
  }

  const records = await response.json();
  return Array.isArray(records) ? records[0] || null : null;
}

function Heading({ level, style, children, ...rest }) {
  return (
    <Text accessibilityRole="header" aria-level={level} style={style} {...rest}>
      {children}
    </Text>
  );
}

function IconText({ icon: Icon, children, color = COLORS.white, size = 14, style, textStyle }) {
  return (
    <View style={[styles.iconText, style]}>
      <Icon size={size} color={color} strokeWidth={2} />
      <Text style={[styles.iconTextLabel, { color }, textStyle]} numberOfLines={1}>{children}</Text>
    </View>
  );
}

function Button({ children, icon: Icon, variant = "primary", onPress, style, accessibilityLabel }) {
  const palette = variant === "secondary" ? styles.buttonSecondary : variant === "light" ? styles.buttonLight : styles.buttonPrimary;
  const textColor = variant === "primary" || variant === "light" ? COLORS.navy : COLORS.white;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ hovered, pressed }) => [styles.button, palette, hovered && styles.buttonHover, pressed && styles.buttonPressed, style]}
    >
      {Icon ? <Icon size={16} color={textColor} strokeWidth={2} /> : null}
      <Text style={[styles.buttonText, { color: textColor }]}>{children}</Text>
    </Pressable>
  );
}

function Header({ isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    ["About", "welcome"],
    ["Programs", "programs"],
    ["Registrations", "flyers"],
    ["Calendar", "calendar"],
    ["New Masjid", "new-center"],
    ["Contact", "contact"],
  ];
  const topbarItems = isMobile
    ? [
        [MapPin, "Surrey, BC"],
        [Phone, "+1 (604) 670-6732"],
      ]
    : [
        [MapPin, "15290 103A Ave #101, Surrey, BC"],
        [Phone, "+1 (604) 670-6732"],
        [Mail, "info@giccmasjid.org"],
      ];

  return (
    <View accessibilityRole="banner" style={styles.header}>
      <View style={[styles.topbar, isMobile && styles.topbarMobile]}>
        {topbarItems.map(([Icon, label]) => (
          <IconText key={label} icon={Icon} size={12} style={isMobile && styles.iconTextMobile} textStyle={isMobile && styles.iconTextLabelMobile}>
            {label}
          </IconText>
        ))}
      </View>
      <View accessibilityRole="navigation" style={[styles.nav, isMobile && styles.navMobile]}>
        <Image source={{ uri: logoImage }} accessibilityLabel="Guildford Islamic Cultural Center" style={[styles.logo, isMobile && styles.logoMobile]} resizeMode="contain" />
        {isMobile ? (
          <Pressable
            onPress={() => setMenuOpen((value) => !value)}
            style={styles.menuButton}
            accessibilityRole="button"
            accessibilityLabel={menuOpen ? "Close menu" : "Open menu"}
            accessibilityState={{ expanded: menuOpen }}
          >
            <Menu size={22} color={COLORS.white} />
          </Pressable>
        ) : null}
        {(!isMobile || menuOpen) ? (
          <View style={[styles.navLinks, isMobile && styles.navLinksMobile]}>
            {navItems.map(([label, id]) => (
              <Pressable
                key={id}
                accessibilityRole="link"
                style={({ hovered }) => [styles.navLinkWrap, hovered && styles.navLinkHover]}
                onPress={() => {
                  setMenuOpen(false);
                  scrollToSection(id);
                }}
              >
                <Text style={styles.navLink}>{label}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => openUrl("https://surreyislamiccenter.com/", "_blank")}
              style={({ hovered }) => [styles.donateLink, isMobile && styles.donateLinkMobile, hovered && styles.donateLinkHover]}
              accessibilityRole="link"
              accessibilityLabel="Donate to GICC"
            >
              <HeartHandshake size={16} color={COLORS.navy} />
              <Text style={styles.donateLinkText}>Donate</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function Hero({ isMobile, isTablet, prayerTimes }) {
  return (
    <View style={[styles.hero, isMobile && styles.heroMobile]}>
      <ImageBackground
        source={{ uri: buildingImage }}
        accessibilityLabel="The Guildford neighbourhood that GICC serves in Surrey, BC"
        style={styles.heroImage}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />
        <View style={[styles.heroContent, isMobile && styles.heroContentMobile]}>
          <Text style={styles.eyebrow}>Assalamu alaikum, welcome.</Text>
          <Heading level={1} style={[styles.heroTitle, isTablet && styles.heroTitleTablet, isMobile && styles.heroTitleMobile]}>
            Guildford Islamic Cultural Center
          </Heading>
          <Text style={[styles.heroCopy, isMobile && styles.heroCopyMobile]}>
            A spiritual home for daily prayer, Islamic learning, family programs, and community service in Guildford.
          </Text>
          <View style={[styles.heroActions, isMobile && styles.heroActionsMobile]}>
            <Button icon={CalendarDays} onPress={() => scrollToSection("calendar")} style={isMobile && styles.fullWidthButton}>
              View weekly events
            </Button>
            <Button
              icon={Building2}
              variant="secondary"
              onPress={() => openUrl("https://surreyislamiccenter.com/", "_blank")}
              style={isMobile && styles.fullWidthButton}
            >
              New Islamic Center
            </Button>
          </View>
        </View>
        <View style={[styles.heroStatus, (isTablet || isMobile) && styles.heroStatusTablet, isMobile && styles.heroStatusMobile]}>
          {[
            ["Next Iqama", getNextIqama(prayerTimes)],
            ["Jumuah", formatPrayerTime(prayerTimes?.jumah_time_1)],
            ["Calendar", "Live"],
          ].map(([label, value], index) => (
            <View key={label} style={[styles.statusCell, index === 2 && styles.statusCellLast, isMobile && styles.statusCellMobile]}>
              <Text style={styles.statusLabel}>{label}</Text>
              <Text style={styles.statusValue}>{value}</Text>
            </View>
          ))}
        </View>
      </ImageBackground>
    </View>
  );
}

function PrayerTimes({ isMobile, isTablet, prayerTimes, prayerStatus }) {
  const prayers = [
    ["Fajr", "الفجر", Sunrise, prayerTimes?.fajr_azan, prayerTimes?.fajr_iqamah],
    ["Dhuhr", "الظهر", Sun, prayerTimes?.dhuhr_azan, prayerTimes?.dhuhr_iqamah],
    ["Asr", "العصر", CloudSun, prayerTimes?.asr_azan, prayerTimes?.asr_iqamah],
    ["Maghrib", "المغرب", Sunset, prayerTimes?.maghrib_azan, prayerTimes?.maghrib_iqamah],
    ["Isha", "العشاء", Moon, prayerTimes?.isha_azan, prayerTimes?.isha_iqamah],
  ];
  const jummahs = [
    ["Jummah 1", "Brothers only", prayerTimes?.jumah_time_1],
    ["Jummah 2", "Brothers & Sisters", prayerTimes?.jumah_time_2],
    ["Jummah 3", "Brothers & Sisters", prayerTimes?.jumah_time_3],
  ];
  const hijri = hijriLongDate();

  return (
    <View nativeID="prayer" accessibilityRole="region" aria-label="Prayer times" style={styles.prayerSection}>
      <View style={styles.prayerPattern} aria-hidden />
      <View style={[styles.sectionInner, styles.prayerContent]}>
        <View style={[styles.prayerHeader, isTablet && styles.stack]}>
          <View style={styles.prayerHeaderText}>
            <Text style={styles.prayerArabicEyebrow}>أوقات الصلاة</Text>
            <Heading level={2} style={[styles.prayerHeading, isMobile && styles.prayerHeadingMobile]}>
              Prayer Times
            </Heading>
            <Button
              icon={Download}
              onPress={() => openUrl(AWQAT_PAGE_URL, "_blank")}
              accessibilityLabel="Download the monthly prayer times schedule"
              style={[styles.prayerDownload, isMobile && styles.fullWidthButton]}
            >
              Download Monthly Times
            </Button>
          </View>
          <View style={[styles.prayerDates, isTablet && styles.prayerDatesTablet]}>
            {hijri ? <Text style={styles.prayerHijri}>{hijri}</Text> : null}
            <Text style={styles.prayerGregorian}>{vancouverLongDate()}</Text>
          </View>
        </View>

        <View style={[styles.prayerGrid, isMobile && styles.prayerGridMobile]}>
          {prayers.map(([en, ar, Icon, azan, iqamah]) => (
            <View key={en} style={[styles.prayerCard, isMobile && styles.prayerCardMobile]}>
              <View style={styles.prayerCardTop}>
                <Text style={styles.prayerCardArabic}>{ar}</Text>
                <Icon size={19} color={COLORS.goldLight} strokeWidth={1.8} />
              </View>
              <Text style={styles.prayerCardName}>{en}</Text>
              <View style={styles.prayerCardRows}>
                <View style={styles.prayerCardRow}>
                  <Text style={styles.prayerCardRowLabel}>Start</Text>
                  <Text style={styles.prayerCardRowValue}>{formatPrayerTime(azan)}</Text>
                </View>
                <View style={[styles.prayerCardRow, styles.prayerCardRowIqama]}>
                  <Text style={styles.prayerCardRowLabel}>Iqama</Text>
                  <Text style={[styles.prayerCardRowValue, styles.prayerCardIqamaValue]}>{formatPrayerTime(iqamah)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.jummahBlock}>
          <View style={styles.jummahHeadingRow}>
            <View style={styles.jummahRule} />
            <Text style={styles.jummahHeading}>Friday Jumu'ah</Text>
            <View style={styles.jummahRule} />
          </View>
          <View style={[styles.jummahGrid, isTablet && styles.jummahGridTablet, isMobile && styles.stack]}>
            {jummahs.map(([label, audience, time]) => (
              <View key={label} style={styles.jummahCard}>
                <View style={styles.jummahCardHead}>
                  <Text style={styles.jummahCardArabic}>الجمعة</Text>
                  <MoonStar size={17} color={COLORS.goldLight} strokeWidth={1.8} />
                </View>
                <Text style={styles.jummahCardName}>{label}</Text>
                <View style={styles.jummahAudience}>
                  <UsersRound size={13} color={COLORS.goldLight} strokeWidth={2} />
                  <Text style={styles.jummahAudienceText}>{audience}</Text>
                </View>
                <Text style={styles.jummahCardTime}>{formatPrayerTime(time)}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable onPress={() => openUrl(AWQAT_PAGE_URL, "_blank")} accessibilityRole="link" style={styles.prayerSourceRow}>
          <Text style={styles.prayerSourceText}>
            {prayerStatus === "error" ? "Open prayer times on Awqat" : "Times synced live from Awqat"}
          </Text>
          <ArrowUpRight size={14} color={COLORS.goldLight} />
        </Pressable>
      </View>
    </View>
  );
}

function Welcome({ isTablet, isMobile }) {
  const points = [
    [MoonStar, "Daily salah and Jumuah"],
    [BookOpen, "Madrasah and Quran programs"],
    [UsersRound, "Youth and family support"],
    [HandHeart, "New Islamic Center project"],
  ];

  return (
    <View nativeID="welcome" accessibilityRole="region" aria-label="About GICC" style={[styles.whiteSection, isMobile && styles.mobileSection]}>
      <View style={[styles.sectionInner, styles.splitLayout, isTablet && styles.stack]}>
        <View style={styles.introCopy}>
          <Heading level={2} style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet, isMobile && styles.sectionTitleMobile]}>
            Prayer, learning, and service for the Muslim community of Guildford.
          </Heading>
          <Text style={styles.bodyText}>
            GICC is a masjid and community center committed to preserving Islamic identity, supporting a viable
            Muslim community, and promoting a comprehensive way of life based on the Quran and Sunnah.
          </Text>
        </View>
        <View style={styles.missionList}>
          {points.map(([Icon, label], index) => (
            <View key={label} style={[styles.missionItem, index > 0 && styles.missionItemDivider]}>
              <View style={styles.missionIcon}>
                <Icon size={20} color={COLORS.goldInk} strokeWidth={2} />
              </View>
              <Text style={styles.missionItemText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Programs({ isTablet, isMobile }) {
  const programs = [
    [GraduationCap, "Ibn Masood Madrasah", "Weekday Islamic education with Quran, Arabic, and foundational studies for young students.", "Mon to Fri", "4:30 PM"],
    [Sparkles, "Youth Night", "Guided discussions, brotherhood, sisterhood, and practical reminders for high-school students.", "Friday", "7:30 PM"],
    [BookMarked, "Quran Circle", "Recitation, reflection, and steady learning in a welcoming community setting.", "Saturday", "11:00 AM"],
    [Coffee, "Community Halaqa", "Sunday morning breakfast, reminders, and connection for families and newcomers.", "Sunday", "9:30 AM"],
  ];

  return (
    <View nativeID="programs" accessibilityRole="region" aria-label="Weekly programs" style={[styles.softSection, isMobile && styles.mobileSection]}>
      <View style={styles.sectionInner}>
        <View style={[styles.sectionHeading, isTablet && styles.stack]}>
          <View style={styles.headingTextWrap}>
            <Heading level={2} style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet, isMobile && styles.sectionTitleMobile]}>
              A weekly rhythm for every stage of family life.
            </Heading>
          </View>
          <Pressable onPress={() => scrollToSection("calendar")} accessibilityRole="link" style={styles.textLinkRow}>
            <Text style={styles.textLink}>See all events</Text>
            <ArrowDown size={14} color={COLORS.goldInk} />
          </Pressable>
        </View>
        <View style={styles.scheduleList}>
          {programs.map(([Icon, title, copy, day, time], index) => (
            <View key={title} style={[styles.scheduleRow, index === 0 && styles.scheduleRowFirst, isMobile && styles.scheduleRowMobile]}>
              <View style={styles.scheduleIcon}>
                <Icon size={22} color={COLORS.goldInk} strokeWidth={1.9} />
              </View>
              <View style={styles.scheduleBody}>
                <Text style={styles.scheduleTitle}>{title}</Text>
                <Text style={styles.scheduleCopy}>{copy}</Text>
              </View>
              <View style={[styles.scheduleWhen, isMobile && styles.scheduleWhenMobile]}>
                <Text style={styles.scheduleDay}>{day}</Text>
                <View style={styles.scheduleTimeRow}>
                  <Clock size={13} color={COLORS.goldInk} strokeWidth={2.2} />
                  <Text style={styles.scheduleTime}>{time}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ProgramsCarousel({ isMobile, isTablet }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const count = COMMUNITY_FLYERS.length;
  const active = COMMUNITY_FLYERS[activeIndex];

  const move = (direction) => setActiveIndex((i) => (i + direction + count) % count);
  const goTo = (i) => setActiveIndex(((i % count) + count) % count);

  const sideCount = isMobile ? 1 : 2;
  const cardW = isMobile ? 224 : isTablet ? 296 : 336;
  const cardH = isMobile ? 312 : isTablet ? 412 : 466;
  const spacing = isMobile ? 150 : isTablet ? 208 : 248;
  const stageH = cardH + 52;

  // Shortest signed distance around the ring, so the coverflow wraps both ways.
  function offsetOf(i) {
    let d = i - activeIndex;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  }

  function onStageKeyDown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  }

  return (
    <View nativeID="flyers" accessibilityRole="region" aria-label="Programs and registrations" style={styles.carouselSection}>
      <View style={styles.carouselPattern} aria-hidden />
      <View style={[styles.sectionInner, styles.carouselContent]}>
        <Text style={styles.carouselArabicEyebrow}>برامجنا</Text>
        <Heading level={2} style={[styles.carouselHeading, isMobile && styles.carouselHeadingMobile]}>
          Programs &amp; Registrations
        </Heading>
        <View style={styles.carouselDivider} aria-hidden>
          <View style={styles.carouselDividerLine} />
          <MoonStar size={16} color={COLORS.goldLight} strokeWidth={1.8} />
          <View style={styles.carouselDividerLine} />
        </View>

        {React.createElement(
          "div",
          {
            className: "coverflow-stage",
            role: "group",
            "aria-roledescription": "carousel",
            "aria-label": "Program flyers",
            tabIndex: 0,
            onKeyDown: onStageKeyDown,
            style: {
              position: "relative",
              width: "100%",
              height: stageH,
              marginTop: 6,
              perspective: isMobile ? "1100px" : "1700px",
              touchAction: "pan-y",
            },
          },
          COMMUNITY_FLYERS.map((flyer, i) => {
            const o = offsetOf(i);
            const abs = Math.abs(o);
            const visible = abs <= sideCount;
            const isActive = o === 0;
            const scale = isActive ? 1 : abs === 1 ? 0.84 : 0.68;
            const rotateY = reduceMotion || isActive ? 0 : o < 0 ? 32 : -32;
            const translateZ = reduceMotion || isActive ? 0 : -abs * 64;
            const translateX = o * spacing;
            const opacity = abs === 0 ? 1 : abs === 1 ? 0.72 : 0.34;
            const transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
            return React.createElement(
              "div",
              {
                key: flyer.title,
                "aria-hidden": !isActive,
                onClick: () => (isActive ? openUrl(flyer.href, "_blank") : goTo(i)),
                style: {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: cardW,
                  height: cardH,
                  transform,
                  transformStyle: "preserve-3d",
                  transition: reduceMotion
                    ? "opacity 220ms ease"
                    : `transform 540ms ${easeOut}, opacity 540ms ${easeOut}`,
                  opacity: visible ? opacity : 0,
                  zIndex: 50 - abs,
                  pointerEvents: visible ? "auto" : "none",
                  cursor: "pointer",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: isActive
                    ? `1.5px solid ${COLORS.goldLight}`
                    : "1px solid rgba(255,255,255,0.12)",
                  background: COLORS.night,
                  boxShadow: isActive
                    ? "0 34px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(253,212,141,0.22)"
                    : "0 18px 44px rgba(0,0,0,0.45)",
                  willChange: "transform, opacity",
                },
              },
              React.createElement("img", {
                src: flyer.image,
                alt: isActive ? `${flyer.title} — ${flyer.meta}` : "",
                loading: i <= sideCount ? "eager" : "lazy",
                decoding: "async",
                draggable: false,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                  display: "block",
                },
              })
            );
          })
        )}

        <View style={styles.carouselControls}>
          <Pressable
            onPress={() => move(-1)}
            style={({ hovered }) => [styles.carouselArrow, hovered && styles.carouselArrowHover]}
            accessibilityRole="button"
            accessibilityLabel="Previous program"
          >
            <ChevronLeft size={22} color={COLORS.goldLight} />
          </Pressable>
          <View style={styles.carouselDots}>
            {COMMUNITY_FLYERS.map((flyer, i) => (
              <Pressable
                key={flyer.title}
                onPress={() => goTo(i)}
                accessibilityRole="button"
                accessibilityLabel={`Show ${flyer.title}`}
                accessibilityState={{ selected: i === activeIndex }}
                style={styles.carouselDotHit}
              >
                <View style={[styles.carouselDot, i === activeIndex && styles.carouselDotActive]} />
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => move(1)}
            style={({ hovered }) => [styles.carouselArrow, hovered && styles.carouselArrowHover]}
            accessibilityRole="button"
            accessibilityLabel="Next program"
          >
            <ChevronRight size={22} color={COLORS.goldLight} />
          </Pressable>
        </View>

        <View style={styles.carouselCaption} accessibilityLiveRegion="polite">
          <Text style={styles.carouselCaptionTitle}>{active.title}</Text>
          <Text style={styles.carouselCaptionMeta}>{active.meta}</Text>
          <Button
            icon={ArrowUpRight}
            onPress={() => openUrl(active.href, "_blank")}
            accessibilityLabel={`Open ${active.title} registration`}
            style={[styles.carouselCaptionButton, isMobile && styles.fullWidthButton]}
          >
            Register now
          </Button>
        </View>
      </View>
    </View>
  );
}

function CalendarSection({ isMobile, isTablet }) {
  const [copied, setCopied] = useState(false);

  async function copyCalendarId() {
    try {
      await navigator.clipboard.writeText(GOOGLE_CALENDAR_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      openUrl(GOOGLE_CALENDAR_OPEN_URL, "_blank");
    }
  }

  return (
    <View nativeID="calendar" accessibilityRole="region" aria-label="Community calendar" style={[styles.calendarSection, isMobile && styles.mobileSection]}>
      <View style={styles.sectionInner}>
        <View style={[styles.sectionHeading, isTablet && styles.stack]}>
          <View style={styles.headingTextWrap}>
            <Heading level={2} style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet, isMobile && styles.sectionTitleMobile]}>GICC community calendar</Heading>
            <Text style={styles.bodyText}>Weekly programs and community events load from our shared GICC Google Calendar.</Text>
          </View>
          <View style={[styles.calendarActions, isMobile && styles.stack]}>
            <Button icon={RefreshCw} onPress={() => openUrl(GOOGLE_CALENDAR_OPEN_URL, "_blank")} style={isMobile && styles.fullWidthButton}>
              Open Calendar
            </Button>
            <Button icon={Download} variant="light" onPress={() => openUrl(GOOGLE_CALENDAR_EMBED_URL, "_blank")} style={isMobile && styles.fullWidthButton}>
              Full View
            </Button>
            <Button icon={Copy} variant="light" onPress={copyCalendarId} style={isMobile && styles.fullWidthButton}>{copied ? "Copied" : "Copy Calendar ID"}</Button>
          </View>
        </View>
        <View style={styles.calendarTool}>
          <View style={[styles.calendarEmbedShell, isMobile && styles.calendarEmbedShellMobile]}>
            <View style={styles.calendarPlaceholder} aria-hidden>
              <CalendarDays size={30} color={COLORS.goldInk} strokeWidth={1.7} />
              <Text style={styles.placeholderTitle}>Loading the GICC calendar</Text>
              <Text style={styles.placeholderCopy}>If events do not appear here, open the calendar directly.</Text>
              <Button icon={ExternalLink} variant="light" onPress={() => openUrl(GOOGLE_CALENDAR_OPEN_URL, "_blank")}>Open Calendar</Button>
            </View>
            {React.createElement("iframe", {
              title: "GICC Google Calendar",
              src: GOOGLE_CALENDAR_EMBED_URL,
              loading: "lazy",
              frameBorder: "0",
              style: {
                position: "relative",
                zIndex: 1,
                border: 0,
                width: "100%",
                height: "100%",
                minHeight: isMobile ? 420 : 560,
                display: "block",
              },
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

function NewCenter({ isTablet, isMobile }) {
  return (
    <View nativeID="new-center" accessibilityRole="region" aria-label="New Islamic Center project" style={styles.newCenterSection}>
      <View style={[styles.patternLayer]} />
      <View style={[styles.sectionInner, styles.newCenterLayout, isTablet && styles.stack]}>
        <View style={styles.newCenterCopy}>
          <Heading level={2} style={[styles.sectionTitle, styles.whiteTitle, isTablet && styles.sectionTitleTablet, isMobile && styles.sectionTitleMobile]}>
            Building a permanent house of worship in Guildford.
          </Heading>
          <Text style={styles.whiteBody}>
            The new center project gives the community more space for prayer, education, youth programs, and service.
            This homepage keeps the project visible without crowding the weekly worship experience.
          </Text>
        </View>
        <View style={styles.pledgePanel}>
          <Text style={styles.pledgeLabel}>Project focus</Text>
          <Text style={styles.pledgeTitle}>14888 104 Ave</Text>
          <Text style={styles.whiteBody}>Future Islamic Center property in Surrey, BC.</Text>
          <Button icon={ExternalLink} variant="secondary" onPress={() => openUrl("https://surreyislamiccenter.com/", "_blank")}>
            Visit project site
          </Button>
        </View>
      </View>
    </View>
  );
}

function Footer({ isTablet }) {
  return (
    <View nativeID="contact" accessibilityRole="contentinfo" style={styles.footer}>
      <View style={[styles.sectionInner, styles.footerLayout, isTablet && styles.stack]}>
        <View>
          <Image source={{ uri: logoImage }} accessibilityLabel="Guildford Islamic Cultural Center" style={styles.footerLogo} resizeMode="contain" />
          <Text style={styles.footerCopy}>Serving the Muslim community in Guildford, Surrey, British Columbia.</Text>
        </View>
        <View>
          <Text style={styles.footerHeading}>Contact</Text>
          <Text style={styles.footerLink}>+1 (604) 670-6732</Text>
          <Text style={styles.footerLink}>info@giccmasjid.org</Text>
          <Text style={styles.footerLink}>15290 103A Ave #101, Surrey, BC</Text>
        </View>
        <View>
          <Text style={styles.footerHeading}>Site</Text>
          <Text style={styles.footerLink}>About Us</Text>
          <Text style={styles.footerLink}>Iqama Times</Text>
          <Text style={styles.footerLink}>Contact Us</Text>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width < 1040;
  const useCompactHeader = width < 900;
  const [prayerState, setPrayerState] = useState({
    data: null,
    status: "loading",
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadPrayerTimes() {
      try {
        const data = await fetchAwqatPrayerTimes();
        if (!cancelled) {
          setPrayerState({ data, status: data ? "ready" : "empty", error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setPrayerState((current) => ({ ...current, status: "error", error }));
        }
      }
    }

    loadPrayerTimes();
    const interval = setInterval(loadPrayerTimes, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <ScrollView style={styles.app} contentContainerStyle={styles.page}>
      <Header isMobile={useCompactHeader} />
      <View accessibilityRole="main" style={styles.main}>
        <Hero isMobile={isMobile} isTablet={isTablet} prayerTimes={prayerState.data} />
        <PrayerTimes isMobile={isMobile} isTablet={isTablet} prayerTimes={prayerState.data} prayerStatus={prayerState.status} />
        <Welcome isTablet={isTablet} isMobile={isMobile} />
        <Programs isTablet={isTablet} isMobile={isMobile} />
        <ProgramsCarousel isMobile={isMobile} isTablet={isTablet} />
        <CalendarSection isMobile={isMobile} isTablet={isTablet} />
        <NewCenter isTablet={isTablet} isMobile={isMobile} />
      </View>
      <Footer isTablet={isTablet} />
    </ScrollView>
  );
}

const baseShadow = "0 24px 60px rgba(0, 42, 72, 0.18)";
const easeOut = "cubic-bezier(0.22, 1, 0.36, 1)";

const styles = StyleSheet.create({
  app: {
    minHeight: "100vh",
    backgroundColor: COLORS.white,
    fontFamily: FONT_BODY,
  },
  page: {
    minHeight: "100vh",
  },
  main: {
    width: "100%",
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  topbar: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: "rgba(0,42,72,0.92)",
  },
  topbarMobile: {
    minHeight: 34,
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: "hidden",
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  iconTextMobile: {
    flexShrink: 1,
    minWidth: 0,
  },
  iconTextLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  iconTextLabelMobile: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 11,
  },
  nav: {
    width: "calc(100% - 32px)",
    maxWidth: 1180,
    minHeight: 78,
    alignSelf: "center",
    marginTop: 12,
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 8,
    backgroundColor: "rgba(0,42,72,0.74)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
    backdropFilter: "blur(8px)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navMobile: {
    minHeight: 62,
    width: "calc(100% - 20px)",
    marginTop: 6,
    paddingLeft: 10,
    backgroundColor: "rgba(0,42,72,0.84)",
  },
  logo: {
    width: 150,
    height: 68,
  },
  logoMobile: {
    width: 112,
    height: 54,
  },
  menuButton: {
    width: 44,
    height: 44,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  navLinksMobile: {
    position: "fixed",
    top: 104,
    left: 16,
    right: 16,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 0,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 8,
    backgroundColor: "rgba(0,42,72,0.97)",
    boxShadow: baseShadow,
  },
  navLinkWrap: {
    borderRadius: 6,
    transitionProperty: "background-color",
    transitionDuration: "160ms",
    transitionTimingFunction: easeOut,
  },
  navLinkHover: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  navLink: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 13,
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontWeight: "700",
  },
  donateLink: {
    minHeight: 78,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: COLORS.goldLight,
    transitionProperty: "background-color",
    transitionDuration: "160ms",
    transitionTimingFunction: easeOut,
  },
  donateLinkHover: {
    backgroundColor: "#f6c878",
  },
  donateLinkText: {
    color: COLORS.navy,
    fontWeight: "900",
  },
  donateLinkMobile: {
    minHeight: 46,
    borderRadius: 8,
  },
  hero: {
    minHeight: "78vh",
    height: 780,
    maxHeight: 780,
  },
  heroMobile: {
    minHeight: 760,
    height: 760,
  },
  heroImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,42,72,0.74)",
  },
  heroContent: {
    width: "100%",
    maxWidth: 900,
    paddingHorizontal: 48,
    paddingBottom: 110,
    zIndex: 1,
    animationKeyframes: {
      "0%": { opacity: 0, transform: [{ translateY: 18 }] },
      "100%": { opacity: 1, transform: [{ translateY: 0 }] },
    },
    animationDuration: "760ms",
    animationTimingFunction: easeOut,
    animationFillMode: "both",
  },
  heroContentMobile: {
    paddingHorizontal: 20,
    paddingBottom: 245,
  },
  eyebrow: {
    marginBottom: 14,
    color: COLORS.goldLight,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  heroTitle: {
    maxWidth: 940,
    color: COLORS.white,
    fontFamily: FONT_DISPLAY,
    fontSize: 82,
    fontWeight: "700",
    lineHeight: 84,
    letterSpacing: -1,
    textTransform: "uppercase",
  },
  heroTitleTablet: {
    fontSize: 56,
    lineHeight: 58,
    letterSpacing: -0.8,
  },
  heroTitleMobile: {
    fontSize: 38,
    lineHeight: 41,
    letterSpacing: -0.4,
  },
  heroCopy: {
    width: "100%",
    maxWidth: 640,
    marginTop: 18,
    color: "rgba(255,255,255,0.88)",
    fontSize: 19,
    lineHeight: 28,
  },
  heroCopyMobile: {
    maxWidth: 340,
    fontSize: 16,
    lineHeight: 24,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 28,
  },
  heroActionsMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
    marginTop: 24,
  },
  heroStatus: {
    position: "absolute",
    right: 48,
    bottom: 42,
    zIndex: 2,
    width: 520,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 8,
    backgroundColor: "rgba(0,42,72,0.34)",
    backdropFilter: "blur(6px)",
    animationKeyframes: {
      "0%": { opacity: 0, transform: [{ translateY: 12 }] },
      "100%": { opacity: 1, transform: [{ translateY: 0 }] },
    },
    animationDuration: "760ms",
    animationDelay: "140ms",
    animationTimingFunction: easeOut,
    animationFillMode: "both",
  },
  heroStatusTablet: {
    left: 16,
    right: 16,
    bottom: 20,
    width: "auto",
  },
  heroStatusMobile: {
    flexDirection: "column",
    left: 20,
    right: 20,
    bottom: 22,
  },
  statusCell: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.18)",
  },
  statusCellLast: {
    borderRightWidth: 0,
  },
  statusCellMobile: {
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  statusLabel: {
    color: "rgba(255,255,255,0.74)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statusValue: {
    marginTop: 3,
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
  },
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transitionProperty: "transform, box-shadow, background-color",
    transitionDuration: "160ms",
    transitionTimingFunction: easeOut,
  },
  buttonHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 22px rgba(0,42,72,0.18)",
  },
  buttonPressed: {
    transform: "translateY(0px)",
  },
  buttonPrimary: {
    backgroundColor: COLORS.goldLight,
  },
  buttonSecondary: {
    backgroundColor: COLORS.blueMid,
  },
  buttonLight: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.line,
  },
  buttonText: {
    fontWeight: "900",
    fontSize: 15,
  },
  fullWidthButton: {
    width: "100%",
  },
  sectionInner: {
    width: "calc(100% - 32px)",
    maxWidth: 1180,
    alignSelf: "center",
  },
  headingTextWrap: {
    flexShrink: 1,
    minWidth: 0,
    maxWidth: 760,
  },
  prayerSection: {
    position: "relative",
    overflow: "hidden",
    paddingVertical: 96,
    backgroundColor: COLORS.navy,
    backgroundImage: `linear-gradient(160deg, ${COLORS.navy} 0%, ${COLORS.night} 100%)`,
  },
  prayerPattern: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.1,
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(253,212,141,0.55) 1px, transparent 0)",
    backgroundSize: "26px 26px",
  },
  prayerContent: {
    position: "relative",
    zIndex: 1,
  },
  prayerHeader: {
    marginBottom: 36,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 28,
  },
  prayerHeaderText: {
    flexShrink: 1,
    minWidth: 0,
  },
  prayerArabicEyebrow: {
    color: COLORS.goldLight,
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 30,
  },
  prayerHeading: {
    marginTop: 4,
    color: COLORS.white,
    fontFamily: FONT_DISPLAY,
    fontSize: 56,
    fontWeight: "700",
    lineHeight: 60,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  prayerHeadingMobile: {
    fontSize: 38,
    lineHeight: 42,
  },
  prayerDownload: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
  prayerDates: {
    alignItems: "flex-end",
  },
  prayerDatesTablet: {
    alignItems: "flex-start",
    marginTop: 18,
  },
  prayerHijri: {
    color: COLORS.goldLight,
    fontFamily: FONT_DISPLAY,
    fontSize: 27,
    fontWeight: "600",
    lineHeight: 31,
  },
  prayerGregorian: {
    marginTop: 4,
    color: "rgba(255,255,255,0.76)",
    fontSize: 14,
    fontWeight: "600",
  },
  prayerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  prayerGridMobile: {
    gap: 10,
  },
  prayerCard: {
    flexGrow: 1,
    flexBasis: 170,
    minWidth: 150,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  prayerCardMobile: {
    flexBasis: 150,
    minWidth: 142,
    padding: 14,
  },
  prayerCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  prayerCardArabic: {
    color: COLORS.goldLight,
    fontSize: 17,
    fontWeight: "600",
  },
  prayerCardName: {
    marginTop: 8,
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  prayerCardRows: {
    marginTop: 14,
  },
  prayerCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  prayerCardRowIqama: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  prayerCardRowLabel: {
    color: "rgba(255,255,255,0.66)",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  prayerCardRowValue: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },
  prayerCardIqamaValue: {
    color: COLORS.goldLight,
  },
  jummahBlock: {
    marginTop: 42,
  },
  jummahHeadingRow: {
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  jummahRule: {
    flex: 1,
    maxWidth: 150,
    height: 1,
    backgroundColor: "rgba(253,212,141,0.4)",
  },
  jummahHeading: {
    color: COLORS.goldLight,
    fontFamily: FONT_DISPLAY,
    fontSize: 30,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  jummahGrid: {
    flexDirection: "row",
    gap: 14,
  },
  jummahGridTablet: {
    flexWrap: "wrap",
  },
  jummahCard: {
    flexGrow: 1,
    flexBasis: 200,
    minWidth: 180,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  jummahCardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  jummahCardArabic: {
    color: COLORS.goldLight,
    fontSize: 17,
    fontWeight: "600",
  },
  jummahCardName: {
    marginTop: 8,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  jummahAudience: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(253,212,141,0.3)",
    backgroundColor: "rgba(253,212,141,0.12)",
  },
  jummahAudienceText: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontWeight: "700",
  },
  jummahCardTime: {
    marginTop: 14,
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "800",
  },
  prayerSourceRow: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  prayerSourceText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "700",
  },
  whiteSection: {
    paddingVertical: 105,
    backgroundColor: COLORS.white,
  },
  softSection: {
    paddingVertical: 105,
    backgroundColor: COLORS.soft,
  },
  calendarSection: {
    paddingVertical: 105,
    backgroundColor: COLORS.mist,
  },
  mobileSection: {
    paddingVertical: 64,
  },
  splitLayout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 80,
  },
  introCopy: {
    flex: 1.1,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontFamily: FONT_DISPLAY,
    fontSize: 56,
    fontWeight: "700",
    lineHeight: 62,
    letterSpacing: -0.25,
  },
  sectionTitleTablet: {
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.4,
  },
  sectionTitleMobile: {
    fontSize: 32,
    lineHeight: 37,
    letterSpacing: -0.2,
  },
  bodyText: {
    maxWidth: 660,
    marginTop: 18,
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 25,
  },
  missionList: {
    flex: 0.9,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    backgroundColor: COLORS.soft,
  },
  missionItem: {
    minHeight: 64,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  missionItemDivider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  missionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
  },
  missionItemText: {
    flex: 1,
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: "800",
  },
  sectionHeading: {
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 32,
  },
  textLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 4,
  },
  textLink: {
    color: COLORS.goldInk,
    fontWeight: "800",
    fontSize: 15,
  },
  scheduleList: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0,42,72,0.05)",
  },
  scheduleRow: {
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  scheduleRowFirst: {
    borderTopWidth: 0,
  },
  scheduleRowMobile: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 14,
  },
  scheduleIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.soft,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleBody: {
    flex: 1,
    minWidth: 0,
  },
  scheduleTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
  },
  scheduleCopy: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  scheduleWhen: {
    width: 116,
    alignItems: "flex-end",
  },
  scheduleWhenMobile: {
    width: 92,
  },
  scheduleDay: {
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
  },
  scheduleTimeRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  scheduleTime: {
    color: COLORS.goldInk,
    fontSize: 13,
    fontWeight: "800",
  },
  carouselSection: {
    position: "relative",
    overflow: "hidden",
    paddingVertical: 92,
    backgroundColor: COLORS.night,
    backgroundImage: `linear-gradient(180deg, ${COLORS.night} 0%, ${COLORS.navy} 52%, ${COLORS.night} 100%)`,
  },
  carouselPattern: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.08,
    backgroundImage:
      "linear-gradient(135deg, transparent 0 46%, rgba(253,212,141,0.7) 46% 47%, transparent 47% 100%), linear-gradient(45deg, transparent 0 46%, rgba(253,212,141,0.6) 46% 47%, transparent 47% 100%)",
    backgroundSize: "120px 120px",
  },
  carouselContent: {
    position: "relative",
    zIndex: 1,
    alignItems: "center",
  },
  carouselArabicEyebrow: {
    color: COLORS.goldLight,
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1,
  },
  carouselHeading: {
    marginTop: 6,
    color: COLORS.white,
    fontFamily: FONT_DISPLAY,
    fontSize: 60,
    fontWeight: "700",
    lineHeight: 64,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  carouselHeadingMobile: {
    fontSize: 36,
    lineHeight: 40,
  },
  carouselDivider: {
    marginTop: 14,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  carouselDividerLine: {
    width: 54,
    height: 1,
    backgroundColor: "rgba(253,212,141,0.5)",
  },
  carouselControls: {
    marginTop: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  carouselArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(253,212,141,0.45)",
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    transitionProperty: "transform, background-color, border-color",
    transitionDuration: "160ms",
    transitionTimingFunction: easeOut,
  },
  carouselArrowHover: {
    transform: "translateY(-1px)",
    borderColor: COLORS.goldLight,
    backgroundColor: "rgba(253,212,141,0.16)",
  },
  carouselDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  carouselDotHit: {
    minHeight: 44,
    minWidth: 20,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.28)",
    transitionProperty: "background-color, width",
    transitionDuration: "200ms",
    transitionTimingFunction: easeOut,
  },
  carouselDotActive: {
    width: 22,
    backgroundColor: COLORS.goldLight,
  },
  carouselCaption: {
    marginTop: 22,
    maxWidth: 520,
    alignItems: "center",
  },
  carouselCaptionTitle: {
    color: COLORS.white,
    fontFamily: FONT_DISPLAY,
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
    textAlign: "center",
  },
  carouselCaptionMeta: {
    marginTop: 6,
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    textAlign: "center",
  },
  carouselCaptionButton: {
    marginTop: 18,
  },
  calendarActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10,
  },
  calendarTool: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    boxShadow: baseShadow,
  },
  calendarEmbedShell: {
    position: "relative",
    height: 560,
    overflow: "hidden",
    backgroundColor: COLORS.soft,
  },
  calendarEmbedShellMobile: {
    height: 420,
  },
  calendarPlaceholder: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.soft,
  },
  placeholderTitle: {
    marginTop: 6,
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "900",
  },
  placeholderCopy: {
    maxWidth: 320,
    marginBottom: 8,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  newCenterSection: {
    position: "relative",
    overflow: "hidden",
    paddingVertical: 92,
    backgroundColor: COLORS.navy,
  },
  patternLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.12,
    backgroundImage:
      "linear-gradient(135deg, transparent 0 46%, rgba(255,255,255,0.8) 46% 48%, transparent 48% 100%), linear-gradient(45deg, transparent 0 46%, rgba(255,255,255,0.7) 46% 48%, transparent 48% 100%)",
    backgroundSize: "92px 92px",
  },
  newCenterLayout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 80,
  },
  newCenterCopy: {
    flex: 1,
  },
  whiteTitle: {
    color: COLORS.white,
  },
  whiteBody: {
    maxWidth: 640,
    marginTop: 16,
    marginBottom: 20,
    color: "rgba(255,255,255,0.82)",
    fontSize: 16,
    lineHeight: 25,
  },
  pledgePanel: {
    width: 420,
    maxWidth: "100%",
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  pledgeLabel: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pledgeTitle: {
    marginTop: 6,
    color: COLORS.white,
    fontSize: 50,
    fontWeight: "900",
    lineHeight: 50,
  },
  footer: {
    paddingVertical: 48,
    backgroundColor: COLORS.night,
  },
  footerLayout: {
    flexDirection: "row",
    gap: 48,
  },
  footerLogo: {
    width: 165,
    height: 78,
    marginBottom: 16,
  },
  footerCopy: {
    maxWidth: 320,
    color: "rgba(255,255,255,0.64)",
    lineHeight: 21,
  },
  footerHeading: {
    marginBottom: 14,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  footerLink: {
    marginBottom: 7,
    color: "rgba(255,255,255,0.8)",
  },
  stack: {
    flexDirection: "column",
    alignItems: "stretch",
  },
});
