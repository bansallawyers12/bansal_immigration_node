"use client";

import { useMemo, useState } from "react";
import { calculatePrPoints, prPointCalculatorLists } from "@/lib/pr-calculator";

export function PrPointCalculator() {
  const lists = prPointCalculatorLists;
  const [age, setAge] = useState(30);
  const [english, setEnglish] = useState(10);
  const [overseas, setOverseas] = useState(0);
  const [australian, setAustralian] = useState(0);
  const [educationIndex, setEducationIndex] = useState(1);
  const [additionalIndexes, setAdditionalIndexes] = useState<number[]>([]);
  const [partnerIndex, setPartnerIndex] = useState(0);

  const agePoints = useMemo(() => {
    if (age < 18) return 0;
    if (age <= 24) return 25;
    if (age <= 32) return 30;
    if (age <= 39) return 25;
    if (age <= 44) return 15;
    return 0;
  }, [age]);

  const result = useMemo(
    () =>
      calculatePrPoints({
        age: agePoints,
        english_language_proficiency: english,
        educational_qualifications: lists.educational_qualifications[educationIndex].value,
        skilled_employment_overseas: overseas,
        skilled_employment_australia: australian,
        additional_points: additionalIndexes.map((index) => lists.additional_points[index].value),
        partner_spouse_status: lists.partner_spouse_status[partnerIndex].value,
      }),
    [
      agePoints,
      english,
      educationIndex,
      overseas,
      australian,
      additionalIndexes,
      partnerIndex,
      lists.additional_points,
      lists.educational_qualifications,
      lists.partner_spouse_status,
    ],
  );

  function toggleAdditional(index: number) {
    setAdditionalIndexes((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-sg-navy">PR Points Calculator</h1>
      <p className="mt-3 text-sg-dark-gray">
        Estimate skilled migration points using the same bands as the live site and CRM API.
      </p>
      <form className="mt-8 space-y-4">
        <Field label="Age" value={age} onChange={setAge} />
        <p className="text-sm text-gray-600">Age points: {agePoints}</p>
        <Select
          label="English"
          value={english}
          onChange={setEnglish}
          options={lists.english_language_proficiency.map((item) => [item.value, item.label])}
        />
        <Select
          label="Overseas skilled employment"
          value={overseas}
          onChange={setOverseas}
          options={lists.skilled_employment_overseas.map((item) => [item.value, item.label])}
        />
        <Select
          label="Australian skilled employment"
          value={australian}
          onChange={setAustralian}
          options={lists.skilled_employment_australia.map((item) => [item.value, item.label])}
        />
        <Select
          label="Education"
          value={educationIndex}
          onChange={setEducationIndex}
          options={lists.educational_qualifications.map((item, index) => [index, item.label])}
        />
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-sg-navy">Additional points (select all that apply)</legend>
          {lists.additional_points.map((item, index) => (
            <label key={item.label} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={additionalIndexes.includes(index)}
                onChange={() => toggleAdditional(index)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </fieldset>
        <Select
          label="Partner / spouse"
          value={partnerIndex}
          onChange={setPartnerIndex}
          options={lists.partner_spouse_status.map((item, index) => [index, item.label])}
        />
      </form>
      <p className="mt-8 text-2xl font-bold text-sg-navy">Total points: {result.total_points}</p>
      <p className="mt-2 text-sm text-gray-600">{result.message}</p>
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
