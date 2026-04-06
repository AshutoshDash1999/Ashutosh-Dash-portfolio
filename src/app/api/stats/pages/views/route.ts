import type { NextRequest } from "next/server";
import { getCachedPageviewsByDay } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";

const VALID_DAYS = [7, 30, 90] as const;

/**
 * GET /api/stats/pages/views
 * Returns daily pageview counts. Cached via use cache (per days value).
 * @param days - Number of days to fetch (7, 30, or 90). Default: 30
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const daysParam = searchParams.get("days");
    const days = daysParam ? Number.parseInt(daysParam, 10) : 30;

    if (!VALID_DAYS.includes(days as (typeof VALID_DAYS)[number])) {
      return errors.badRequest("Invalid days parameter. Must be 7, 30, or 90.");
    }

    const data = await getCachedPageviewsByDay(days);
    return successResponse(data);
  } catch (error) {
    console.error("Pageviews by day API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch pageviews by day data");
  }
}
