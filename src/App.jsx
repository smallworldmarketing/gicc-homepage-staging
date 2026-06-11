import React, { useMemo, useState } from "react";
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
import buildingImage from "../assets/new-masjid-building.jpg";
import logoImage from "../assets/gicc-logo-white.png";

const COLORS = {
  navy: "#011640",
  blue: "#012c6d",
  royal: "#003399",
  blush: "#ffd6d6",
  rose: "#fff1f1",
  gold: "#a27d2c",
  green: "#0f7f68",
  ink: "#142033",
  muted: "#617086",
  line: "#dfe5ee",
  soft: "#f6f8fb",
  white: "#ffffff",
};

const weeklyEvents = [
  {
    day: "Mon",
    title: "Ibn Masood Madrasah",
    time: "4:30 PM - 7:00 PM",
    location: "GICC classrooms",
    category: "learning",
  },
  {
    day: "Tue",
    title: "Ibn Masood Madrasah",
    time: "4:30 PM - 7:00 PM",
    location: "GICC classrooms",
    category: "learning",
  },
  {
    day: "Wed",
    title: "New Masjid Project Update",
    time: "8:00 PM - 8:45 PM",
    location: "Main prayer hall",
    category: "project",
  },
  {
    day: "Thu",
    title: "Quran Reflection Circle",
    time: "7:30 PM - 8:30 PM",
    location: "Main prayer hall",
    category: "learning",
  },
  {
    day: "Fri",
    title: "Jumuah Khutbah and Prayer",
    time: "1:15 PM - 2:30 PM",
    location: "GICC musalla",
    category: "prayer",
  },
  {
    day: "Fri",
    title: "Youth Night",
    time: "7:30 PM - 9:00 PM",
    location: "Community room",
    category: "family",
  },
  {
    day: "Sat",
    title: "Sisters Quran Circle",
    time: "11:00 AM - 12:15 PM",
    location: "Sisters area",
    category: "learning",
  },
  {
    day: "Sun",
    title: "Community Breakfast and Halaqa",
    time: "9:30 AM - 11:00 AM",
    location: "GICC community room",
    category: "family",
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const categories = ["prayer", "learning", "family", "project"];

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
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function vancouverDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(Number(values.year), Number(values.month) - 1, Number(values.day));
}

function weekStart(date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function addDays(date, daysToAdd) {
  const next = new Date(date);
  next.setDate(next.getDate() + daysToAdd);
  return next;
}

function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dateLabel(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getNextIqama() {
  const prayers = [
    { name: "Fajr", time: "04:30" },
    { name: "Dhuhr", time: "13:30" },
    { name: "Asr", time: "18:15" },
    { name: "Maghrib", time: "21:18" },
    { name: "Isha", time: "22:45" },
  ];
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const currentMinutes = Number(values.hour) * 60 + Number(values.minute);
  const next = prayers.find((prayer) => {
    const [hours, minutes] = prayer.time.split(":").map(Number);
    return hours * 60 + minutes >= currentMinutes;
  }) ?? prayers[0];
  const [hours, minutes] = next.time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${next.name} ${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function IconText({ icon: Icon, children, color = COLORS.white, size = 14, style, textStyle }) {
  return (
    <View style={[styles.iconText, style]}>
      <Icon size={size} color={color} strokeWidth={2} />
      <Text style={[styles.iconTextLabel, { color }, textStyle]} numberOfLines={1}>{children}</Text>
    </View>
  );
}

function Button({ children, icon: Icon, variant = "primary", onPress, style }) {
  const palette = variant === "secondary" ? styles.buttonSecondary : variant === "light" ? styles.buttonLight : styles.buttonPrimary;
  const textColor = variant === "primary" || variant === "light" ? COLORS.navy : COLORS.white;

  return (
    <Pressable onPress={onPress} style={({ hovered }) => [styles.button, palette, hovered && styles.buttonHover, style]}>
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
    <View style={styles.header}>
      <View style={[styles.topbar, isMobile && styles.topbarMobile]}>
        {topbarItems.map(([Icon, label]) => (
          <IconText key={label} icon={Icon} size={12} style={isMobile && styles.iconTextMobile} textStyle={isMobile && styles.iconTextLabelMobile}>
            {label}
          </IconText>
        ))}
      </View>
      <View style={[styles.nav, isMobile && styles.navMobile]}>
        <Image source={{ uri: logoImage }} style={[styles.logo, isMobile && styles.logoMobile]} resizeMode="contain" />
        {isMobile ? (
          <Pressable onPress={() => setMenuOpen((value) => !value)} style={styles.menuButton} accessibilityRole="button">
            <Menu size={22} color={COLORS.white} />
          </Pressable>
        ) : null}
        {(!isMobile || menuOpen) ? (
          <View style={[styles.navLinks, isMobile && styles.navLinksMobile]}>
            {navItems.map(([label, id]) => (
              <Pressable key={id} onPress={() => {
                setMenuOpen(false);
                scrollToSection(id);
              }}>
                <Text style={styles.navLink}>{label}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => openUrl("https://surreyislamiccenter.com/", "_blank")}
              style={[styles.donateLink, isMobile && styles.donateLinkMobile]}
              accessibilityRole="link"
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

function Hero({ isMobile, isTablet }) {
  return (
    <View style={[styles.hero, isMobile && styles.heroMobile]}>
      <ImageBackground source={{ uri: buildingImage }} style={styles.heroImage} resizeMode="cover">
        <View style={styles.heroOverlay} />
        <View style={[styles.heroContent, isMobile && styles.heroContentMobile]}>
          <Text style={styles.eyebrow}>Assalam u Alaikum</Text>
          <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>Guildford Islamic Cultural Center</Text>
          <Text style={[styles.heroCopy, isMobile && styles.heroCopyMobile]}>
            A spiritual home for daily prayer, Islamic learning, family programs, and community service in Guildford.
          </Text>
          <View style={[styles.heroActions, isMobile && styles.heroActionsMobile]}>
            <Button icon={CalendarDays} onPress={() => scrollToSection("calendar")} style={isMobile && styles.fullWidthButton}>
              View Weekly Events
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
            ["Next Iqama", getNextIqama()],
            ["Jumuah", "1:15 PM"],
            ["This Week", "8 Programs"],
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

function PrayerStrip({ isTablet }) {
  const times = [
    ["Fajr", "4:30"],
    ["Dhuhr", "1:30"],
    ["Asr", "6:15"],
    ["Maghrib", "Sunset"],
    ["Isha", "10:45"],
  ];

  return (
    <View style={styles.prayerStrip}>
      <View style={[styles.sectionInner, styles.prayerInner, isTablet && styles.prayerInnerTablet]}>
        <View style={styles.stripHeading}>
          <Text style={styles.eyebrowDark}>Today</Text>
          <Text style={styles.stripTitle}>Iqama Times</Text>
        </View>
        <View style={[styles.prayerTimes, isTablet && styles.prayerTimesTablet]}>
          {times.map(([label, value]) => (
            <View key={label} style={styles.prayerTime}>
              <Text style={styles.prayerLabel}>{label}</Text>
              <Text style={styles.prayerValue}>{value}</Text>
            </View>
          ))}
        </View>
        <Pressable onPress={() => openUrl("https://giccmasjid.org/iqama-times/", "_blank")} style={styles.textLinkRow}>
          <Text style={styles.textLink}>Current schedule</Text>
          <ArrowUpRight size={14} color={COLORS.gold} />
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
    <View nativeID="welcome" style={[styles.whiteSection, isMobile && styles.mobileSection]}>
      <View style={[styles.sectionInner, styles.splitLayout, isTablet && styles.stack]}>
        <View style={styles.introCopy}>
          <Text style={styles.eyebrowDark}>Welcome to GICC</Text>
          <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
            Prayer, learning, and service for the Muslim community of Guildford.
          </Text>
          <Text style={styles.bodyText}>
            GICC is a masjid and community center committed to preserving Islamic identity, supporting a viable
            Muslim community, and promoting a comprehensive way of life based on the Quran and Sunnah.
          </Text>
        </View>
        <View style={styles.missionPoints}>
          {points.map(([Icon, label]) => (
            <View key={label} style={styles.missionPoint}>
              <Icon size={22} color={COLORS.green} strokeWidth={2} />
              <Text style={styles.missionPointText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Programs({ isTablet, isMobile }) {
  const programs = [
    [GraduationCap, "Ibn Masood Madrasah", "Weekday Islamic education for young students with Quran, Arabic, and foundational studies.", "Mon-Fri, 4:30 PM"],
    [Sparkles, "Youth Night", "Guided discussions, brotherhood, sisterhood, and practical reminders for high-school students.", "Friday, 7:30 PM"],
    [BookMarked, "Quran Circle", "Recitation, reflection, and steady learning in a welcoming community setting.", "Saturday, 11:00 AM"],
    [Coffee, "Community Halaqa", "Sunday morning breakfast, reminders, and connection for families and newcomers.", "Sunday, 9:30 AM"],
  ];

  return (
    <View nativeID="programs" style={[styles.softSection, isMobile && styles.mobileSection]}>
      <View style={styles.sectionInner}>
        <View style={[styles.sectionHeading, isMobile && styles.stack]}>
          <View>
            <Text style={styles.eyebrowDark}>Ongoing Programs</Text>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              A weekly rhythm for every stage of family life.
            </Text>
          </View>
          <Pressable onPress={() => scrollToSection("calendar")} style={styles.textLinkRow}>
            <Text style={styles.textLink}>See all events</Text>
            <ArrowDown size={14} color={COLORS.gold} />
          </Pressable>
        </View>
        <View style={[styles.programGrid, isTablet && styles.programGridTablet, isMobile && styles.stack]}>
          {programs.map(([Icon, title, copy, time]) => (
            <View key={title} style={[styles.programCard, isTablet && styles.programCardTablet, isMobile && styles.programCardMobile]}>
              <Icon size={28} color={COLORS.gold} strokeWidth={1.9} />
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardCopy}>{copy}</Text>
              <Text style={styles.cardMeta}>{time}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function CalendarSection({ isMobile, isTablet }) {
  const [view, setView] = useState("week");
  const [active, setActive] = useState(categories);
  const today = useMemo(() => vancouverDate(), []);
  const dateByDay = useMemo(() => {
    const start = weekStart(today);
    return Object.fromEntries(days.map((day, index) => [day, addDays(start, index)]));
  }, [today]);
  const visibleEvents = weeklyEvents.filter((event) => active.includes(event.category));

  function toggleCategory(category) {
    setActive((current) => (
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    ));
  }

  async function copyFeed() {
    const feedUrl = "webcal://giccmasjid.org/events.ics";
    try {
      await navigator.clipboard.writeText(feedUrl);
    } catch {
      return;
    }
  }

  return (
    <View nativeID="calendar" style={[styles.calendarSection, isMobile && styles.mobileSection]}>
      <View style={styles.sectionInner}>
        <View style={[styles.sectionHeading, isTablet && styles.stack]}>
          <View>
            <Text style={styles.eyebrowDark}>Sync Weekly Events</Text>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>GICC community calendar</Text>
            <Text style={styles.bodyText}>Subscribe once and weekly programs stay on your phone, desktop, or family calendar.</Text>
          </View>
          <View style={[styles.calendarActions, isMobile && styles.stack]}>
            <Button icon={RefreshCw} onPress={() => openUrl("webcal://giccmasjid.org/events.ics")} style={isMobile && styles.fullWidthButton}>
              Subscribe
            </Button>
            <Button icon={Download} variant="light" onPress={() => openUrl("./events.ics")} style={isMobile && styles.fullWidthButton}>
              Download ICS
            </Button>
            <Button icon={Copy} variant="light" onPress={copyFeed} style={isMobile && styles.fullWidthButton}>Copy Feed</Button>
          </View>
        </View>
        <View style={styles.calendarTool}>
          <View style={[styles.calendarToolbar, isTablet && styles.stack]}>
            <View style={styles.segmented}>
              {["week", "list"].map((item) => (
                <Pressable key={item} onPress={() => setView(item)} style={[styles.segmentButton, view === item && styles.segmentButtonActive]}>
                  <Text style={[styles.segmentText, view === item && styles.segmentTextActive]}>{item === "week" ? "Week" : "List"}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.filters}>
              {categories.map((category) => (
                <Pressable key={category} onPress={() => toggleCategory(category)} style={styles.filterChip}>
                  <Text style={styles.filterCheck}>{active.includes(category) ? "✓" : ""}</Text>
                  <Text style={styles.filterText}>{category[0].toUpperCase() + category.slice(1)}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {view === "week" ? (
            <View style={[styles.weekGrid, isTablet && styles.weekGridTablet, isMobile && styles.stack]}>
              {days.map((day) => {
                const events = visibleEvents.filter((event) => event.day === day);
                const isToday = sameDate(dateByDay[day], today);
                return (
                  <View key={day} style={[styles.dayColumn, isToday && styles.todayColumn, isMobile && styles.dayColumnMobile]}>
                    <View style={styles.dayHeading}>
                      <Text style={styles.dayName}>{day}</Text>
                      <Text style={styles.dayDate}>{dateLabel(dateByDay[day])}</Text>
                    </View>
                    {events.length ? events.map((event) => <EventChip key={`${day}-${event.title}`} event={event} />) : (
                      <Text style={styles.emptyDay}>No recurring program listed.</Text>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.eventList}>
              {visibleEvents.map((event) => (
                <View key={`${event.day}-${event.title}`} style={styles.eventRow}>
                  <Text style={styles.eventRowDate}>{event.day}, {dateLabel(dateByDay[event.day])}</Text>
                  <View style={styles.eventRowBody}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventMeta}>{event.location}</Text>
                  </View>
                  <Text style={styles.eventRowTime}>{event.time}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <Text style={styles.syncNote}>Feed URL: webcal://giccmasjid.org/events.ics</Text>
      </View>
    </View>
  );
}

function EventChip({ event }) {
  return (
    <View style={[styles.eventChip, styles[`eventBorder_${event.category}`]]}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventMeta}>{event.time}</Text>
      <Text style={styles.eventMeta}>{event.location}</Text>
    </View>
  );
}

function NewCenter({ isTablet, isMobile }) {
  return (
    <View nativeID="new-center" style={styles.newCenterSection}>
      <View style={[styles.patternLayer]} />
      <View style={[styles.sectionInner, styles.newCenterLayout, isTablet && styles.stack]}>
        <View style={styles.newCenterCopy}>
          <Text style={styles.eyebrow}>New Islamic Center Project</Text>
          <Text style={[styles.sectionTitle, styles.whiteTitle, isMobile && styles.sectionTitleMobile]}>
            Building a permanent house of worship in Guildford.
          </Text>
          <Text style={styles.whiteBody}>
            The new center project gives the community more space for prayer, education, youth programs, and service.
            This homepage keeps the project visible without crowding the weekly worship experience.
          </Text>
        </View>
        <View style={styles.pledgePanel}>
          <Text style={styles.pledgeLabel}>Project Focus</Text>
          <Text style={styles.pledgeTitle}>14888 104 Ave</Text>
          <Text style={styles.whiteBody}>Future Islamic Center property in Surrey, BC.</Text>
          <Button icon={ExternalLink} variant="secondary" onPress={() => openUrl("https://surreyislamiccenter.com/", "_blank")}>
            Visit Project Site
          </Button>
        </View>
      </View>
    </View>
  );
}

function Footer({ isTablet }) {
  return (
    <View nativeID="contact" style={styles.footer}>
      <View style={[styles.sectionInner, styles.footerLayout, isTablet && styles.stack]}>
        <View>
          <Image source={{ uri: logoImage }} style={styles.footerLogo} resizeMode="contain" />
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

  return (
    <ScrollView style={styles.app} contentContainerStyle={styles.page}>
      <Header isMobile={isMobile} />
      <Hero isMobile={isMobile} isTablet={isTablet} />
      <PrayerStrip isTablet={isTablet} />
      <Welcome isTablet={isTablet} isMobile={isMobile} />
      <Programs isTablet={isTablet} isMobile={isMobile} />
      <CalendarSection isMobile={isMobile} isTablet={isTablet} />
      <NewCenter isTablet={isTablet} isMobile={isMobile} />
      <Footer isTablet={isTablet} />
    </ScrollView>
  );
}

const baseShadow = "0 24px 60px rgba(1, 22, 64, 0.16)";

const styles = StyleSheet.create({
  app: {
    minHeight: "100vh",
    backgroundColor: COLORS.white,
  },
  page: {
    minHeight: "100vh",
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
    width: 42,
    height: 42,
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
    gap: 24,
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
  navLink: {
    minHeight: 44,
    paddingHorizontal: 4,
    paddingVertical: 13,
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    fontWeight: "800",
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
  },
  heroContentMobile: {
    paddingHorizontal: 20,
    paddingBottom: 245,
  },
  eyebrow: {
    marginBottom: 12,
    color: COLORS.blush,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  eyebrowDark: {
    marginBottom: 12,
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  heroTitle: {
    maxWidth: 880,
    color: COLORS.white,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 92,
    fontWeight: "700",
    lineHeight: 92,
  },
  heroTitleMobile: {
    fontSize: 48,
    lineHeight: 49,
  },
  heroCopy: {
    width: "100%",
    maxWidth: 640,
    marginTop: 18,
    color: "rgba(255,255,255,0.86)",
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
    backgroundColor: "rgba(255,255,255,0.12)",
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
    color: "rgba(255,255,255,0.64)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
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
  },
  buttonHover: {
    transform: "translateY(-1px)",
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
    width: 170,
  },
  stripTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 29,
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
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  prayerValue: {
    marginTop: 3,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "900",
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
    backgroundColor: "#f3f6fb",
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
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 58,
    fontWeight: "700",
    lineHeight: 60,
  },
  sectionTitleMobile: {
    fontSize: 34,
    lineHeight: 38,
  },
  bodyText: {
    maxWidth: 690,
    marginTop: 18,
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 25,
  },
  missionPoints: {
    flex: 0.9,
    gap: 12,
  },
  missionPoint: {
    minHeight: 72,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    backgroundColor: COLORS.soft,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  missionPointText: {
    color: COLORS.ink,
    fontWeight: "900",
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
  },
  textLink: {
    color: COLORS.gold,
    fontWeight: "900",
  },
  programGrid: {
    flexDirection: "row",
    gap: 16,
  },
  programGridTablet: {
    flexWrap: "wrap",
  },
  programCard: {
    flex: 1,
    minHeight: 310,
    minWidth: 0,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    boxShadow: "0 12px 26px rgba(1,22,64,0.06)",
  },
  programCardTablet: {
    minWidth: "calc(50% - 8px)",
  },
  programCardMobile: {
    minHeight: 220,
    padding: 18,
  },
  cardTitle: {
    marginTop: 22,
    marginBottom: 8,
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
  },
  cardCopy: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  cardMeta: {
    marginTop: 20,
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
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
    borderRadius: 8,
    backgroundColor: COLORS.white,
    boxShadow: baseShadow,
  },
  calendarToolbar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    backgroundColor: "#fbfcff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  segmented: {
    width: 162,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    flexDirection: "row",
  },
  segmentButton: {
    flex: 1,
    minHeight: 36,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentButtonActive: {
    backgroundColor: COLORS.navy,
  },
  segmentText: {
    color: COLORS.muted,
    fontWeight: "900",
  },
  segmentTextActive: {
    color: COLORS.white,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 9,
  },
  filterChip: {
    minHeight: 36,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterCheck: {
    width: 12,
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "900",
  },
  filterText: {
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: "800",
  },
  weekGrid: {
    minHeight: 510,
    flexDirection: "row",
  },
  weekGridTablet: {
    flexWrap: "wrap",
  },
  dayColumn: {
    flex: 1,
    minWidth: 0,
    padding: 14,
    borderRightWidth: 1,
    borderRightColor: COLORS.line,
  },
  dayColumnMobile: {
    width: "100%",
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  todayColumn: {
    backgroundColor: COLORS.rose,
  },
  dayHeading: {
    minHeight: 42,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 8,
  },
  dayName: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  dayDate: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "900",
  },
  eventChip: {
    minHeight: 112,
    marginBottom: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderRadius: 8,
    backgroundColor: COLORS.soft,
  },
  eventBorder_prayer: {
    borderLeftColor: COLORS.royal,
  },
  eventBorder_learning: {
    borderLeftColor: COLORS.green,
  },
  eventBorder_family: {
    borderLeftColor: COLORS.gold,
  },
  eventBorder_project: {
    borderLeftColor: COLORS.blush,
  },
  eventTitle: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 17,
  },
  eventMeta: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15,
  },
  emptyDay: {
    color: "#8592a5",
    fontSize: 13,
  },
  eventList: {
    padding: 16,
    gap: 12,
  },
  eventRow: {
    minHeight: 84,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.green,
    borderRadius: 8,
    backgroundColor: COLORS.soft,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  eventRowDate: {
    width: 130,
    color: COLORS.muted,
    fontWeight: "800",
  },
  eventRowBody: {
    flex: 1,
  },
  eventRowTime: {
    minWidth: 150,
    color: COLORS.muted,
    fontWeight: "800",
    textAlign: "right",
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
    maxWidth: 680,
    marginTop: 16,
    marginBottom: 20,
    color: "rgba(255,255,255,0.78)",
    fontSize: 16,
    lineHeight: 25,
  },
  pledgePanel: {
    width: 420,
    maxWidth: "100%",
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  pledgeLabel: {
    color: COLORS.blush,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  pledgeTitle: {
    marginTop: 6,
    color: COLORS.white,
    fontSize: 54,
    fontWeight: "900",
    lineHeight: 52,
  },
  footer: {
    paddingVertical: 48,
    backgroundColor: "#081020",
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
    color: "rgba(255,255,255,0.56)",
  },
  footerHeading: {
    marginBottom: 14,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  footerLink: {
    marginBottom: 7,
    color: "rgba(255,255,255,0.78)",
  },
  stack: {
    flexDirection: "column",
    alignItems: "stretch",
  },
});
