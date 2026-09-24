import { STATS } from "@/data/site";

export default function Stats() {
  return (
    <section aria-label="Key figures" className="bg-white pb-4 pt-2 dark:bg-dark md:pt-6">
      <div className="shell">
        <dl className="m-0 grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={`flex flex-col items-center justify-center rounded-xl p-8 text-center shadow transition-shadow duration-300 hover:shadow-md ${s.bg} dark:bg-[#050D16]`}
            >
              <dt className="order-2 text-sm text-gray-700 dark:text-gray-200">{s.label}</dt>
              <dd className="order-1 m-0 mb-2 font-heading text-3xl font-bold text-darkIndigo-900 dark:text-white sm:text-5xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
