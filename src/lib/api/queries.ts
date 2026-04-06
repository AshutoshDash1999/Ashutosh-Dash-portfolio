/**
 * HogQL query templates for PostHog analytics
 */

import type { InsightsPeriod } from "@/lib/api/stats-days";

const ALL_TIME_START = process.env.INSIGHTS_ALL_TIME_START ?? "2010-01-01";

/** Rolling window from PostHog `now()` */
export function tsGteRollingDays(days: number): string {
  return `timestamp >= now() - INTERVAL ${days} DAY`;
}

/**
 * Lower bound for bar-chart “all time” breakdowns.
 * Override with INSIGHTS_ALL_TIME_START (ISO date string).
 */
export function tsGteAllTime(): string {
  return `timestamp >= toDateTime('${ALL_TIME_START}')`;
}

/** Rolling N days, or configured all-time start when `period` is `"all"`. */
export function tsGtePeriod(period: InsightsPeriod): string {
  if (period === "all") {
    return tsGteAllTime();
  }
  return tsGteRollingDays(period);
}

// ============================================
// Overview Queries (rolling window)
// ============================================

export function getTotalPageviewsQuery(period: InsightsPeriod): string {
  return `
    SELECT count() AS total
    FROM events
    WHERE 
      event = '$pageview'
      AND ${tsGtePeriod(period)}
  `;
}

/** Custom event from hero resume CTA (`posthog.capture('resume_button_click')`). */
export function getResumeButtonClickCountQuery(period: InsightsPeriod): string {
  return `
    SELECT count() AS total
    FROM events
    WHERE 
      event = 'resume_button_click'
      AND ${tsGtePeriod(period)}
  `;
}

export function getUniqueVisitorsQuery(period: InsightsPeriod): string {
  return `
    SELECT count(DISTINCT distinct_id) AS unique_visitors
    FROM events
    WHERE 
      event = '$pageview'
      AND ${tsGtePeriod(period)}
  `;
}

export function getAvgSessionDurationQuery(period: InsightsPeriod): string {
  return `
    SELECT 
      avg(session_duration) AS avg_duration
    FROM (
      SELECT 
        $session_id AS session_id,
        dateDiff('second', min(timestamp), max(timestamp)) AS session_duration
      FROM events
      WHERE 
        event IN ('$pageview', '$pageleave')
        AND $session_id IS NOT NULL
        AND ${tsGtePeriod(period)}
      GROUP BY session_id
      HAVING session_duration > 0 AND session_duration < 7200
    )
  `;
}

// ============================================
// Visitors Queries
// ============================================

export function getVisitorsByCountryQuery(period: InsightsPeriod): string {
  return `
    SELECT 
      COALESCE(properties.$geoip_country_name, 'Unknown') AS country,
      COALESCE(properties.$geoip_country_code, 'XX') AS country_code,
      count(DISTINCT distinct_id) AS visitors
    FROM events
    WHERE 
      event = '$pageview'
      AND ${tsGtePeriod(period)}
    GROUP BY country, country_code
    ORDER BY visitors DESC
    LIMIT 15
  `;
}

export function getVisitorsOverTimeQuery(period: InsightsPeriod): string {
  return `
    SELECT 
      toDate(timestamp) AS date,
      count(DISTINCT distinct_id) AS visitors
    FROM events
    WHERE 
      event = '$pageview'
      AND ${tsGtePeriod(period)}
    GROUP BY date
    ORDER BY date ASC
  `;
}

// ============================================
// Traffic Queries
// ============================================

/** Bar chart: all events since configured start date */
export const trafficSourcesAllTimeQuery = `
    SELECT 
      COALESCE(properties.utm_source, properties.$referring_domain, 'Direct') AS source,
      count(DISTINCT distinct_id) AS visitors
    FROM events
    WHERE 
      event = '$pageview'
      AND ${tsGteAllTime()}
    GROUP BY source
    ORDER BY visitors DESC
    LIMIT 10
  `;

// ============================================
// Device Queries
// ============================================

export function getDeviceTypesQuery(period: InsightsPeriod): string {
  return `
    SELECT 
      COALESCE(properties.$device_type, 'Unknown') AS device_type,
      count() AS count
    FROM events
    WHERE 
      event = '$pageview'
      AND ${tsGtePeriod(period)}
    GROUP BY device_type
    ORDER BY count DESC
  `;
}

/** Bar chart: browsers, all time */
export const browsersAllTimeQuery = `
    SELECT 
      COALESCE(properties.$browser, 'Unknown') AS browser,
      count() AS count
    FROM events
    WHERE 
      event = '$pageview'
      AND ${tsGteAllTime()}
    GROUP BY browser
    ORDER BY count DESC
    LIMIT 10
  `;

export function getOperatingSystemsQuery(period: InsightsPeriod): string {
  return `
    SELECT 
      COALESCE(properties.$os, 'Unknown') AS os,
      count() AS count
    FROM events
    WHERE 
      event = '$pageview'
      AND ${tsGtePeriod(period)}
    GROUP BY os
    ORDER BY count DESC
    LIMIT 10
  `;
}

// ============================================
// Page Queries
// ============================================

export function getPageviewsByDayQuery(period: InsightsPeriod): string {
  return `
    SELECT 
      toDate(timestamp) AS date,
      count() AS pageview_count
    FROM events
    WHERE 
      event = '$pageview'
      AND ${tsGtePeriod(period)}
    GROUP BY date
    ORDER BY date ASC
  `;
}

const TIME_RANGE_30 = "30 DAY";

export const pageQueries = {
  topPages: `
    SELECT 
      properties.$pathname AS pathname,
      count() AS pageview_count
    FROM events
    WHERE 
      event = '$pageview' 
      AND properties.$pathname IS NOT NULL 
      AND properties.$pathname != '/'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE_30}
    GROUP BY pathname
    ORDER BY pageview_count DESC
    LIMIT 10
  `,
} as const;

// ============================================
// Engagement Queries
// ============================================

const newVsReturningAllTimeQuery = `
    SELECT 
      visitor_type,
      count() AS count
    FROM (
      SELECT 
        distinct_id AS visitor_id,
        if(
          count(DISTINCT toDate(timestamp)) > 1,
          'Returning',
          'New'
        ) AS visitor_type
      FROM events
      WHERE 
        event = '$pageview'
        AND distinct_id IS NOT NULL
        AND ${tsGteAllTime()}
      GROUP BY visitor_id
    )
    GROUP BY visitor_type
  `;

export function getEngagementQueries(period: InsightsPeriod) {
  const rolling = tsGtePeriod(period);

  const newVsReturning =
    period === "all"
      ? newVsReturningAllTimeQuery
      : `
    SELECT 
      visitor_type,
      count() AS count
    FROM (
      SELECT 
        distinct_id AS visitor_id,
        if(
          min(timestamp) >= now() - INTERVAL ${period} DAY,
          'New',
          'Returning'
        ) AS visitor_type
      FROM events
      WHERE 
        event = '$pageview'
        AND distinct_id IS NOT NULL
      GROUP BY visitor_id
      HAVING max(timestamp) >= now() - INTERVAL ${period} DAY
    )
    GROUP BY visitor_type
  `;

  return {
    bounceRate: `
    SELECT 
      countIf(session_pageviews = 1) AS bounced_sessions,
      count() AS total_sessions,
      round(countIf(session_pageviews = 1) * 100.0 / count(), 2) AS bounce_rate
    FROM (
      SELECT 
        $session_id AS session_id,
        count() AS session_pageviews
      FROM events
      WHERE 
        event = '$pageview'
        AND $session_id IS NOT NULL
        AND ${rolling}
      GROUP BY session_id
    )
  `,

    newVsReturning,

    pagesPerSession: `
    SELECT 
      round(avg(pages), 2) AS avg_pages_per_session
    FROM (
      SELECT 
        $session_id AS session_id,
        count() AS pages
      FROM events
      WHERE 
        event = '$pageview'
        AND $session_id IS NOT NULL
        AND ${rolling}
      GROUP BY session_id
    )
  `,

    totalSessions: `
    SELECT 
      count(DISTINCT $session_id) AS total_sessions
    FROM events
    WHERE 
      event = '$pageview'
      AND $session_id IS NOT NULL
      AND ${rolling}
  `,
  } as const;
}

// ============================================
// Web Vitals Queries
// ============================================

const createWebVitalsQuery = (metric: string, period: InsightsPeriod) => `
  SELECT 
    avg(toFloat(properties.$web_vitals_${metric}_value)) AS avg_value,
    quantile(0.75)(toFloat(properties.$web_vitals_${metric}_value)) AS p75,
    quantile(0.95)(toFloat(properties.$web_vitals_${metric}_value)) AS p95,
    count() AS count
  FROM events
  WHERE 
    event = '$web_vitals'
    AND properties.$web_vitals_${metric}_value IS NOT NULL
    AND ${tsGtePeriod(period)}
`;

export function getVitalsQueries(period: InsightsPeriod) {
  return {
    lcp: createWebVitalsQuery("LCP", period),
    fcp: createWebVitalsQuery("FCP", period),
    cls: createWebVitalsQuery("CLS", period),
    inp: createWebVitalsQuery("INP", period),
  } as const;
}

// ============================================
// Helpers
// ============================================

/**
 * Format web vitals result to a consistent structure
 */
export function formatVitalsResult(result: [[number, number, number, number]]) {
  const [avg, p75, p95, count] = result[0] ?? [0, 0, 0, 0];
  return {
    avg: Math.round((avg ?? 0) * 100) / 100,
    p75: Math.round((p75 ?? 0) * 100) / 100,
    p95: Math.round((p95 ?? 0) * 100) / 100,
    count: count ?? 0,
  };
}

/**
 * Calculate percentage for distribution data
 */
export function calculatePercentage(count: number, total: number): number {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}
