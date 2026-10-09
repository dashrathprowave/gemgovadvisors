"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, ChevronDownIcon } from "./Icons";
import { FAQS } from "@/data/site";

export default function Faqs({
  items = FAQS,
  eyebrow = "Frequently Asked Questions",
  title = "Answers to the questions we are asked most",
  showCta = true,
}) {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faqs"
      className="relative bg-gradient-to-b from-brand-50 to-white py-12 dark:from-[#050D16] dark:to-dark md:py-20"
    >
      <div className="shell">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:gap-20">
          <div className="hidden w-[280px] flex-shrink-0 items-center justify-center rounded-full border-4 border-solid border-white bg-brand-50 shadow-inner dark:border-gray-800 dark:bg-[#050D16] lg:sticky lg:top-28 lg:flex lg:h-[280px]">
            <svg
              viewBox="0 0 24 24"
              className="h-32 w-32 text-brand-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>

          <div className="flex-1">
            <div className="mb-8">
              <p className="m-0 mb-2 text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                {eyebrow}
              </p>
              <h2 className="m-0 font-heading text-2xl font-extrabold leading-snug text-darkIndigo-900 dark:text-white sm:text-3xl lg:text-4xl">
                {title}
              </h2>
            </div>

            <div className="divide-y divide-solid divide-gray-200 dark:divide-gray-800">
              {items.map((item, i) => (
                <div key={item.q} className="py-4 first:pt-0">
                  <h3 className="m-0">
                    {/* suppressHydrationWarning: form-filler extensions inject fdprocessedid before hydration. */}
                    <button
                      type="button"
                      onClick={() => setOpen(open === i ? null : i)}
                      aria-expanded={open === i}
                      suppressHydrationWarning
                      className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-0 py-1 text-left"
                    >
                      <span className="text-base font-bold text-darkIndigo-900 dark:text-white">
                        {item.q}
                      </span>
                      <ChevronDownIcon
                        className={`transform text-brand-600 transition-transform dark:text-brand-400 ${
                          open === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  <div className={`mt-3 ${open === i ? "block" : "hidden"}`}>
                    <p className="m-0 text-base leading-relaxed text-slate-600 dark:text-gray-300">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {showCta && (
              <Link href="/contact" className="btn-outline mt-8">
                Still Have Questions? Contact Us
                <ArrowIcon className="!ml-0 !h-5 !w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
