import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CtaBand from "@/components/CtaBand";
import Faqs from "@/components/Faqs";
import JsonLd from "@/components/JsonLd";
import { ArrowRightLongIcon, CheckIcon } from "@/components/Icons";
import { faqSchema, pageMetadata } from "@/lib/seo";
import { TENDER_PORTALS } from "@/data/site";

export const metadata = pageMetadata({
  title: "Government Tenders",
  description:
    "Government tender support for Indian businesses — opportunity search, eligibility screening, technical and financial bid preparation, EMD guidance and post-submission support.",
  path: "/government-tenders",
  keywords: [
    "government tenders India",
    "tender bidding consultant",
    "e-tender support",
    "tender eligibility criteria",
    "EMD and bid security",
    "PSU tenders",
  ],
});

const stages = [
  {
    t: "1. Opportunity screening",
    d: "We watch GeM and government tender portals for your categories and geography, then discard everything you are not eligible for before it reaches you.",
  },
  {
    t: "2. Eligibility reading",
    d: "Turnover thresholds, years of experience, similar-work clauses, OEM conditions, class of local supplier — each read against what you can actually evidence.",
  },
  {
    t: "3. Bid or no-bid call",
    d: "An honest recommendation, with the reasoning. Sometimes the right answer is to skip a tender and prepare properly for the next cycle.",
  },
  {
    t: "4. Document assembly",
    d: "Compliance matrix, technical bid in the buyer's format, BOQ and financial bid, affidavits, declarations and supporting certificates.",
  },
  {
    t: "5. Submission",
    d: "Uploaded and confirmed well before the closing timestamp, with digital signature and fee formalities handled in advance.",
  },
  {
    t: "6. After submission",
    d: "Clarification responses, technical evaluation queries, and — win or lose — a debrief that makes the next bid stronger.",
  },
];

const tenderFaqs = [
  {
    q: "Where are government tenders published in India?",
    a: "Across several places: the Government e-Marketplace for catalogue-based and bid procurement, the Central Public Procurement Portal for central ministries and CPSUs, individual state government portals, and the separate portals run by railways, defence establishments and some large PSUs.",
  },
  {
    q: "What is EMD in a government tender?",
    a: "Earnest Money Deposit is a refundable security submitted with a bid to demonstrate seriousness. It is returned to unsuccessful bidders and adjusted or returned for the successful one. Registered MSEs and startups are exempt in many tenders, subject to the conditions stated in the document.",
  },
  {
    q: "Why do bids get rejected at the technical stage?",
    a: "Almost always for documentation reasons rather than capability: a missing declaration, an unsigned page, a certificate that has expired, experience certificates that do not match the similar-work definition, or a compliance sheet that does not follow the buyer's prescribed format.",
  },
  {
    q: "What is a pre-bid meeting and should we attend?",
    a: "It is a scheduled session where the buyer answers bidder queries before submissions open. It is worth attending or submitting written queries whenever a clause is ambiguous — clarifications issued afterwards become part of the tender and can work in your favour.",
  },
  {
    q: "Can a small business compete against large firms in tenders?",
    a: "Frequently, yes. Many tenders are set aside for micro and small enterprises, and value thresholds and local-supplier conditions often work in favour of smaller regional suppliers. Choosing the right tenders matters more than size.",
  },
  {
    q: "Do you charge per tender or as a retainer?",
    a: "Either. Some clients engage us per bid, others prefer an ongoing arrangement where we monitor opportunities and prepare submissions through the year. Scope and price are agreed before work starts.",
  },
];

export default function GovernmentTendersPage() {
  return (
    <>
      <PageHero
        eyebrow="Government Tenders"
        title="Bid for government work with documentation that survives scrutiny"
        description="Thousands of tenders are published every week. Most are irrelevant to you and many of the relevant ones carry conditions you cannot meet. We narrow that down and then prepare the bid properly."
      />

      <section className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Where We Look"
            title="The portals that matter for your business"
            description="Opportunity flow is scattered across several systems. We monitor the ones relevant to your categories rather than asking you to check them all."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TENDER_PORTALS.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-solid border-gray-100 bg-brand-50/40 p-6 transition-colors hover:border-brand-200 dark:border-gray-800 dark:bg-[#0E1A2B]"
              >
                <h3 className="m-0 mb-2 font-heading text-base font-bold text-darkIndigo-900 dark:text-white">
                  {p.title}
                </h3>
                <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-brand-50 to-white py-12 dark:from-[#050D16] dark:to-dark md:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="How We Work a Tender"
            title="Six stages from alert to award"
            description="Every bid we support goes through the same sequence. It is deliberately unexciting — that is what keeps bids from being disqualified."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stages.map((s) => (
              <div
                key={s.t}
                className="rounded-xl border border-solid border-gray-100 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-[#0E1A2B]"
              >
                <h3 className="m-0 mb-2 font-heading text-base font-bold text-brand-700 dark:text-brand-400">
                  {s.t}
                </h3>
                <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-gradient-to-b from-brand-50 to-white py-12 dark:from-[#050D16] dark:to-dark md:py-20">
        <div className="shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Eligibility"
                title="What we check before you invest a week in a bid"
              />
              <ul className="m-0 list-none space-y-3 p-0">
                {[
                  "Average annual turnover against the stated threshold",
                  "Similar work experience, and whether your certificates prove it",
                  "Registration, licence and certification requirements",
                  "Class of local supplier and Make in India content conditions",
                  "OEM authorisation and manufacturer-only restrictions",
                  "EMD, bid security declaration and tender fee obligations",
                  "Delivery period, penalty clauses and payment terms you can live with",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-slate-700 dark:text-gray-200">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-solid border-brand-100 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-[#0E1A2B]">
              <h2 className="m-0 mb-4 font-heading text-xl font-bold text-darkIndigo-900 dark:text-white">
                A word on guarantees
              </h2>
              <p className="mb-4 text-base leading-relaxed text-slate-600 dark:text-gray-300">
                No consultant can promise you a tender win, and anyone who does is either
                misunderstanding the process or misrepresenting it. Awards are decided by the
                procuring authority against published evaluation criteria.
              </p>
              <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-gray-300">
                What can be controlled is whether your bid is eligible, complete, compliant,
                competitively priced and submitted on time. That is where our work sits, and it is
                where most bids are actually lost.
              </p>
              <Link href="/services/bid-preparation" className="btn-primary">
                About Bid Preparation
                <ArrowRightLongIcon className="w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Want tender alerts filtered to your business?"
        description="Register your categories and location and we will send you opportunities you are actually eligible for — not a portal dump."
      />
      <Faqs items={tenderFaqs} eyebrow="Tender FAQs" title="Questions about government tenders" />

      <JsonLd data={faqSchema(tenderFaqs)} />
    </>
  );
}
