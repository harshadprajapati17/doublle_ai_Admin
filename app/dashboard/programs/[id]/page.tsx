import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgramDetailActions } from "@/components/programs/program-detail-actions";
import {
  CardBody,
  CardHeader,
  MetricStrip,
  PageHeader,
  SecondaryButton,
  StatusPill,
  SurfaceCard,
} from "@/components/ui/dashboard";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";
import type { Program } from "@/lib/programs/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

function statusTone(status: string): "success" | "warning" | "neutral" {
  if (status === "ACTIVE") return "success";
  if (status === "DRAFT") return "neutral";
  return "warning";
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id } = await params;

  const upstream = await adminUpstreamFetch(
    `/api/v1/admin/programs/${encodeURIComponent(id)}`,
    { method: "GET" },
  );

  const data = await parseUpstreamJson<{
    data?: Program;
    error?: { message?: string };
  }>(upstream);

  if (!upstream.ok || !data.data) {
    if (upstream.status === 404) {
      notFound();
    }

    return (
      <SurfaceCard>
        <CardBody>
          <p className="text-sm text-red-800">
            {data.error?.message ?? "Failed to load program."}
          </p>
          <Link
            href="/dashboard/programs/new"
            className="mt-4 inline-block text-sm font-medium text-accent"
          >
            Create a program
          </Link>
        </CardBody>
      </SurfaceCard>
    );
  }

  const program = data.data;

  return (
    <>
      <PageHeader
        eyebrow="Referral program"
        title={program.name}
        description={`Version ${program.termsVersion} · ${program.currency} · ${program.status}`}
        action={
          <div className="flex items-center gap-3">
            <StatusPill tone={statusTone(program.status)}>
              {program.status}
            </StatusPill>
            <SecondaryButton href={`/dashboard/programs/${program.id}/edit`}>
              Edit program
            </SecondaryButton>
          </div>
        }
      />

      <SurfaceCard>
        <CardHeader
          title="Reward summary"
          description="Core terms configured for this program."
        />
        <CardBody className="space-y-8">
          <MetricStrip
            items={[
              {
                label: "Referrer reward",
                value: `${program.referrerRewardPct}%`,
              },
              {
                label: "Duration",
                value: `${program.referrerRewardDurationMonths} months`,
              },
              {
                label: "Hold period",
                value: `${program.holdPeriodDays} days`,
              },
            ]}
          />

          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <DetailItem label="Terms version" value={program.termsVersion} />
            <DetailItem label="Currency" value={program.currency} />
            <DetailItem label="Cookie window" value={`${program.cookieDays} days`} />
            <DetailItem label="Attribution" value={program.attributionRule} />
            <DetailItem label="Referee benefit" value={program.refereeBenefitType} />
            {program.refereeBenefitType === "CREDIT" &&
            program.refereeBenefitValue != null ? (
              <DetailItem
                label="Product credit"
                value={`${program.refereeBenefitValue} credits`}
              />
            ) : null}
            {program.refereeBenefitType === "TRIAL_EXTENSION" &&
            program.refereeBenefitTrialDays != null ? (
              <DetailItem
                label="Extra trial days"
                value={`${program.refereeBenefitTrialDays} days`}
              />
            ) : null}
            <DetailItem
              label="Monthly cap"
              value={
                program.monthlyCap === null
                  ? "No limit"
                  : `${program.monthlyCap} ${program.currency}`
              }
            />
            <DetailItem
              label="Lifetime cap"
              value={
                program.lifetimeCap === null
                  ? "No limit"
                  : `${program.lifetimeCap} ${program.currency}`
              }
            />
          </dl>
        </CardBody>
      </SurfaceCard>

      {program.status !== "ACTIVE" ? (
        <ProgramDetailActions programId={program.id} />
      ) : null}

      <Link
        href="/dashboard/programs/new"
        className="text-sm font-medium text-accent hover:underline"
      >
        Create another program
      </Link>
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-card-border bg-surface/50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-ink">{value}</dd>
    </div>
  );
}
