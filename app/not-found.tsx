import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="content-hero content-hero--compact">
      <div className="shell narrow">
        <p className="section-note">404</p>
        <h1>That page could not be found</h1>
        <p>The address may have changed during the GICC website migration.</p>
        <Link className="button button--gold" href="/">
          <ArrowLeft aria-hidden="true" /> Return home
        </Link>
      </div>
    </section>
  );
}
