import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CtaBand from "@/components/CtaBand";
import ServiceIcon from "@/components/ServiceIcon";
import { ArrowRightLongIcon } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";
import { INDUSTRIES } from "@/data/site";

export const metadata = pageMetadata({
  title: "Industries We Serve",
  description:
    "GeM and government tender support across IT and software, security services, construction, electrical and electronics, office supplies, healthcare, facility management and professional services.",
  path: "/industries",
  keywords: [
    "industries served GeM",
    "IT tenders India",
    "healthcare government tenders",
    "facility management tenders",
    "construction tenders",
    "security services tenders",
  ],
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries We Serve"
        title="Sectors where government demand is steady"
        description="Public procurement spans hundreds of categories. These are the sectors where we work most often and know what buyers ask for."
      />

      <section className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <article
                key={industry.title}
                className="group flex h-full flex-col rounded-xl border border-solid border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl dark:border-gray-800 dark:bg-[#0E1A2B]"
              >
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-gray-800 dark:text-brand-400">
                  <ServiceIcon name={industry.icon} className="h-7 w-7" />
                </span>
                <h2 className="m-0 mb-2 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                  {industry.title}
                </h2>
                <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                  {industry.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-brand-50 to-white py-12 dark:from-[#050D16] dark:to-dark md:py-20">
        <div className="shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="prose-block">
              <h2 className="!mt-0">Your sector is not on the list</h2>
              <p>
                The categories above are where our volume sits, not the limit of what we handle.
                Government departments buy laboratory reagents, uniforms, vehicles, printing,
                software licences, catering, training programmes, drone surveys and a great deal
                more besides.
              </p>
              <p>
                What matters is not whether we have worked in your industry before, but whether we
                can read your capability against a tender&apos;s eligibility clauses — and that
                skill transfers across categories. Tell us what you supply and we will tell you
                honestly whether there is public demand worth pursuing.
              </p>
              <Link href="/contact" className="btn-primary !mt-4">
                Ask About Your Sector
                <ArrowRightLongIcon className="w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-solid border-brand-100 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-[#0E1A2B]">
              <h2 className="m-0 mb-5 font-heading text-xl font-bold text-darkIndigo-900 dark:text-white">
                What changes by sector
              </h2>
              <dl className="m-0 space-y-5">
                {[
                  {
                    t: "Certification requirements",
                    d: "BIS marks, ISO standards, drug licences, electrical safety approvals — each sector has its own gatekeeping documents.",
                  },
                  {
                    t: "Who the buyer is",
                    d: "Healthcare procurement runs through different bodies than civil works. Knowing the buyer shapes how a bid is written.",
                  },
                  {
                    t: "Evaluation weighting",
                    d: "Some categories are decided almost purely on price; services contracts often carry substantial technical scoring.",
                  },
                  {
                    t: "Delivery and penalty terms",
                    d: "Liquidated damages and delivery windows vary sharply. They belong in your pricing, not in a surprise after award.",
                  },
                ].map((row) => (
                  <div key={row.t}>
                    <dt className="font-heading text-base font-semibold text-brand-700 dark:text-brand-400">
                      {row.t}
                    </dt>
                    <dd className="m-0 mt-1 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                      {row.d}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Find out what your sector is buying"
        description="Send us your product or service categories and we will come back with a realistic view of the public demand available to you."
      />
    </>
  );
}
