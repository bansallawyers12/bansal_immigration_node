const MELBOURNE_TR_485 = [
  "temporary-residency",
  "temporary residency",
  "485-visa",
  "485 visa",
  "485",
];

const MELBOURNE_JRP_GSM = [
  "permanent-residency",
  "eoi-roi",
  "eoi_roi",
  "eoi roi",
  "eoi",
  "roi",
  "expression-of-interest",
  "expression_of_interest",
  "gsm-visas",
  "gsm_visas",
  "gsm-visa",
  "gsm",
  "pr",
  "gsm visas: 491, 190, 189, 191",
  "gsm visas: 491, 190, 189, 191 or eoi/roi",
  "jrp-skill-assessment",
  "jrp_skill_assessment",
  "jrp skill assessment",
];

export function crmSchedulingReference() {
  return {
    melbourne_family_citizenship: {
      location: "melbourne",
      enquiry_type: "pr_complex",
      calendar_label: "Employer Sponsored",
      description:
        "Melbourne family visas and citizenship use the Employer Sponsored calendar (enquiry_type pr_complex) for free and paid slots.",
      service_type_slugs: [
        { slug: "family-visas", description: "Family visas (Partner, Parent, Child)", maps_to_enquiry_type: "pr_complex" },
        { slug: "citizenship", description: "Citizenship", maps_to_enquiry_type: "pr_complex" },
      ],
      alias_slugs: [
        "partner-visa",
        "parent-visa",
        "child-visa",
        "partner-visas",
        "parent-visas",
        "child-visas",
        "australian-citizenship",
        "citizenship-test",
      ],
    },
    adelaide_family_citizenship: {
      location: "adelaide",
      enquiry_type: "ajay",
      calendar_label: "Ajay (family visas, citizenship, complex matters)",
      service_type_slugs: [
        { slug: "family-visas", description: "Family visas (Partner, Parent, Child)", maps_to_enquiry_type: "ajay" },
        { slug: "citizenship", description: "Citizenship", maps_to_enquiry_type: "ajay" },
      ],
      alias_slugs: [
        "partner-visa",
        "parent-visa",
        "child-visa",
        "partner-visas",
        "parent-visas",
        "child-visas",
        "australian-citizenship",
        "citizenship-test",
      ],
      free_and_paid: {
        calendar_uses_is_paid: true,
        scheduling_endpoints: [
          "Use optional JSON field is_paid (boolean). When present, it selects free vs paid calendar.",
          "If is_paid is omitted, paid vs free is inferred from specific_service (legacy).",
          "Adelaide uses separate calendar settings for education/tourist vs other enquiries (same office location); is_paid still selects free vs paid rows within that lane.",
        ],
      },
    },
    ajay_calendar: {
      location: "adelaide",
      enquiry_type: "ajay",
      calendar_label: "Ajay (family visas, citizenship, complex matters)",
      service_type_slugs: [
        { slug: "family-visas", description: "Family visas (Partner, Parent, Child)", maps_to_enquiry_type: "ajay" },
        { slug: "citizenship", description: "Citizenship", maps_to_enquiry_type: "ajay" },
      ],
      alias_slugs: [
        "partner-visa",
        "parent-visa",
        "child-visa",
        "partner-visas",
        "parent-visas",
        "child-visas",
        "australian-citizenship",
        "citizenship-test",
      ],
      free_and_paid: {
        calendar_uses_is_paid: true,
        scheduling_endpoints: [
          "Use optional JSON field is_paid (boolean). When present, it selects free vs paid calendar.",
          "If is_paid is omitted, paid vs free is inferred from specific_service (legacy).",
          "Adelaide uses separate calendar settings for education/tourist vs other enquiries (same office location); is_paid still selects free vs paid rows within that lane.",
        ],
      },
    },
    arun_calendar: {
      location: "melbourne",
      enquiry_type: "arun",
      calendar_label: "Arun",
      description:
        "Melbourne Arun calendar is CRM-only. Public booking cannot use Nature of Enquiry Arun. Free slots are 20 minutes; paid slots are 30 minutes (09:00–17:00).",
      service_type_slugs: [{ slug: "arun", description: "Arun", maps_to_enquiry_type: "arun" }],
      crm_only: true,
    },
    melbourne_punjabi_gsm_eoi: melbourneJrpFreeEmployerSponsoredPaid(),
    melbourne_gsm_eoi_jrp: melbourneJrpFreeEmployerSponsoredPaid(),
    melbourne_jrp_free_employer_sponsored_paid: melbourneJrpFreeEmployerSponsoredPaid(),
    melbourne_tr_485_tourist: {
      location: "melbourne",
      enquiry_type: "tourist",
      enquiry_type_when_free: "tourist",
      enquiry_type_when_paid: "tourist",
      calendar_label: "Vijay",
      calendar_label_when_free: "Vijay",
      calendar_label_when_paid: "Vijay",
      description:
        "Melbourne TR: 485 visa uses the Tourist (Vijay) calendar for free and paid slots. is_paid still selects tourist free vs paid timing rows.",
      service_type_slugs: [{ slug: "temporary-residency", description: "TR: 485 visa" }],
      alias_slugs: [...new Set(MELBOURNE_TR_485)],
    },
  };
}

function melbourneJrpFreeEmployerSponsoredPaid() {
  return {
    location: "melbourne",
    enquiry_type_when_free: "tr",
    enquiry_type_when_paid: "pr_complex",
    calendar_label_when_free: "TR (TR and JRP)",
    calendar_label_when_paid: "Employer Sponsored",
    description:
      "Melbourne GSM/EOI and JRP/Skill Assessment: free → tr (JRP free slots), paid → pr_complex (Employer Sponsored paid slots). Applies to all languages. TR 485 is not in this lane.",
    service_type_slugs: [
      { slug: "permanent-residency", description: "GSM Visas: 491, 190, 189, 191" },
      { slug: "eoi-roi", description: "EOI/ROI" },
      { slug: "jrp-skill-assessment", description: "JRP/Skill Assessment" },
    ],
    alias_slugs: [...new Set(MELBOURNE_JRP_GSM)],
  };
}
