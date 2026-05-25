"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={className}>
      <p className="text-sm font-medium text-ink">{label}</p>
      <div className="mt-2 flex overflow-hidden rounded-lg border border-card-border bg-card shadow-sm">
        <input
          type="text"
          readOnly
          value={value}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink outline-none"
          aria-label={label}
        />
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1.5 border-l border-card-border bg-ink px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
        >
          <Copy className="size-4" aria-hidden />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
