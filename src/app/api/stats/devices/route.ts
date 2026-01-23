import { PostHogQueryError, queryPostHog } from "@/lib/api/posthog";
import { calculatePercentage, deviceQueries } from "@/lib/api/queries";
import { errors, successResponse } from "@/lib/api/response";
import type {
    BrowserStats,
    DeviceDistribution,
    DeviceTypeStats,
    OSStats,
} from "@/lib/api/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [deviceTypeResult, browserResult, osResult] = await Promise.all([
      queryPostHog<[string, number][]>(deviceQueries.deviceTypes),
      queryPostHog<[string, number][]>(deviceQueries.browsers),
      queryPostHog<[string, number][]>(deviceQueries.operatingSystems),
    ]);

    // Calculate device distribution with percentages
    const totalDevices = deviceTypeResult.results.reduce(
      (sum, [, count]) => sum + count,
      0
    );
    const deviceTypes: DeviceTypeStats[] = deviceTypeResult.results.map(
      ([deviceType, count]) => ({
        deviceType,
        count,
        percentage: calculatePercentage(count, totalDevices),
      })
    );

    const totalBrowsers = browserResult.results.reduce(
      (sum, [, count]) => sum + count,
      0
    );
    const browsers: BrowserStats[] = browserResult.results.map(
      ([browser, count]) => ({
        browser,
        count,
        percentage: calculatePercentage(count, totalBrowsers),
      })
    );

    const totalOS = osResult.results.reduce((sum, [, count]) => sum + count, 0);
    const operatingSystems: OSStats[] = osResult.results.map(([os, count]) => ({
      os,
      count,
      percentage: calculatePercentage(count, totalOS),
    }));

    const deviceDistribution: DeviceDistribution = {
      deviceTypes,
      browsers,
      operatingSystems,
    };

    return successResponse(deviceDistribution);
  } catch (error) {
    console.error("Devices API error:", error);

    if (error instanceof PostHogQueryError) {
      return errors.posthogError(error.message);
    }

    return errors.internalError("Failed to fetch device data");
  }
}
