import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Website Terms",
  description: "Terms for using the GICC website and submitting a request for GICC space.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Last updated July 14, 2026"
      title="Website terms"
      lede="These terms govern use of the GICC website. Separate facility terms are presented and accepted within each space request."
      tone="dark"
    >
      <h2>Information on this website</h2>
      <p>
        GICC works to keep prayer times, programs, event information, and contact
        details accurate. Schedules may change. For time-sensitive information,
        confirm the latest details through the linked calendar, Awqat, or GICC staff.
      </p>
      <h2>Space requests</h2>
      <p>
        Submitting a request does not reserve or confirm GICC space. GICC may
        accept, decline, request changes to, or cancel a request based on
        availability, suitability, safety, policy, or operational needs. A booking
        is confirmed only when GICC communicates approval.
      </p>
      <p>
        Request leads are responsible for accurate information, required
        qualifications, participant conduct, facility rules, and any additional
        agreement, liability form, fee, or deposit required by GICC.
      </p>
      <h2>External services and links</h2>
      <p>
        The website links to external registration forms, calendars, payment
        services, and community resources. Those services operate under their own
        terms and privacy practices. GICC is not responsible for third-party
        availability or content.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not misuse the website, attempt unauthorized access, submit malicious
        files, interfere with service availability, or provide false or unlawful
        information.
      </p>
    </ContentPage>
  );
}
