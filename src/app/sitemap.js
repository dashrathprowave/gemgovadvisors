import { SERVICES, SITE } from "@/data/site";

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/gem-services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/government-tenders", changeFrequency: "weekly", priority: 0.9 },
  { path: "/industries", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
  { path: "/register", changeFrequency: "yearly", priority: 0.8 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.2 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap() {
  const lastModified = new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE.url}${route.path === "/" ? "" : route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...SERVICES.map((service) => ({
      url: `${SITE.url}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
