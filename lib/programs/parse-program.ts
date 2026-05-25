import type {
  Program,
  ProgramDetail,
  ProgramSummary,
  ProgramVersion,
  RefereeBenefitType,
} from "@/lib/programs/types";

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function termsFromSource(
  source: Record<string, unknown>,
): Pick<
  ProgramVersion,
  | "referrerRewardPct"
  | "referrerRewardDurationMonths"
  | "refereeBenefitType"
  | "refereeBenefitValue"
  | "holdPeriodDays"
> {
  return {
    referrerRewardPct: toNumber(source.referrerRewardPct),
    referrerRewardDurationMonths: toNumber(
      source.referrerRewardDurationMonths,
      1,
    ),
    refereeBenefitType:
      (toOptionalString(source.refereeBenefitType) as RefereeBenefitType) ??
      "CREDIT",
    refereeBenefitValue: toNumber(source.refereeBenefitValue, 0),
    holdPeriodDays: toNumber(source.holdPeriodDays),
  };
}

function parseCountRecord(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};

  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    result[key] = toNumber(value);
  }
  return result;
}

function parseFraudReview(
  raw: unknown,
): ProgramSummary["fraudReview"] | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  const record = raw as Record<string, unknown>;
  return {
    flagged: toNumber(record.flagged),
    rejected: toNumber(record.rejected),
    terminated: toNumber(record.terminated),
  };
}

function parseCommissionsByState(
  raw: unknown,
): ProgramSummary["commissionsByState"] {
  if (!raw || typeof raw !== "object") return {};

  const result: ProgramSummary["commissionsByState"] = {};
  for (const [state, value] of Object.entries(raw)) {
    if (!value || typeof value !== "object") continue;
    const entry = value as Record<string, unknown>;
    result[state] = {
      count: toNumber(entry.count),
      amount: toNumber(entry.amount),
    };
  }
  return result;
}

function parseSummary(raw: unknown): ProgramSummary | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  const record = raw as Record<string, unknown>;
  const currency = toOptionalString(record.currency) ?? "USD";

  const referralsByStatus = parseCountRecord(record.referralsByStatus);
  const fraudReview = parseFraudReview(record.fraudReview);

  return {
    totalReferrals: toNumber(record.totalReferrals),
    totalCommissions: toNumber(record.totalCommissions),
    termsAcceptancesCount:
      record.termsAcceptancesCount != null
        ? toNumber(record.termsAcceptancesCount)
        : undefined,
    currency,
    referralsByStatus:
      Object.keys(referralsByStatus).length > 0 ? referralsByStatus : undefined,
    fraudReview,
    commissionsByState: parseCommissionsByState(record.commissionsByState),
  };
}

function parseVersionEntry(raw: Record<string, unknown>): ProgramVersion | null {
  const version = toNumber(raw.version, NaN);
  if (!Number.isFinite(version)) return null;

  const rules =
    raw.rules && typeof raw.rules === "object"
      ? (raw.rules as Record<string, unknown>)
      : raw;

  return {
    version,
    termsVersion:
      toOptionalString(raw.termsVersion) ??
      toOptionalString(rules.termsVersion),
    changeReason: toOptionalString(raw.changeReason),
    ...termsFromSource(rules),
    createdAt: toOptionalString(raw.createdAt),
    summary: parseSummary(raw.summary),
  };
}

function parseVersions(raw: Record<string, unknown>): ProgramVersion[] {
  const list = raw.versions ?? raw.programVersions;
  if (!Array.isArray(list)) return [];

  return list
    .map((item) =>
      item && typeof item === "object"
        ? parseVersionEntry(item as Record<string, unknown>)
        : null,
    )
    .filter((v): v is ProgramVersion => v !== null)
    .sort((a, b) => b.version - a.version);
}

function mergeVersionStats(
  versions: ProgramVersion[],
  raw: Record<string, unknown>,
): ProgramVersion[] {
  const statsList = raw.versionStats;
  if (!Array.isArray(statsList)) return versions;

  const statsByVersion = new Map<number, ProgramSummary>();
  for (const item of statsList) {
    if (!item || typeof item !== "object") continue;
    const entry = item as Record<string, unknown>;
    const version = toNumber(entry.version, NaN);
    const summary = parseSummary(entry.summary);
    if (Number.isFinite(version) && summary) {
      statsByVersion.set(version, summary);
    }
  }

  return versions.map((v) => ({
    ...v,
    summary: statsByVersion.get(v.version) ?? v.summary,
  }));
}

function resolveCurrentVersion(
  raw: Record<string, unknown>,
  versions: ProgramVersion[],
): number | undefined {
  const n = toNumber(raw.currentVersion, NaN);
  if (Number.isFinite(n) && n > 0) return n;

  if (versions.length > 0) return versions[0].version;
  return undefined;
}

export function getActiveVersion(
  program: ProgramDetail,
): ProgramVersion | undefined {
  if (!program.versions?.length) return undefined;

  if (program.currentVersion != null) {
    const match = program.versions.find(
      (v) => v.version === program.currentVersion,
    );
    if (match) return match;
  }

  return program.versions[0];
}

/** Terms shown in the UI — active version when present, otherwise program root. */
export function getProgramTerms(program: ProgramDetail): ProgramVersion | Program {
  return getActiveVersion(program) ?? program;
}

export function parseProgramDetail(raw: Record<string, unknown>): ProgramDetail {
  const versions = mergeVersionStats(parseVersions(raw), raw);
  const currentVersion = resolveCurrentVersion(raw, versions);
  const active = versions.find((v) => v.version === currentVersion);
  const rootTerms = termsFromSource(raw);
  const activeTerms = active
    ? {
        referrerRewardPct: active.referrerRewardPct,
        referrerRewardDurationMonths: active.referrerRewardDurationMonths,
        refereeBenefitType: active.refereeBenefitType,
        refereeBenefitValue: active.refereeBenefitValue,
        holdPeriodDays: active.holdPeriodDays,
      }
    : rootTerms;

  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    status: String(raw.status ?? "DRAFT"),
    ...activeTerms,
    termsVersion:
      active?.termsVersion ??
      toOptionalString(raw.termsVersion) ??
      undefined,
    createdAt: toOptionalString(raw.createdAt),
    updatedAt: toOptionalString(raw.updatedAt),
    currentVersion,
    versions: versions.length > 0 ? versions : undefined,
    summary: parseSummary(raw.summary),
  };
}
