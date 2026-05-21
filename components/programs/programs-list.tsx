import Link from "next/link";
import { StatusPill } from "@/components/ui/dashboard";
import type { Program } from "@/lib/programs/types";

function statusTone(status: string): "success" | "warning" | "neutral" {
  if (status === "ACTIVE") return "success";
  if (status === "DRAFT") return "neutral";
  return "warning";
}

export function ProgramsList({ programs }: { programs: Program[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {programs.map((program) => (
        <li key={program.id}>
          <Link
            href={`/dashboard/programs/${program.id}`}
            className="group flex items-center justify-between gap-4 rounded-xl border border-card-border bg-surface/30 px-4 py-4 transition hover:border-ink/15 hover:bg-card"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink group-hover:text-accent">
                {program.name}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                {program.referrerRewardPct}% reward · {program.currency} · v
                {program.termsVersion}
              </p>
            </div>
            <StatusPill tone={statusTone(program.status)}>
              {program.status}
            </StatusPill>
          </Link>
        </li>
      ))}
    </ul>
  );
}
