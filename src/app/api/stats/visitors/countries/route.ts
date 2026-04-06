import type { NextRequest } from "next/server";
import { getCachedVisitorsByCountry } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";
import { parseInsightsPeriodParam } from "@/lib/api/stats-days";

/**
 * GET /api/stats/visitors/countries?days=7|30|90
 * Returns visitor breakdown by country for the rolling window. Cached via use cache.
 */
export async function GET(request: NextRequest) {
  try {
    const period = parseInsightsPeriodParam(
      request.nextUrl.searchParams.get("days"),
    );
    if (period === null) {
      return errors.badRequest(
        "Invalid days parameter. Must be 7, 30, 90, or all.",
      );
    }

    const data = await getCachedVisitorsByCountry(period);
    return successResponse(data);
  } catch (error) {
    console.error("Visitors by country API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch visitors by country data");
  }
}
