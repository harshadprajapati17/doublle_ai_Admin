import { cn } from "@/lib/utils";
import {
  buildUnifiedProgramSummary,
  type CommissionStateMetric,
  type ProgramSummaryGlanceItem,
  type ProgramSummaryViewOptions,
  type SummaryDetailRow,
  type SummaryMetric,
  type UnifiedProgramSummary,
} from "@/lib/programs/summary-metrics";
import type { ProgramSummary } from "@/lib/programs/types";

function parseMetricValue(value: string): number {
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function HeadlineMetric({
  metric,
  layout,
}: {
  metric: SummaryMetric;
  layout: "page" | "drawer" | "featured";
}) {
  return (
    <div className="min-w-0 px-5 py-4 sm:px-6">
      <p className="text-sm font-semibold text-ink">{metric.label}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        {metric.helpText}
      </p>
      <p
        className={cn(
          "mt-3 font-semibold tracking-tight text-ink tabular-nums",
          layout === "featured" ? "text-4xl" : "text-3xl",
        )}
      >
        {metric.value}
      </p>
    </div>
  );
}

function StatusBreakdownCell({
  metric,
  emphasize,
}: {
  metric: SummaryMetric;
  emphasize?: boolean;
}) {
  const count = parseMetricValue(metric.value);
  const isActive = metric.id === "referralsByStatus.ACTIVE";
  const isNeedsReview = metric.id === "fraudReview.flagged";
  const showInactiveHint = isActive && count === 0;
  const showClearHint = isNeedsReview && count === 0;

  return (
    <div
      className={cn(
        "min-w-0 px-4 py-3.5 sm:px-5",
        emphasize && "bg-accent/5",
      )}
      title={metric.helpText}
    >
      <p
        className={cn(
          "text-xs font-medium",
          emphasize ? "text-accent" : "text-ink-muted",
        )}
      >
        {metric.label}
      </p>
      <p
        className={cn(
          "mt-1 font-semibold tabular-nums",
          emphasize ? "text-2xl text-ink" : "text-lg text-ink-secondary",
        )}
      >
        {metric.value}
      </p>
      {showInactiveHint ? (
        <p className="mt-1 text-xs font-medium text-ink-muted">None active</p>
      ) : showClearHint ? (
        <p className="mt-1 text-xs font-medium text-ink-muted">Queue clear</p>
      ) : (
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-ink-muted">
          {metric.helpText}
        </p>
      )}
    </div>
  );
}

function DefaultDetailRow({ row }: { row: SummaryDetailRow & { variant: "default" } }) {
  const lifecycleRow = row.label === "Lifecycle";

  return (
    <div className="border-t border-card-border">
      <p className="bg-surface/60 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted sm:px-6">
        {row.label}
      </p>
      <dl className="grid grid-cols-1 divide-y divide-card-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {row.metrics.map((metric) => (
          <StatusBreakdownCell
            key={metric.id}
            metric={metric}
            emphasize={
              (lifecycleRow && metric.id === "referralsByStatus.ACTIVE") ||
              (row.label === "Fraud review" &&
                metric.id === "fraudReview.flagged")
            }
          />
        ))}
      </dl>
    </div>
  );
}

function CommissionDetailRow({
  row,
}: {
  row: SummaryDetailRow & { variant: "commission" };
}) {
  return (
    <div className="border-t border-card-border">
      <p className="bg-surface/60 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted sm:px-6">
        {row.label}
      </p>
      <dl className="grid grid-cols-2 divide-x divide-y divide-card-border sm:grid-cols-4 sm:divide-y-0">
        {row.metrics.map((metric: CommissionStateMetric) => (
          <div
            key={metric.id}
            className="min-w-0 px-4 py-3.5 sm:px-5"
            title={metric.helpText}
          >
            <p className="text-xs font-medium text-ink-muted">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-ink">
              {metric.value}
            </p>
            <p className="text-sm tabular-nums text-ink-secondary">
              {metric.amount}
            </p>
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-ink-muted">
              {metric.helpText}
            </p>
          </div>
        ))}
      </dl>
    </div>
  );
}

function glanceChipClass(tone: ProgramSummaryGlanceItem["tone"]) {
  return cn(
    "inline-flex items-baseline gap-1.5 rounded-lg px-2.5 py-1.5 ring-1 ring-inset",
    tone === "caution" && "bg-amber-50 ring-amber-200/80",
    tone === "muted" && "bg-surface/80 ring-card-border",
    tone === "default" && "bg-card ring-card-border",
  );
}

function GlanceChip({ item }: { item: ProgramSummaryGlanceItem }) {
  return (
    <li className={glanceChipClass(item.tone)}>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          item.tone === "caution" ? "text-amber-900" : "text-ink",
        )}
      >
        {item.value}
      </span>
      <span
        className={cn(
          "text-xs",
          item.tone === "caution" ? "text-amber-800/80" : "text-ink-secondary",
        )}
      >
        {item.label}
      </span>
    </li>
  );
}

function AtAGlanceBar({ glance }: { glance: UnifiedProgramSummary["glance"] }) {
  return (
    <div
      className={cn(
        "border-b border-card-border px-5 py-4 sm:px-6",
        glance.tone === "attention"
          ? "bg-accent-soft/40"
          : "bg-surface/50",
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        At a glance
      </p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {glance.items.map((item) => (
          <GlanceChip key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function UnifiedSummaryCard({
  view,
  layout,
}: {
  view: UnifiedProgramSummary;
  layout: "page" | "drawer" | "featured";
}) {
  const headlineCols =
    view.headlines.length >= 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-2";

  return (
    <article className="overflow-hidden rounded-xl border border-card-border bg-card shadow-(--shadow-card)">
      <AtAGlanceBar glance={view.glance} />

      <div
        className={cn(
          "grid divide-y divide-card-border border-b border-card-border sm:divide-x sm:divide-y-0",
          headlineCols,
        )}
      >
        {view.headlines.map((metric) => (
          <HeadlineMetric key={metric.id} metric={metric} layout={layout} />
        ))}
      </div>

      {view.sections.map((section) => (
        <section key={section.id} className="border-b border-card-border last:border-b-0">
          <header className="px-5 py-3 sm:px-6">
            <h4 className="text-sm font-semibold text-ink">{section.title}</h4>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
              {section.description}
            </p>
          </header>

          {section.rows.map((row) =>
            row.variant === "commission" ? (
              <CommissionDetailRow key={`${section.id}-${row.label}`} row={row} />
            ) : (
              <DefaultDetailRow key={`${section.id}-${row.label}`} row={row} />
            ),
          )}
        </section>
      ))}
    </article>
  );
}

export function ProgramSummarySection({
  summary,
  title = "Program summary",
  description = "Referrals and commissions attributed to this program.",
  includeTermsAcceptances,
  viewOptions,
  embedded = false,
  variant = "default",
}: {
  summary: ProgramSummary;
  title?: string;
  description?: string;
  /** @deprecated Use viewOptions.includeTermsAcceptances */
  includeTermsAcceptances?: boolean;
  viewOptions?: ProgramSummaryViewOptions;
  embedded?: boolean;
  variant?: "default" | "featured";
}) {
  const layout = embedded ? "drawer" : variant === "featured" ? "featured" : "page";
  const resolvedViewOptions: ProgramSummaryViewOptions | undefined =
    viewOptions ??
    (includeTermsAcceptances ? { includeTermsAcceptances: true } : undefined);
  const view = buildUnifiedProgramSummary(summary, resolvedViewOptions);

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

      <div className={cn(embedded ? "mt-5" : variant === "featured" ? "mt-5" : "mt-6")}>
        <UnifiedSummaryCard view={view} layout={layout} />
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
