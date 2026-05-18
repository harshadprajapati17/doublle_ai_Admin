import { ReferralsList } from "@/components/referrals/referrals-list";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";
import { getReferralAppOrigin } from "@/lib/config";
import type { ReferralListResponse } from "@/lib/referrals/types";

export default async function ReferralsPage() {
  const upstream = await adminUpstreamFetch(
    "/api/v1/admin/referrals?limit=20",
    { method: "GET" },
  );

  const payload = await parseUpstreamJson<ReferralListResponse>(upstream);
  const referrals = upstream.ok ? (payload.data ?? []) : [];
  const listError =
    !upstream.ok
      ? (payload.error?.message ?? "Could not load referrals.")
      : null;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Referrals
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          View attributed referrals, referrer and referee details, and payment
          status.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">
            All referrals
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Recent referral attributions across active programs.
          </p>
        </div>
        {listError ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {listError}
          </p>
        ) : (
          <ReferralsList
            referrals={referrals}
            referralAppOrigin={getReferralAppOrigin()}
          />
        )}
      </section>
    </div>
  );
}
