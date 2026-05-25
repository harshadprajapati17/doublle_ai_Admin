import type { Referral, ReferralPayment } from "@/lib/referrals/types";

export type ReferralLifecycleStage = "signup" | "paid";

export function referralLifecycleStage(
  payment: ReferralPayment,
): ReferralLifecycleStage {
  if (
    payment.hasPaid ||
    payment.capturedPaymentCount > 0 ||
    Number.parseFloat(payment.totalPaidAmount) > 0
  ) {
    return "paid";
  }
  return "signup";
}

export function referralLifecycleLabel(stage: ReferralLifecycleStage) {
  return stage === "paid" ? "Paid" : "Signup";
}

export function referralHasRecordedPayout(referral: Referral) {
  return referralLifecycleStage(referral.payment) === "paid";
}
