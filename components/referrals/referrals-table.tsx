"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ReferralDetailDrawer } from "@/components/referrals/referral-detail-drawer";
import { StatusPill } from "@/components/ui/dashboard";
import type { Referral } from "@/lib/referrals/types";
import { cn } from "@/lib/utils";

function formatShortDate(iso: string) {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

function formatFullDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function statusTone(status: string): "success" | "danger" | "neutral" {
  if (status === "ACTIVE") return "success";
  if (status === "TERMINATED") return "danger";
  return "neutral";
}

function hasPayout(referral: Referral) {
  return (
    referral.payment.hasPaid ||
    referral.payment.capturedPaymentCount > 0 ||
    Number.parseFloat(referral.payment.totalPaidAmount) > 0
  );
}

function filterReferrals(
  referrals: Referral[],
  codeQuery: string,
  payoutOnly: boolean,
) {
  const query = codeQuery.trim().toLowerCase();

  return referrals.filter((referral) => {
    if (payoutOnly && !hasPayout(referral)) return false;
    if (!query) return true;
    return referral.code.toLowerCase().includes(query);
  });
}

export function ReferralsTable({
  referrals,
  referralAppOrigin,
}: {
  referrals: Referral[];
  referralAppOrigin: string;
}) {
  const [codeQuery, setCodeQuery] = useState("");
  const [payoutOnly, setPayoutOnly] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  const filtered = useMemo(
    () => filterReferrals(referrals, codeQuery, payoutOnly),
    [referrals, codeQuery, payoutOnly],
  );

  const payoutCount = useMemo(
    () => referrals.filter(hasPayout).length,
    [referrals],
  );

  return (
    <div className="flex flex-col gap-4">
      <Toolbar
        codeQuery={codeQuery}
        onCodeQueryChange={setCodeQuery}
        payoutOnly={payoutOnly}
        onPayoutOnlyChange={setPayoutOnly}
        payoutCount={payoutCount}
        shownCount={filtered.length}
        totalCount={referrals.length}
      />

      {filtered.length === 0 ? (
        <EmptyResults
          hasReferrals={referrals.length > 0}
          payoutOnly={payoutOnly}
          codeQuery={codeQuery}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-card-border bg-surface/80">
                <Th>Status</Th>
                <Th>Flagged</Th>
                <Th>Referrer</Th>
                <Th>Referee</Th>
                <Th>Created</Th>
                <Th>Payment</Th>
                <Th className="text-right">Payout</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border bg-card">
              {filtered.map((referral) => (
                <ReferralRow
                  key={referral.id}
                  referral={referral}
                  onSelect={() => setSelectedReferral(referral)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ReferralDetailDrawer
        referral={selectedReferral}
        referralAppOrigin={referralAppOrigin}
        open={selectedReferral != null}
        onClose={() => setSelectedReferral(null)}
      />
    </div>
  );
}

function Toolbar({
  codeQuery,
  onCodeQueryChange,
  payoutOnly,
  onPayoutOnlyChange,
  payoutCount,
  shownCount,
  totalCount,
}: {
  codeQuery: string;
  onCodeQueryChange: (value: string) => void;
  payoutOnly: boolean;
  onPayoutOnlyChange: (value: boolean) => void;
  payoutCount: number;
  shownCount: number;
  totalCount: number;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <label htmlFor="referral-code-search" className="sr-only">
          Search by referral code
        </label>
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <input
          id="referral-code-search"
          type="search"
          value={codeQuery}
          onChange={(event) => onCodeQueryChange(event.target.value)}
          placeholder="Search referral code…"
          className="w-full rounded-lg border border-card-border bg-card py-2.5 pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <FilterToggle
          pressed={payoutOnly}
          onPressedChange={onPayoutOnlyChange}
          label="With payout only"
          count={payoutCount}
        />
        <p className="text-xs text-ink-muted">
          Showing {shownCount} of {totalCount}
        </p>
      </div>
    </div>
  );
}

function FilterToggle({
  pressed,
  onPressedChange,
  label,
  count,
}: {
  pressed: boolean;
  onPressedChange: (value: boolean) => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
        pressed
          ? "border-ink bg-ink text-white"
          : "border-card-border bg-card text-ink-secondary hover:border-ink/20 hover:text-ink",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-xs font-semibold",
          pressed ? "bg-white/20 text-white" : "bg-surface text-ink-muted",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function ReferralRow({
  referral,
  onSelect,
}: {
  referral: Referral;
  onSelect: () => void;
}) {
  return (
    <tr
      className="cursor-pointer transition hover:bg-surface/40"
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View referral ${referral.code}`}
    >
      <Td>
        <StatusPill tone={statusTone(referral.status)}>{referral.status}</StatusPill>
      </Td>
      <Td>
        <FlaggedCell fraud={referral.fraud} />
      </Td>
      <Td>
        <UserCell user={referral.referrer} />
      </Td>
      <Td>
        <UserCell user={referral.referee} />
      </Td>
      <Td>
        <span
          title={formatFullDate(referral.createdAt)}
          className="whitespace-nowrap text-ink-secondary underline decoration-transparent decoration-dotted underline-offset-2 hover:decoration-ink-muted"
        >
          {formatShortDate(referral.createdAt)}
        </span>
      </Td>
      <Td>
        <span
          className={cn(
            "font-medium",
            referral.payment.hasPaid ? "text-emerald-700" : "text-ink",
          )}
        >
          {referral.payment.hasPaid ? "Paid" : "Not paid"}
        </span>
      </Td>
      <Td className="text-right">
        <span className="font-medium tabular-nums text-ink">
          {referral.payment.totalPaidAmount}
        </span>
        <span className="ml-1 text-ink-muted">{referral.payment.currency}</span>
      </Td>
    </tr>
  );
}

function FlaggedCell({ fraud }: { fraud: Referral["fraud"] }) {
  if (!fraud.flagged) {
    return <StatusPill tone="neutral">No</StatusPill>;
  }

  return (
    <div>
      <StatusPill tone="danger">Yes</StatusPill>
      {fraud.types.length > 0 ? (
        <span className="mt-0.5 block text-xs text-ink-muted">
          {fraud.types.join(", ")}
        </span>
      ) : fraud.status !== "NONE" ? (
        <span className="mt-0.5 block text-xs text-ink-muted">{fraud.status}</span>
      ) : null}
    </div>
  );
}

function UserCell({ user }: { user: Referral["referrer"] }) {
  return (
    <div className="min-w-[10rem] max-w-[14rem]">
      <p className="truncate font-medium text-ink">{user.name ?? "—"}</p>
      <p className="truncate text-xs text-ink-muted">{user.email ?? user.userId}</p>
    </div>
  );
}

function EmptyResults({
  hasReferrals,
  payoutOnly,
  codeQuery,
}: {
  hasReferrals: boolean;
  payoutOnly: boolean;
  codeQuery: string;
}) {
  if (!hasReferrals) {
    return (
      <p className="rounded-lg border border-dashed border-card-border px-4 py-10 text-center text-sm text-ink-secondary">
        No referrals yet. They appear when users sign up through a referral link or
        code.
      </p>
    );
  }

  const message =
    codeQuery.trim() && payoutOnly
      ? `No referrals match “${codeQuery.trim()}” with a payout.`
      : codeQuery.trim()
        ? `No referrals match “${codeQuery.trim()}”.`
        : "No referrals with a payout yet.";

  return (
    <p className="rounded-lg border border-dashed border-card-border px-4 py-10 text-center text-sm text-ink-secondary">
      {message}
    </p>
  );
}

function Th({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-xs font-medium uppercase tracking-wider text-ink-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 align-top", className)}>{children}</td>;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M13.5 13.5L17 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
