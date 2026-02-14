import { getCachedVitals } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";

/**
 * GET /api/stats/vitals
 * Returns web vitals (LCP, FCP, CLS, INP). Cached via use cache.
 */
export async function GET() {
  try {
    const data = await getCachedVitals();
    return successResponse(data);
  } catch (error) {
    console.error("Vitals API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch web vitals data");
  }
}
