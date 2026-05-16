import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth";
import { getApiUrl } from "@/lib/config";

export async function getAdminAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(AUTH_COOKIE)?.value;

  if (!value || value === "authenticated") {
    return null;
  }

  return value;
}

export async function adminUpstreamFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = await getAdminAuthToken();

  if (!token) {
    return new Response(
      JSON.stringify({ error: { code: "UNAUTHORIZED", message: "Not signed in" } }),
      { status: 401, headers: { "content-type": "application/json" } },
    );
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("content-type") && init.body) {
    headers.set("content-type", "application/json");
  }

  return fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers,
  });
}

export function parseUpstreamJson<T>(response: Response): Promise<T> {
  return response.json().catch(() => ({}) as T);
}
