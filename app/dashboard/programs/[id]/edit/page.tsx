import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateProgramForm } from "@/components/programs/create-program-form";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";
import type { Program } from "@/lib/programs/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProgramPage({ params }: PageProps) {
  const { id } = await params;

  const upstream = await adminUpstreamFetch(
    `/api/v1/admin/programs/${encodeURIComponent(id)}`,
    { method: "GET" },
  );

  const payload = await parseUpstreamJson<{ data?: Program; error?: { message?: string } }>(
    upstream,
  );

  if (!upstream.ok || !payload.data) {
    if (upstream.status === 404) {
      notFound();
    }

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-800">
          {payload.error?.message ?? "Failed to load program."}
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm font-medium text-red-900 underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <CreateProgramForm program={payload.data} />;
}
