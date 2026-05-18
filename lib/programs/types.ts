export type AttributionRule =
  | "FIRST_TOUCH"
  | "FIRST_TOUCH_CODE_OVERRIDE"
  | "LAST_TOUCH";

export type RefereeBenefitType = "NONE" | "TRIAL_EXTENSION" | "CREDIT";

export type CapBehavior = "ROLL_FORWARD" | "HARD_STOP";

export type ProgramStatus = "DRAFT" | "ACTIVE" | "ARCHIVED" | string;

export type Program = {
  id: string;
  name: string;
  status: ProgramStatus;
  termsVersion: string;
  currency: string;
  referrerRewardPct: number;
  referrerRewardDurationMonths: number;
  cookieDays: number;
  attributionRule: AttributionRule;
  refereeBenefitType: RefereeBenefitType;
  refereeBenefitValue: number | null;
  refereeBenefitTrialDays: number | null;
  holdPeriodDays: number;
  monthlyCap: number | null;
  lifetimeCap: number | null;
  capBehavior: CapBehavior;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProgramInput = {
  name: string;
  referrerRewardPct: number;
  referrerRewardDurationMonths: number;
  cookieDays: number;
  attributionRule: AttributionRule;
  refereeBenefitType?: RefereeBenefitType;
  refereeBenefitValue: number | null;
  refereeBenefitTrialDays?: number | null;
  holdPeriodDays: number;
  monthlyCap?: number | null;
  lifetimeCap?: number | null;
  capBehavior: CapBehavior;
  currency?: string;
  termsVersion: string;
};

export type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export type ProgramListMeta = {
  nextCursor?: string | null;
};

export type ProgramListResponse = {
  data?: Program[];
  meta?: ProgramListMeta;
} & ApiErrorBody;
