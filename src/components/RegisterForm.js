"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLongIcon } from "./Icons";

export default function RegisterForm() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("idle");
        setError(body.error || "We could not submit your details. Please try again.");
        return;
      }

      const name = encodeURIComponent(String(data.name || "").split(" ")[0] || "");
      router.push(`/register/success?name=${name}`);
    } catch {
      setStatus("idle");
      setError("Network problem — please check your connection and try again.");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-solid border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-[#0E1A2B] sm:p-9"
      noValidate={false}
    >
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-5 p-0 font-heading text-lg font-bold text-darkIndigo-900 dark:text-white">
          Your details
        </legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="rf-name" className="field-label">
              Full name <span className="text-brand-600">*</span>
            </label>
            {/* suppressHydrationWarning: form-filler extensions inject fdprocessedid into controls before hydration. */}
            <input id="rf-name" name="name" type="text" required autoComplete="name" placeholder="e.g. Ramesh Patel" className="field" suppressHydrationWarning />
          </div>
          <div>
            <label htmlFor="rf-designation" className="field-label">
              Designation
            </label>
            <input id="rf-designation" name="designation" type="text" autoComplete="organization-title" placeholder="e.g. Proprietor, Director" className="field" suppressHydrationWarning />
          </div>
          <div>
            <label htmlFor="rf-phone" className="field-label">
              Mobile number <span className="text-brand-600">*</span>
            </label>
            <input
              id="rf-phone"
              name="phone"
              type="tel"
              required
              inputMode="numeric"
              pattern="[0-9+\s-]{10,15}"
              title="Enter a valid mobile number"
              autoComplete="tel"
              placeholder="10-digit mobile number"
              className="field"
              suppressHydrationWarning
            />
          </div>
          <div>
            <label htmlFor="rf-email" className="field-label">
              Email address <span className="text-brand-600">*</span>
            </label>
            <input id="rf-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className="field" suppressHydrationWarning />
          </div>
           <div className="sm:col-span-2">
            <label htmlFor="rf-company" className="field-label">
              Company / business name 
            </label>
            <input id="rf-company" name="company" type="text"  autoComplete="organization" placeholder="Registered name of your business" className="field" suppressHydrationWarning />
          </div>
        </div>
      </fieldset>


      <label htmlFor="rf-consent" className="mt-7 flex cursor-pointer items-start gap-3 text-sm text-slate-600 dark:text-gray-300">
        <input id="rf-consent" name="consent" type="checkbox" required value="yes" className="mt-1 accent-brand-500" suppressHydrationWarning />
        <span>
          I agree to be contacted by {""}
          <strong className="text-darkIndigo-900 dark:text-white">GeM Advisor</strong> about my
          enquiry by phone, email or WhatsApp. <span className="text-brand-600">*</span>
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        suppressHydrationWarning
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-6 py-4 text-base font-semibold leading-none text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" ? "Submitting…" : "Submit Registration"}
        {status !== "sending" && <ArrowRightLongIcon className="w-4" />}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        Your details are used only to respond to this enquiry. We do not sell or share them with
        third parties.
      </p>
    </form>
  );
}
