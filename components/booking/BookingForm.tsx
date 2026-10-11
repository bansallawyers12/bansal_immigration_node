"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function BookingForm() {
  const router = useRouter();
  const [slots, setSlots] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [location, setLocation] = useState("melbourne");
  const [enquiryType, setEnquiryType] = useState("education");
  const [date, setDate] = useState("");

  async function loadSlots(nextDate: string, nextLocation = location, nextEnquiry = enquiryType) {
    setDate(nextDate);
    if (!nextDate) return;
    const response = await fetch(
      `/api/appointments/slots?location=${nextLocation}&enquiryType=${nextEnquiry}&date=${nextDate}`,
    );
    const data = (await response.json()) as { slots?: string[] };
    setSlots(data.slots ?? []);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/appointments/book", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = (await response.json()) as { success?: boolean; message?: string };
    if (!response.ok || !data.success) {
      setError(data.message || "That time is no longer available.");
      return;
    }
    router.push("/appointment-thank-you");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm font-medium">
        Full name
        <input name="full_name" required className="mt-1 w-full rounded border px-3 py-2" />
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
        Location
        <select
          name="location"
          value={location}
          onChange={(event) => {
            setLocation(event.target.value);
            void loadSlots(date, event.target.value, enquiryType);
          }}
          className="mt-1 w-full rounded border px-3 py-2"
        >
          <option value="melbourne">Melbourne</option>
          <option value="adelaide">Adelaide</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Enquiry
        <select
          name="enquiry_type"
          value={enquiryType}
          onChange={(event) => {
            setEnquiryType(event.target.value);
            void loadSlots(date, location, event.target.value);
          }}
          className="mt-1 w-full rounded border px-3 py-2"
        >
          <option value="education">Education</option>
          <option value="tourist">Tourist</option>
          <option value="migration">Migration</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Date
        <input
          name="appointment_date"
          type="date"
          required
          value={date}
          onChange={(event) => void loadSlots(event.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        Time
        <select name="appointment_time" required className="mt-1 w-full rounded border px-3 py-2">
          <option value="">Select a time</option>
          {slots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Details
        <textarea name="enquiry_details" className="mt-1 min-h-24 w-full rounded border px-3 py-2" />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" className="rounded bg-sg-light-blue px-5 py-2 font-semibold text-white">
        Book consultation
      </button>
    </form>
  );
}
