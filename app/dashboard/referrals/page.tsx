import { ReferralsTable } from "@/components/referrals/referrals-table";
import { FluidDashboardLayout } from "@/components/fluid-dashboard-layout";
import { ErrorBanner } from "@/components/ui/dashboard";
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
  const listError =
    !upstream.ok
      ? (payload.error?.message ?? "Could not load referrals.")
      : null;

  return (
    <FluidDashboardLayout
      title="Manage referrals"
      description="Search by code, review attribution and lifecycle stage, and filter paid conversions."
      fillViewport
      contentClassName="min-h-0 flex-1"
    >
      {listError ? (
        <div className="px-6 py-6 sm:px-8 lg:px-10">
          <ErrorBanner message={listError} />
        </div>
      ) : (
        <ReferralsTable
          referrals={referrals}
          referralAppOrigin={getReferralAppOrigin()}
        />
      )}
    </FluidDashboardLayout>
  );
}
