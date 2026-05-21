import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, getAuthToken } from "@/lib/auth";
import { getApiUrl } from "@/lib/config";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Invalid request body" } },
      { status: 400 },
    );
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Admin ID is required." } },
      { status: 400 },
    );
  }

  if (!password) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Password is required." } },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${getApiUrl()}/api/v1/auth/admin-signin-referral`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const cookieStore = await cookies();
  const token = getAuthToken(data);

  if (!token) {
    return NextResponse.json(
      {
        error: {
          code: "AUTH_ERROR",
          message: "Sign-in succeeded but no access token was returned.",
        },
      },
      { status: 502 },
    );
  }

  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  cookieStore.set("admin-email", email, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json(data);
}
