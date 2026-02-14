import { getCachedVisitorsByCountry } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";

/**
 * GET /api/stats/visitors/countries
 * Returns visitor breakdown by country (last 30 days). Cached via use cache.
 */
export async function GET() {
  try {
    const data = await getCachedVisitorsByCountry();
    return successResponse(data);
  } catch (error) {
    console.error("Visitors by country API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch visitors by country data");
  }
}
