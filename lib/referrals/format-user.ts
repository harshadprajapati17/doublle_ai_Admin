import type { ReferralUser } from "@/lib/referrals/types";

/** Admin-facing label: email when the API provides it, otherwise name or user id. */
export function referralUserPrimary(user: ReferralUser) {
  return user.email ?? user.name ?? user.userId;
}

export function referralUserSecondary(user: ReferralUser): string | null {
  if (user.email) {
    return user.name ?? null;
  }
  if (user.name && user.name !== user.userId) {
    return user.userId;
  }
  return null;
}

export function formatReferralUserDetail(user: ReferralUser) {
  if (user.email) {
    return user.name ? `${user.email} · ${user.name}` : user.email;
  }
  if (user.name && user.name !== user.userId) {
    return `${user.name} · ${user.userId}`;
  }
  return user.userId;
}
