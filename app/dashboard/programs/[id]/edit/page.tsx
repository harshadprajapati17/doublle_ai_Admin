import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateProgramForm } from "@/components/programs/create-program-form";
import { DashboardContent } from "@/components/dashboard-shell";
import { fetchProgramById } from "@/lib/programs/fetch-program";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProgramPage({ params }: PageProps) {
  const { id } = await params;

  const result = await fetchProgramById(id);

  if (!result.ok) {
    if (result.status === 404) {
      notFound();
    }

    return (
      <DashboardContent>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-800">{result.message}</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm font-medium text-red-900 underline"
          >
            Back to dashboard
          </Link>
        </div>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CreateProgramForm program={result.program} />
    </DashboardContent>
  );
}
