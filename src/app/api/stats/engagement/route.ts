import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { engagementQueries } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";
import type { EngagementStats } from "@/lib/api/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/stats/engagement
 * Returns engagement metrics: bounce rate, new vs returning visitors, pages per session
 */
export async function GET() {
  try {
    // Run queries individually with error handling for each
    const [bounceResult, pagesPerSessionResult, sessionsResult] =
      await Promise.all([
        queryPostHog<[[number, number, number]]>(engagementQueries.bounceRate),
        queryPostHog<[[number]]>(engagementQueries.pagesPerSession),
        queryPostHog<[[number]]>(engagementQueries.totalSessions),
      ]);

    // Parse bounce rate result
    const [bouncedSessions, totalSessionsBounce, bounceRate] =
      bounceResult.results[0] ?? [0, 0, 0];

    // Parse pages per session
    const avgPagesPerSession = pagesPerSessionResult.results[0]?.[0] ?? 0;

    // Parse total sessions
    const totalSessions = sessionsResult.results[0]?.[0] ?? totalSessionsBounce;

    // Try to get new vs returning visitors separately (this query can be slow/fail)
    let newVisitors = 0;
    let returningVisitors = 0;

    try {
      const newVsReturningResult = await queryPostHog<[string, number][]>(
        engagementQueries.newVsReturning
      );
      const newVsReturningMap = new Map<string, number>(
        newVsReturningResult.results.map(([type, count]) => [type, count])
      );
      newVisitors = newVsReturningMap.get("New") ?? 0;
      returningVisitors = newVsReturningMap.get("Returning") ?? 0;
    } catch (err) {
      console.warn("Failed to fetch new vs returning visitors:", err);
      // Continue without this data
    }

    const engagement: EngagementStats = {
      bounceRate: bounceRate ?? 0,
      totalSessions,
      bouncedSessions: bouncedSessions ?? 0,
      avgPagesPerSession,
      newVisitors,
      returningVisitors,
    };

    return successResponse(engagement);
  } catch (error) {
    console.error("Engagement API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch engagement data");
  }
}
