import Link from "next/link";
import PageHero from "@/components/PageHero";
import ServicesGrid from "@/components/ServicesGrid";
import SectionHeading from "@/components/SectionHeading";
import HowItWorks from "@/components/HowItWorks";
import CtaBand from "@/components/CtaBand";
import Faqs from "@/components/Faqs";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, serviceSchema } from "@/lib/seo";
import { FAQS, SERVICES, SITE } from "@/data/site";

export const metadata = pageMetadata({
  title: "Our Services",
  description:
    "GeM registration, catalogue management, tender search, bid preparation, tender consultancy and post-bid support for Indian businesses selling to government buyers.",
  path: "/services",
  keywords: [
    "GeM registration services",
    "tender bidding services",
    "bid preparation consultant",
    "government tender support India",
    "GeM catalogue services",
  ],
});

function matches(service, q) {
  const haystack = [service.title, service.desc, service.intro, ...(service.bullets || [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export default async function ServicesPage({ searchParams }) {
  const params = await searchParams;
  const raw = Array.isArray(params?.q) ? params.q[0] : params?.q;
  const query = (raw || "").trim().toLowerCase();
  const results = query ? SERVICES.filter((s) => matches(s, query)) : SERVICES;

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Support across the whole government procurement cycle"
        description="Six services covering registration, listing, opportunity selection, bidding and everything that follows an award. Engage one of them or the full set."
      />

      <section className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          {query && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-solid border-brand-200 bg-brand-50 p-5 dark:border-gray-800 dark:bg-[#0E1A2B]">
              <p className="m-0 text-sm text-slate-700 dark:text-gray-200">
                {results.length > 0
                  ? `${results.length} service${results.length === 1 ? "" : "s"} matching `
                  : "No services matched "}
                <strong className="text-brand-700 dark:text-brand-400">&ldquo;{raw}&rdquo;</strong>
                {results.length === 0 && " — showing everything we offer instead."}
              </p>
              <Link
                href="/services"
                className="text-sm font-semibold text-brand-600 no-underline hover:text-brand-700 dark:text-brand-400"
              >
                Clear search
              </Link>
            </div>
          )}

          <ServicesGrid services={results.length > 0 ? results : SERVICES} />
        </div>
      </section>

      <section className="bg-gradient-to-b from-brand-50 to-white py-12 dark:from-[#050D16] dark:to-dark md:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Where To Start"
            title="Not sure which service you need?"
            description="Most engagements begin in one of these three places. If none of them fits, describe your situation and we will tell you what is actually required."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                t: "You have never sold to government",
                d: "Start with GeM registration. We check your documents, pick the right seller category and get the account approved.",
                href: "/services/gem-registration",
                cta: "GeM Registration",
              },
              {
                t: "You are registered but getting no orders",
                d: "Usually a catalogue problem. Wrong category mapping and thin specifications keep listings out of buyer searches.",
                href: "/services/catalogue-management",
                cta: "Catalogue Management",
              },
              {
                t: "You bid but keep losing on technicalities",
                d: "Bid preparation. We work the eligibility matrix and the document set before the deadline, not during it.",
                href: "/services/bid-preparation",
                cta: "Bid Preparation",
              },
            ].map((card) => (
              <div
                key={card.t}
                className="flex flex-col rounded-xl border border-solid border-gray-100 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-[#0E1A2B]"
              >
                <h3 className="m-0 mb-3 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                  {card.t}
                </h3>
                <p className="m-0 mb-5 flex-1 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                  {card.d}
                </p>
                <Link
                  href={card.href}
                  className="text-sm font-semibold text-brand-600 no-underline hover:text-brand-700 dark:text-brand-400"
                >
                  {card.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <CtaBand
        title="Tell us what you supply and we will tell you where to start"
        description={`Register your business details or call ${SITE.phone}. There is no cost to the first conversation.`}
      />
      <Faqs items={FAQS.slice(0, 6)} title="Common questions about our services" />

      <JsonLd data={SERVICES.map(serviceSchema)} />
    </>
  );
}
