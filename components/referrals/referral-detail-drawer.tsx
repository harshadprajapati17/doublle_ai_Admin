"use client";

import type { ReactNode } from "react";
import { CopyField } from "@/components/referrals/copy-field";
import { Drawer } from "@/components/ui/drawer";
import { StatusPill } from "@/components/ui/dashboard";
import { buildReferralLink } from "@/lib/referrals/build-referral-link";
import { formatReferralUserDetail } from "@/lib/referrals/format-user";
import {
  referralLifecycleLabel,
  referralLifecycleStage,
} from "@/lib/referrals/lifecycle";
import type { Referral } from "@/lib/referrals/types";
import { cn } from "@/lib/utils";

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

export function ReferralDetailDrawer({
  referral,
  referralAppOrigin,
  open,
  onClose,
}: {
  referral: Referral | null;
  referralAppOrigin: string;
  open: boolean;
  onClose: () => void;
}) {
  const link =
    referral?.code != null
      ? buildReferralLink(referralAppOrigin, referral.code)
      : null;

  return (
    <Drawer
      open={open && referral != null}
      onClose={onClose}
      title={referral ? referral.code : "Referral"}
      description={
        referral
          ? `${referral.referrer.name ?? "Referrer"} → ${referral.referee.name ?? "Referee"}`
          : undefined
      }
    >
      {referral ? (
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone={statusTone(referral.status)}>{referral.status}</StatusPill>
            <StatusPill tone={referral.fraud.flagged ? "danger" : "neutral"}>
              {referral.fraud.flagged ? "Flagged" : "Not flagged"}
            </StatusPill>
          </div>

          {referral.code ? (
            <CopyField label="Referral code" value={referral.code} />
          ) : null}
          {link ? <CopyField label="Referral link" value={link} /> : null}

          <DetailSection title="People">
            <DetailRow
              label="Referrer"
              value={formatReferralUserDetail(referral.referrer)}
            />
            <DetailRow
              label="Referee"
              value={formatReferralUserDetail(referral.referee)}
            />
          </DetailSection>

          <DetailSection title="Payment">
            <DetailRow
              label="Stage"
              value={referralLifecycleLabel(
                referralLifecycleStage(referral.payment),
              )}
            />
            <DetailRow
              label="Total paid"
              value={`${referral.payment.totalPaidAmount} ${referral.payment.currency}`}
            />
            <DetailRow
              label="Captures"
              value={String(referral.payment.capturedPaymentCount)}
            />
            <DetailRow
              label="First paid"
              value={
                referral.payment.firstPaidAt
                  ? formatFullDate(referral.payment.firstPaidAt)
                  : "—"
              }
            />
          </DetailSection>

          <DetailSection title="Fraud">
            <DetailRow label="Status" value={referral.fraud.status} />
            <DetailRow
              label="Signals"
              value={
                referral.fraud.types.length > 0
                  ? referral.fraud.types.join(", ")
                  : "—"
              }
            />
            {referral.fraud.maxScore != null ? (
              <DetailRow label="Max score" value={referral.fraud.maxScore} />
            ) : null}
          </DetailSection>

          <DetailSection title="Attribution">
            <DetailRow label="Source" value={referral.attributionSource} />
            <DetailRow
              label="Program version"
              value={
                referral.programVersionAtAttribution != null
                  ? `v${referral.programVersionAtAttribution}`
                  : "—"
              }
            />
            <DetailRow label="Referee credit" value={referral.refereeCreditApplied ? "Yes" : "No"} />
            {referral.refereeCreditAppliedAt ? (
              <DetailRow
                label="Credit applied"
                value={formatFullDate(referral.refereeCreditAppliedAt)}
              />
            ) : null}
            <DetailRow label="IP" value={referral.ip ?? "—"} />
            {referral.userAgent ? (
              <DetailRow label="User agent" value={referral.userAgent} />
            ) : null}
          </DetailSection>

          <DetailSection title="Timeline">
            <DetailRow label="Created" value={formatFullDate(referral.createdAt)} />
            <DetailRow label="Updated" value={formatFullDate(referral.updatedAt)} />
            {referral.terminatedAt ? (
              <DetailRow
                label="Terminated"
                value={formatFullDate(referral.terminatedAt)}
              />
            ) : null}
            {referral.terminationReason ? (
              <DetailRow label="Termination reason" value={referral.terminationReason} />
            ) : null}
          </DetailSection>

          <DetailSection title="Identifiers">
            <DetailRow label="Referral ID" value={referral.id} mono />
            <DetailRow label="Program ID" value={referral.programId} mono />
          </DetailSection>
        </div>
      ) : null}
    </Drawer>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        {title}
      </h3>
      <dl className="mt-3 flex flex-col gap-3">{children}</dl>
    </section>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd
        className={cn(
          "mt-0.5 text-sm text-ink",
          mono && "break-all font-mono text-xs",
          !mono && "break-words",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
