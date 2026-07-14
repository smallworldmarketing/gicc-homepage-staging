"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { REGISTRATIONS } from "@/lib/site";

export function RegistrationsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = REGISTRATIONS[activeIndex];
  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + REGISTRATIONS.length) % REGISTRATIONS.length);
  };

  return (
    <section className="registrations-section" aria-labelledby="registrations-heading">
      <div className="shell section-space registrations-layout">
        <div className="registrations-copy">
          <p className="arabic-label" lang="ar">برامجنا</p>
          <h2 id="registrations-heading">Current registrations</h2>
          <p>Explore active programs and open the organizer’s registration page.</p>
          <div className="carousel-controls">
            <button type="button" onClick={() => move(-1)} aria-label="Previous registration">
              <ChevronLeft aria-hidden="true" />
            </button>
            <p aria-live="polite">{activeIndex + 1} of {REGISTRATIONS.length}</p>
            <button type="button" onClick={() => move(1)} aria-label="Next registration">
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="registration-feature">
          <div className="registration-poster">
            <Image
              key={active.image}
              src={active.image}
              alt={`${active.title} program flyer`}
              fill
              sizes="(max-width: 760px) 92vw, 520px"
              priority={activeIndex === 0}
            />
          </div>
          <div className="registration-caption">
            <div>
              <h3>{active.title}</h3>
              <p>{active.meta}</p>
            </div>
            <a className="button button--gold" href={active.href} target="_blank" rel="noreferrer">
              Register <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <div className="carousel-dots" role="group" aria-label="Choose a registration">
            {REGISTRATIONS.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                aria-label={`Show ${item.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
