import Link from "next/link";
import Image from "next/image";
import { ExternalListIcon, MailIcon, PhoneIcon, ClockIcon } from "./Icons";
import { DISCLAIMER, FOOTER_LEGAL, NAV, SERVICES, SITE } from "@/data/site";

function LinkList({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 font-heading text-base font-semibold text-white">{title}</h3>
      <ul className="m-0 list-none space-y-2 p-0">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="flex items-start gap-1.5 text-sm text-white/70 no-underline transition-all duration-300 hover:pl-1 hover:text-brand-400"
            >
              <ExternalListIcon className="mt-0.5 flex-shrink-0" />
              <span>{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-darkIndigo-900 dark:bg-[#050D16]">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-5 inline-block rounded-lg bg-white p-2">
              <Image
                src="/assets/gem-advisor-logo.png"
                alt={SITE.name}
                width={202}
                height={72}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="mb-5 text-sm leading-relaxed text-white/70">
              {SITE.name} is an independent advisory firm helping Indian businesses register on
              the Government e-Marketplace, find relevant tenders and submit compliant bids.
            </p>
            <div className="flex gap-3">
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="GeM Advisor on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white no-underline transition-colors hover:bg-brand-500"
              >
                in
              </a>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="GeM Advisor on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white no-underline transition-colors hover:bg-brand-500"
              >
                f
              </a>
            </div>
          </div>

          <LinkList title="Quick Links" links={NAV} />

          <LinkList
            title="Our Services"
            links={SERVICES.map((s) => ({ label: s.title, href: `/services/${s.slug}` }))}
          />

          <div>
            <h3 className="mb-4 font-heading text-base font-semibold text-white">Get in Touch</h3>
            <address className="not-italic">
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="mb-2 flex items-center gap-2 text-sm text-white/70 no-underline transition-colors hover:text-brand-400"
              >
                <PhoneIcon size={16} /> {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="mb-2 flex items-center gap-2 text-sm text-white/70 no-underline transition-colors hover:text-brand-400"
              >
                <MailIcon size={16} /> {SITE.email}
              </a>
              <p className="flex items-start gap-2 text-sm text-white/70">
                <ClockIcon size={16} className="mt-0.5" /> {SITE.hours}
              </p>
            </address>
            <Link
              href="/register"
              className="mt-4 inline-flex rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold leading-none text-white no-underline transition-colors hover:bg-primary"
            >
              Register Your Business
            </Link>
          </div>
        </div>

        <div className="border-0 border-t border-solid border-white/10 py-6">
          <p className="m-0 text-xs leading-relaxed text-white/40">{DISCLAIMER}</p>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-0 border-t border-solid border-white/10 py-5 text-xs text-white/50 sm:flex-row">
          <p className="m-0">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <ul className="m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-2 p-0">
            {FOOTER_LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/50 no-underline transition-colors hover:text-brand-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
