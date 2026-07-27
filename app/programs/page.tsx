import type { Metadata } from "next";
import { CommunityCalendar } from "@/components/CommunityCalendar";
import { MfasProgramSection } from "@/components/MfasProgramSection";
import { RegistrationsCarousel } from "@/components/RegistrationsCarousel";
import { WeeklyProgramsSection } from "@/components/WeeklyProgramsSection";

export const metadata: Metadata = {
  title: "Programs and Registrations",
  description:
    "Explore GICC weekly programs, current registrations, Muslim Funeral Aid Services, and upcoming community events in Guildford, Surrey.",
  alternates: { canonical: "/programs/" },
};

export default function ProgramsPage() {
  return (
    <>
      <header className="content-hero content-hero--dark interior-hero">
        <div className="shell narrow">
          <p className="section-note">Learn, connect, and grow</p>
          <h1>Programs &amp; Registrations</h1>
          <p>
            Find weekly GICC programs, open registration links, and upcoming
            events from the live community calendar.
          </p>
        </div>
      </header>
      <WeeklyProgramsSection />
      <RegistrationsCarousel />
      <MfasProgramSection />
      <CommunityCalendar />
    </>
  );
}
