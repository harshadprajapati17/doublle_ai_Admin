import {
  DetailGrid,
  SecondaryButton,
  StatusPill,
  SurfaceCard,
} from "@/components/ui/dashboard";
import { ProgramDetailActions } from "@/components/programs/program-detail-actions";
import { ProgramSummarySection } from "@/components/programs/program-summary-section";
import { ProgramVersionHistory } from "@/components/programs/program-version-history";
import { getProgramTerms } from "@/lib/programs/parse-program";
import type { ProgramDetail, ProgramVersion } from "@/lib/programs/types";

function statusTone(status: string): "success" | "warning" | "neutral" {
  if (status === "ACTIVE") return "success";
  if (status === "DRAFT") return "neutral";
  return "warning";
}

function termsToGridItems(
  terms: ProgramVersion | ReturnType<typeof getProgramTerms>,
) {
  return [
    {
      label: "Referrer reward",
      value: `${terms.referrerRewardPct}%`,
    },
    {
      label: "Duration",
      value: `${terms.referrerRewardDurationMonths} months`,
    },
    {
      label: "Hold period",
      value: `${terms.holdPeriodDays} days`,
    },
    { label: "Referee benefit", value: "Product credit" },
    {
      label: "Product credit",
      value: `${terms.refereeBenefitValue} credits`,
    },
  ];
}

function isRedundantTermsVersion(
  termsVersion: string,
  currentVersion: number,
): boolean {
  const normalized = termsVersion.trim().replace(/^v/i, "").toLowerCase();
  return normalized === String(currentVersion);
}

function formatVersionLabel(program: ProgramDetail): string | null {
  if (program.currentVersion == null) return null;

  const termsVersion =
    program.termsVersion ??
    program.versions?.find((v) => v.version === program.currentVersion)
      ?.termsVersion;

  if (
    termsVersion &&
    !isRedundantTermsVersion(termsVersion, program.currentVersion)
  ) {
    return `Version v${program.currentVersion} · ${termsVersion}`;
  }

  return `Version v${program.currentVersion}`;
}

export function ProgramDetailCard({
  program,
  onActivated,
}: {
  program: ProgramDetail;
  onActivated: () => void | Promise<void>;
}) {
  const terms = getProgramTerms(program);
  const gridItems = termsToGridItems(terms);
  const versionLabel = formatVersionLabel(program);

  return (
    <SurfaceCard className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-card-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {program.name}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {versionLabel ? (
              <p className="text-sm text-ink-secondary">{versionLabel}</p>
            ) : null}
            <StatusPill tone={statusTone(program.status)}>
              {program.status}
            </StatusPill>
          </div>
        </div>
        <div className="shrink-0">
          <SecondaryButton href={`/dashboard/programs/${program.id}/edit`}>
            Edit program
          </SecondaryButton>
        </div>
      </div>

      <section className="border-b border-card-border/60 px-6 py-4 sm:px-8">
        <h3 className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          Program terms
        </h3>
        <p className="mt-0.5 text-xs text-ink-muted">
          Active reward rules for the current version.
        </p>
        <div className="mt-4">
          <DetailGrid items={gridItems} size="compact" />
        </div>
      </section>

      {program.summary ? (
        <section className="px-6 py-6 sm:px-8">
          <ProgramSummarySection summary={program.summary} variant="featured" />
        </section>
      ) : null}

      {program.versions?.length ? (
        <section className="bg-surface px-6 py-5 sm:px-8">
          <ProgramVersionHistory
            versions={program.versions}
            currentVersion={program.currentVersion}
            tone="muted"
          />
        </section>
      ) : null}

      {program.status !== "ACTIVE" ? (
        <div className="border-t border-card-border bg-surface px-6 py-5 sm:px-8">
          <ProgramDetailActions
            programId={program.id}
            onActivated={onActivated}
          />
        </div>
      ) : null}
    </SurfaceCard>
  );
}
