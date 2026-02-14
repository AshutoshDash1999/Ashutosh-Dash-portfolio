import { getCachedVisitors } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";

/**
 * GET /api/stats/visitors
 * Returns total unique visitor count (last 30 days). Cached via use cache.
 */
export async function GET() {
  try {
    const data = await getCachedVisitors();
    return successResponse(data);
  } catch (error) {
    console.error("Visitors API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch visitors data");
  }
}
