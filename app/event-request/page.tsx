import type { Metadata } from "next";
import { EventRequestForm } from "@/components/EventRequestForm";

export const metadata: Metadata = {
  title: "Request GICC Space",
  description: "Request GICC space for a new recurring community program or a one-time rental.",
  alternates: { canonical: "/event-request/" },
};

export default function EventRequestPage() {
  return (
    <div className="form-page">
      <header className="form-page__header">
        <div className="shell narrow">
          <p className="section-note">External public requests</p>
          <h1>Request GICC space</h1>
          <p>
            Propose a new recurring program or request space for one-time use.
            GICC staff will review the requested time, location, and program details.
          </p>
        </div>
      </header>
      <div className="shell form-page__body">
        <aside className="form-guidance">
          <h2>Before you begin</h2>
          <ul>
            <li>This form is not for registration in an existing GICC program.</li>
            <li>Have the event date, start time, duration, and expected attendance ready.</li>
            <li>Program leaders should attach relevant certification where applicable.</li>
            <li>Submitting a request does not confirm or reserve the space.</li>
          </ul>
          <p>Nikah and condolence gatherings have a $200 GICC fee.</p>
        </aside>
        <EventRequestForm />
      </div>
    </div>
  );
}
