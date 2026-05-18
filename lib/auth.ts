export const AUTH_COOKIE = "auth-session";

function readToken(record: Record<string, unknown>): string | undefined {
  const token =
    record.token ?? record.accessToken ?? record.access_token ?? record.jwt;
  return typeof token === "string" ? token : undefined;
}

export function getAuthToken(data: Record<string, unknown>): string | undefined {
  const topLevel = readToken(data);
  if (topLevel) return topLevel;

  const nested = data.data;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return readToken(nested as Record<string, unknown>);
  }

  return undefined;
}
