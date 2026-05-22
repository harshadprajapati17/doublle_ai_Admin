import type { DefaultValues } from "react-hook-form";
import type { CreateProgramFormValues } from "@/lib/programs/schema";
import { getProgramTerms } from "@/lib/programs/parse-program";
import type { Program, ProgramDetail } from "@/lib/programs/types";

function toFormNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 100;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : 100;
}

export function programToFormValues(
  program: Program | ProgramDetail,
): CreateProgramFormValues {
  const terms =
    "versions" in program && program.versions?.length
      ? getProgramTerms(program)
      : program;

  return {
    name: program.name,
    referrerRewardPct: Number(terms.referrerRewardPct),
    referrerRewardDurationMonths: terms.referrerRewardDurationMonths,
    holdPeriodDays: terms.holdPeriodDays,
    refereeBenefitType: "CREDIT",
    refereeBenefitValue: toFormNumber(terms.refereeBenefitValue),
  };
}

export const RECOMMENDED_DEFAULTS: CreateProgramFormValues = {
  name: "Standard Referral",
  referrerRewardPct: 5,
  referrerRewardDurationMonths: 12,
  holdPeriodDays: 30,
  refereeBenefitType: "CREDIT",
  refereeBenefitValue: 100,
};

export const FORM_DEFAULT_VALUES: DefaultValues<CreateProgramFormValues> = {
  name: "",
  referrerRewardPct: undefined,
  referrerRewardDurationMonths: undefined,
  holdPeriodDays: undefined,
  refereeBenefitType: "CREDIT",
  refereeBenefitValue: undefined,
};
