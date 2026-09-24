import Link from "next/link";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ServicesGrid from "@/components/ServicesGrid";
import SectionHeading from "@/components/SectionHeading";
import HowItWorks from "@/components/HowItWorks";
import WhyUs from "@/components/WhyUs";
import About from "@/components/About";
import Faqs from "@/components/Faqs";
import Contact from "@/components/Contact";
import CtaBand from "@/components/CtaBand";
import ServiceIcon from "@/components/ServiceIcon";
import JsonLd from "@/components/JsonLd";
import { ArrowRightLongIcon, CheckIcon } from "@/components/Icons";
import { faqSchema } from "@/lib/seo";
import { DOCUMENTS, FAQS, GEM_SERVICES, INDUSTRIES, PROCESS_TIMELINE, SITE } from "@/data/site";

export const metadata = {
  title: `${SITE.name} | GeM Registration & Government Tender Consultancy in India`,
  description:
    "GeM Advisor helps Indian businesses register on the Government e-Marketplace, manage catalogues, find relevant government tenders and prepare compliant bids. Talk to an advisor today.",
  alternates: { canonical: "/" },
};

const homeFaqs = FAQS.slice(0, 8);

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />

      {/* Services */}
      <section id="services" className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="What We Do"
            title="Complete government procurement support"
            description="Six services that cover the full path from a first seller account to repeat orders — take one of them or all of them."
          />
          <ServicesGrid />
          <div className="mt-10 text-center">
            <Link href="/services" className="btn-primary">
              View All Services
              <ArrowRightLongIcon className="w-4" />
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* GeM services */}
      <section className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="m-0 mb-3 text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                Government e-Marketplace
              </p>
              <h2 className="m-0 mb-5 font-heading text-2xl font-extrabold leading-snug text-darkIndigo-900 dark:text-white sm:text-3xl lg:text-4xl">
                Everything your GeM seller account needs
              </h2>
              <p className="mb-5 text-base leading-relaxed text-slate-600 dark:text-gray-300 lg:text-lg">
                GeM is where most government buying now starts. Departments search the catalogue,
                compare listed sellers and raise demands directly on the portal. If your account is
                incomplete or your products are mapped to the wrong category, you are invisible to
                that entire process.
              </p>
              <p className="mb-8 text-base leading-relaxed text-slate-600 dark:text-gray-300 lg:text-lg">
                We look after the whole account — registration, listings, bids, orders and the
                compliance declarations that keep it in good standing.
              </p>
              <Link href="/gem-services" className="btn-primary">
                Explore GeM Services
                <ArrowRightLongIcon className="w-4" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {GEM_SERVICES.map((s) => (
                  <div
                    key={s.title}
                    className="rounded-xl border border-solid border-gray-100 bg-brand-50/40 p-5 transition-colors hover:border-brand-200 dark:border-gray-800 dark:bg-[#0E1A2B]"
                  >
                    <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm dark:bg-gray-800 dark:text-brand-400">
                      <ServiceIcon name={s.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="m-0 mb-1.5 font-heading text-base font-bold text-darkIndigo-900 dark:text-white">
                      {s.title}
                    </h3>
                    <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyUs />

      {/* Documents + timeline */}
      <section className="bg-gradient-to-b from-brand-50 to-white py-12 dark:from-[#050D16] dark:to-dark md:py-20">
        <div className="shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Before We Start"
                title="Documents you will typically need"
                description="Nothing exotic — but every one of them has to match the others exactly. We check that before anything is submitted."
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
            </div>

            <div>
              <SectionHeading
                align="left"
                eyebrow="Typical Timeline"
                title="What the first few weeks look like"
                description="Timelines shift with category approvals and vendor assessment, but this is the usual shape of an engagement."
              />
              <ol className="m-0 list-none space-y-6 border-0 border-l-2 border-solid border-brand-200 p-0 pl-6 dark:border-gray-800">
                {PROCESS_TIMELINE.map((item) => (
                  <li key={item.title} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-solid border-white bg-brand-500 dark:border-dark"
                    />
                    <p className="m-0 font-mono text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                      {item.step}
                    </p>
                    <h3 className="m-0 mt-1 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="m-0 mt-1 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                      {item.desc}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Industries We Serve"
            title="Sectors where we work most often"
            description="Government demand is spread across hundreds of categories. These are the ones where we have done the most work."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <div
                key={industry.title}
                className="group rounded-xl border border-solid border-gray-100 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg dark:border-gray-800 dark:bg-[#0E1A2B]"
              >
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-gray-800 dark:text-brand-400">
                  <ServiceIcon name={industry.icon} className="h-6 w-6" />
                </span>
                <h3 className="m-0 font-heading text-sm font-semibold text-darkIndigo-900 dark:text-white sm:text-base">
                  {industry.title}
                </h3>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/industries" className="btn-outline">
              See Sector Detail
              <ArrowRightLongIcon className="w-4" />
            </Link>
          </div>
        </div>
      </section>

      <About />
      <CtaBand />
      <Faqs items={homeFaqs} title="Answers to the questions we hear most" />
      <Contact />

      <JsonLd data={faqSchema(homeFaqs)} />
    </>
  );
}
