import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import WhyUs from "@/components/WhyUs";
import HowItWorks from "@/components/HowItWorks";
import CtaBand from "@/components/CtaBand";
import { ArrowRightLongIcon, CheckIcon } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";
import { DISCLAIMER, SITE, STATS } from "@/data/site";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "GeM Advisor is an independent consultancy helping Indian businesses register on the Government e-Marketplace, find relevant tenders and submit compliant bids. Learn how we work.",
  path: "/about",
  keywords: [
    "about GeM Advisor",
    "GeM consultant India",
    "government tender consultant",
    "procurement advisory firm",
  ],
});

const principles = [
  {
    title: "We say no to bad opportunities",
    desc: "A tender you cannot win costs you a week of work and the EMD's opportunity cost. We would rather tell you to skip it than bill you for a bid that was never viable.",
  },
  {
    title: "Documents before optimism",
    desc: "Technical evaluation is a checklist exercise. We work through eligibility clauses line by line and tell you plainly what is missing before you commit to bidding.",
  },
  {
    title: "You keep control of your account",
    desc: "Your GeM credentials, your business, your decisions. We work alongside you rather than holding your access hostage.",
  },
  {
    title: "Clear scope, clear pricing",
    desc: "You know what a piece of work covers and what it costs before it starts. No open-ended retainers dressed up as advisory.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="An independent advisory firm for government business"
        description={`${SITE.name} helps Indian businesses win and deliver government work — from a first GeM seller account through to repeat orders from departments that know your name.`}
      />

      <section className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="prose-block lg:col-span-7">
              <h2 className="!mt-0">Who we are</h2>
              <p>
                {SITE.name} is a private consultancy working with manufacturers, traders, service
                providers and MSMEs across India who want a share of public procurement. Our work
                sits in the unglamorous middle of that ambition: registrations, catalogues,
                eligibility matrices, compliance declarations and bid files.
              </p>
              <p>
                Government buying is not short of opportunity. Central ministries, state
                departments, PSUs, railways, defence establishments, universities and municipal
                bodies all buy continuously, and much of it now runs through the Government
                e-Marketplace. What it is short of is patience for errors. A mismatched
                certificate, a category chosen carelessly or a declaration left unsigned ends a
                bid regardless of how competitive your price was.
              </p>

              <h2>What we actually do</h2>
              <p>
                We start by understanding what you supply, where you can deliver and what you have
                delivered before. That determines which categories are worth registering under and
                which tenders are realistically within reach. From there the work is concrete: get
                the seller account approved, get the catalogue accurate, filter the tender flow to
                a short list, and prepare bid documents that survive scrutiny.
              </p>
              <p>
                After submission we stay involved. Buyers raise clarifications, evaluation
                committees ask for proof, orders arrive with conditions attached and payments
                follow their own timeline. Being responsive at those stages is what turns a single
                win into a supplier relationship.
              </p>

              <h2>How we charge</h2>
              <p>
                Engagements are scoped before they start. Registration and catalogue work is priced
                as a defined piece of work. Tender support can be arranged per bid or as an ongoing
                arrangement where we track opportunities and prepare submissions through the year.
                You will know what is included before anything begins.
              </p>

              <h2>What we will not do</h2>
              <p>
                We do not promise tender wins, and we would treat any firm that does with
                suspicion. Awards are decided by the procuring authority against published
                criteria. We also do not claim any relationship with the Government of India or
                with GeM — see the notice below.
              </p>
            </div>

            <aside className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-xl border border-solid border-brand-100 bg-brand-50/60 p-7 dark:border-gray-800 dark:bg-[#0E1A2B]">
                  <h2 className="m-0 mb-5 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                    At a glance
                  </h2>
                  <dl className="m-0 space-y-4">
                    {STATS.map((s) => (
                      <div key={s.label} className="flex items-baseline gap-3">
                        <dd className="m-0 font-heading text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                          {s.value}
                        </dd>
                        <dt className="text-sm text-slate-600 dark:text-gray-300">{s.label}</dt>
                      </div>
                    ))}
                    <div className="flex items-baseline gap-3">
                      <dd className="m-0 font-heading text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                        {SITE.founded}
                      </dd>
                      <dt className="text-sm text-slate-600 dark:text-gray-300">Advising since</dt>
                    </div>
                  </dl>
                  <Link href="/contact" className="btn-primary mt-6 w-full">
                    Talk to an Advisor
                    <ArrowRightLongIcon className="w-4" />
                  </Link>
                </div>

                <div className="rounded-xl border border-solid border-gray-100 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-[#050D16]">
                  <h2 className="m-0 mb-3 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                    Important Notice
                  </h2>
                  <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                    {DISCLAIMER}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-brand-50 to-white py-12 dark:from-[#050D16] dark:to-dark md:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="How We Work"
            title="Four commitments we hold ourselves to"
            description="These are not slogans — they are the rules we apply when deciding what to advise you to do."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {principles.map((p) => (
              <div
                key={p.title}
                className="flex gap-4 rounded-xl border border-solid border-gray-100 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-[#0E1A2B]"
              >
                <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <h3 className="m-0 mb-2 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                    {p.title}
                  </h3>
                  <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <WhyUs />
      <CtaBand />
    </>
  );
}
