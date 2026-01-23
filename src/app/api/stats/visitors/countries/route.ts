import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { visitorsQueries } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";
import type { VisitorsByCountry } from "@/lib/api/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/stats/visitors/countries
 * Returns visitor breakdown by country (last 30 days)
 */
export async function GET() {
  try {
    const result = await queryPostHog<[string, string, number][]>(
      visitorsQueries.byCountry
    );

    const visitorsByCountry: VisitorsByCountry[] = result.results.map(
      ([country, countryCode, visitors]) => ({
        country,
        countryCode,
        visitors,
      })
    );

    return successResponse({ visitorsByCountry });
  } catch (error) {
    console.error("Visitors by country API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch visitors by country data");
  }
}
