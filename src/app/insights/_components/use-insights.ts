"use client";

import useSWR from "swr";
import type { ApiResponse } from "@/lib/api-response";
import type {
  BreakdownItem,
  MultiSeriesItem,
  TimeSeriesPoint,
} from "@/lib/posthog";

export type StatResponse = {
  value: number | null;
  formatted?: string | null;
};

export type InsightResult<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = (await res.json().catch(() => null)) as ApiResponse<T> | null;
  if (body === null || typeof body.success !== "boolean") {
    throw new Error(`Request failed for ${url} (HTTP ${res.status})`);
  }
  if (!body.success) {
    throw new Error(body.error.message);
  }
  return body.data;
}

function useInsight<T>(endpoint: string): InsightResult<T> {
  const { data, error, isLoading } = useSWR<T>(endpoint, fetchJson, swrOptions);
  return { data, isLoading, error };
}

export function useStat(endpoint: string): InsightResult<StatResponse> {
  return useInsight<StatResponse>(endpoint);
}

export function useTimeSeries(
  endpoint: string,
): InsightResult<TimeSeriesPoint[]> {
  return useInsight<TimeSeriesPoint[]>(endpoint);
}

export function useBreakdown(
  endpoint: string,
): InsightResult<(BreakdownItem | MultiSeriesItem)[]> {
  return useInsight<(BreakdownItem | MultiSeriesItem)[]>(endpoint);
}

export function useMultiSeries(
  endpoint: string,
): InsightResult<MultiSeriesItem[]> {
  return useInsight<MultiSeriesItem[]>(endpoint);
}

/**
 * Normalizes breakdown responses: multi-series items (e.g. portfolio
 * interactions) collapse to their summed total per series.
 */
export function toBreakdownItems(
  items: (BreakdownItem | MultiSeriesItem)[] | undefined,
): { label: string; value: number }[] {
  return (items ?? []).map((item) =>
    "data" in item
      ? {
          label: String(item.label),
          value: item.data.reduce((sum, point) => sum + point.value, 0),
        }
      : { label: String(item.label), value: item.value },
  );
}
