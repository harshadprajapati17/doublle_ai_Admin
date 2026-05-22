"use client";

import { useCallback, useEffect, useState } from "react";
import { programDetailApiPath } from "@/lib/programs/constants";
import { parseProgramDetail } from "@/lib/programs/parse-program";
import type { ApiErrorBody, ProgramDetail } from "@/lib/programs/types";

type ProgramDetailState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; program: ProgramDetail };

export function useProgramDetail(programId: string) {
  const [state, setState] = useState<ProgramDetailState>({ status: "loading" });

  const load = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setState({ status: "loading" });
    }

    try {
      const response = await fetch(programDetailApiPath(programId), {
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => ({}))) as {
        data?: Record<string, unknown>;
      } & ApiErrorBody;

      if (!response.ok || !payload.data) {
        setState({
          status: "error",
          message:
            payload.error?.message ?? "Failed to load program details.",
        });
        return;
      }

      const program = parseProgramDetail(payload.data);
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
  }, [programId]);

  useEffect(() => {
    load();
  }, [load]);

  return { state, reload: load };
}
