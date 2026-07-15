import {
  ArrowDown,
  BookMarked,
  Clock,
  Coffee,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { WEEKLY_PROGRAMS } from "@/lib/site";

const PROGRAM_ICONS = [GraduationCap, Sparkles, BookMarked, Coffee] as const;

export function WeeklyProgramsSection() {
  return (
    <section id="programs" className="programs-section" aria-labelledby="programs-heading">
      <div className="shell section-space">
        <div className="section-heading-row">
          <h2 id="programs-heading">A weekly rhythm for every stage of family life.</h2>
          <a className="text-link" href="#calendar">
            See all events <ArrowDown aria-hidden="true" />
          </a>
        </div>
        <div className="program-list">
          {WEEKLY_PROGRAMS.map((program, index) => {
            const Icon = PROGRAM_ICONS[index];
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
  );
}
