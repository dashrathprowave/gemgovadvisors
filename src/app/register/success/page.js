import Link from "next/link";
import { ArrowRightLongIcon, CheckCircleIcon, ClockIcon, MailIcon, PhoneIcon } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";
import { SERVICES, SITE } from "@/data/site";

export const metadata = pageMetadata({
  title: "Registration Received",
  description: "Thank you for registering with GeM Advisor. An advisor will contact you shortly.",
  path: "/register/success",
  noIndex: true,
});

const nextSteps = [
  {
    title: "We read your details properly",
    desc: "An advisor goes through what you told us about your business and requirement before picking up the phone. The first call starts from what you wrote, not from a script.",
  },
  {
    title: "You hear from us within one working day",
    desc: `Usually sooner. Calls go out during ${SITE.hours.toLowerCase()}. If you submitted over a weekend or a holiday, expect us on the next working morning.`,
  },
  {
    title: "You get a straight answer",
    desc: "What you are eligible for, what documents are missing, how long approval realistically takes, and what it will cost. If we are not the right help for your situation, we will tell you that too.",
  },
];

export default async function RegistrationSuccessPage({ searchParams }) {
  const params = await searchParams;
  const raw = Array.isArray(params?.name) ? params.name[0] : params?.name;
  // Only a first name is ever passed in the URL; strip anything that is not a name.
  const firstName = String(raw || "")
    .replace(/[^\p{L}\p{M}\s'-]/gu, "")
    .trim()
    .slice(0, 40);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white py-16 dark:from-[#050D16] dark:to-dark md:py-24">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-200/40 dark:bg-brand-900/20" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand-300/30 dark:bg-brand-900/10" />

        <div className="shell relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-brand-600 shadow-lg dark:bg-brand-900/40 dark:text-brand-400">
              <CheckCircleIcon className="h-12 w-12" />
            </span>

            <p className="m-0 mb-3 text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Registration Received
            </p>
            <h1 className="m-0 font-heading text-3xl font-extrabold leading-tight text-darkIndigo-900 dark:text-white sm:text-4xl lg:text-5xl">
              {firstName ? `Thank you, ${firstName} — we have your details.` : "Thank you — we have your details."}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-gray-300">
              Your registration has reached our team and is already in the queue for review. One of
              our advisors will go through your business profile and{" "}
              <strong className="text-darkIndigo-900 dark:text-white">
                connect with you very soon
              </strong>{" "}
              — usually within one working day — to talk through what applies to your business and
              what the next step should be.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/services" className="btn-primary">
                Explore Our Services
                <ArrowRightLongIcon className="w-4" />
              </Link>
              <Link href="/" className="btn-outline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          <div className="mx-auto max-w-4xl">
            <h2 className="m-0 mb-8 text-center font-heading text-2xl font-extrabold text-darkIndigo-900 dark:text-white sm:text-3xl">
              What happens from here
            </h2>
            <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
              {nextSteps.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-solid border-gray-100 bg-brand-50/40 p-7 dark:border-gray-800 dark:bg-[#0E1A2B]"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-mono text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="m-0 mb-2 font-heading text-base font-bold text-darkIndigo-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-2xl bg-darkIndigo-900 p-8 dark:bg-[#050D16] sm:p-10">
              <h2 className="m-0 mb-3 font-heading text-xl font-bold text-white">
                Need to reach us before then?
              </h2>
              <p className="mb-6 text-base leading-relaxed text-white/70">
                If your requirement is urgent — a tender closing this week, for instance — call us
                directly and mention that you have just registered.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-base font-semibold text-white no-underline hover:text-brand-400"
                >
                  <PhoneIcon size={18} /> {SITE.phone}
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2 text-base font-semibold text-white no-underline hover:text-brand-400"
                >
                  <MailIcon size={18} /> {SITE.email}
                </a>
                <p className="m-0 flex items-center gap-2 text-sm text-white/60">
                  <ClockIcon size={16} /> {SITE.hours}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="m-0 mb-5 text-center font-heading text-xl font-bold text-darkIndigo-900 dark:text-white">
                While you wait, read up on what we do
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="rounded-full border border-solid border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 no-underline transition-colors hover:bg-brand-100 dark:border-gray-800 dark:bg-[#0E1A2B] dark:text-brand-400"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
