import SectionHeading from "./SectionHeading";
import { WHY } from "@/data/site";

export default function WhyUs() {
  return (
    <section className="bg-white py-12 dark:bg-dark md:py-20">
      <div className="shell">
        <SectionHeading
          eyebrow="Why GeM Advisor"
          title="Careful work beats confident promises"
          description="Government procurement is unforgiving about detail and indifferent to enthusiasm. Here is what we bring to it."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((item) => (
            <div
              key={item.num}
              className="relative overflow-hidden rounded-xl border border-solid border-gray-100 bg-brand-50/50 p-7 dark:border-gray-800 dark:bg-[#0E1A2B]"
            >
              <span
                aria-hidden="true"
                className="absolute -right-2 -top-4 font-heading text-6xl font-extrabold text-brand-200/70 dark:text-gray-800"
              >
                {item.num}
              </span>
              <h3 className="relative m-0 mb-3 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                {item.title}
              </h3>
              <p className="relative m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
