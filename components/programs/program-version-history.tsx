"use client";

import { useState } from "react";
import { ProgramVersionDetailDrawer } from "@/components/programs/program-version-detail-drawer";
import { formatCount } from "@/lib/programs/format-summary";
import type { ProgramVersion } from "@/lib/programs/types";

function formatVersionDate(iso?: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function ProgramVersionHistory({
  versions,
  currentVersion,
  tone = "default",
}: {
  versions: ProgramVersion[];
  currentVersion?: number;
  /** Muted tone for secondary detail areas (e.g. program detail footer). */
  tone?: "default" | "muted";
}) {
  const [selectedVersion, setSelectedVersion] = useState<ProgramVersion | null>(
    null,
  );

  if (versions.length === 0) return null;

  const priorVersions =
    currentVersion != null
      ? versions.filter((v) => v.version !== currentVersion)
      : versions;

  if (priorVersions.length === 0) return null;

  const hasStats = priorVersions.some((v) => v.summary);

  const isMuted = tone === "muted";

  return (
    <>
      <section className={isMuted ? undefined : "border-t border-card-border pt-8"}>
        <h3
          className={
            isMuted
              ? "text-xs font-semibold uppercase tracking-wider text-ink-muted"
              : "text-sm font-semibold text-ink"
          }
        >
          Version history
        </h3>
        <p
          className={
            isMuted
              ? "mt-1 text-xs text-ink-muted"
              : "mt-1 text-sm text-ink-secondary"
          }
        >
          Reward terms and performance for prior published versions.
        </p>
        <div
          className={`mt-4 overflow-x-auto rounded-xl border border-card-border ${isMuted ? "bg-card" : ""}`}
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-card-border bg-surface/50 text-xs font-medium uppercase tracking-wider text-ink-muted">
                <th className="px-4 py-3 font-medium">Version</th>
                <th className="w-0 whitespace-nowrap px-4 py-3 font-medium">
                  Reward
                </th>
                <th className="w-0 whitespace-nowrap px-4 py-3 font-medium">
                  Duration
                </th>
                <th className="w-0 whitespace-nowrap px-4 py-3 font-medium">
                  Credit
                </th>
                <th className="w-0 whitespace-nowrap px-4 py-3 font-medium">Hold</th>
                {hasStats ? (
                  <>
                    <th className="w-0 whitespace-nowrap px-4 py-3 font-medium">
                      Referrals
                    </th>
                    <th
                      className="w-0 whitespace-nowrap px-4 py-3 font-medium"
                      title="Commission records"
                    >
                      Records
                    </th>
                  </>
                ) : null}
                <th className="w-0 whitespace-nowrap px-4 py-3 font-medium">
                  Created
                </th>
                <th className="w-0 whitespace-nowrap px-4 py-3 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {priorVersions.map((v) => (
                <tr key={v.version}>
                    <td className="px-4 py-3 font-medium text-ink">
                      v{v.version}
                    </td>
                    <td className="w-0 whitespace-nowrap px-4 py-3 tabular-nums text-ink">
                      {v.referrerRewardPct}%
                    </td>
                    <td className="w-0 whitespace-nowrap px-4 py-3 text-ink">
                      {v.referrerRewardDurationMonths} mo
                    </td>
                    <td className="w-0 whitespace-nowrap px-4 py-3 tabular-nums text-ink">
                      {v.refereeBenefitValue}
                    </td>
                    <td className="w-0 whitespace-nowrap px-4 py-3 text-ink">
                      {v.holdPeriodDays} days
                    </td>
                    {hasStats ? (
                      <>
                        <td className="w-0 whitespace-nowrap px-4 py-3 tabular-nums text-ink">
                          {v.summary
                            ? formatCount(v.summary.totalReferrals)
                            : "—"}
                        </td>
                        <td
                          className="w-0 whitespace-nowrap px-4 py-3 tabular-nums text-ink"
                          title="Commission records"
                        >
                          {v.summary
                            ? formatCount(v.summary.totalCommissions)
                            : "—"}
                        </td>
                      </>
                    ) : null}
                    <td className="w-0 whitespace-nowrap px-4 py-3 text-ink-secondary">
                      {formatVersionDate(v.createdAt)}
                    </td>
                    <td className="w-0 whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedVersion(v)}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        View details
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ProgramVersionDetailDrawer
        version={selectedVersion}
        isCurrent={selectedVersion?.version === currentVersion}
        open={selectedVersion != null}
        onClose={() => setSelectedVersion(null)}
      />
    </>
  );
}
