import useSWR from "swr";
import type { InsightsPeriod } from "@/lib/api/stats-days";
import type {
  BrowserStats,
  DeviceTypeStats,
  EngagementStats,
  PageviewsByDay,
  TrafficSource,
  VisitorsByCountry,
  VisitorsByDay,
  WebVitalsMetrics,
} from "@/lib/api/types";
import { fetcher } from "./fetcher";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

function statsDaysQuery(period: InsightsPeriod): string {
  return `days=${encodeURIComponent(String(period))}`;
}

// ============================================
// Response Types
// ============================================

interface PageviewsResponse {
  totalPageviews: number;
}

interface VisitorsResponse {
  uniqueVisitors: number;
}

interface SessionResponse {
  avgSessionDuration: number;
}

interface ResumeButtonClicksResponse {
  count: number;
}

interface CountriesResponse {
  visitorsByCountry: VisitorsByCountry[];
}

interface DevicesResponse {
  deviceTypes: DeviceTypeStats[];
  browsers: BrowserStats[];
}

interface TrafficResponse {
  trafficSources: TrafficSource[];
}

interface VisitorsOverTimeResponse {
  visitorsOverTime: VisitorsByDay[];
  period: InsightsPeriod;
}

interface PageviewsOverTimeResponse {
  pageviewsByDay: PageviewsByDay[];
  period: InsightsPeriod;
}

// ============================================
// Hooks
// ============================================

export function usePageviews(period: InsightsPeriod) {
  const { data, error, isLoading } = useSWR<PageviewsResponse>(
    `/api/stats/pageviews?${statsDaysQuery(period)}`,
    fetcher,
    swrOptions,
  );

  return {
    totalPageviews: data?.totalPageviews,
    pageviewsError: error,
    isPageviewsLoading: isLoading,
  };
}

export function useVisitors(period: InsightsPeriod) {
  const { data, error, isLoading } = useSWR<VisitorsResponse>(
    `/api/stats/visitors?${statsDaysQuery(period)}`,
    fetcher,
    swrOptions,
  );

  return {
    uniqueVisitors: data?.uniqueVisitors,
    visitorsError: error,
    isVisitorsLoading: isLoading,
  };
}

export function useSession(period: InsightsPeriod) {
  const { data, error, isLoading } = useSWR<SessionResponse>(
    `/api/stats/session?${statsDaysQuery(period)}`,
    fetcher,
    swrOptions,
  );

  return {
    avgSessionDuration: data?.avgSessionDuration,
    sessionError: error,
    isSessionLoading: isLoading,
  };
}

export function useResumeButtonClicks(period: InsightsPeriod) {
  const { data, error, isLoading } = useSWR<ResumeButtonClicksResponse>(
    `/api/stats/resume-clicks?${statsDaysQuery(period)}`,
    fetcher,
    swrOptions,
  );

  return {
    resumeButtonClicks: data?.count,
    resumeClicksError: error,
    isResumeClicksLoading: isLoading,
  };
}

export function useCountries(period: InsightsPeriod) {
  const { data, error, isLoading } = useSWR<CountriesResponse>(
    `/api/stats/visitors/countries?${statsDaysQuery(period)}`,
    fetcher,
    swrOptions,
  );

  return {
    visitorsByCountry: data?.visitorsByCountry,
    countriesError: error,
    isCountriesLoading: isLoading,
  };
}

export function useDevices(period: InsightsPeriod) {
  const { data, error, isLoading } = useSWR<DevicesResponse>(
    `/api/stats/devices?${statsDaysQuery(period)}`,
    fetcher,
    swrOptions,
  );

  return {
    deviceTypes: data?.deviceTypes,
    browsers: data?.browsers,
    devicesError: error,
    isDevicesLoading: isLoading,
  };
}

export function useTraffic() {
  const { data, error, isLoading } = useSWR<TrafficResponse>(
    "/api/stats/traffic",
    fetcher,
    swrOptions,
  );

  return {
    trafficSources: data?.trafficSources,
    trafficError: error,
    isTrafficLoading: isLoading,
  };
}

export function useVitals(period: InsightsPeriod) {
  const { data, error, isLoading } = useSWR<WebVitalsMetrics>(
    `/api/stats/vitals?${statsDaysQuery(period)}`,
    fetcher,
    swrOptions,
  );

  return {
    vitals: data,
    vitalsError: error,
    isVitalsLoading: isLoading,
  };
}

export function useEngagement(period: InsightsPeriod) {
  const { data, error, isLoading } = useSWR<EngagementStats>(
    `/api/stats/engagement?${statsDaysQuery(period)}`,
    fetcher,
    swrOptions,
  );

  return {
    engagement: data,
    engagementError: error,
    isEngagementLoading: isLoading,
  };
}

/**
 * Fetch visitors over time (daily counts)
 */
export function useVisitorsOverTime(period: InsightsPeriod) {
  const { data, error, isLoading } = useSWR<VisitorsOverTimeResponse>(
    `/api/stats/visitors/over-time?${statsDaysQuery(period)}`,
    fetcher,
    swrOptions,
  );

  return {
    visitorsOverTime: data?.visitorsOverTime,
    visitorsOverTimeError: error,
    isVisitorsOverTimeLoading: isLoading,
  };
}

/**
 * Fetch pageviews over time (daily counts)
 */
export function usePageviewsOverTime(period: InsightsPeriod) {
  const { data, error, isLoading } = useSWR<PageviewsOverTimeResponse>(
    `/api/stats/pages/views?${statsDaysQuery(period)}`,
    fetcher,
    swrOptions,
  );

  return {
    pageviewsByDay: data?.pageviewsByDay,
    pageviewsOverTimeError: error,
    isPageviewsOverTimeLoading: isLoading,
  };
}
