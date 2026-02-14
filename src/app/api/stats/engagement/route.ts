import { getCachedEngagement } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";

/**
 * GET /api/stats/engagement
 * Returns engagement metrics: bounce rate, new vs returning visitors, pages per session. Cached via use cache.
 */
export async function GET() {
  try {
    const data = await getCachedEngagement();
    return successResponse(data);
  } catch (error) {
    console.error("Engagement API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch engagement data");
  }
}
