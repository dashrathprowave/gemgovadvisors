"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightLongIcon,
  CheckIcon,
  ChevronLeftSlideIcon,
  ChevronRightSlideIcon,
} from "./Icons";

const slides = [
  { src: "/assets/Hero-image.png", alt: "Empowering India. Enabling growth through government business." },
  { src: "/assets/Hero-image2.png", alt: "Simplifying GeM registration and amplifying business growth." },
  { src: "/assets/Hero-image3.png", alt: "Connecting Indian businesses with government procurement opportunities." },
  { src: "/assets/Hero-image4.png", alt: "Connecting Indian businesses with government procurement opportunities." },
];

const highlights = [
  "GeM seller registration handled end to end",
  "Tenders filtered to the ones you can actually win",
  "Bid documentation checked before it is submitted",
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <section className="bg-gradient-to-b from-brand-50 to-white dark:from-dark dark:to-dark">
      <div
        // Cream ground so the side margins on ultra-wide screens, where the
        // banner hits its width cap, match the artwork instead of going white.
        className="relative w-full bg-brand-50 dark:bg-[#050D16]"
        role="region"
        aria-roledescription="carousel"
        aria-label="GeM Advisor highlights"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          type="button"
          aria-label="Previous slide"
          onClick={prev}
          className="absolute left-0 top-[45%] z-10 hidden h-10 w-10 items-center justify-center rounded-r-lg border-0 bg-brand-600/40 text-white transition-opacity hover:bg-brand-600/70 md:flex"
        >
          <ChevronLeftSlideIcon className="h-5 w-5" />
        </button>

        {/* Height is the smallest of three limits, so the banner always lands
            inside the first screen:
              66vw  — keeps the source 3:2 shape on phones and tablets
              100vh − 7rem — leaves room for the header on short laptop screens
              600px — stops it dominating on tall monitors
            The width cap keeps ultra-wide screens from cropping too hard. */}
        <div
          className="mx-auto w-full  overflow-hidden"
          style={{ height: "min(66vw, calc(100vh - 7rem), 900px)" }}
        >
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={slide.src}
                className="relative h-full w-full flex-shrink-0"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${slides.length}`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1600px) 100vw, 1600px"
                  // Anchored above centre: the headline and cards sit in the top
                  // two-thirds of the artwork, so a wide crop should eat into the
                  // decorative wave at the bottom rather than the text.
                  className="object-cover object-[center_32%]"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Next slide"
          onClick={next}
          className="absolute right-0 top-[45%] z-10 hidden h-10 w-10 items-center justify-center rounded-l-lg border-0 bg-brand-600/40 text-white transition-opacity hover:bg-brand-600/70 md:flex"
        >
          <ChevronRightSlideIcon className="h-5 w-5" />
        </button>

        <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full border-0 transition-all ${
                i === index ? "w-6 bg-brand-600" : "w-2 bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="shell py-12 md:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="m-0 mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
              GeM Registration · Government Tenders
            </p>
            <h1 className="m-0 font-heading text-3xl font-extrabold leading-tight text-darkIndigo-900 dark:text-white sm:text-4xl lg:text-5xl">
              Sell to government buyers with paperwork that actually holds up
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-gray-300">
              GeM Advisor helps Indian businesses register on the Government e-Marketplace,
              build a catalogue buyers can find, shortlist the tenders worth bidding for, and
              submit documentation that clears technical evaluation.
            </p>

            <ul className="m-0 mt-6 list-none space-y-3 p-0">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-base text-slate-700 dark:text-gray-200">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn-primary">
                Register Your Business
                <ArrowRightLongIcon className="w-4" />
              </Link>
              <Link href="/services" className="btn-outline">
                Explore Our Services
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-solid border-brand-100 bg-white p-7 shadow-xl dark:border-gray-800 dark:bg-[#0E1A2B]">
              <h2 className="m-0 font-heading text-xl font-bold text-darkIndigo-900 dark:text-white">
                Where most sellers get stuck
              </h2>
              <dl className="m-0 mt-5 space-y-5">
                {[
                  {
                    t: "Registration details that do not match",
                    d: "A constitution type or PAN mismatch surfaces months later, at order stage.",
                  },
                  {
                    t: "Listings nobody can find",
                    d: "Wrong category or thin specifications keep products out of buyer search results.",
                  },
                  {
                    t: "Bids rejected on technicalities",
                    d: "A missing declaration or an expired certificate ends an otherwise competitive bid.",
                  },
                ].map((row) => (
                  <div key={row.t}>
                    <dt className="text-base font-semibold text-brand-700 dark:text-brand-400">{row.t}</dt>
                    <dd className="m-0 mt-1 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                      {row.d}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 no-underline hover:text-brand-700 dark:text-brand-400"
              >
                Talk through your situation
                <ArrowRightLongIcon className="w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
