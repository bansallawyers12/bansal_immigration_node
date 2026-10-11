"use client";

import { useMemo, useState } from "react";

const agePoints = [
  [18, 24, 25],
  [25, 32, 30],
  [33, 39, 25],
  [40, 44, 15],
] as const;

export function PrPointCalculator() {
  const [age, setAge] = useState(30);
  const [english, setEnglish] = useState(10);
  const [overseas, setOverseas] = useState(0);
  const [australian, setAustralian] = useState(0);
  const [education, setEducation] = useState(15);
  const [australianStudy, setAustralianStudy] = useState(0);
  const [specialist, setSpecialist] = useState(0);
  const [community, setCommunity] = useState(0);
  const [partner, setPartner] = useState(10);
  const [nomination, setNomination] = useState(0);
  const [professionalYear, setProfessionalYear] = useState(0);

  const ageScore = useMemo(() => {
    const band = agePoints.find(([min, max]) => age >= min && age <= max);
    return band ? band[2] : 0;
  }, [age]);

  const total =
    ageScore +
    english +
    overseas +
    australian +
    education +
    australianStudy +
    specialist +
    community +
    partner +
    nomination +
    professionalYear;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-sg-navy">PR Points Calculator</h1>
      <p className="mt-3 text-sg-dark-gray">
        Estimate points for skilled migration. This uses the same point bands published on the current site.
      </p>
      <form className="mt-8 space-y-4">
        <Field label="Age" value={age} onChange={setAge} />
        <Select label="English" value={english} onChange={setEnglish} options={[[0, "Competent (0)"], [10, "Proficient (10)"], [20, "Superior (20)"]]} />
        <Select label="Overseas skilled employment" value={overseas} onChange={setOverseas} options={[[0, "Less than 3 years (0)"], [5, "3–4 years (5)"], [10, "5–7 years (10)"], [15, "8+ years (15)"]]} />
        <Select label="Australian skilled employment" value={australian} onChange={setAustralian} options={[[0, "Less than 1 year (0)"], [5, "1–2 years (5)"], [10, "3–4 years (10)"], [15, "5–7 years (15)"], [20, "8+ years (20)"]]} />
        <Select label="Education" value={education} onChange={setEducation} options={[[10, "Diploma / trade (10)"], [15, "Bachelor / masters (15)"], [20, "Doctorate (20)"]]} />
        <Select label="Australian study" value={australianStudy} onChange={setAustralianStudy} options={[[0, "No (0)"], [5, "Yes (5)"]]} />
        <Select label="Specialist education" value={specialist} onChange={setSpecialist} options={[[0, "No (0)"], [10, "Yes (10)"]]} />
        <Select label="Regional study" value={community} onChange={setCommunity} options={[[0, "No (0)"], [5, "Yes (5)"]]} />
        <Select label="Partner skills" value={partner} onChange={setPartner} options={[[10, "Single / partner is citizen (10)"], [10, "Partner with skills (10)"], [5, "Partner with competent English (5)"], [0, "Partner without points (0)"]]} />
        <Select label="Nomination" value={nomination} onChange={setNomination} options={[[0, "None (0)"], [5, "State nomination 190 (5)"], [15, "Regional nomination 491 (15)"]]} />
        <Select label="Professional year" value={professionalYear} onChange={setProfessionalYear} options={[[0, "No (0)"], [5, "Yes (5)"]]} />
      </form>
      <p className="mt-8 text-2xl font-bold text-sg-navy">Total points: {total}</p>
      <p className="mt-2 text-sm text-gray-600">Age points for the selected age: {ageScore}.</p>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-sm font-medium text-sg-navy">
      {label}
      <input
        type="number"
        min={18}
        max={70}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded border px-3 py-2"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  options: [number, string][];
}) {
  return (
    <label className="block text-sm font-medium text-sg-navy">
      {label}
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 w-full rounded border px-3 py-2">
        {options.map(([points, name]) => (
          <option key={name} value={points}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
