import type { Metadata } from "next";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Building2,
  CalendarDays,
  Clock,
  Coffee,
  GraduationCap,
  HandHeart,
  MapPin,
  MoonStar,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { CommunityCalendar } from "@/components/CommunityCalendar";
import { MasjidBuildingPicture } from "@/components/MasjidBuildingPicture";
import { PrayerTimes } from "@/components/PrayerTimes";
import { RegistrationsCarousel } from "@/components/RegistrationsCarousel";
import { WEEKLY_PROGRAMS } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const missionPoints = [
    { icon: MoonStar, label: "Daily salah and Jumuah" },
    { icon: BookOpen, label: "Madrasah and Quran programs" },
    { icon: UsersRound, label: "Youth and family support" },
    { icon: HandHeart, label: "New Islamic Center project" },
  ] as const;
  const programIcons = [GraduationCap, Sparkles, BookMarked, Coffee] as const;

  return (
    <>
      <section className="hero" aria-labelledby="home-heading">
        <MasjidBuildingPicture
          className="hero__media"
          alt="The new Guildford Islamic Cultural Center building in Surrey"
          priority
        />
        <div className="hero__veil" aria-hidden="true" />
        <div className="shell hero__content">
          <p className="hero__kicker">Assalamu alaikum, welcome.</p>
          <h1 id="home-heading">Guildford Islamic Cultural Center</h1>
          <p className="hero__lede">
            A spiritual home for daily prayer, Islamic learning, family programs,
            and community service in Guildford.
          </p>
          <div className="hero__actions">
            <a className="button button--gold" href="#calendar">
              <CalendarDays aria-hidden="true" /> View weekly events
            </a>
            <Link className="button button--outline" href="/new-masjid/">
              <Building2 aria-hidden="true" /> New Islamic Center
            </Link>
          </div>
          <dl className="hero__status">
            <div><dt>Prayer times</dt><dd>Updated live</dd></div>
            <div><dt>Jumuah</dt><dd>Three Friday prayers</dd></div>
            <div><dt>Calendar</dt><dd>Live</dd></div>
          </dl>
        </div>
      </section>

      <PrayerTimes />

      <section id="welcome" className="welcome-section" aria-labelledby="welcome-heading">
        <div className="shell section-space welcome-layout">
          <div className="welcome-copy">
            <h2 id="welcome-heading">Prayer, learning, and service for the Muslim community of Guildford.</h2>
            <p className="lede">
              GICC is a masjid and community center committed to preserving Islamic
              identity, supporting a viable Muslim community, and promoting a
              comprehensive way of life based on the Quran and Sunnah.
            </p>
          </div>
          <ul className="mission-list">
            {missionPoints.map(({ icon: Icon, label }) => (
              <li key={label}>
                <span className="mission-list__icon"><Icon aria-hidden="true" /></span>
                <strong>{label}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="programs" className="programs-section" aria-labelledby="programs-heading">
        <div className="shell section-space">
          <div className="section-heading-row">
            <h2 id="programs-heading">A weekly rhythm for every stage of family life.</h2>
            <a className="text-link" href="#calendar">See all events <ArrowRight aria-hidden="true" /></a>
          </div>
          <div className="program-list">
            {WEEKLY_PROGRAMS.map((program, index) => {
              const Icon = programIcons[index];
              return (
                <article key={program.title}>
                  <span className="program-list__icon" aria-hidden="true"><Icon /></span>
                  <div><h3>{program.title}</h3><p>{program.description}</p></div>
                  <div className="program-list__schedule">
                    <strong>{program.day}</strong>
                    <span><Clock aria-hidden="true" /> {program.time}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <RegistrationsCarousel />
      <CommunityCalendar />

      <section className="space-request-section" aria-labelledby="space-request-heading">
        <div className="shell section-space space-request-layout">
          <div className="space-request-copy">
            <p className="section-note">New programs and one-time rentals</p>
            <h2 id="space-request-heading">Request GICC space.</h2>
            <p>Request space for a new recurring program or a one-time private or community rental. We review each request against the GICC calendar and facility terms.</p>
          </div>
          <div className="space-request-card">
            <div className="space-request-card__heading">
              <span className="space-request-icon"><MapPin aria-hidden="true" /></span>
              <div>
                <p className="space-request-card__label">External public requests</p>
                <h3>Plan a new use of GICC space</h3>
              </div>
            </div>
            <p>This form is not for registering in an existing GICC program.</p>
            <Link className="button button--navy" href="/event-request/">
              Start a space request <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section id="new-center" className="new-center-section" aria-labelledby="new-center-heading">
        <div className="shell section-space new-center-layout">
          <div>
            <h2 id="new-center-heading">Building a permanent house of worship in Guildford.</h2>
            <p>
              The new center project gives the community more space for prayer,
              education, youth programs, and service. This homepage keeps the
              project visible without crowding the weekly worship experience.
            </p>
          </div>
          <div className="donation-panel">
            <p className="donation-panel__label">Project focus</p>
            <h3>14888 104 Ave</h3>
            <p>Future Islamic Center property in Surrey, BC.</p>
            <Link className="button button--outline" href="/new-masjid/">
              Visit project site <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
