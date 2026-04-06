import type { NextConfig } from "next";

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

export default nextConfig;
