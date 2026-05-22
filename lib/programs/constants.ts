export const REFEREE_BENEFIT_OPTIONS = [
  { value: "NONE" as const, label: "None", disabled: true },
  { value: "TRIAL_EXTENSION" as const, label: "Trial extension", disabled: true },
  { value: "CREDIT" as const, label: "Product credit" },
];

/** Query params for GET /api/v1/admin/programs/:id */
export const PROGRAM_DETAIL_INCLUDE = "versionStats";

export function programDetailApiPath(programId: string): string {
  const params = new URLSearchParams({ include: PROGRAM_DETAIL_INCLUDE });
  return `/api/admin/programs/${encodeURIComponent(programId)}?${params}`;
}

export function programDetailUpstreamPath(programId: string): string {
  const params = new URLSearchParams({ include: PROGRAM_DETAIL_INCLUDE });
  return `/api/v1/admin/programs/${encodeURIComponent(programId)}?${params}`;
}
