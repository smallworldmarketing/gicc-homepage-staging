import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/images/gicc-logo-white.png" alt={SITE.name} width={1920} height={1080} />
          <p>Serving the Muslim community in Guildford, Surrey, British Columbia.</p>
        </div>
        <div>
          <h2>Contact</h2>
          <div className="footer-links">
            <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={SITE.mapsUrl} target="_blank" rel="noreferrer">{SITE.addressLine}, Surrey, BC</a>
          </div>
        </div>
        <div>
          <h2>Site</h2>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link href="/#welcome">About Us</Link>
            <Link href="/#prayer-times">Iqama Times</Link>
            <Link href="/contact/">Contact Us</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
