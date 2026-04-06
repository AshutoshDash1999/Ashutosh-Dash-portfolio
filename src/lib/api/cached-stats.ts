/**
 * Cached server functions for PostHog stats.
 * Uses Next.js "use cache" so API routes can return cached results.
 * @see https://nextjs.org/docs/app/api-reference/directives/use-cache
 */

import { cacheLife, cacheTag } from "next/cache";
import { queryPostHog } from "@/lib/api/posthog";
import {
  calculatePercentage,
  deviceQueries,
  engagementQueries,
  formatVitalsResult,
  getPageviewsByDayQuery,
  getVisitorsOverTimeQuery,
  pageQueries,
  queries,
  trafficQueries,
  visitorsQueries,
  vitalsQueries,
} from "@/lib/api/queries";
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
// 1 month cache: 30 days in seconds
const THIRTY_DAYS = 30 * 24 * 60 * 60;
const ONE_DAY = 24 * 60 * 60;
const CACHE_LIFE_MONTH = {
  stale: ONE_DAY,
  revalidate: THIRTY_DAYS,
  expire: THIRTY_DAYS,
} as const;

export async function getCachedPageviews(): Promise<{
  totalPageviews: number;
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife(CACHE_LIFE_MONTH);

  const result = await queryPostHog<[[number]]>(queries.totalPageviews);
  const totalPageviews = result.results[0]?.[0] ?? 0;
  return { totalPageviews };
}

export async function getCachedVisitors(): Promise<{
  uniqueVisitors: number;
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife(CACHE_LIFE_MONTH);

  const result = await queryPostHog<[[number]]>(queries.uniqueVisitors);
  const uniqueVisitors = result.results[0]?.[0] ?? 0;
  return { uniqueVisitors };
}

export async function getCachedSession(): Promise<{
  avgSessionDuration: number;
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife(CACHE_LIFE_MONTH);

  const result = await queryPostHog<[[number]]>(queries.avgSessionDuration);
  const avgSessionDuration = Math.round(result.results[0]?.[0] ?? 0);
  return { avgSessionDuration };
}

export async function getCachedEngagement(): Promise<EngagementStats> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife(CACHE_LIFE_MONTH);

  const [bounceResult, pagesPerSessionResult, sessionsResult] =
    await Promise.all([
      queryPostHog<[[number, number, number]]>(engagementQueries.bounceRate),
      queryPostHog<[[number]]>(engagementQueries.pagesPerSession),
      queryPostHog<[[number]]>(engagementQueries.totalSessions),
    ]);

  const [bouncedSessions, totalSessionsBounce, bounceRate] = bounceResult
    .results[0] ?? [0, 0, 0];
  const avgPagesPerSession = pagesPerSessionResult.results[0]?.[0] ?? 0;
  const totalSessions = sessionsResult.results[0]?.[0] ?? totalSessionsBounce;

  let newVisitors = 0;
  let returningVisitors = 0;
  try {
    const newVsReturningResult = await queryPostHog<[string, number][]>(
      engagementQueries.newVsReturning,
    );
    const newVsReturningMap = new Map<string, number>(
      newVsReturningResult.results.map(([type, count]) => [type, count]),
    );
    newVisitors = newVsReturningMap.get("New") ?? 0;
    returningVisitors = newVsReturningMap.get("Returning") ?? 0;
  } catch {
    // Continue without new/returning data
  }

  return {
    bounceRate: bounceRate ?? 0,
    totalSessions,
    bouncedSessions: bouncedSessions ?? 0,
    avgPagesPerSession,
    newVisitors,
    returningVisitors,
  };
}

export async function getCachedVitals(): Promise<WebVitalsMetrics> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife(CACHE_LIFE_MONTH);

  const [lcpResult, fcpResult, clsResult, inpResult] = await Promise.all([
    queryPostHog<[[number, number, number, number]]>(vitalsQueries.lcp),
    queryPostHog<[[number, number, number, number]]>(vitalsQueries.fcp),
    queryPostHog<[[number, number, number, number]]>(vitalsQueries.cls),
    queryPostHog<[[number, number, number, number]]>(vitalsQueries.inp),
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

export async function getCachedDevices(): Promise<DeviceDistribution> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife(CACHE_LIFE_MONTH);

  const [deviceTypeResult, browserResult, osResult] = await Promise.all([
    queryPostHog<[string, number][]>(deviceQueries.deviceTypes),
    queryPostHog<[string, number][]>(deviceQueries.browsers),
    queryPostHog<[string, number][]>(deviceQueries.operatingSystems),
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
  cacheLife(CACHE_LIFE_MONTH);

  const trafficSourcesResult = await queryPostHog<[string, number][]>(
    trafficQueries.sources,
  );
  const trafficSources: TrafficSource[] = trafficSourcesResult.results.map(
    ([source, visitors]) => ({
      source: source || "Direct",
      visitors,
    }),
  );
  return { trafficSources };
}

export async function getCachedVisitorsByCountry(): Promise<{
  visitorsByCountry: VisitorsByCountry[];
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife(CACHE_LIFE_MONTH);

  const result = await queryPostHog<[string, string, number][]>(
    visitorsQueries.byCountry,
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
  cacheLife(CACHE_LIFE_MONTH);

  const result = await queryPostHog<[string, number][]>(pageQueries.topPages);
  const topPages: TopPage[] = result.results.map(([pathname, count]) => ({
    pathname,
    count,
  }));
  return { topPages };
}

/** @param days - 7, 30, or 90 (part of cache key) */
export async function getCachedVisitorsOverTime(days: number): Promise<{
  visitorsOverTime: VisitorsByDay[];
  days: number;
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife(CACHE_LIFE_MONTH);

  const result = await queryPostHog<[string, number][]>(
    getVisitorsOverTimeQuery(days),
  );
  const visitorsOverTime: VisitorsByDay[] = result.results.map(
    ([date, visitors]) => ({
      date,
      visitors,
    }),
  );
  return { visitorsOverTime, days };
}

/** @param days - 7, 30, or 90 (part of cache key) */
export async function getCachedPageviewsByDay(days: number): Promise<{
  pageviewsByDay: PageviewsByDay[];
  days: number;
}> {
  "use cache";
  cacheTag(STATS_TAG);
  cacheLife(CACHE_LIFE_MONTH);

  const result = await queryPostHog<[string, number][]>(
    getPageviewsByDayQuery(days),
  );
  const pageviewsByDay: PageviewsByDay[] = result.results.map(
    ([date, count]) => ({
      date,
      count,
    }),
  );
  return { pageviewsByDay, days };
}
