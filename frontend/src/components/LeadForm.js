"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/data/site";

export default function LeadForm() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");

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
      if (res.ok) {
        const name = encodeURIComponent(String(data.name || "").split(" ")[0] || "");
        router.push(`/contact/thank-you?name=${name}`);
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

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
