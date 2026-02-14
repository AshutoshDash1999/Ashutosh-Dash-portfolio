import { getCachedPageviews } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";

/**
 * GET /api/stats/pageviews
 * Returns total pageview count (last 30 days). Cached via use cache.
 */
export async function GET() {
  try {
    const data = await getCachedPageviews();
    return successResponse(data);
  } catch (error) {
    console.error("Pageviews API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch pageviews data");
  }
}
