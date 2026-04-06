export const INSIGHTS_VALID_DAYS = [7, 30, 90] as const;

export type InsightsDays = (typeof INSIGHTS_VALID_DAYS)[number];

export type InsightsPeriod = InsightsDays | "all";

export function isInsightsDays(n: number): n is InsightsDays {
  return INSIGHTS_VALID_DAYS.includes(n as InsightsDays);
}

/**
 * Parse `days` query param for insights APIs (`7`, `30`, `90`, or `all`). Returns null if invalid.
 */
export function parseInsightsPeriodParam(
  param: string | null,
  defaultPeriod: InsightsPeriod = 30,
): InsightsPeriod | null {
  if (param === null || param === "") {
    return defaultPeriod;
  }
  if (param === "all") {
    return "all";
  }
  const n = Number.parseInt(param, 10);
  if (!isInsightsDays(n)) {
    return null;
  }
  return n;
}

export function insightsPeriodLabel(period: InsightsPeriod): string {
  if (period === "all") {
    return "all time";
  }
  switch (period) {
    case 7:
      return "last 7 days";
    case 30:
      return "last 30 days";
    case 90:
      return "last 3 months";
    default:
      return `last ${period} days`;
  }
}
