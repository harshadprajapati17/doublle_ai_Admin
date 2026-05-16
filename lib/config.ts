export function getApiUrl(): string {
  return process.env.API_URL ?? "http://localhost:5001";
}
