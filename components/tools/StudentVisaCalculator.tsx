"use client";

import { useMemo, useState } from "react";
import { calculateStudentVisaFunds, studentCalculatorLists } from "@/lib/student-calculator";

function aud(value: number): string {
  return value.toLocaleString("en-AU");
}

export function StudentVisaCalculator() {
  const lists = studentCalculatorLists();
  const [courseDuration, setCourseDuration] = useState(13);
  const [tuition, setTuition] = useState(30000);
  const [partner, setPartner] = useState(0);
  const [children, setChildren] = useState(0);
  const [schoolChildren, setSchoolChildren] = useState(0);
  const [travel, setTravel] = useState(2000);

  const result = useMemo(
    () =>
      calculateStudentVisaFunds({
        course_duration: courseDuration,
        annual_tuition_fee: tuition,
        partner_spouse: partner,
        dependent_children: children,
        school_age_children: schoolChildren,
        travel_expenses: travel,
      }),
    [courseDuration, tuition, partner, children, schoolChildren, travel],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-sg-navy">Student Visa Financial Calculator</h1>
      <p className="mt-3 text-sg-dark-gray">
        Uses LIN 19/198 living costs and the same pro-rata rules as the Laravel CRM calculator (example: 1 year course,
        partner, one child, $30,000 tuition, $2,000 travel).
      </p>
      <form className="mt-8 space-y-4">
        <label className="block text-sm font-medium">
          Course duration
          <select
            value={courseDuration}
            onChange={(event) => setCourseDuration(Number(event.target.value))}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            {lists.course_duration.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Annual tuition (AUD)
          <input
            type="number"
            min={0}
            value={tuition}
            onChange={(event) => setTuition(Number(event.target.value))}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <Select
          label="Partner"
          value={partner}
          onChange={setPartner}
          options={lists.partner_spouse_options.map((item) => [item.value, item.label])}
        />
        <Select
          label="Dependent children"
          value={children}
          onChange={setChildren}
          options={lists.dependent_children_options.map((item) => [item.value, item.label])}
        />
        <Select
          label="School-age children"
          value={schoolChildren}
          onChange={setSchoolChildren}
          options={lists.school_age_children_options.map((item) => [item.value, item.label])}
        />
        <label className="block text-sm font-medium">
          Travel (AUD)
          <input
            type="number"
            min={0}
            value={travel}
            onChange={(event) => setTravel(Number(event.target.value))}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
      </form>
      <p className="mt-8 text-2xl font-bold text-sg-navy">
        Estimated funds: ${aud(result.total_financial_capacity_required)} AUD
      </p>
      <p className="mt-2 text-sm text-gray-600">
        Calculation period: {result.calculation_period_months} months (course preset id {courseDuration}).
      </p>
    </div>
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
    <label className="block text-sm font-medium">
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
