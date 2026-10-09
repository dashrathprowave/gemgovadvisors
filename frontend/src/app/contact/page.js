import Link from "next/link";
import PageHero from "@/components/PageHero";
import Contact from "@/components/Contact";
import Faqs from "@/components/Faqs";
import { ClockIcon, MailIcon, PhoneIcon, UserPlusIcon } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";
import { FAQS, SITE } from "@/data/site";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact GeM Advisor for GeM registration, catalogue management, government tender search and bid preparation support. Call, email or send us your requirement online.",
  path: "/contact",
  keywords: ["contact GeM Advisor", "GeM consultant contact", "tender consultant India contact"],
});

const cards = [
  {
    Icon: PhoneIcon,
    title: "Call us",
    lines: [SITE.phone],
    href: `tel:${SITE.phone.replace(/\s/g, "")}`,
    note: "Fastest if your deadline is this week.",
  },
  {
    Icon: MailIcon,
    title: "Email us",
    lines: [SITE.email],
    href: `mailto:${SITE.email}`,
    note: "Attach the tender document — we will read it.",
  },
  {
    Icon: ClockIcon,
    title: "Office hours",
    lines: [SITE.hours],
    note: "Outside these hours, we reply next working day.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to an advisor"
        description="Tell us what you supply and what you are trying to win. If we are not the right help for it, we will say so rather than sell you something."
      />

      <section className="bg-white py-12 dark:bg-dark md:py-16">
        <div className="shell">
          {/* Icon beside the text rather than above it: the cards then size to
              their content instead of stacking into tall, half-empty boxes. */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {cards.map(({ Icon, title, lines, href, note }) => (
              <div
                key={title}
                className="flex items-start gap-3.5 rounded-xl border border-solid border-gray-100 bg-brand-50/40 p-5 dark:border-gray-800 dark:bg-[#0E1A2B]"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm dark:bg-gray-800 dark:text-brand-400">
                  <Icon size={19} />
                </span>
                <div className="min-w-0">
                  <h2 className="m-0 font-heading text-sm font-bold text-darkIndigo-900 dark:text-white">
                    {title}
                  </h2>
                  {lines.map((line) =>
                    href ? (
                      <a
                        key={line}
                        href={href}
                        className="mt-0.5 block break-words text-sm font-semibold leading-snug text-brand-700 no-underline hover:text-brand-800 dark:text-brand-400"
                      >
                        {line}
                      </a>
                    ) : (
                      <p
                        key={line}
                        className="m-0 mt-0.5 text-balance text-sm font-semibold leading-snug text-darkIndigo-900 dark:text-gray-100"
                      >
                        {line}
                      </p>
                    )
                  )}
                  <p className="m-0 mt-1 text-xs leading-snug text-slate-500 dark:text-gray-400">{note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-5 rounded-xl border border-solid border-brand-200 bg-brand-50 p-6 dark:border-gray-800 dark:bg-[#0E1A2B] sm:flex-row sm:items-center">
            <div>
              <h2 className="m-0 mb-1.5 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                Sending your full business details?
              </h2>
              <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                The registration form collects your contact and company details — name, designation,
                mobile, email and business name — so the first call is already productive.
              </p>
            </div>
            <Link href="/register" className="btn-primary flex-shrink-0">
              <UserPlusIcon size={18} />
              Register Your Business
            </Link>
          </div>
        </div>
      </section>

      <Contact
        eyebrow="Send a Message"
        title="Tell us about your requirement"
        description="Fill in what you can. A short note about what you supply and what you are bidding for is enough to get started."
      />

      <Faqs items={FAQS.slice(0, 6)} eyebrow="Before You Write" title="You might find your answer here" showCta={false} />
    </>
  );
}
