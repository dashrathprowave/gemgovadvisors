import Link from "next/link";
import { ArrowRightLongIcon } from "@/components/Icons";
import { NAV } from "@/data/site";

export const metadata = {
  title: "Page Not Found",
  description: "The page you were looking for does not exist.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white py-20 dark:from-[#050D16] dark:to-dark md:py-28">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="m-0 font-heading text-7xl font-extrabold text-brand-500 sm:text-8xl">404</p>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-darkIndigo-900 dark:text-white sm:text-4xl">
            We could not find that page
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-gray-300">
            The link may be out of date, or the page may have moved. Here is where most people are
            heading.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-solid border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 no-underline transition-colors hover:bg-brand-50 dark:border-gray-800 dark:bg-[#0E1A2B] dark:text-brand-400"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link href="/" className="btn-primary mt-10">
            Back to Home
            <ArrowRightLongIcon className="w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
