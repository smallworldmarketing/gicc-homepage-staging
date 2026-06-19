import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
  MoonStar,
  Phone,
  RefreshCw,
  Sparkles,
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

const COLORS = {
  navy: "#011640",
  blue: "#012c6d",
  royal: "#003399",
  blush: "#ffd6d6",
  rose: "#fff1f1",
  gold: "#a27d2c", // decorative only: borders, thumb states, icons on dark
  goldInk: "#846420", // gold as readable text on light bg (WCAG AA, 5.49:1 on white)
  goldGlow: "#c9a24a", // brighter gold for accents on the navy strip
  green: "#0f7f68",
  ink: "#142033",
  muted: "#5a6878", // darker than the old #617086 for comfortable AA on tinted bg
  line: "#dfe5ee",
  soft: "#f6f8fb",
  mist: "#f3f6fb", // calendar section bg
  frost: "#fbfcff", // toolbar / thumbnail bg
  cloud: "#f9fbff", // flyer feature card bg
  amber: "#fffaf0", // notice / active-thumb bg
  night: "#081020", // footer bg
  white: "#ffffff",
};

const FONT_DISPLAY = 'Spectral, Georgia, "Times New Roman", serif';

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
    ["Flyers", "flyers"],
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

function PrayerStrip({ isTablet, prayerTimes, prayerStatus }) {
  const times = [
    ["Fajr", formatPrayerTime(prayerTimes?.fajr_iqamah)],
    ["Dhuhr", formatPrayerTime(prayerTimes?.dhuhr_iqamah)],
    ["Asr", formatPrayerTime(prayerTimes?.asr_iqamah)],
    ["Maghrib", formatPrayerTime(prayerTimes?.maghrib_iqamah)],
    ["Isha", formatPrayerTime(prayerTimes?.isha_iqamah)],
  ];

  return (
    <View style={styles.prayerStrip}>
      <View style={[styles.sectionInner, styles.prayerInner, isTablet && styles.prayerInnerTablet]}>
        <View style={styles.stripHeading}>
          <Heading level={2} style={styles.stripTitle}>Iqama times</Heading>
          <Text style={styles.stripDate}>{vancouverLongDate()}</Text>
        </View>
        <View style={[styles.prayerTimes, isTablet && styles.prayerTimesTablet]}>
          {times.map(([label, value]) => (
            <View key={label} style={styles.prayerTime}>
              <Text style={styles.prayerLabel}>{label}</Text>
              <Text style={styles.prayerValue}>{value}</Text>
            </View>
          ))}
        </View>
        <Pressable onPress={() => openUrl(AWQAT_PAGE_URL, "_blank")} accessibilityRole="link" style={styles.stripLinkRow}>
          <Text style={styles.stripLink}>{prayerStatus === "error" ? "Open Awqat" : "Synced from Awqat"}</Text>
          <ArrowUpRight size={14} color={COLORS.goldGlow} />
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
                <Icon size={20} color={COLORS.green} strokeWidth={2} />
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
                <Icon size={22} color={COLORS.green} strokeWidth={1.9} />
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

function CommunityFlyers({ isMobile, isTablet }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFlyer = COMMUNITY_FLYERS[activeIndex];

  function moveFlyer(direction) {
    setActiveIndex((current) => (current + direction + COMMUNITY_FLYERS.length) % COMMUNITY_FLYERS.length);
  }

  return (
    <View nativeID="flyers" accessibilityRole="region" aria-label="Community flyers" style={[styles.flyerSection, isMobile && styles.mobileSection]}>
      <View style={[styles.sectionInner, styles.flyerLayout, isTablet && styles.stack]}>
        <View style={styles.flyerCopyPane}>
          <Heading level={2} style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet, isMobile && styles.sectionTitleMobile]}>
            Current programs and registrations.
          </Heading>
          <Text style={styles.bodyText}>
            Registration links, classes, youth sports, and learning opportunities for families across the GICC community.
          </Text>
          <View style={styles.flyerControls}>
            <Pressable onPress={() => moveFlyer(-1)} style={({ hovered }) => [styles.iconButton, hovered && styles.iconButtonHover]} accessibilityRole="button" accessibilityLabel="Previous flyer">
              <ChevronLeft size={22} color={COLORS.navy} />
            </Pressable>
            <Text style={styles.flyerCount}>{activeIndex + 1} / {COMMUNITY_FLYERS.length}</Text>
            <Pressable onPress={() => moveFlyer(1)} style={({ hovered }) => [styles.iconButton, hovered && styles.iconButtonHover]} accessibilityRole="button" accessibilityLabel="Next flyer">
              <ChevronRight size={22} color={COLORS.navy} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.flyerStage, isMobile && styles.flyerStageMobile]}>
          <Pressable
            onPress={() => openUrl(activeFlyer.href, "_blank")}
            style={({ hovered }) => [styles.flyerFeatureCard, isMobile && styles.flyerFeatureCardMobile, hovered && styles.flyerFeatureCardHover]}
            accessibilityRole="link"
            accessibilityLabel={`${activeFlyer.title} flyer, opens registration`}
          >
            {React.createElement("img", {
              src: activeFlyer.image,
              alt: `${activeFlyer.title} flyer`,
              loading: "eager",
              decoding: "async",
              style: {
                width: "100%",
                flex: "1 1 0%",
                minHeight: 0,
                objectFit: "contain",
                borderRadius: 6,
                backgroundColor: COLORS.white,
                display: "block",
              },
            })}
          </Pressable>
          <View style={[styles.flyerMeta, isMobile && styles.stack]}>
            <View>
              <Text style={styles.flyerTitle}>{activeFlyer.title}</Text>
              <Text style={styles.flyerSubtitle}>{activeFlyer.meta}</Text>
            </View>
            <Pressable onPress={() => openUrl(activeFlyer.href, "_blank")} style={styles.textLinkRow} accessibilityRole="link" accessibilityLabel={`Open details for ${activeFlyer.title}`}>
              <Text style={styles.textLink}>Open details</Text>
              <ArrowUpRight size={14} color={COLORS.goldInk} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.sectionInner}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.flyerRailScroll}
          contentContainerStyle={[styles.flyerRail, isMobile && styles.flyerRailMobile]}
        >
          {COMMUNITY_FLYERS.map((flyer, index) => {
            const isActive = index === activeIndex;
            return (
              <Pressable
                key={flyer.title}
                onPress={() => setActiveIndex(index)}
                style={({ hovered }) => [
                  styles.flyerThumb,
                  isActive && styles.flyerThumbActive,
                  hovered && styles.flyerThumbHover,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Show ${flyer.title}`}
                accessibilityState={{ selected: isActive }}
              >
                {React.createElement("img", {
                  src: flyer.thumb,
                  alt: "",
                  loading: "lazy",
                  decoding: "async",
                  width: 122,
                  height: 132,
                  style: {
                    width: "100%",
                    height: 132,
                    objectFit: "cover",
                    borderRadius: 6,
                    backgroundColor: COLORS.soft,
                    display: "block",
                  },
                })}
                <Text style={styles.flyerThumbTitle} numberOfLines={2}>{flyer.title}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
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
          <View style={[styles.calendarToolbar, isTablet && styles.stack]}>
            <View>
              <Text style={styles.calendarEmbedTitle}>Live calendar</Text>
              <Text style={styles.calendarEmbedMeta}>Source: {GOOGLE_CALENDAR_ID}</Text>
            </View>
            <Pressable onPress={() => openUrl(GOOGLE_CALENDAR_OPEN_URL, "_blank")} accessibilityRole="link" style={styles.textLinkRow}>
              <Text style={styles.textLink}>Manage in Google Calendar</Text>
              <ArrowUpRight size={14} color={COLORS.goldInk} />
            </Pressable>
          </View>
          <View style={styles.calendarAccessNotice}>
            <Text style={styles.calendarAccessTitle}>Calendar access note</Text>
            <Text style={styles.calendarAccessCopy}>
              If the embedded calendar looks empty, its Google sharing needs to be set to public. Until then, tap Open Calendar to see every event.
            </Text>
          </View>
          <View style={[styles.calendarEmbedShell, isMobile && styles.calendarEmbedShellMobile]}>
            <View style={styles.calendarPlaceholder} aria-hidden>
              <CalendarDays size={30} color={COLORS.gold} strokeWidth={1.7} />
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
        <Text style={styles.syncNote}>Calendar source: {GOOGLE_CALENDAR_ID}</Text>
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
        <PrayerStrip isTablet={isTablet} prayerTimes={prayerState.data} prayerStatus={prayerState.status} />
        <Welcome isTablet={isTablet} isMobile={isMobile} />
        <Programs isTablet={isTablet} isMobile={isMobile} />
        <CommunityFlyers isMobile={isMobile} isTablet={isTablet} />
        <CalendarSection isMobile={isMobile} isTablet={isTablet} />
        <NewCenter isTablet={isTablet} isMobile={isMobile} />
      </View>
      <Footer isTablet={isTablet} />
    </ScrollView>
  );
}

const baseShadow = "0 24px 60px rgba(1, 22, 64, 0.16)";
const easeOut = "cubic-bezier(0.22, 1, 0.36, 1)";

const styles = StyleSheet.create({
  app: {
    minHeight: "100vh",
    backgroundColor: COLORS.white,
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
    backgroundColor: "rgba(1,22,64,0.92)",
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
    backgroundColor: "rgba(1,22,64,0.74)",
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
    backgroundColor: "rgba(1,22,64,0.84)",
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
    backgroundColor: "rgba(1,22,64,0.97)",
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
    backgroundColor: COLORS.blush,
    transitionProperty: "background-color",
    transitionDuration: "160ms",
    transitionTimingFunction: easeOut,
  },
  donateLinkHover: {
    backgroundColor: "#ffc4c4",
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
    backgroundColor: "rgba(1,22,64,0.74)",
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
    color: COLORS.blush,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  heroTitle: {
    maxWidth: 880,
    color: COLORS.white,
    fontFamily: FONT_DISPLAY,
    fontSize: 92,
    fontWeight: "700",
    lineHeight: 92,
    letterSpacing: -1.2,
  },
  heroTitleTablet: {
    fontSize: 62,
    lineHeight: 64,
    letterSpacing: -0.8,
  },
  heroTitleMobile: {
    fontSize: 46,
    lineHeight: 49,
    letterSpacing: -0.5,
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
    backgroundColor: "rgba(1,22,64,0.34)",
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
    boxShadow: "0 10px 22px rgba(1,22,64,0.18)",
  },
  buttonPressed: {
    transform: "translateY(0px)",
  },
  buttonPrimary: {
    backgroundColor: COLORS.blush,
  },
  buttonSecondary: {
    backgroundColor: COLORS.green,
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
  prayerStrip: {
    backgroundColor: COLORS.navy,
  },
  prayerInner: {
    minHeight: 116,
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  prayerInnerTablet: {
    minHeight: 0,
    flexDirection: "column",
    alignItems: "stretch",
    paddingVertical: 28,
  },
  stripHeading: {
    width: 180,
  },
  stripTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 30,
  },
  stripDate: {
    marginTop: 4,
    color: "rgba(255,255,255,0.66)",
    fontSize: 13,
    fontWeight: "700",
  },
  prayerTimes: {
    flex: 1,
    flexDirection: "row",
    gap: 9,
  },
  prayerTimesTablet: {
    flexWrap: "wrap",
  },
  prayerTime: {
    flex: 1,
    minWidth: 118,
    minHeight: 70,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  prayerLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  prayerValue: {
    marginTop: 3,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "900",
  },
  stripLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  stripLink: {
    color: COLORS.goldGlow,
    fontWeight: "800",
    fontSize: 14,
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
    lineHeight: 60,
    letterSpacing: -0.6,
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
    boxShadow: "0 12px 30px rgba(1,22,64,0.05)",
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
  flyerSection: {
    overflow: "hidden",
    paddingVertical: 105,
    backgroundColor: COLORS.white,
  },
  flyerLayout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 64,
  },
  flyerCopyPane: {
    flex: 0.88,
    minWidth: 0,
  },
  flyerControls: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 26px rgba(1,22,64,0.08)",
    transitionProperty: "transform, box-shadow, background-color",
    transitionDuration: "160ms",
    transitionTimingFunction: easeOut,
  },
  iconButtonHover: {
    transform: "translateY(-1px)",
    backgroundColor: COLORS.soft,
  },
  flyerCount: {
    minWidth: 64,
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  flyerStage: {
    flex: 1.12,
    minWidth: 0,
  },
  flyerStageMobile: {
    width: "100%",
  },
  flyerFeatureCard: {
    width: "100%",
    maxWidth: 486,
    height: 660,
    alignSelf: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    backgroundColor: COLORS.cloud,
    boxShadow: baseShadow,
    transitionProperty: "transform, box-shadow",
    transitionDuration: "200ms",
    transitionTimingFunction: easeOut,
  },
  flyerFeatureCardMobile: {
    height: 540,
    padding: 10,
  },
  flyerFeatureCardHover: {
    transform: "translateY(-3px)",
  },
  flyerMeta: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  flyerTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
  },
  flyerSubtitle: {
    marginTop: 3,
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  flyerRailScroll: {
    marginTop: 34,
    overflow: "visible",
  },
  flyerRail: {
    gap: 12,
    paddingBottom: 10,
  },
  flyerRailMobile: {
    paddingRight: 16,
  },
  flyerThumb: {
    width: 138,
    minHeight: 192,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    backgroundColor: COLORS.frost,
    transitionProperty: "transform, border-color, background-color",
    transitionDuration: "160ms",
    transitionTimingFunction: easeOut,
  },
  flyerThumbActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.amber,
  },
  flyerThumbHover: {
    transform: "translateY(-2px)",
  },
  flyerThumbTitle: {
    marginTop: 9,
    color: COLORS.ink,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 15,
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
  calendarToolbar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    backgroundColor: COLORS.frost,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  calendarEmbedTitle: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "900",
  },
  calendarEmbedMeta: {
    marginTop: 3,
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  calendarAccessNotice: {
    margin: 16,
    marginBottom: 0,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(132,100,32,0.32)",
    borderRadius: 8,
    backgroundColor: COLORS.amber,
  },
  calendarAccessTitle: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: "900",
  },
  calendarAccessCopy: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  calendarEmbedShell: {
    position: "relative",
    height: 560,
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.line,
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
  syncNote: {
    minHeight: 28,
    marginTop: 16,
    color: COLORS.muted,
    fontSize: 14,
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
    color: COLORS.blush,
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
