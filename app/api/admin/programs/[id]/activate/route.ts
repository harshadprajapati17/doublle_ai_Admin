import { NextResponse } from "next/server";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force");
  const query = force === "true" ? "?force=true" : "";

  const upstream = await adminUpstreamFetch(
    `/api/v1/admin/programs/${encodeURIComponent(id)}/activate${query}`,
    { method: "POST" },
  );

  const data = await parseUpstreamJson<Record<string, unknown>>(upstream);
  return NextResponse.json(data, { status: upstream.status });
}
