"use client";

import { useCallback, useState } from "react";
import {
  buildUpdateProgramPayload,
  type CreateProgramFormValues,
  type ProgramPayloadOptions,
} from "@/lib/programs/schema";
import type { ApiErrorBody, Program } from "@/lib/programs/types";

type UpdateProgramResult =
  | { ok: true; program: Program }
  | { ok: false; message: string; status?: number };

export function useUpdateProgram() {
  const [isLoading, setIsLoading] = useState(false);

  const updateProgram = useCallback(
    async (
      programId: string,
      values: CreateProgramFormValues,
      options?: ProgramPayloadOptions,
    ): Promise<UpdateProgramResult> => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/admin/programs/${encodeURIComponent(programId)}`,
          {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(buildUpdateProgramPayload(values, options)),
          },
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
              "Failed to update program. Please check your inputs.",
          };
        }

        if (!data.data?.id) {
          return {
            ok: false,
            message: "Program was updated but the response was unexpected.",
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

  return { updateProgram, isLoading };
}
