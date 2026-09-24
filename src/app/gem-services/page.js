import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CtaBand from "@/components/CtaBand";
import Faqs from "@/components/Faqs";
import LeadForm from "@/components/LeadForm";
import ServiceIcon from "@/components/ServiceIcon";
import JsonLd from "@/components/JsonLd";
import { ArrowRightLongIcon, CheckIcon } from "@/components/Icons";
import { faqSchema, pageMetadata } from "@/lib/seo";
import { DOCUMENTS, GEM_SERVICES } from "@/data/site";

export const metadata = pageMetadata({
  title: "GeM Services",
  description:
    "Complete Government e-Marketplace support — GeM seller registration, product and service listing, catalogue management, bid and reverse auction participation, order support and compliance.",
  path: "/gem-services",
  keywords: [
    "GeM services",
    "GeM seller registration",
    "GeM product listing",
    "GeM catalogue management",
    "GeM bid participation",
    "Government e-Marketplace consultant",
  ],
});

const gemFaqs = [
  {
    q: "What is the difference between GeM and a regular government tender?",
    a: "GeM is a marketplace: buyers search a live catalogue and can place direct purchase orders, run an L1 comparison or float a bid on the portal itself. A conventional tender is published as a document on a procurement portal with its own eligibility conditions, submission format and deadline. Many businesses need both.",
  },
  {
    q: "Do I need GST registration to sell on GeM?",
    a: "GST registration is required for most taxable supplies. Some sellers dealing exclusively in exempt goods or falling under specific thresholds may register without it, but for the large majority of categories a valid GSTIN in the business name is necessary.",
  },
  {
    q: "What is vendor assessment on GeM?",
    a: "Vendor assessment is an evaluation required for certain seller categories, particularly manufacturers and OEMs, carried out through an assessment agency. It reviews your production or service capability. We help you prepare the documentation and understand what the assessment covers.",
  },
  {
    q: "Can a reseller list products on GeM?",
    a: "Yes, provided you hold valid authorisation from the original equipment manufacturer or brand owner for the products you list. Listing branded goods without that authorisation leads to takedowns and can affect your seller standing.",
  },
  {
    q: "What benefits do MSMEs get on GeM?",
    a: "Registered MSEs may receive benefits under public procurement policy, such as exemption from certain tender fees and earnest money deposits, and purchase preference in specified circumstances. Eligibility depends on your Udyam registration and the buyer's tender conditions.",
  },
  {
    q: "How often should a GeM catalogue be updated?",
    a: "Whenever your prices, stock position, delivery period or product specifications change — and at minimum on a quarterly review. Stale listings lose visibility and create disputes when a buyer orders against terms you can no longer meet.",
  },
];

export default function GemServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Government e-Marketplace"
        title="GeM services from registration through repeat orders"
        description="GeM is where most government buying now begins. We handle the account end to end — getting you registered, getting your products found, and keeping the profile in good standing."
        cta={{ label: "Contact Us", href: "/contact" }}
      />

      <section className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="prose-block">
              <h2 className="!mt-0">What GeM is, in plain terms</h2>
              <p>
                The Government e-Marketplace is the Government of India&apos;s online procurement
                platform. Central ministries, state departments, public sector undertakings and
                autonomous bodies use it to buy goods and services from registered sellers. Buyers
                search a live catalogue, compare listed offers, and either place a direct order,
                run an L1 comparison or float a bid on the portal.
              </p>
              <p>
                For a supplier that means visibility is everything. If your account is incomplete,
                your products sit in the wrong category, or your specifications do not match the
                parameters buyers filter on, you are absent from the process entirely — not
                rejected, simply never seen.
              </p>
            </div>

            <div>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-brand-50 to-white py-12 dark:from-[#050D16] dark:to-dark md:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Our GeM Support"
            title="Six areas we take care of"
            description="Together these cover the whole life of a seller account. Most clients start with the first two and add the rest as orders begin to arrive."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GEM_SERVICES.map((s) => (
              <div
                key={s.title}
                className="group rounded-xl border border-solid border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl dark:border-gray-800 dark:bg-[#0E1A2B]"
              >
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-gray-800 dark:text-brand-400">
                  <ServiceIcon name={s.icon} className="h-7 w-7" />
                </span>
                <h3 className="m-0 mb-2 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Registration Checklist"
                title="Documents required for GeM seller registration"
                description="These are the usual requirements. Specific categories may ask for certifications, test reports or OEM authorisation on top."
              />
              <ul className="m-0 list-none space-y-3 p-0">
                {DOCUMENTS.map((doc) => (
                  <li key={doc} className="flex items-start gap-3 text-base text-slate-700 dark:text-gray-200">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {doc}
                  </li>
                ))}
              </ul>
              <Link href="/services/gem-registration" className="btn-outline mt-8">
                About GeM Registration
                <ArrowRightLongIcon className="w-4" />
              </Link>
            </div>

            <div>
              <SectionHeading
                align="left"
                eyebrow="Common Mistakes"
                title="What goes wrong most often"
                description="Almost every stalled account we are asked to fix has one of these problems at the root of it."
              />
              <div className="space-y-4">
                {[
                  {
                    t: "Constitution type chosen wrongly at signup",
                    d: "A proprietorship registered as a company, or vice versa, contradicts every document that follows and has to be unwound.",
                  },
                  {
                    t: "Bank account not in the business name",
                    d: "Payments stall at the last step, after delivery is already complete.",
                  },
                  {
                    t: "Products listed under a convenient category",
                    d: "Buyers filter on category-specific parameters. A near-enough category means you never appear in their results.",
                  },
                  {
                    t: "Specifications left partially filled",
                    d: "Incomplete parameters push listings down or out of comparison entirely, whatever your price is.",
                  },
                  {
                    t: "Expired certificates left on the profile",
                    d: "A lapsed GST, Udyam or ISO certificate can invalidate an otherwise winning bid at evaluation.",
                  },
                ].map((row) => (
                  <div
                    key={row.t}
                    className="rounded-xl border-0 border-l-4 border-solid border-brand-400 bg-brand-50/60 p-5 dark:bg-[#0E1A2B]"
                  >
                    <h3 className="m-0 mb-1 font-heading text-base font-bold text-darkIndigo-900 dark:text-white">
                      {row.t}
                    </h3>
                    <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">{row.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Get your GeM account set up properly"
        description="Send us your business details and we will tell you which category to register under, what documents you are missing and how long approval usually takes."
      />
      <Faqs items={gemFaqs} eyebrow="GeM FAQs" title="Questions about selling on GeM" />

      <JsonLd data={faqSchema(gemFaqs)} />
    </>
  );
}
