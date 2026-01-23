import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { pageQueries } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";
import type { PageviewsByDay } from "@/lib/api/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/stats/pages/views
 * Returns daily pageview counts (last 30 days)
 */
export async function GET() {
  try {
    const result = await queryPostHog<[string, number][]>(
      pageQueries.pageviewsByDay
    );

    const pageviewsByDay: PageviewsByDay[] = result.results.map(
      ([date, count]) => ({
        date,
        count,
      })
    );

    return successResponse({ pageviewsByDay });
  } catch (error) {
    console.error("Pageviews by day API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch pageviews by day data");
  }
}
