/**
 * Cached server functions for PostHog stats.
 * Uses Next.js "use cache" so API routes can return cached results.
 * @see https://nextjs.org/docs/app/api-reference/directives/use-cache
 */

import { cacheLife, cacheTag } from "next/cache";
import { queryPostHog } from "@/lib/api/posthog";
import {
  browsersAllTimeQuery,
  calculatePercentage,
  formatVitalsResult,
  getAvgSessionDurationQuery,
  getDeviceTypesQuery,
  getEngagementQueries,
  getOperatingSystemsQuery,
  getPageviewsByDayQuery,
  getResumeButtonClickCountQuery,
  getTotalPageviewsQuery,
  getUniqueVisitorsQuery,
  getVisitorsByCountryQuery,
  getVisitorsOverTimeQuery,
  getVitalsQueries,
  pageQueries,
  trafficSourcesAllTimeQuery,
} from "@/lib/api/queries";
import type { InsightsPeriod } from "@/lib/api/stats-days";
import type {
  BrowserStats,
  DeviceDistribution,
  DeviceTypeStats,
  EngagementStats,
  OSStats,
  PageviewsByDay,
  TopPage,
  TrafficSource,
  VisitorsByCountry,
  VisitorsByDay,
  WebVitalsMetrics,
} from "@/lib/api/types";

const STATS_TAG = "stats";

export async function getCachedPageviews(period: InsightsPeriod): Promise<{
  totalPageviews: number;
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const result = await queryPostHog<[[number]]>(getTotalPageviewsQuery(period));
  const totalPageviews = result.results[0]?.[0] ?? 0;
  return { totalPageviews };
}

export async function getCachedVisitors(period: InsightsPeriod): Promise<{
  uniqueVisitors: number;
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const result = await queryPostHog<[[number]]>(getUniqueVisitorsQuery(period));
  const uniqueVisitors = result.results[0]?.[0] ?? 0;
  return { uniqueVisitors };
}

export async function getCachedSession(period: InsightsPeriod): Promise<{
  avgSessionDuration: number;
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const result = await queryPostHog<[[number]]>(
    getAvgSessionDurationQuery(period),
  );
  const avgSessionDuration = Math.round(result.results[0]?.[0] ?? 0);
  return { avgSessionDuration };
}

export async function getCachedEngagement(
  period: InsightsPeriod,
): Promise<EngagementStats> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const q = getEngagementQueries(period);

  const [bounceResult, pagesPerSessionResult, sessionsResult] =
    await Promise.all([
      queryPostHog<[[number, number, number]]>(q.bounceRate),
      queryPostHog<[[number]]>(q.pagesPerSession),
      queryPostHog<[[number]]>(q.totalSessions),
    ]);

  const [bouncedSessions, totalSessionsBounce, bounceRate] = bounceResult
    .results[0] ?? [0, 0, 0];
  const avgPagesPerSession = pagesPerSessionResult.results[0]?.[0] ?? 0;
  const totalSessions = sessionsResult.results[0]?.[0] ?? totalSessionsBounce;

  let returningVisitors = 0;
  try {
    const newVsReturningResult = await queryPostHog<[string, number][]>(
      q.newVsReturning,
    );
    const newVsReturningMap = new Map<string, number>(
      newVsReturningResult.results.map(([type, count]) => [type, count]),
    );
    returningVisitors = newVsReturningMap.get("Returning") ?? 0;
  } catch {
    // Continue without returning data
  }

  return {
    bounceRate: bounceRate ?? 0,
    totalSessions,
    bouncedSessions: bouncedSessions ?? 0,
    avgPagesPerSession,
    returningVisitors,
  };
}

export async function getCachedResumeButtonClicks(
  period: InsightsPeriod,
): Promise<{ count: number }> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const result = await queryPostHog<[[number]]>(
    getResumeButtonClickCountQuery(period),
  );
  const count = result.results[0]?.[0] ?? 0;
  return { count };
}

export async function getCachedVitals(
  period: InsightsPeriod,
): Promise<WebVitalsMetrics> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const q = getVitalsQueries(period);

  const [lcpResult, fcpResult, clsResult, inpResult] = await Promise.all([
    queryPostHog<[[number, number, number, number]]>(q.lcp),
    queryPostHog<[[number, number, number, number]]>(q.fcp),
    queryPostHog<[[number, number, number, number]]>(q.cls),
    queryPostHog<[[number, number, number, number]]>(q.inp),
  ]);

  return {
    lcp: formatVitalsResult(
      lcpResult.results as [[number, number, number, number]],
    ),
    fcp: formatVitalsResult(
      fcpResult.results as [[number, number, number, number]],
    ),
    cls: formatVitalsResult(
      clsResult.results as [[number, number, number, number]],
    ),
    inp: formatVitalsResult(
      inpResult.results as [[number, number, number, number]],
    ),
  };
}

export async function getCachedDevices(
  period: InsightsPeriod,
): Promise<DeviceDistribution> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const [deviceTypeResult, browserResult, osResult] = await Promise.all([
    queryPostHog<[string, number][]>(getDeviceTypesQuery(period)),
    queryPostHog<[string, number][]>(browsersAllTimeQuery),
    queryPostHog<[string, number][]>(getOperatingSystemsQuery(period)),
  ]);

  const totalDevices = deviceTypeResult.results.reduce(
    (sum, [, count]) => sum + count,
    0,
  );
  const deviceTypes: DeviceTypeStats[] = deviceTypeResult.results.map(
    ([deviceType, count]) => ({
      deviceType,
      count,
      percentage: calculatePercentage(count, totalDevices),
    }),
  );

  const totalBrowsers = browserResult.results.reduce(
    (sum, [, count]) => sum + count,
    0,
  );
  const browsers: BrowserStats[] = browserResult.results.map(
    ([browser, count]) => ({
      browser,
      count,
      percentage: calculatePercentage(count, totalBrowsers),
    }),
  );

  const totalOS = osResult.results.reduce((sum, [, count]) => sum + count, 0);
  const operatingSystems: OSStats[] = osResult.results.map(([os, count]) => ({
    os,
    count,
    percentage: calculatePercentage(count, totalOS),
  }));

  return {
    deviceTypes,
    browsers,
    operatingSystems,
  };
}

export async function getCachedTraffic(): Promise<{
  trafficSources: TrafficSource[];
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const trafficSourcesResult = await queryPostHog<[string, number][]>(
    trafficSourcesAllTimeQuery,
  );
  const trafficSources: TrafficSource[] = trafficSourcesResult.results.map(
    ([source, visitors]) => ({
      source: source || "Direct",
      visitors,
    }),
  );
  return { trafficSources };
}

export async function getCachedVisitorsByCountry(
  period: InsightsPeriod,
): Promise<{
  visitorsByCountry: VisitorsByCountry[];
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const result = await queryPostHog<[string, string, number][]>(
    getVisitorsByCountryQuery(period),
  );
  const visitorsByCountry: VisitorsByCountry[] = result.results.map(
    ([country, countryCode, visitors]) => ({
      country,
      countryCode,
      visitors,
    }),
  );
  return { visitorsByCountry };
}

export async function getCachedTopPages(): Promise<{ topPages: TopPage[] }> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const result = await queryPostHog<[string, number][]>(pageQueries.topPages);
  const topPages: TopPage[] = result.results.map(([pathname, count]) => ({
    pathname,
    count,
  }));
  return { topPages };
}

/** @param period - Rolling window or `"all"` (part of cache key) */
export async function getCachedVisitorsOverTime(
  period: InsightsPeriod,
): Promise<{
  visitorsOverTime: VisitorsByDay[];
  period: InsightsPeriod;
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const result = await queryPostHog<[string, number][]>(
    getVisitorsOverTimeQuery(period),
  );
  const visitorsOverTime: VisitorsByDay[] = result.results.map(
    ([date, visitors]) => ({
      date,
      visitors,
    }),
  );
  return { visitorsOverTime, period };
}

/** @param period - Rolling window or `"all"` (part of cache key) */
export async function getCachedPageviewsByDay(period: InsightsPeriod): Promise<{
  pageviewsByDay: PageviewsByDay[];
  period: InsightsPeriod;
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife("stats");

  const result = await queryPostHog<[string, number][]>(
    getPageviewsByDayQuery(period),
  );
  const pageviewsByDay: PageviewsByDay[] = result.results.map(
    ([date, count]) => ({
      date,
      count,
    }),
  );
  return { pageviewsByDay, period };
}
