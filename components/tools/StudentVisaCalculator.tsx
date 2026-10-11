"use client";

import { useMemo, useState } from "react";

const living = {
  student: 29710,
  partner: 10394,
  child: 4449,
} as const;

function aud(value: number): string {
  return value.toLocaleString("en-AU");
}

export function StudentVisaCalculator() {
  const [partner, setPartner] = useState(false);
  const [children, setChildren] = useState(0);
  const [travel, setTravel] = useState(2000);
  const [tuition, setTuition] = useState(20000);

  const funds = useMemo(() => {
    const dependants = (partner ? living.partner : 0) + children * living.child;
    return living.student + dependants + travel + tuition;
  }, [partner, children, travel, tuition]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-sg-navy">Student Visa Financial Calculator</h1>
      <p className="mt-3 text-sg-dark-gray">
        Estimate funds using the published 12-month living cost: applicant ${aud(living.student)}, partner $
        {aud(living.partner)}, each child ${aud(living.child)}, plus travel and tuition you enter.
      </p>
      <form className="mt-8 space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={partner} onChange={(event) => setPartner(event.target.checked)} />
          Include a partner
        </label>
        <label className="block text-sm font-medium">
          School-age children
          <input
            type="number"
            min={0}
            value={children}
            onChange={(event) => setChildren(Number(event.target.value))}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
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
        <label className="block text-sm font-medium">
          First year tuition (AUD)
          <input
            type="number"
            min={0}
            value={tuition}
            onChange={(event) => setTuition(Number(event.target.value))}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
      </form>
      <p className="mt-8 text-2xl font-bold text-sg-navy">Estimated funds: ${aud(funds)} AUD</p>
    </div>
  );
}
