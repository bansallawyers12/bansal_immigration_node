"use client";

import { FormEvent, useState } from "react";

export function AfpForm() {
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/afp", { method: "POST", body: form });
    const data = (await response.json()) as { success?: boolean; message?: string };
    setMessage(data.message || (data.success ? "Application saved." : "Could not save the application."));
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm font-medium">
        First names
        <input name="first_names" required className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Family name
        <input name="family_name" required className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Phone
        <input name="phone" required className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Date of birth
        <input name="date_of_birth" type="date" required className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Place of birth
        <input name="birth_place" required className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Citizenship
        <input name="citizenship" required className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Address history
        <textarea name="address_history" required className="mt-1 min-h-24 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Purpose
        <input name="purpose" required className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Primary identity document
        <input name="primary_id" type="file" required className="mt-1 w-full" />
      </label>
      <label className="block text-sm font-medium">
        Secondary identity document
        <input name="secondary_id" type="file" required className="mt-1 w-full" />
      </label>
      {message ? <p className="text-sm text-sg-navy">{message}</p> : null}
      <button type="submit" className="rounded bg-sg-light-blue px-5 py-2 font-semibold text-white">
        Submit application
      </button>
    </form>
  );
}
