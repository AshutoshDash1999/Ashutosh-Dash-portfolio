// ============================================
// API Response Types
// ============================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================
// PostHog Query Types
// ============================================

export interface PostHogQueryPayload {
  query: {
    kind: "HogQLQuery";
    query: string;
  };
}

export interface PostHogQueryResult<T = unknown[][]> {
  results: T;
  columns?: string[];
  types?: string[];
  hogql?: string;
  hasMore?: boolean;
  limit?: number;
  offset?: number;
}

export interface PostHogErrorResponse {
  type: string;
  code: string;
  detail: string;
}

// ============================================
// Stats Types
// ============================================

export interface PageviewsByDay {
  date: string;
  count: number;
}

export interface VisitorsByDay {
  date: string;
  visitors: number;
}

export interface TopPage {
  pathname: string;
  count: number;
}

export interface EventCount {
  event: string;
  count: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
}

export interface VisitorsByCountry {
  country: string;
  countryCode: string;
  visitors: number;
}

export interface DeviceTypeStats {
  deviceType: string;
  count: number;
  percentage: number;
}

export interface BrowserStats {
  browser: string;
  count: number;
  percentage: number;
}

export interface OSStats {
  os: string;
  count: number;
  percentage: number;
}

export interface DeviceDistribution {
  deviceTypes: DeviceTypeStats[];
  browsers: BrowserStats[];
  operatingSystems: OSStats[];
}

export interface WebVitalsMetrics {
  lcp: { avg: number; p75: number; p95: number; count: number };
  fcp: { avg: number; p75: number; p95: number; count: number };
  cls: { avg: number; p75: number; p95: number; count: number };
  inp: { avg: number; p75: number; p95: number; count: number };
}

export interface EngagementStats {
  bounceRate: number;
  totalSessions: number;
  bouncedSessions: number;
  avgPagesPerSession: number;
  newVisitors: number;
  returningVisitors: number;
}

export interface StatsOverview {
  totalPageviews: number;
  uniqueVisitors: number;
  avgSessionDuration: number; // in seconds
  topPages: TopPage[];
  pageviewsByDay: PageviewsByDay[];
  visitorsOverTime: VisitorsByDay[];
  trafficSources: TrafficSource[];
  visitorsByCountry: VisitorsByCountry[];
  deviceDistribution: DeviceDistribution;
  webVitals: WebVitalsMetrics;
}
