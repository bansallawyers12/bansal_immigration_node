"use client";

import { FormEvent, useState } from "react";

export function OccupationFinder() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Occupation[]>([]);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("Searching...");
    const response = await fetch(`/api/occupation?q=${encodeURIComponent(term)}`);
    const data = (await response.json()) as { results?: Occupation[]; message?: string };
    setResults(data.results ?? []);
    setMessage(data.results?.length ? "" : data.message || "No occupations found.");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-sg-navy">Occupation Finder</h1>
      <p className="mt-3 text-sg-dark-gray">Search the ANZSCO occupation list used by the current site.</p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-3">
        <input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Occupation or ANZSCO code"
          className="flex-1 rounded border px-3 py-2"
          minLength={2}
          required
        />
        <button type="submit" className="rounded bg-sg-light-blue px-4 py-2 font-semibold text-white">
          Search
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-gray-600">{message}</p> : null}
      <ul className="mt-6 space-y-3">
        {results.map((item) => (
          <li key={`${item.anzsco_code}-${item.occupation_title}`} className="rounded border bg-white p-4">
            <p className="font-semibold text-sg-navy">
              {item.anzsco_code} — {item.occupation_title}
            </p>
            <p className="text-sm text-gray-600">
              {item.assessing_authority} {item.list_label ? `· ${item.list_label}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Occupation = {
  anzsco_code: string;
  occupation_title: string;
  assessing_authority: string | null;
  list_label: string | null;
};
