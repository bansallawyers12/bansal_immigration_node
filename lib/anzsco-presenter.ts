import { text } from "@/lib/parse";

const VISA_ROWS = [
  { key: "eligible_189", visa_type: "189", visa_name: "Skilled Independent", permanent_visa: true, dha_path: "/skilled-189/skilled-independent" },
  { key: "eligible_190", visa_type: "190", visa_name: "Skilled Nominated", permanent_visa: true, dha_path: "/skilled-190" },
  { key: "eligible_491", visa_type: "491", visa_name: "Skilled Work Regional", permanent_visa: false, dha_path: "/skilled-491" },
  { key: "eligible_491_fs", visa_type: "491", visa_name: "Family Sponsored", permanent_visa: false, dha_path: "/skilled-491" },
  { key: "eligible_485", visa_type: "485", visa_name: "Graduate: Post-Vocational", permanent_visa: false, dha_path: "/temporary-485" },
  { key: "eligible_482", visa_type: "482", visa_name: "SID: Core Skills", permanent_visa: false, dha_path: "/skilled-482" },
  { key: "eligible_482_special", visa_type: "482", visa_name: "SID: Specialist Skills", permanent_visa: false, dha_path: "/skilled-482" },
  { key: "eligible_186", visa_type: "186", visa_name: "ENS: Direct Entry", permanent_visa: true, dha_path: "/employer-sponsored-186" },
  { key: "eligible_186_trt", visa_type: "186", visa_name: "ENS: TRT", permanent_visa: true, dha_path: "/employer-sponsored-186" },
  { key: "eligible_407", visa_type: "407", visa_name: "Training: Enhance Skills", permanent_visa: false, dha_path: "/training-407" },
  { key: "eligible_494", visa_type: "494", visa_name: "SESR: Employer Sponsored", permanent_visa: false, dha_path: "/skilled-employer-sponsored-regional-494" },
  { key: "eligible_dama", visa_type: "DAMA", visa_name: "Labour Agreement", permanent_visa: false, dha_path: "/labour-agreement" },
] as const;

function listColumns(row: Record<string, unknown>) {
  const ll = text(row.list_label).toUpperCase();
  return {
    MLTSSL: ll === "MLTSSL",
    STSOL: ll === "STSOL",
    ROL: ll === "ROL",
    CSOL: Boolean(row.is_csol) || ll === "CSOL",
  };
}

function effectiveEligibility(row: Record<string, unknown>, fieldKey: string): boolean {
  if (row[fieldKey]) return true;
  const f = listColumns(row);
  switch (fieldKey) {
    case "eligible_189":
      return f.MLTSSL;
    case "eligible_190":
      return f.MLTSSL || f.STSOL;
    case "eligible_491":
    case "eligible_491_fs":
      return f.MLTSSL || f.STSOL || f.ROL;
    case "eligible_482":
    case "eligible_482_special":
      return f.CSOL;
    case "eligible_186":
    case "eligible_186_trt":
      return f.MLTSSL || f.STSOL;
    case "eligible_485":
      return f.MLTSSL || f.STSOL;
    case "eligible_407":
    case "eligible_494":
      return f.MLTSSL || f.STSOL || f.ROL;
    default:
      return false;
  }
}

export function visaOptions(row: Record<string, unknown>) {
  const lists = listColumns(row);
  const out: Record<string, unknown> = {};
  for (const visa of VISA_ROWS) {
    out[visa.key] = {
      visa_type: visa.visa_type,
      visa_name: visa.visa_name,
      eligibility: effectiveEligibility(row, visa.key),
      MLTSSL: lists.MLTSSL,
      STSOL: lists.STSOL,
      ROL: lists.ROL,
      CSOL: lists.CSOL,
      permanent_visa: visa.permanent_visa,
      dha_path: visa.dha_path,
    };
  }
  return out;
}

export function occupationSearchPayload(row: Record<string, unknown>) {
  return {
    anzsco_code: text(row.anzsco_code),
    occupation_title: text(row.occupation_title),
    list_label: row.list_label == null ? null : text(row.list_label),
    assessing_authority: row.assessing_authority == null ? null : text(row.assessing_authority),
    skill_level: row.skill_level == null ? null : text(row.skill_level),
    is_csol: Boolean(row.is_csol),
    visa_options: visaOptions(row),
  };
}

export function occupationFinderMinimalItem(row: Record<string, unknown>) {
  return {
    anzsco_code: text(row.anzsco_code),
    occupation_title: text(row.occupation_title),
  };
}
