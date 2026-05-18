"use client";

import { useState } from "react";

type ReferralLinkCopyProps = {
  url: string;
  label?: string;
};

export function ReferralLinkCopy({ url, label = "Referral link" }: ReferralLinkCopyProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 truncate text-sm text-sky-700 underline-offset-2 hover:underline"
        >
          {url}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
