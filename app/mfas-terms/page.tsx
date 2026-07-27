import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "MFAS Terms and Conditions",
  description: "Terms and conditions for the Muslim Funeral Aid Services program offered through GICC.",
  alternates: { canonical: "/mfas-terms/" },
};

export default function MfasTermsPage() {
  return (
    <ContentPage
      eyebrow="Muslim Funeral Aid Services"
      title="MFAS terms and conditions"
      lede="Guildford Islamic Cultural Center is a community partner of MFAS—Muslim Funeral Aid Services."
      tone="dark"
    >
      <a className="button button--navy" href="https://muslimfas.ca/forms/" target="_blank" rel="noreferrer">Register with MFAS</a>

      <h2>1. Definitions</h2>
      <p><strong>1.1 “Burial Location”</strong> means Vedder View Gardens Cemetery located at 44675 Watson Rd, Chilliwack, British Columbia V2R 2Y6, Canada.</p>
      <p><strong>1.2 “Coverage Area”</strong> means any location in the Province of British Columbia where the Service Provider provides funeral and burial services to the Sunni Muslim community.</p>
      <p><strong>1.3 “Dependent”</strong> means an unmarried child who is entirely dependent on the Participant for maintenance and support and who is under 25 years of age, or physically or mentally incapable of self-support.</p>
      <p><strong>1.4 “Family”</strong> means Spouse and Dependent children of the Participant.</p>
      <p><strong>1.5 “Funeral Costs”</strong> means the cost of funeral and burial of the deceased at the Burial Location set forth by MFAS.</p>
      <p><strong>1.6 “MFAS”</strong> means MFAS—Muslim Funeral Aid Services.</p>
      <p><strong>1.7 “Participant”</strong> means the person named in Section A of the Enrollment Form.</p>
      <p><strong>1.8 “Service Provider”</strong> means the British Columbia Muslim Association or any other Islamic organization providing funeral and burial services to the Sunni Muslim community.</p>
      <p><strong>1.9 “Spouse”</strong> means the person who is married to the Participant.</p>

      <h2>2. Coverage</h2>
      <p><strong>2.1</strong> The Participant and Additional Family Members, if applicable, must be of the Sunni Muslim faith to enroll in the funeral aid program.</p>
      <p><strong>2.2</strong> Coverage becomes effective 90 days after MFAS receives the total Participation Fees (the “Effective Date”).</p>
      <p><strong>2.3</strong> The deceased’s body must be physically located within the Coverage Area and will be buried at the nearest burial site serviced by the Service Provider, subject to the maximum cost in paragraph 2.4. Costs above that threshold are the responsibility of the Participant, Additional Family Members, heirs, executors, or trustees.</p>
      <p><strong>2.4</strong> MFAS will cover Funeral Costs up to the cost of funeral and burial at the Burial Location.</p>
      <p><strong>2.5</strong> If the deceased is buried at a higher-cost site within the Coverage Area, any difference in funeral, transportation, and burial costs is the responsibility of the Participant, Additional Family Members, heirs, executors, or trustees.</p>
      <p><strong>2.6</strong> MFAS will not reimburse, pay, or be responsible for transportation, funeral, or burial costs if the deceased’s body is outside the Coverage Area.</p>

      <h2>3. Participation fees</h2>
      <p><strong>3.1</strong> Participation Fees are held in a non-interest-bearing pooled general trust account at a Canadian financial institution under the name of MFAS (the “Pooled Trust Account”).</p>
      <p><strong>3.2</strong> MFAS reserves the right to change Participation Fees at any time without notice.</p>

      <h2>4. Withdrawals and the Participant’s share</h2>
      <p><strong>4.1</strong> The Participant irrevocably authorizes MFAS to deduct $25 for operating costs from the Pooled Trust Account on or after the Effective Date.</p>
      <p><strong>4.2</strong> On the death of a covered Participant or Additional Family Member—or, subject to availability, a non-participant receiving donated coverage—MFAS will pay Funeral Costs directly to the Service Provider, subject to these terms. The deceased’s heirs, executors, or trustees must arrange the funeral and burial with the Service Provider.</p>
      <p><strong>4.3</strong> The Participant irrevocably authorizes MFAS to withdraw funds from the Pooled Trust Account to cover Funeral Costs for Participants and Additional Family Members.</p>
      <p><strong>4.4</strong> Funeral Costs are divided equally among Participants and the total number of donated coverages pledged (the “Share of Funeral Costs”). Each Participant is responsible for paying their Participant’s Share.</p>
      <p><strong>4.5</strong> MFAS will email a Notice to Pay at least 72 hours before withdrawing the Participant’s Share under the Pre-Authorized Debit Agreement. Participants are responsible for maintaining sufficient funds. MFAS is not responsible for insufficient-funds charges.</p>
      <p><strong>4.6</strong> A Participant’s Share of Funeral Costs is non-refundable.</p>

      <h2>5. Cancellation, termination, and refunds</h2>
      <p><strong>5.1</strong> Coverage for the Participant and Additional Family Members terminates 120 days after the Participant’s death. A surviving Spouse may enroll by submitting a new form and applicable fees.</p>
      <p><strong>5.2</strong> The Participant may cancel coverage at any time before the Effective Date by giving MFAS written notice.</p>
      <p><strong>5.3</strong> After the Effective Date, 30 days’ written notice is required to cancel coverage.</p>
      <p><strong>5.4</strong> On receiving a cancellation notice, coverage is cancelled immediately. After 30 days, MFAS refunds 100% of Participation Fees if notice was received before the Effective Date, or Participation Fees less $25 if received after the Effective Date.</p>
      <p><strong>5.5</strong> Participation Fees become non-refundable after funeral aid has been provided to the Participant or an Additional Family Member.</p>
      <p><strong>5.6</strong> If MFAS does not receive the Participant’s Share within 90 days of the Notice to Pay, coverage may be cancelled and Participation Fees forfeited without further notice.</p>
      <p><strong>5.7</strong> Coverage for a Dependent ends on their 25th birthday or marriage, whichever comes first. For a physically or mentally incapable Dependent, coverage ends on marriage.</p>

      <h2>6. General</h2>
      <p><strong>6.1</strong> MFAS may change any part of these terms. Notice will be sent by email. A Participant who does not agree may cancel within 15 days; otherwise, the new terms are deemed accepted.</p>
      <p><strong>6.2</strong> Participants must keep their information current and monitor email, including spam folders. MFAS may request annual verification. If a Participant does not respond after three attempts, coverage may be cancelled and Participation Fees transferred to the operating account without further notice.</p>
      <p><strong>6.3</strong> The Participant consents to receiving electronic communications from MFAS.</p>
      <p><strong>6.4</strong> Electronic notices, agreements, disclosures, and communications from MFAS satisfy legal requirements that those communications be in writing.</p>
      <p><strong>6.5</strong> The Participant authorizes the use, release, and exchange of information in the Enrollment Form and schedules between the organization, third-party service providers, and financial institutions solely to administer the funeral aid program.</p>

      <p><em>Guildford Islamic Cultural Center is a community partner of MFAS—Muslim Funeral Aid Services.</em></p>
      <a className="button button--navy" href="https://muslimfas.ca/forms/" target="_blank" rel="noreferrer">Register with MFAS</a>
    </ContentPage>
  );
}
