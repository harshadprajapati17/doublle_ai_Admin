import {
  CardBody,
  CardHeader,
  ErrorBanner,
  PageHeader,
  SurfaceCard,
} from "@/components/ui/dashboard";
import { ReferralsTable } from "@/components/referrals/referrals-table";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";
import { getReferralAppOrigin } from "@/lib/config";
import type { ReferralListResponse } from "@/lib/referrals/types";

export default async function ReferralsPage() {
  const upstream = await adminUpstreamFetch(
    "/api/v1/admin/referrals?limit=100",
    { method: "GET" },
  );

  const payload = await parseUpstreamJson<ReferralListResponse>(upstream);
  const referrals = upstream.ok ? (payload.data ?? []) : [];
  const activeCount = referrals.filter((r) => r.status === "ACTIVE").length;
  const paidCount = referrals.filter(
    (r) =>
      r.payment.hasPaid ||
      r.payment.capturedPaymentCount > 0 ||
      Number.parseFloat(r.payment.totalPaidAmount) > 0,
  ).length;
  const listError =
    !upstream.ok
      ? (payload.error?.message ?? "Could not load referrals.")
      : null;

  return (
    <>
      <PageHeader
        eyebrow="Referrals"
        title="Manage referrals"
        description="Search by code, review referrer and referee attribution, and filter rows that have recorded payouts."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total referrals" value={String(referrals.length)} />
        <StatCard label="Active" value={String(activeCount)} />
        <StatCard label="With payout" value={String(paidCount)} />
      </div>

      <SurfaceCard>
        <CardHeader
          title="Referral registry"
          description="Use search and filters to find attributions quickly. Click a row to view code, link, and full details."
        />
        <CardBody>
          {listError ? (
            <ErrorBanner message={listError} />
          ) : (
            <ReferralsTable
              referrals={referrals}
              referralAppOrigin={getReferralAppOrigin()}
            />
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
