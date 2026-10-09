import Link from "next/link";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { DISCLAIMER, SITE } from "@/data/site";

export const metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "GeM Advisor is a private, independent advisory firm and is not affiliated with the Government of India or the Government e-Marketplace. Read the full disclaimer.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Disclaimer"
        description="Please read this carefully — it explains exactly what GeM Advisor is and what it is not."
      />

      <section className="bg-white py-12 dark:bg-dark md:py-16">
        <div className="shell">
          <div className="max-w-3xl">
            <div className="mb-10 rounded-xl border-0 border-solid border-brand-500 ">
              <p className="m-0 text-base font-semibold leading-relaxed text-darkIndigo-900 dark:text-white">
                {DISCLAIMER}
              </p>
            </div>

            <div className="prose-block">
              <h2 className="!mt-0">Not a government website</h2>
              <p>
                This is the website of a private consultancy. It is not an official portal of the
                Government of India, of any state government, or of the Government e-Marketplace.
                The official GeM portal is operated solely by the Government of India, and the
                official tender portals are operated by the respective procuring authorities. If
                you intend to register or bid yourself, go to those official portals directly.
              </p>

              <h2>No official endorsement</h2>
              <p>
                No government department, agency, officer or authority has endorsed, appointed,
                accredited or authorised {SITE.name}. Engaging us gives you no preference,
                priority, faster processing or any other advantage in any government process. Any
                person suggesting otherwise — whether or not they claim to represent us — is
                misrepresenting the position, and we would be grateful if you told us about it.
              </p>

              <h2>No guarantee of results</h2>
              <p>
                We do not and cannot guarantee registration approval, category activation, tender
                award, order value or business growth. Those outcomes rest with the relevant
                portal authority or procuring entity and are decided against their own published
                criteria. Our work is the preparation, accuracy and compliance of what you submit.
              </p>

              <h2>Information on this website</h2>
              <p>
                Content here is general information about procurement processes, prepared in good
                faith and kept current to the best of our ability. It is not legal, tax, financial
                or professional advice for your specific circumstances. Procurement rules, portal
                workflows and eligibility conditions change; always verify against the official
                source or the tender document itself before acting.
              </p>
              <p>
                Figures presented as achievements, sample tender listings and indicative timelines
                on this site are illustrative of format and scale, not live data or a
                representation about any particular opportunity.
              </p>

              <h2>Trademarks and names</h2>
              <p>
                &ldquo;GeM&rdquo; and &ldquo;Government e-Marketplace&rdquo; refer to the platform
                administered by the Government of India. Those names, and any department or
                organisation names appearing on this site, are used descriptively to identify the
                platforms and processes we help clients with. All trademarks remain the property of
                their respective owners, and their use here does not imply any association.
              </p>

              <h2>External links</h2>
              <p>
                Where this site links to third-party or government websites, we do not control
                their content and are not responsible for it. A link is not an endorsement.
              </p>

              <h2>Beware of impersonation</h2>
              <p>
                We will never ask for your GeM password, banking credentials, digital signature PIN
                or a one-time password. If someone claiming to be from {SITE.name} asks for any of
                these, do not share them — contact us at{" "}
                <a href={`mailto:${SITE.email}`} className="font-semibold text-brand-600 no-underline">
                  {SITE.email}
                </a>{" "}
                immediately.
              </p>

              <h2>Related documents</h2>
              <p>
                Read this alongside our{" "}
                <Link href="/terms-and-conditions" className="font-semibold text-brand-600 no-underline">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="font-semibold text-brand-600 no-underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
