import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import LeadForm from "@/components/LeadForm";
import ServiceIcon from "@/components/ServiceIcon";
import JsonLd from "@/components/JsonLd";
import { ArrowRightLongIcon, CheckIcon } from "@/components/Icons";
import { pageMetadata, serviceSchema } from "@/lib/seo";
import { SERVICES, getService } from "@/data/site";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return pageMetadata({ title: "Service Not Found", description: "", path: `/services/${slug}`, noIndex: true });

  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    keywords: [service.title, `${service.title} India`, "GeM", "government tender"],
  });
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        eyebrow={service.count}
        title={service.title}
        description={service.desc}
      />

      <section className="bg-white py-12 dark:bg-dark md:py-20">
        <div className="shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-gray-800 dark:text-brand-400">
                <ServiceIcon name={service.icon} className="h-8 w-8" />
              </span>

              <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-gray-300">
                {service.intro}
              </p>

              <h2 className="m-0 mb-5 font-heading text-2xl font-bold text-darkIndigo-900 dark:text-white">
                What this service covers
              </h2>
              <ul className="m-0 mb-10 list-none space-y-3 p-0">
                {service.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-base text-slate-700 dark:text-gray-200">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <h2 className="m-0 mb-5 font-heading text-2xl font-bold text-darkIndigo-900 dark:text-white">
                What you end up with
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {service.outcomes.map((o) => (
                  <div
                    key={o}
                    className="rounded-xl border border-solid border-brand-100 bg-brand-50/50 p-5 text-sm leading-relaxed text-slate-700 dark:border-gray-800 dark:bg-[#0E1A2B] dark:text-gray-200"
                  >
                    {o}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="btn-primary">
                  Register Your Business
                  <ArrowRightLongIcon className="w-4" />
                </Link>
                <Link href="/contact" className="btn-outline">
                  Ask a Question First
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div>
                  <h2 className="m-0 mb-4 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
                    Request this service
                  </h2>
                  <LeadForm />
                </div>

                <nav aria-label="Other services" className="rounded-xl border border-solid border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#050D16]">
                  <h2 className="m-0 mb-4 font-heading text-base font-bold text-darkIndigo-900 dark:text-white">
                    Other services
                  </h2>
                  <ul className="m-0 list-none space-y-2 p-0">
                    {others.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-darkIndigo-700 no-underline transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <ServiceIcon name={s.icon} className="h-4 w-4 flex-shrink-0 text-brand-500" />
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand
        title={`Need help with ${service.title.toLowerCase()}?`}
        description="Send us your business details and an advisor will come back with a scope, a timeline and a price before any work begins."
      />

      <JsonLd data={serviceSchema(service)} />
    </>
  );
}
