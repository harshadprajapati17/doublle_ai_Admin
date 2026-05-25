import {
  DetailGrid,
  SecondaryButton,
  StatusPill,
  SurfaceCard,
} from "@/components/ui/dashboard";
import { ProgramDetailActions } from "@/components/programs/program-detail-actions";
import { ProgramSummarySection } from "@/components/programs/program-summary-section";
import { ProgramVersionHistory } from "@/components/programs/program-version-history";
import { FLUID_PAGE_X } from "@/lib/dashboard/fluid-spacing";
import { getActiveVersion, getProgramTerms } from "@/lib/programs/parse-program";
import type { ProgramDetail, ProgramSummary, ProgramVersion } from "@/lib/programs/types";
import type { ProgramSummaryViewOptions } from "@/lib/programs/summary-metrics";
import { cn } from "@/lib/utils";

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

function programSummaryView(
  program: ProgramDetail,
): { summary: ProgramSummary; viewOptions?: ProgramSummaryViewOptions } | null {
  if (!program.summary) return null;

  const active = getActiveVersion(program);
  const termsCount = active?.summary?.termsAcceptancesCount;
  if (termsCount == null) {
    return { summary: program.summary };
  }

  const termsVersionLabel =
    active?.termsVersion ??
    (program.currentVersion != null ? `v${program.currentVersion}` : undefined);

  return {
    summary: { ...program.summary, termsAcceptancesCount: termsCount },
    viewOptions: {
      includeTermsAcceptances: true,
      termsVersionLabel,
    },
  };
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
  const summaryView = programSummaryView(program);

  return (
    <SurfaceCard variant="embedded">
      <div
        className={cn(
          "flex flex-col gap-4 border-b border-accent/10 bg-accent-soft/40 py-5 sm:flex-row sm:items-center sm:justify-between",
          FLUID_PAGE_X,
        )}
      >
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

      <section className={cn("border-b border-card-border/60 py-5", FLUID_PAGE_X)}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
          Program terms
        </h3>
        <p className="mt-0.5 text-xs text-ink-muted">
          Active reward rules for the current version.
        </p>
        <div className="mt-4">
          <DetailGrid items={gridItems} size="compact" />
        </div>
      </section>

      {summaryView ? (
        <section
          className={cn("border-b border-card-border/60 bg-surface/50 py-6", FLUID_PAGE_X)}
        >
          <ProgramSummarySection
            summary={summaryView.summary}
            viewOptions={summaryView.viewOptions}
            variant="featured"
          />
        </section>
      ) : null}

      {program.versions?.length ? (
        <section className={cn("bg-surface py-5", FLUID_PAGE_X)}>
          <ProgramVersionHistory
            versions={program.versions}
            currentVersion={program.currentVersion}
            tone="muted"
          />
        </section>
      ) : null}

      {program.status !== "ACTIVE" ? (
        <div
          className={cn(
            "border-t border-card-border bg-accent-soft/30 py-5",
            FLUID_PAGE_X,
          )}
        >
          <ProgramDetailActions
            programId={program.id}
            onActivated={onActivated}
          />
        </div>
      ) : null}
    </SurfaceCard>
  );
}
