import type { NextRequest } from "next/server";
import { getCachedResumeButtonClicks } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";
import { parseInsightsPeriodParam } from "@/lib/api/stats-days";

/**
 * GET /api/stats/resume-clicks?days=7|30|90|all
 * Count of `resume_button_click` custom events (hero resume CTA).
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

    const data = await getCachedResumeButtonClicks(period);
    return successResponse(data);
  } catch (error) {
    console.error("Resume clicks API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch resume click count");
  }
}
