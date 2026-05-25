"use client";

import Link from "next/link";
import { ProgramDetailCard } from "@/components/programs/program-detail-card";
import { ProgramDetailSkeleton } from "@/components/programs/program-detail-skeleton";
import { CardBody, ErrorBanner, SurfaceCard } from "@/components/ui/dashboard";
import { useProgramDetail } from "@/hooks/use-program-detail";

export function ProgramDetailLoader({ programId }: { programId: string }) {
  const { state, reload } = useProgramDetail(programId);

  if (state.status === "loading") {
    return <ProgramDetailSkeleton />;
  }

  if (state.status === "error") {
    return (
      <SurfaceCard variant="embedded">
        <CardBody>
          <ErrorBanner message={state.message} />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => reload()}
              className="text-sm font-medium text-accent hover:underline"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-ink-secondary hover:text-ink"
            >
              Back to programs
            </Link>
          </div>
        </CardBody>
      </SurfaceCard>
    );
  }

  return (
    <ProgramDetailCard
      program={state.program}
      onActivated={() => reload({ silent: true })}
    />
  );
}
