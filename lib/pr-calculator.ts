export const prPointCalculatorLists = {
  age: [
    { label: "Under 18 years (0 points)", value: 0 },
    { label: "18-24 years (25 points)", value: 25 },
    { label: "25-32 years (30 points)", value: 30 },
    { label: "33-39 years (25 points)", value: 25 },
    { label: "40-44 years (15 points)", value: 15 },
    { label: "45 years and over (0 points)", value: 0 },
  ],
  english_language_proficiency: [
    { label: "Competent English (0 points)", value: 0 },
    { label: "Proficient English (10 points)", value: 10 },
    { label: "Superior English (20 points)", value: 20 },
  ],
  educational_qualifications: [
    { label: "Diploma or trade qualification (10 points)", value: 10 },
    { label: "Bachelor degree (15 points)", value: 15 },
    { label: "Master's degree (15 points)", value: 15 },
    { label: "Doctorate/PhD (20 points)", value: 20 },
  ],
  skilled_employment_overseas: [
    { label: "Less than 3 years (0 points)", value: 0 },
    { label: "3-4 years (5 points)", value: 5 },
    { label: "5-7 years (10 points)", value: 10 },
    { label: "8+ years (15 points)", value: 15 },
  ],
  skilled_employment_australia: [
    { label: "Less than 1 year (0 points)", value: 0 },
    { label: "1-2 years (5 points)", value: 5 },
    { label: "3-4 years (10 points)", value: 10 },
    { label: "5-7 years (15 points)", value: 15 },
    { label: "8+ years (20 points)", value: 20 },
  ],
  additional_points: [
    { label: "Australian study requirement (5 points)", value: 5 },
    {
      label: "Specialist Education Qualification (10 points)",
      value: 10,
      description: "Master's by research or PhD from Australian institution in STEMM field",
    },
    { label: "Credentialed Community Language (5 points)", value: 5 },
    { label: "Professional Year in Australia (5 points)", value: 5 },
    { label: "Regional study (5 points)", value: 5 },
  ],
  partner_spouse_status: [
    { label: "Single applicant (10 points)", value: 10 },
    {
      label: "Partner with relevant skills & competent English (10 points)",
      value: 10,
      note: "Partner skills require positive skills assessment and competent English",
    },
    {
      label: "Partner with competent English only (5 points)",
      value: 5,
      note: "Partner skills require positive skills assessment and competent English",
    },
    { label: "Partner is Australian citizen or PR holder (10 points)", value: 10 },
  ],
  visa_options: [
    { name: "Subclass 189 (Independent)", code: "189", minimum_points: 65, description: "Minimum 65 points required" },
    {
      name: "Subclass 190 (State Nominated)",
      code: "190",
      minimum_points: 65,
      description: "Minimum 65 points + state nomination",
      additional_points: 5,
      additional_points_note: "State/Territory nomination adds 5 points to your base score",
    },
    {
      name: "Subclass 491 (Regional)",
      code: "491",
      minimum_points: 65,
      description: "Minimum 65 points + regional nomination",
      additional_points: 15,
      additional_points_note: "Regional nominations add 15 points to your base score",
    },
  ],
  important_notes: [
    "This calculator is for indicative purposes only and is based on the official points table.",
    "Having 65 points does not guarantee an invitation. Actual invitation rounds depend on various factors including your occupation and demand.",
    "For the most accurate and up-to-date information, please refer to the official Department of Home Affairs points table.",
    "State/Territory nomination (190) adds 5 points, and regional nominations (491) add 15 points to your base score.",
  ],
};

export type PrPointInput = {
  age: number;
  english_language_proficiency: number;
  educational_qualifications: number;
  skilled_employment_overseas: number;
  skilled_employment_australia: number;
  additional_points?: number[];
  partner_spouse_status: number;
};

export function calculatePrPoints(validated: PrPointInput) {
  const basePoints =
    validated.age +
    validated.english_language_proficiency +
    validated.educational_qualifications +
    validated.skilled_employment_overseas +
    validated.skilled_employment_australia +
    validated.partner_spouse_status;

  const additionalPointsTotal = Array.isArray(validated.additional_points)
    ? validated.additional_points.reduce((sum, n) => sum + n, 0)
    : 0;
  const totalPoints = basePoints + additionalPointsTotal;

  const visaOptions = [
    {
      name: "Subclass 189 (Independent)",
      code: "189",
      minimum_points: 65,
      description: "Minimum 65 points required",
      eligible: totalPoints >= 65,
      points_with_nomination: null,
      eligible_with_nomination: null,
    },
    {
      name: "Subclass 190 (State Nominated)",
      code: "190",
      minimum_points: 65,
      description: "Minimum 65 points + state nomination",
      additional_points: 5,
      additional_points_note: "State/Territory nomination adds 5 points to your base score",
      eligible: totalPoints >= 65,
      points_with_nomination: totalPoints + 5,
      eligible_with_nomination: totalPoints + 5 >= 65,
    },
    {
      name: "Subclass 491 (Regional)",
      code: "491",
      minimum_points: 65,
      description: "Minimum 65 points + regional nomination",
      additional_points: 15,
      additional_points_note: "Regional nominations add 15 points to your base score",
      eligible: totalPoints >= 65,
      points_with_nomination: totalPoints + 15,
      eligible_with_nomination: totalPoints + 15 >= 65,
    },
  ];

  return {
    total_points: totalPoints,
    base_points: basePoints,
    additional_points: additionalPointsTotal,
    points_breakdown: {
      age: { label: "Age", points: validated.age },
      english_language_proficiency: {
        label: "English Language Proficiency",
        points: validated.english_language_proficiency,
      },
      educational_qualifications: {
        label: "Educational Qualifications",
        points: validated.educational_qualifications,
      },
      skilled_employment_overseas: {
        label: "Skilled Employment Experience (Overseas)",
        points: validated.skilled_employment_overseas,
      },
      skilled_employment_australia: {
        label: "Skilled Employment Experience (Australia)",
        points: validated.skilled_employment_australia,
      },
      partner_spouse_status: { label: "Partner/Spouse Status", points: validated.partner_spouse_status },
      additional_points: {
        label: "Additional Points",
        points: additionalPointsTotal,
        details: validated.additional_points ?? [],
      },
    },
    visa_options: visaOptions,
    message:
      totalPoints >= 65
        ? "Congratulations! You meet the minimum points requirement for skilled migration visas."
        : `You currently have ${totalPoints} points. You need at least 65 points to be eligible for skilled migration visas.`,
    important_notes: prPointCalculatorLists.important_notes,
  };
}
