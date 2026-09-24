import { ClockIcon, MailIcon, PhoneIcon } from "./Icons";
import LeadForm from "./LeadForm";
import { SITE } from "@/data/site";

export default function Contact({
  eyebrow = "Get Started",
  title = "Request assistance",
  description = "Tell us a little about your business and requirement — an advisor will get back to you shortly.",
}) {
  return (
    <section id="contact" className="bg-darkIndigo-900 dark:bg-[#050D16]">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="m-0 mb-3 text-sm font-bold uppercase tracking-widest text-brand-400">
              {eyebrow}
            </p>
            <h2 className="m-0 mb-4 font-heading text-3xl font-extrabold leading-snug text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mb-8 max-w-md text-base leading-relaxed text-white/70">{description}</p>

            <address className="not-italic">
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="mb-2 flex items-center gap-2 text-sm text-white/80 no-underline transition-colors hover:text-brand-400"
              >
                <PhoneIcon size={16} /> {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="mb-2 flex items-center gap-2 text-sm text-white/80 no-underline transition-colors hover:text-brand-400"
              >
                <MailIcon size={16} /> {SITE.email}
              </a>
              <p className="flex items-start gap-2 text-sm text-white/80">
                <ClockIcon size={16} className="mt-0.5" /> {SITE.hours}
              </p>
            </address>

            <div className="mt-8 rounded-xl border border-solid border-white/10 bg-white/5 p-5">
              <h3 className="m-0 mb-2 font-heading text-base font-semibold text-white">
                Want a seller account set up instead?
              </h3>
              <p className="m-0 text-sm leading-relaxed text-white/70">
                Use the registration form to send us your business details in one go — it gives
                our team enough to come back with something useful on the first call.
              </p>
            </div>
          </div>

          <div>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
