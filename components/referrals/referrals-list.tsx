import { ReferralLinkCopy } from "@/components/referrals/referral-link-copy";
import { buildReferralLink } from "@/lib/referrals/build-referral-link";
import type { Referral } from "@/lib/referrals/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function ReferralsList({
  referrals,
  referralAppOrigin,
}: {
  referrals: Referral[];
  referralAppOrigin: string;
}) {
  if (referrals.length === 0) {
    return (
      <p className="mt-4 text-sm text-zinc-600">
        No referrals yet. Referrals appear here when users sign up through a
        referral link or code.
      </p>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-zinc-100 rounded-lg border border-zinc-200">
      {referrals.map((referral) => (
        <li key={referral.id} className="px-4 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <ReferralStatusBadge status={referral.status} />
                <span className="font-mono text-xs text-zinc-500">
                  {referral.code}
                </span>
                <span className="text-xs text-zinc-400">
                  · {referral.attributionSource}
                </span>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <UserBlock label="Referrer" user={referral.referrer} />
                <UserBlock label="Referee" user={referral.referee} />
              </div>

              <p className="text-xs text-zinc-500">
                Created {formatDate(referral.createdAt)}
                {referral.programVersionAtAttribution != null
                  ? ` · Program v${referral.programVersionAtAttribution}`
                  : null}
              </p>

              {referral.code ? (
                <ReferralLinkCopy
                  url={buildReferralLink(referralAppOrigin, referral.code)}
                />
              ) : null}
            </div>

            <PaymentSummary payment={referral.payment} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function UserBlock({
  label,
  user,
}: {
  label: string;
  user: Referral["referrer"];
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-0.5 font-medium text-zinc-900">{user.name}</p>
      <p className="truncate text-xs text-zinc-600">{user.email}</p>
    </div>
  );
}

function PaymentSummary({ payment }: { payment: Referral["payment"] }) {
  return (
    <div className="shrink-0 text-right text-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Payment
      </p>
      <p
        className={`mt-0.5 font-medium ${payment.hasPaid ? "text-emerald-700" : "text-zinc-700"}`}
      >
        {payment.hasPaid ? "Paid" : "Not paid"}
      </p>
      <p className="mt-0.5 text-xs text-zinc-500">
        {payment.totalPaidAmount} {payment.currency}
        {payment.capturedPaymentCount > 0
          ? ` · ${payment.capturedPaymentCount} capture${payment.capturedPaymentCount === 1 ? "" : "s"}`
          : null}
      </p>
    </div>
  );
}

function ReferralStatusBadge({ status }: { status: string }) {
  const styles =
    status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : status === "TERMINATED"
        ? "bg-red-50 text-red-800 ring-red-200"
        : "bg-zinc-100 text-zinc-700 ring-zinc-200";

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles}`}
    >
      {status}
    </span>
  );
}
