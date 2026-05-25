export type RefereeBenefitType = "CREDIT";

export type ProgramStatus = "DRAFT" | "ACTIVE" | "ARCHIVED" | string;

export type CommissionState =
  | "PENDING"
  | "EARNED"
  | "PAID"
  | "CLAWED_BACK"
  | string;

export type CommissionStateSummary = {
  count: number;
  amount: number;
};

export type ReferralSummaryStatus = "ACTIVE" | "TERMINATED" | "FRAUD_REJECTED";

export type ReferralsByStatus = Partial<Record<ReferralSummaryStatus, number>>;

export type FraudReviewSummary = {
  flagged: number;
  rejected: number;
  terminated: number;
};

export type ProgramSummary = {
  totalReferrals: number;
  totalCommissions: number;
  termsAcceptancesCount?: number;
  currency: string;
  referralsByStatus?: ReferralsByStatus;
  fraudReview?: FraudReviewSummary;
  commissionsByState: Partial<
    Record<CommissionState, CommissionStateSummary>
  >;
};

/** Reward terms for a single program version. */
export type ProgramVersion = {
  version: number;
  termsVersion?: string;
  changeReason?: string;
  referrerRewardPct: number;
  referrerRewardDurationMonths: number;
  refereeBenefitType: RefereeBenefitType;
  refereeBenefitValue: number;
  holdPeriodDays: number;
  createdAt?: string;
  summary?: ProgramSummary;
};

export type Program = {
  id: string;
  name: string;
  status: ProgramStatus;
  referrerRewardPct: number;
  referrerRewardDurationMonths: number;
  refereeBenefitType: RefereeBenefitType;
  refereeBenefitValue: number;
  holdPeriodDays: number;
  termsVersion?: string;
  createdAt?: string;
  updatedAt?: string;
};

/** Full program payload from GET /api/v1/admin/programs/:id?include=versionStats */
export type ProgramDetail = Program & {
  currentVersion?: number;
  versions?: ProgramVersion[];
  summary?: ProgramSummary;
};

export type CreateProgramInput = {
  name: string;
  referrerRewardPct: number;
  referrerRewardDurationMonths: number;
  refereeBenefitType: RefereeBenefitType;
  refereeBenefitValue: number;
  holdPeriodDays: number;
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

export type ProgramDetailResponse = {
  data?: Record<string, unknown>;
} & ApiErrorBody;
