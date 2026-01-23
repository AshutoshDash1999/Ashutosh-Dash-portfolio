import { successResponse } from "@/lib/api/response";

export const dynamic = "force-dynamic";

/**
 * GET /api/stats
 * Returns available endpoints for stats API
 */
export async function GET() {
  return successResponse({
    endpoints: {
      pageviews: "/api/stats/pageviews",
      visitors: "/api/stats/visitors",
      visitorsOverTime: "/api/stats/visitors/over-time",
      visitorsByCountry: "/api/stats/visitors/countries",
      session: "/api/stats/session",
      traffic: "/api/stats/traffic",
      devices: "/api/stats/devices",
      pageviewsByDay: "/api/stats/pages/views",
      topPages: "/api/stats/pages/top",
      vitals: "/api/stats/vitals",
      engagement: "/api/stats/engagement",
    },
  });
}
