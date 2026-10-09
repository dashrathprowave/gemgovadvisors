import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";

import { SITE, NAV, FOOTER_LEGAL, SERVICES, getService, FAQS, STATS } from "@/data/site";

const APP = path.resolve("src/app");

/** Does a NAV/footer href resolve to a real page (or a valid service slug)? */
function routeExists(href) {
  const clean = href.split("?")[0];
  if (clean === "/") return existsSync(path.join(APP, "page.js"));

  const service = clean.match(/^\/services\/([^/]+)$/);
  if (service) {
    return (
      existsSync(path.join(APP, "services", "[slug]", "page.js")) &&
      SERVICES.some((s) => s.slug === service[1])
    );
  }

  return existsSync(path.join(APP, ...clean.slice(1).split("/"), "page.js"));
}

const allHrefs = (items) =>
  items.flatMap((item) => [item.href, ...(item.children ?? []).map((child) => child.href)]);

test("every navigation link points at a real route", () => {
  for (const href of allHrefs(NAV)) {
    assert.ok(routeExists(href), `NAV href has no page: ${href}`);
  }
});

test("every footer legal link points at a real route", () => {
  for (const href of allHrefs(FOOTER_LEGAL)) {
    assert.ok(routeExists(href), `FOOTER_LEGAL href has no page: ${href}`);
  }
});

test("the removed /login route stays removed", () => {
  assert.ok(!existsSync(path.join(APP, "login")), "/login must not come back");
});

test("service slugs are unique and every service is fully documented", () => {
  const slugs = SERVICES.map((s) => s.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate service slug");

  for (const service of SERVICES) {
    assert.ok(service.slug, "service missing slug");
    assert.ok(service.title, `${service.slug}: missing title`);
    assert.ok(service.desc, `${service.slug}: missing desc`);
    assert.ok(service.metaTitle, `${service.slug}: missing metaTitle`);
    assert.ok(service.metaDescription, `${service.slug}: missing metaDescription`);
    assert.ok(routeExists(`/services/${service.slug}`), `no route for ${service.slug}`);
  }
});

test("getService returns the matching service and undefined otherwise", () => {
  assert.equal(getService(SERVICES[0].slug), SERVICES[0]);
  assert.equal(getService("does-not-exist"), undefined);
});

test("site URL is https without a trailing slash", () => {
  assert.ok(SITE.url.startsWith("https://"), "SITE.url must be https");
  assert.ok(!SITE.url.endsWith("/"), "SITE.url must not end with /");
});

test("every FAQ carries both a question and an answer", () => {
  assert.ok(FAQS.length > 0, "FAQS must not be empty");
  for (const { q, a } of FAQS) {
    assert.ok(q && a, `incomplete FAQ: ${q || "(missing question)"}`);
  }
});

test("every stat carries a value and a label", () => {
  assert.ok(STATS.length > 0, "STATS must not be empty");
  for (const stat of STATS) {
    assert.ok(stat.value && stat.label, "stat missing value or label");
  }
});
