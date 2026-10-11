"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ContactForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = (await response.json()) as { success?: boolean; message?: string; errors?: Record<string, string> };
    setPending(false);
    if (!response.ok || !data.success) {
      setError(data.message || Object.values(data.errors ?? {}).join(" ") || "The form could not be sent.");
      return;
    }
    router.push("/contact-thank-you");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <Field name="name" label="Name" required />
      <Field name="email" label="Email" type="email" required />
      <label className="block text-sm font-medium">
        Country code
        <select name="country_code" defaultValue="+61" className="mt-1 w-full rounded border px-3 py-2">
          <option value="+61">Australia +61</option>
          <option value="+91">India +91</option>
          <option value="+63">Philippines +63</option>
          <option value="+64">New Zealand +64</option>
        </select>
      </label>
      <Field name="phone" label="Phone" required />
      <Field name="subject" label="Subject" required />
      <label className="block text-sm font-medium">
        Message
        <textarea name="message" required maxLength={5000} className="mt-1 min-h-32 w-full rounded border px-3 py-2" />
      </label>
      <input type="hidden" name="form_source" value="contact" />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={pending} className="rounded bg-sg-light-blue px-5 py-2 font-semibold text-white">
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input name={name} type={type} required={required} className="mt-1 w-full rounded border px-3 py-2" />
    </label>
  );
}
