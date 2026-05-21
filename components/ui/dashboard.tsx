import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-accent">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-[2rem] sm:leading-tight">
          {title}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-ink-secondary">
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
  variant?: "default" | "muted" | "inset";
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border shadow-(--shadow-card)",
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

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-card-border bg-surface/50 px-4 py-8 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-secondary">{description}</p>
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
