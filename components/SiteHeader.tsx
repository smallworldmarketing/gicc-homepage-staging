"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PRIMARY_NAV, SITE } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="shell utility-bar__inner">
          <a href={SITE.mapsUrl} target="_blank" rel="noreferrer">
            {SITE.addressLine}, {SITE.cityLine}
          </a>
          <div>
            <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
            <span aria-hidden="true">·</span>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>
      </div>
      <div className="nav-bar">
        <div className="shell nav-bar__inner">
          <Link className="brand" href="/" aria-label={`${SITE.name} home`}>
            <Image
              src="/images/gicc-logo-white.webp"
              alt=""
              width={320}
              height={181}
              priority
            />
          </Link>
          <button
            className="menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="primary-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav
            id="primary-navigation"
            className={`primary-nav${open ? " primary-nav--open" : ""}`}
            aria-label="Primary navigation"
          >
            {PRIMARY_NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link className="nav-request" href="/event-request/" onClick={() => setOpen(false)}>
              Request space
            </Link>
            <Link className="nav-donate" href={SITE.donationUrl} onClick={() => setOpen(false)}>
              Donate
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
