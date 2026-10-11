"use client";

import { FormEvent, useState } from "react";
import { resetTurnstile, TurnstileWidget } from "@/components/forms/TurnstileWidget";

const interests = [
  "Information Technology",
  "Trades / VET",
  "Nursing & Healthcare",
  "Business & Management",
  "Engineering",
  "Not sure yet",
];

export function LpEnquiryForm({ siteKey }: { siteKey: string | null }) {
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    if (siteKey && !String(form.get("cf-turnstile-response") || "").trim()) {
      setError("Please complete the security verification.");
      return;
    }
    const response = await fetch("/lp/enquire", { method: "POST", body: form });
    if (response.redirected) {
      window.location.href = response.url;
      return;
    }
    resetTurnstile(formEl);
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    setError(data?.message || "We could not submit your enquiry. Please try again.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        Name
        <input name="name" required maxLength={120} className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" maxLength={160} className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Phone
        <input name="phone" required maxLength={40} className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Area of interest
        <select name="interest" className="mt-1 w-full rounded border px-3 py-2">
          <option value="">Select…</option>
          {interests.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Message
        <textarea name="message" rows={4} maxLength={2000} className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <TurnstileWidget siteKey={siteKey} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white">
        Get free counselling
      </button>
    </form>
  );
}
