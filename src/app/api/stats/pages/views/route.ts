import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { getPageviewsByDayQuery } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";
import type { PageviewsByDay } from "@/lib/api/types";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const VALID_DAYS = [7, 30, 90] as const;

/**
 * GET /api/stats/pages/views
 * Returns daily pageview counts
 * @param days - Number of days to fetch (7, 30, or 90). Default: 30
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const daysParam = searchParams.get("days");
    const days = daysParam ? Number.parseInt(daysParam, 10) : 30;

    // Validate days parameter
    if (!VALID_DAYS.includes(days as (typeof VALID_DAYS)[number])) {
      return errors.badRequest("Invalid days parameter. Must be 7, 30, or 90.");
    }

    const result = await queryPostHog<[string, number][]>(
      getPageviewsByDayQuery(days)
    );

    const pageviewsByDay: PageviewsByDay[] = result.results.map(
      ([date, count]) => ({
        date,
        count,
      })
    );

    return successResponse({ pageviewsByDay, days });
  } catch (error) {
    console.error("Pageviews by day API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch pageviews by day data");
  }
}
