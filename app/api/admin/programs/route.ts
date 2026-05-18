import { NextResponse } from "next/server";
import {
  adminUpstreamFetch,
  parseUpstreamJson,
} from "@/lib/api/admin-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const path = query
    ? `/api/v1/admin/programs?${query}`
    : "/api/v1/admin/programs";

  const upstream = await adminUpstreamFetch(path, { method: "GET" });
  const data = await parseUpstreamJson<Record<string, unknown>>(upstream);
  return NextResponse.json(data, { status: upstream.status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Invalid request body" } },
      { status: 400 },
    );
  }

  const upstream = await adminUpstreamFetch("/api/v1/admin/programs", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await parseUpstreamJson<Record<string, unknown>>(upstream);
  return NextResponse.json(data, { status: upstream.status });
}
