import Link from "next/link";
import type { Program } from "@/lib/programs/types";

export function ProgramsList({ programs }: { programs: Program[] }) {
  if (programs.length === 0) {
    return (
      <p className="mt-4 text-sm text-zinc-600">
        No programs yet. Create your first referral program below.
      </p>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-zinc-100 rounded-lg border border-zinc-200">
      {programs.map((program) => (
        <li key={program.id}>
          <Link
            href={`/dashboard/programs/${program.id}`}
            className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-zinc-50"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-zinc-900">{program.name}</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {program.referrerRewardPct}% · {program.currency} · v
                {program.termsVersion}
              </p>
            </div>
            <ProgramStatusBadge status={program.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ProgramStatusBadge({ status }: { status: string }) {
  const styles =
    status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : status === "DRAFT"
        ? "bg-zinc-100 text-zinc-700 ring-zinc-200"
        : "bg-amber-50 text-amber-800 ring-amber-200";

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles}`}
    >
      {status}
    </span>
  );
}
