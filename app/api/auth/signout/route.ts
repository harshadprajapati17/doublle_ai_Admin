import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

const ADMIN_EMAIL_COOKIE = "admin-email";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(ADMIN_EMAIL_COOKIE);

  return NextResponse.json({ ok: true });
}
