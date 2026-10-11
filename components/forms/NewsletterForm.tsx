"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/home/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await response.json()) as { success?: boolean; message?: string };
    setMessage(data.message || (data.success ? "You are subscribed." : "Something went wrong."));
    if (data.success) setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email"
        className="flex-1 rounded-lg border px-4 py-3"
      />
      <button type="submit" className="rounded-lg bg-sg-light-blue px-6 py-3 font-semibold text-white">
        Subscribe
      </button>
      {message ? <p className="w-full text-sm text-sg-medium-gray">{message}</p> : null}
    </form>
  );
}
