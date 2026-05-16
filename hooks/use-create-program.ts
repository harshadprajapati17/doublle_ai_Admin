"use client";

import { useCallback, useState } from "react";
import type { ApiErrorBody, Program } from "@/lib/programs/types";
import { buildCreateProgramPayload } from "@/lib/programs/schema";
import type { CreateProgramFormValues } from "@/lib/programs/schema";

type CreateProgramResult =
  | { ok: true; program: Program }
  | { ok: false; message: string; status?: number };

export function useCreateProgram() {
  const [isLoading, setIsLoading] = useState(false);

  const createProgram = useCallback(
    async (values: CreateProgramFormValues): Promise<CreateProgramResult> => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/admin/programs", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(buildCreateProgramPayload(values)),
        });

        const data = (await response.json().catch(() => ({}))) as {
          data?: Program;
        } & ApiErrorBody;

        if (!response.ok) {
          return {
            ok: false,
            status: response.status,
            message:
              data.error?.message ??
              "Failed to create program. Please check your inputs.",
          };
        }

        if (!data.data?.id) {
          return {
            ok: false,
            message: "Program was created but the response was unexpected.",
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

  return { createProgram, isLoading };
}
