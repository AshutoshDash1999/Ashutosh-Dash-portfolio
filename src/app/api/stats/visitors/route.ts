import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { queries } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";

export const dynamic = "force-dynamic";

/**
 * GET /api/stats/visitors
 * Returns total unique visitor count (last 30 days)
 */
export async function GET() {
  try {
    const result = await queryPostHog<[[number]]>(queries.uniqueVisitors);
    const uniqueVisitors = result.results[0]?.[0] ?? 0;

    return successResponse({ uniqueVisitors });
  } catch (error) {
    console.error("Visitors API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch visitors data");
  }
}
