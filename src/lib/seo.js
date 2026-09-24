import { SITE } from "@/data/site";

/**
 * Builds a complete Metadata object for a page: canonical URL, Open Graph and
 * Twitter cards all derive from the same title/description/path so they cannot
 * drift apart.
 */
export function pageMetadata({ title, description, path = "/", keywords = [], noIndex = false }) {
  // `title` stays bare: the root layout's title template appends the brand name to
  // every nested page. Social cards do not inherit that template, so they get the
  // branded form built explicitly.
  const fullTitle = `${title} | ${SITE.name}`;
  const url = path === "/" ? SITE.url : `${SITE.url}${path}`;

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: SITE.name,
      title: fullTitle,
      description,
      images: [{ url: "/assets/Hero-image.png", width: 1672, height: 941, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/assets/Hero-image.png"],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/assets/gem-advisor-logo.png`,
    image: `${SITE.url}/assets/Hero-image.png`,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    priceRange: "₹₹",
    areaServed: { "@type": "Country", name: "India" },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    sameAs: [SITE.social.linkedin, SITE.social.facebook],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function serviceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription || service.desc,
    serviceType: service.title,
    url: `${SITE.url}/services/${service.slug}`,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: { "@type": "Country", name: "India" },
  };
}
