import { z } from "zod";

export const createProgramFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Program name is required")
    .max(255, "Program name must be at most 255 characters"),
  referrerRewardPct: z
    .number({ error: "Referrer reward is required" })
    .min(0, "Must be at least 0%")
    .max(100, "Must be at most 100%"),
  referrerRewardDurationMonths: z
    .number({ error: "Reward duration is required" })
    .int("Must be a whole number")
    .min(1, "Must be at least 1 month")
    .max(240, "Must be at most 240 months"),
  holdPeriodDays: z
    .number({ error: "Hold period is required" })
    .int("Must be a whole number")
    .min(0, "Must be at least 0 days")
    .max(365, "Must be at most 365 days"),
  refereeBenefitType: z.literal("CREDIT"),
  refereeBenefitValue: z
    .number({ error: "Product credit amount is required" })
    .int("Must be a whole number")
    .min(1, "Product credit must be greater than 0"),
});

export type CreateProgramFormValues = z.infer<typeof createProgramFormSchema>;

export type ProgramPayloadOptions = {
  activate?: boolean;
};

export function buildCreateProgramPayload(
  values: CreateProgramFormValues,
  options?: ProgramPayloadOptions,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: values.name.trim(),
    referrerRewardPct: values.referrerRewardPct,
    referrerRewardDurationMonths: values.referrerRewardDurationMonths,
    holdPeriodDays: values.holdPeriodDays,
    refereeBenefitType: "CREDIT",
    refereeBenefitValue: values.refereeBenefitValue,
  };

  if (options?.activate) {
    payload.activate = true;
  }

  return payload;
}

export const buildUpdateProgramPayload = buildCreateProgramPayload;
