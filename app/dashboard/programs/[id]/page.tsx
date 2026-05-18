import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgramDetailActions } from "@/components/programs/program-detail-actions";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";
import type { Program } from "@/lib/programs/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id } = await params;

  const upstream = await adminUpstreamFetch(
    `/api/v1/admin/programs/${encodeURIComponent(id)}`,
    { method: "GET" },
  );

  const data = await parseUpstreamJson<{ data?: Program; error?: { message?: string } }>(
    upstream,
  );

  if (!upstream.ok || !data.data) {
    if (upstream.status === 404) {
      notFound();
    }

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-800">
          {data.error?.message ?? "Failed to load program."}
        </p>
        <Link
          href="/dashboard/programs/new"
          className="mt-4 inline-block text-sm font-medium text-red-900 underline"
        >
          Create a program
        </Link>
      </div>
    );
  }

  const program = data.data;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Referral program
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-900">{program.name}</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Status:{" "}
            <span className="font-medium text-zinc-800">{program.status}</span>
          </p>
        </div>
        <Link
          href={`/dashboard/programs/${program.id}/edit`}
          className="inline-flex shrink-0 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
        >
          Edit program
        </Link>
      </header>

      <dl className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-6 text-sm sm:grid-cols-2">
        <DetailItem label="Terms version" value={program.termsVersion} />
        <DetailItem label="Currency" value={program.currency} />
        <DetailItem
          label="Referrer reward"
          value={`${program.referrerRewardPct}%`}
        />
        <DetailItem
          label="Reward duration"
          value={`${program.referrerRewardDurationMonths} months`}
        />
        <DetailItem label="Hold period" value={`${program.holdPeriodDays} days`} />
        <DetailItem label="Cookie window" value={`${program.cookieDays} days`} />
        <DetailItem label="Attribution" value={program.attributionRule} />
        <DetailItem label="Referee benefit" value={program.refereeBenefitType} />
        {program.refereeBenefitType === "CREDIT" && program.refereeBenefitValue != null ? (
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

      {program.status !== "ACTIVE" ? (
        <ProgramDetailActions programId={program.id} />
      ) : null}

      <Link
        href="/dashboard/programs/new"
        className="text-sm font-medium text-zinc-700 underline-offset-2 hover:underline"
      >
        Create another program
      </Link>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-zinc-900">{value}</dd>
    </div>
  );
}
