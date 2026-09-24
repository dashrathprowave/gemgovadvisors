import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How GeM Advisor collects, uses, stores and protects the personal and business information you share through this website.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="What we collect through this website, why we collect it and what we do with it."
      />

      <section className="bg-white py-12 dark:bg-dark md:py-16">
        <div className="shell">
          <div className="prose-block max-w-3xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: 29 August 2026</p>

            <h2 className="!mt-6">Who this policy applies to</h2>
            <p>
              This policy covers information collected through {SITE.url} by {SITE.legalName}{" "}
              (&ldquo;{SITE.name}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using this
              website or submitting a form on it, you agree to the practices described here.
            </p>

            <h2>Information we collect</h2>
            <p>We collect only what you choose to give us through the forms on this site:</p>
            <ul>
              <li>Contact details — your name, designation, mobile number and email address.</li>
            </ul>
            <p>
              We do not ask for and do not want your GeM password, banking credentials, digital
              signature PIN or any one-time password. No representative of {SITE.name} will ever
              request them.
            </p>

            <h2>Why we collect it</h2>
            <ul>
              <li>To respond to your enquiry and advise you on what applies to your business.</li>
              <li>
                To deliver the services you engage us for, including preparing registrations,
                catalogues and bid documentation on your instruction.
              </li>
              <li>To keep a record of enquiries and engagements for our own accounting needs.</li>
            </ul>
            <p>
              We do not sell your information, and we do not share it with third parties for their
              marketing purposes.
            </p>

            <h2>Who we share it with</h2>
            <p>Your information is disclosed only in these circumstances:</p>
            <ul>
              <li>
                To service providers who operate parts of our infrastructure — for example the
                email delivery provider that carries your enquiry to our inbox — and only to the
                extent needed for that function.
              </li>
              <li>
                To government procurement portals, where you have engaged us to submit information
                on your behalf and have authorised that submission.
              </li>
              <li>Where we are required to do so by law or by a competent authority.</li>
            </ul>

            <h2>How long we keep it</h2>
            <p>
              Enquiry records are retained while there is an active or reasonably foreseeable
              engagement, and afterwards only for as long as our legal and accounting obligations
              require. You can ask us to delete your enquiry record at any time.
            </p>

            <h2>Cookies and analytics</h2>
            <p>
              This website stores your light or dark theme preference in your browser&apos;s local
              storage. That preference stays on your device and is never transmitted to us. If
              analytics or advertising tools are added in future, this policy will be updated
              before they are enabled.
            </p>

            <h2>Security</h2>
            <p>
              Submissions are transmitted over an encrypted connection and access to enquiry
              records is limited to the advisors who need it. No system is perfectly secure, but we
              take reasonable technical and organisational measures to protect what you send us.
            </p>

            <h2>Your choices</h2>
            <p>
              You may ask us to correct or delete the information we hold about you, or to stop
              contacting you, by writing to{" "}
              <a href={`mailto:${SITE.email}`} className="font-semibold text-brand-600 no-underline">
                {SITE.email}
              </a>
              . We will action reasonable requests promptly.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this policy as our practices change. The revision date at the top of
              this page always reflects the current version.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
