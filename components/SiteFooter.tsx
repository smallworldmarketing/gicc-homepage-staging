import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image
            src="/images/gicc-logo-white.png"
            alt={SITE.name}
            width={210}
            height={80}
          />
          <p>
            Serving the Muslim community of Guildford and Surrey through prayer,
            learning, service, and belonging.
          </p>
        </div>
        <div>
          <h2>Visit GICC</h2>
          <ul className="footer-list">
            <li>
              <MapPin aria-hidden="true" />
              <a href={SITE.mapsUrl} target="_blank" rel="noreferrer">
                {SITE.addressLine}
                <br />
                {SITE.cityLine}
              </a>
            </li>
            <li>
              <Phone aria-hidden="true" />
              <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
            </li>
            <li>
              <Mail aria-hidden="true" />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
          </ul>
        </div>
        <div>
          <h2>Quick links</h2>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link href="/about/">About GICC</Link>
            <Link href="/event-request/">Request GICC space</Link>
            <Link href="/youth-mental-health-support/">Youth mental health support</Link>
            <Link href="/privacy/">Privacy</Link>
            <Link href="/terms/">Terms</Link>
          </nav>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        <p>Guildford, Surrey, British Columbia</p>
      </div>
    </footer>
  );
}
