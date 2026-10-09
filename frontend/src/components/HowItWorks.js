import ServiceIcon from "./ServiceIcon";
import SectionHeading from "./SectionHeading";
import { STEPS } from "@/data/site";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-t from-brand-50 to-white py-12 dark:from-[#050D16] dark:to-dark md:py-20"
    >
      <div className="shell">
        <SectionHeading
          eyebrow="Our Process"
          title="How working with us actually goes"
          description="Four steps, no mystery. You always know what stage you are at and what is needed from you next."
        />

        <ol className="relative m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden="true"
            className="absolute left-0 top-14 hidden h-0.5 w-full bg-brand-200 dark:bg-gray-800 lg:block"
          />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative z-10 flex">
              <div className="flex w-full flex-col items-center rounded-xl border border-solid border-gray-100 bg-white p-7 text-center shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:border-gray-800 dark:bg-[#050D16]">
                <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-gray-800 dark:text-brand-400">
                  <ServiceIcon name={step.icon} className="h-8 w-8" />
                </span>
                <span className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                  Step {i + 1}
                </span>
                <h3 className="m-0 mb-2 font-heading text-lg font-semibold text-darkIndigo-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
