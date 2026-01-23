import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { formatVitalsResult, vitalsQueries } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";
import type { WebVitalsMetrics } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [lcpResult, fcpResult, clsResult, ttfbResult, fidResult, inpResult] =
      await Promise.all([
        queryPostHog<[[number, number, number, number]]>(vitalsQueries.lcp),
        queryPostHog<[[number, number, number, number]]>(vitalsQueries.fcp),
        queryPostHog<[[number, number, number, number]]>(vitalsQueries.cls),
        queryPostHog<[[number, number, number, number]]>(vitalsQueries.ttfb),
        queryPostHog<[[number, number, number, number]]>(vitalsQueries.fid),
        queryPostHog<[[number, number, number, number]]>(vitalsQueries.inp),
      ]);

    const webVitals: WebVitalsMetrics = {
      lcp: formatVitalsResult(
        lcpResult.results as [[number, number, number, number]]
      ),
      fcp: formatVitalsResult(
        fcpResult.results as [[number, number, number, number]]
      ),
      cls: formatVitalsResult(
        clsResult.results as [[number, number, number, number]]
      ),
      ttfb: formatVitalsResult(
        ttfbResult.results as [[number, number, number, number]]
      ),
      fid: formatVitalsResult(
        fidResult.results as [[number, number, number, number]]
      ),
      inp: formatVitalsResult(
        inpResult.results as [[number, number, number, number]]
      ),
    };

    return successResponse(webVitals);
  } catch (error) {
    console.error("Vitals API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch web vitals data");
  }
}
