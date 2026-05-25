"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ProgramDetailCard } from "@/components/programs/program-detail-card";
import { ProgramDetailSkeleton } from "@/components/programs/program-detail-skeleton";
import {
  CardBody,
  EmptyState,
  ErrorBanner,
  PrimaryButton,
  SurfaceCard,
} from "@/components/ui/dashboard";
import { programDetailApiPath } from "@/lib/programs/constants";
import { parseProgramDetail } from "@/lib/programs/parse-program";
import type {
  ApiErrorBody,
  ProgramDetail,
  ProgramListResponse,
} from "@/lib/programs/types";

type SectionState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "ok"; program: ProgramDetail };

export function ProgramsDashboardSection() {
  const [state, setState] = useState<SectionState>({ status: "loading" });

  const load = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setState({ status: "loading" });
    }

    try {
      const listResponse = await fetch("/api/admin/programs?limit=1", {
        cache: "no-store",
      });
      const listPayload = (await listResponse.json().catch(() => ({}))) as ProgramListResponse &
        ApiErrorBody;

      if (!listResponse.ok) {
        setState({
          status: "error",
          message: listPayload.error?.message ?? "Could not load programs.",
        });
        return;
      }

      const programId = listPayload.data?.[0]?.id;
      if (!programId) {
        setState({ status: "empty" });
        return;
      }

      const detailResponse = await fetch(programDetailApiPath(programId), {
        cache: "no-store",
      });
      const detailPayload = (await detailResponse.json().catch(() => ({}))) as {
        data?: Record<string, unknown>;
      } & ApiErrorBody;

      if (!detailResponse.ok || !detailPayload.data) {
        setState({
          status: "error",
          message:
            detailPayload.error?.message ?? "Failed to load program details.",
        });
        return;
      }

      const program = parseProgramDetail(detailPayload.data);
      if (!program.id) {
        setState({
          status: "error",
          message: "Program response was missing an id.",
        });
        return;
      }

      setState({ status: "ok", program });
    } catch {
      setState({
        status: "error",
        message: "Unable to reach the server. Please try again.",
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (state.status === "loading") {
    return <ProgramDetailSkeleton />;
  }

  if (state.status === "error") {
    return (
      <SurfaceCard variant="embedded">
        <CardBody>
          <ErrorBanner message={state.message} />
          <button
            type="button"
            onClick={() => load()}
            className="mt-4 text-sm font-medium text-accent hover:underline"
          >
            Try again
          </button>
        </CardBody>
      </SurfaceCard>
    );
  }

  if (state.status === "empty") {
    return (
      <SurfaceCard variant="embedded">
        <EmptyState
          variant="fluid"
          title="No programs yet"
          description="Launch a referral program to reward referrers, credit new users, and attribute every signup."
          action={
            <PrimaryButton
              href="/dashboard/programs/new"
              className="bg-accent shadow-sm hover:bg-accent/90"
            >
              <Plus className="size-4" aria-hidden />
              Create program
            </PrimaryButton>
          }
        />
      </SurfaceCard>
    );
  }

  return (
    <ProgramDetailCard
      program={state.program}
      onActivated={() => load({ silent: true })}
    />
  );
}
