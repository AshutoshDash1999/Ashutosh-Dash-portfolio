"use server";

import { updateTag } from "next/cache";

const STATS_TAG = "stats";

/**
 * Invalidates all insights/stats cache. Call after the action to refetch client-side (e.g. SWR mutate).
 */
export async function invalidateInsightsCache(): Promise<void> {
  updateTag(STATS_TAG);
}
