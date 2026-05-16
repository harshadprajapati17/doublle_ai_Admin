import type { CreateProgramFormValues } from "@/lib/programs/schema";

export const RECOMMENDED_DEFAULTS: CreateProgramFormValues = {
  name: "Standard Referral",
  termsVersion: "v1",
  currency: "USD",
  referrerRewardPct: 5,
  referrerRewardDurationMonths: 12,
  holdPeriodDays: 30,
  cookieDays: 30,
  attributionRule: "FIRST_TOUCH_CODE_OVERRIDE",
  refereeBenefitType: "NONE",
  refereeBenefitValue: null,
  refereeBenefitTrialDays: null,
  monthlyCap: 5000,
  monthlyCapUnlimited: false,
  lifetimeCap: null,
  lifetimeCapUnlimited: true,
  capBehavior: "ROLL_FORWARD",
};

export const FORM_DEFAULT_VALUES: CreateProgramFormValues = {
  name: "",
  termsVersion: "",
  currency: "USD",
  referrerRewardPct: 5,
  referrerRewardDurationMonths: 12,
  holdPeriodDays: 30,
  cookieDays: 30,
  attributionRule: "FIRST_TOUCH_CODE_OVERRIDE",
  refereeBenefitType: "NONE",
  refereeBenefitValue: null,
  refereeBenefitTrialDays: null,
  monthlyCap: 5000,
  monthlyCapUnlimited: false,
  lifetimeCap: null,
  lifetimeCapUnlimited: true,
  capBehavior: "ROLL_FORWARD",
};
