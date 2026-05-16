import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600">You are signed in.</p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-900">Referral programs</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Configure referrer rewards, attribution rules, and referee incentives.
        </p>
        <Link
          href="/dashboard/programs/new"
          className="mt-4 inline-flex rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Create referral program
        </Link>
      </section>
    </div>
  );
}
