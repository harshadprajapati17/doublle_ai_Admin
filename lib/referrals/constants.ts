export function referralDecisionApiPath(referralId: string) {
  return `/api/admin/referrals/${encodeURIComponent(referralId)}/decision`;
}
