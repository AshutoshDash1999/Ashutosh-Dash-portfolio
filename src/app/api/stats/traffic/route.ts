import { getCachedTraffic } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";

/**
 * GET /api/stats/traffic
 * Returns traffic sources. Cached via use cache.
 */
export async function GET() {
  try {
    const data = await getCachedTraffic();
    return successResponse(data);
  } catch (error) {
    console.error("Traffic API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch traffic data");
  }
}
