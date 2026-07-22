import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Youth Mental Health Support",
  description: "Confidential, culturally aware, and faith-sensitive mental health support resources for GICC youth and families.",
  alternates: { canonical: "/youth-mental-health-support/" },
};

export default function YouthMentalHealthPage() {
  return (
    <ContentPage
      eyebrow="You are not alone"
      title="Youth mental health support"
      lede="GICC is committed to helping young people and families find confidential, culturally aware, and faith-sensitive support."
      tone="dark"
    >
      <div className="urgent-support">
        <h2>If there is immediate danger</h2>
        <p>Call <a href="tel:911">911</a> or go to the nearest emergency department.</p>
      </div>
      <h2>Free and confidential support</h2>
      <ul className="resource-list">
        <li>
          <strong>9-8-8 Suicide Crisis Helpline</strong>
          <a href="tel:988">Call or text 988</a>
          <span>Available across Canada, 24 hours a day</span>
        </li>
        <li>
          <strong>Kids Help Phone</strong>
          <a href="tel:18006686868">1-800-668-6868</a>
          <span>Call 24/7 or text CONNECT to 686868</span>
        </li>
        <li>
          <strong>BC Mental Health Support</strong>
          <a href="tel:3106789">310-6789</a>
          <span>No area code is required within BC</span>
        </li>
        <li>
          <strong>Foundry BC</strong>
          <a href="https://foundrybc.ca" target="_blank" rel="noreferrer">foundrybc.ca</a>
          <span>Free and confidential services for youth ages 12–24</span>
        </li>
        <li>
          <strong>QuitNow</strong>
          <a href="tel:18774552233">1-877-455-2233</a>
          <span>Free support for BC residents who want to reduce or quit nicotine</span>
        </li>
      </ul>
      <h2>Why this matters</h2>
      <p>
        Mental health is part of overall wellbeing. Islam teaches us to care for
        the heart, mind, body, and soul. Reaching out for help is a courageous and
        responsible step.
      </p>
    </ContentPage>
  );
}
