"use client";

import { ProgramSummarySection } from "@/components/programs/program-summary-section";
import { Drawer } from "@/components/ui/drawer";
import { StatusPill } from "@/components/ui/dashboard";
import type { ProgramVersion } from "@/lib/programs/types";

function formatVersionDate(iso?: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const REWARD_TERM_FIELDS: {
  label: string;
  format: (version: ProgramVersion) => string;
}[] = [
  {
    label: "Referrer reward",
    format: (v) => `${v.referrerRewardPct}%`,
  },
  {
    label: "Duration",
    format: (v) => `${v.referrerRewardDurationMonths} months`,
  },
  {
    label: "Hold period",
    format: (v) => `${v.holdPeriodDays} days`,
  },
  { label: "Referee benefit", format: () => "Product credit" },
  {
    label: "Product credit",
    format: (v) => `${v.refereeBenefitValue} credits`,
  },
];

export function ProgramVersionDetailDrawer({
  version,
  isCurrent,
  open,
  onClose,
}: {
  version: ProgramVersion | null;
  isCurrent: boolean;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={open && version != null}
      onClose={onClose}
      className="max-w-xl sm:max-w-2xl"
      title={version ? `Version ${version.version}` : "Version"}
      description={
        version
          ? `${version.termsVersion ? `Terms ${version.termsVersion}` : "Program version"} · ${formatVersionDate(version.createdAt)}`
          : undefined
      }
    >
      {version ? (
        <div className="flex flex-col gap-6 pb-6">
          <div className="flex flex-wrap gap-2">
            {isCurrent ? (
              <StatusPill tone="success">Current version</StatusPill>
            ) : null}
            {version.changeReason ? (
              <StatusPill tone="neutral">{version.changeReason}</StatusPill>
            ) : null}
            {version.termsVersion ? (
              <StatusPill tone="neutral">{version.termsVersion}</StatusPill>
            ) : null}
          </div>

          <section className="rounded-xl border border-card-border bg-surface/40 p-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Reward terms
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {REWARD_TERM_FIELDS.map((field) => (
                <div key={field.label} className="min-w-0">
                  <dt className="text-sm text-ink-secondary">{field.label}</dt>
                  <dd className="mt-1 text-base font-semibold text-ink">
                    {field.format(version)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {version.summary ? (
            <ProgramSummarySection
              summary={version.summary}
              title="Version summary"
              description="Referrals and commissions attributed to this version."
              viewOptions={{
                includeTermsAcceptances: true,
                termsVersionLabel: version.termsVersion,
              }}
              embedded
            />
          ) : (
            <p className="rounded-xl border border-dashed border-card-border bg-surface/30 px-4 py-6 text-center text-sm text-ink-secondary">
              No performance summary is available for this version.
            </p>
          )}
        </div>
      ) : null}
    </Drawer>
  );
}
