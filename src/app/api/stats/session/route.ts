import { getCachedSession } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";

/**
 * GET /api/stats/session
 * Returns average session duration in seconds (last 30 days). Cached via use cache.
 */
export async function GET() {
  try {
    const data = await getCachedSession();
    return successResponse(data);
  } catch (error) {
    console.error("Session API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch session data");
  }
}
