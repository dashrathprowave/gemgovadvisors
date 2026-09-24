import Link from "next/link";
import { ArrowIcon } from "./Icons";
import { DISCLAIMER, SITE } from "@/data/site";

export default function About() {
  return (
    // z-0 gives the section a stacking context so the card's -z-1 decorative
    // layers paint above the section background instead of disappearing behind it.
    <section className="relative z-0 bg-white py-12 dark:bg-dark md:py-20">
      <div className="shell">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1">
            <p className="m-0 mb-3 text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              About {SITE.name}
            </p>
            <h2 className="m-0 mb-6 font-heading text-2xl font-extrabold leading-snug text-darkIndigo-900 dark:text-white sm:text-3xl lg:text-4xl">
              An advisory firm built around how government buying really works
            </h2>
            <p className="mb-5 text-lg leading-relaxed text-slate-600 dark:text-gray-300">
              {SITE.name} works with Indian businesses that want to sell to government
              departments, PSUs and autonomous bodies. Government procurement rewards
              preparation — the right registration, accurate documentation and a realistic read
              of eligibility. That is the work we do.
            </p>
            <p className="mb-5 text-lg leading-relaxed text-slate-600 dark:text-gray-300">
              We set up your GeM seller profile and catalogue properly the first time, filter the
              tender landscape down to opportunities you can actually win, and prepare compliant,
              complete bid documentation.
            </p>
            <p className="mb-5 text-lg leading-relaxed text-slate-600 dark:text-gray-300">
              Engagements stay transparent — clear scope, clear timelines and honest advice about
              whether an opportunity is worth pursuing. If a tender is not a good fit for your
              business, we will say so.
            </p>
            <Link href="/about" className="btn-outline mt-4">
              More About Us
              <ArrowIcon className="!ml-0 !h-5 !w-5" />
            </Link>
          </div>

          <div className="flex w-full flex-1 items-center justify-center">
            <div className="relative w-[92%] rounded-xl before:absolute before:-bottom-2 before:-left-2 before:-z-1 before:h-full before:w-full before:rounded-xl before:bg-brand-300 dark:before:bg-gray-700">
              <div className="absolute -bottom-3.5 -left-3.5 -z-1 h-[96%] w-[96%] rounded-bl-xl border-0 border-b-2 border-l-2 border-solid border-brand-200 dark:border-gray-700" />
              <div className="absolute -bottom-5 -left-5 -z-1 h-[94%] w-[94%] rounded-bl-2xl border-0 border-b-2 border-l-2 border-solid border-brand-200 dark:border-gray-700" />
              <div className="relative rounded-xl bg-white p-8 shadow-lg dark:bg-[#050D16]">
                <h3 className="m-0 mb-3 font-heading text-xl font-bold text-darkIndigo-900 dark:text-white">
                  Important Notice
                </h3>
                <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                  {DISCLAIMER}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
