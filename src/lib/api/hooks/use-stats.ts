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
import useSWR from "swr";
import { fetcher } from "./fetcher";

const swrOptions = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

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
    days: number;
}

interface PageviewsOverTimeResponse {
    pageviewsByDay: PageviewsByDay[];
    days: number;
}

// ============================================
// Hooks
// ============================================

/**
 * Fetch total pageviews (last 30 days)
 */
export function usePageviews() {
    const { data, error, isLoading } = useSWR<PageviewsResponse>(
        "/api/stats/pageviews",
        fetcher,
        swrOptions
    );

    return {
        totalPageviews: data?.totalPageviews,
        pageviewsError: error,
        isPageviewsLoading: isLoading,
    };
}

/**
 * Fetch unique visitors (last 30 days)
 */
export function useVisitors() {
    const { data, error, isLoading } = useSWR<VisitorsResponse>(
        "/api/stats/visitors",
        fetcher,
        swrOptions
    );

    return {
        uniqueVisitors: data?.uniqueVisitors,
        visitorsError: error,
        isVisitorsLoading: isLoading,
    };
}

/**
 * Fetch session data (avg duration)
 */
export function useSession() {
    const { data, error, isLoading } = useSWR<SessionResponse>(
        "/api/stats/session",
        fetcher,
        swrOptions
    );

    return {
        avgSessionDuration: data?.avgSessionDuration,
        sessionError: error,
        isSessionLoading: isLoading,
    };
}

/**
 * Fetch visitors by country
 */
export function useCountries() {
    const { data, error, isLoading } = useSWR<CountriesResponse>(
        "/api/stats/visitors/countries",
        fetcher,
        swrOptions
    );

    return {
        visitorsByCountry: data?.visitorsByCountry,
        countriesError: error,
        isCountriesLoading: isLoading,
    };
}

/**
 * Fetch device distribution (device types and browsers)
 */
export function useDevices() {
    const { data, error, isLoading } = useSWR<DevicesResponse>(
        "/api/stats/devices",
        fetcher,
        swrOptions
    );

    return {
        deviceTypes: data?.deviceTypes,
        browsers: data?.browsers,
        devicesError: error,
        isDevicesLoading: isLoading,
    };
}

/**
 * Fetch traffic sources
 */
export function useTraffic() {
    const { data, error, isLoading } = useSWR<TrafficResponse>(
        "/api/stats/traffic",
        fetcher,
        swrOptions
    );

    return {
        trafficSources: data?.trafficSources,
        trafficError: error,
        isTrafficLoading: isLoading,
    };
}

/**
 * Fetch web vitals metrics
 */
export function useVitals() {
    const { data, error, isLoading } = useSWR<WebVitalsMetrics>(
        "/api/stats/vitals",
        fetcher,
        swrOptions
    );

    return {
        vitals: data,
        vitalsError: error,
        isVitalsLoading: isLoading,
    };
}

/**
 * Fetch engagement stats
 */
export function useEngagement() {
    const { data, error, isLoading } = useSWR<EngagementStats>(
        "/api/stats/engagement",
        fetcher,
        swrOptions
    );

    return {
        engagement: data,
        engagementError: error,
        isEngagementLoading: isLoading,
    };
}

/**
 * Fetch visitors over time (daily counts)
 * @param days - Number of days (7, 30, or 90)
 */
export function useVisitorsOverTime(days: number = 30) {
    const { data, error, isLoading } = useSWR<VisitorsOverTimeResponse>(
        `/api/stats/visitors/over-time?days=${days}`,
        fetcher,
        swrOptions
    );

    return {
        visitorsOverTime: data?.visitorsOverTime,
        visitorsOverTimeError: error,
        isVisitorsOverTimeLoading: isLoading,
    };
}

/**
 * Fetch pageviews over time (daily counts)
 * @param days - Number of days (7, 30, or 90)
 */
export function usePageviewsOverTime(days: number = 30) {
    const { data, error, isLoading } = useSWR<PageviewsOverTimeResponse>(
        `/api/stats/pages/views?days=${days}`,
        fetcher,
        swrOptions
    );

    return {
        pageviewsByDay: data?.pageviewsByDay,
        pageviewsOverTimeError: error,
        isPageviewsOverTimeLoading: isLoading,
    };
}
