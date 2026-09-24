import Link from "next/link";
import ServiceIcon from "./ServiceIcon";
import { ArrowRightLongIcon } from "./Icons";
import { SERVICES } from "@/data/site";

export default function ServicesGrid({ services = SERVICES, columns = 3 }) {
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-6 ${cols}`}>
      {services.map((service) => (
        <article
          key={service.slug}
          className="group flex h-full flex-col rounded-xl border border-solid border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl dark:border-gray-800 dark:bg-[#0E1A2B]"
        >
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-gray-800 dark:text-brand-400">
            <ServiceIcon name={service.icon} className="h-7 w-7" />
          </span>
          {service.count && (
            <p className="m-0 mb-1.5 font-mono text-sm text-brand-600 dark:text-brand-400">{service.count}</p>
          )}
          <h3 className="m-0 mb-3 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
            <Link
              href={`/services/${service.slug}`}
              className="text-inherit no-underline transition-colors hover:text-brand-600"
            >
              {service.title}
            </Link>
          </h3>
          <p className="m-0 mb-5 flex-1 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
            {service.desc}
          </p>
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 no-underline transition-colors hover:text-brand-700 dark:text-brand-400"
            aria-label={`Read more about ${service.title}`}
          >
            Learn more
            <ArrowRightLongIcon className="w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </article>
      ))}
    </div>
  );
}
