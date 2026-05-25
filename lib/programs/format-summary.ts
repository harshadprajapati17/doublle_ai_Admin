import type {
  CommissionState,
  ProgramSummary,
} from "@/lib/programs/types";

const COMMISSION_STATE_LABELS: Record<string, string> = {
  PENDING: "On hold",
  EARNED: "Earned",
  PAID: "Paid",
  CLAWED_BACK: "Reversed",
};

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

export function commissionStateLabel(state: CommissionState): string {
  return COMMISSION_STATE_LABELS[state] ?? state;
}

export function summaryToGridItems(
  summary: ProgramSummary,
  options?: { includeTermsAcceptances?: boolean },
): { label: string; value: string }[] {
  const items = [
    {
      label: "Total referrals",
      value: formatCount(summary.totalReferrals),
    },
    {
      label: "Commission records",
      value: formatCount(summary.totalCommissions),
    },
  ];

  if (
    options?.includeTermsAcceptances &&
    summary.termsAcceptancesCount != null
  ) {
    items.push({
      label: "Terms acceptances",
      value: formatCount(summary.termsAcceptancesCount),
    });
  }

  return items;
}

export const COMMISSION_STATE_ORDER: CommissionState[] = [
  "PENDING",
  "EARNED",
  "PAID",
  "CLAWED_BACK",
];
