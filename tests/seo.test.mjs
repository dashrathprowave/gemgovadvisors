import test from "node:test";
import assert from "node:assert/strict";

import { SITE } from "@/data/site";
import { pageMetadata, organizationSchema, websiteSchema, faqSchema, serviceSchema } from "@/lib/seo";

test("pageMetadata builds canonical, Open Graph and Twitter fields from one source", () => {
  const meta = pageMetadata({
    title: "About Us",
    description: "Who we are.",
    path: "/about",
    keywords: ["gem", "tenders"],
  });

  const canonical = `${SITE.url}/about`;
  assert.equal(meta.title, "About Us");
  assert.equal(meta.description, "Who we are.");
  assert.deepEqual(meta.keywords, ["gem", "tenders"]);
  assert.equal(meta.alternates.canonical, canonical);
  assert.equal(meta.openGraph.url, canonical);
  assert.equal(meta.openGraph.title, `About Us | ${SITE.name}`);
  assert.equal(meta.openGraph.siteName, SITE.name);
  assert.equal(meta.openGraph.type, "website");
  assert.equal(meta.twitter.card, "summary_large_image");
  assert.equal(meta.robots.index, true);
  assert.equal(meta.robots.follow, true);
});

test("root path canonicalises to the bare site URL, never a double slash", () => {
  const meta = pageMetadata({ title: "Home", description: "d" });
  assert.equal(meta.alternates.canonical, SITE.url);
  assert.ok(!meta.alternates.canonical.endsWith("//"));
});

test("noIndex pages tell crawlers not to index", () => {
  const meta = pageMetadata({ title: "x", description: "y", noIndex: true });
  assert.equal(meta.robots.index, false);
  assert.equal(meta.robots.follow, false);
});

test("empty keywords are omitted instead of shipped as an empty list", () => {
  const meta = pageMetadata({ title: "x", description: "y" });
  assert.equal(meta.keywords, undefined);
});

test("organization schema carries identity, address and social profiles", () => {
  const schema = organizationSchema();
  assert.equal(schema["@type"], "ProfessionalService");
  assert.equal(schema.name, SITE.name);
  assert.equal(schema.legalName, SITE.legalName);
  assert.equal(schema.address.streetAddress, SITE.address.street);
  assert.equal(schema.address.addressCountry, SITE.address.country);
  assert.deepEqual(schema.sameAs, [SITE.social.linkedin, SITE.social.facebook]);
});

test("website schema points its publisher at the organisation node", () => {
  const schema = websiteSchema();
  assert.equal(schema.publisher["@id"], organizationSchema()["@id"]);
  assert.equal(schema.inLanguage, "en-IN");
});

test("faq schema maps every question to its answer", () => {
  const schema = faqSchema([
    { q: "Q1?", a: "A1" },
    { q: "Q2?", a: "A2" },
  ]);
  assert.equal(schema.mainEntity.length, 2);
  assert.equal(schema.mainEntity[0].name, "Q1?");
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, "A1");
});

test("service schema links to the service's own URL and the shared provider", () => {
  const schema = serviceSchema({
    slug: "gem-registration",
    title: "GeM Registration",
    desc: "d",
  });
  assert.equal(schema.url, `${SITE.url}/services/gem-registration`);
  assert.equal(schema.provider["@id"], `${SITE.url}/#organization`);
});
