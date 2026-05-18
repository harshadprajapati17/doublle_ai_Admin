import { NextResponse } from "next/server";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const path = query
    ? `/api/v1/admin/referrals?${query}`
    : "/api/v1/admin/referrals";

  const upstream = await adminUpstreamFetch(path, { method: "GET" });
  const data = await parseUpstreamJson<Record<string, unknown>>(upstream);
  return NextResponse.json(data, { status: upstream.status });
}
