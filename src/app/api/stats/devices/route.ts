import { getCachedDevices } from "@/lib/api/cached-stats";
import { PostHogQueryError } from "@/lib/api/posthog";
import { errors, successResponse } from "@/lib/api/response";

/**
 * GET /api/stats/devices
 * Returns device/browser/OS distribution. Cached via use cache.
 */
export async function GET() {
  try {
    const data = await getCachedDevices();
    return successResponse(data);
  } catch (error) {
    console.error("Devices API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch device data");
  }
}
