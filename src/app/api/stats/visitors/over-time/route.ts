import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { visitorsQueries } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";
import type { VisitorsByDay } from "@/lib/api/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/stats/visitors/over-time
 * Returns daily unique visitor counts (last 30 days)
 */
export async function GET() {
  try {
    const result = await queryPostHog<[string, number][]>(
      visitorsQueries.overTime
    );

    const visitorsOverTime: VisitorsByDay[] = result.results.map(
      ([date, visitors]) => ({
        date,
        visitors,
      })
    );

    return successResponse({ visitorsOverTime });
  } catch (error) {
    console.error("Visitors over time API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch visitors over time data");
  }
}
