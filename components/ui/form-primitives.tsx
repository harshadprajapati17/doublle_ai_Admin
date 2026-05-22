"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-card-border bg-card p-6 shadow-(--shadow-card) sm:p-8">
      <header className="mb-6 border-b border-card-border pb-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-ink-secondary">{description}</p>
      </header>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

export function ProgramConfigCard({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-card-border bg-card p-6 shadow-(--shadow-card) sm:p-8">
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

export function ConfigZone({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-surface/60 p-5 sm:p-6">
      <div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-ink-secondary">{description}</p>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function metricSuffixPadding(suffix: string): string {
  if (suffix.length > 5) return "pr-28";
  if (suffix.length > 3) return "pr-20";
  return "pr-10";
}

export function MetricNumberField({
  id,
  label,
  suffix,
  hint,
  error,
  required,
  invalid,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  suffix?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  invalid?: boolean;
}) {
  const describedBy = [
    hint ? `${id}-hint` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <div
        className={cn(
          "flex flex-col rounded-xl border border-card-border bg-card px-4 py-3.5 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15",
          invalid && "border-red-400",
        )}
      >
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-wider text-ink-muted"
        >
          {label}
          {required ? <span className="text-red-600"> *</span> : null}
        </label>
        <div className="mt-2" aria-describedby={describedBy || undefined}>
          {suffix ? (
            <div className="relative">
              <input
                id={id}
                type="number"
                {...props}
                className={cn(
                  "w-full border-0 bg-transparent p-0 text-3xl font-semibold tracking-tight text-ink tabular-nums outline-none focus:ring-0",
                  metricSuffixPadding(suffix),
                  invalid && "text-red-700",
                )}
              />
              <span
                className={cn(
                  "pointer-events-none absolute bottom-1 right-0 font-medium text-ink-muted",
                  suffix.length > 3 ? "text-sm" : "text-lg",
                )}
                aria-hidden
              >
                {suffix}
              </span>
            </div>
          ) : (
            <input
              id={id}
              type="number"
              {...props}
              className={cn(
                "w-full border-0 bg-transparent p-0 text-3xl font-semibold tracking-tight text-ink tabular-nums outline-none focus:ring-0",
                invalid && "text-red-700",
              )}
            />
          )}
        </div>
        {error ? (
          <p id={`${id}-error`} className="mt-2 text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  helpId,
  help,
  error,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  helpId?: string;
  help?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const describedBy = [helpId, error ? `${htmlFor}-error` : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      <div aria-describedby={describedBy || undefined}>{children}</div>
      {help ? (
        <p id={helpId} className="text-xs text-ink-muted">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  className,
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-ink outline-none transition focus:ring-2",
        invalid
          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
          : "border-card-border focus:border-ink focus:ring-ink/10",
        className,
      )}
    />
  );
}

export function SelectInput({
  className,
  invalid,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  children: ReactNode;
}) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-ink outline-none transition focus:ring-2",
        invalid
          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
          : "border-card-border focus:border-ink focus:ring-ink/10",
        className,
      )}
    >
      {children}
    </select>
  );
}

export function NumberInput({
  className,
  invalid,
  suffix,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  suffix?: string;
}) {
  if (!suffix) {
    return <TextInput type="number" invalid={invalid} className={className} {...props} />;
  }

  return (
    <div className="relative">
      <TextInput
        type="number"
        invalid={invalid}
        className={cn("pr-10", className)}
        {...props}
      />
      <span
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-muted"
        aria-hidden
      >
        {suffix}
      </span>
    </div>
  );
}

export function CurrencyInput({
  currency,
  className,
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  currency: string;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-ink-muted">
        {currency}
      </span>
      <TextInput
        type="number"
        min={0}
        step="0.01"
        invalid={invalid}
        className={cn("pl-12", className)}
        {...props}
      />
    </div>
  );
}

export function RadioCardGroup<T extends string>({
  name,
  value,
  onChange,
  options,
  invalid,
}: {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; description: string }[];
  invalid?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-invalid={invalid}
      className="grid gap-3 sm:grid-cols-1"
    >
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        const checked = value === option.value;

        return (
          <label
            key={option.value}
            htmlFor={id}
            className={cn(
              "flex cursor-pointer gap-3 rounded-lg border p-4 transition",
              checked
                ? "border-ink bg-accent-soft ring-1 ring-ink"
                : "border-card-border hover:border-ink/20",
              invalid && !checked && "border-red-200",
            )}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="mt-0.5 size-4 shrink-0 accent-ink"
            />
            <span>
              <span className="block text-sm font-medium text-ink">
                {option.label}
              </span>
              <span className="mt-0.5 block text-xs text-ink-secondary">
                {option.description}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; disabled?: boolean }[];
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="inline-flex w-full flex-wrap gap-1 rounded-lg border border-card-border bg-surface p-1 sm:w-auto"
    >
      {options.map((option) => {
        const selected = value === option.value;
        const isDisabled = option.disabled === true;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) onChange(option.value);
            }}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition sm:flex-none",
              selected
                ? "bg-card text-ink shadow-sm"
                : "text-ink-secondary hover:text-ink",
              isDisabled && "cursor-not-allowed opacity-45 hover:text-ink-secondary",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-card-border bg-surface/80 px-4 py-3">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
        ) : null}
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-ink"
      />
    </div>
  );
}
