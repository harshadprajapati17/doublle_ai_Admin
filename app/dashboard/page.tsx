import {
  CardBody,
  CardHeader,
  EmptyState,
  ErrorBanner,
  PageHeader,
  PrimaryButton,
  SurfaceCard,
} from "@/components/ui/dashboard";
import { ProgramsList } from "@/components/programs/programs-list";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";
import type { ProgramListResponse } from "@/lib/programs/types";

export default async function DashboardPage() {
  const upstream = await adminUpstreamFetch(
    "/api/v1/admin/programs?limit=20",
    { method: "GET" },
  );

  const payload = await parseUpstreamJson<ProgramListResponse>(upstream);
  const programs = upstream.ok ? (payload.data ?? []) : [];
  const activeCount = programs.filter((p) => p.status === "ACTIVE").length;
  const listError =
    !upstream.ok ? (payload.error?.message ?? "Could not load programs.") : null;

  return (
    <>
      <PageHeader
        eyebrow="Referral programs"
        title="Configure rewards and attribution"
        description="Set referrer percentages, referee benefits, caps, and cookie windows for each program."
        action={
          <PrimaryButton href="/dashboard/programs/new">
            Create program
          </PrimaryButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total programs" value={String(programs.length)} />
        <StatCard label="Active" value={String(activeCount)} />
        <StatCard
          label="Draft / other"
          value={String(programs.length - activeCount)}
        />
      </div>

      <SurfaceCard>
        <CardHeader
          badge="Program catalog"
          title="All referral programs"
          description="Open a program to review terms, activate it, or edit reward rules."
        />
        <CardBody>
          {listError ? (
            <ErrorBanner message={listError} />
          ) : programs.length === 0 ? (
            <EmptyState
              title="No programs yet"
              description="Create your first referral program to start attributing signups."
            />
          ) : (
            <ProgramsList programs={programs} />
          )}
        </CardBody>
      </SurfaceCard>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card px-5 py-4 shadow-(--shadow-card)">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}
