import type { ReactNode } from "react";
import Link from "next/link";
import { Percent, UserPlus } from "lucide-react";
import { FLUID_PAGE_X } from "@/lib/dashboard/fluid-spacing";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  density = "comfortable",
  tone = "default",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  density?: "comfortable" | "compact" | "fluid";
  tone?: "default" | "accent";
}) {
  const isFluid = density === "fluid";
  const isCompact = density === "compact" || isFluid;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className={cn(isCompact ? "min-w-0 flex-1" : "max-w-2xl")}>
        {eyebrow ? (
          tone === "accent" ? (
            <span className="inline-flex rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-accent ring-1 ring-accent/15">
              {eyebrow}
            </span>
          ) : (
            <p
              className={cn(
                "font-medium text-accent",
                isCompact ? "text-xs" : "text-sm",
              )}
            >
              {eyebrow}
            </p>
          )
        ) : null}
        <h1
          className={cn(
            "font-semibold tracking-tight text-ink",
            isFluid
              ? "text-lg leading-tight sm:text-xl"
              : isCompact
                ? "text-xl sm:text-2xl sm:leading-tight"
                : "text-3xl sm:text-[2rem] sm:leading-tight",
            eyebrow && !isFluid && (isCompact ? "mt-1" : "mt-2"),
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "text-ink-secondary",
            isFluid
              ? "mt-0.5 text-xs leading-snug"
              : isCompact
                ? "mt-1 text-sm leading-relaxed"
                : "mt-2 text-base leading-relaxed",
          )}
        >
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function SurfaceCard({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "inset" | "embedded";
}) {
  return (
    <section
      className={cn(
        variant === "embedded"
          ? "overflow-hidden bg-card"
          : "rounded-2xl border shadow-(--shadow-card)",
        variant === "default" && "border-card-border bg-card",
        variant === "muted" && "border-card-border bg-surface-raised/60",
        variant === "inset" && "border-card-border bg-surface",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  badge,
  title,
  description,
  className,
}: {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-card-border px-6 py-5 sm:px-8", className)}>
      {badge ? (
        <span className="inline-flex rounded-full border border-card-border bg-surface px-2.5 py-0.5 text-xs font-medium text-ink-secondary">
          {badge}
        </span>
      ) : null}
      <h2
        className={cn(
          "text-lg font-semibold tracking-tight text-ink",
          badge && "mt-3",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-6 py-5 sm:px-8", className)}>{children}</div>;
}

export function MetricStrip({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl className="grid gap-6 sm:grid-cols-3 sm:divide-x sm:divide-card-border">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(index > 0 && "sm:px-6", index === 0 && "sm:pr-6")}
        >
          <dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            {item.label}
          </dt>
          <dd className="mt-1.5 text-sm font-semibold text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailGrid({
  items,
  size = "default",
}: {
  items: { label: string; value: string }[];
  size?: "default" | "compact";
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
        size === "compact"
          ? "gap-x-6 gap-y-4"
          : "gap-x-8 gap-y-8",
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            {item.label}
          </dt>
          <dd
            className={cn(
              "tabular-nums",
              size === "compact"
                ? "mt-1 text-sm font-medium text-ink-secondary"
                : "mt-2 text-lg font-semibold tracking-tight text-ink",
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function PrimaryButton({
  children,
  className,
  href,
  ...props
}: React.ComponentProps<"button"> & { href?: string }) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  href,
  ...props
}: React.ComponentProps<"button"> & { href?: string }) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg border border-card-border bg-card px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function ReferralProgramEmptyIllustration() {
  return (
    <div
      className="relative flex size-[4.5rem] items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 via-accent-soft to-card shadow-sm ring-1 ring-accent/15"
      aria-hidden
    >
      <UserPlus className="size-9 text-accent" strokeWidth={1.5} />
      <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-card text-accent shadow-sm ring-2 ring-card">
        <Percent className="size-3.5" strokeWidth={2.5} />
      </span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  illustration,
  className,
  variant = "fluid",
}: {
  title: string;
  description: string;
  action?: ReactNode;
  illustration?: ReactNode;
  className?: string;
  /** `fluid` fills the parent panel edge-to-edge; `inset` is a nested card. */
  variant?: "fluid" | "inset";
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-gradient-to-b from-accent-soft/70 via-card to-card text-center",
        variant === "fluid" &&
          "flex min-h-[min(28rem,50vh)] flex-col items-center justify-center py-16 sm:py-20",
        variant === "inset" &&
          "rounded-2xl border border-card-border px-6 py-12 shadow-(--shadow-card) sm:px-10 sm:py-14",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 size-48 rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />

      <div
        className={cn(
          "relative mx-auto flex w-full max-w-lg flex-col items-center",
          variant === "fluid" && FLUID_PAGE_X,
        )}
      >
        {illustration ?? <ReferralProgramEmptyIllustration />}

        <h3 className="mt-6 text-base font-semibold tracking-tight text-ink sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">
          {description}
        </p>

        {action ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "neutral";
}) {
  const tones = {
    success: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
    warning: "bg-amber-50 text-amber-800 ring-amber-200/80",
    danger: "bg-red-50 text-red-800 ring-red-200/80",
    neutral: "bg-surface text-ink-secondary ring-card-border",
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
