import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContentPage } from "@/components/ContentPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact GICC",
  description: "Contact or visit Guildford Islamic Cultural Center in Surrey, British Columbia.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <ContentPage
      eyebrow="Get in touch"
      title="We’re here to help"
      lede="Contact GICC for general enquiries, religious questions, programs, donations, or a visit to the centre."
      tone="dark"
    >
      <div className="contact-methods">
        <a href={SITE.phoneHref}><Phone aria-hidden="true" /><span><strong>Call us</strong>{SITE.phoneDisplay}</span></a>
        <a href={`mailto:${SITE.email}`}><Mail aria-hidden="true" /><span><strong>General enquiries</strong>{SITE.email}</span></a>
        <a href="mailto:imam@giccmasjid.org"><Mail aria-hidden="true" /><span><strong>Religious enquiries</strong>imam@giccmasjid.org</span></a>
        <a href={SITE.mapsUrl} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /><span><strong>Visit GICC</strong>{SITE.addressLine}<br />{SITE.cityLine}</span></a>
      </div>
      <h2>Requesting space</h2>
      <p>
        To propose a new recurring program or request GICC space for one-time use,
        use the dedicated event request form. Existing program registration is
        handled through each program’s registration link.
      </p>
      <a className="button button--navy" href="/event-request/">Request GICC space</a>
    </ContentPage>
  );
}
