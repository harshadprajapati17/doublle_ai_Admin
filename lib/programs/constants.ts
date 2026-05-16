import type { AttributionRule, CapBehavior } from "@/lib/programs/types";

export const CURRENCY_OPTIONS = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "CHF",
  "JPY",
  "INR",
  "SGD",
  "NZD",
  "SEK",
  "NOK",
  "DKK",
  "MXN",
  "BRL",
  "ZAR",
] as const;

export const ATTRIBUTION_RULE_OPTIONS: {
  value: AttributionRule;
  label: string;
  description: string;
}[] = [
  {
    value: "FIRST_TOUCH",
    label: "First touch",
    description: "First referrer link wins",
  },
  {
    value: "FIRST_TOUCH_CODE_OVERRIDE",
    label: "First touch, code wins at signup",
    description:
      "Link sets cookie; manual code at signup overrides (recommended)",
  },
  {
    value: "LAST_TOUCH",
    label: "Last touch",
    description: "Most recent referral before signup wins",
  },
];

export const CAP_BEHAVIOR_OPTIONS: {
  value: CapBehavior;
  label: string;
  description: string;
}[] = [
  {
    value: "ROLL_FORWARD",
    label: "Roll forward",
    description:
      "Extra commission is held and paid when capacity opens next month",
  },
  {
    value: "HARD_STOP",
    label: "Hard stop",
    description: "Extra commission above the cap is forfeited",
  },
];

export const REFEREE_BENEFIT_OPTIONS = [
  { value: "NONE" as const, label: "None" },
  { value: "TRIAL_EXTENSION" as const, label: "Trial extension" },
  { value: "CREDIT" as const, label: "Account credit" },
];
