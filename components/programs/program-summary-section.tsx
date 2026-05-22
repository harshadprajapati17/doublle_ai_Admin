import { DetailGrid } from "@/components/ui/dashboard";
import { cn } from "@/lib/utils";
import {
  COMMISSION_STATE_ORDER,
  commissionStateLabel,
  formatCount,
  formatMoney,
  summaryToGridItems,
} from "@/lib/programs/format-summary";
import type { ProgramSummary } from "@/lib/programs/types";

function SummaryMetrics({
  summary,
  includeTermsAcceptances,
  layout,
}: {
  summary: ProgramSummary;
  includeTermsAcceptances?: boolean;
  layout: "page" | "drawer" | "featured";
}) {
  const items = summaryToGridItems(summary, { includeTermsAcceptances });

  if (layout === "page") {
    return <DetailGrid items={items} />;
  }

  if (layout === "featured") {
    return (
      <dl className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-card-border bg-card px-5 py-4 shadow-(--shadow-card)"
          >
            <dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              {item.label}
            </dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-ink tabular-nums">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-card-border bg-surface/50 px-4 py-3.5"
        >
          <dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            {item.label}
          </dt>
          <dd className="mt-2 text-xl font-semibold tracking-tight text-ink tabular-nums">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CommissionBreakdown({
  summary,
  layout,
}: {
  summary: ProgramSummary;
  layout: "page" | "drawer" | "featured";
}) {
  const states = COMMISSION_STATE_ORDER.filter(
    (state) => summary.commissionsByState[state],
  );

  if (states.length === 0) return null;

  return (
    <dl
      className={cn(
        layout === "drawer" && "grid grid-cols-2 gap-3",
        layout === "page" &&
          "mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4",
        layout === "featured" &&
          "grid grid-cols-2 gap-3 sm:grid-cols-4",
      )}
    >
      {states.map((state) => {
        const entry = summary.commissionsByState[state]!;
        const cardClass =
          layout === "drawer" || layout === "featured"
            ? "min-w-0 rounded-xl border border-card-border bg-card px-4 py-3.5"
            : "min-w-0";

        return (
          <div key={state} className={cardClass}>
            <dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              {commissionStateLabel(state)}
            </dt>
            <dd
              className={cn(
                "mt-2 font-semibold text-ink tabular-nums",
                layout === "featured" ? "text-xl" : "text-lg",
              )}
            >
              {formatCount(entry.count)}
            </dd>
            <dd className="mt-0.5 text-sm text-ink-secondary tabular-nums">
              {formatMoney(entry.amount, summary.currency)}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function ProgramSummarySection({
  summary,
  title = "Program summary",
  description = "Referrals and commissions attributed to this program.",
  includeTermsAcceptances = false,
  embedded = false,
  variant = "default",
}: {
  summary: ProgramSummary;
  title?: string;
  description?: string;
  includeTermsAcceptances?: boolean;
  /** When true, omits outer section border (e.g. inside a drawer). */
  embedded?: boolean;
  /** Featured elevates metrics for the program detail page. */
  variant?: "default" | "featured";
}) {
  const layout = embedded ? "drawer" : variant === "featured" ? "featured" : "page";

  const content = (
    <>
      <h3
        className={cn(
          "font-semibold text-ink",
          variant === "featured" ? "text-base" : "text-sm",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "leading-relaxed text-ink-secondary",
          variant === "featured" ? "mt-1.5 text-sm" : "mt-1 text-sm",
        )}
      >
        {description}
      </p>

      <div
        className={cn(
          embedded ? "mt-5 space-y-5" : variant === "featured" ? "mt-5 space-y-5" : "mt-6",
        )}
      >
        <SummaryMetrics
          summary={summary}
          includeTermsAcceptances={includeTermsAcceptances}
          layout={layout}
        />
        <CommissionBreakdown summary={summary} layout={layout} />
      </div>
    </>
  );

  if (embedded) {
    return (
      <section className="border-t border-card-border pt-6">{content}</section>
    );
  }

  if (variant === "featured") {
    return <section>{content}</section>;
  }

  return (
    <section className="border-t border-card-border pt-8">{content}</section>
  );
}
