import Link from "next/link";
import PageHero from "@/components/PageHero";
import RegisterForm from "@/components/RegisterForm";
import { CheckIcon, ClockIcon, MailIcon, PhoneIcon } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata = pageMetadata({
  title: "Register Your Business",
  description:
    "Register your business with GeM Advisor for GeM seller registration, catalogue management and government tender support. Share your details and an advisor will contact you within one working day.",
  path: "/register",
  keywords: [
    "GeM seller registration form",
    "register for government tenders",
    "GeM registration online",
    "business registration GeM Advisor",
  ],
});

const assurances = [
  "An advisor reviews your details before calling — no scripted sales call",
  "We tell you what is missing from your documents up front",
  "You get a clear scope and price before any work begins",
  "Your details are never sold or shared with third parties",
];

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Register"
        title="Register your business with GeM Advisor"
        description="Share your business details once and an advisor will come back with what applies to you — the right seller category, the documents you are missing and a realistic timeline."
      />

      <section className="bg-white py-12 dark:bg-dark md:py-16">
        <div className="shell">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 xl:col-span-8">
              <RegisterForm />
            </div>

            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-2xl border border-solid border-brand-100 bg-brand-50/60 p-7 dark:border-gray-800 dark:bg-[#0E1A2B]">
                  <h2 className="m-0 mb-4 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                    What happens next
                  </h2>
                  <ol className="m-0 list-none space-y-4 p-0">
                    {[
                      "You submit this form — it takes about three minutes.",
                      "We review your business profile against current GeM and tender requirements.",
                      "An advisor calls you, usually within one working day.",
                      "You receive a written scope and price before anything starts.",
                    ].map((step, i) => (
                      <li key={step} className="flex gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 font-mono text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-slate-700 dark:text-gray-200">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-2xl border border-solid border-gray-100 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-[#050D16]">
                  <h2 className="m-0 mb-4 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                    Our commitments
                  </h2>
                  <ul className="m-0 list-none space-y-3 p-0">
                    {assurances.map((a) => (
                      <li
                        key={a}
                        className="flex items-start gap-3 text-sm text-slate-700 dark:text-gray-200"
                      >
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-darkIndigo-900 p-7 dark:bg-[#050D16]">
                  <h2 className="m-0 mb-4 font-heading text-lg font-bold text-white">
                    Would rather just talk?
                  </h2>
                  <a
                    href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                    className="mb-2 flex items-center gap-2 text-sm text-white/80 no-underline hover:text-brand-400"
                  >
                    <PhoneIcon size={16} /> {SITE.phone}
                  </a>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mb-2 flex items-center gap-2 text-sm text-white/80 no-underline hover:text-brand-400"
                  >
                    <MailIcon size={16} /> {SITE.email}
                  </a>
                  <p className="m-0 flex items-start gap-2 text-sm text-white/80">
                    <ClockIcon size={16} className="mt-0.5" /> {SITE.hours}
                  </p>
                </div>

                <p className="m-0 text-sm text-slate-600 dark:text-gray-400">
                  Need help with a tender or your GeM account?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-brand-600 no-underline hover:text-brand-700 dark:text-brand-400"
                  >
                    Talk to an advisor
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
