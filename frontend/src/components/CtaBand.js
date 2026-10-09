import Link from "next/link";
import { ArrowRightLongIcon, PhoneIcon } from "./Icons";
import { SITE } from "@/data/site";

export default function CtaBand({
  title = "Ready to start selling to government buyers?",
  description = "Register your business details and an advisor will review your requirement and get back to you — usually within one working day.",
  primary = { label: "Register Your Business", href: "/register" },
  secondary = { label: "Talk to an Advisor", href: "/contact" },
}) {
  return (
    <section className="bg-gradient-to-r from-brand-500 to-brand-600 py-14">
      <div className="shell flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
        <div className="max-w-2xl text-center lg:text-left">
          <h2 className="m-0 font-heading text-2xl font-extrabold leading-snug text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/85">{description}</p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            href={primary.href}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 text-base font-semibold leading-none text-brand-700 no-underline transition-colors hover:bg-brand-50"
          >
            {primary.label}
            <ArrowRightLongIcon className="w-4" />
          </Link>
          <Link
            href={secondary.href}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-solid border-white/70 bg-transparent px-6 py-3.5 text-base font-semibold leading-none text-white no-underline transition-colors hover:bg-white/10"
          >
            <PhoneIcon size={16} />
            {secondary.label}
          </Link>
        </div>
      </div>
      <p className="mt-8 text-center text-sm text-white/75">
        Prefer to call? {SITE.phone} · {SITE.hours}
      </p>
    </section>
  );
}
