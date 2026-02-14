import { getCachedTopPages } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";

/**
 * GET /api/stats/pages/top
 * Returns top pages by pageview count (last 30 days). Cached via use cache.
 */
export async function GET() {
  try {
    const data = await getCachedTopPages();
    return successResponse(data);
  } catch (error) {
    console.error("Top pages API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch top pages data");
  }
}
