import {
  COMMISSION_STATE_ORDER,
  formatCount,
  formatMoney,
} from "@/lib/programs/format-summary";
import type {
  CommissionState,
  ProgramSummary,
  ReferralsByStatus,
} from "@/lib/programs/types";

export type SummaryMetric = {
  id: string;
  label: string;
  helpText: string;
  value: string;
};

export type CommissionStateMetric = SummaryMetric & {
  amount: string;
};

/** Active first — primary admin glance metric. */
const REFERRAL_STATUS_ORDER = ["ACTIVE", "TERMINATED", "FRAUD_REJECTED"] as const;

const REFERRAL_STATUS_META: Record<
  (typeof REFERRAL_STATUS_ORDER)[number],
  { label: string; helpText: string }
> = {
  ACTIVE: {
    label: "Active",
    helpText: "Valid attributions still earning.",
  },
  TERMINATED: {
    label: "Terminated",
    helpText: "Closed by admin — no further benefits.",
  },
  FRAUD_REJECTED: {
    label: "Rejected",
    helpText: "Fraud — no further benefits.",
  },
};

const FRAUD_REVIEW_ORDER = ["flagged", "rejected", "terminated"] as const;

const FRAUD_REVIEW_META: Record<
  (typeof FRAUD_REVIEW_ORDER)[number],
  { label: string; helpText: string }
> = {
  flagged: {
    label: "Needs review",
    helpText: "Flagged, not yet approved or rejected.",
  },
  rejected: {
    label: "Rejected",
    helpText: "Confirmed fraud by admin.",
  },
  terminated: {
    label: "Terminated",
    helpText: "Ended by admin (not fraud).",
  },
};

const COMMISSION_STATE_META: Record<
  CommissionState,
  { label: string; helpText: string }
> = {
  PENDING: {
    label: "On hold",
    helpText: "Waiting for hold period.",
  },
  EARNED: {
    label: "Earned",
    helpText: "Ready to credit referrer.",
  },
  PAID: {
    label: "Paid",
    helpText: "Credited to referrer.",
  },
  CLAWED_BACK: {
    label: "Reversed",
    helpText: "Cancelled or refunded.",
  },
};

function referralStatusMetrics(
  referralsByStatus: ReferralsByStatus,
): SummaryMetric[] {
  return REFERRAL_STATUS_ORDER.map((status) => {
    const meta = REFERRAL_STATUS_META[status];
    return {
      id: `referralsByStatus.${status}`,
      label: meta.label,
      helpText: meta.helpText,
      value: formatCount(referralsByStatus[status] ?? 0),
    };
  });
}

function fraudReviewMetrics(
  fraudReview: NonNullable<ProgramSummary["fraudReview"]>,
): SummaryMetric[] {
  return FRAUD_REVIEW_ORDER.map((key) => {
    const meta = FRAUD_REVIEW_META[key];
    return {
      id: `fraudReview.${key}`,
      label: meta.label,
      helpText: meta.helpText,
      value: formatCount(fraudReview[key] ?? 0),
    };
  });
}

function commissionStateMetrics(summary: ProgramSummary): CommissionStateMetric[] {
  return COMMISSION_STATE_ORDER.map((state) => {
    const entry = summary.commissionsByState[state];
    const meta = COMMISSION_STATE_META[state] ?? {
      label: state,
      helpText: "",
    };

    return {
      id: `commissionsByState.${state}`,
      label: meta.label,
      helpText: meta.helpText,
      value: formatCount(entry?.count ?? 0),
      amount: formatMoney(entry?.amount ?? 0, summary.currency),
    };
  });
}

export type SummaryDetailRow =
  | { label: string; variant: "default"; metrics: SummaryMetric[] }
  | { label: string; variant: "commission"; metrics: CommissionStateMetric[] };

export type SummaryPanel = {
  id: string;
  title: string;
  headline: SummaryMetric;
  rows: SummaryDetailRow[];
};

export type ProgramSummaryGlanceItem = {
  id: string;
  value: string;
  label: string;
  tone: "default" | "muted" | "caution";
};

export type ProgramSummaryGlance = {
  items: ProgramSummaryGlanceItem[];
  tone: "neutral" | "attention";
};

export type UnifiedSummarySection = {
  id: string;
  title: string;
  description: string;
  rows: SummaryDetailRow[];
};

export type UnifiedProgramSummary = {
  headlines: SummaryMetric[];
  glance: ProgramSummaryGlance;
  sections: UnifiedSummarySection[];
};

export type ProgramSummaryViewOptions = {
  /** When set, show current-version terms acceptances in the headline row. */
  includeTermsAcceptances?: boolean;
  /** e.g. "v3" — shown in glance chip and metric help text. */
  termsVersionLabel?: string;
};

function buildGlance(summary: ProgramSummary): ProgramSummaryGlance {
  const active = summary.referralsByStatus?.ACTIVE ?? 0;
  const rejected = summary.referralsByStatus?.FRAUD_REJECTED ?? 0;
  const needsReview = summary.fraudReview?.flagged ?? 0;
  const records = summary.totalCommissions;
  const hasAttributions = summary.totalReferrals > 0;

  const items: ProgramSummaryGlanceItem[] = [
    {
      id: "attributed",
      value: formatCount(summary.totalReferrals),
      label: "attributed",
      tone: "default",
    },
    {
      id: "active",
      value: active === 0 && hasAttributions ? "None" : formatCount(active),
      label: "active",
      tone: active === 0 && hasAttributions ? "caution" : "default",
    },
  ];

  if (needsReview > 0) {
    items.push({
      id: "needsReview",
      value: formatCount(needsReview),
      label: "need review",
      tone: "caution",
    });
  } else if (rejected > 0) {
    items.push({
      id: "rejected",
      value: formatCount(rejected),
      label: "rejected",
      tone: "caution",
    });
  }

  items.push({
    id: "payoutRecords",
    value: formatCount(records),
    label: "payout records",
    tone: records === 0 ? "muted" : "default",
  });

  const tone: ProgramSummaryGlance["tone"] =
    needsReview > 0 || (active === 0 && hasAttributions) ? "attention" : "neutral";

  return { items, tone };
}

function termsAcceptancesHelpText(termsVersionLabel?: string): string {
  if (termsVersionLabel) {
    return `Users who accepted ${termsVersionLabel} terms.`;
  }
  return "Users who accepted program terms.";
}

export function buildUnifiedProgramSummary(
  summary: ProgramSummary,
  options?: ProgramSummaryViewOptions,
): UnifiedProgramSummary {
  const attributionRows: SummaryDetailRow[] = [];

  if (summary.referralsByStatus) {
    attributionRows.push({
      label: "Lifecycle",
      variant: "default",
      metrics: referralStatusMetrics(summary.referralsByStatus),
    });
  }

  if (summary.fraudReview) {
    attributionRows.push({
      label: "Fraud review",
      variant: "default",
      metrics: fraudReviewMetrics(summary.fraudReview),
    });
  }

  const sections: UnifiedSummarySection[] = [];

  if (attributionRows.length > 0) {
    sections.push({
      id: "attribution",
      title: "Attribution",
      description: "Who is attributed and whether they are still earning.",
      rows: attributionRows,
    });
  }

  sections.push({
    id: "payouts",
    title: "Payouts",
    description: "Referrer rewards linked to referee payments.",
    rows: [
      {
        label: "Record state",
        variant: "commission",
        metrics: commissionStateMetrics(summary),
      },
    ],
  });

  const headlines: SummaryMetric[] = [];

  if (options?.includeTermsAcceptances && summary.termsAcceptancesCount != null) {
    headlines.push({
      id: "termsAcceptancesCount",
      label: "Terms acceptances",
      helpText: termsAcceptancesHelpText(options.termsVersionLabel),
      value: formatCount(summary.termsAcceptancesCount),
    });
  }

  headlines.push(
    {
      id: "totalReferrals",
      label: "Total referrals",
      helpText: "Everyone attributed under this program.",
      value: formatCount(summary.totalReferrals),
    },
    {
      id: "totalCommissions",
      label: "Commission records",
      helpText: "Payment-linked referrer reward entries.",
      value: formatCount(summary.totalCommissions),
    },
  );

  return {
    headlines,
    glance: buildGlance(summary),
    sections,
  };
}

function headlineById(
  headlines: SummaryMetric[],
  id: SummaryMetric["id"],
): SummaryMetric {
  return headlines.find((h) => h.id === id) ?? headlines[0];
}

export function buildProgramSummaryPanels(
  summary: ProgramSummary,
  options?: ProgramSummaryViewOptions,
): SummaryPanel[] {
  const unified = buildUnifiedProgramSummary(summary, options);
  const attribution = unified.sections.find((s) => s.id === "attribution");
  const payouts = unified.sections.find((s) => s.id === "payouts");

  return [
    {
      id: "referrals",
      title: "Referrals",
      headline: headlineById(unified.headlines, "totalReferrals"),
      rows: attribution?.rows ?? [],
    },
    {
      id: "commissions",
      title: "Commissions",
      headline: headlineById(unified.headlines, "totalCommissions"),
      rows: payouts?.rows ?? [],
    },
  ];
}

/** @deprecated Use buildProgramSummaryPanels for grouped admin layout. */
export function buildProgramSummarySections(
  summary: ProgramSummary,
  options?: ProgramSummaryViewOptions,
) {
  const panels = buildProgramSummaryPanels(summary, options);
  const referrals = panels.find((p) => p.id === "referrals");
  const commissions = panels.find((p) => p.id === "commissions");

  return {
    overview: panels.map((p) => p.headline),
    referralsByStatus:
      referrals?.rows.find((r) => r.label === "By status")?.metrics ?? [],
    fraudReview:
      referrals?.rows.find((r) => r.label === "Fraud review")?.metrics ?? [],
    commissionsByState: (commissions?.rows[0]?.metrics ??
      []) as CommissionStateMetric[],
  };
}
