"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { resetTurnstile, TurnstileWidget } from "@/components/forms/TurnstileWidget";

export function OfficeVisitForm({ siteKey }: { siteKey: string | null }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const entries = Object.fromEntries(new FormData(formEl).entries());
    if (siteKey && !String(entries["cf-turnstile-response"] || "").trim()) {
      setError("Please complete the security verification.");
      return;
    }
    const response = await fetch("/api/office-visit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(entries),
    });
    const data = (await response.json()) as { success?: boolean; message?: string };
    if (!data.success) {
      resetTurnstile(formEl);
      setError(data.message || "Could not save the form.");
      return;
    }
    router.push("/office-visit-form/thank-you");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm font-medium">First name<input name="first_name" required className="mt-1 w-full rounded border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Last name<input name="last_name" required className="mt-1 w-full rounded border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Email<input name="email" type="email" required className="mt-1 w-full rounded border px-3 py-2" /></label>
      <label className="block text-sm font-medium">Phone<input name="phone" required className="mt-1 w-full rounded border px-3 py-2" /></label>
      <TurnstileWidget siteKey={siteKey} />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" className="rounded bg-sg-light-blue px-5 py-2 font-semibold text-white">Submit</button>
    </form>
  );
}
