import Link from "next/link";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description:
    "The terms governing the use of the GeM Advisor website and the advisory services we provide to Indian businesses.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="The terms on which this website may be used and on which our advisory services are provided."
      />

      <section className="bg-white py-12 dark:bg-dark md:py-16">
        <div className="shell">
          <div className="prose-block max-w-3xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: 29 August 2026</p>

            <h2 className="!mt-6">1. Acceptance</h2>
            <p>
              By accessing {SITE.url} or engaging {SITE.legalName} (&ldquo;{SITE.name}&rdquo;) for
              any service, you accept these terms. If you do not accept them, please do not use
              this website or our services.
            </p>

            <h2>2. Nature of our services</h2>
            <p>
              {SITE.name} provides private advisory and documentation support relating to
              registration on the Government e-Marketplace and participation in government tenders.
              We act on your instruction and on the basis of information and documents you supply.
              We are not a government body — see clause 8 and our{" "}
              <Link href="/disclaimer" className="font-semibold text-brand-600 no-underline">
                Disclaimer
              </Link>
              .
            </p>

            <h2>3. No guarantee of outcome</h2>
            <p>
              We do not guarantee registration approval, tender award, order volume or revenue.
              Registrations are approved by the relevant portal authority and tenders are awarded
              by the procuring entity against its own published criteria, neither of which is
              within our control. Any timeline we give is an estimate based on typical processing,
              not a commitment by any authority.
            </p>

            <h2>4. Your responsibilities</h2>
            <ul>
              <li>
                Provide accurate, complete and current information and documents. We rely on what
                you give us and do not independently verify its authenticity.
              </li>
              <li>
                Respond to requests for information within the timelines a tender or portal
                imposes. Deadlines missed because information arrived late are not our
                responsibility.
              </li>
              <li>
                Comply with applicable law and with the terms of the portals and tenders you
                participate in.
              </li>
              <li>
                Keep your own portal credentials secure. Where you choose to share access with us
                for a defined task, you remain responsible for your account.
              </li>
            </ul>

            <h2>5. Fees and payment</h2>
            <p>
              Fees are agreed in writing before work begins and are payable as set out in that
              agreement. Fees cover our professional services only. Government fees, portal
              charges, earnest money deposits, tender document costs, digital signature
              certificates and any third-party charges are separate and payable by you.
            </p>

            <h2>6. Cancellation and refunds</h2>
            <p>
              Work already performed is chargeable. Where an engagement is cancelled before
              completion, fees are settled in proportion to the work completed to that point.
              Amounts paid to government portals or third parties are governed by their own refund
              rules and are not refundable by us.
            </p>

            <h2>7. Limitation of liability</h2>
            <p>
              To the extent permitted by law, our aggregate liability for any claim arising out of
              an engagement is limited to the fees you paid us for that engagement. We are not
              liable for indirect or consequential loss, including loss of profit, loss of
              contract, loss of anticipated business or reputational loss.
            </p>

            <h2>8. Independence from government</h2>
            <p>
              {SITE.name} is a private firm with no affiliation to, endorsement from, or authority
              delegated by the Government of India, the Government e-Marketplace or any government
              department. Engaging us confers no preference, priority or advantage in any
              government process.
            </p>

            <h2>9. Intellectual property</h2>
            <p>
              The content, structure and design of this website belong to {SITE.name} unless stated
              otherwise. You may not reproduce or republish it commercially without written
              permission. Documents we prepare specifically for you, once paid for, are yours to
              use for the purpose for which they were prepared.
            </p>

            <h2>10. Website content</h2>
            <p>
              Information on this site is general in nature and offered for guidance only. It is
              not legal, tax or financial advice, and procurement rules change. Illustrative
              figures and sample listings shown on the site are examples of format, not live data.
              Verify anything material with a qualified professional or against the official
              portal before acting on it.
            </p>

            <h2>11. Confidentiality</h2>
            <p>
              We treat your business information as confidential and use it only for the engagement
              it was provided for, except where disclosure is required by law. See our{" "}
              <Link href="/privacy-policy" className="font-semibold text-brand-600 no-underline">
                Privacy Policy
              </Link>
              .
            </p>

            <h2>12. Governing law</h2>
            <p>
              These terms are governed by the laws of India. Courts at {SITE.address.locality},{" "}
              {SITE.address.region} have exclusive jurisdiction over any dispute arising from them.
            </p>

            <h2>13. Changes</h2>
            <p>
              We may revise these terms from time to time. The version published on this page at
              the time you engage us is the version that applies.
            </p>

            <h2>14. Contact</h2>
            <p>
              {SITE.legalName}
              <br />
              {SITE.address.street}, {SITE.address.locality}, {SITE.address.region}{" "}
              {SITE.address.postalCode}, India
              <br />
              {SITE.email} · {SITE.phone}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
