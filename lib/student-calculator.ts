export function studentCalculatorPresetIdToYears(presetId: number): number {
  if (presetId <= 11) return presetId / 12;
  return presetId - 11;
}

export function studentCalculatorLists() {
  const courseDuration: { label: string; id: number }[] = [];
  for (let m = 1; m <= 11; m++) {
    courseDuration.push({ label: m === 1 ? "1 month" : `${m} months`, id: m });
  }
  for (let y = 1; y <= 25; y++) {
    courseDuration.push({ label: y === 1 ? "1 year" : `${y} years`, id: 11 + y });
  }

  return {
    course_duration: courseDuration,
    partner_spouse_options: [
      { label: "No partner", value: 0 },
      { label: "1 partner (AUD $10,394/year)", value: 1 },
    ],
    dependent_children_options: [
      { label: "No children", value: 0 },
      { label: "1 child (AUD $4,449/year living cost)", value: 1 },
      { label: "2 children", value: 2 },
      { label: "3 children", value: 3 },
      { label: "4 children", value: 4 },
      { label: "5+ children", value: 5 },
    ],
    school_age_children_options: [
      { label: "No school-age children", value: 0 },
      { label: "1 child (AUD $13,502/year)", value: 1 },
      { label: "2 children", value: 2 },
      { label: "3 children", value: 3 },
      { label: "4 children", value: 4 },
      { label: "5+ children", value: 5 },
    ],
    fixed_rates: {
      annual_living_cost_primary_student: 29710,
      partner_annual_cost: 10394,
      child_annual_living_cost: 4449,
      school_fees_per_child_per_year: 13502,
    },
    income_evidence_requirements: {
      without_dependants: 87856,
      with_dependants: 102500,
      note:
        "Income must be from official government documentation of your parent/spouse/de facto partner",
    },
    important_notes: [
      "Living costs: 12 months maximum (or pro-rata if course is shorter)",
      "Tuition fees: Up to 12 months or remainder of course (whichever is less)",
      "OSHC: Mandatory for entire visa duration but NOT included in financial capacity calculation (typically prepaid separately)",
      "Buffer: Consider adding 10-20% extra for unexpected expenses",
      "Travel: Return airfare for all applicants and dependents",
      "School fees: AUD $13,502/year per school-age child (may be waived for some government schools)",
      "Alternative option: Instead of showing funds, you can use income evidence (parent/spouse/de facto): AUD $87,856 (no dependants) or AUD $102,500 (with dependants)",
    ],
    reference: "Based on Migration Instrument LIN 19/198 (Updated May 2024)",
  };
}

export type StudentCalcInput = {
  course_duration: number;
  annual_tuition_fee: number;
  partner_spouse: number;
  dependent_children: number;
  school_age_children: number;
  travel_expenses: number;
};

export function calculateStudentVisaFunds(validated: StudentCalcInput) {
  const courseDurationPresetId = validated.course_duration;
  const durationYears = studentCalculatorPresetIdToYears(courseDurationPresetId);

  const annualLivingCost = 29710;
  const partnerAnnualCost = 10394;
  const childAnnualCost = 4449;
  const schoolFeesPerChild = 13502;

  const monthsForCalculation = Math.min(12, durationYears * 12);
  const monthsDecimal = monthsForCalculation / 12;

  const tuitionFees = Math.min(
    validated.annual_tuition_fee * monthsDecimal,
    validated.annual_tuition_fee * durationYears,
  );

  const primaryStudentLiving = annualLivingCost * monthsDecimal;
  const partnerLiving = validated.partner_spouse > 0 ? partnerAnnualCost * monthsDecimal : 0;
  const childrenLiving = validated.dependent_children * childAnnualCost * monthsDecimal;
  const totalLivingExpenses = primaryStudentLiving + partnerLiving + childrenLiving;
  const schoolFees = validated.school_age_children * schoolFeesPerChild * monthsDecimal;
  const totalFinancialCapacity =
    tuitionFees + totalLivingExpenses + schoolFees + validated.travel_expenses;

  const hasDependants = validated.partner_spouse > 0 || validated.dependent_children > 0;
  const incomeEvidenceRequired = hasDependants ? 102500 : 87856;

  const lists = studentCalculatorLists();

  return {
    calculation_period_months: monthsForCalculation,
    course_duration_preset_id: courseDurationPresetId,
    course_duration_years: durationYears,
    breakdown: {
      tuition_fees: {
        label: "Total Tuition Fees",
        amount: Math.round(tuitionFees * 100) / 100,
        note: "Up to 12 months or remainder of course (whichever is less)",
      },
      living_expenses: {
        label: "Living Expenses",
        amount: Math.round(totalLivingExpenses * 100) / 100,
        breakdown: {
          primary_student: Math.round(primaryStudentLiving * 100) / 100,
          partner: Math.round(partnerLiving * 100) / 100,
          children: Math.round(childrenLiving * 100) / 100,
          additional_accommodation: 0,
        },
        note: "12 months maximum (or pro-rata if course is shorter)",
      },
      school_fees: {
        label: "School Fees",
        amount: Math.round(schoolFees * 100) / 100,
        note: "AUD $13,502/year per school-age child (may be waived for some government schools)",
      },
      travel_expenses: {
        label: "Travel Expenses",
        amount: validated.travel_expenses,
        note: "Return airfare for all applicants and dependents",
      },
    },
    total_financial_capacity_required: Math.round(totalFinancialCapacity * 100) / 100,
    oshc: {
      label: "Overseas Student Health Cover (OSHC)",
      annual_cost: 0,
      total_cost: 0,
      note:
        "Mandatory for entire visa duration but NOT included in financial capacity calculation (typically prepaid separately). This endpoint does not accept OSHC premiums; arrange cover directly with insurers.",
      coverage_type: null,
    },
    income_evidence_alternative: {
      has_dependants: hasDependants,
      required_annual_income: incomeEvidenceRequired,
      note:
        "Instead of showing funds, you can provide evidence that your parent/spouse/de facto partner earned sufficient income in the 12 months before application. Income must be from official government documentation.",
    },
    important_notes: lists.important_notes,
    reference: lists.reference,
  };
}
