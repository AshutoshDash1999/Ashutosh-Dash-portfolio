import { withPostHogConfig } from "@posthog/nextjs-config";
import type { NextConfig } from "next";
import { getPostHogApiOrigin } from "./src/lib/posthog-region";

const ONE_HOUR = 60 * 60;
const ONE_DAY = 24 * 60 * 60;
const FIVE_MINUTES = 5 * 60;

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  skipTrailingSlashRedirect: true,
  cacheComponents: true,
  cacheLife: {
    /**
     * PostHog-backed /api/stats — refresh roughly hourly, drop idle entries after a day.
     */
    stats: {
      stale: FIVE_MINUTES,
      revalidate: ONE_HOUR,
      expire: ONE_DAY,
    },
  },
};

// Upload source maps to PostHog so error-tracking frames symbolicate instead of
// resolving to minified chunks. The upload CLI needs a personal API key
// (phx_ prefix), so only enable it for that key; a differently-scoped key or
// none leaves upload off and the build still succeeds.
const posthogApiKey = process.env.POSTHOG_API_KEY;
const sourcemapsEnabled = posthogApiKey?.startsWith("phx_") ?? false;

export default withPostHogConfig(nextConfig, {
  personalApiKey: posthogApiKey ?? "",
  projectId: process.env.POSTHOG_PROJECT_ID,
  host: getPostHogApiOrigin(),
  sourcemaps: { enabled: sourcemapsEnabled },
});
