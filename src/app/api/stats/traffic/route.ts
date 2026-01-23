import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { trafficQueries } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";
import type { TrafficSource } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const trafficSourcesResult = await queryPostHog<[string, number][]>(
      trafficQueries.sources
    );

    const trafficSources: TrafficSource[] = trafficSourcesResult.results.map(
      ([source, visitors]) => ({
        source: source || "Direct",
        visitors,
      })
    );

    return successResponse({
      trafficSources,
    });
  } catch (error) {
    console.error("Traffic API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch traffic data");
  }
}
