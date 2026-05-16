import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, getAuthToken } from "@/lib/auth";
import { getApiUrl } from "@/lib/config";

export async function POST(request: Request) {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const upstream = await fetch(`${getApiUrl()}/api/v1/auth/demo-admin`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = (await upstream.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const cookieStore = await cookies();
  const token = getAuthToken(data);

  cookieStore.set(AUTH_COOKIE, token ?? "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return NextResponse.json(data);
}
