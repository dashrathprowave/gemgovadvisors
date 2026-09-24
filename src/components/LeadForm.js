"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightLongIcon, CheckCircleIcon } from "./Icons";
import { SERVICES, SITE } from "@/data/site";

export default function LeadForm() {
  const [status, setStatus] = useState("idle");
  const [name, setName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) {
        setName(String(data.name || "").split(" ")[0] || "");
        form.reset();
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-xl bg-white p-8 text-center shadow-xl dark:bg-[#0E1A2B] sm:p-10"
      >
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
          <CheckCircleIcon className="h-9 w-9" />
        </span>
        <h3 className="m-0 mb-3 font-heading text-2xl font-bold text-darkIndigo-900 dark:text-white">
          {name ? `Thank you, ${name}!` : "Thank you!"}
        </h3>
        <p className="m-0 text-base leading-relaxed text-slate-600 dark:text-gray-300">
          Your message has reached our team. An advisor will go through it and{" "}
          <strong className="text-darkIndigo-900 dark:text-white">get back to you within one working day</strong>.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-gray-400">
          Working on a deadline this week? Call us on{" "}
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-brand-600 no-underline">
            {SITE.phone}
          </a>{" "}
          and mention your enquiry.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/register" className="btn-primary">
            Register Your Business
            <ArrowRightLongIcon className="w-4" />
          </Link>
          <button type="button" onClick={() => setStatus("idle")} className="btn-outline">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl bg-white p-6 shadow-xl dark:bg-[#0E1A2B] sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-name" className="field-label">
            Name
          </label>
          {/* suppressHydrationWarning: form-filler extensions inject fdprocessedid before hydration. */}
          <input id="lf-name" name="name" type="text" required placeholder="Your full name" autoComplete="name" className="field" suppressHydrationWarning />
        </div>
        <div>
          <label htmlFor="lf-company" className="field-label">
            Company Name
          </label>
          <input id="lf-company" name="company" type="text" placeholder="Your company" autoComplete="organization" className="field" suppressHydrationWarning />
        </div>
        <div>
          <label htmlFor="lf-phone" className="field-label">
            Phone
          </label>
          <input id="lf-phone" name="phone" type="tel" required placeholder="Mobile number" autoComplete="tel" className="field" suppressHydrationWarning />
        </div>
        <div>
          <label htmlFor="lf-email" className="field-label">
            Email
          </label>
          {/* suppressHydrationWarning: browser extensions (e.g. temp-mail) inject attributes into email inputs before hydration. */}
          <input id="lf-email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" className="field" suppressHydrationWarning />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lf-service" className="field-label">
            Service Required
          </label>
          <select id="lf-service" name="service" defaultValue={SERVICES[0].title} className="field" suppressHydrationWarning>
            {SERVICES.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lf-message" className="field-label">
            Message
          </label>
          <textarea
            id="lf-message"
            name="message"
            rows={3}
            placeholder="Tell us briefly about your requirement"
            className="field !h-auto"
            suppressHydrationWarning
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        suppressHydrationWarning
        className="mt-5 w-full rounded-md bg-secondary px-5 py-3.5 text-base font-semibold leading-none text-white transition-colors hover:bg-primary disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Request Assistance"}
      </button>

      <p role="status" className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
        {status === "error"
          ? "Something went wrong. Please call or email us instead."
          : "We typically respond within one working day."}
      </p>
    </form>
  );
}
