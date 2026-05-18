import Link from "next/link";
import { ProgramsList } from "@/components/programs/programs-list";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";
import type { ProgramListResponse } from "@/lib/programs/types";

export default async function DashboardPage() {
  const upstream = await adminUpstreamFetch(
    "/api/v1/admin/programs?limit=20",
    { method: "GET" },
  );

  const payload = await parseUpstreamJson<ProgramListResponse>(upstream);
  const programs = upstream.ok ? (payload.data ?? []) : [];
  const listError =
    !upstream.ok ? (payload.error?.message ?? "Could not load programs.") : null;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Manage referral programs, rewards, and attribution rules.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Referral programs
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Configure referrer rewards, attribution rules, and referee
              incentives.
            </p>
          </div>
          <Link
            href="/dashboard/programs/new"
            className="inline-flex shrink-0 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Create program
          </Link>
        </div>
        {listError ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {listError}
          </p>
        ) : (
          <ProgramsList programs={programs} />
        )}
      </section>
    </div>
  );
}
