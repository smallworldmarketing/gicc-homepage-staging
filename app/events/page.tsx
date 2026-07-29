import type { Metadata } from "next";
import { EventsBoard } from "@/components/EventsBoard";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Browse and filter every upcoming GICC event, kept up to date by our team.",
  alternates: { canonical: "/events/" },
};

export default function EventsPage() {
  return (
    <>
      <header className="content-hero content-hero--dark interior-hero">
        <div className="shell narrow">
          <p className="section-note">What&apos;s happening at GICC</p>
          <h1>Events</h1>
          <p>
            Browse every upcoming GICC event to find what matters to you.
          </p>
        </div>
      </header>
      <EventsBoard />
    </>
  );
}
