import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { pageQueries } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";
import type { TopPage } from "@/lib/api/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/stats/pages/top
 * Returns top pages by pageview count (last 30 days)
 */
export async function GET() {
  try {
    const result = await queryPostHog<[string, number][]>(pageQueries.topPages);

    const topPages: TopPage[] = result.results.map(([pathname, count]) => ({
      pathname,
      count,
    }));

    return successResponse({ topPages });
  } catch (error) {
    console.error("Top pages API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch top pages data");
  }
}
