import { z } from "zod";

const attributionRuleSchema = z.enum([
  "FIRST_TOUCH",
  "FIRST_TOUCH_CODE_OVERRIDE",
  "LAST_TOUCH",
]);

const refereeBenefitTypeSchema = z.enum([
  "NONE",
  "TRIAL_EXTENSION",
  "CREDIT",
]);

const capBehaviorSchema = z.enum(["ROLL_FORWARD", "HARD_STOP"]);

export const createProgramFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Program name is required")
      .max(255, "Program name must be at most 255 characters"),
    termsVersion: z
      .string()
      .trim()
      .min(1, "Terms version is required")
      .max(64, "Terms version must be at most 64 characters"),
    currency: z
      .string()
      .trim()
      .length(3, "Currency must be a 3-letter ISO 4217 code")
      .regex(/^[A-Za-z]{3}$/, "Currency must be a 3-letter code"),
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
    cookieDays: z
      .number({ error: "Cookie window is required" })
      .int("Must be a whole number")
      .min(1, "Must be at least 1 day")
      .max(365, "Must be at most 365 days"),
    attributionRule: attributionRuleSchema,
    refereeBenefitType: refereeBenefitTypeSchema,
    refereeBenefitValue: z.number().nullable(),
    refereeBenefitTrialDays: z.number().nullable(),
    monthlyCap: z.number().nullable(),
    monthlyCapUnlimited: z.boolean(),
    lifetimeCap: z.number().nullable(),
    lifetimeCapUnlimited: z.boolean(),
    capBehavior: capBehaviorSchema,
  })
  .superRefine((data, ctx) => {
    if (data.refereeBenefitType === "CREDIT") {
      if (
        data.refereeBenefitValue === null ||
        data.refereeBenefitValue === undefined ||
        data.refereeBenefitValue <= 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Credit amount must be greater than 0",
          path: ["refereeBenefitValue"],
        });
      }
    }

    if (data.refereeBenefitType === "TRIAL_EXTENSION") {
      if (
        data.refereeBenefitTrialDays === null ||
        data.refereeBenefitTrialDays === undefined
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Extra trial days are required",
          path: ["refereeBenefitTrialDays"],
        });
      } else if (
        !Number.isInteger(data.refereeBenefitTrialDays) ||
        data.refereeBenefitTrialDays < 1 ||
        data.refereeBenefitTrialDays > 365
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Trial days must be between 1 and 365",
          path: ["refereeBenefitTrialDays"],
        });
      }
    }

    if (!data.monthlyCapUnlimited) {
      if (data.monthlyCap === null || data.monthlyCap === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Monthly cap is required unless unlimited",
          path: ["monthlyCap"],
        });
      } else if (data.monthlyCap < 0) {
        ctx.addIssue({
          code: "custom",
          message: "Monthly cap must be 0 or greater",
          path: ["monthlyCap"],
        });
      }
    }

    if (!data.lifetimeCapUnlimited) {
      if (data.lifetimeCap === null || data.lifetimeCap === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Lifetime cap is required unless unlimited",
          path: ["lifetimeCap"],
        });
      } else if (data.lifetimeCap < 0) {
        ctx.addIssue({
          code: "custom",
          message: "Lifetime cap must be 0 or greater",
          path: ["lifetimeCap"],
        });
      }
    }
  });

export type CreateProgramFormValues = z.infer<typeof createProgramFormSchema>;

export function buildCreateProgramPayload(
  values: CreateProgramFormValues,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: values.name.trim(),
    termsVersion: values.termsVersion.trim(),
    currency: values.currency.trim().toUpperCase(),
    referrerRewardPct: values.referrerRewardPct,
    referrerRewardDurationMonths: values.referrerRewardDurationMonths,
    holdPeriodDays: values.holdPeriodDays,
    cookieDays: values.cookieDays,
    attributionRule: values.attributionRule,
    refereeBenefitType: values.refereeBenefitType,
    refereeBenefitValue:
      values.refereeBenefitType === "CREDIT"
        ? values.refereeBenefitValue
        : null,
    monthlyCap: values.monthlyCapUnlimited ? null : values.monthlyCap,
    lifetimeCap: values.lifetimeCapUnlimited ? null : values.lifetimeCap,
    capBehavior: values.capBehavior,
  };

  if (values.refereeBenefitType === "TRIAL_EXTENSION") {
    payload.refereeBenefitTrialDays = values.refereeBenefitTrialDays;
  }

  return payload;
}
