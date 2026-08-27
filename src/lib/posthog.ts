import { cacheLife, cacheTag } from "next/cache";

type InsightSeries = {
  label?: string;
  // Series custom name set in the PostHog UI (e.g. "LCP"); label is just the event name
  action?: { custom_name?: string | null };
  breakdown_value?: string | number;
  aggregated_value?: number;
  days?: string[];
  data?: number[];
};

export type Insight = {
  result?: InsightSeries[];
} | null;

export type TimeSeriesPoint = { date: string; value: number };
export type BreakdownItem = { label: string | number; value: number };
export type MultiSeriesItem = { label: string; data: TimeSeriesPoint[] };

export async function fetchInsight(shortId: string): Promise<Insight> {
  "use cache";
  cacheLife("stats");
  cacheTag("stats");

  const base = process.env.POSTHOG_HOST;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const apiKey = process.env.POSTHOG_API_KEY;
  if (!base || !projectId || !apiKey) {
    throw new Error(
      "Missing PostHog env vars (POSTHOG_HOST, POSTHOG_PROJECT_ID, POSTHOG_API_KEY)",
    );
  }

  const res = await fetch(
    `${base}/api/projects/${projectId}/insights/?short_id=${shortId}`,
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );
  if (!res.ok) {
    // Surface PostHog's error detail (e.g. missing API key scope) to callers
    const detail: unknown = await res
      .json()
      .then((body) => body?.detail)
      .catch(() => null);
    throw new Error(
      `PostHog API ${res.status} for insight ${shortId}${
        typeof detail === "string" ? `: ${detail}` : ""
      }`,
    );
  }
  const data = await res.json();
  return data.results?.[0] ?? null;
}

/** Single aggregated value – for BoldNumber stat cards */
export function getAggValue(insight: Insight, seriesIndex = 0): number | null {
  return insight?.result?.[seriesIndex]?.aggregated_value ?? null;
}

/** Formula insight aggregated value (e.g. bounce rate A/B) */
export function getFormulaValue(insight: Insight): number | null {
  // Formula results sit in result[0].aggregated_value directly
  return insight?.result?.[0]?.aggregated_value ?? null;
}

/** Time-series: [{date, value}] */
export function parseTimeSeries(
  insight: Insight,
  seriesIndex = 0,
): TimeSeriesPoint[] {
  const s = insight?.result?.[seriesIndex];
  if (!s?.days) return [];
  return s.days.map((day, i) => ({
    date: day,
    value: s.data?.[i] ?? 0,
  }));
}

/** Breakdown (bar/pie): [{label, value}] */
export function parseBreakdown(insight: Insight): BreakdownItem[] {
  return (insight?.result ?? []).map((s) => ({
    label: s.breakdown_value ?? s.action?.custom_name ?? s.label ?? "",
    value: s.aggregated_value ?? s.data?.reduce((a, b) => a + b, 0) ?? 0,
  }));
}

/** Multi-series (portfolio interactions, web vitals): [{label, data: [{date, value}]}] */
export function parseMultiSeries(insight: Insight): MultiSeriesItem[] {
  return (insight?.result ?? []).map((s) => ({
    label: s.action?.custom_name ?? s.label ?? "",
    data: (s.days ?? []).map((day, i) => ({
      date: day,
      value: s.data?.[i] ?? 0,
    })),
  }));
}

/** Format seconds as mm:ss */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
