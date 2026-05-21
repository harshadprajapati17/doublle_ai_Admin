"use client";

import { CopyField } from "@/components/referrals/copy-field";

type ReferralLinkCopyProps = {
  url: string;
  label?: string;
};

export function ReferralLinkCopy({
  url,
  label = "Referral link",
}: ReferralLinkCopyProps) {
  return <CopyField label={label} value={url} />;
}
