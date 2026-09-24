import Link from "next/link";
import { ArrowRightLongIcon } from "./Icons";

/**
 * Inner-page banner: eyebrow, H1, intro line and an optional CTA button.
 *
 * `cta` = { label, href } — rendered on the right of the intro line
 * (stacked below it on small screens).
 */
export default function PageHero({ eyebrow, title, description, cta }) {
  return (
    <section className="relative overflow-hidden border-0 border-b border-solid border-brand-100 bg-gradient-to-b from-brand-50 to-white dark:border-gray-800 dark:from-[#050D16] dark:to-dark">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-200/40 dark:bg-brand-900/20" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-brand-300/30 dark:bg-brand-900/10" />

      <div className="shell relative py-12 md:py-16">
        {eyebrow && (
          <p className="m-0 mb-3 text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            {eyebrow}
          </p>
        )}
        <h1 className="m-0 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-darkIndigo-900 dark:text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {(description || cta) && (
          <div className="mt-5 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            {description && (
              <p className="m-0 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-gray-300">
                {description}
              </p>
            )}
            {cta && (
              <Link href={cta.href} className="btn-primary flex-shrink-0">
                {cta.label}
                <ArrowRightLongIcon className="w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
