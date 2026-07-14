import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  HandHeart,
  HeartHandshake,
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
import { SITE, WEEKLY_PROGRAMS } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
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
          <p className="hero__kicker"><MoonStar aria-hidden="true" /> Guildford, Surrey</p>
          <h1 id="home-heading">A place to pray.<br />A community to belong to.</h1>
          <p className="hero__lede">
            GICC brings families together through worship, Islamic learning,
            youth programs, and service to our neighbours.
          </p>
          <div className="hero__actions">
            <a className="button button--gold" href="#prayer-times">
              View prayer times <ArrowRight aria-hidden="true" />
            </a>
            <Link className="button button--outline" href="/event-request/">
              Request GICC space
            </Link>
          </div>
          <dl className="hero__status">
            <div><dt>Daily prayers</dt><dd>Five times a day</dd></div>
            <div><dt>Friday prayer</dt><dd>Three Jumu’ah times</dd></div>
            <div><dt>Community</dt><dd>Everyone is welcome</dd></div>
          </dl>
        </div>
      </section>

      <PrayerTimes />

      <section className="welcome-section" aria-labelledby="welcome-heading">
        <div className="shell section-space welcome-layout">
          <div className="welcome-copy">
            <p className="section-note">Guildford Islamic Cultural Center</p>
            <h2 id="welcome-heading">More than a place of prayer</h2>
            <p className="lede">
              GICC is a community centre grounded in the Qur’an and Sunnah—a place
              where worship, learning, friendship, and service grow together.
            </p>
            <Link className="text-link" href="/about/">
              Our story <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ul className="mission-list">
            <li><BookOpen aria-hidden="true" /><div><h3>Knowledge</h3><p>Accessible Islamic learning for every stage of life.</p></div></li>
            <li><Sparkles aria-hidden="true" /><div><h3>Spirituality</h3><p>Daily worship that keeps faith at the centre.</p></div></li>
            <li><UsersRound aria-hidden="true" /><div><h3>Community</h3><p>A welcoming home for Guildford’s diverse Muslim families.</p></div></li>
            <li><HeartHandshake aria-hidden="true" /><div><h3>Service</h3><p>Care and practical support for neighbours in need.</p></div></li>
          </ul>
        </div>
      </section>

      <section id="programs" className="programs-section" aria-labelledby="programs-heading">
        <div className="shell section-space">
          <div className="section-heading-row">
            <div>
              <p className="section-note">Weekly at GICC</p>
              <h2 id="programs-heading">Learn, connect, and grow</h2>
            </div>
            <a className="text-link" href="#calendar">See the community calendar <ArrowRight aria-hidden="true" /></a>
          </div>
          <div className="program-list">
            {WEEKLY_PROGRAMS.map((program, index) => (
              <article key={program.title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{program.title}</h3><p>{program.description}</p></div>
                <p className="program-list__schedule"><CalendarDays aria-hidden="true" /> {program.schedule}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RegistrationsCarousel />
      <CommunityCalendar />

      <section className="space-request-section" aria-labelledby="space-request-heading">
        <div className="shell space-request-layout">
          <div className="space-request-icon"><MapPin aria-hidden="true" /></div>
          <div>
            <p className="section-note">For new programs and one-time rentals</p>
            <h2 id="space-request-heading">Request GICC space</h2>
            <p>
              Propose a new community program or request space for a one-time use.
              This is not registration for an existing GICC program.
            </p>
          </div>
          <Link className="button button--gold" href="/event-request/">
            Start a request <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="new-center-section" aria-labelledby="new-center-heading">
        <div className="shell section-space new-center-layout">
          <div>
            <p className="arabic-label" lang="ar">بيت الله</p>
            <h2 id="new-center-heading">Help build GICC’s permanent home</h2>
            <p>
              Your donation supports a lasting place of worship, learning, and
              belonging for generations of Muslim families in Guildford.
            </p>
          </div>
          <div className="donation-panel">
            <HandHeart aria-hidden="true" />
            <p>Every contribution becomes part of the community’s future.</p>
            <Link className="button button--gold" href={SITE.donationUrl}>Support the new centre</Link>
          </div>
        </div>
      </section>
    </>
  );
}
