import type { CreateProgramFormValues } from "@/lib/programs/schema";
import type { Program } from "@/lib/programs/types";

function toFormNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function programToFormValues(program: Program): CreateProgramFormValues {
  return {
    name: program.name,
    termsVersion: program.termsVersion,
    currency: program.currency,
    referrerRewardPct: Number(program.referrerRewardPct),
    referrerRewardDurationMonths: program.referrerRewardDurationMonths,
    holdPeriodDays: program.holdPeriodDays,
    cookieDays: program.cookieDays,
    attributionRule: program.attributionRule,
    refereeBenefitType: program.refereeBenefitType,
    refereeBenefitValue: toFormNumber(program.refereeBenefitValue),
    refereeBenefitTrialDays: program.refereeBenefitTrialDays,
    monthlyCap: toFormNumber(program.monthlyCap),
    monthlyCapUnlimited: program.monthlyCap === null,
    lifetimeCap: toFormNumber(program.lifetimeCap),
    lifetimeCapUnlimited: program.lifetimeCap === null,
    capBehavior: program.capBehavior,
  };
}

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
