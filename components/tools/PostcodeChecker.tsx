"use client";

import { FormEvent, useState } from "react";

type Result = {
  suburb: string;
  postcode: string;
  state: string;
  category: string;
  regional: boolean;
};

export function PostcodeChecker() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/postcode/check?search=${encodeURIComponent(search)}`);
    const data = (await response.json()) as Result[] | { message?: string };
    if (Array.isArray(data)) {
      setResults(data);
      setMessage(data.length ? "" : "No matching postcode or suburb.");
    } else {
      setResults([]);
      setMessage(data.message || "Search failed.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-sg-navy">Postcode Checker</h1>
      <p className="mt-3 text-sg-dark-gray">Check whether a suburb or postcode is treated as regional.</p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="flex-1 rounded border px-3 py-2"
          placeholder="Suburb or postcode"
          required
        />
        <button type="submit" className="rounded bg-sg-light-blue px-4 py-2 font-semibold text-white">
          Check
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-gray-600">{message}</p> : null}
      <ul className="mt-6 space-y-3">
        {results.map((item) => (
          <li key={`${item.suburb}-${item.postcode}`} className="rounded border bg-white p-4">
            <p className="font-semibold">
              {item.suburb} {item.postcode} {item.state}
            </p>
            <p className="text-sm text-gray-600">
              {item.category} {item.regional ? "· Regional" : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
