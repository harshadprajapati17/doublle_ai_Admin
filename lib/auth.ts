export const AUTH_COOKIE = "auth-session";

export function getAuthToken(data: Record<string, unknown>): string | undefined {
  const token =
    data.token ?? data.accessToken ?? data.access_token ?? data.jwt;
  return typeof token === "string" ? token : undefined;
}
