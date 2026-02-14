import type { NextConfig } from "next";

// 30 days in seconds (for stats cache)
const THIRTY_DAYS = 30 * 24 * 60 * 60;
const ONE_DAY = 24 * 60 * 60;

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  skipTrailingSlashRedirect: true,
  cacheComponents: true,
  cacheLife: {
    /** Stats/insights cache: valid for 1 month, revalidate after 30 days */
    month: {
      stale: ONE_DAY, // client can use cache 1 day without rechecking
      revalidate: THIRTY_DAYS, // server revalidates every 30 days
      expire: THIRTY_DAYS, // max lifetime 30 days
    },
  },
};

export default nextConfig;
