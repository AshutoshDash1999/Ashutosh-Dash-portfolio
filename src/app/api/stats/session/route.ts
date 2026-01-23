import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { queries } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";

export const dynamic = "force-dynamic";

/**
 * GET /api/stats/session
 * Returns average session duration in seconds (last 30 days)
 */
export async function GET() {
  try {
    const result = await queryPostHog<[[number]]>(queries.avgSessionDuration);
    const avgSessionDuration = Math.round(result.results[0]?.[0] ?? 0);

    return successResponse({ avgSessionDuration });
  } catch (error) {
    console.error("Session API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch session data");
  }
}
