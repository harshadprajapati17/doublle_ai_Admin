import { referralDecisionApiPath } from "@/lib/referrals/constants";
import { defaultRejectNote } from "@/lib/referrals/reject-note";
import type { Referral, ReferralFraud } from "@/lib/referrals/types";
import type { ApiErrorBody } from "@/lib/programs/types";

export type ReferralRejectResult =
  | { ok: true }
  | { ok: false; message: string };

export async function rejectReferral(
  referral: Pick<Referral, "id" | "fraud">,
  options?: { note?: string },
): Promise<ReferralRejectResult> {
  const note = options?.note ?? defaultRejectNote(referral.fraud);

  const response = await fetch(referralDecisionApiPath(referral.id), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ decision: "REJECT", note }),
  });

  const payload = (await response.json().catch(() => ({}))) as ApiErrorBody;

  if (!response.ok) {
    return {
      ok: false,
      message: payload.error?.message ?? "Could not reject referral.",
    };
  }

  return { ok: true };
}

export function canRejectReferral(referral: Pick<Referral, "status">) {
  return referral.status === "ACTIVE";
}

export function rejectNotePreview(fraud: ReferralFraud) {
  return defaultRejectNote(fraud);
}
