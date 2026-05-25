import type { ReferralFraud } from "@/lib/referrals/types";

/** Default rejection note from fraud signals shown in the Flagged column. */
export function defaultRejectNote(fraud: ReferralFraud): string {
  if (fraud.types.length > 0) {
    return `Fraud review — ${fraud.types.join(", ")}`;
  }
  if (fraud.status !== "NONE") {
    return `Fraud review — ${fraud.status}`;
  }
  return "Fraud review";
}
