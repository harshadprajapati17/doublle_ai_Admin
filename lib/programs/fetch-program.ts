import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";
import { programDetailUpstreamPath } from "@/lib/programs/constants";
import { parseProgramDetail } from "@/lib/programs/parse-program";
import type { ProgramDetail, ProgramDetailResponse } from "@/lib/programs/types";

export type FetchProgramResult =
  | { ok: true; program: ProgramDetail }
  | { ok: false; status: number; message: string };

export async function fetchProgramById(
  programId: string,
): Promise<FetchProgramResult> {
  const upstream = await adminUpstreamFetch(programDetailUpstreamPath(programId), {
    method: "GET",
  });

  const payload = await parseUpstreamJson<ProgramDetailResponse>(upstream);

  if (!upstream.ok || !payload.data) {
    return {
      ok: false,
      status: upstream.status,
      message: payload.error?.message ?? "Failed to load program.",
    };
  }

  const program = parseProgramDetail(payload.data);

  if (!program.id) {
    return {
      ok: false,
      status: upstream.status,
      message: "Program response was missing an id.",
    };
  }

  return { ok: true, program };
}
