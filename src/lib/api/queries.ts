/**
 * HogQL query templates for PostHog analytics
 */

const TIME_RANGE = "30 DAY";

// ============================================
// Overview Queries
// ============================================

export const queries = {
  // Total pageviews in the time range
  totalPageviews: `
    SELECT count() AS total
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
  `,

  // Total unique visitors
  uniqueVisitors: `
    SELECT count(DISTINCT properties.distinct_id) AS unique_visitors
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
  `,

  // Average session duration
  avgSessionDuration: `
    SELECT 
      avg(session_duration) AS avg_duration
    FROM (
      SELECT 
        properties.$session_id AS session_id,
        dateDiff('second', min(timestamp), max(timestamp)) AS session_duration
      FROM events
      WHERE 
        event IN ('$pageview', '$pageleave')
        AND properties.$session_id IS NOT NULL
        AND timestamp >= now() - INTERVAL ${TIME_RANGE}
      GROUP BY session_id
      HAVING session_duration > 0 AND session_duration < 7200
    )
  `,
} as const;

// ============================================
// Visitors Queries
// ============================================

export const visitorsQueries = {
  // Unique visitors by day
  overTime: `
    SELECT 
      toDate(timestamp) AS date,
      count(DISTINCT properties.distinct_id) AS visitors
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
    GROUP BY date
    ORDER BY date ASC
  `,

  // Visitors by country
  byCountry: `
    SELECT 
      COALESCE(properties.$geoip_country_name, 'Unknown') AS country,
      COALESCE(properties.$geoip_country_code, 'XX') AS country_code,
      count(DISTINCT properties.distinct_id) AS visitors
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
    GROUP BY country, country_code
    ORDER BY visitors DESC
    LIMIT 15
  `,
} as const;

// Dynamic query functions with configurable time range
export function getVisitorsOverTimeQuery(days: number) {
  return `
    SELECT 
      toDate(timestamp) AS date,
      count(DISTINCT properties.distinct_id) AS visitors
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY date
    ORDER BY date ASC
  `;
}

// ============================================
// Traffic Queries
// ============================================

export const trafficQueries = {
  // Traffic sources based on utm_source or referring domain
  sources: `
    SELECT 
      COALESCE(properties.utm_source, properties.$referring_domain, 'Direct') AS source,
      count(DISTINCT properties.distinct_id) AS visitors
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
    GROUP BY source
    ORDER BY visitors DESC
    LIMIT 10
  `,
} as const;

// ============================================
// Device Queries
// ============================================

export const deviceQueries = {
  // Device type distribution (Desktop, Mobile, Tablet)
  deviceTypes: `
    SELECT 
      COALESCE(properties.$device_type, 'Unknown') AS device_type,
      count() AS count
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
    GROUP BY device_type
    ORDER BY count DESC
  `,

  // Browser distribution
  browsers: `
    SELECT 
      COALESCE(properties.$browser, 'Unknown') AS browser,
      count() AS count
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
    GROUP BY browser
    ORDER BY count DESC
    LIMIT 10
  `,

  // Operating system distribution
  operatingSystems: `
    SELECT 
      COALESCE(properties.$os, 'Unknown') AS os,
      count() AS count
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
    GROUP BY os
    ORDER BY count DESC
    LIMIT 10
  `,
} as const;

// ============================================
// Page Queries
// ============================================

export const pageQueries = {
  // Pageviews by day
  pageviewsByDay: `
    SELECT 
      toDate(timestamp) AS date,
      count() AS pageview_count
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
    GROUP BY date
    ORDER BY date ASC
  `,

  // Top pages by pageview count
  topPages: `
    SELECT 
      properties.$pathname AS pathname,
      count() AS pageview_count
    FROM events
    WHERE 
      event = '$pageview' 
      AND properties.$pathname IS NOT NULL 
      AND properties.$pathname != '/'
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
    GROUP BY pathname
    ORDER BY pageview_count DESC
    LIMIT 10
  `,
} as const;

export function getPageviewsByDayQuery(days: number) {
  return `
    SELECT 
      toDate(timestamp) AS date,
      count() AS pageview_count
    FROM events
    WHERE 
      event = '$pageview'
      AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY date
    ORDER BY date ASC
  `;
}

// ============================================
// Engagement Queries
// ============================================

export const engagementQueries = {
  // Bounce rate - sessions with only one pageview
  bounceRate: `
    SELECT 
      countIf(session_pageviews = 1) AS bounced_sessions,
      count() AS total_sessions,
      round(countIf(session_pageviews = 1) * 100.0 / count(), 2) AS bounce_rate
    FROM (
      SELECT 
        properties.$session_id AS session_id,
        count() AS session_pageviews
      FROM events
      WHERE 
        event = '$pageview'
        AND properties.$session_id IS NOT NULL
        AND timestamp >= now() - INTERVAL ${TIME_RANGE}
      GROUP BY session_id
    )
  `,

  // New vs returning visitors - simplified approach
  // Counts visitors whose first pageview in our data is within the time range
  newVsReturning: `
    SELECT 
      visitor_type,
      count() AS count
    FROM (
      SELECT 
        properties.distinct_id AS visitor_id,
        if(
          min(timestamp) >= now() - INTERVAL ${TIME_RANGE},
          'New',
          'Returning'
        ) AS visitor_type
      FROM events
      WHERE 
        event = '$pageview'
        AND properties.distinct_id IS NOT NULL
      GROUP BY visitor_id
      HAVING max(timestamp) >= now() - INTERVAL ${TIME_RANGE}
    )
    GROUP BY visitor_type
  `,

  // Average pages per session
  pagesPerSession: `
    SELECT 
      round(avg(pages), 2) AS avg_pages_per_session
    FROM (
      SELECT 
        properties.$session_id AS session_id,
        count() AS pages
      FROM events
      WHERE 
        event = '$pageview'
        AND properties.$session_id IS NOT NULL
        AND timestamp >= now() - INTERVAL ${TIME_RANGE}
      GROUP BY session_id
    )
  `,

  // Total sessions
  totalSessions: `
    SELECT 
      count(DISTINCT properties.$session_id) AS total_sessions
    FROM events
    WHERE 
      event = '$pageview'
      AND properties.$session_id IS NOT NULL
      AND timestamp >= now() - INTERVAL ${TIME_RANGE}
  `,
} as const;

// ============================================
// Web Vitals Queries
// ============================================

const createWebVitalsQuery = (metric: string) => `
  SELECT 
    avg(toFloat(properties.$web_vitals_${metric}_value)) AS avg_value,
    quantile(0.75)(toFloat(properties.$web_vitals_${metric}_value)) AS p75,
    quantile(0.95)(toFloat(properties.$web_vitals_${metric}_value)) AS p95,
    count() AS count
  FROM events
  WHERE 
    event = '$web_vitals'
    AND properties.$web_vitals_${metric}_value IS NOT NULL
    AND timestamp >= now() - INTERVAL ${TIME_RANGE}
`;

export const vitalsQueries = {
  lcp: createWebVitalsQuery("LCP"),
  fcp: createWebVitalsQuery("FCP"),
  cls: createWebVitalsQuery("CLS"),
  inp: createWebVitalsQuery("INP"),
} as const;

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
