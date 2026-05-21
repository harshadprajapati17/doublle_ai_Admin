import type { ApiErrorBody } from "@/lib/programs/types";

export type ReferralUser = {
  userId: string;
  email: string | null;
  name: string | null;
};

export type ReferralFraud = {
  status: string;
  flagged: boolean;
  signalCount: number;
  maxScore: string | null;
  types: string[];
};

export type ReferralPayment = {
  hasPaid: boolean;
  capturedPaymentCount: number;
  firstPaidAt: string | null;
  totalPaidAmount: string;
  currency: string;
};

export type Referral = {
  id: string;
  refereeUserId: string;
  referrerUserId: string;
  referrer: ReferralUser;
  referee: ReferralUser;
  payment: ReferralPayment;
  fraud: ReferralFraud;
  programId: string;
  code: string;
  status: string;
  attributionSource: string;
  programVersionAtAttribution: number;
  cookieData: unknown;
  ip: string | null;
  userAgent: string | null;
  terminatedAt: string | null;
  terminationReason: string | null;
  refereeCreditApplied: boolean;
  refereeCreditAppliedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReferralListMeta = {
  nextCursor?: string | null;
};

export type ReferralListResponse = {
  data?: Referral[];
  meta?: ReferralListMeta;
} & ApiErrorBody;
