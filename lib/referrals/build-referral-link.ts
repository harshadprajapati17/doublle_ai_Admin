/**
 * Public referral landing URL: `{origin}/?ref={code}` (matches legacy API `referralUrl`).
 */
export function buildReferralLink(origin: string, code: string): string {
  const normalized = code.trim().toUpperCase();
  const base = origin.trim().replace(/\/$/, "");
  const url = new URL("/", `${base}/`);

  if (normalized) {
    url.searchParams.set("ref", normalized);
  }

  return url.toString();
}
