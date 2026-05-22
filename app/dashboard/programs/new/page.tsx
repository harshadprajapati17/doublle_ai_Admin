import { redirect } from "next/navigation";
import { CreateProgramForm } from "@/components/programs/create-program-form";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";
import type { ProgramListResponse } from "@/lib/programs/types";

export default async function NewProgramPage() {
  const upstream = await adminUpstreamFetch(
    "/api/v1/admin/programs?limit=1",
    { method: "GET" },
  );

  const payload = await parseUpstreamJson<ProgramListResponse>(upstream);
  const programs = upstream.ok ? (payload.data ?? []) : [];

  if (programs.length > 0) {
    redirect(`/dashboard/programs/${programs[0].id}`);
  }

  return <CreateProgramForm />;
}
