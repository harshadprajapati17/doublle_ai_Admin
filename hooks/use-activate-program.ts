"use client";

import { useCallback, useState } from "react";
import type { ApiErrorBody, Program } from "@/lib/programs/types";

type ActivateProgramResult =
  | { ok: true; program: Program }
  | { ok: false; message: string; status?: number };

export function useActivateProgram() {
  const [isLoading, setIsLoading] = useState(false);

  const activateProgram = useCallback(
    async (
      programId: string,
      options?: { force?: boolean },
    ): Promise<ActivateProgramResult> => {
      setIsLoading(true);

      try {
        const query = options?.force ? "?force=true" : "";
        const response = await fetch(
          `/api/admin/programs/${encodeURIComponent(programId)}/activate${query}`,
          { method: "POST" },
        );

        const data = (await response.json().catch(() => ({}))) as {
          data?: Program;
        } & ApiErrorBody;

        if (!response.ok) {
          return {
            ok: false,
            status: response.status,
            message:
              data.error?.message ??
              "Failed to activate program. Another program may already be active.",
          };
        }

        if (!data.data?.id) {
          return {
            ok: false,
            message: "Program was activated but the response was unexpected.",
          };
        }

        return { ok: true, program: data.data };
      } catch {
        return {
          ok: false,
          message: "Unable to reach the server. Please try again.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { activateProgram, isLoading };
}
