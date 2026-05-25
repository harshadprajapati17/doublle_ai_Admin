"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ReferralDetailDrawer } from "@/components/referrals/referral-detail-drawer";
import { StatusPill } from "@/components/ui/dashboard";
import {
  canRejectReferral,
  rejectReferral,
  rejectNotePreview,
} from "@/lib/referrals/decision";
import {
  referralUserPrimary,
  referralUserSecondary,
} from "@/lib/referrals/format-user";
import {
  referralHasRecordedPayout,
  referralLifecycleLabel,
  referralLifecycleStage,
} from "@/lib/referrals/lifecycle";
import type { Referral } from "@/lib/referrals/types";
import { FLUID_PAGE_X } from "@/lib/dashboard/fluid-spacing";
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

function attributionTone(status: string): "success" | "danger" | "neutral" {
  if (status === "ACTIVE") return "success";
  if (status === "TERMINATED") return "danger";
  return "neutral";
}

function lifecycleTone(stage: ReturnType<typeof referralLifecycleStage>) {
  return stage === "paid" ? "success" : "neutral";
}

function filterReferrals(
  referrals: Referral[],
  codeQuery: string,
  payoutOnly: boolean,
) {
  const query = codeQuery.trim().toLowerCase();

  return referrals.filter((referral) => {
    if (payoutOnly && !referralHasRecordedPayout(referral)) return false;
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
  const router = useRouter();
  const [items, setItems] = useState(referrals);
  const [codeQuery, setCodeQuery] = useState("");
  const [payoutOnly, setPayoutOnly] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(referrals);
  }, [referrals]);

  const filtered = useMemo(
    () => filterReferrals(items, codeQuery, payoutOnly),
    [items, codeQuery, payoutOnly],
  );

  const paidCount = useMemo(
    () => items.filter(referralHasRecordedPayout).length,
    [items],
  );

  async function handleReject(referral: Referral) {
    setRejectingId(referral.id);
    const result = await rejectReferral(referral);
    setRejectingId(null);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    setItems((current) =>
      current.map((row) =>
        row.id === referral.id
          ? {
              ...row,
              status: "TERMINATED",
              terminatedAt: new Date().toISOString(),
              terminationReason: rejectNotePreview(referral.fraud),
            }
          : row,
      ),
    );
    setSelectedReferral((current) =>
      current?.id === referral.id
        ? {
            ...current,
            status: "TERMINATED",
            terminatedAt: new Date().toISOString(),
            terminationReason: rejectNotePreview(referral.fraud),
          }
        : current,
    );
    toast.success("Referral rejected");
    router.refresh();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TableToolbar
        codeQuery={codeQuery}
        onCodeQueryChange={setCodeQuery}
        payoutOnly={payoutOnly}
        onPayoutOnlyChange={setPayoutOnly}
        paidCount={paidCount}
        shownCount={filtered.length}
        totalCount={items.length}
      />

      {filtered.length === 0 ? (
        <div
          className={cn(
            "flex flex-1 items-center justify-center py-10",
            FLUID_PAGE_X,
          )}
        >
          <EmptyResults
            hasReferrals={items.length > 0}
            payoutOnly={payoutOnly}
            codeQuery={codeQuery}
          />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="border-y border-card-border bg-surface/90 shadow-[0_1px_0_0_var(--color-card-border)]">
                <Th>Attribution</Th>
                <Th>Stage</Th>
                <Th>Flagged</Th>
                <Th>Referrer</Th>
                <Th>Referee</Th>
                <Th>Created</Th>
                <Th className="text-right">Payout</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((referral) => (
                <ReferralRow
                  key={referral.id}
                  referral={referral}
                  rejecting={rejectingId === referral.id}
                  onReject={() => handleReject(referral)}
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

function TableToolbar({
  codeQuery,
  onCodeQueryChange,
  payoutOnly,
  onPayoutOnlyChange,
  paidCount,
  shownCount,
  totalCount,
}: {
  codeQuery: string;
  onCodeQueryChange: (value: string) => void;
  payoutOnly: boolean;
  onPayoutOnlyChange: (value: boolean) => void;
  paidCount: number;
  shownCount: number;
  totalCount: number;
}) {
  return (
    <div
      className={cn(
        "shrink-0 border-b border-accent/10 bg-accent-soft/50 py-5 sm:py-6",
        FLUID_PAGE_X,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <label htmlFor="referral-code-search" className="sr-only">
            Search by referral code
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent/70"
            aria-hidden
          />
          <input
            id="referral-code-search"
            type="search"
            value={codeQuery}
            onChange={(event) => onCodeQueryChange(event.target.value)}
            placeholder="Search referral code…"
            className="w-full rounded-lg border border-accent/15 bg-card py-2.5 pl-10 pr-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink-muted focus:border-accent focus:ring-2 focus:ring-accent/15"
          />
        </div>

        <div
          className="flex flex-wrap items-center gap-2 lg:justify-end"
          role="group"
          aria-label="Referral filters"
        >
          <FilterToggle
            pressed={payoutOnly}
            onPressedChange={onPayoutOnlyChange}
            label="Paid only"
            count={paidCount}
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-secondary">
        Showing{" "}
        <span className="font-semibold tabular-nums text-accent">
          {shownCount}
        </span>{" "}
        of{" "}
        <span className="font-medium tabular-nums text-ink">{totalCount}</span>
        <span className="mx-2 text-accent/25">·</span>
        <span className="text-ink-muted">
          Click a row to view code, link, and full details
        </span>
      </p>
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
          ? "border-accent bg-accent text-white shadow-sm"
          : "border-accent/15 bg-card text-ink-secondary hover:border-accent/30 hover:bg-accent-soft/40 hover:text-ink",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
          pressed ? "bg-white/25 text-white" : "bg-accent-soft text-accent",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function ReferralRow({
  referral,
  rejecting,
  onReject,
  onSelect,
}: {
  referral: Referral;
  rejecting: boolean;
  onReject: () => void;
  onSelect: () => void;
}) {
  const rejectable = canRejectReferral(referral);
  const stage = referralLifecycleStage(referral.payment);
  const hasPayoutAmount = Number.parseFloat(referral.payment.totalPaidAmount) > 0;

  return (
    <tr
      className="group cursor-pointer border-b border-card-border/80 transition last:border-b-0 hover:bg-surface/50"
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
        <StatusPill tone={attributionTone(referral.status)}>
          {referral.status}
        </StatusPill>
      </Td>
      <Td>
        <StatusPill tone={lifecycleTone(stage)}>
          {referralLifecycleLabel(stage)}
        </StatusPill>
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
          className="whitespace-nowrap tabular-nums text-ink-secondary"
        >
          {formatShortDate(referral.createdAt)}
        </span>
      </Td>
      <Td className="text-right">
        {hasPayoutAmount ? (
          <>
            <span className="font-semibold tabular-nums text-ink">
              {referral.payment.totalPaidAmount}
            </span>
            <span className="ml-1 text-ink-muted">{referral.payment.currency}</span>
          </>
        ) : (
          <span className="text-ink-muted">—</span>
        )}
      </Td>
      <Td className="text-right">
        {rejectable ? (
          <RejectButton
            rejecting={rejecting}
            note={rejectNotePreview(referral.fraud)}
            onReject={onReject}
          />
        ) : (
          <span className="text-xs text-ink-muted">—</span>
        )}
      </Td>
    </tr>
  );
}

function RejectButton({
  rejecting,
  note,
  onReject,
}: {
  rejecting: boolean;
  note: string;
  onReject: () => void;
}) {
  return (
    <button
      type="button"
      disabled={rejecting}
      title={note}
      aria-label={`Reject referral. Note: ${note}`}
      onClick={(event) => {
        event.stopPropagation();
        onReject();
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
        rejecting
          ? "cursor-wait border-card-border bg-surface text-ink-muted"
          : "border-red-200 bg-red-50 text-red-800 hover:border-red-300 hover:bg-red-100",
      )}
    >
      {rejecting ? "Rejecting…" : "Reject"}
    </button>
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
        <span className="mt-1 block text-xs text-ink-muted">
          {fraud.types.join(", ")}
        </span>
      ) : fraud.status !== "NONE" ? (
        <span className="mt-1 block text-xs text-ink-muted">{fraud.status}</span>
      ) : null}
    </div>
  );
}

function UserCell({ user }: { user: Referral["referrer"] }) {
  const primary = referralUserPrimary(user);
  const secondary = referralUserSecondary(user);

  return (
    <div className="min-w-[10rem] max-w-[14rem]">
      <p className="truncate font-medium text-ink">{primary}</p>
      {secondary ? (
        <p className="truncate text-xs text-ink-muted">{secondary}</p>
      ) : null}
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
      ? `No referrals match “${codeQuery.trim()}” with a paid stage.`
      : codeQuery.trim()
        ? `No referrals match “${codeQuery.trim()}”.`
        : "No paid referrals yet.";

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
  children?: ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-xs font-medium uppercase tracking-wider text-ink-muted first:pl-6 last:pr-6 sm:first:pl-8 sm:last:pr-8 lg:first:pl-10 lg:last:pr-10",
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
  return (
    <td
      className={cn(
        "px-4 py-3.5 align-top first:pl-6 last:pr-6 sm:first:pl-8 sm:last:pr-8 lg:first:pl-10 lg:last:pr-10",
        className,
      )}
    >
      {children}
    </td>
  );
}
