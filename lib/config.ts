export function getApiUrl(): string {
  return process.env.API_URL ?? "http://localhost:5001";
}

/** Consumer app origin where `/?ref=` links land (referral / signup app). */
export function getReferralAppOrigin(): string {
  return (
    process.env.REFERRAL_APP_ORIGIN?.trim() ||
    process.env.NEXT_PUBLIC_REFERRAL_APP_ORIGIN?.trim() ||
    "http://localhost:3000"
  );
}
